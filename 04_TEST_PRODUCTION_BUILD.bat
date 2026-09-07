@echo off
setlocal
cd /d "%~dp0"
title DOC-FULL-NR - PRODUCTION TEST

if not exist "node_modules" (
  call npm.cmd install --no-audit --no-fund
  if errorlevel 1 goto :error
)

if not exist ".env.local" (
  node.exe "scripts\configure-doc-full-nr.mjs"
  if errorlevel 1 goto :error
)

call npm.cmd run build
if errorlevel 1 goto :error

start "DOC-FULL-NR PREVIEW" cmd /k "cd /d ""%CD%"" && npm.cmd run preview"
timeout /t 4 /nobreak >nul
start "" "http://localhost:4174/login"

echo.
echo PRODUCTION BUILD TEST OPENED
pause
exit /b 0

:error
echo [ERROR] Build test failed.
pause
exit /b 1
