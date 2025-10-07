/**
 * Convert milliseconds to HH:MM:SS or MM:SS format
 * @param {number} ms - Milliseconds to format
 * @returns {string} Formatted time string
 */
export function formatDuration(ms) {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor(ms / (1000 * 60 * 60));

    const pad = (num) => String(num).padStart(2, '0');

    if (hours > 0) {
        return `${hours}:${pad(minutes)}:${pad(seconds)}`;
    }
    return `${minutes}:${pad(seconds)}`;
}

/**
 * Parse time string (MM:SS or HH:MM:SS) to milliseconds
 * @param {string} timeString - Time string to parse
 * @returns {number|null} Milliseconds or null if invalid
 */
export function parseTimeString(timeString) {
    const parts = timeString.split(':').map(Number);

    if (parts.some(isNaN)) {
        return null;
    }

    let ms = 0;
    if (parts.length === 2) {
        // MM:SS
        const [minutes, seconds] = parts;
        ms = (minutes * 60 + seconds) * 1000;
    } else if (parts.length === 3) {
        // HH:MM:SS
        const [hours, minutes, seconds] = parts;
        ms = (hours * 3600 + minutes * 60 + seconds) * 1000;
    } else {
        return null;
    }

    return ms >= 0 ? ms : null;
}

/**
 * Create a progress bar for the current track
 * @param {number} current - Current position in milliseconds
 * @param {number} total - Total duration in milliseconds
 * @param {number} length - Length of the progress bar
 * @returns {string} Progress bar string
 */
export function createProgressBar(current, total, length = 20) {
    const progress = Math.min(current / total, 1);
    const filledLength = Math.round(length * progress);
    const emptyLength = length - filledLength;

    const filled = '▓'.repeat(filledLength);
    const empty = '░'.repeat(emptyLength);

    return `${filled}${empty}`;
}
