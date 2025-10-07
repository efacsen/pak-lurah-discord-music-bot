import { SlashCommandBuilder } from 'discord.js';
import { useMainPlayer } from 'discord-player';

export default {
    data: new SlashCommandBuilder()
        .setName('back')
        .setDescription('Play the previous track'),

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

            // Check if there's a previous track in history
            if (!queue.history.previousTrack) {
                return interaction.reply({
                    content: '❌ There is no previous track!',
                    ephemeral: true
                });
            }

            // Go back to previous track
            await queue.history.back();
            await interaction.reply('⏮️ Playing previous track!');
        } catch (error) {
            console.error('Error in back command:', error);
            await interaction.reply({
                content: '❌ An error occurred while going back to the previous track!',
                ephemeral: true
            });
        }
    }
};
