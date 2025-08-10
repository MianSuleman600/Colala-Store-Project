// src/components/Chat/ChatConversation.jsx
import React, { useRef, useEffect, useState } from 'react';
import ChatMessage from './ChatMessage';
import { SendHorizonal, ShoppingCart, ChevronLeft, Paperclip, X } from 'lucide-react';
import { getContrastTextColor } from '../../utils/colorUtils';
import currentUserProfilePic from '../../assets/images/profileImage.png';

// The ChatConversation component now receives `onEditMessage` and `onDeleteMessage` callbacks
const ChatConversation = ({ chat, onSendMessage, onEditMessage, onDeleteMessage, onBack, brandColor }) => {
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const [messageInput, setMessageInput] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [editingMessageId, setEditingMessageId] = useState(null); // State to hold the ID of the message being edited

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chat.messages]);

    const handleSend = () => {
        if (!messageInput.trim() && !selectedFile) return;

        if (editingMessageId) {
            // If we are in edit mode, call the onEditMessage function
            onEditMessage(editingMessageId, messageInput.trim());
            setEditingMessageId(null);
        } else {
            // Otherwise, send a new message
            const messagePayload = {
                text: messageInput.trim(),
                file: selectedFile,
            };
            onSendMessage(messagePayload);
        }

        setMessageInput('');
        setSelectedFile(null);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    // New function to handle editing a message from the child component
    const handleEdit = (message) => {
        setEditingMessageId(message.id);
        setMessageInput(message.text);
    };

    const sendButtonContrastTextColor = getContrastTextColor(brandColor);

    return (
        <div className="flex flex-col rounded-lg shadow-black h-full bg-white">
            {/* Chat Header */}
            <div className="flex items-center p-4 border-b border-gray-200 bg-white flex-shrink-0 rounded-t-lg">
                <button
                    onClick={onBack}
                    className="p-2 mr-2 md:hidden rounded-full hover:bg-gray-100 text-gray-600"
                    aria-label="Back to chat list"
                >
                    <ChevronLeft size={24} />
                </button>
                <div className="flex items-center flex-1">
                    <img
                        src={chat.userProfilePic}
                        alt={chat.userName}
                        className="w-10 h-10 rounded-full object-cover mr-3"
                        width={40}
                        height={40}
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
                        brandColor={brandColor}
                        onEdit={() => handleEdit(msg)} // Pass the edit handler
                        onDelete={() => onDeleteMessage(msg.id)} // Pass the delete handler
                    />
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Chat Input Area */}
            <div className="flex flex-col p-4 border-t border-gray-200 bg-white flex-shrink-0 rounded-b-lg">
                {selectedFile && (
                    <div className="flex items-center text-sm text-gray-600 mb-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
                        <Paperclip size={16} className="mr-2" />
                        <span>{selectedFile.name}</span>
                        <button
                            onClick={() => setSelectedFile(null)}
                            className="ml-auto text-gray-400 hover:text-gray-600"
                            aria-label="Remove file"
                        >
                            <X size={16} />
                        </button>
                    </div>
                )}
                {editingMessageId && (
                    <div className="flex items-center text-sm text-gray-600 mb-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
                        <span className="flex-1">Editing message...</span>
                        <button
                            onClick={() => {
                                setEditingMessageId(null);
                                setMessageInput('');
                            }}
                            className="ml-auto text-blue-400 hover:text-blue-600"
                            aria-label="Cancel editing"
                        >
                            <X size={16} />
                        </button>
                    </div>
                )}
                <div className="flex items-center flex-grow bg-gray-100 px-4 py-2 rounded-2xl border border-gray-200">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    <button
                        onClick={() => fileInputRef.current.click()}
                        className="p-2 rounded-full text-gray-500 hover:bg-gray-200"
                        aria-label="Attach file"
                        disabled={editingMessageId !== null} // Disable file attachments while editing
                    >
                        <Paperclip size={20} />
                    </button>
                    <input
                        type="text"
                        className="flex-grow bg-transparent focus:outline-none text-gray-700 placeholder-gray-500 ml-2"
                        placeholder={editingMessageId ? "Edit your message" : "Type a message"}
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!messageInput.trim() && !selectedFile}
                        className="ml-2 p-2 rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ backgroundColor: brandColor, color: sendButtonContrastTextColor }}
                        aria-label={editingMessageId ? "Save edited message" : "Send message"}
                    >
                        <SendHorizonal size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatConversation;
