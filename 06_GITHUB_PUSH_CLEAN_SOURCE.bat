@echo off
setlocal
cd /d "%~dp0"
title DOC-FULL-NR - GITHUB SOURCE

where git.exe >nul 2>&1
if errorlevel 1 (
  echo [ERROR] Git for Windows was not found.
  pause
  exit /b 1
)

echo ============================================================
echo   DOC-FULL-NR - PUSH CLEAN SOURCE TO GITHUB
echo ============================================================
echo.
echo Recommended NEW repository:
echo doc-full-nr-smart-worksheet
echo.
echo Create an EMPTY repository on GitHub first.
echo Do not create README or .gitignore on GitHub.
echo.
set /p REPO_URL=Paste repository URL: 

if "%REPO_URL%"=="" (
  echo [ERROR] Repository URL is required.
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
echo Review staged files below.
echo .env.local, node_modules, dist, service-account JSON and private keys
echo MUST NOT appear.
echo.
git status --short
echo.
pause

git commit -m "DOC-FULL-NR production source"
git branch -M main

git remote remove origin >nul 2>&1
git remote add origin "%REPO_URL%"
if errorlevel 1 goto :error

git push -u origin main
if errorlevel 1 goto :error

echo.
echo GITHUB SOURCE PUSH SUCCESS
pause
exit /b 0

:error
echo.
echo [ERROR] GitHub push failed.
pause
exit /b 1
