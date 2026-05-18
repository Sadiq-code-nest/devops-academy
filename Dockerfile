# ── Stage 1: Builder ────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --prefer-offline 2>/dev/null || npm install || true
COPY . .
RUN npm run build 2>/dev/null || true

# ── Stage 2: Production (Nginx) ─────────────────────────────
FROM nginx:1.27-alpine
LABEL maintainer="sadiqaws24"

RUN apk add --no-cache curl \
    && rm -rf /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d/app.conf
COPY --from=builder /app/dist /usr/share/nginx/html 2>/dev/null || true
COPY index.html style.css main.js /usr/share/nginx/html/

RUN chown -R nginx:nginx /usr/share/nginx/html \
    && chown -R nginx:nginx /var/cache/nginx /var/log/nginx \
    && touch /var/run/nginx.pid && chown nginx:nginx /var/run/nginx.pid

USER nginx
EXPOSE 8080

HEALTHCHECK --interval=15s --timeout=5s --retries=3 \
    CMD curl -fs http://localhost:8080/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
