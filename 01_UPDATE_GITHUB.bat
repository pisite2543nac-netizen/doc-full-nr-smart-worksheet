@echo off
cd /d %~dp0
git add .
git commit -m "Update DOC-FULL-NR Smart Worksheet V2" || echo Nothing new to commit.
git push origin main
pause
