// src/components/Chat/ChatMessage.jsx
import React from 'react';
import { FileText, ShoppingCart } from 'lucide-react';
import { getContrastTextColor } from '../../utils/colorUtils';

const ChatMessage = ({
  message,
  brandColor = '#2563EB',
  userId,
}) => {
  const isSent = message.isMine || message.senderId === userId;
  const alignment = isSent ? 'justify-end' : 'justify-start';
  const messageBgColor = isSent ? brandColor : '#E5E7EB'; // gray-200
  const messageTextColor = isSent ? getContrastTextColor(brandColor) : '#1F2937'; // gray-800

  const renderMessageContent = () => {
    switch (message.type) {
      case 'image':
        return (
          <div className="relative w-48 md:w-64 rounded-lg overflow-hidden shadow-sm cursor-pointer" onClick={() => window.open(message.payload?.url, '_blank')}>
            <img src={message.payload?.url} alt={message.text || 'Image'} className="w-full h-full object-cover" />
            {message.text && (
              <p className="absolute bottom-0 left-0 p-2 text-xs font-medium text-white bg-black bg-opacity-50 w-full break-words">
                {message.text}
              </p>
            )}
          </div>
        );
      case 'file':
        return (
          <div className="flex items-center p-3 rounded-2xl max-w-xs md:max-w-md shadow-sm" style={{ backgroundColor: messageBgColor, color: messageTextColor }}>
            <FileText size={16} className="mr-2 flex-shrink-0" />
            <span className="text-sm font-medium break-all">
              {message.payload?.name || message.text || 'File'}
            </span>
          </div>
        );
      case 'cart':
         return (
             <div className="flex items-center p-3 rounded-2xl max-w-xs md:max-w-md shadow-sm" style={{ backgroundColor: messageBgColor, color: messageTextColor }}>
                 <ShoppingCart size={16} className="mr-2" />
                 <span className="text-sm font-medium">
                     Shared {message.payload?.items?.length || 0} item(s)
                 </span>
             </div>
         );
      case 'text':
      default:
        return (
          <div className="p-3 max-w-xs md:max-w-md break-words whitespace-pre-wrap rounded-lg shadow-sm" style={{ backgroundColor: messageBgColor, color: messageTextColor }}>
            <p>{message.text}</p>
          </div>
        );
    }
  };

  return (
    <div className={`flex items-end ${alignment} group`}>
        <div className={`flex flex-col ${isSent ? 'items-end' : 'items-start'}`}>
            {renderMessageContent()}
            <div className="text-right text-xs text-gray-500 mt-1 px-1">
                {message.createdAt ? new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
            </div>
        </div>
    </div>
  );
};

export default React.memo(ChatMessage);