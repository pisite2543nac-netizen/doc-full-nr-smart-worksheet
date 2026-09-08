@echo off
setlocal
cd /d %~dp0
echo ============================================================
echo DOC-FULL-NR - CONNECT REAL FIREBASE TO GITHUB PAGES
echo ============================================================
where firebase >nul 2>nul || (echo [ERROR] Firebase CLI not found. Run: npm install -g firebase-tools & pause & exit /b 1)
where git >nul 2>nul || (echo [ERROR] Git not found. & pause & exit /b 1)
node scripts\sync-firebase-web-config.mjs
if errorlevel 1 (echo [ERROR] Firebase config sync failed & pause & exit /b 1)
git add apps/web/src/generated/firebaseConfig.ts
git diff --cached --quiet
if errorlevel 1 git commit -m "Connect DOC-FULL-NR Firebase web config"
git push origin main
if errorlevel 1 (echo [ERROR] GitHub push failed & pause & exit /b 1)
echo.
echo SUCCESS: Firebase config pushed to GitHub.
echo NEXT: Firebase Authentication ^> Settings ^> Authorized domains
echo Add: pisite2543nac-netizen.github.io
echo.
pause
