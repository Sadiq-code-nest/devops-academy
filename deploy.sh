#!/usr/bin/env bash
# setup.sh — one-command bootstrap for devops-academy-MERN.
# Run this once after cloning the repo: ./setup.sh
set -euo pipefail
cd "$(dirname "$0")"

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'
info() { echo -e "${BLUE}==>${NC} $1"; }
ok()   { echo -e "${GREEN}✔${NC} $1"; }
warn() { echo -e "${YELLOW}!${NC} $1"; }
fail() { echo -e "${RED}✘ $1${NC}"; exit 1; }

echo ""
echo "========================================"
echo " DevOps Academy — automated setup"
echo "========================================"
echo ""

# ---------- 0. sanity checks ----------
command -v docker >/dev/null 2>&1 || fail "Docker is not installed. Install it first: https://docs.docker.com/engine/install/"
docker compose version >/dev/null 2>&1 || fail "Docker Compose plugin not found. Install docker-compose-plugin."
command -v openssl >/dev/null 2>&1 || fail "openssl is required to generate secrets and isn't installed."

# ---------- 1. detect and confirm host IP ----------
DETECTED_IP=$(hostname -I 2>/dev/null | awk '{print $1}')
[[ -z "$DETECTED_IP" ]] && DETECTED_IP=$(ip route get 1.1.1.1 2>/dev/null | grep -oP 'src \K\S+' || true)
[[ -z "$DETECTED_IP" ]] && DETECTED_IP="127.0.0.1"

read -rp "$(echo -e ${BLUE}?${NC}) Server IP address this app should be reachable at [${DETECTED_IP}]: " HOST_IP
HOST_IP="${HOST_IP:-$DETECTED_IP}"
ok "Using IP: ${HOST_IP}"

# ---------- 2. admin email (required — reset codes are sent here) ----------
while true; do
  read -rp "$(echo -e ${BLUE}?${NC}) Admin email address (for login + password-reset codes): " ADMIN_EMAIL
  [[ "$ADMIN_EMAIL" =~ ^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$ ]] && break
  warn "That doesn't look like a valid email — try again."
done

# ---------- 3. optional SMTP (skip = forgot-password won't send emails yet) ----------
echo ""
info "SMTP settings (optional — press Enter to skip all and configure later in backend/.env)"
read -rp "$(echo -e ${BLUE}?${NC}) SMTP host (e.g. smtp.gmail.com): " SMTP_HOST
if [[ -n "$SMTP_HOST" ]]; then
  read -rp "$(echo -e ${BLUE}?${NC}) SMTP port [587]: " SMTP_PORT
  SMTP_PORT="${SMTP_PORT:-587}"
  read -rp "$(echo -e ${BLUE}?${NC}) SMTP username: " SMTP_USER
  read -rsp "$(echo -e ${BLUE}?${NC}) SMTP password: " SMTP_PASS
  echo ""
else
  SMTP_PORT=587; SMTP_USER=""; SMTP_PASS=""
  warn "Skipped — password reset emails won't send until you fill SMTP_* in backend/.env"
fi

# ---------- 4. auto-generate everything else ----------
info "Generating secrets..."
MONGO_USER="root"
MONGO_PASS=$(openssl rand -hex 16)
JWT_SECRET=$(openssl rand -hex 48)
ADMIN_USERNAME="admin"
ADMIN_PASSWORD=$(openssl rand -base64 18 | tr -d '=+/' | cut -c1-16)
ok "Secrets generated"

# ---------- 5. write backend/.env ----------
mkdir -p backend frontend
cat > backend/.env << EOF
PORT=5000
NODE_ENV=production
CLIENT_URL=http://${HOST_IP}:8080

MONGO_INITDB_ROOT_USERNAME=${MONGO_USER}
MONGO_INITDB_ROOT_PASSWORD=${MONGO_PASS}
MONGO_URI=mongodb://${MONGO_USER}:${MONGO_PASS}@mongo:27017/devops_academy?authSource=admin

JWT_SECRET=${JWT_SECRET}

ADMIN_USERNAME=${ADMIN_USERNAME}
ADMIN_PASSWORD=${ADMIN_PASSWORD}

SMTP_HOST=${SMTP_HOST}
SMTP_PORT=${SMTP_PORT}
SMTP_USER=${SMTP_USER}
SMTP_PASS=${SMTP_PASS}
SMTP_FROM=${SMTP_USER}
EOF
ok "Wrote backend/.env"

