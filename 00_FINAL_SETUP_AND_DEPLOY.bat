@echo off
setlocal
cd /d "%~dp0"
title DOC-FULL-NR - FINAL SETUP AND DEPLOY

echo ============================================================
echo   DOC-FULL-NR - FINAL FIREBASE HOSTING SETUP
echo ============================================================
echo.
echo Firebase Project : doc-full-nr
echo Admin Email      : pisite.2543nac@gmail.com
echo Local URL        : http://localhost:5174/login
echo Production URL   : https://doc-full-nr.web.app/login
echo.
echo Existing Firestore documents (including subjects) are NOT deleted.
echo.

where node.exe >nul 2>&1
if errorlevel 1 (
  echo [ERROR] Node.js was not found.
  echo Install Node.js 22 LTS first.
  pause
  exit /b 1
)

where npm.cmd >nul 2>&1
if errorlevel 1 (
  echo [ERROR] npm was not found.
  pause
  exit /b 1
)

if not exist "node_modules\firebase-tools\lib\bin\firebase.js" (
  echo [1/8] Installing packages...
  call npm.cmd install --no-audit --no-fund
  if errorlevel 1 goto :error
) else (
  echo [1/8] Packages already installed.
)

echo.
echo [2/8] Firebase login...
node.exe "node_modules\firebase-tools\lib\bin\firebase.js" login
if errorlevel 1 goto :error

echo.
echo [3/8] Creating Firebase Web build config...
node.exe "scripts\configure-doc-full-nr.mjs"
if errorlevel 1 goto :error

echo.
echo [4/8] Ensuring Firebase Hosting site exists...
node.exe "node_modules\firebase-tools\lib\bin\firebase.js" hosting:sites:create doc-full-nr --project doc-full-nr >nul 2>&1
echo Hosting site check complete.

echo.
echo [5/8] Deploying Firestore Rules and Indexes...
node.exe "node_modules\firebase-tools\lib\bin\firebase.js" deploy --project doc-full-nr --only firestore:rules,firestore:indexes
if errorlevel 1 goto :error

echo.
echo [6/8] Building production website...
call npm.cmd run build
if errorlevel 1 goto :error

if not exist "dist\index.html" (
  echo [ERROR] dist\index.html was not created.
  goto :error
)

echo.
echo [7/8] Deploying Firebase Hosting...
node.exe "node_modules\firebase-tools\lib\bin\firebase.js" deploy --project doc-full-nr --only hosting
if errorlevel 1 goto :error

echo.
echo [8/8] Opening production website...
timeout /t 2 /nobreak >nul
start "" "https://doc-full-nr.web.app/login"

echo.
echo ============================================================
echo   PRODUCTION DEPLOY SUCCESS
echo ============================================================
echo.
echo Open:
echo https://doc-full-nr.web.app/login
echo.
echo Your existing Firestore subjects were preserved.
echo.
pause
exit /b 0

:error
echo.
echo ============================================================
echo   FINAL SETUP / DEPLOY FAILED
echo ============================================================
echo.
echo Send a screenshot of the error above.
echo.
pause
exit /b 1
