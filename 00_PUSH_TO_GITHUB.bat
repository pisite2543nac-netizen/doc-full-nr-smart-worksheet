@echo off
setlocal
cd /d "%~dp0"
title DOC-FULL-NR - PUSH TO GITHUB

echo ============================================================
echo   DOC-FULL-NR - FULL SOURCE PUSH TO GITHUB
echo ============================================================
echo.
echo Repository:
echo https://github.com/pisite2543nac-netizen/doc-full-nr-smart-worksheet.git
echo.
echo This uploads SOURCE CODE only.
echo It does NOT upload:
echo - .env.local
echo - node_modules
echo - dist
echo - Firebase service-account/private keys
echo - Admin password
echo.

where git.exe >nul 2>&1
if errorlevel 1 (
  echo [ERROR] Git for Windows was not found.
  echo Install Git for Windows and run this file again.
  pause
  exit /b 1
)

if not exist ".git" (
  git init
  if errorlevel 1 goto :error
)

git config user.name "DOC-FULL-NR Admin"
git config user.email "pisite.2543nac@gmail.com"

git add .
if errorlevel 1 goto :error

echo.
echo ============================================================
echo   REVIEW FILES BEFORE PUSH
echo ============================================================
echo.
git status --short
echo.
echo Check that .env.local, node_modules, dist and private-key JSON
echo are NOT listed above.
echo.
pause

git commit -m "DOC-FULL-NR production source"
if errorlevel 1 (
  echo.
  echo [INFO] Commit may already exist. Continuing...
)

git branch -M main

git remote remove origin >nul 2>&1
git remote add origin https://github.com/pisite2543nac-netizen/doc-full-nr-smart-worksheet.git
if errorlevel 1 goto :error

echo.
echo Pushing to GitHub...
git push -u origin main
if errorlevel 1 goto :error

echo.
echo ============================================================
echo   GITHUB PUSH SUCCESS
echo ============================================================
echo.
echo Repository:
echo https://github.com/pisite2543nac-netizen/doc-full-nr-smart-worksheet.git
echo.
start "" "https://github.com/pisite2543nac-netizen/doc-full-nr-smart-worksheet"
pause
exit /b 0

:error
echo.
echo ============================================================
echo   GITHUB PUSH FAILED
echo ============================================================
echo.
echo Send a screenshot of the error above.
echo.
pause
exit /b 1
