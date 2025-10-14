// src/utils/formatDate.js

/**
 * Format an ISO timestamp into a friendly short label for chat lists.
 * - Today: HH:MM AM/PM
 * - Yesterday: "Yesterday"
 * - Same year: "MMM d"
 * - Different year: "MMM d, yyyy"
 */
export const formatChatTime = (iso) => {
  if (!iso || typeof iso !== 'string') return '';
  const date = new Date(iso);
  if (isNaN(date.getTime())) return '';

  const now = new Date();

  const isSameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate();

  if (isSameDay) {
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }
  if (isYesterday) {
    return 'Yesterday';
  }
  const sameYear = date.getFullYear() === now.getFullYear();
  return date.toLocaleDateString([], sameYear ? { month: 'short', day: 'numeric' } : { month: 'short', day: 'numeric', year: 'numeric' });
};

/**
 * Format a full timestamp for message bubbles if needed.
 */
export const formatMessageTime = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export default { formatChatTime, formatMessageTime };

