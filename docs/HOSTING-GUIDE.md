# Multi-Host Shared Hosting Guide

Guide for sharing Discord bot hosting between multiple people (friends, team members, etc.).

## Overview

This bot can be run by **multiple people taking turns**, but **only ONE person can run it at a time** using the same bot token. This is perfect for:

- Friends sharing hosting responsibility
- Teams rotating on-call duties
- Reducing individual hosting costs
- Distributing uptime across timezones

## ⚠️ Important Limitations

### What Works ✅
- Multiple people can have the bot code on their machines
- Anyone with the token can run the bot when their turn comes
- Bot state transfers automatically when host changes
- All commands and features work the same regardless of host

### What Doesn't Work ❌
- **Cannot run simultaneously** with same token (Discord will disconnect both)
- No automatic handoff between hosts
- Manual coordination required
- No shared state/database (each host has independent runtime)

## Setup for Multi-Host Environment

### 1. Initial Setup (First Host)

**Create and configure bot:**
1. Follow platform-specific setup ([SETUP-WINDOWS.md](SETUP-WINDOWS.md) or [SETUP-MAC.md](SETUP-MAC.md))
2. Create bot in Discord Developer Portal
3. Get bot token and client ID
4. Configure `.env` file
5. Invite bot to server
6. Test that bot works

### 2. Share Bot Credentials (Securely!)

**What to share:**
- `DISCORD_CLIENT_TOKEN` (from `.env`)
- `DISCORD_CLIENT_ID` (from `.env`)
- Optional: `DISCORD_GUILD_ID` for testing

**How to share securely:**
- ✅ Use encrypted messaging (Signal, WhatsApp, etc.)
- ✅ Use password manager with sharing (1Password, Bitwarden)
- ✅ Use private shared document (Google Docs with restricted access)
- ❌ Don't post in public Discord channels
- ❌ Don't commit to Git/GitHub
- ❌ Don't send via email (unless encrypted)

**Example secure share message:**
```
Bot Token: MTIzNDU2Nzg5MDEyMzQ1Njc4OQ.AbCdEf.GhIjKlMnOpQrStUvWxYz
Client ID: 1234567890123456789
Guild ID (optional): 9876543210987654321

Keep this private! Only one person runs at a time.
```

### 3. Setup for Additional Hosts

Each additional host should:

1. **Clone/download the bot code:**
   ```bash
   git clone <repository-url>
   cd discord-music-bot
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Install FFmpeg** (platform-specific):
   - Windows: `choco install ffmpeg`
   - macOS: `brew install ffmpeg`
   - Linux: `sudo apt install ffmpeg`

4. **Create `.env` file:**
   ```bash
   # Copy example
   cp .env.example .env

   # Edit with shared credentials
   nano .env  # or your editor of choice
   ```

5. **Verify setup:**
   ```bash
   npm run check
   ```

6. **Test (when it's your turn):**
   ```bash
   npm start
   ```

## Coordination & Handoff

### Basic Rules

1. **One at a time:** Only one person runs the bot
2. **Communicate:** Let others know when you're starting/stopping
3. **Clean shutdown:** Use `Ctrl+C` to stop gracefully
4. **Check status:** Make sure bot is offline before you start

### Recommended Workflow

#### Option A: Scheduled Shifts

```
Monday-Wednesday: Host A
Thursday-Saturday: Host B
Sunday: Host C
```

**Pros:**
- Clear ownership
- Predictable uptime
- Less coordination needed

**Cons:**
- Less flexible
- Gap if someone forgets

#### Option B: On-Demand

Hosts communicate in a shared channel:
```
Host A: "Starting bot now"
[runs bot for 4 hours]
Host A: "Stopping bot, who's next?"
Host B: "I'll take over in 10 mins"
Host A: [stops bot]
[10 minutes later]
Host B: "Bot is now running"
```

**Pros:**
- Flexible
- Responds to demand
- Natural handoffs

**Cons:**
- Requires active communication
- Potential gaps

#### Option C: Hybrid (Recommended)

- Scheduled primary hosts per day
- Backup hosts can take over if needed
- Communicate in shared channel for handoffs

```
Primary Schedule:
Mon-Thu: Host A (primary)
Fri-Sun: Host B (primary)

Anyone can run as backup if primary is unavailable.
```

### Handoff Checklist

**When stopping:**
1. Announce in coordination channel
2. Stop bot with `Ctrl+C`
3. Wait for clean shutdown
4. Verify bot shows offline in Discord
5. Notify next host

**When starting:**
1. Check bot is offline in Discord
2. Check coordination channel for all-clear
3. Start bot: `npm start`
4. Verify bot shows online
5. Test a command (like `/ping` or `/queue`)
6. Announce you're hosting

### Communication Tools

**Create a private channel/group for hosts:**
- Discord private channel
- Telegram/WhatsApp group
- Slack channel
- Matrix room

**Share information about:**
- Current host
- Start/stop times
- Any issues encountered
- Maintenance updates
- Code changes

## Handling Conflicts

### If Two Hosts Start Simultaneously

**What happens:**
- Discord will disconnect both bots repeatedly
- Bot appears to go online/offline rapidly
- Commands may fail or behave inconsistently

**Solution:**
1. Both hosts stop their bot
2. Coordinate who will run
3. Wait 30 seconds
4. Chosen host starts bot
5. Verify stability

### If Bot Won't Start (Token Already in Use)

```bash
# Check if bot is online in Discord first
# If online but you didn't start it, someone else is running it

