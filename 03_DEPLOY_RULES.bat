@echo off
cd /d %~dp0
firebase deploy --only firestore:rules,firestore:indexes,storage
pause
