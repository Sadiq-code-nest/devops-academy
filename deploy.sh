#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════
#  DevOps Academy — Fast Deployment Script
#  Usage: ./deploy.sh [dev|prod] [--clean]
#  Author: Mohammad Arif · DevOps Academy
# ═══════════════════════════════════════════════════════════

set -euo pipefail

# ── Colour helpers ──────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
BLUE='\033[0;34m'; CYAN='\033[0;36m'; BOLD='\033[1m'; NC='\033[0m'

log_info()    { echo -e "${CYAN}[INFO]${NC}  $(date '+%H:%M:%S') $*"; }
log_success() { echo -e "${GREEN}[OK]${NC}    $(date '+%H:%M:%S') $*"; }
log_warn()    { echo -e "${YELLOW}[WARN]${NC}  $(date '+%H:%M:%S') $*"; }
log_error()   { echo -e "${RED}[ERROR]${NC} $(date '+%H:%M:%S') $*" >&2; }
die()         { log_error "$*"; exit 1; }

# ── Banner ──────────────────────────────────────────────────
print_banner() {
  echo -e "${BLUE}${BOLD}"
  echo "  ██████╗ ███████╗██╗   ██╗ ██████╗ ██████╗ ███████╗"
  echo "  ██╔══██╗██╔════╝██║   ██║██╔═══██╗██╔══██╗██╔════╝"
  echo "  ██║  ██║█████╗  ██║   ██║██║   ██║██████╔╝███████╗"
  echo "  ██║  ██║██╔══╝  ╚██╗ ██╔╝██║   ██║██╔═══╝ ╚════██║"
  echo "  ██████╔╝███████╗ ╚████╔╝ ╚██████╔╝██║     ███████║"
  echo "  ╚═════╝ ╚══════╝  ╚═══╝   ╚═════╝ ╚═╝     ╚══════╝"
  echo -e "${CYAN}                    Academy — Zero to Production${NC}"
  echo ""
}

# ── Config & Defaults ───────────────────────────────────────
ENV="${1:-dev}"
CLEAN="${2:-}"
APP_NAME="devops-academy"
APP_PORT="${APP_PORT:-8080}"
LOG_DIR="./logs"
LOG_FILE="${LOG_DIR}/deploy-$(date '+%Y%m%d-%H%M%S').log"
CONTAINER_NAME="${APP_NAME}-${ENV}"

# Load .env if present
if [[ -f ".env.${ENV}" ]]; then
  log_info "Loading environment: .env.${ENV}"
  set -a; source ".env.${ENV}"; set +a
elif [[ -f ".env" ]]; then
  log_info "Loading environment: .env"
  set -a; source ".env"; set +a
else
  log_warn "No .env file found — using defaults"
fi

# ── Validation ──────────────────────────────────────────────
validate_env() {
  [[ "$ENV" =~ ^(dev|prod|staging)$ ]] || \
    die "Invalid environment: '$ENV'. Use: dev | prod | staging"
  log_info "Environment: ${BOLD}${ENV}${NC}"
}

# ── Dependency check ────────────────────────────────────────
check_deps() {
  log_info "Checking dependencies..."
  local missing=()
  for cmd in docker node npm; do
    if ! command -v "$cmd" &>/dev/null; then
      missing+=("$cmd")
    fi
  done
  if [[ ${#missing[@]} -gt 0 ]]; then
    log_warn "Missing tools: ${missing[*]}"
    log_info "Installing Node.js via nvm (if available)..."
    if command -v nvm &>/dev/null; then
      nvm install --lts
    else
      log_warn "nvm not found — install Node.js manually: https://nodejs.org"
    fi
  fi
  log_success "Dependency check passed"
}

# ── Setup ────────────────────────────────────────────────────
setup_dirs() {
  mkdir -p "$LOG_DIR"
  log_info "Log directory: $LOG_DIR"
}

# ── Clean ────────────────────────────────────────────────────
clean_environment() {
  if [[ "$CLEAN" == "--clean" ]]; then
    log_warn "Clean mode: removing old containers and images..."
    docker rm -f "$CONTAINER_NAME" 2>/dev/null && log_info "Removed container: $CONTAINER_NAME" || true
    docker rmi "${APP_NAME}:${ENV}" 2>/dev/null && log_info "Removed image: ${APP_NAME}:${ENV}" || true
    log_success "Clean complete"
  fi
}

# ── Docker-based run (preferred) ─────────────────────────────
run_docker() {
  local image_tag="${APP_NAME}:${ENV}"

  log_info "Building Docker image: $image_tag"
  docker build \
    --build-arg ENV="$ENV" \
    --build-arg PORT="$APP_PORT" \
    -t "$image_tag" \
    -f Dockerfile . \
    | tee -a "$LOG_FILE"

  # Stop any existing container
  docker rm -f "$CONTAINER_NAME" 2>/dev/null || true

  log_info "Starting container: $CONTAINER_NAME on port $APP_PORT"
  docker run -d \
    --name "$CONTAINER_NAME" \
    --restart unless-stopped \
    -p "${APP_PORT}:80" \
    -e NODE_ENV="$ENV" \
    --health-cmd="curl -fs http://localhost/health || exit 1" \
    --health-interval=15s \
    --health-timeout=5s \
    --health-retries=3 \
    "$image_tag" \
    | tee -a "$LOG_FILE"

  log_success "Container started: $CONTAINER_NAME"
  log_info "Waiting for health check..."
  sleep 3

  # Quick health probe
  if curl -fs "http://localhost:${APP_PORT}/health" &>/dev/null; then
    log_success "Health check passed ✓"
  else
    log_warn "Health check pending — app may still be starting"
  fi
}

# ── Native Node.js run (fallback) ────────────────────────────
run_native() {
  log_info "Installing npm dependencies..."
  npm ci --prefer-offline 2>&1 | tee -a "$LOG_FILE" || npm install 2>&1 | tee -a "$LOG_FILE"

  log_info "Starting application (native)..."
  if [[ "$ENV" == "prod" ]]; then
    NODE_ENV=production npm start 2>&1 | tee -a "$LOG_FILE"
  else
    NODE_ENV=development npm run dev 2>&1 | tee -a "$LOG_FILE"
  fi
}

# ── Print summary ────────────────────────────────────────────
print_summary() {
  echo ""
  echo -e "${GREEN}${BOLD}═══════════════════════════════════════${NC}"
  echo -e "${GREEN}${BOLD}  ✓  DEPLOYMENT SUCCESSFUL${NC}"
  echo -e "${GREEN}${BOLD}═══════════════════════════════════════${NC}"
  echo -e "  ${CYAN}URL:${NC}         http://localhost:${APP_PORT}"
  echo -e "  ${CYAN}Health:${NC}      http://localhost:${APP_PORT}/health"
  echo -e "  ${CYAN}Environment:${NC} ${ENV}"
  echo -e "  ${CYAN}Container:${NC}   ${CONTAINER_NAME}"
  echo -e "  ${CYAN}Logs:${NC}        ${LOG_FILE}"
  echo -e "  ${CYAN}View logs:${NC}   docker logs -f ${CONTAINER_NAME}"
  echo ""
}

# ── Trap errors ──────────────────────────────────────────────
trap 'log_error "Deployment failed at line $LINENO. See: $LOG_FILE"' ERR

# ── Main ─────────────────────────────────────────────────────
main() {
  print_banner
  validate_env
  setup_dirs
  check_deps
  clean_environment

  if command -v docker &>/dev/null; then
    run_docker
  else
    log_warn "Docker not found — falling back to native Node.js"
    run_native
  fi

  print_summary
}

main "$@"
