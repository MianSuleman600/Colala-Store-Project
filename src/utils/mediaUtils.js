export const FALLBACK_IMAGE = '/apple-touch-icon.png'; // Make sure this path is correct

export const isVideoUrl = (url = '') => {
  if (typeof url !== 'string') return false;
  const base = url.split('?')[0];
  return /\.(mp4|webm|ogg|mov|m4v)$/i.test(base);
};

export const dedupe = (arr) => {
  if (!Array.isArray(arr)) return [];
  const seen = {};
  return arr.filter((item) => {
    if (!item) return false;
    const s = String(item);
    return Object.prototype.hasOwnProperty.call(seen, s) ? false : (seen[s] = true);
  });
};
