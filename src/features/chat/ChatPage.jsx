// src/pages/ChatPage.jsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import ChatListItem from '../../components/Chat/ChatListItem';
import ChatConversation from '../../components/Chat/ChatConversation';
import { useGetStoreProfileQuery } from '../../services/storeProfileApi';

// Dummy Data (make sure these imports are correct based on your project structure)
import userProfilePicSasha from '../../assets/images/profileImage.png';
import userProfilePicVee from '../../assets/images/feed/2.png';
import userProfilePicAdam from '../../assets/images/feed/3.png';
import userProfilePicScent from '../../assets/images/productImages/1.png';
import userProfilePicPower from '../../assets/images/productImages/2.jpeg';
import userProfilePicCreamila from '../../assets/images/productImages/3.jpeg';
import userProfilePicDannova from '../../assets/images/productImages/4.jpeg';
import iphone16proMax from '../../assets/images/feed/2.png';

const dummyChats = [
    {
        id: 'chat-1',
        userName: 'Sasha Stores',
        userProfilePic: userProfilePicSasha,
        lastMessage: 'How will I get my goods delivered?',
        time: 'Today / 07:22 AM',
        unreadCount: 1,
        messages: [
            {
                id: 'msg-1-1', type: 'product', items: [
                    { name: 'Iphone 16 pro max - Black', price: 'N5,000,000', qty: 1, image: iphone16proMax },
                    { name: 'Iphone 16 pro max - Black', price: 'N2,500,000', qty: 1, image: iphone16proMax },
                ], time: '07:22 AM'
            },
            { id: 'msg-1-2', type: 'sent', text: 'How will I get the product delivered', time: '07:22 AM' },
            { id: 'msg-1-3', type: 'received', text: 'Thank you for purchasing from us', time: '07:22 AM' },
            { id: 'msg-1-4', type: 'received', text: 'I will arrange a dispatch rider soon and I will contact you', time: '07:22 AM' },
            { id: 'msg-1-5', type: 'sent', text: 'Okay i will be expecting.', time: '07:22 AM' },
        ]
    },
    {
        id: 'chat-2',
        userName: 'Vee Stores',
        userProfilePic: userProfilePicVee,
        lastMessage: 'How will my goods delivered?',
        time: 'Today / 07:22 AM',
        unreadCount: 1,
        messages: [
            { id: 'msg-2-1', type: 'received', text: 'Hello Vee!', time: '07:20 AM' },
            { id: 'msg-2-2', type: 'sent', text: 'Hi there!', time: '07:21 AM' },
        ]
    },
    {
        id: 'chat-3',
        userName: 'Adam Stores',
        userProfilePic: userProfilePicAdam,
        lastMessage: 'How will my goods delivered?',
        time: 'Today / 07:22 AM',
        unreadCount: 0,
        messages: [
            { id: 'msg-3-1', type: 'received', text: 'Good day Adam!', time: '07:25 AM' },
        ]
    },
    {
        id: 'chat-4',
        userName: 'Scent Villa Stores',
        userProfilePic: userProfilePicScent,
        lastMessage: 'How will my goods delivered?',
        time: 'Today / 07:22 AM',
        unreadCount: 0,
        messages: [
            { id: 'msg-4-1', type: 'received', text: 'Hi Scent Villa!', time: '07:30 AM' },
        ]
    },
    {
        id: 'chat-5',
        userName: 'Power Stores',
        userProfilePic: userProfilePicPower,
        lastMessage: 'How will my goods delivered?',
        time: 'Today / 07:22 AM',
        unreadCount: 0,
        messages: [
            { id: 'msg-5-1', type: 'received', text: 'Greetings Power!', time: '07:35 AM' },
        ]
    },
    {
        id: 'chat-6',
        userName: 'Creamila Stores',
        userProfilePic: userProfilePicCreamila,
        lastMessage: 'How will my goods delivered?',
        time: 'Today / 07:22 AM',
        unreadCount: 0,
        messages: [
            { id: 'msg-6-1', type: 'received', text: 'Hello Creamila!', time: '07:40 AM' },
        ]
    },
    {
        id: 'chat-7',
        userName: 'Dannova Stores',
        userProfilePic: userProfilePicDannova,
        lastMessage: 'How will my goods delivered?',
        time: 'Today / 07:22 AM',
        unreadCount: 0,
        messages: [
            { id: 'msg-7-1', type: 'received', text: 'Hi Dannova!', time: '07:45 AM' },
        ]
    },
];

