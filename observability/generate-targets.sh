#!/bin/sh
# Regenerates the Prometheus file_sd target list from .env
# Run this before every `docker compose up` on the monitoring server.
set -e
. ./.env

cat > ./prometheus/targets/node-exporter.json << TARGETS
[
  {
    "targets": ["${APP_SERVER_IP}:9100"]
  }
]
TARGETS

echo "Wrote target: ${APP_SERVER_IP}:9100"
