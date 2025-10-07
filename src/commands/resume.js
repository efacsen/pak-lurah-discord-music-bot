import { SlashCommandBuilder } from 'discord.js';
import { useMainPlayer } from 'discord-player';

export default {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('Resume the paused song'),

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

            // Check if already playing
            if (!queue.node.isPaused()) {
                return interaction.reply({
                    content: '▶️ The music is already playing!',
                    ephemeral: true
                });
            }

            // Resume the music
            queue.node.resume();
            await interaction.reply('▶️ Music resumed!');
        } catch (error) {
            console.error('Error in resume command:', error);
            const errorMsg = { content: `❌ Error: ${error.message}`, ephemeral: true };
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp(errorMsg);
            } else {
                await interaction.reply(errorMsg);
            }
        }
    }
};
