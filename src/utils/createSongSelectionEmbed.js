import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

/**
 * Creates an embed for song selection with numbered buttons
 * @param {Array<Track>} tracks - Array of tracks (max 3)
 * @param {string} query - The search query
 * @returns {Object} { embeds, components }
 */
export function createSongSelectionEmbed(tracks, query) {
    const embed = new EmbedBuilder()
        .setColor('#5865F2')
        .setTitle('🔍 Search Results')
        .setDescription(`Found **${tracks.length}** results for: *${query}*\n\nPlease select a song:`)
        .setTimestamp();

    // Add each track as a field
    tracks.forEach((track, index) => {
        const number = index + 1;
        embed.addFields({
            name: `${number}. ${track.title}`,
            value: `👤 ${track.author}\n⏱️ ${track.duration}\n👁️ ${track.views.toLocaleString()} views`,
            inline: false
        });
    });

    // Create button row with numbered buttons (max 3)
    const buttons = tracks.map((track, index) => {
        return new ButtonBuilder()
            .setCustomId(`song_select_${index}`)
            .setLabel(`${index + 1}`)
            .setStyle(ButtonStyle.Primary);
    });

    // Add a cancel button
    buttons.push(
        new ButtonBuilder()
            .setCustomId('song_select_cancel')
            .setLabel('Cancel')
            .setStyle(ButtonStyle.Secondary)
    );

    const row = new ActionRowBuilder().addComponents(...buttons);

    return {
        embeds: [embed],
        components: [row]
    };
}
