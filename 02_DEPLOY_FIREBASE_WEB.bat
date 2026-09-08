@echo off
cd /d %~dp0
npm install
if errorlevel 1 pause & exit /b 1
npm run deploy:web
pause
