@echo off
setlocal
cd /d "%~dp0"
title DOC-FULL-NR - LOW DISK SETUP

echo ============================================================
echo   DOC-FULL-NR - LOW DISK / PORTABLE SETUP
echo ============================================================
echo.
echo Recommended: extract this project to D:\DOC_FULL_NR_FINAL
echo or another drive with at least 5 GB free space.
echo.
echo Firebase Project : doc-full-nr
echo Live URL        : https://doc-full-nr.web.app/login
echo.
echo Existing Firestore data, including subjects, will NOT be deleted.
echo.

where node.exe >nul 2>&1
if errorlevel 1 (
  echo [ERROR] Node.js was not found.
  pause
  exit /b 1
)

where npm.cmd >nul 2>&1
if errorlevel 1 (
  echo [ERROR] npm was not found.
  pause
  exit /b 1
)

if not exist ".tmp" mkdir ".tmp"
if not exist ".npm-cache" mkdir ".npm-cache"

set "TEMP=%CD%\.tmp"
set "TMP=%CD%\.tmp"

echo Project drive free space:
powershell.exe -NoProfile -Command "$p=(Get-Item '%CD%').PSDrive; Write-Host ([math]::Round($p.Free/1GB,2)) 'GB free on' $p.Name':'"

echo.
echo [1/8] Cleaning any failed local install...
if exist "node_modules" rmdir /s /q "node_modules"

echo.
echo [2/8] Installing packages using LOCAL cache/temp...
call npm.cmd install --cache "%CD%\.npm-cache" --no-audit --no-fund
if errorlevel 1 goto :error

echo.
echo [3/8] Firebase login...
node.exe "node_modules\firebase-tools\lib\bin\firebase.js" login
if errorlevel 1 goto :error

echo.
echo [4/8] Creating Firebase Web config...
node.exe "scripts\configure-doc-full-nr.mjs"
if errorlevel 1 goto :error

echo.
echo [5/8] Deploying Firestore Rules and Indexes...
node.exe "node_modules\firebase-tools\lib\bin\firebase.js" deploy --project doc-full-nr --only firestore:rules,firestore:indexes
if errorlevel 1 goto :error

echo.
echo [6/8] Building website...
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
echo https://doc-full-nr.web.app/login
echo.
pause
exit /b 0

:error
echo.
echo ============================================================
echo   SETUP FAILED
echo ============================================================
echo.
echo If you see ENOSPC again, the drive holding this folder is also full.
echo Move the extracted project to a drive with at least 5 GB free.
echo.
pause
exit /b 1
