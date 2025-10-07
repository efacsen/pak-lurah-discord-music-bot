import { SlashCommandBuilder } from 'discord.js';
import { useMainPlayer } from 'discord-player';

export default {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play a song from YouTube')
        .addStringOption(option =>
            option
                .setName('query')
                .setDescription('Song name or YouTube URL')
                .setRequired(true)
        ),

    async execute(interaction) {
        try {
            console.log(`[Play Command] User: ${interaction.user.tag}, Query: ${interaction.options.getString('query')}`);

            // Check if user is in a voice channel
            if (!interaction.member.voice.channel) {
                console.log('[Play Command] User not in voice channel');
                return interaction.reply({
                    content: '❌ You need to be in a voice channel to play music!',
                    ephemeral: true
                });
            }

            // Check if bot has permissions to join and speak
            const permissions = interaction.member.voice.channel.permissionsFor(interaction.client.user);
            if (!permissions.has('Connect') || !permissions.has('Speak')) {
                console.log('[Play Command] Bot lacks voice permissions');
                return interaction.reply({
                    content: '❌ I need permission to join and speak in your voice channel!',
                    ephemeral: true
                });
            }

            await interaction.deferReply();

            const player = useMainPlayer();
            const query = interaction.options.getString('query');

            console.log(`[Play Command] Searching for: ${query}`);

            // Search for the track - use 'auto' to let discord-player handle it
            const searchResult = await player.search(query, {
                requestedBy: interaction.user
            });

            console.log(`[Play Command] Search result:`, {
                hasResult: !!searchResult,
                tracksCount: searchResult?.tracks?.length || 0,
                isPlaylist: !!searchResult?.playlist,
                playlistTitle: searchResult?.playlist?.title,
                error: searchResult?.error
            });

            if (!searchResult || !searchResult.tracks.length) {
                console.error('[Play Command] No results found. Full result:', JSON.stringify(searchResult, null, 2));
                return interaction.editReply('❌ No results found! Make sure the URL is valid.');
            }

            // Get or create queue
            let queue = player.queues.get(interaction.guildId);

            if (!queue) {
                queue = player.queues.create(interaction.guildId, {
                    metadata: {
                        channel: interaction.channel,
                        voiceChannel: interaction.member.voice.channel
                    },
                    leaveOnEmpty: true,
                    leaveOnEmptyCooldown: 300000, // 5 minutes
                    leaveOnEnd: true,
                    leaveOnEndCooldown: 300000, // 5 minutes
                    volume: 50,
                    bufferingTimeout: 3000
                });
            }

            // Connect to voice channel if not connected
            if (!queue.connection) {
                await queue.connect(interaction.member.voice.channel);
            }

            // Add track(s) to queue
            if (searchResult.playlist) {
                queue.addTrack(searchResult.tracks);
                await interaction.editReply(
                    `✅ Added **${searchResult.tracks.length}** tracks from playlist: **${searchResult.playlist.title}**`
                );
            } else {
                const track = searchResult.tracks[0];
                queue.addTrack(track);

                if (!queue.node.isPlaying()) {
                    await interaction.editReply(`🎶 Now playing: **${track.title}**`);
                } else {
                    await interaction.editReply(`✅ Added to queue: **${track.title}**`);
                }
            }

            // Start playing if not already playing
            if (!queue.node.isPlaying()) {
                await queue.node.play();
            }
        } catch (error) {
            console.error('Error in play command:', error);
            const errorMessage = '❌ An error occurred while trying to play the song!';

            if (interaction.deferred) {
                await interaction.editReply(errorMessage);
            } else {
                await interaction.reply({ content: errorMessage, ephemeral: true });
            }
        }
    }
};
