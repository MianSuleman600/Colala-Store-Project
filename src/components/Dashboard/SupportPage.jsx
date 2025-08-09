import React, { useState, useRef, useEffect } from 'react';
// Assuming useGetStoreProfileQuery is correctly imported from a parent directory
import { useGetStoreProfileQuery } from '../../services/storeProfileApi';
import PaperClipIcon from '../../assets/icons/Paperclip.png'

import ScrollToTop from '../ui/ScrollToTop';
// The main App component, now named 'App' for standard React conventions.
// It manages the overall state and renders either the chat list or the message window.
export default function SupportPage() {
    const [selectedChatId, setSelectedChatId] = useState(null);
    const [chats, setChats] = useState([
        {
            id: 'chat-1',
            name: 'Customer Agent - Adam',
            status: 'Pending',
            lastMessageTime: 'Today / 07:22 AM',
            unreadCount: 1,
            // Avatar is now generated dynamically, removing the need for a CDN link.
            messages: [
                { id: 1, sender: 'agent', content: { type: 'text', text: 'Hello! How can I help you today?' }, timestamp: '07:20 AM' },
            ],
        },
        {
            id: 'chat-2',
            name: 'Vee Stores',
            status: 'Resolved',
            lastMessageTime: 'Today / 07:22 AM',
            unreadCount: 1,
            // Avatar is generated dynamically.
            messages: [
                { id: 1, sender: 'user', content: { type: 'text', text: 'How will I get the product delivered' }, timestamp: '07:22AM' },
                { id: 2, sender: 'agent', content: { type: 'text', text: 'Thank you for purchasing from us' }, timestamp: '07:22AM' },
                { id: 3, sender: 'agent', content: { type: 'text', text: 'I will arrange a dispatch rider soon and i will contact you' }, timestamp: '07:22AM' },
                { id: 4, sender: 'user', content: { type: 'text', text: 'Okay i will be expecting.' }, timestamp: '07:22AM' },
            ],
        },
    ]);

    // RTK Query hook to fetch brand colors
    const userId = 'default_user_id';
    const { data: storeProfile, error, isLoading } = useGetStoreProfileQuery(userId);

    if (isLoading) {
        return <div className="p-8 text-center text-gray-600">Loading...</div>;
    }

    if (error) {
        return <div className="p-8 text-center text-red-600">Error: {error.message}</div>;
    }

    // Use fetched colors or fallbacks
    const brandColor = storeProfile?.brandColor || '#EF4444';
    const contrastColor = storeProfile?.contrastColor || '#FFFFFF';

    // Find the currently selected chat from the chats state.
    const selectedChat = chats.find(chat => chat.id === selectedChatId);

    // Helper function to generate a simple avatar component.
    // This removes the need for an external image CDN.
    const Avatar = ({ name }) => {
        const initial = name.charAt(0).toUpperCase();
        const bgColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        return (
            <div className="flex items-center justify-center w-10 h-10 rounded-full text-white font-bold" style={{ backgroundColor: bgColor }}>
                {initial}
            </div>
        );
    };

    // Function to handle sending a new message.
    const handleSendMessage = (chatId, newMessageText) => {
        const chatIndex = chats.findIndex(chat => chat.id === chatId);
        if (chatIndex === -1) return;

        const newMessage = {
            sender: 'user',
            content: { type: 'text', text: newMessageText },
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        const updatedChats = [...chats];
        const updatedChat = { ...updatedChats[chatIndex] };
        updatedChat.messages = [...updatedChat.messages, newMessage];
        updatedChats[chatIndex] = updatedChat;

        setChats(updatedChats);
    };

    return (
        <div className="flex h-screen rounded-2xl bg-gray-100 ">
            <ScrollToTop/>
            {/* Conditional rendering based on whether a chat is selected */}
            {selectedChatId ? (
                <div className="w-full rounded-2xl flex-col flex">
                    <SupportMessageWindow
                        chat={selectedChat}
                        onBack={() => setSelectedChatId(null)}
                        brandColor={brandColor}
                        contrastColor={contrastColor}
                        onSendMessage={handleSendMessage}
                        Avatar={Avatar}
                    />
                </div>
            ) : (
                <div className="w-full rounded-2xl bg-white flex-col flex">
                    <div className="p-4 border-b">
                        <h1 className="text-2xl font-bold">Support</h1>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        <SupportChatList
                            chats={chats}
                            onSelectChat={setSelectedChatId}
                            brandColor={brandColor}
                            Avatar={Avatar}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

// SupportChatList component with corrected styling and logic
const SupportChatList = ({ chats, onSelectChat, brandColor, Avatar }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('All');

    // Filter chats based on search term and active tab.
    const filteredChats = chats.filter(chat =>
        chat.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (activeTab === 'All' || chat.status === activeTab)
    );

    return (
        <div className="bg-gray-100 p-4 rounded-lg shadow">
            {/* Search input with inline SVG icon for a cleaner, no-CDN approach */}
            <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-gray-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                </div>
                <input
                    type="search"
                    placeholder="Search chat"
                    className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Tab buttons for filtering chats */}
            <div className="flex justify-around mb-4">
                {['All', 'Pending', 'Resolved'].map(tab => (
                    <button
                        key={tab}
                        className={`py-2 px-4 rounded-full transition-colors font-medium text-sm ${activeTab === tab ? 'text-white' : 'text-gray-600 hover:bg-gray-200'}`}
                        style={activeTab === tab ? { backgroundColor: brandColor } : {}}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* List of filtered chats */}
            <ul className="space-y-2">
                {filteredChats.length > 0 ? (
                    filteredChats.map(chat => (
                        <li
                            key={chat.id}
                            className="bg-white rounded-xl shadow-sm cursor-pointer p-4 hover:bg-gray-50 transition-colors"
                            onClick={() => onSelectChat(chat.id)}
                        >
                            <div className="flex items-center space-x-4">
                                <Avatar name={chat.name} />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 truncate">{chat.name}</p>
                                    <p className="text-xs text-gray-500">{chat.status}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-500">{chat.lastMessageTime}</p>
                                    {chat.unreadCount > 0 && (
                                        <span
                                            className="inline-flex items-center justify-center px-2 py-0.5 mt-1 text-xs font-semibold text-white rounded-full"
                                            style={{ backgroundColor: brandColor }}
                                        >
                                            {chat.unreadCount}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </li>
                    ))
                ) : (
                    <p className="text-gray-500 text-center py-4">No chats found.</p>
                )}
            </ul>
        </div>
    );
};

// SupportMessageWindow component with corrected styling, logic, and inline SVGs
const SupportMessageWindow = ({ chat, onBack, brandColor, contrastColor, onSendMessage, Avatar }) => {
    const [newMessage, setNewMessage] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const messagesEndRef = useRef(null);

    // Scrolls to the bottom of the message list whenever a new message is added.
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chat.messages]);

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            onSendMessage(chat.id, newMessage);
            setNewMessage('');
        }
    };

    const openFormModal = () => {
        setIsFormOpen(true);
    };

    const closeFormModal = () => {
        setIsFormOpen(false);
    };

    return (
        <div className="flex flex-col rounded-2xl h-screen bg-gray-100">
            {/* Header with back button and chat details */}
            <div className="bg-white shadow-sm p-4 rounded-2xl flex items-center">
                <button onClick={onBack} className="mr-4 text-gray-500 hover:text-gray-700 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                </button>
                <div className="flex items-center space-x-3">
                    <Avatar name={chat.name} />
                    <h5 className="font-semibold text-gray-900">{chat.name}</h5>
                </div>
            </div>

            {/* Message display area with auto-scrolling */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chat.messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`rounded-xl p-3 max-w-xs sm:max-w-md break-words shadow-sm ${msg.sender === 'user' ? 'text-white' : 'text-gray-900'}`}
                            style={{
                                backgroundColor: msg.sender === 'user' ? brandColor : '#E5E7EB',
                                color: msg.sender === 'user' ? contrastColor : '#1F2937'
                            }}
                        >
                            <p>{msg.content.text}</p>
                            <p className="text-xs text-right mt-1 opacity-75" style={{ color: msg.sender === 'user' ? contrastColor : '#6B7280' }}>
                                {msg.timestamp}
                            </p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Updated message input and send button area */}
            <div className="bg-white p-4 rounded-2xl border-t border-gray-200 shadow-md">
                <div className="flex items-center w-full px-4 py-2 bg-gray-100 rounded-full">
                    {/* Paperclip icon button to open the form modal */}
                    <button onClick={openFormModal} className="text-gray-500 hover:text-gray-700 transition-colors mr-3">
                      <img src={PaperClipIcon} alt="" />
                    </button>

                    {/* Text input for new messages */}
                    <input
                        type="text"
                        placeholder="Type a message"
                        className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-gray-700"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(event) => event.key === 'Enter' && handleSendMessage()}
                    />

                    {/* Send message button with inline SVG icon */}
                    <button onClick={handleSendMessage} className="text-gray-500 hover:text-gray-700 transition-colors ml-3" style={{ color: brandColor }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.769 59.769 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Conditionally render the modal for the support form */}
            <SupportFormModal isOpen={isFormOpen} onClose={closeFormModal} brandColor={brandColor} contrastColor={contrastColor} />
        </div>
    );
};

// SupportFormModal component with corrected styling and logic
const SupportFormModal = ({ isOpen, onClose, brandColor, contrastColor }) => {
    if (!isOpen) return null;

    const [issueCategory, setIssueCategory] = useState('');
    const [issueDetails, setIssueDetails] = useState('');
    const [files, setFiles] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Support form submitted:', { issueCategory, issueDetails, files });
        onClose();
    };

    return (
        // Modal backdrop and container
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="relative bg-white rounded-3xl shadow-xl w-full max-w-md p-6">
                {/* Modal header with title and close button */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Support Form</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Support form with various inputs */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        {/* Dropdown for issue category */}
                        <select
                            value={issueCategory}
                            onChange={(e) => setIssueCategory(e.target.value)}
                            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 appearance-none bg-white"
                            style={{ borderColor: brandColor, '--tw-ring-color': brandColor }}
                        >
                            <option value="">Issue Category</option>
                            <option value="billing">Billing Issue</option>
                            <option value="shipping">Shipping Issue</option>
                            <option value="technical">Technical Issue</option>
                        </select>
                        {/* Dropdown arrow icon as inline SVG */}
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>

                    {/* Textarea for issue details */}
                    <textarea
                        rows="5"
                        placeholder="Type Issue Details"
                        value={issueDetails}
                        onChange={(e) => setIssueDetails(e.target.value)}
                        className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2"
                        style={{ borderColor: brandColor, '--tw-ring-color': brandColor }}
                    ></textarea>

                    {/* File upload section */}
                    <div className="flex items-center space-x-4">
                        <label htmlFor="file-upload" className="cursor-pointer">
                            <div className="h-20 w-20 border border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-8 w-8 text-gray-400">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.3 2.3 0 0 1 9.47 5.25h5.06a2.3 2.3 0 0 1 2.643.925l.898 1.465a1.275 1.275 0 0 0 1.247.66h.176a2.25 2.25 0 0 1 2.222 2.25v6a2.25 2.25 0 0 1-2.222 2.25H4.25c-1.24 0-2.25-1.01-2.25-2.25v-6a2.25 2.25 0 0 1 2.222-2.25h.176c.465 0 .898-.242 1.247-.66l.898-1.465Z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 17.25a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Z" />
                                </svg>
                            </div>
                            <input id="file-upload" type="file" multiple className="hidden" onChange={(e) => setFiles([...e.target.files])} />
                        </label>
                        {files.length > 0 && (
                            <p className="text-sm text-gray-500">{files.length} file(s) selected</p>
                        )}
                    </div>

                    {/* Submit button */}
                    <button
                        type="submit"
                        className="w-full py-4 font-semibold rounded-xl transition-colors"
                        style={{ backgroundColor: brandColor, color: contrastColor }}
                    >
                        Proceed
                    </button>
                </form>
            </div>
        </div>
    );
};
