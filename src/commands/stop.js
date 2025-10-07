import { SlashCommandBuilder } from 'discord.js';
import { useMainPlayer } from 'discord-player';

export default {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stop playback and clear the queue'),

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

            // Reply first, then stop (queue.delete() can take time)
            await interaction.reply('⏹️ Stopped playback and cleared the queue!');

            // Stop and clear queue
            queue.delete();
        } catch (error) {
            console.error('Error in stop command:', error);
            await interaction.reply({
                content: '❌ An error occurred while trying to stop the music!',
                ephemeral: true
            });
        }
    }
};
