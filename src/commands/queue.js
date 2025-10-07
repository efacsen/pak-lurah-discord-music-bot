import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { useMainPlayer } from 'discord-player';
import { formatDuration } from '../utils/formatTime.js';

export default {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Display the current queue'),

    async execute(interaction) {
        try {
            // Check if user is in a voice channel
            if (!interaction.member.voice.channel) {
                return interaction.reply({
                    content: '❌ You need to be in a voice channel!',
                    ephemeral: true
                });
            }

            const player = useMainPlayer();
            const queue = player.queues.get(interaction.guildId);

            // Check if queue exists
            if (!queue) {
                return interaction.reply({
                    content: '❌ There is no music playing!',
                    ephemeral: true
                });
            }

            const currentTrack = queue.currentTrack;
            const tracks = queue.tracks.data;

            // Create embed
            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('🎵 Music Queue')
                .setTimestamp();

            // Add current track
            if (currentTrack) {
                embed.addFields({
                    name: '▶️ Now Playing',
                    value: `**[${currentTrack.title}](${currentTrack.url})**\n${currentTrack.author} - ${formatDuration(currentTrack.durationMS)}\nRequested by ${currentTrack.requestedBy.username}`,
                    inline: false
                });
            }

            // Add upcoming tracks (max 10)
            if (tracks.length > 0) {
                const upcomingTracks = tracks.slice(0, 10);
                const trackList = upcomingTracks
                    .map((track, index) => `**${index + 1}.** ${track.title} - ${formatDuration(track.durationMS)}`)
                    .join('\n');

                embed.addFields({
                    name: `📋 Up Next (${tracks.length} tracks)`,
                    value: trackList,
                    inline: false
                });

                if (tracks.length > 10) {
                    embed.setFooter({ text: `And ${tracks.length - 10} more...` });
                }
            } else {
                embed.addFields({
                    name: '📋 Up Next',
                    value: 'No more tracks in queue',
                    inline: false
                });
            }

            // Add queue info
            const totalDuration = tracks.reduce((acc, track) => acc + track.durationMS, 0);
            embed.addFields({
                name: '📊 Queue Info',
                value: `**Total tracks:** ${tracks.length}\n**Total duration:** ${formatDuration(totalDuration)}`,
                inline: false
            });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error in queue command:', error);
            await interaction.reply({
                content: '❌ An error occurred while fetching the queue!',
                ephemeral: true
            });
        }
    }
};
