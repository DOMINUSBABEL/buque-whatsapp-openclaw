@echo off
TITLE Buque B2B Simulator CLI
cls
echo ======================================================
echo    BUQUE B2B SWARM - CLI SIMULATOR (SANDBOX)
echo ======================================================
echo.

if not exist node_modules (
    echo [INFO] Instalando dependencias de Node.js...
    call npm install
)

node src\simulator-cli.js
pause