const ChatPage = () => {
    // 1. ALL HOOKS MUST BE AT THE TOP LEVEL
    const userId = 'default_user_id';
    const { data: storeProfile, error, isLoading } = useGetStoreProfileQuery(userId);

    const [activeChatId, setActiveChatId] = useState(null);
    const [chats, setChats] = useState(dummyChats);

    useEffect(() => {
        const isLargeScreen = window.innerWidth >= 768;
        if (isLargeScreen && chats.length > 0) {
            setActiveChatId(chats[0].id);
        }
    }, [chats]);

    // 2. NOW, CONDITIONAL RENDERS FOR LOADING/ERROR
    if (isLoading) {
        return <div className="p-8 text-center text-gray-600">Loading...</div>;
    }

    if (error) {
        return <div className="p-8 text-center text-red-600">Error: {error.message}</div>;
    }

    const brandColor = storeProfile?.brandColor || '#EF4444';
    const contrastColor = storeProfile?.contrastColor || '#FFFFFF';

    const activeChat = chats.find(chat => chat.id === activeChatId);

    const handleSendMessage = (messagePayload) => {
        const { text, file } = messagePayload;

        if ((!text.trim() && !file) || !activeChat) return;

        const newMessage = {
            id: `msg-${Date.now()}`,
            type: 'sent',
            text: text.trim(),
            file: file,
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
            likes: 0
        };

        const chatIndex = chats.findIndex(chat => chat.id === activeChatId);
        if (chatIndex !== -1) {
            const newChats = [...chats];
            newChats[chatIndex].messages.push(newMessage);
            newChats[chatIndex].lastMessage = text.trim();
            newChats[chatIndex].time = newMessage.time;
            setChats(newChats);
        }
    };

    // New function to handle editing a message
    const handleEditMessage = (messageId, newText) => {
        const chatIndex = chats.findIndex(chat => chat.id === activeChatId);
        if (chatIndex !== -1) {
            const newChats = [...chats];
            const messageIndex = newChats[chatIndex].messages.findIndex(msg => msg.id === messageId);
            if (messageIndex !== -1) {
                newChats[chatIndex].messages[messageIndex].text = newText;
                setChats(newChats);
            }
        }
    };

    // New function to handle deleting a message
    const handleDeleteMessage = (messageId) => {
        const chatIndex = chats.findIndex(chat => chat.id === activeChatId);
        if (chatIndex !== -1) {
            const newChats = [...chats];
            const filteredMessages = newChats[chatIndex].messages.filter(msg => msg.id !== messageId);
            newChats[chatIndex].messages = filteredMessages;
            setChats(newChats);
        }
    };

    return (
        <div className="flex flex-col md:flex-row h-[calc(100vh-80px)] outline-none overflow-hidden">
            {/* Left Panel: Chat List */}
            <div className={`w-full md:w-1/4 md:min-w-[280px] rounded-2xl overflow-y-auto scrollbar-custom mt-4
                ${activeChatId ? 'hidden md:block' : 'block'}`}>
                {chats.map(chat => (
                    <ChatListItem
                        key={chat.id}
                        chat={chat}
                        isActive={chat.id === activeChatId}
                        onClick={() => setActiveChatId(chat.id)}
                        brandColor={brandColor}
                    />
                ))}
            </div>

            {/* Right Panel: Chat Conversation */}
            <div className={`flex-1 flex flex-col rounded-2xl bg-gray-100 m-0 md:m-4 shadow-2xl
                ${activeChatId ? 'block' : 'hidden md:block'}`}>
                {activeChat ? (
                    <ChatConversation
                        chat={activeChat}
                        onSendMessage={handleSendMessage}
                        onEditMessage={handleEditMessage} // Pass the edit handler
                        onDeleteMessage={handleDeleteMessage} // Pass the delete handler
                        brandColor={brandColor}
                        onBack={() => setActiveChatId(null)}
                    />
                ) : (
                    <div className="flex flex-1 items-center justify-center text-gray-500">
                        Select a chat to start conversation
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatPage;
