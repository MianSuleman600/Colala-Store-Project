import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Paperclip, X, SendHorizontal, ShoppingCart, ChevronLeft, ArrowDown } from 'lucide-react';
import { getContrastTextColor } from '../../utils/colorUtils';
import CartDropdown from '../common/CartDropdown';
import ChatMessage from './ChatMessage';

const ChatConversation = ({
  chat,
  userId,
  onDelete,              // (messageId) => void (server delete)
  onSendMessage,         // ({ text, file, cartItems, editingMessageId }) => void
  brandColor = '#2563EB',
  contrastTextColor,     // optional
  onBack,                // () => void (mobile navigate back to list)
}) => {
  const messagesContainerRef = useRef(null);
  const fileInputRef = useRef(null);

  const [messageInput, setMessageInput] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [messages, setMessages] = useState(chat?.messages || []);
  const [atBottom, setAtBottom] = useState(true);

  const currentUserPic = '/fallback-profile.png';
  const receiverPic = useMemo(() => chat?.userProfilePic || currentUserPic, [chat?.userProfilePic]);

  const sendButtonContrastTextColor = getContrastTextColor(brandColor);

  // Sync messages when chat prop changes
  useEffect(() => {
    setMessages(chat?.messages || []);
  }, [chat?.messages]);

  // Track whether the user is near the bottom
  const checkAtBottom = useCallback(() => {
    const el = messagesContainerRef.current;
    if (!el) return true;
    const threshold = 100; // px
    return el.scrollHeight - el.scrollTop - el.clientHeight <= threshold;
  }, []);

  const scrollToBottom = useCallback((behavior = 'auto') => {
    const el = messagesContainerRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior });
  }, []);

  // Auto-scroll: only if user is at (or near) bottom OR if the last message is mine
  useEffect(() => {
    const el = messagesContainerRef.current;
    if (!el) return;

    const last = messages[messages.length - 1];
    const lastFromMe = last?.isMine || last?.sender === 'sent' || last?.senderId === userId;

    const userIsAtBottom = checkAtBottom();
    setAtBottom(userIsAtBottom);

    if (userIsAtBottom || lastFromMe) {
      scrollToBottom(messages.length > 1 ? 'smooth' : 'auto');
    }
  }, [messages, userId, checkAtBottom, scrollToBottom]);

  const handleScroll = useCallback(() => {
    setAtBottom(checkAtBottom());
  }, [checkAtBottom]);

  const handleSend = useCallback(() => {
    if (!messageInput && !selectedFile) return;

    // local optimistic UI
    const filePayload =
      selectedFile && {
        name: selectedFile.name,
        url: URL.createObjectURL(selectedFile),
        type: selectedFile.type,
      };

    const newMessage = {
      id: `temp-${Date.now()}`,
      type: selectedFile ? (selectedFile.type?.startsWith('image') ? 'image' : 'file') : 'text',
      text: messageInput,
      payload: filePayload,
      sender: 'sent',
      createdAt: new Date().toISOString(),
      isMine: true,
      senderId: userId,
    };

    setMessages((prev) => [...prev, newMessage]);

    // Trigger parent send (network + cache update)
    onSendMessage?.({
      text: messageInput,
      file: selectedFile || null,
      cartItems: null,
      editingMessageId,
    });

    setMessageInput('');
    setSelectedFile(null);
    setEditingMessageId(null);
  }, [messageInput, selectedFile, editingMessageId, onSendMessage, userId]);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  }, []);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const startEditMessage = useCallback((message) => {
    setEditingMessageId(message.id);
    setMessageInput(message.text || '');
  }, []);

  const handleDeleteMessage = useCallback(
    (message) => {
      onDelete?.(message.id);
      setMessages((prev) => prev.filter((m) => m.id !== message.id));
    },
    [onDelete]
  );

  return (
    <div className="relative flex flex-col h-full min-h-0">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-gray-200 bg-white flex-shrink-0 rounded-t-lg">
        <div className="flex items-center flex-1">
          {/* Mobile back */}
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="md:hidden mr-2 p-2 rounded-full hover:bg-gray-100"
              aria-label="Back to chats"
            >
              <ChevronLeft size={20} />
            </button>
          )}
          <img
            src={receiverPic}
            alt={chat?.userName || 'User'}
            className="w-10 h-10 rounded-full object-cover mr-3"
            onError={(e) => {
              if (e.currentTarget.src !== currentUserPic) e.currentTarget.src = currentUserPic;
            }}
          />
          <div>
            <h3 className="font-semibold text-gray-800">{chat?.userName || 'Unknown'}</h3>
            <p className="text-sm text-gray-500">Last seen 2 min ago</p>
          </div>
        </div>

        {/* Shopping Cart */}
        <div className="relative">
          <button
            type="button"
            className="p-2 rounded-full hover:bg-gray-100"
            onClick={() => setIsCartVisible((prev) => !prev)}
            aria-label="Toggle cart"
          >
            <ShoppingCart size={24} />
          </button>
          {isCartVisible && (
            <div className="absolute right-0 mt-2 z-20" onClick={(e) => e.stopPropagation()}>
              <CartDropdown
                userId={userId}
                brandColor={brandColor}
                contrastTextColor={sendButtonContrastTextColor}
                onClose={() => setIsCartVisible(false)}
                onSelect={(selectedItems) => {
                  setIsCartVisible(false);
                  onSendMessage?.({
                    text: '',
                    file: null,
                    cartItems: selectedItems, // [{ id, name, price, quantity, image }]
                    editingMessageId: null,
                  });
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 min-h-0 overflow-y-auto scrollbar-custom p-4 space-y-4 bg-white"
      >
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            message={msg}
            currentUserProfilePic={currentUserPic}
            otherUserProfilePic={receiverPic}
            brandColor={brandColor}
            userId={userId}
            onEdit={startEditMessage}
            onDelete={handleDeleteMessage}
          />
        ))}
      </div>

      {/* Scroll to latest (when user is NOT at bottom) */}
      {!atBottom && (
        <button
          type="button"
          onClick={() => scrollToBottom('smooth')}
          className="absolute bottom-24 right-4 bg-gray-900 text-white rounded-full p-2 shadow-md hover:bg-gray-800"
          aria-label="Jump to latest"
        >
          <ArrowDown size={18} />
        </button>
      )}

      {/* Input */}
      <div className="flex flex-col p-4 border-t border-gray-200 bg-white flex-shrink-0 rounded-b-lg">
        {selectedFile && (
          <div className="flex items-center text-sm text-gray-600 mb-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
            <Paperclip size={16} className="mr-2" />
            <span>{selectedFile.name}</span>
            <button
              type="button"
              onClick={() => setSelectedFile(null)}
              className="ml-auto text-gray-400 hover:text-gray-600"
              aria-label="Remove attachment"
            >
              <X size={16} />
            </button>
          </div>
        )}
        <div className="flex items-center flex-grow bg-gray-100 px-4 py-2 rounded-2xl border border-gray-200">
          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 cursor-pointer rounded-full text-gray-500 hover:bg-gray-200"
            aria-label="Attach file"
          >
            <Paperclip size={20} />
          </button>
          <textarea
            className="flex-grow bg-transparent focus:outline-none text-gray-700 placeholder-gray-500 ml-2 resize-none overflow-hidden max-h-40 break-words whitespace-pre-wrap"
            placeholder="Type a message"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            style={{ width: '100%' }}
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!messageInput && !selectedFile}
            className="ml-2 p-2 cursor-pointer rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: brandColor, color: sendButtonContrastTextColor }}
            aria-label="Send"
          >
            <SendHorizontal size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ChatConversation);