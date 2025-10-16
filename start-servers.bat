@echo off
echo Starting Healthcare Management System...
echo.

REM Start Backend Server
echo Starting Backend Server on port 5000...
start cmd /k "cd /d E:\nd\backend && npm start"

REM Wait 3 seconds
timeout /t 3 /nobreak >nul

REM Start Frontend Server
echo Starting Frontend Server on port 5175...
start cmd /k "cd /d E:\nd && npm run dev"

echo.
echo Servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5175
echo.
echo Press any key to exit this script...
pause >nul