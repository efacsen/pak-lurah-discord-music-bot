import { SlashCommandBuilder } from 'discord.js';
import { useMainPlayer } from 'discord-player';

export default {
    data: new SlashCommandBuilder()
        .setName('jump')
        .setDescription('Jump to a specific track in the queue')
        .addIntegerOption(option =>
            option
                .setName('position')
                .setDescription('Track position in queue (1 = next track)')
                .setRequired(true)
                .setMinValue(1)
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

            const position = interaction.options.getInteger('position');

            // Check if position is valid
            if (position > queue.tracks.size) {
                return interaction.reply({
                    content: `❌ Invalid position! Queue has only ${queue.tracks.size} tracks.`,
                    ephemeral: true
                });
            }

            // Jump to the track (position - 1 because array is 0-indexed)
            const track = queue.tracks.data[position - 1];
            queue.node.skipTo(position - 1);

            await interaction.reply(`⏭️ Jumped to **${track.title}**!`);
        } catch (error) {
            console.error('Error in jump command:', error);
            await interaction.reply({
                content: '❌ An error occurred while jumping to the track!',
                ephemeral: true
            });
        }
    }
};
