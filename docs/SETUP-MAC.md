# macOS Setup Guide

Complete installation guide for running the Discord Music Bot on macOS.

## Prerequisites

### 1. Homebrew Installation (Package Manager)

Homebrew makes installing software on Mac much easier.

**Install Homebrew:**
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

**Verify installation:**
```bash
brew --version
```

### 2. Node.js Installation

**Using Homebrew (Recommended):**
```bash
brew install node
```

**Verify installation:**
```bash
node --version
# Should show v18.x.x or higher

npm --version
# Should show 9.x.x or higher
```

**Alternative:** Download from [nodejs.org](https://nodejs.org/) and install the LTS version.

### 3. FFmpeg Installation

FFmpeg is **REQUIRED** for audio processing.

**Using Homebrew:**
```bash
brew install ffmpeg
```

**Verify installation:**
```bash
ffmpeg -version
```

### 4. Git (Usually Pre-installed)

**Verify Git:**
```bash
git --version
```

**If not installed:**
```bash
brew install git
```

## Bot Setup

### 1. Download the Bot

**Using Git:**
```bash
git clone <repository-url>
cd discord-music-bot
```

**Or download ZIP:**
1. Download the ZIP file
2. Extract to a folder
3. Open Terminal in that folder:
   ```bash
   cd /path/to/discord-music-bot
   ```

### 2. Install Dependencies

```bash
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
```bash
cp .env.example .env
nano .env
# Or use your favorite editor: code .env, vim .env, etc.
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
```bash
npm run check
```

**Start the bot:**
```bash
npm start
```

**For development (auto-reload):**
```bash
npm run dev
```

## Troubleshooting

### Bot doesn't start

**Check Node.js version:**
```bash
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
   ```bash
   ffmpeg -version
   ```
2. If not found:
   ```bash
   brew install ffmpeg
   ```
3. Restart Terminal
4. Try again

### No audio playing

1. Check bot has "Connect" and "Speak" permissions
2. Check you're in a voice channel
3. Check bot can see your voice channel
4. Check FFmpeg is installed: `ffmpeg -version`
5. Check console for errors

### "Cannot find module" errors

```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Port already in use / Bot already running

**Find and kill the process:**
```bash
# Find Node.js processes
ps aux | grep node

# Kill specific process by PID
kill <PID>

# Or kill all Node.js processes (use with caution!)
pkill -f node
```

### Permission denied errors

If you get permission errors with npm:
```bash
# Fix npm permissions (don't use sudo!)
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bash_profile
source ~/.bash_profile
```

## Running Bot in Background

### Using PM2 (Process Manager)

**Install PM2:**
```bash
npm install -g pm2
```

**Start bot:**
```bash
pm2 start src/index.js --name discord-bot
```

**Useful PM2 commands:**
```bash
pm2 list          # List all processes
pm2 logs          # View logs
pm2 stop discord-bot
pm2 restart discord-bot
pm2 delete discord-bot
```

**Auto-start on boot:**
```bash
pm2 startup
pm2 save
```

### Using Screen (Alternative)

**Start a screen session:**
```bash
screen -S discord-bot
npm start
```

**Detach:** Press `Ctrl+A`, then `D`

**Reattach:**
```bash
screen -r discord-bot
```

**List sessions:**
```bash
screen -ls
```

## macOS-Specific Notes

### Gatekeeper Issues

If macOS blocks FFmpeg or Node.js:
1. Go to System Settings → Privacy & Security
2. Scroll down to see blocked apps
3. Click "Allow Anyway"

### Firewall

If you have macOS Firewall enabled:
1. System Settings → Network → Firewall
2. Allow Node.js if prompted

### Apple Silicon (M1/M2/M3) Macs

Everything should work natively on Apple Silicon. If you encounter issues:

```bash
# Check architecture
uname -m
# Should show: arm64

# If you need Rosetta (shouldn't be necessary)
softwareupdate --install-rosetta
```

### Keeping System Clean

**Update Homebrew packages:**
```bash
brew update
brew upgrade
```

**Update Node.js:**
```bash
brew upgrade node
```

**Update npm packages:**
```bash
npm update
```

## Security Best Practices

### ✅ DO:
- Keep `.env` file private
- Use different tokens for testing and production
- Regularly update dependencies: `npm update`
- Use Git to version control (but not `.env`!)
- Keep macOS updated

### ❌ DON'T:
- Commit `.env` to Git
- Share your bot token publicly
- Give bot admin permissions (use specific permissions only)
- Run bot with `sudo` (not necessary and insecure)

## Multi-Host Setup

If sharing hosting with friends:

1. **Share:** `.env` file with token (securely!)
2. **Don't share:** node_modules (each person runs `npm install`)
3. **Coordinate:** Who's running the bot when
4. **Important:** Only ONE person can run the bot at a time with the same token

See [HOSTING-GUIDE.md](HOSTING-GUIDE.md) for detailed multi-host instructions.

## Hosting on Mac Mini / Always-On Mac

If running 24/7 on a dedicated Mac:

1. Use PM2 for process management
2. Enable auto-start on login:
   ```bash
   pm2 startup
   pm2 save
   ```
3. Prevent Mac from sleeping:
   - System Settings → Energy → Prevent automatic sleeping when display is off
4. Consider using `caffeinate` to keep Mac awake:
   ```bash
   caffeinate -s &
   ```

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

## Useful Terminal Commands

```bash
# Navigate to bot directory
cd ~/path/to/discord-music-bot

# View logs in real-time
tail -f logs/*.log

# Check disk space
df -h

# Monitor system resources
top

# View running Node.js processes
ps aux | grep node
```

---

**macOS Tips:**
- Use iTerm2 for a better terminal experience
- Learn basic Terminal commands (cd, ls, cat, grep)
- Use `⌘ + K` to clear Terminal
- Use `⌘ + T` for new Terminal tabs
