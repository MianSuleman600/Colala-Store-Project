// src/components/Chat/ChatMessage.jsx
import React, { useState } from 'react';
import { Heart, Paperclip, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { getContrastTextColor } from '../../utils/colorUtils';

const ChatMessage = ({ message, currentUserProfilePic, otherUserProfilePic, brandColor, onEdit, onDelete }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const isSent = message.type === 'sent';
    const alignment = isSent ? 'justify-end' : 'justify-start';
    const messageBgColor = isSent ? brandColor : 'bg-gray-200';
    const messageTextColor = isSent ? getContrastTextColor(brandColor) : 'text-gray-800';
    const senderProfilePic = isSent ? currentUserProfilePic : otherUserProfilePic;
    const hasFile = message.file && message.file instanceof File;

    const renderMessageContent = () => {
        if (message.type === 'product' && message.items && message.items.length > 0) {
            return (
                <div className="bg-white rounded-lg shadow-md p-3 max-w-[80%] md:max-w-xs">
                    <p className="text-sm font-semibold mb-2" style={{ color: brandColor }}>Items in cart ({message.items.length})</p>
                    {message.items.map((item, index) => (
                        <div key={index} className="flex items-center border-b border-gray-200 last:border-b-0 py-2">
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-12 h-12 rounded-md object-cover mr-3"
                                width={48}
                                height={48}
                            />
                            <div className="flex-1">
                                <p className="text-xs font-medium text-gray-800 line-clamp-1">{item.name}</p>
                                <p className="text-sm font-bold" style={{ color: brandColor }}>{item.price}</p>
                                <p className="text-xs text-gray-600">Qty: {item.qty}</p>
                            </div>
                        </div>
                    ))}
                    <p className="text-right text-xs text-gray-500 mt-2">{message.time}</p>
                </div>
            );
        } else if (hasFile) {
            if (message.file.type.startsWith('image/')) {
                const imageUrl = URL.createObjectURL(message.file);
                return (
                    <div className="relative w-48 md:w-64 h-auto rounded-lg overflow-hidden shadow-sm">
                        <img
                            src={imageUrl}
                            alt={message.text || 'Attached image'}
                            className="w-full h-full object-cover"
                            width={256}
                            height={256}
                            onLoad={() => URL.revokeObjectURL(imageUrl)}
                        />
                        {message.text && (
                            <p className="absolute bottom-0 left-0 p-2 text-xs font-medium text-white bg-black bg-opacity-50 w-full">
                                {message.text}
                            </p>
                        )}
                        <p className="absolute bottom-0 right-2 text-xs text-white opacity-75">{message.time}</p>
                    </div>
                );
            } else {
                return (
                    <div className={`flex items-center p-3 rounded-2xl max-w-xs md:max-w-md shadow-sm ${messageBgColor}`} style={{ color: messageTextColor }}>
                        <Paperclip size={16} className="mr-2" />
                        <span className="text-sm font-medium truncate">{message.file.name}</span>
                        <p className={`text-xs ml-auto pl-2 ${isSent ? 'text-white text-opacity-75' : 'text-gray-500'}`}>{message.time}</p>
                    </div>
                );
            }
        } else {
            return (
                <div className={`p-3 max-w-[100%] break-words ${
                    isSent
                        ? 'rounded-tl-lg rounded-tr-lg rounded-bl-lg rounded-br-sm'
                        : 'bg-gray-200 text-gray-800 rounded-tl-lg rounded-tr-lg rounded-br-lg rounded-bl-sm'
                }`} style={isSent ? { backgroundColor: brandColor, color: messageTextColor } : {}}>
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
            );
        }
    };

    return (
        <div className={`flex items-end ${alignment} mb-4 group`}>
            {/* Show profile picture for received messages */}
            {!isSent && (
                <img
                    src={senderProfilePic}
                    alt="User Profile"
                    className="w-8 h-8 rounded-full object-cover mr-2 flex-shrink-0"
                    width={32}
                    height={32}
                />
            )}

            <div className={`flex flex-col ${isSent ? 'items-end' : 'items-start'}`}>
                {/* Options menu for sent messages */}
                {isSent && (
                    <div className="relative mb-1 flex items-center">
                        <div className="group-hover:block hidden">
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-1 rounded-full text-gray-500 hover:bg-gray-200">
                                <MoreVertical size={16} />
                            </button>
                        </div>
                        {isMenuOpen && (
                            <div className="absolute top-0 right-8 bg-white shadow-lg rounded-md border border-gray-200 z-10">
                                <button
                                    onClick={() => {
                                        onEdit();
                                        setIsMenuOpen(false);
                                    }}
                                    className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full whitespace-nowrap"
                                >
                                    <Edit size={14} className="mr-2" /> Edit
                                </button>
                                <button
                                    onClick={() => {
                                        onDelete();
                                        setIsMenuOpen(false);
                                    }}
                                    className="flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 w-full whitespace-nowrap"
                                >
                                    <Trash2 size={14} className="mr-2" /> Delete
                                </button>
                            </div>
                        )}
                    </div>
                )}
                {renderMessageContent()}
                {!isSent && message.likes > 0 && (
                    <div className="flex items-center text-xs text-gray-500 mt-1 mr-2">
                        <Heart size={14} className="mr-1" />
                        <span>Reply {message.likes}</span>
                    </div>
                )}
            </div>

            {/* Show profile picture for sent messages */}
            {isSent && (
                <img
                    src={senderProfilePic}
                    alt="User Profile"
                    className="w-8 h-8 rounded-full object-cover ml-2 flex-shrink-0"
                    width={32}
                    height={32}
                />
            )}
        </div>
    );
};

export default ChatMessage;
