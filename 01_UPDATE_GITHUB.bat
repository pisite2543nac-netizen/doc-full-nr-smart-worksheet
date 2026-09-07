@echo off
setlocal
cd /d "%~dp0"
title DOC-FULL-NR - UPDATE GITHUB

where git.exe >nul 2>&1
if errorlevel 1 (
  echo [ERROR] Git for Windows was not found.
  pause
  exit /b 1
)

if not exist ".git" (
  echo [INFO] Git repository not initialized yet.
  echo Run 00_PUSH_TO_GITHUB.bat first.
  pause
  exit /b 1
)

git add .
git status --short
echo.
set /p MSG=Commit message (press Enter for Update DOC-FULL-NR): 
if "%MSG%"=="" set "MSG=Update DOC-FULL-NR"

git commit -m "%MSG%"
git push origin main

echo.
echo Update finished.
start "" "https://github.com/pisite2543nac-netizen/doc-full-nr-smart-worksheet"
pause
