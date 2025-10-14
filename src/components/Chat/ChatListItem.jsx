// src/components/Chat/ChatListItem.jsx
import React from 'react';
import { getContrastTextColor } from '../../utils/colorUtils';
import { formatChatTime } from '../../utils/formatDate';

const hexToRgba = (hex, alpha = 0.1) => {
  const m = hex.replace('#', '');
  const bigint = parseInt(m.length === 3 ? m.split('').map((c) => c + c).join('') : m, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const ChatListItem = ({ chat, isActive, onClick, brandColor = '#EF4444' }) => {
  const badgeText = getContrastTextColor(brandColor);
  const activeBgColor = hexToRgba(brandColor, 0.1);

  return (
    <div
      onClick={onClick}
      className="flex items-center p-4 rounded-2xl mb-2 cursor-pointer transition-colors hover:bg-gray-100"
      style={isActive ? { border: `2px solid ${brandColor}`, backgroundColor: activeBgColor } : {}}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ' ? onClick?.() : null)}
      aria-pressed={isActive}
    >
      {/* Profile Image */}
      <img
        src={chat.userProfilePic || '/'}
        alt={chat.userName || 'User'}
        className="w-10 h-10 rounded-full object-cover mr-4"
        onError={(e) => (e.currentTarget.src = '/default-profile.png')}
      />

      {/* Chat Info */}
      <div className="flex-1 flex flex-col justify-center">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-sm text-gray-800 truncate">{chat.userName}</h3>
          <span className="text-[10px] text-gray-500">
            {formatChatTime(chat.time)}
          </span>
        </div>

        <div className="flex justify-between items-center mt-1">
          <p className="text-gray-600 text-xs truncate mr-2">{chat.lastMessage || 'No messages yet'}</p>
          {chat.unreadCount > 0 && (
            <span
              className="flex items-center justify-center h-5 w-5 rounded-full text-xs font-bold"
              style={{ backgroundColor: brandColor, color: badgeText }}
            >
              {chat.unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatListItem;