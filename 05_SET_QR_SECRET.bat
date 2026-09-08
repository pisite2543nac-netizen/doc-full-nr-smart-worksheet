@echo off
cd /d %~dp0
echo This creates/updates the Firebase Functions secret QR_TOKEN_SECRET.
echo Enter a long random secret when Firebase asks for the value.
firebase functions:secrets:set QR_TOKEN_SECRET
pause
