import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { useMainPlayer } from 'discord-player';
import { formatDuration, createProgressBar } from '../utils/formatTime.js';

export default {
    data: new SlashCommandBuilder()
        .setName('nowplaying')
        .setDescription('Show currently playing song'),

    async execute(interaction) {
        try {
            console.log('[NowPlaying] Command started');

            const player = useMainPlayer();
            const queue = player.queues.get(interaction.guildId);

            // Check if queue exists
            if (!queue) {
                console.log('[NowPlaying] No queue found');
                return interaction.reply({
                    content: '❌ There is no music playing!',
                    ephemeral: true
                });
            }

            const currentTrack = queue.currentTrack;

            if (!currentTrack) {
                console.log('[NowPlaying] No current track');
                return interaction.reply({
                    content: '❌ There is no track currently playing!',
                    ephemeral: true
                });
            }

            console.log('[NowPlaying] Track found:', currentTrack.title);

            // Get current position and duration
            const currentTime = queue.node.getTimestamp();
            const progressBar = createProgressBar(
                currentTime.current.value,
                currentTrack.durationMS,
                20
            );

            // Create embed
            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('🎵 Now Playing')
                .setDescription(`**${currentTrack.title}**`)
                .addFields(
                    { name: '👤 Artist', value: currentTrack.author, inline: true },
                    { name: '⏱️ Duration', value: formatDuration(currentTrack.durationMS), inline: true },
                    { name: '🔊 Volume', value: `${queue.node.volume}%`, inline: true },
                    {
                        name: '⏳ Progress',
                        value: `${formatDuration(currentTime.current.value)} ${progressBar} ${formatDuration(currentTrack.durationMS)}`,
                        inline: false
                    }
                )
                .setThumbnail(currentTrack.thumbnail)
                .setFooter({ text: `Requested by ${currentTrack.requestedBy.username}` })
                .setTimestamp();

            // Add loop status
            const loopMode = queue.repeatMode;
            let loopStatus = 'Off';
            if (loopMode === 1) loopStatus = '🔂 Track';
            else if (loopMode === 2) loopStatus = '🔁 Queue';

            embed.addFields({ name: '🔁 Loop', value: loopStatus, inline: true });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error in nowplaying command:', error);
            console.error('Full error:', error.stack);
            const errorMsg = { content: `❌ Error: ${error.message}`, ephemeral: true };
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp(errorMsg);
            } else {
                await interaction.reply(errorMsg);
            }
        }
    }
};
