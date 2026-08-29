@echo off
TITLE ALARICUS B2B Acquisition Swarm (OpenClaw)
cls
echo ======================================================
echo    ALARICUS B2B AUTONOMOUS SWARM (OPENCLAW / DOMINUSBABEL)
echo    Dual-Pipeline: Web Directa + VAREGO Social & Ads
echo ======================================================
echo.

if not exist node_modules (
    echo [INFO] Instalando dependencias de Node.js...
    call npm install
)

echo [INFO] Iniciando servidor autonomo de WhatsApp ALARICUS...
node src\alaricus-bot.js
pause