# Contact other hosts
# Wait for confirmation they've stopped
# Then start your instance
```

## Updating the Bot

### When Host Makes Code Changes

**Best practice:**

1. **Use Git for version control:**
   ```bash
   git pull origin main  # Get latest changes
   npm install           # Update dependencies
   npm start             # Run updated version
   ```

2. **Coordinate updates:**
   - Announce code changes in coordination channel
   - All hosts pull latest code before their next shift
   - Test updates before passing to next host

3. **Handle breaking changes:**
   - Document any new environment variables needed
   - Update shared `.env` configuration
   - Test thoroughly before handoff

### Dependency Updates

```bash
# Update packages
npm update

# Check for outdated packages
npm outdated

# Update major versions (carefully!)
npm install discord.js@latest
```

**Coordinate with all hosts:**
- Announce dependency updates
- All hosts should update before running
- Test for breaking changes

## Security Best Practices

### Token Security

- ✅ Share token only with trusted hosts
- ✅ Use secure messaging for sharing
- ✅ Regenerate token if compromised
- ✅ Keep `.env` out of Git (`.gitignore`)
- ❌ Never commit token to Git
- ❌ Never post token publicly
- ❌ Don't share with untrusted people

### Regenerating Token (If Compromised)

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Select your application
3. Go to "Bot" tab
4. Click "Reset Token"
5. Copy new token
6. Share securely with all hosts
7. All hosts update their `.env` file
8. Restart bot with new token

### Bot Permissions

**Use least privilege principle:**
- Only grant necessary permissions
- Don't give Administrator
- Review permissions regularly
- Remove unused permissions

**Recommended permissions:**
```
View Channels
Send Messages
Embed Links
Attach Files
Connect (voice)
Speak (voice)
Use Voice Activity
```

## Monitoring & Logs

### Check Bot Status

**From Discord:**
- Bot shows online/offline
- Bot responds to commands
- Check recent messages in music channel

**From Host Machine:**
```bash
# Check if process is running
ps aux | grep node    # macOS/Linux
tasklist | findstr node  # Windows

# View PM2 status (if using PM2)
pm2 status
pm2 logs discord-bot
```

### Common Issues

**Bot appears offline but you're running it:**
- Check console for errors
- Verify token in `.env` is correct
- Check internet connection
- Check Discord API status

**Commands not responding:**
- Bot may still be starting (wait 30 seconds)
- Check console for errors
- Verify bot has permissions
- Check voice channel permissions

**Audio not working:**
- Check FFmpeg is installed
- Verify bot has voice permissions
- Check you're in voice channel
- Check console for errors

## Troubleshooting Multi-Host Issues

### "Invalid Token" Error

**Cause:** Token in `.env` is incorrect or outdated

**Solution:**
1. Verify token with token owner
2. Check for extra spaces/newlines in `.env`
3. Regenerate token if necessary
4. Update all hosts

### Bot Keeps Disconnecting

**Cause:** Multiple hosts running simultaneously

**Solution:**
1. All hosts stop bot
2. Coordinate who will run
3. Only one host starts bot
4. Verify stable connection

### Commands From Previous Host Still Showing

**Normal behavior:** Discord caches command responses

**Wait it out:** Cache clears in a few minutes

### Dependencies Out of Sync

**Cause:** Different hosts have different package versions

**Solution:**
```bash
# Delete and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Advanced: Using Process Managers

### PM2 for Easier Management

**Benefits:**
- Auto-restart on crash
- Easy log viewing
- Status monitoring
- Auto-start on boot

**Setup:**
```bash
npm install -g pm2
pm2 start src/index.js --name discord-bot
pm2 save
```

**Handoff with PM2:**
```bash
# Stopping host
pm2 stop discord-bot

# Starting host
pm2 start discord-bot
pm2 logs
```

## Cost Sharing

If running on cloud hosting:

- Split cloud hosting costs
- Use free tiers (Oracle Free Tier, AWS Free Tier)
- Rotate cloud account ownership
- Share VPS costs monthly

## Example Coordination Channel

Create a text channel or group chat with:

```
📌 Pinned Message:
Current Host: [Name]
Started: [Time]
Contact: [Discord/Phone]

Bot Token: [Securely shared separately]
Client ID: [Securely shared separately]

Schedule:
Mon-Wed: Alice
Thu-Sat: Bob
Sunday: Charlie

Commands:
/play - Play music
/stop - Stop music
Full list: See README.md
```

## FAQ

**Q: Can we run two bots with different tokens?**
A: Yes! You'd need two separate bots in Discord Developer Portal, each with its own token. They can coexist.

**Q: What happens to the queue when hosts change?**
A: Queue is lost. Music stops when one host stops the bot. New host starts fresh.

**Q: Can we share a database between hosts?**
A: Possible with external database (MongoDB, PostgreSQL), but requires additional setup not covered in basic installation.

**Q: How do we know who's currently hosting?**
A: Check your coordination channel, or check if bot is online in Discord.

**Q: What if everyone forgets to host?**
A: Bot goes offline. Set up notifications/reminders for scheduled hosts.

**Q: Can we automate handoffs?**
A: Not easily. Requires external orchestration service. Manual coordination is simplest for small groups.

## Best Practices Summary

1. ✅ Use secure communication for sharing tokens
2. ✅ Keep `.env` out of version control
3. ✅ Coordinate in a private channel
4. ✅ Use scheduled shifts or clear communication
5. ✅ Test before passing to next host
6. ✅ Keep code in sync with Git
7. ✅ Document issues and solutions
8. ✅ Respect the one-at-a-time rule

---

**Remember:** The key to successful multi-host setup is **communication**. Create a private channel, share information, and coordinate handoffs clearly. With good communication, multi-host bot works smoothly!
