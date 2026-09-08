@echo off
cd /d %~dp0
where node >nul 2>nul || (echo [ERROR] Node.js not found & pause & exit /b 1)
npm install
if errorlevel 1 pause & exit /b 1
npm run dev
pause
