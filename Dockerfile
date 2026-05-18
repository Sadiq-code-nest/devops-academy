# ════════════════════════════════════════════════════
# DevOps Academy — Production Dockerfile
# Multi-stage: builder validates assets → nginx serves
# ════════════════════════════════════════════════════

# ── Stage 1: Builder (validate + copy assets) ────────
FROM alpine:3.19 AS builder

WORKDIR /app

# Copy all static assets
COPY index.html .
COPY style.css .
COPY main.js .

# Validate files exist and are non-empty
RUN echo "==> Validating assets..." && \
    [ -s index.html ] && echo "  ✓ index.html OK" || (echo "  ✗ index.html missing/empty" && exit 1) && \
    [ -s style.css ]  && echo "  ✓ style.css OK"  || (echo "  ✗ style.css missing/empty"  && exit 1) && \
    [ -s main.js ]    && echo "  ✓ main.js OK"    || (echo "  ✗ main.js missing/empty"    && exit 1) && \
    echo "==> All assets validated."

# ── Stage 2: Production image ────────────────────────
FROM nginx:1.25-alpine AS production

LABEL maintainer="DevOps Academy"
LABEL version="1.0.0"
LABEL description="DevOps Academy static site — served by Nginx"

# Remove default Nginx content
RUN rm -rf /usr/share/nginx/html/*

# Copy validated assets from builder
COPY --from=builder /app/index.html /usr/share/nginx/html/
COPY --from=builder /app/style.css  /usr/share/nginx/html/
COPY --from=builder /app/main.js    /usr/share/nginx/html/

# Copy custom Nginx config
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Security: run as non-root where possible
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

EXPOSE 80

# Health check — Jenkins/Docker will use this
HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -qO- http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
