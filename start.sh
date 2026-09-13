#!/bin/sh
# Start FastAPI first
python /app/main.py &

# Wait up to 30s for FastAPI to be ready before starting bridge
for i in $(seq 30); do
  curl -sf http://localhost:8000/health > /dev/null 2>&1 && break
  sleep 1
done

# Node bridge is foreground — Render monitors this process
# Health check catches if Python dies and triggers container restart
exec node /app/whatsapp_bridge.js
