# Windows Setup Guide

Complete installation guide for running the Discord Music Bot on Windows.

## Prerequisites

### 1. Node.js Installation

**Download and Install:**
1. Visit [nodejs.org](https://nodejs.org/)
2. Download the **LTS version** (v18 or higher)
3. Run the installer (`.msi` file)
4. Check "Add to PATH" during installation
5. Complete the installation

**Verify Installation:**
```powershell
node --version
# Should show v18.x.x or higher

npm --version
# Should show 9.x.x or higher
```

### 2. FFmpeg Installation

FFmpeg is **REQUIRED** for audio processing. Choose one method:

#### Method A: Using Chocolatey (Recommended)

**Install Chocolatey:**
Open PowerShell as Administrator and run:
```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

**Install FFmpeg:**
```powershell
choco install ffmpeg
```

**Verify:**
```powershell
ffmpeg -version
```

#### Method B: Manual Installation

1. Download FFmpeg from [ffmpeg.org/download.html](https://ffmpeg.org/download.html)
2. Choose "Windows builds from gyan.dev"
3. Download the "ffmpeg-release-essentials.zip"
4. Extract to `C:\ffmpeg`
5. Add `C:\ffmpeg\bin` to System PATH:
   - Open Start Menu → Search "Environment Variables"
   - Click "Environment Variables"
   - Under "System variables", find "Path"
   - Click "Edit" → "New"
   - Add: `C:\ffmpeg\bin`
   - Click OK on all dialogs
6. **Restart your terminal/PowerShell**
7. Verify: `ffmpeg -version`

### 3. Git (Optional but Recommended)

**Download and Install:**
1. Visit [git-scm.com](https://git-scm.com/download/win)
2. Download the installer
3. Run with default options
4. Verify: `git --version`

## Bot Setup

### 1. Download the Bot

**Using Git:**
```powershell
git clone <repository-url>
cd discord-music-bot
```

**Or download ZIP:**
1. Download the ZIP file
2. Extract to a folder
3. Open PowerShell in that folder

### 2. Install Dependencies

```powershell
npm install
```

This will install:
- discord.js v14
- discord-player v7
- All required dependencies

### 3. Create Discord Bot

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application"
3. Name your bot and click "Create"
4. Go to "Bot" tab
5. Click "Add Bot"
6. **IMPORTANT:** Under "Privileged Gateway Intents", enable:
   - ✅ Server Members Intent
   - ✅ Message Content Intent
7. Click "Reset Token" and copy the token (save it securely!)
8. Go to "OAuth2" → "General"
9. Copy your "Client ID"

### 4. Configure Environment

Create a `.env` file:
```powershell
Copy-Item .env.example .env
notepad .env
```

Fill in your credentials:
```env
DISCORD_CLIENT_TOKEN=your_bot_token_here
DISCORD_CLIENT_ID=your_client_id_here
DISCORD_GUILD_ID=your_test_server_id_optional
```

**To get your Guild ID:**
1. Enable Discord Developer Mode (Settings → Advanced → Developer Mode)
2. Right-click your server → Copy ID

### 5. Invite Bot to Server

Generate invite URL:
```
https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=36700160&scope=bot%20applications.commands
```

Replace `YOUR_CLIENT_ID` with your actual Client ID.

**Required Permissions:**
- View Channels
- Send Messages
- Connect (to voice)
- Speak (in voice)
- Use Slash Commands

### 6. Run the Bot

**Check system requirements:**
```powershell
npm run check
```

**Start the bot:**
```powershell
npm start
```

**For development (auto-reload):**
```powershell
npm run dev
```

## Troubleshooting

### Bot doesn't start

**Check Node.js version:**
```powershell
node --version
```
Must be v18 or higher.

**Check for errors in console:**
- Invalid token? Re-check `.env` file
- Missing dependencies? Run `npm install` again

### No slash commands appearing

**Wait 1 hour** for global commands to register, OR:

1. Add your test server ID to `.env`:
   ```env
   DISCORD_GUILD_ID=your_server_id
   ```
2. Restart the bot
3. Commands appear instantly!

### "FFmpeg not found" error

1. Verify installation:
   ```powershell
   ffmpeg -version
   ```
2. If not found, FFmpeg is not in PATH
3. Restart PowerShell/Command Prompt
4. If still not working, reinstall FFmpeg (see Method B above)

### No audio playing

1. Check bot has "Connect" and "Speak" permissions
2. Check you're in a voice channel
3. Check bot can see your voice channel
4. Check FFmpeg is installed: `ffmpeg -version`
5. Check console for errors

### "Cannot find module" errors

```powershell
# Delete node_modules and reinstall
Remove-Item -Recurse -Force node_modules
npm install
```

### Port already in use / Bot already running

**Find and kill the process:**
```powershell
# Find Node.js processes
Get-Process node

# Kill specific process by ID
Stop-Process -Id <PID>

# Or kill all Node.js processes
Get-Process node | Stop-Process
```

## Running Bot in Background

### Using PM2 (Process Manager)

**Install PM2:**
```powershell
npm install -g pm2
```

**Start bot:**
```powershell
pm2 start src/index.js --name discord-bot
```

**Useful PM2 commands:**
```powershell
pm2 list          # List all processes
pm2 logs          # View logs
pm2 stop discord-bot
pm2 restart discord-bot
pm2 delete discord-bot
```

**Auto-start on boot:**
```powershell
pm2 startup
pm2 save
```

## Security Best Practices

### ✅ DO:
- Keep `.env` file private
- Use different tokens for testing and production
- Regularly update dependencies: `npm update`
- Use Git to version control (but not `.env`!)

### ❌ DON'T:
- Commit `.env` to Git
- Share your bot token publicly
- Give bot admin permissions (use specific permissions only)
- Run bot as Administrator unless necessary

## Hosting on Windows Server

If running 24/7 on Windows Server:

1. Install Node.js and FFmpeg (as above)
2. Use PM2 for process management
3. Configure Windows Firewall if needed
4. Set up automatic restarts with PM2
5. Monitor logs: `pm2 logs`

## Multi-Host Setup

If sharing hosting with friends:

1. **Share:** `.env` file with token (securely!)
2. **Don't share:** node_modules (each person runs `npm install`)
3. **Coordinate:** Who's running the bot when
4. **Important:** Only ONE person can run the bot at a time with the same token

See [HOSTING-GUIDE.md](HOSTING-GUIDE.md) for detailed multi-host instructions.

## Need Help?

- Check console logs for error messages
- Ensure FFmpeg is installed: `ffmpeg -version`
- Verify Node.js version: `node --version` (must be v18+)
- Check `.env` file has correct token
- Join Discord server for support (if available)

## Next Steps

After setup, learn how to use the bot:
- See [README.md](../README.md) for command list
- Join a voice channel
- Use `/play <song name>` to start!

---

**Windows-Specific Notes:**
- Use PowerShell or Command Prompt (not Git Bash for some commands)
- Paths use backslashes `\` but Node.js handles this automatically
- Antivirus may block FFmpeg - add exception if needed
- Windows Defender might require exception for Node.js
