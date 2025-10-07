import { SlashCommandBuilder } from 'discord.js';
import { useMainPlayer } from 'discord-player';
import { parseTimeString, formatDuration } from '../utils/formatTime.js';

export default {
    data: new SlashCommandBuilder()
        .setName('seek')
        .setDescription('Seek to a specific time in the current track')
        .addStringOption(option =>
            option
                .setName('time')
                .setDescription('Time to seek to (format: MM:SS or HH:MM:SS)')
                .setRequired(true)
        ),

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

            // Check if user is in the same voice channel as the bot
            if (interaction.member.voice.channelId !== queue.metadata.voiceChannel.id) {
                return interaction.reply({
                    content: '❌ You need to be in the same voice channel as the bot!',
                    ephemeral: true
                });
            }

            const timeString = interaction.options.getString('time');
            const seekTime = parseTimeString(timeString);

            // Validate time string
            if (seekTime === null) {
                return interaction.reply({
                    content: '❌ Invalid time format! Use MM:SS or HH:MM:SS',
                    ephemeral: true
                });
            }

            const currentTrack = queue.currentTrack;

            // Check if seek time is within track duration
            if (seekTime > currentTrack.durationMS) {
                return interaction.reply({
                    content: `❌ Seek time exceeds track duration! Track length: ${formatDuration(currentTrack.durationMS)}`,
                    ephemeral: true
                });
            }

            // Seek to the specified time
            await queue.node.seek(seekTime);
            await interaction.reply(`⏩ Seeked to **${formatDuration(seekTime)}**!`);
        } catch (error) {
            console.error('Error in seek command:', error);
            await interaction.reply({
                content: '❌ An error occurred while seeking!',
                ephemeral: true
            });
        }
    }
};
