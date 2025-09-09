// src/utils/clipboard.js
export const copyText = async (text) => {
  if (!text && text !== 0) throw new Error('Nothing to copy');

  // Try modern API first (requires secure context: https or localhost)
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(String(text));
      return true;
    } catch (err) {
      // fallback below
    }
  }

  // Fallback: hidden textarea + execCommand
  try {
    const textarea = document.createElement('textarea');
    textarea.value = String(text);
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    textarea.style.pointerEvents = 'none';
    textarea.style.zIndex = '-1';
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    if (!ok) throw new Error('execCommand failed');
    return true;
  } catch (error) {
    throw new Error('Clipboard copy failed');
  }
};