@echo off
setlocal

set ROOT=%~dp0
set BACKEND_DIR=%ROOT%backend
set USER_DIR=%ROOT%USER\UserDashboard
set STAFF_DIR=%ROOT%STAFF\StaffDashboard

if not exist "%ROOT%logs" mkdir "%ROOT%logs"

echo Starting backend on port 8080...
start "Backend" /D "%BACKEND_DIR%" cmd /c "mvnw.cmd spring-boot:run > "%ROOT%logs\backend.log" 2>&1"

echo Starting User Dashboard on port 8082...
start "User Dashboard" /D "%USER_DIR%" cmd /c "if not exist node_modules (echo Installing dependencies... && npm install) && npm run web > "%ROOT%logs\user.log" 2>&1"

echo Starting Staff Dashboard on port 8083...
start "Staff Dashboard" /D "%STAFF_DIR%" cmd /c "if not exist node_modules (echo Installing dependencies... && npm install) && npm run web > "%ROOT%logs\staff.log" 2>&1"

echo.
echo All services starting:
echo   Backend         -^> http://localhost:8080
echo   User Dashboard  -^> http://localhost:8082
echo   Staff Dashboard -^> http://localhost:8083
echo.
echo Logs are in the logs\ folder.
echo Close the opened terminal windows to stop each service.
echo.
pause
