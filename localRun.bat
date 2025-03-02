@echo off
cd dashboard
call npm run build

rd /S /Q "..\backend\public"
mkdir "..\backend\public"

xcopy /E /I /Y "dist\*" "..\backend\public\"

cd ..
cd backend
node server.js
