// src/components/Chat/ChatListItem.jsx
import React from 'react';
import { getContrastTextColor } from '../../utils/colorUtils'; // Import utility for contrast color

const ChatListItem = ({ chat, isActive, onClick, brandColor }) => { // <--- Added brandColor prop
    // Calculate contrast text color for the brandColor, if not already passed
    const activeBgContrastTextColor = getContrastTextColor(brandColor);

    return (
        <div
            className={`flex items-center p-4 rounded-2xl mb-2 cursor-pointer bg-white hover:bg-gray-100 transition-colors ${
                isActive ? `border-2` : '' // Removed bg-red-50 here, will apply via style
            }`}
            style={isActive ? { borderColor: brandColor, backgroundColor: `${brandColor}1A` } : {}} // Apply brandColor to border and a light transparent version for background
            onClick={onClick}
        >
            <img
                src={chat.userProfilePic}
                alt={chat.userName}
                className="w-8 h-8 rounded-full object-cover mr-4"
            />
            <div className="flex-1">
                <div className="flex justify-between items-center">
                    <h3 className="font-bold text-[14px] text-gray-800">{chat.userName}</h3>
                    <span className="text-[8px] text-gray-500">{chat.time}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                    <p className="text-gray-600 text-[12px] truncate mr-2">{chat.lastMessage}</p>
                    {chat.unreadCount > 0 && (
                        <span
                            className="text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
                            style={{ backgroundColor: brandColor, color: activeBgContrastTextColor }} // <--- Use brandColor for badge background and its contrast text
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
