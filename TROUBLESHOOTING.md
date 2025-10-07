# Troubleshooting Guide

## YouTube Playback Issue (October 2025)

### Problem
The Discord music bot was able to play YouTube songs normally but suddenly stopped working. Symptoms included:
- Bot connects to voice channel
- Bot sends "Now playing" message
- Playback stops immediately after ~120ms
- Track shows as "finished" without actually playing

### Root Cause
**YouTube changed their video streaming API/encryption in October 2025**, breaking multiple YouTube extraction libraries:

1. **ytdl-core** - The original library was **archived/abandoned in August 2025**
2. **discord-player-youtube** - Uses youtubei.js which couldn't parse YouTube's new signature decipher function
3. **play-dl** - Also broken due to YouTube API changes (format data extraction failure)

All these libraries relied on parsing YouTube's JavaScript player code to extract stream URLs, which YouTube frequently changes to prevent scraping.

### Solution
Replace broken YouTube extractors with **yt-dlp**, which is:
- Actively maintained (updated September 2025)
- Used by professional Discord bots
- Handles YouTube's frequent API changes
- More robust against YouTube anti-bot measures

### Implementation Steps

#### 1. Install yt-dlp System-Wide
```bash
# macOS (Homebrew)
brew install yt-dlp

# Linux (Ubuntu/Debian)
sudo curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp
sudo chmod a+rx /usr/local/bin/yt-dlp

# Windows (chocolatey)
choco install yt-dlp

# Or use pip
pip install yt-dlp
```

#### 2. Install yt-dlp-wrap NPM Package
```bash
npm install yt-dlp-wrap
```

#### 3. Create Custom Extractor
Create `src/extractors/YtDlpExtractor.js`:

```javascript
import { BaseExtractor, QueryType, Track } from 'discord-player';
import pkg from 'yt-dlp-wrap';
const { default: YTDlpWrap } = pkg;

export class YtDlpExtractor extends BaseExtractor {
    static identifier = 'com.discord-player.ytdlpextractor';

    constructor(context, options) {
        super(context, options);
        // Use system yt-dlp installation
        // Adjust path based on your OS:
        // macOS (Homebrew): /opt/homebrew/bin/yt-dlp
        // Linux: /usr/local/bin/yt-dlp
        // Windows: C:\\ProgramData\\chocolatey\\bin\\yt-dlp.exe
        this.ytDlp = new YTDlpWrap('/opt/homebrew/bin/yt-dlp');
    }

    async activate() {
        try {
            const version = await this.ytDlp.getVersion();
            console.log('[YtDlp] Using yt-dlp version:', version);
        } catch (error) {
            console.error('[YtDlp] Failed to initialize yt-dlp:', error);
            throw error;
        }
    }

    async validate(query, type) {
        try {
            if (type === QueryType.AUTO_SEARCH || type === 'autoSearch') return true;
            if (type === QueryType.YOUTUBE_SEARCH) return true;
            if (type === QueryType.YOUTUBE_VIDEO) return true;
            if (type === QueryType.YOUTUBE_PLAYLIST) return true;

            const ytRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
            return ytRegex.test(query);
        } catch (error) {
            console.error('[YtDlp] Validation error:', error);
            return false;
        }
    }

    async handle(query, context) {
        try {
            console.log(`[YtDlp] Handling query: ${query}`);

            const searchQuery = query.startsWith('http') ? query : `ytsearch1:${query}`;
            const info = await this.ytDlp.getVideoInfo([searchQuery, '--no-playlist']);

            const entries = info.entries || [info];
            const tracks = entries.slice(0, 1).map(video => {
                return new Track(this.context.player, {
                    title: video.title,
                    author: video.uploader || video.channel || 'Unknown',
                    url: video.webpage_url || video.url,
                    thumbnail: video.thumbnail,
                    duration: this.parseDuration(video.duration * 1000),
                    views: video.view_count || 0,
                    requestedBy: context.requestedBy,
                    source: 'youtube',
                    engine: video,
                    queryType: query.startsWith('http') ? QueryType.YOUTUBE_VIDEO : QueryType.YOUTUBE_SEARCH
                });
            });

            console.log(`[YtDlp] Found ${tracks.length} track(s)`);
            return { tracks };
        } catch (error) {
            console.error('[YtDlp] Error handling query:', error);
            return { tracks: [] };
        }
    }

    async stream(track) {
        try {
            console.log(`[YtDlp] Getting stream for: ${track.title}`);
            console.log(`[YtDlp] Track URL: ${track.url}`);

            const url = track.url || track.raw?.url;
            if (!url) throw new Error('No URL found in track object');

            const streamUrl = await this.ytDlp.execPromise([
                url,
                '-f', 'bestaudio',
                '-g',
                '--no-playlist'
            ]);

            const directUrl = streamUrl.trim().split('\n')[0];
            console.log(`[YtDlp] Stream URL obtained`);

            return directUrl;
        } catch (error) {
            console.error('[YtDlp] Error getting stream:', error);
            throw error;
        }
    }

    parseDuration(durationMs) {
        const seconds = Math.floor(durationMs / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);

        if (hours > 0) {
            return `${hours}:${String(minutes % 60).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
        }
        return `${minutes}:${String(seconds % 60).padStart(2, '0')}`;
    }
}
```

#### 4. Update index.js
Replace the broken YouTube extractor import:

```javascript
// OLD (broken)
import { YouTubeExtractor } from 'discord-player-youtube';

// NEW (working)
import { YtDlpExtractor } from './extractors/YtDlpExtractor.js';
```

And update the registration:

```javascript
// OLD (broken)
await player.extractors.register(YouTubeExtractor, {
    streamOptions: {
        useClient: ['ANDROID', 'WEB'],
        highWaterMark: 1 << 25
    }
});

// NEW (working)
await player.extractors.register(YtDlpExtractor, {});
```

### Why This Solution Works

1. **yt-dlp is actively maintained** - Updated regularly to handle YouTube changes
2. **Industry standard** - Used by major projects (youtube-dl successor)
3. **Robust** - Handles YouTube's anti-bot measures better than JavaScript-based scrapers
4. **Future-proof** - Community updates it whenever YouTube makes changes

### Alternative Solutions Tested (All Failed)

1. ❌ **discord-player-youtubei** - Uses broken youtubei.js
2. ❌ **play-dl with cookies** - Format extraction still broken
3. ❌ **@distube/ytdl-core** - Maintained fork, but still based on broken architecture
4. ❌ **Updating existing packages** - Core libraries are fundamentally broken

### Verification

After implementing the fix, you should see:
```
[YtDlp] Using yt-dlp version: 2025.09.26
[YtDlp] Handling query: twice the best thing i ever had
[YtDlp] Found 1 track(s)
[YtDlp] Stream URL obtained
▶️ Now playing: TWICE "The Best Thing I Ever Did(올해 제일 잘한 일)" M/V
```

### Future Maintenance

If YouTube playback breaks again:
1. Update yt-dlp: `brew upgrade yt-dlp` (macOS) or equivalent for your OS
2. Check yt-dlp GitHub for known issues: https://github.com/yt-dlp/yt-dlp
3. Consider using yt-dlp's `--update` flag for automatic updates

### Related Issues

- YouTube signature decipher errors
- HTTP 403 errors from YouTube
- "Could not extract stream" errors
- Tracks finishing immediately after starting
- "No results found" despite valid query

All of these symptoms indicate the same root cause: YouTube extraction library incompatibility with current YouTube API.
