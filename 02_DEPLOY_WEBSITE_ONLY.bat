@echo off
setlocal
cd /d "%~dp0"
title DOC-FULL-NR - DEPLOY WEBSITE

if not exist "node_modules\firebase-tools\lib\bin\firebase.js" (
  call npm.cmd install --no-audit --no-fund
  if errorlevel 1 goto :error
)

node.exe "node_modules\firebase-tools\lib\bin\firebase.js" login
if errorlevel 1 goto :error

node.exe "scripts\configure-doc-full-nr.mjs"
if errorlevel 1 goto :error

call npm.cmd run build
if errorlevel 1 goto :error

node.exe "node_modules\firebase-tools\lib\bin\firebase.js" deploy --project doc-full-nr --only hosting
if errorlevel 1 goto :error

start "" "https://doc-full-nr.web.app/login"
echo.
echo WEBSITE DEPLOY SUCCESS
pause
exit /b 0

:error
echo [ERROR] Website deploy failed.
pause
exit /b 1
