import { BaseExtractor, QueryType, Track } from 'discord-player';
import playdl from 'play-dl';

export class PlayDLExtractor extends BaseExtractor {
    static identifier = 'com.discord-player.playdlextractor';

    async validate(query, type) {
        try {
            console.log(`[PlayDL] Validating query: "${query}", type: ${type}`);

            // For AUTO queries (which is what we get for search), always try YouTube
            if (type === QueryType.AUTO_SEARCH || type === 'autoSearch') {
                console.log('[PlayDL] Validation passed: AUTO_SEARCH/autoSearch type');
                return true;
            }

            // Check if the query is a YouTube URL or search query
            if (type === QueryType.YOUTUBE_SEARCH) {
                console.log('[PlayDL] Validation passed: YOUTUBE_SEARCH');
                return true;
            }
            if (type === QueryType.YOUTUBE_VIDEO) {
                console.log('[PlayDL] Validation passed: YOUTUBE_VIDEO');
                return true;
            }
            if (type === QueryType.YOUTUBE_PLAYLIST) {
                console.log('[PlayDL] Validation passed: YOUTUBE_PLAYLIST');
                return true;
            }

            // Check if it's a YouTube URL
            const validationType = playdl.yt_validate(query);
            if (validationType !== false) {
                console.log(`[PlayDL] Validation passed: yt_validate returned ${validationType}`);
                return true;
            }

            console.log('[PlayDL] Validation failed: no matching criteria');
            return false;
        } catch (error) {
            console.error('[PlayDL] Validation error:', error);
            return false;
        }
    }

    async handle(query, context) {
        try {
            console.log(`[PlayDL] Handling query: ${query}`);

            const validationType = playdl.yt_validate(query);
            console.log(`[PlayDL] Validation type: ${validationType}`);

            if (validationType === 'playlist') {
                // Handle playlist
                const playlist = await playdl.playlist_info(query, { incomplete: true });
                const videos = await playlist.all_videos();

                const tracks = videos.map(video => new Track(this.context.player, {
                    title: video.title,
                    author: video.channel?.name || 'Unknown',
                    url: video.url,
                    thumbnail: video.thumbnails?.[0]?.url,
                    duration: this.parseDuration(video.durationInSec * 1000),
                    views: video.views,
                    requestedBy: context.requestedBy,
                    source: 'youtube',
                    engine: video,
                    queryType: QueryType.YOUTUBE_PLAYLIST
                }));

                return {
                    playlist: {
                        title: playlist.title,
                        thumbnail: playlist.thumbnail?.url,
                        author: playlist.channel?.name || 'Unknown',
                        url: query,
                        source: 'youtube'
                    },
                    tracks
                };
            } else if (validationType === 'video') {
                // Handle single video URL
                const video = await playdl.video_info(query);
                const videoDetails = video.video_details;

                const track = new Track(this.context.player, {
                    title: videoDetails.title,
                    author: videoDetails.channel?.name || 'Unknown',
                    url: videoDetails.url,
                    thumbnail: videoDetails.thumbnails?.[0]?.url,
                    duration: this.parseDuration(videoDetails.durationInSec * 1000),
                    views: videoDetails.views,
                    requestedBy: context.requestedBy,
                    source: 'youtube',
                    engine: videoDetails,
                    queryType: QueryType.YOUTUBE_VIDEO
                });

                return { tracks: [track] };
            } else {
                // Handle search query
                const searchResults = await playdl.search(query, {
                    limit: 1,
                    source: { youtube: 'video' }
                });

                if (!searchResults || searchResults.length === 0) {
                    console.log('[PlayDL] No search results found');
                    return { tracks: [] };
                }

                const video = searchResults[0];

                const track = new Track(this.context.player, {
                    title: video.title,
                    author: video.channel?.name || 'Unknown',
                    url: video.url,
                    thumbnail: video.thumbnails?.[0]?.url,
                    duration: this.parseDuration(video.durationInSec * 1000),
                    views: video.views,
                    requestedBy: context.requestedBy,
                    source: 'youtube',
                    engine: video,
                    queryType: QueryType.YOUTUBE_SEARCH
                });

                return { tracks: [track] };
            }
        } catch (error) {
            console.error('[PlayDL] Error handling query:', error);
            return { tracks: [] };
        }
    }

    async stream(track) {
        try {
            console.log(`[PlayDL] Getting stream for: ${track.title}`);
            console.log(`[PlayDL] Track URL: ${track.url}`);

            // Get the URL from the track
            const url = track.url || track.raw?.url;

            if (!url) {
                throw new Error('No URL found in track object');
            }

            console.log(`[PlayDL] Fetching video info for: ${url}`);

            // First get video info, then create stream from that info
            const info = await playdl.video_info(url);

            console.log(`[PlayDL] Video info obtained, creating stream...`);

            const stream = await playdl.stream_from_info(info.video_details, {
                quality: 2 // Highest audio quality (0 = lowest, 2 = highest)
            });

            console.log(`[PlayDL] Stream obtained successfully`);

            return stream.stream;
        } catch (error) {
            console.error('[PlayDL] Error getting stream:', error);
            console.error('[PlayDL] Error stack:', error.stack);
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
