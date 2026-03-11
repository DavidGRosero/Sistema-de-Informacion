@echo off
echo Iniciando Sistema PYMES...

REM Abrir el login en el navegador
start "" "%~dp0frontend-pymes\login.html"

REM Cambiar al directorio del backend
cd /d "%~dp0backend"

REM Ejecutar el servidor
node server.js
