#!/usr/bin/env bash
echo "======================================================"
echo "   BUQUE B2B AUTONOMOUS SWARM (OPENCLAW / DOMINUSBABEL)"
echo "======================================================"

if [ ! -d "node_modules" ]; then
    echo "[INFO] Installing dependencies..."
    npm install
fi

echo "[INFO] Launching Buque B2B server..."
node src/buque-whatsapp-bot.js
