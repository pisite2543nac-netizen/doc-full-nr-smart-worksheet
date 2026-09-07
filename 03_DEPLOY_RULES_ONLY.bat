@echo off
setlocal
cd /d "%~dp0"
title DOC-FULL-NR - RULES

if not exist "node_modules\firebase-tools\lib\bin\firebase.js" (
  call npm.cmd install --no-audit --no-fund
  if errorlevel 1 goto :error
)

node.exe "node_modules\firebase-tools\lib\bin\firebase.js" login
if errorlevel 1 goto :error

node.exe "node_modules\firebase-tools\lib\bin\firebase.js" deploy --project doc-full-nr --only firestore:rules,firestore:indexes
if errorlevel 1 goto :error

echo.
echo RULES + INDEXES DEPLOY SUCCESS
pause
exit /b 0

:error
echo [ERROR] Rules deploy failed.
pause
exit /b 1
