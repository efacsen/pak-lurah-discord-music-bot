import { BaseExtractor, QueryType, Track } from 'discord-player';
import pkg from 'yt-dlp-wrap';
const { default: YTDlpWrap } = pkg;

export class YtDlpExtractor extends BaseExtractor {
    static identifier = 'com.discord-player.ytdlpextractor';

    constructor(context, options) {
        super(context, options);
        // Use system yt-dlp installation
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
            // For AUTO queries (which is what we get for search), always try YouTube
            if (type === QueryType.AUTO_SEARCH || type === 'autoSearch') {
                return true;
            }

            // Check if the query is a YouTube URL or search query
            if (type === QueryType.YOUTUBE_SEARCH) return true;
            if (type === QueryType.YOUTUBE_VIDEO) return true;
            if (type === QueryType.YOUTUBE_PLAYLIST) return true;

            // Check if it's a YouTube URL
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

            // For direct URLs, return single result. For searches, return top 3
            const isDirectUrl = query.startsWith('http');
            const searchQuery = isDirectUrl ? query : `ytsearch3:${query}`;

            // Use execPromise to get raw JSON output for better control
            const jsonOutput = await this.ytDlp.execPromise([
                searchQuery,
                '--dump-json',
                '--no-playlist',
                '--flat-playlist'
            ]);

            // Parse each line as JSON (yt-dlp outputs one JSON object per line for searches)
            const lines = jsonOutput.trim().split('\n').filter(line => line.trim());
            const results = lines.map(line => JSON.parse(line));

            console.log(`[YtDlp] Raw results count: ${results.length}`);

            // Limit to requested number
            const maxResults = isDirectUrl ? 1 : 3;
            const limitedResults = results.slice(0, maxResults);

            const tracks = limitedResults.map(video => {
                return new Track(this.context.player, {
                    title: video.title,
                    author: video.uploader || video.channel || video.uploader_id || 'Unknown',
                    url: video.webpage_url || video.url || `https://www.youtube.com/watch?v=${video.id}`,
                    thumbnail: video.thumbnail || video.thumbnails?.[0]?.url,
                    duration: this.parseDuration((video.duration || 0) * 1000),
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

            if (!url) {
                throw new Error('No URL found in track object');
            }

            // Use yt-dlp to get the best audio stream URL
            const streamUrl = await this.ytDlp.execPromise([
                url,
                '-f', 'bestaudio',
                '-g', // Get direct URL
                '--no-playlist'
            ]);

            const directUrl = streamUrl.trim().split('\n')[0];
            console.log(`[YtDlp] Stream URL obtained`);

            // Return the direct URL as a string - discord-player will handle creating the stream
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
