@echo off
TITLE Buque B2B WhatsApp Swarm (OpenClaw)
cls
echo ======================================================
echo    BUQUE B2B AUTONOMOUS SWARM (OPENCLAW / DOMINUSBABEL)
echo ======================================================
echo.

if not exist node_modules (
    echo [INFO] Instalando dependencias de Node.js...
    call npm install
)

echo [INFO] Iniciando servidor autonomo de WhatsApp y motor de adquisicion...
node src\buque-whatsapp-bot.js
pause
