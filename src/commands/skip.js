import { SlashCommandBuilder } from 'discord.js';
import { useMainPlayer } from 'discord-player';

export default {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip to the next song'),

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

            // Check if there's a next song
            if (queue.tracks.size === 0) {
                return interaction.reply({
                    content: '⏭️ No more songs in the queue!',
                    ephemeral: true
                });
            }

            // Skip to next song
            queue.node.skip();
            await interaction.reply('⏭️ Skipped to the next song!');
        } catch (error) {
            console.error('Error in skip command:', error);
            const errorMsg = { content: `❌ Error: ${error.message}`, ephemeral: true };
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp(errorMsg);
            } else {
                await interaction.reply(errorMsg);
            }
        }
    }
};
