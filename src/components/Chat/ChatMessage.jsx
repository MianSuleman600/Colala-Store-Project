// src/components/Chat/ChatMessage.jsx
import React from 'react';
import { Heart } from 'lucide-react'; // For the like icon (if used)
import { getContrastTextColor } from '../../utils/colorUtils'; // Ensure this utility is available

const ChatMessage = ({ message, currentUserProfilePic, otherUserProfilePic, brandColor }) => { // <--- Added brandColor prop
    const isSent = message.type === 'sent';
    const isProduct = message.type === 'product';

    // Determine the correct profile pic for the message sender
    const senderProfilePic = isSent ? currentUserProfilePic : otherUserProfilePic;

    // Calculate contrast text color for the brandColor, if not already passed
    // It's better to pass contrastTextColor from parent if it's already calculated there.
    // For now, let's calculate it here for safety if it's not passed.
    const messageContrastTextColor = getContrastTextColor(brandColor);

    if (isProduct) {
        return (
            <div className={`flex ${isSent ? 'justify-end' : 'justify-start'} mb-4`}>
                <div className="flex items-end">
                    {!isSent && (
                        <img
                            src={senderProfilePic}
                            alt="User Profile"
                            className="w-8 h-8 rounded-full object-cover mr-2 flex-shrink-0"
                        />
                    )}
                    <div className="bg-white rounded-lg shadow-md p-3 max-w-[80%] md:max-w-xs">
                        <p className="text-sm font-semibold mb-2">Items in cart ({message.items.length})</p>
                        {message.items.map((item, index) => (
                            <div key={index} className="flex items-center border-b border-gray-200 last:border-b-0 py-2">
                                <img src={item.image} alt={item.name} className="w-12 h-12 rounded-md object-cover mr-3" />
                                <div className="flex-1">
                                    <p className="text-xs font-medium text-gray-800 line-clamp-1">{item.name}</p>
                                    {/* Assuming item.price might need brandColor as well if it's a primary price display */}
                                    <p className="text-sm font-bold" style={{ color: brandColor }}>{item.price}</p>
                                    <p className="text-xs text-gray-600">Qty: {item.qty}</p>
                                </div>
                            </div>
                        ))}
                        <p className="text-right text-xs text-gray-500 mt-2">{message.time}</p>
                    </div>
                    {isSent && (
                        <img
                            src={senderProfilePic}
                            alt="User Profile"
                            className="w-8 h-8 rounded-full object-cover ml-2 flex-shrink-0"
                        />
                    )}
                </div>
            </div>
        );
    }

    // Regular chat messages (sent/received)
    return (
        <div className={`flex items-end ${isSent ? 'justify-end' : 'justify-start'} mb-4`}>
            {!isSent && (
                <img
                    src={senderProfilePic}
                    alt="User Profile"
                    className="w-8 h-8 rounded-full object-cover mr-2 flex-shrink-0"
                />
            )}
            <div className={`flex flex-col ${isSent ? 'items-end' : 'items-start'}`}>
                <div className={`p-3 max-w-[100%] break-words ${
                    isSent
                        // Use brandColor for background and messageContrastTextColor for text
                        ? 'rounded-tl-lg rounded-tr-lg rounded-bl-lg rounded-br-sm' // Sent: Rounded except bottom-right
                        : 'bg-gray-200 text-gray-800 rounded-tl-lg rounded-tr-lg rounded-br-lg rounded-bl-sm' // Received: Rounded except bottom-left
                }`}
                style={isSent ? { backgroundColor: brandColor, color: messageContrastTextColor } : {}} // <--- Applied brandColor here
                >
                    <p>
                        {message.text.split(' ').map((word, index) =>
                            word.startsWith('@') ? (
                                <span key={index} className="text-blue-600 font-medium cursor-pointer">{word} </span>
                            ) : (
                                word + ' '
                            )
                        )}
                    </p>
                    <div className={`text-right text-xs opacity-75 mt-1 ${isSent ? 'text-white' : 'text-gray-600'}`}>
                        {message.time}
                    </div>
                </div>
                {/* "Reply 30" (Likes) part below the message, as seen in image_a44acd.png */}
                {!isSent && message.likes > 0 && (
                    <div className="flex items-center text-xs text-gray-500 mt-1 mr-2">
                        <Heart size={14} className="mr-1" />
                        <span>Reply {message.likes}</span>
                    </div>
                )}
            </div>
            {isSent && (
                <img
                    src={senderProfilePic}
                    alt="User Profile"
                    className="w-8 h-8 rounded-full object-cover ml-2 flex-shrink-0"
                />
            )}
        </div>
    );
};

export default ChatMessage;
