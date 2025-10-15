// src/pages/ChatPage.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useChatsQuery, useChatMessagesQuery } from '../../services/queries/useChatsQuery';
import { useSendMessageMutation } from '../../services/mutations/useChatMutations';
import ChatListItem from '../../components/Chat/ChatListItem';
import ChatConversation from '../../components/Chat/ChatConversation';
import { getContrastTextColor } from '../../utils/colorUtils';

const getChatId = (c) => c?.id || c?._id || c?.conversationId || null;

const ChatPage = () => {
  const { user } = useSelector((state) => state.auth);
  const userId = user?.id;
  
  const { data: chats = [], isLoading: chatsLoading, error: chatsError } = useChatsQuery(userId, { enabled: !!userId });
  
  const [activeChatId, setActiveChatId] = useState(null);

  const { data: activeChatMessages, isLoading: messagesLoading } = useChatMessagesQuery(activeChatId, {
      enabled: !!activeChatId,
  });

  const sendMessageMutation = useSendMessageMutation();

  const brandColor = useMemo(() => user?.store?.theme_color || '#EF4444', [user]);
  const contrastTextColor = useMemo(() => getContrastTextColor(brandColor), [brandColor]);

  useEffect(() => {
    if (window.innerWidth >= 768 && chats.length > 0 && !activeChatId) {
      setActiveChatId(getChatId(chats[0]));
    }
  }, [chats, activeChatId]);

  const activeChat = useMemo(() => {
    const chatInfo = chats.find((c) => getChatId(c) === activeChatId);
    if (!chatInfo) return null;
    
    return { ...chatInfo, messages: activeChatMessages || [] };
  }, [chats, activeChatId, activeChatMessages]);

  if (!userId) {
    return <div className="p-8 text-center text-gray-600">Please log in to view your chats.</div>;
  }
  if (chatsLoading) {
    return <div className="p-8 text-center text-gray-600">Loading chats...</div>;
  }
  if (chatsError) {
    return <div className="p-8 text-center text-red-600">{chatsError.message || 'Error loading chats.'}</div>;
  }

  const handleSendMessage = ({ text = '', file = null, tempMessage }) => {
    if (!activeChatId) return;

    // API expects JSON: { message, sender_type }
    const payload = { message: text, sender_type: 'store' };
    if (file) {
      // Attachments not supported by current API sample; ignoring file for now.
      console.warn('[Chat] File attachment provided but API expects only text. Skipping file.');
    }
    sendMessageMutation.mutate({ chatId: activeChatId, payload, tempMessage, userId });
  };

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-80px)] overflow-hidden md:px-6">
      <div className={`w-full md:w-1/4 md:min-w-[400px] overflow-y-auto scrollbar-custom mt-4 ${activeChatId ? 'hidden md:block' : 'block'}`}>
        {chats.length > 0 ? (
          chats.map((chat) => {
            const id = getChatId(chat);
            return <ChatListItem key={id} chat={chat} isActive={id === activeChatId} onClick={() => setActiveChatId(id)} brandColor={brandColor} />;
          })
        ) : (
          <div className="text-center text-gray-500 py-8">No chats available</div>
        )}
      </div>
      <div className={`flex-1 min-h-0 flex flex-col rounded-2xl bg-gray-100 m-0 md:m-4 shadow-2xl ${activeChatId ? 'block' : 'hidden md:block'}`}>
        {activeChat ? (
          <ChatConversation
            key={activeChatId}
            chat={activeChat}
            isLoadingMessages={messagesLoading && !activeChat.messages.length}
            isSendingMessage={sendMessageMutation.isLoading}
            userId={userId}
            brandColor={brandColor}
            contrastTextColor={contrastTextColor}
            onSendMessage={handleSendMessage}
            onBack={() => setActiveChatId(null)}
          />
        ) : (
          <div className="flex flex-1 items-center justify-center text-gray-500">
            Select a chat to start a conversation.
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;