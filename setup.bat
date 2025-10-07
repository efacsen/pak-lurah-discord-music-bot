@echo off
REM Discord Music Bot - Automated Setup Script (Windows)
REM This script will install all dependencies and configure the bot for you

setlocal enabledelayedexpansion

echo.
echo ================================================
echo    Discord Music Bot - Automated Setup
echo ================================================
echo.

REM Check for admin rights
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo [WARNING] This script may need administrator privileges for some installations.
    echo           If you encounter errors, try running as Administrator.
    echo.
    pause
)

REM Step 1: Check for Chocolatey
echo [INFO] Step 1/6: Checking Chocolatey...
where choco >nul 2>&1
if %errorLevel% neq 0 (
    echo [WARNING] Chocolatey not found. Installing...
    echo [INFO] Please wait, this may take a few minutes...

    powershell -Command "Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))"

    if !errorLevel! neq 0 (
        echo [ERROR] Failed to install Chocolatey. Please install manually from https://chocolatey.org/install
        pause
        exit /b 1
    )

    REM Refresh environment
    call refreshenv
    echo [SUCCESS] Chocolatey installed
) else (
    echo [SUCCESS] Chocolatey is already installed
)

REM Step 2: Check/Install Node.js
echo.
echo [INFO] Step 2/6: Checking Node.js...
where node >nul 2>&1
if %errorLevel% neq 0 (
    echo [WARNING] Node.js not found. Installing...
    choco install nodejs-lts -y
    call refreshenv
    echo [SUCCESS] Node.js installed
) else (
    for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
    echo [SUCCESS] Node.js is already installed (!NODE_VERSION!)
)

REM Step 3: Check/Install FFmpeg
echo.
echo [INFO] Step 3/6: Checking FFmpeg...
where ffmpeg >nul 2>&1
if %errorLevel% neq 0 (
    echo [WARNING] FFmpeg not found. Installing...
    choco install ffmpeg -y
    call refreshenv
    echo [SUCCESS] FFmpeg installed
) else (
    echo [SUCCESS] FFmpeg is already installed
)

REM Step 4: Check/Install yt-dlp
echo.
echo [INFO] Step 4/6: Checking yt-dlp...
where yt-dlp >nul 2>&1
if %errorLevel% neq 0 (
    echo [WARNING] yt-dlp not found. Installing...
    choco install yt-dlp -y
    call refreshenv
    echo [SUCCESS] yt-dlp installed
) else (
    for /f "tokens=*" %%i in ('yt-dlp --version') do set YTDLP_VERSION=%%i
    echo [SUCCESS] yt-dlp is already installed (!YTDLP_VERSION!)
)

REM Step 5: Install Node.js dependencies
echo.
echo [INFO] Step 5/6: Installing Node.js dependencies...
call npm install
if %errorLevel% neq 0 (
    echo [ERROR] Failed to install Node.js dependencies
    pause
    exit /b 1
)
echo [SUCCESS] Node.js dependencies installed

REM Step 6: Configure bot
echo.
echo [INFO] Step 6/6: Bot configuration...

if exist ".env" (
    echo [WARNING] .env file already exists
    set /p RECONFIG="Do you want to reconfigure? (y/N): "
    if /i not "!RECONFIG!"=="y" (
        echo [INFO] Skipping configuration
        goto :skip_config
    )
    del .env
)

echo.
echo [INFO] Let's configure your Discord bot!
echo.
echo [INFO] You'll need to create a Discord bot if you haven't already:
echo [INFO] 1. Go to https://discord.com/developers/applications
echo [INFO] 2. Click 'New Application' and give it a name
echo [INFO] 3. Go to 'Bot' section and click 'Add Bot'
echo [INFO] 4. Copy the bot token
echo [INFO] 5. Go to OAuth2 ^> URL Generator
echo [INFO]    - Select 'bot' and 'applications.commands'
echo [INFO]    - Select permissions: Send Messages, Connect, Speak
echo [INFO]    - Copy the generated URL and invite bot to your server
echo.

set /p DISCORD_TOKEN="Enter your Discord Bot Token: "
set /p CLIENT_ID="Enter your Discord Client ID (Application ID): "
set /p GUILD_ID="Enter your Discord Guild ID (Server ID): "

(
echo # Discord Bot Configuration
echo DISCORD_CLIENT_TOKEN=!DISCORD_TOKEN!
echo DISCORD_CLIENT_ID=!CLIENT_ID!
echo DISCORD_GUILD_ID=!GUILD_ID!
echo.
echo # YouTube Configuration ^(Optional^)
echo # Only needed for age-restricted or private videos
echo # YOUTUBE_COOKIE_PATH=./youtube_cookies.txt
) > .env

echo [SUCCESS] .env file created

:skip_config

REM Configure yt-dlp path in extractor
echo.
echo [INFO] Configuring yt-dlp path...
for /f "tokens=*" %%i in ('where yt-dlp') do set YTDLP_PATH=%%i
set YTDLP_PATH=!YTDLP_PATH:\=\\!
echo [INFO] Found yt-dlp at: !YTDLP_PATH!

REM Update YtDlpExtractor.js with the correct path (using PowerShell for regex replace)
if exist "src\extractors\YtDlpExtractor.js" (
    powershell -Command "(Get-Content 'src\extractors\YtDlpExtractor.js') -replace \"this\.ytDlp = new YTDlpWrap\('.*?'\)\", \"this.ytDlp = new YTDlpWrap('!YTDLP_PATH!')\" | Set-Content 'src\extractors\YtDlpExtractor.js'"
    echo [SUCCESS] yt-dlp path configured
)

REM Final success message
echo.
echo ================================================
echo           Setup Complete! 🎉
echo ================================================
echo.
echo [SUCCESS] All dependencies installed and configured!
echo.
echo [INFO] To start your bot, run:
echo   npm start
echo.
echo [INFO] Or use the convenience scripts:
echo   start.bat  - Start the bot
echo   stop.bat   - Stop the bot
echo.
echo [INFO] Need help? Check the documentation:
echo   - README.md - Getting started guide
echo   - TROUBLESHOOTING.md - Common issues and fixes
echo.
pause
