# 🎵 Pak Lurah Discord Music Bot

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

A modern, feature-rich Discord music bot with YouTube support built on Discord.js v14 and discord-player v7.

> **⚠️ DISCLAIMER:** This bot is built in my free time as a hobby project. Support is provided on a best-effort basis. While I'll do my best to fix issues and improve the bot, response times may vary. Contributions from the community are always welcome!

## ✨ Features

- 🎵 **Play music from YouTube** (search or direct URLs)
- 📋 **Queue management** with rich embeds
- ⏯️ **Full playback controls** (play, pause, resume, skip, stop)
- 🔊 **Audio controls** (volume, seek, loop modes)
- 🎚️ **Audio filters** (bassboost)
- 📊 **Beautiful displays** for now playing and queue
- 🔄 **Loop modes**: Off, Track, Queue
- ⏮️ **Previous track support**
- 🔀 **Queue shuffling**
- ⏭️ **Jump to specific tracks**
- 🌐 **Cross-platform** (Windows, macOS, Linux)
- 🤝 **Multi-host support** (share hosting with friends)

## 📋 Commands

| Command | Description | Usage |
|---------|-------------|-------|
| `/play` | Play a song or playlist | `/play <song name or URL>` |
| `/pause` | Pause the current song | `/pause` |
| `/resume` | Resume playback | `/resume` |
| `/skip` | Skip to the next song | `/skip` |
| `/stop` | Stop playback and clear queue | `/stop` |
| `/queue` | Display the current queue | `/queue` |
| `/nowplaying` | Show currently playing song | `/nowplaying` |
| `/volume` | Set volume (0-100) | `/volume <amount>` |
| `/loop` | Set loop mode | `/loop <off\|track\|queue>` |
| `/shuffle` | Shuffle the queue | `/shuffle` |
| `/seek` | Seek to a timestamp | `/seek <MM:SS>` |
| `/jump` | Jump to a track in queue | `/jump <position>` |
| `/back` | Play previous track | `/back` |
| `/bassboost` | Toggle bassboost filter | `/bassboost` |

## 🚀 Quick Start

### ⚡ One-Command Setup (Recommended for Non-Technical Users)

**macOS/Linux:**
```bash
git clone https://github.com/efacsen/pak-lurah-discord-music-bot.git
cd pak-lurah-discord-music-bot
chmod +x setup.sh
./setup.sh
```

**Windows:**
```powershell
git clone https://github.com/efacsen/pak-lurah-discord-music-bot.git
cd pak-lurah-discord-music-bot
setup.bat
```

The setup script will automatically:
- ✅ Install all required dependencies (Node.js, FFmpeg, yt-dlp)
- ✅ Configure your Discord bot credentials
- ✅ Set up the bot for first run
- ✅ Verify everything is working

After setup completes, start the bot with:
```bash
# macOS/Linux
./start.sh

# Windows
start.bat
```

---

### 🔧 Manual Installation (For Advanced Users)

<details>
<summary>Click to expand manual setup instructions</summary>

#### Prerequisites

- **Node.js** v18 or higher
- **FFmpeg** (required for audio processing)
- **yt-dlp** (required for YouTube playback)
- **Discord Bot Token**

#### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/efacsen/pak-lurah-discord-music-bot.git
   cd pak-lurah-discord-music-bot
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Install system dependencies:**
   - **Windows:** `choco install ffmpeg yt-dlp` (see [SETUP-WINDOWS.md](docs/SETUP-WINDOWS.md))
   - **macOS:** `brew install ffmpeg yt-dlp` (see [SETUP-MAC.md](docs/SETUP-MAC.md))
   - **Linux:** `sudo apt install ffmpeg && pip install yt-dlp`

