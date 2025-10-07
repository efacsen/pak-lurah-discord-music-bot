import { SlashCommandBuilder } from 'discord.js';
import { useMainPlayer } from 'discord-player';

export default {
    data: new SlashCommandBuilder()
        .setName('loop')
        .setDescription('Set loop mode')
        .addStringOption(option =>
            option
                .setName('mode')
                .setDescription('Loop mode')
                .setRequired(true)
                .addChoices(
                    { name: 'Off', value: 'off' },
                    { name: 'Track', value: 'track' },
                    { name: 'Queue', value: 'queue' }
                )
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

            const mode = interaction.options.getString('mode');

            // Set loop mode
            switch (mode) {
                case 'off':
                    queue.setRepeatMode(0); // OFF
                    await interaction.reply('🔁 Loop mode: **Off**');
                    break;
                case 'track':
                    queue.setRepeatMode(1); // TRACK
                    await interaction.reply('🔂 Loop mode: **Track**');
                    break;
                case 'queue':
                    queue.setRepeatMode(2); // QUEUE
                    await interaction.reply('🔁 Loop mode: **Queue**');
                    break;
            }
        } catch (error) {
            console.error('Error in loop command:', error);
            await interaction.reply({
                content: '❌ An error occurred while setting loop mode!',
                ephemeral: true
            });
        }
    }
};
