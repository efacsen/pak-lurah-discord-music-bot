import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

/**
 * Creates a rich embed for the now playing message
 * @param {Track} track - The currently playing track
 * @param {Queue} queue - The player queue
 * @returns {Object} { embed, components }
 */
export function createPlayerEmbed(track, queue) {
    const embed = new EmbedBuilder()
        .setColor('#5865F2') // Discord Blurple
        .setTitle('🎵 Now Playing')
        .setDescription(`**${track.title}**`)
        .addFields(
            { name: '👤 Artist', value: track.author || 'Unknown', inline: true },
            { name: '⏱️ Duration', value: track.duration || 'Unknown', inline: true },
            { name: '📝 Requested by', value: track.requestedBy?.tag || 'Unknown', inline: true }
        )
        .setThumbnail(track.thumbnail || null)
        .setFooter({
            text: `Queue: ${queue.tracks.data.length} song${queue.tracks.data.length !== 1 ? 's' : ''} remaining`
        })
        .setTimestamp();

    // Create button controls
    const row1 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('player_pause')
            .setLabel(queue.node.isPaused() ? 'Resume' : 'Pause')
            .setEmoji(queue.node.isPaused() ? '▶️' : '⏸️')
            .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
            .setCustomId('player_skip')
            .setLabel('Skip')
            .setEmoji('⏭️')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(queue.tracks.data.length === 0),
        new ButtonBuilder()
            .setCustomId('player_stop')
            .setLabel('Stop')
            .setEmoji('⏹️')
            .setStyle(ButtonStyle.Danger)
    );

    const row2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('player_shuffle')
            .setLabel('Shuffle')
            .setEmoji('🔀')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(queue.tracks.data.length === 0),
        new ButtonBuilder()
            .setCustomId('player_loop')
            .setLabel(getLoopLabel(queue.repeatMode))
            .setEmoji('🔁')
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId('player_queue')
            .setLabel('View Queue')
            .setEmoji('📋')
            .setStyle(ButtonStyle.Secondary)
    );

    return {
        embeds: [embed],
        components: [row1, row2]
    };
}

/**
 * Get loop mode label
 * @param {number} repeatMode - 0 = off, 1 = track, 2 = queue, 3 = autoplay
 * @returns {string}
 */
function getLoopLabel(repeatMode) {
    switch (repeatMode) {
        case 1: return 'Loop: Track';
        case 2: return 'Loop: Queue';
        case 3: return 'Loop: Autoplay';
        default: return 'Loop: Off';
    }
}

/**
 * Creates a simple queue embed
 * @param {Queue} queue - The player queue
 * @returns {Object} { embed }
 */
export function createQueueEmbed(queue) {
    const currentTrack = queue.currentTrack;
    const tracks = queue.tracks.data;

    const embed = new EmbedBuilder()
        .setColor('#5865F2')
        .setTitle('📋 Queue')
        .setTimestamp();

    // Current track
    if (currentTrack) {
        embed.addFields({
            name: '🎵 Now Playing',
            value: `**${currentTrack.title}**\n${currentTrack.author} • ${currentTrack.duration}`,
            inline: false
        });
    }

    // Upcoming tracks (limit to 10)
    if (tracks.length > 0) {
        const upcoming = tracks.slice(0, 10).map((track, index) => {
            return `**${index + 1}.** ${track.title}\n${track.author} • ${track.duration}`;
        }).join('\n\n');

        embed.addFields({
            name: `⏭️ Up Next (${tracks.length} song${tracks.length !== 1 ? 's' : ''})`,
            value: upcoming || 'Queue is empty',
            inline: false
        });

        if (tracks.length > 10) {
            embed.setFooter({ text: `And ${tracks.length - 10} more...` });
        }
    } else {
        embed.addFields({
            name: '⏭️ Up Next',
            value: 'Queue is empty',
            inline: false
        });
    }

    return { embeds: [embed] };
}
