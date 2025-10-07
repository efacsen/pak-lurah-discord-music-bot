@echo off
REM Discord Music Bot - Start Script (Windows)

echo.
echo ================================================
echo    Discord Music Bot - Starting...
echo ================================================
echo.

REM Check if .env exists
if not exist ".env" (
    echo [ERROR] .env file not found!
    echo [INFO] Please run 'setup.bat' first to configure the bot.
    pause
    exit /b 1
)

REM Check if bot is already running
tasklist /FI "IMAGENAME eq node.exe" /FI "WINDOWTITLE eq *index.js*" 2>NUL | find /I /N "node.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo [WARNING] Bot may already be running!
    echo [INFO] Use 'stop.bat' to stop it first.
    pause
)

REM Start the bot
echo [SUCCESS] Starting Discord Music Bot...
echo [INFO] Press Ctrl+C to stop the bot
echo.

npm start
