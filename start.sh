#!/bin/sh
node /app/whatsapp_bridge.js &
exec python /app/main.py
