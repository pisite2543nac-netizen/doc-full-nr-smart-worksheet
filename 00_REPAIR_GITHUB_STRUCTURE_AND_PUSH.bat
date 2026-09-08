@echo off
setlocal EnableExtensions
chcp 65001 >nul
cls

echo ============================================================
echo   DOC-FULL-NR V3 - REPAIR GITHUB STRUCTURE AND PUSH
echo ============================================================
echo.

set "SOURCE=%~dp0"
set "TARGET=D:\DOC_FULL_NR_GITHUB_FINAL_SOURCE"

if not exist "%TARGET%\.git" (
  echo [ERROR] Git repository was not found here:
  echo         %TARGET%
  echo.
  echo Keep your existing Git clone at that path, then run this file again.
  pause
  exit /b 1
)

echo [1/7] Cleaning obsolete V1 root files that conflict with V2...
if exist "%TARGET%\index.html" del /f /q "%TARGET%\index.html"
if exist "%TARGET%\vite.config.js" del /f /q "%TARGET%\vite.config.js"
if exist "%TARGET%\vite.config.ts" del /f /q "%TARGET%\vite.config.ts"
if exist "%TARGET%\postcss.config.js" del /f /q "%TARGET%\postcss.config.js"
if exist "%TARGET%\tailwind.config.js" del /f /q "%TARGET%\tailwind.config.js"
if exist "%TARGET%\src" rmdir /s /q "%TARGET%\src"
if exist "%TARGET%\dist" rmdir /s /q "%TARGET%\dist"
if exist "%TARGET%\.github\workflows" rmdir /s /q "%TARGET%\.github\workflows"
mkdir "%TARGET%\.github\workflows" >nul 2>&1

echo [2/7] Copying the V3 source while preserving folders...
robocopy "%SOURCE%" "%TARGET%" /E /R:1 /W:1 /XD ".git" "node_modules" "dist" ".firebase" ".npm-cache" ".tmp" /XF "package-lock.json" >nul
set "RC=%ERRORLEVEL%"
if %RC% GEQ 8 (
  echo [ERROR] Copy failed. Robocopy exit code: %RC%
  pause
  exit /b 1
)

echo [3/7] Verifying required folders...
if not exist "%TARGET%\apps\web\src\main.tsx" goto :badstructure
if not exist "%TARGET%\apps\web\index.html" goto :badstructure
if not exist "%TARGET%\functions\src\index.ts" goto :badstructure
if not exist "%TARGET%\.github\workflows\deploy-pages.yml" goto :badstructure

echo [4/7] Installing dependencies...
cd /d "%TARGET%"
call npm install --no-audit --no-fund
if errorlevel 1 goto :failed

echo [5/7] Running production build locally...
call npm run build
if errorlevel 1 goto :failed

echo [6/7] Committing the corrected folder structure...
git add -A
git diff --cached --quiet
if errorlevel 1 (
  git commit -m "Repair V3 monorepo structure and GitHub Pages build"
  if errorlevel 1 goto :failed
) else (
  echo [INFO] No new commit needed; continuing to push.
)

echo [7/7] Pushing main to GitHub...
git branch -M main
git push -u origin main
if errorlevel 1 goto :failed

echo.
echo ============================================================
echo   REPAIR AND PUSH SUCCESS
echo ============================================================
echo GitHub Actions will now run against the correct V2/V3 folders.
echo Do NOT re-run the old failed workflow. Watch the newest run only.
echo.
pause
exit /b 0

:badstructure
echo.
echo [ERROR] Required V2/V3 folders are missing after copy.
echo Expected apps\web and functions\src.
echo.
pause
exit /b 1

:failed
echo.
echo ============================================================
echo   REPAIR STOPPED - SEE ERROR ABOVE
echo ============================================================
echo Nothing after the failed step was pushed automatically.
echo.
pause
exit /b 1
