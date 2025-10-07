import { SlashCommandBuilder } from 'discord.js';
import { useMainPlayer } from 'discord-player';

export default {
    data: new SlashCommandBuilder()
        .setName('bassboost')
        .setDescription('Toggle bassboost filter'),

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

            await interaction.deferReply();

            // Toggle bassboost filter
            const filters = queue.filters.ffmpeg;
            const bassboostEnabled = filters.filters.includes('bassboost');

            if (bassboostEnabled) {
                await filters.toggle('bassboost');
                await interaction.editReply('🎚️ Bassboost **disabled**!');
            } else {
                await filters.toggle('bassboost');
                await interaction.editReply('🎚️ Bassboost **enabled**!');
            }
        } catch (error) {
            console.error('Error in bassboost command:', error);
            console.error('Full error:', error.stack);

            const errorMessage = `❌ Error: ${error.message}`;
            if (interaction.deferred) {
                await interaction.editReply(errorMessage);
            } else {
                await interaction.reply({ content: errorMessage, ephemeral: true });
            }
        }
    }
};
