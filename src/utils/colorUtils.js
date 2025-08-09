// src/utils/colorUtils.js
export const getContrastTextColor = (hexcolor) => {
    if (!hexcolor || typeof hexcolor !== 'string') {
        return '#FFFFFF'; // Default to white if color is invalid
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