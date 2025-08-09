// src/components/Chat/ChatConversation.jsx
import React, { useRef, useEffect, useState } from 'react';
import ChatMessage from './ChatMessage';
import { SendHorizonal, ShoppingCart, ChevronLeft } from 'lucide-react'; // Import ChevronLeft for the back button
import { getContrastTextColor } from '../../utils/colorUtils'; // Import utility for contrast color

// Assuming current user's profile picture for sent messages
import currentUserProfilePic from '../../assets/images/profileImage.png'; //

const ChatConversation = ({ chat, onSendMessage, onBack, brandColor }) => {
    const messagesEndRef = useRef(null);
    const [messageInput, setMessageInput] = useState('');

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chat.messages]); // Scroll to bottom when new messages arrive

    const handleSend = () => {
        if (messageInput.trim()) {
            onSendMessage(messageInput);
            setMessageInput('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // Calculate contrast text color for the brandColor for the send button
    const sendButtonContrastTextColor = getContrastTextColor(brandColor);

    return (
        <div className="flex flex-col rounded-lg shadow-black h-full bg-white">
            {/* Chat Header */}
            <div className="flex items-center p-4 border-b border-gray-200 bg-white flex-shrink-0 rounded-t-lg">
                {/* Back button visible only on small screens */}
                <button
                    onClick={onBack}
                    className="p-2 mr-2 md:hidden rounded-full hover:bg-gray-100 text-gray-600"
                    aria-label="Back to chat list"
                >
                    <ChevronLeft size={24} />
                </button>
                <div className="flex items-center flex-1">
                    {/* OPTIMIZATION: Added width and height attributes to prevent Cumulative Layout Shift (CLS). */}
                    <img
                        src={chat.userProfilePic}
                        alt={chat.userName}
                        className="w-10 h-10 rounded-full object-cover mr-3"
                        width={40} // `w-10` is 2.5rem or 40px
                        height={40} // `h-10` is 2.5rem or 40px
                    />
                    <div>
                        <h3 className="font-semibold text-gray-800">{chat.userName}</h3>
                        <p className="text-sm text-gray-500">Last seen 2 min ago</p>
                    </div>
                </div>
                <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600">
                    <ShoppingCart size={24} />
                </button>
            </div>

            {/* Chat Messages Area */}
            <div className="flex-1 overflow-y-auto scrollbar-custom p-4 space-y-4 bg-white">
                {chat.messages.map(msg => (
                    <ChatMessage
                        key={msg.id}
                        message={msg}
                        currentUserProfilePic={currentUserProfilePic}
                        otherUserProfilePic={chat.userProfilePic}
                        brandColor={brandColor} // <--- Pass brandColor to ChatMessage
                    />
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Chat Input Area */}
            <div className="flex items-center p-4 border-t border-gray-200 bg-white flex-shrink-0 rounded-b-lg">
                <div className="flex items-center flex-grow bg-gray-100 px-4 py-2 rounded-2xl border border-gray-200">
                    <input
                        type="text"
                        className="flex-grow bg-transparent focus:outline-none text-gray-700 placeholder-gray-500"
                        placeholder="Type a message"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!messageInput.trim()}
                        className="ml-2 p-2 rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ backgroundColor: brandColor, color: sendButtonContrastTextColor }}
                        aria-label="Send message"
                    >
                        <SendHorizonal size={20} className='-rotate-50' />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatConversation;
