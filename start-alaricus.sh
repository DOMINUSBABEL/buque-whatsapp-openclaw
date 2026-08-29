#!/usr/bin/env bash
echo "======================================================"
echo "   ALARICUS B2B AUTONOMOUS SWARM (OPENCLAW / DOMINUSBABEL)"
echo "   Dual-Pipeline: Web Directa + VAREGO Social & Ads"
echo "======================================================"
echo ""

if [ ! -d "node_modules" ]; then
    echo "[INFO] Instalando dependencias de Node.js..."
    npm install
fi

echo "[INFO] Iniciando servidor autonomo de WhatsApp ALARICUS..."
node src/alaricus-bot.js
