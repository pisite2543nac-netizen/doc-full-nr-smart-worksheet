@echo off
cd /d %~dp0
npm install
npm run deploy:functions
pause
