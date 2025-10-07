import { useQueue } from 'discord-player';
import { createPlayerEmbed, createQueueEmbed } from '../utils/createPlayerEmbed.js';

/**
 * Handle button interactions for player controls
 * @param {ButtonInteraction} interaction
 */
export async function handlePlayerButton(interaction) {
    const queue = useQueue(interaction.guild.id);

    if (!queue) {
        return interaction.reply({
            content: '❌ No music is currently playing!',
            ephemeral: true
        });
    }

    // Defer reply for processing
    await interaction.deferReply({ ephemeral: true });

    try {
        switch (interaction.customId) {
            case 'player_pause':
                if (queue.node.isPaused()) {
                    queue.node.resume();
                    await interaction.editReply('▶️ Resumed playback');
                } else {
                    queue.node.pause();
                    await interaction.editReply('⏸️ Paused playback');
                }
                // Update the now playing message to reflect pause state
                await updateNowPlayingMessage(interaction, queue);
                break;

            case 'player_skip':
                if (queue.tracks.data.length === 0) {
                    await interaction.editReply('❌ No more songs in queue');
                } else {
                    const skipped = queue.currentTrack.title;
                    queue.node.skip();
                    await interaction.editReply(`⏭️ Skipped: **${skipped}**`);
                }
                break;

            case 'player_stop':
                queue.delete();
                await interaction.editReply('⏹️ Stopped playback and cleared queue');
                break;

            case 'player_shuffle':
                if (queue.tracks.data.length === 0) {
                    await interaction.editReply('❌ Queue is empty');
                } else {
                    queue.tracks.shuffle();
                    await interaction.editReply(`🔀 Shuffled ${queue.tracks.data.length} songs`);
                    // Update now playing message to show new queue count
                    await updateNowPlayingMessage(interaction, queue);
                }
                break;

            case 'player_loop':
                // Cycle through loop modes: 0 (off) → 1 (track) → 2 (queue) → 0
                const currentMode = queue.repeatMode;
                let newMode;
                let modeText;

                if (currentMode === 0) {
                    newMode = 1; // Loop track
                    modeText = '🔁 Loop: Track';
                } else if (currentMode === 1) {
                    newMode = 2; // Loop queue
                    modeText = '🔁 Loop: Queue';
                } else {
                    newMode = 0; // Loop off
                    modeText = '🔁 Loop: Off';
                }

                queue.setRepeatMode(newMode);
                await interaction.editReply(modeText);
                // Update now playing message to show new loop mode
                await updateNowPlayingMessage(interaction, queue);
                break;

            case 'player_queue':
                // Show queue in ephemeral message
                const queueEmbed = createQueueEmbed(queue, 0);
                await interaction.editReply(queueEmbed);
                break;

            default:
                // Handle queue pagination and removal buttons
                if (interaction.customId.startsWith('queue_page_')) {
                    const page = parseInt(interaction.customId.split('_')[2]);
                    const queueEmbed = createQueueEmbed(queue, page);
                    await interaction.update(queueEmbed);
                } else if (interaction.customId.startsWith('queue_remove_')) {
                    const position = parseInt(interaction.customId.split('_')[2]);
                    const track = queue.tracks.data[position];

                    if (!track) {
                        await interaction.update({ content: '❌ Track not found in queue', components: [] });
                        return;
                    }

                    queue.node.remove(position);
                    await interaction.update({
                        content: `✅ Removed: **${track.title}**`,
                        embeds: [],
                        components: []
                    });
                } else if (interaction.customId === 'queue_clear_all') {
                    queue.tracks.clear();
                    await interaction.update({
                        content: '🗑️ Queue cleared!',
                        embeds: [],
                        components: []
                    });
                } else {
                    await interaction.editReply('❌ Unknown button action');
                }
        }
    } catch (error) {
        console.error('[ButtonHandler] Error handling button:', error);
        await interaction.editReply('❌ An error occurred while processing your request').catch(console.error);
    }
}

/**
 * Update the now playing message with current queue state
 * @param {ButtonInteraction} interaction
 * @param {Queue} queue
 */
async function updateNowPlayingMessage(interaction, queue) {
    try {
        const messageData = createPlayerEmbed(queue.currentTrack, queue);
        // Try to update the original message
        if (interaction.message) {
            await interaction.message.edit(messageData);
        }
    } catch (error) {
        console.error('[ButtonHandler] Error updating now playing message:', error);
    }
}
