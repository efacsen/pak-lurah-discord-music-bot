@echo off
REM Discord Music Bot - Stop Script (Windows)

echo.
echo ================================================
echo    Discord Music Bot - Stopping...
echo ================================================
echo.

REM Find and kill all node processes running the bot
echo [INFO] Stopping all bot instances...

REM Kill node processes that match our bot
for /f "tokens=2" %%i in ('tasklist /FI "IMAGENAME eq node.exe" /NH 2^>NUL') do (
    taskkill /PID %%i /F >NUL 2>&1
)

timeout /t 2 /nobreak >NUL

echo [SUCCESS] Bot stopped successfully!
echo.
pause
