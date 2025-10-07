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
 * Creates a queue embed with remove buttons and pagination
 * @param {Queue} queue - The player queue
 * @param {number} page - Current page (0-indexed)
 * @returns {Object} { embeds, components }
 */
export function createQueueEmbed(queue, page = 0) {
    const currentTrack = queue.currentTrack;
    const tracks = queue.tracks.data;
    const ITEMS_PER_PAGE = 5;
    const totalPages = Math.max(1, Math.ceil(tracks.length / ITEMS_PER_PAGE));
    const currentPage = Math.min(page, totalPages - 1);

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

    // Upcoming tracks with pagination
    if (tracks.length > 0) {
        const startIdx = currentPage * ITEMS_PER_PAGE;
        const endIdx = Math.min(startIdx + ITEMS_PER_PAGE, tracks.length);
        const pageTrack = tracks.slice(startIdx, endIdx);

        const upcoming = pageTrack.map((track, index) => {
            const position = startIdx + index + 1;
            return `**${position}.** ${track.title}\n${track.author} • ${track.duration}`;
        }).join('\n\n');

        embed.addFields({
            name: `⏭️ Up Next (${tracks.length} song${tracks.length !== 1 ? 's' : ''})`,
            value: upcoming || 'Queue is empty',
            inline: false
        });

        if (totalPages > 1) {
            embed.setFooter({ text: `Page ${currentPage + 1}/${totalPages}` });
        }
    } else {
        embed.addFields({
            name: '⏭️ Up Next',
            value: 'Queue is empty',
            inline: false
        });
    }

    // Create components (buttons)
    const components = [];

    // Remove buttons for current page items (max 5 per row, 5 items = 1 row)
    if (tracks.length > 0) {
        const startIdx = currentPage * ITEMS_PER_PAGE;
        const endIdx = Math.min(startIdx + ITEMS_PER_PAGE, tracks.length);
        const removeButtons = [];

        for (let i = startIdx; i < endIdx; i++) {
            removeButtons.push(
                new ButtonBuilder()
                    .setCustomId(`queue_remove_${i}`)
                    .setLabel(`${i + 1}`)
                    .setEmoji('❌')
                    .setStyle(ButtonStyle.Danger)
            );
        }

        // Split into rows if needed (max 5 buttons per row)
        const row1 = new ActionRowBuilder().addComponents(removeButtons.slice(0, 5));
        components.push(row1);
    }

    // Navigation and utility buttons
    const navRow = new ActionRowBuilder();

    if (totalPages > 1) {
        navRow.addComponents(
            new ButtonBuilder()
                .setCustomId(`queue_page_${currentPage - 1}`)
                .setLabel('Previous')
                .setEmoji('◀️')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(currentPage === 0),
            new ButtonBuilder()
                .setCustomId(`queue_page_${currentPage + 1}`)
                .setLabel('Next')
                .setEmoji('▶️')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(currentPage === totalPages - 1)
        );
    }

    if (tracks.length > 0) {
        navRow.addComponents(
            new ButtonBuilder()
                .setCustomId('queue_clear_all')
                .setLabel('Clear Queue')
                .setEmoji('🗑️')
                .setStyle(ButtonStyle.Danger)
        );
    }

    if (navRow.components.length > 0) {
        components.push(navRow);
    }

    return { embeds: [embed], components };
}
