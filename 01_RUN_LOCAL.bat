@echo off
setlocal
cd /d "%~dp0"
title DOC-FULL-NR - LOCAL

if not exist "node_modules" (
  call npm.cmd install --no-audit --no-fund
  if errorlevel 1 goto :error
)

if not exist ".env.local" (
  node.exe "scripts\configure-doc-full-nr.mjs"
  if errorlevel 1 goto :error
)

start "DOC-FULL-NR LOCAL SERVER" cmd /k "cd /d ""%CD%"" && npm.cmd run dev"
timeout /t 4 /nobreak >nul
start "" "http://localhost:5174/login"
exit /b 0

:error
echo [ERROR] Could not start local website.
pause
exit /b 1
