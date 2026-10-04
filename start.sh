#!/bin/sh
set -eu
cd "$(dirname "$0")"
export FASTAPI_URL="http://127.0.0.1:${PORT:-8000}"

# Run both processes on Render's native runtime or in Docker.
python main.py &
api_pid=$!
bridge_pid=
cleanup() {
  kill "$api_pid" ${bridge_pid:+"$bridge_pid"} 2>/dev/null || true
  wait "$api_pid" ${bridge_pid:+"$bridge_pid"} 2>/dev/null || true
}
trap cleanup EXIT
trap 'exit 0' INT TERM

# Wait up to 30s for FastAPI to be ready before starting bridge
for i in $(seq 30); do
  kill -0 "$api_pid" 2>/dev/null || exit 1
  curl -sf --max-time 2 "$FASTAPI_URL/health" > /dev/null 2>&1 && break
  sleep 1
done

curl -sf --max-time 2 "$FASTAPI_URL/health" > /dev/null || exit 1
node whatsapp_bridge.js &
bridge_pid=$!

# Exit if either process dies so Render restarts the whole service.
while kill -0 "$api_pid" 2>/dev/null && kill -0 "$bridge_pid" 2>/dev/null; do
  sleep 1
done
exit 1
