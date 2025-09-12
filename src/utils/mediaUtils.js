// src/utils/mediaUtils.js
export const FALLBACK_IMAGE = '/placeholder.png';

export const isVideoUrl = (url = '') => {
  if (typeof url !== 'string') return false;
  const base = url.split('?')[0];
  return /^data:video\//i.test(url) || /^blob:/i.test(url) || /\.(mp4|webm|ogg|mov|m4v)$/i.test(base);
};

export const dedupe = (list = []) => {
  const out = [];
  const seen = new Set();
  for (const v of list) {
    if (v && !seen.has(v)) {
      seen.add(v);
      out.push(v);
    }
  }
  return out;
};