# ---------- 6. write frontend/.env ----------
cat > frontend/.env << EOF
VITE_API_URL=http://${HOST_IP}:5000/api
EOF
ok "Wrote frontend/.env"

# ---------- 7. patch the IP into docker-compose.yml's build arg ----------
[[ -f docker-compose.yml ]] || fail "docker-compose.yml not found — run this from the repo root."
sed -i -E "s#VITE_API_URL: \"http://[^\"]+\"#VITE_API_URL: \"http://${HOST_IP}:5000/api\"#" docker-compose.yml
ok "Updated docker-compose.yml build-arg to match ${HOST_IP}"

# ---------- 8. port pre-flight check ----------
for port in 5000 8080; do
  if sudo ss -ltnp 2>/dev/null | grep -q ":${port} "; then
    echo -e "${RED}✘ Port ${port} is already in use:${NC}"
    sudo ss -ltnp | grep ":${port} "
    fail "Free port ${port} before continuing (stop the conflicting process/service), then re-run ./setup.sh"
  fi
done
ok "Ports 5000 and 8080 are free"

# ---------- 9. clean any previous state, then build fresh ----------
info "Building and starting containers (this can take a minute on first run)..."
export COMPOSE_BAKE=false   # avoids a known bake-driver bug with some Docker Compose versions
docker compose down -v 2>/dev/null || true
docker compose build --no-cache
docker compose up -d

# ---------- 10. wait for health ----------
info "Waiting for services to report healthy..."
for i in $(seq 1 20); do
  sleep 3
  STATE=$(docker compose ps --format json 2>/dev/null || true)
  if docker compose ps | grep -q "unhealthy"; then
    warn "Something is unhealthy, checking again..."
  fi
  BACKEND_UP=$(docker compose ps backend 2>/dev/null | grep -c "healthy" || true)
  FRONTEND_UP=$(docker compose ps frontend 2>/dev/null | grep -c "healthy" || true)
  MONGO_UP=$(docker compose ps mongo 2>/dev/null | grep -c "healthy" || true)
  if [[ "$BACKEND_UP" -ge 1 && "$FRONTEND_UP" -ge 1 && "$MONGO_UP" -ge 1 ]]; then
    ok "All services healthy"
    break
  fi
  if [[ "$i" -eq 20 ]]; then
    warn "Services did not report healthy within 60s — showing status and backend logs:"
    docker compose ps
    docker compose logs backend --tail=30
  fi
done

# ---------- 11. seed the admin account (only if this is a fresh DB) ----------
info "Seeding admin account..."
if docker compose exec -T backend node seedAdmin.js "$ADMIN_USERNAME" "$ADMIN_EMAIL" "$ADMIN_PASSWORD" 2>&1 | grep -qE "created|updating"; then
  ok "Admin account ready"
else
  warn "Admin seed step reported an issue — check manually: docker compose exec backend node seedAdmin.js $ADMIN_USERNAME $ADMIN_EMAIL <password>"
fi

# ---------- 12. save credentials locally (gitignored) and print summary ----------
cat > .credentials.txt << EOF
Generated by setup.sh on $(date)
DO NOT COMMIT THIS FILE — it is already in .gitignore.

App URL:        http://${HOST_IP}:8080
API URL:        http://${HOST_IP}:5000/api

Admin login:    http://${HOST_IP}:8080/adminlogin
  Username:     ${ADMIN_USERNAME}
  Password:     ${ADMIN_PASSWORD}
  Email:        ${ADMIN_EMAIL}

Mongo root user: ${MONGO_USER}
Mongo root pass: ${MONGO_PASS}

JWT secret is stored in backend/.env (not reprinted here).
EOF
chmod 600 .credentials.txt
grep -qxF ".credentials.txt" .gitignore 2>/dev/null || echo ".credentials.txt" >> .gitignore

echo ""
echo "========================================"
ok "Setup complete"
echo "========================================"
echo ""
echo "  App:        http://${HOST_IP}:8080"
echo "  Admin login: http://${HOST_IP}:8080/adminlogin"
echo "  Username:    ${ADMIN_USERNAME}"
echo "  Password:    ${ADMIN_PASSWORD}"
echo ""
echo "  Full credentials saved to: .credentials.txt (gitignored, chmod 600)"
[[ -z "$SMTP_HOST" ]] && warn "SMTP not configured — forgot-password emails won't send until you fill SMTP_* in backend/.env and run: docker compose up -d backend"
echo ""