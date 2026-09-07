@echo off
setlocal
cd /d "%~dp0"
title DOC-FULL-NR - CLEAN FAILED INSTALL

echo ============================================================
echo   CLEAN FAILED INSTALL IN THIS FOLDER ONLY
echo ============================================================
echo.
echo This deletes only:
echo - node_modules in THIS project folder
echo - .npm-cache in THIS project folder
echo - .tmp in THIS project folder
echo.
echo Source code and Firestore data are NOT deleted.
echo.
pause

if exist "node_modules" rmdir /s /q "node_modules"
if exist ".npm-cache" rmdir /s /q ".npm-cache"
if exist ".tmp" rmdir /s /q ".tmp"

echo.
echo Cleanup complete.
echo.
pause
