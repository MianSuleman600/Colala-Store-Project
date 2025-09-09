import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';
import { useChatsQuery } from '../../services/queries/useChatsQuery';
import { useStoreProfile } from '../../services/queries/storeProfileQuery';
import {
  useSendMessageMutation,
  useEditMessageMutation,
  useDeleteMessageMutation,
} from '../../services/mutations/useChatMutations';
import ChatListItem from '../../components/Chat/ChatListItem';
import ChatConversation from '../../components/Chat/ChatConversation';
import { getContrastTextColor } from '../../utils/colorUtils';
import { useToast } from '../../components/ui/ToastProvider';

const genTempId = (prefix = 'temp') =>
  (globalThis.crypto?.randomUUID?.() || `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`);

const ChatPage = () => {
  const { push } = useToast();
  const queryClient = useQueryClient();

  // Unify user selectors (match rest of app)
  const userSlice = useSelector((s) => s.user || {});
  const authUser = useSelector((s) => s.auth?.user || {});
  const userId = userSlice.userId || authUser.id;
  const token = authUser.token || userSlice.token;

  // Fetch chats and profile with the same userId key used elsewhere
  const { data: chatsData, isLoading: chatsLoading, error: chatsError } = useChatsQuery(userId);
  const { data: storeProfile, isLoading: profileLoading, error: profileError } = useStoreProfile(userId, {
    enabled: !!userId,
  });

  const sendMessageMutation = useSendMessageMutation();
  const editMessageMutation = useEditMessageMutation();
  const deleteMessageMutation = useDeleteMessageMutation();

  // Normalize chats to array
  const rawChatsArr = useMemo(() => {
    const raw = chatsData?.chats ?? chatsData;
    return Array.isArray(raw) ? raw : raw && typeof raw === 'object' ? Object.values(raw) : [];
  }, [chatsData]);

  const chats = useMemo(
    () =>
      rawChatsArr.map((chat) => ({
        ...chat,
        messages: Array.isArray(chat.messages) ? chat.messages : [],
      })),
    [rawChatsArr]
  );

  // Unique keys without mutating ids
  const chatsWithKeys = useMemo(() => {
    const seen = new Map();
    return chats.map((c, idx) => {
      const base =
        c.id ||
        c._id ||
        c.conversationId ||
        (Array.isArray(c.participants) && c.participants.length
          ? c.participants.slice().sort().join('|')
          : `chat-${idx}`);
      let key = String(base);
      let n = seen.get(key) || 0;
      if (n > 0) key = `${key}#${n}`;
      seen.set(base, n + 1);
      return { ...c, __key: key };
    });
  }, [chats]);

  // Brand color from profile (fallback to any cached user slice preference, else default)
  const brandColor = useMemo(
    () => storeProfile?.brandColor || userSlice.brandColor || '#EF4444',
    [storeProfile?.brandColor, userSlice.brandColor]
  );
  const contrastTextColor = useMemo(() => getContrastTextColor(brandColor), [brandColor]);

  const [activeChatId, setActiveChatId] = useState(null);

  // Set initial active chat (desktop)
  useEffect(() => {
    if (window.innerWidth >= 768 && chatsWithKeys.length > 0 && !activeChatId) {
      setActiveChatId(chatsWithKeys[0]?.id || chatsWithKeys[0]?._id || chatsWithKeys[0]?.conversationId || null);
    }
  }, [chatsWithKeys, activeChatId]);

  // Active chat
  const activeChat = useMemo(
    () => chatsWithKeys.find((c) => c.id === activeChatId || c._id === activeChatId || c.conversationId === activeChatId) || null,
    [chatsWithKeys, activeChatId]
  );

  // Cache updates
  const updateChatsCache = (updater) => {
    queryClient.setQueryData(['chats', userId], (oldData) => {
      if (!oldData) return oldData;
      const raw = oldData?.chats ?? oldData;
      const arr = Array.isArray(raw) ? raw : raw && typeof raw === 'object' ? Object.values(raw) : [];
      const nextArr = updater(arr);
      if (Array.isArray(oldData)) return nextArr;
      if (Array.isArray(oldData?.chats)) return { ...oldData, chats: nextArr };
      const obj = {};
      nextArr.forEach((c) => {
        const id = c?.id || c?._id || c?.conversationId;
        if (id) obj[id] = c;
      });
      return { ...oldData, chats: obj };
    });
  };

  if (!userId) {
    return <div className="p-8 text-center text-gray-600">No user session.</div>;
  }
  if (chatsLoading || profileLoading) return <div className="p-8 text-center text-gray-600">Loading chats...</div>;
  if (chatsError || profileError)
    return (
      <div className="p-8 text-center text-red-600">
        {chatsError?.message || profileError?.message || 'Error loading data.'}
      </div>
    );

  /** ----------------- Handlers ----------------- **/
  const handleSendMessage = ({ text = '', file = null, cartItems = null, editingMessageId = null }) => {
    if (!activeChat || !token) return;

    const tempId = genTempId('msg');
    const tempMessage = {
      id: tempId,
      type: cartItems ? 'cart' : file ? (file.type?.startsWith('image') ? 'image' : 'file') : 'text',
      text,
      payload: cartItems
        ? {
            items: cartItems,
            totalPrice: cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.qty || 1), 0),
            url: null,
          }
        : file
        ? { url: URL.createObjectURL(file), name: file.name, type: file.type, items: [] }
        : null,
      senderId: userId,
      createdAt: new Date().toISOString(),
      isMine: true,
    };

    updateChatsCache((arr) =>
      arr.map((chatItem) =>
        (chatItem.id || chatItem._id || chatItem.conversationId) === activeChat.id
          ? { ...chatItem, messages: [...(chatItem.messages || []), tempMessage] }
          : chatItem
      )
    );

    sendMessageMutation.mutate(
      { chatId: activeChat.id, payload: { text, file, cartItems, senderId: userId }, token, editingMessageId },
      {
        onSuccess: (serverMessage) => {
          updateChatsCache((arr) =>
            arr.map((chatItem) =>
              (chatItem.id || chatItem._id || chatItem.conversationId) === activeChat.id
                ? {
                    ...chatItem,
                    messages: (chatItem.messages || []).map((msg) =>
                      msg.id === tempId ? serverMessage.payload || msg : msg
                    ),
                  }
                : chatItem
            )
          );
        },
        onError: (err) => {
          push(err?.message || 'Failed to send message.', { type: 'error' });
          queryClient.invalidateQueries({ queryKey: ['chats', userId] });
        },
      }
    );
  };

  const handleEditMessage = (messageId, newText) => {
    if (!activeChat || !token) return;

    updateChatsCache((arr) =>
      arr.map((chatItem) =>
        (chatItem.id || chatItem._id || chatItem.conversationId) === activeChat.id
          ? {
              ...chatItem,
              messages: (chatItem.messages || []).map((m) => (m.id === messageId ? { ...m, text: newText } : m)),
            }
          : chatItem
      )
    );

    editMessageMutation.mutate(
      { chatId: activeChat.id, messageId, payload: { text: newText }, token },
      {
        onError: (err) => {
          push(err?.message || 'Failed to edit message.', { type: 'error' });
          queryClient.invalidateQueries({ queryKey: ['chats', userId] });
        },
      }
    );
  };

  const handleDeleteMessage = (messageId) => {
    if (!activeChat || !token) return;

    let prevMessages = activeChat.messages;

    updateChatsCache((arr) =>
      arr.map((chatItem) =>
        (chatItem.id || chatItem._id || chatItem.conversationId) === activeChat.id
          ? {
              ...chatItem,
              messages: (chatItem.messages || []).filter((m) => m.id !== messageId),
            }
          : chatItem
      )
    );

    deleteMessageMutation.mutate(
      { chatId: activeChat.id, messageId, token },
      {
        onError: (err) => {
          push(err?.message || 'Failed to delete message.', { type: 'error' });
          updateChatsCache((arr) =>
            arr.map((chatItem) =>
              (chatItem.id || chatItem._id || chatItem.conversationId) === activeChat.id
                ? { ...chatItem, messages: prevMessages }
                : chatItem
            )
          );
        },
      }
    );
  };

  /** ----------------- Render ----------------- **/
  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-80px)] overflow-hidden">
      {/* Chat List */}
      <div
        className={`w-full md:w-1/4 md:min-w-[280px] overflow-y-auto scrollbar-custom mt-4 ${
          activeChatId ? 'hidden md:block' : 'block'
        }`}
      >
        {chatsWithKeys.length ? (
          chatsWithKeys.map((chat) => (
            <ChatListItem
              key={chat.__key}
              chat={chat}
              isActive={(chat.id || chat._id || chat.conversationId) === activeChatId}
              onClick={() => setActiveChatId(chat.id || chat._id || chat.conversationId)}
              brandColor={brandColor}
              contrastTextColor={contrastTextColor}
            />
          ))
        ) : (
          <div className="text-center text-gray-500 py-8">No chats available</div>
        )}
      </div>

      {/* Chat Conversation */}
      <div
        className={`flex-1 flex flex-col rounded-2xl bg-gray-100 m-0 md:m-4 shadow-2xl ${
          activeChatId ? 'block' : 'hidden md:block'
        }`}
      >
        {activeChat ? (
          <ChatConversation
            chat={activeChat}
            userId={userId}
            brandColor={brandColor}
            contrastTextColor={contrastTextColor}
            onSendMessage={handleSendMessage}
            onDelete={handleDeleteMessage}
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