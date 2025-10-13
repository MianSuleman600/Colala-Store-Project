// src/components/Chat/ChatConversation.jsx
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Paperclip, X, SendHorizontal, ShoppingCart, ChevronLeft, ArrowDown } from 'lucide-react';
import { getContrastTextColor } from '../../utils/colorUtils';
import CartDropdown from '../common/CartDropdown';
import ChatMessage from './ChatMessage';

const ChatConversation = ({
  chat,
  userId,
  isLoadingMessages,
  isSendingMessage,
  onSendMessage,
  brandColor = '#2563EB',
  contrastTextColor,
  onBack,
}) => {
  const messagesContainerRef = useRef(null);
  const fileInputRef = useRef(null);

  const [messageInput, setMessageInput] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [showScrollDown, setShowScrollDown] = useState(false);
  
  const receiverPic = useMemo(() => chat?.userProfilePic || '/fallback-profile.png', [chat?.userProfilePic]);
  const sendButtonContrastTextColor = useMemo(() => contrastTextColor || getContrastTextColor(brandColor), [brandColor, contrastTextColor]);

  const scrollToBottom = useCallback((behavior = 'auto') => {
    requestAnimationFrame(() => {
      const el = messagesContainerRef.current;
      if (el) el.scrollTo({ top: el.scrollHeight, behavior });
    });
  }, []);

  useEffect(() => {
    scrollToBottom('smooth');
  }, [chat.messages, scrollToBottom]);

  const handleScroll = useCallback(() => {
    const el = messagesContainerRef.current;
    if (!el) return;
    const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 150;
    setShowScrollDown(!isAtBottom);
  }, []);

  // CORRECTED: This function now builds the temp message and passes it up.
  const handleSend = useCallback(() => {
    if (!messageInput.trim() && !selectedFile) return;

    // 1. Create the temporary message object with all necessary data.
    const tempId = `temp-${Date.now()}`;
    const tempMessage = {
      id: tempId,
      type: selectedFile ? (selectedFile.type.startsWith('image') ? 'image' : 'file') : 'text',
      text: messageInput,
      payload: selectedFile ? { url: URL.createObjectURL(selectedFile), name: selectedFile.name } : null,
      createdAt: new Date().toISOString(),
      isMine: true,
      senderId: userId,
    };

    // 2. Call the parent function, passing both the raw data and the pre-built temp message.
    onSendMessage?.({
      text: messageInput,
      file: selectedFile,
      tempMessage: tempMessage,
    });

    // 3. Reset the local input fields.
    setMessageInput('');
    setSelectedFile(null);
  }, [messageInput, selectedFile, onSendMessage, userId]);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
    e.target.value = null;
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  return (
    <div className="relative flex flex-col h-full min-h-0">
      <div className="flex items-center p-4 border-b border-gray-200 bg-white flex-shrink-0 rounded-t-lg">
        {onBack && (
          <button type="button" onClick={onBack} className="md:hidden mr-2 p-2 rounded-full hover:bg-gray-100" aria-label="Back to chats">
            <ChevronLeft size={20} />
          </button>
        )}
        <img src={receiverPic} alt={chat?.userName || 'User'} className="w-10 h-10 rounded-full object-cover mr-3" />
        <div>
          <h3 className="font-semibold text-gray-800">{chat?.userName || 'Unknown'}</h3>
          <p className="text-sm text-gray-500">Online</p>
        </div>
        <div className="relative ml-auto">
          <button type="button" className="p-2 rounded-full hover:bg-gray-100" onClick={() => setIsCartVisible(v => !v)} aria-label="Toggle cart">
            <ShoppingCart size={24} />
          </button>
          {isCartVisible && (
            <div className="absolute right-0 mt-2 z-20" onClick={(e) => e.stopPropagation()}>
              <CartDropdown userId={userId} brandColor={brandColor} contrastTextColor={sendButtonContrastTextColor} onClose={() => setIsCartVisible(false)} />
            </div>
          )}
        </div>
      </div>

      <div ref={messagesContainerRef} onScroll={handleScroll} className="flex-1 min-h-0 overflow-y-auto scrollbar-custom p-4 space-y-4 bg-white">
        {isLoadingMessages ? (
          <div className="flex justify-center items-center h-full text-gray-500">Loading messages...</div>
        ) : chat.messages.length === 0 ? (
          <div className="flex justify-center items-center h-full text-gray-500">No messages yet. Start the conversation!</div>
        ) : (
          chat.messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              message={msg}
              brandColor={brandColor}
              userId={userId}
            />
          ))
        )}
      </div>

      {showScrollDown && (
        <button onClick={() => scrollToBottom('smooth')} className="absolute bottom-24 right-4 bg-gray-900 text-white rounded-full p-2 shadow-md hover:bg-gray-800" aria-label="Jump to latest">
          <ArrowDown size={18} />
        </button>
      )}

      <div className="flex flex-col p-4 border-t border-gray-200 bg-white flex-shrink-0 rounded-b-lg">
        {selectedFile && (
          <div className="flex items-center text-sm text-gray-600 mb-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
            <Paperclip size={16} className="mr-2" />
            <span>{selectedFile.name}</span>
            <button type="button" onClick={() => setSelectedFile(null)} className="ml-auto text-gray-400 hover:text-gray-600" aria-label="Remove attachment">
              <X size={16} />
            </button>
          </div>
        )}
        <div className="flex items-center flex-grow bg-gray-100 px-4 py-2 rounded-2xl border border-gray-200">
          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
          <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2 cursor-pointer rounded-full text-gray-500 hover:bg-gray-200" aria-label="Attach file">
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
            disabled={(!messageInput.trim() && !selectedFile) || isSendingMessage}
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