4. **Create a Discord bot:**
   - Go to [Discord Developer Portal](https://discord.com/developers/applications)
   - Create a new application
   - Go to "Bot" tab and create a bot
   - Enable **Server Members Intent** and **Message Content Intent**
   - Copy the bot token

5. **Configure the bot:**
   ```bash
   # Copy the example environment file
   cp .env.example .env

   # Edit .env and add your credentials
   ```

   Required in `.env`:
   ```env
   DISCORD_CLIENT_TOKEN=your_bot_token_here
   DISCORD_CLIENT_ID=your_client_id_here
   DISCORD_GUILD_ID=optional_for_testing
   ```

6. **Invite the bot to your server:**
   ```
   https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=36700160&scope=bot%20applications.commands
   ```
   Replace `YOUR_CLIENT_ID` with your actual Client ID.

7. **Check system requirements:**
   ```bash
   npm run check
   ```

8. **Start the bot:**
   ```bash
   npm start
   ```

</details>

## 📖 Detailed Setup Guides

- **Windows Users:** See [docs/SETUP-WINDOWS.md](docs/SETUP-WINDOWS.md)
- **macOS Users:** See [docs/SETUP-MAC.md](docs/SETUP-MAC.md)
- **Multi-Host Setup:** See [docs/HOSTING-GUIDE.md](docs/HOSTING-GUIDE.md)

## 🎮 Usage

1. **Start the bot** with `npm start`
2. **Join a voice channel** in your Discord server
3. **Use slash commands**:
   - `/play never gonna give you up`
   - `/play https://www.youtube.com/watch?v=dQw4w9WgXcQ`
   - `/volume 75`
   - `/loop track`

## 🛠️ Development

**Run in development mode** (auto-reload on changes):
```bash
npm run dev
```

**Check system requirements:**
```bash
npm run check
```

## 📁 Project Structure

```
discord-music-bot/
├── src/
│   ├── commands/          # All slash commands
│   │   ├── play.js       # Play music from YouTube
│   │   ├── pause.js      # Pause playback
│   │   ├── resume.js     # Resume playback
│   │   ├── skip.js       # Skip track
│   │   ├── stop.js       # Stop and clear queue
│   │   ├── queue.js      # Display queue
│   │   ├── nowplaying.js # Current track info
│   │   ├── volume.js     # Volume control
│   │   ├── loop.js       # Loop modes
│   │   ├── shuffle.js    # Shuffle queue
│   │   ├── seek.js       # Seek to timestamp
│   │   ├── jump.js       # Jump to track
│   │   ├── back.js       # Previous track
│   │   └── bassboost.js  # Audio filter
│   ├── events/
│   │   ├── ready.js              # Bot ready event
│   │   └── interactionCreate.js # Command handler
│   ├── utils/
│   │   └── formatTime.js         # Time utilities
│   └── index.js                  # Main entry point
├── docs/
│   ├── SETUP-WINDOWS.md   # Windows setup guide
│   ├── SETUP-MAC.md       # macOS setup guide
│   └── HOSTING-GUIDE.md   # Multi-host guide
├── .env.example           # Environment template
├── .gitignore
├── check-system.js        # System checker
├── package.json
├── Dockerfile
├── docker-compose.yml
└── README.md
```

## 🐳 Docker Support

**Build and run with Docker:**
```bash
docker-compose up -d
```

**View logs:**
```bash
docker-compose logs -f bot
```

**Stop:**
```bash
docker-compose down
```

## 🔒 Security & Best Practices

### ✅ DO:
- Keep `.env` file private and secure
- Use environment variables for tokens
- Regularly update dependencies
- Use specific bot permissions (not Administrator)
- Keep FFmpeg and Node.js updated

### ❌ DON'T:
- Commit `.env` to Git (it's in `.gitignore`)
- Share your bot token publicly
- Give bot admin permissions
- Run multiple instances with same token simultaneously

## 🤝 Multi-Host Shared Hosting

This bot supports shared hosting where multiple people can take turns running it!

**Key points:**
- ✅ Multiple people can have the code
- ✅ Share the bot token securely
- ❌ Only ONE person can run it at a time

See [docs/HOSTING-GUIDE.md](docs/HOSTING-GUIDE.md) for detailed instructions on:
- Coordinating between hosts
- Secure token sharing
- Handoff procedures
- Troubleshooting multi-host issues

## 🐛 Troubleshooting

**Having issues?** Check the comprehensive [TROUBLESHOOTING.md](TROUBLESHOOTING.md) guide for detailed solutions.

**YouTube not playing?** See [YouTube Playback Fix (October 2025)](TROUBLESHOOTING.md#youtube-playback-issue-october-2025)

### Bot doesn't start

1. **Check Node.js version:** `node --version` (must be v18+)
2. **Check .env file:** Ensure token and client ID are correct
3. **Run system check:** `npm run check`
4. **Check console logs:** Look for error messages

### No slash commands appearing

**Option 1:** Wait up to 1 hour for global commands to register

**Option 2:** Use guild commands for instant updates:
1. Add your test server ID to `.env`:
   ```env
   DISCORD_GUILD_ID=your_server_id_here
   ```
2. Restart the bot
3. Commands appear instantly in that server!

### "FFmpeg not found" error

FFmpeg is required for audio processing!

- **Windows:** `choco install ffmpeg` or download from [ffmpeg.org](https://ffmpeg.org/download.html)
- **macOS:** `brew install ffmpeg`
- **Linux:** `sudo apt install ffmpeg`

After installing, restart your terminal and verify: `ffmpeg -version`

### No audio playing

1. Verify FFmpeg is installed: `ffmpeg -version`
2. Check bot has "Connect" and "Speak" permissions
3. Ensure you're in a voice channel
4. Check bot can see/access the voice channel
5. Check console for error messages

### "Cannot find module" errors

```bash
# Delete and reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Bot shows online but commands don't work

1. Check bot has "Use Application Commands" permission
2. Re-invite bot with correct permissions
3. Wait for commands to register (or use guild commands)
4. Check console for errors

## 💡 Tips & Tricks

- Use `DISCORD_GUILD_ID` during development for instant command updates
- Check `npm run check` before reporting issues
- Keep dependencies updated: `npm update`
- Use PM2 for production deployments
- Monitor console logs for useful debugging information

## 🌟 Features in Detail

### Queue Management
- View up to 10 upcoming tracks
- Total queue duration calculation
- Track position and metadata
- Rich embed display

### Loop Modes
- **Off:** Play through queue once
- **Track:** Repeat current track
- **Queue:** Repeat entire queue

### Audio Controls
- Volume: 0-100%
- Seek: Jump to specific timestamp (MM:SS format)
- Bassboost: Enhanced bass filter

### Smart Features
- Auto-disconnect on empty channel (5 min)
- Auto-disconnect when queue ends (5 min)
- Error recovery and graceful handling
- Cross-platform compatibility

## 📊 System Requirements

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| Node.js | v18.0.0 | v20.x (LTS) |
| RAM | 512 MB | 1 GB |
| Disk Space | 200 MB | 500 MB |
| Internet | Stable connection | Broadband |
| FFmpeg | Any version | Latest |

## 🔄 Updates & Maintenance

**Update dependencies:**
```bash
npm update
```

**Check for outdated packages:**
```bash
npm outdated
```

**Update Node.js:**
- Windows: Download from [nodejs.org](https://nodejs.org/)
- macOS: `brew upgrade node`
- Linux: Use your package manager

## 🎯 Roadmap

Potential future features:
- [ ] Spotify support
- [ ] SoundCloud support
- [ ] Playlist management
- [ ] User favorites/playlists
- [ ] Web dashboard
- [ ] Queue history
- [ ] Lyrics display
- [ ] More audio filters

## 🤔 FAQ

**Q: Why Node.js v18+?**
A: Required for ES modules and modern discord.js features.

**Q: Why is FFmpeg required?**
A: FFmpeg handles audio processing and encoding for voice playback.

**Q: Can I run multiple bots?**
A: Yes, create separate applications in Discord Developer Portal with different tokens.

**Q: Can multiple people run the same bot?**
A: Only one at a time with the same token. See [HOSTING-GUIDE.md](docs/HOSTING-GUIDE.md).

**Q: Does this work on Raspberry Pi?**
A: Yes, but performance may vary. Use Raspberry Pi 4 with 2GB+ RAM.

**Q: Is this bot free?**
A: Yes, 100% free and open-source.

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

## 👤 Author

**efacsen**

## ⚠️ Important Disclaimers

### Free-Time Hobby Project
This Discord music bot is developed and maintained in my free time as a hobby project. Please understand:

- **Best-Effort Support**: I provide support when I have time available. Response times to issues and questions may vary.
- **No Warranty**: This software is provided "as is" without warranty of any kind (see [MIT License](LICENSE) for full details).
- **No SLA**: There are no service level agreements or guaranteed uptime/availability.
- **Breaking Changes**: Updates may introduce breaking changes as the project evolves.

### YouTube API Changes
YouTube frequently updates their API to prevent bots. While this bot uses yt-dlp (the most robust solution), playback may occasionally break. Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md) if issues occur.

### Community Contributions Welcome
I appreciate and welcome contributions from the community! If you find bugs or have feature ideas:
- Open an issue to report problems
- Submit pull requests for improvements
- Help other users in discussions
- Share your experiences and tips

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to contribute.

## 🙏 Acknowledgments

- [discord.js](https://discord.js.org/) - Discord API library
- [discord-player](https://discord-player.js.org/) - Music player library
- [yt-dlp](https://github.com/yt-dlp/yt-dlp) - YouTube downloader (industry standard)
- [yt-dlp-wrap](https://github.com/foxesdocode/yt-dlp-wrap) - Node.js wrapper for yt-dlp
- FFmpeg - Audio processing

## 📞 Support

- Check [docs/](docs/) for detailed guides
- Run `npm run check` to diagnose issues
- Check console logs for error messages
- Ensure all prerequisites are installed

---

**Made with ❤️ for the Discord community**

🎵 Enjoy your music bot!
