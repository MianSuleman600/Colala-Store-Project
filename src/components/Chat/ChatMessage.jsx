// src/components/Chat/ChatMessage.jsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MoreVertical, Edit, Trash2, FileText, ShoppingCart } from 'lucide-react';
import { getContrastTextColor } from '../../utils/colorUtils';
import CartDropdown from '../common/CartDropdown';

const ChatMessage = ({
  message,
  currentUserProfilePic,
  otherUserProfilePic,
  brandColor = '#2563EB',
  userId,
  onEdit,
  onDelete,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const menuRef = useRef(null);

  const isSent = message.isMine || message.sender === 'sent';
  const alignment = isSent ? 'justify-end' : 'justify-start';
  const messageTextColor = isSent ? getContrastTextColor(brandColor) : 'text-gray-800';
  const senderProfilePic = isSent ? currentUserProfilePic : otherUserProfilePic;

  // Preload fallback
  const [fallbackLoaded, setFallbackLoaded] = useState(false);
  useEffect(() => {
    const img = new Image();
    img.src = '/fallback-profile.png';
    img.onload = () => setFallbackLoaded(true);
  }, []);

  const handleImgError = useCallback(
    (e) => {
      if (fallbackLoaded && e.currentTarget.src !== '/fallback-profile.png') {
        e.currentTarget.src = '/fallback-profile.png';
      }
    },
    [fallbackLoaded]
  );

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setIsMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const renderMessageContent = () => {
    switch (message.type) {
      case 'image':
        return (
          <div
            className="relative w-48 md:w-64 rounded-lg overflow-hidden shadow-sm cursor-pointer"
            onClick={() => message.payload?.url && window.open(message.payload.url, '_blank')}
          >
            <img
              src={message.payload?.url}
              alt={message.text || message.payload?.name || 'Image'}
              className="w-full h-full object-cover"
              onError={handleImgError}
            />
            {message.text && (
              <p className="absolute bottom-0 left-0 p-2 text-xs font-medium text-white bg-black bg-opacity-50 w-full break-words">
                {message.text}
              </p>
            )}
            <p className="absolute bottom-0 right-2 text-xs text-white opacity-75">
              {message.createdAt ? new Date(message.createdAt).toLocaleTimeString() : ''}
            </p>
          </div>
        );

      case 'file':
        return (
          <div
            className={`flex items-center p-3 rounded-2xl max-w-xs md:max-w-md shadow-sm cursor-pointer ${
              isSent ? '' : 'bg-gray-200'
            }`}
            style={isSent ? { backgroundColor: brandColor, color: messageTextColor } : {}}
            onClick={() => message.payload?.url && window.open(message.payload.url, '_blank')}
          >
            <FileText size={16} className="mr-2" />
            <span className="text-sm font-medium break-words whitespace-pre-wrap">
              {message.payload?.name || 'Unknown file'}
            </span>
            <p className={`text-xs ml-auto pl-2 ${isSent ? 'text-white text-opacity-75' : 'text-gray-500'}`}>
              {message.createdAt ? new Date(message.createdAt).toLocaleTimeString() : ''}
            </p>
          </div>
        );

      case 'cart':
        return (
          <div className="relative">
            <button
              type="button"
              className={`flex items-center p-3 rounded-2xl max-w-xs md:max-w-md shadow-sm cursor-pointer ${
                isSent ? '' : 'bg-gray-200'
              }`}
              style={isSent ? { backgroundColor: brandColor, color: messageTextColor } : {}}
              onClick={() => setIsCartOpen((prev) => !prev)}
            >
              <ShoppingCart size={16} className="mr-2" />
              <span className="text-sm font-medium">
                {message.payload?.items?.length || 0} item(s) - $
                {message.payload?.totalPrice?.toLocaleString() || 0}
              </span>
              <p className={`text-xs ml-auto pl-2 ${isSent ? 'text-white text-opacity-75' : 'text-gray-500'}`}>
                {message.createdAt ? new Date(message.createdAt).toLocaleTimeString() : ''}
              </p>
            </button>

            {isCartOpen && (
              <div className="absolute z-20 mt-2 right-0">
                <CartDropdown
                  onClose={() => setIsCartOpen(false)}
                  brandColor={brandColor}
                  contrastTextColor={messageTextColor}
                  userId={message.chatId || userId}
                  cartItems={message.payload?.items || []}
                />
              </div>
            )}
          </div>
        );

      case 'text':
      default:
        return (
          <div
            className={`p-3 max-w-[90%] break-words whitespace-pre-wrap rounded-lg ${
              isSent ? '' : 'bg-gray-200 text-gray-800'
            }`}
            style={isSent ? { backgroundColor: brandColor, color: messageTextColor } : {}}
          >
            <p>{message.text}</p>
            <div className={`text-right text-xs opacity-75 mt-1 ${isSent ? 'text-white' : 'text-gray-600'}`}>
              {message.createdAt ? new Date(message.createdAt).toLocaleTimeString() : ''}
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`flex items-end ${alignment} mb-4 group relative`}>
      {!isSent && (
        <img
          src={senderProfilePic || '/fallback-profile.png'}
          alt="User"
          className="w-8 h-8 rounded-full object-cover mr-2 flex-shrink-0"
          onError={handleImgError}
        />
      )}

      <div className={`flex flex-col ${isSent ? 'items-end' : 'items-start'} relative`}>
        {isSent && message.type !== 'cart' && (
          <div ref={menuRef} className="absolute top-0 right-10 flex items-center">
            <button
              type="button"
              onClick={() => setIsMenuOpen((v) => !v)}
              className="p-1 rounded-full text-gray-500 hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Message options"
            >
              <MoreVertical size={16} />
            </button>
            {isMenuOpen && (
              <div className="absolute top-0 right-8 bg-white shadow-lg rounded-md border border-gray-200 z-10">
                <button
                  type="button"
                  onClick={() => {
                    onEdit?.(message);
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full whitespace-nowrap"
                >
                  <Edit size={14} className="mr-2" /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onDelete?.(message);
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
      </div>

      {isSent && (
        <img
          src={senderProfilePic || '/fallback-profile.png'}
          alt="User"
          className="w-8 h-8 rounded-full object-cover ml-2 flex-shrink-0"
          onError={handleImgError}
        />
      )}
    </div>
  );
};

// Memoize by id to avoid unnecessary re-renders
export default React.memo(ChatMessage, (prev, next) => prev.message.id === next.message.id);