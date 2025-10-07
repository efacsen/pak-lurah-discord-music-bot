import { SlashCommandBuilder } from 'discord.js';
import { useMainPlayer } from 'discord-player';

export default {
    data: new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('Shuffle the queue'),

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

            // Check if queue has tracks
            if (queue.tracks.size === 0) {
                return interaction.reply({
                    content: '❌ There are no tracks in the queue to shuffle!',
                    ephemeral: true
                });
            }

            // Shuffle the queue
            queue.tracks.shuffle();
            await interaction.reply(`🔀 Shuffled **${queue.tracks.size}** tracks!`);
        } catch (error) {
            console.error('Error in shuffle command:', error);
            await interaction.reply({
                content: '❌ An error occurred while shuffling the queue!',
                ephemeral: true
            });
        }
    }
};
