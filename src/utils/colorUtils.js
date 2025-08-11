/**
 * A collection of utility functions for manipulating colors.
 */

/**
 * Helper function to determine a contrasting text color (black or white)
 * based on the background color's luminance.
 * * @param {string} hexcolor - The background color in hex format (e.g., '#RRGGBB').
 * @returns {string} The contrast text color ('#000000' for dark background, '#FFFFFF' for light background).
 */
export const getContrastTextColor = (hexcolor) => {
    if (!hexcolor || typeof hexcolor !== 'string') {
        return '#FFFFFF';
    }

    const cleanHex = hexcolor.startsWith('#') ? hexcolor.slice(1) : hexcolor;
    const expandedHex = cleanHex.length === 3
        ? cleanHex.split('').map(char => char + char).join('')
        : cleanHex;

    const r = parseInt(expandedHex.substring(0, 2), 16);
    const g = parseInt(expandedHex.substring(2, 4), 16);
    const b = parseInt(expandedHex.substring(4, 6), 16);

    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
};

/**
 * Helper function to lighten or darken a hex color.
 * * @param {string} hex - The hex color string (e.g., '#RRGGBB').
 * @param {number} amount - The amount to lighten (positive) or darken (negative) each RGB component (0-255).
 * @returns {string} The adjusted hex color.
 */
export const adjustBrightness = (hex, amount) => {
    if (!hex || typeof hex !== 'string') {
        return '#000000';
    }

    const cleanHex = hex.startsWith('#') ? hex.slice(1) : hex;
    const num = parseInt(cleanHex, 16);

    let r = (num >> 16) + amount;
    let b = ((num >> 8) & 0x00FF) + amount;
    let g = (num & 0x0000FF) + amount;

    r = Math.min(255, Math.max(0, r));
    b = Math.min(255, Math.max(0, b));
    g = Math.min(255, Math.max(0, g));

    return '#' + (g | (b << 8) | (r << 16)).toString(16).padStart(6, '0');
};
