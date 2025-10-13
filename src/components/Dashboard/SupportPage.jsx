import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import PaperClipIcon from '../../assets/icons/Paperclip.png';
import ScrollToTop from '../../components/ui/ScrollToTop';
import { useToast } from '../../components/ui/ToastProvider';
import { useSupportTicketsQuery, useSupportTicketByIdQuery } from '../../services/queries/useSupportQuery.js';
import { useSendSupportMessageMutation, useCreateSupportTicketMutation } from '../../services/mutations/useSupportMutation.js';

// --- Main Page Component ---
export default function SupportPage() {
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  
  // --- OPTIMIZATION: Get user and brand color directly from Redux state ---
  const user = useSelector((state) => state.auth.user);
  const brandColor = useMemo(() => user?.store?.brandColor || user?.store?.theme_color || '#EF4444', [user]);
  const contrastColor = '#FFFFFF'; // Contrast is almost always white for brand colors
  // --- END OPTIMIZATION ---

  const { data: tickets = [], isLoading: isLoadingTickets } = useSupportTicketsQuery();
  const { data: selectedTicket, isLoading: isLoadingSelectedTicket } = useSupportTicketByIdQuery(selectedTicketId);

  const sendMessageMutation = useSendSupportMessageMutation();
  const createTicketMutation = useCreateSupportTicketMutation();
  
  if (isLoadingTickets) {
    return <div className="p-8 text-center text-gray-600">Loading Support Center...</div>;
  }

  const Avatar = ({ name }) => {
    const initial = (name || 'S').charAt(0).toUpperCase();
    const hash = Array.from(name || 'S').reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) | 0, 0);
    const bgColor = `hsl(${Math.abs(hash) % 360}deg, 75%, 50%)`;
    return <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full text-white font-bold" style={{ backgroundColor: bgColor }}>{initial}</div>;
  };
  
  const handleSendMessage = (ticket_id, message, attachment) => {
    sendMessageMutation.mutate({ ticket_id, message, attachment });
  };

  const handleCreateTicket = async (payload) => {
    const newTicketResult = await createTicketMutation.mutateAsync(payload);
    const newTicket = newTicketResult?.data;
    if (newTicket?.id) {
      setSelectedTicketId(newTicket.id);
    }
  };

  return (
    <div className="flex w-full h-full rounded-2xl bg-gray-100 overflow-hidden">
      <ScrollToTop />
      {selectedTicketId ? (
        <SupportMessageWindow
          ticket={selectedTicket}
          isLoading={isLoadingSelectedTicket}
          currentUser={user}
          onBack={() => setSelectedTicketId(null)}
          brandColor={brandColor}
          contrastColor={contrastColor}
          onSendMessage={handleSendMessage}
          Avatar={Avatar}
        />
      ) : (
        <SupportTicketList
          tickets={tickets}
          onSelectTicket={setSelectedTicketId}
          onCreateTicket={handleCreateTicket}
          brandColor={brandColor}
          Avatar={Avatar}
        />
      )}
    </div>
  );
}

// --- Sub-component: Ticket List ---
const SupportTicketList = ({ tickets, onSelectTicket, onCreateTicket, brandColor, Avatar }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  const filteredTickets = useMemo(() => {
    const s = searchTerm.toLowerCase();
    return (tickets || []).filter(
      (ticket) => ticket.subject?.toLowerCase().includes(s) && (activeTab === 'All' || (ticket.status && ticket.status.toLowerCase() === activeTab.toLowerCase()))
    );
  }, [tickets, searchTerm, activeTab]);

  return (
    <div className="w-full h-full flex flex-col">
      <header className="p-4 border-b flex justify-between items-center bg-white flex-shrink-0">
        <h1 className="text-2xl font-bold">Support</h1>
        <button onClick={() => setIsFormOpen(true)} className="px-4 py-2 text-sm font-semibold rounded-lg text-white" style={{ backgroundColor: brandColor }}>
          New Ticket
        </button>
      </header>
      <main className="flex-1 overflow-y-auto p-4 bg-gray-100">
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-gray-500"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
          </div>
          <input
            type="search" placeholder="Search by subject" className="block w-full p-2 pl-10 text-sm border border-gray-300 rounded-lg bg-gray-50"
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex justify-around mb-4 bg-white p-1 rounded-lg shadow-sm">
          {['All', 'Pending', 'Resolved'].map((tab) => (
            <button
              key={tab}
              className={`flex-1 py-2 px-4 rounded-md transition-colors font-medium text-sm ${activeTab === tab ? 'text-white shadow' : 'text-gray-600 hover:bg-gray-200'}`}
              style={activeTab === tab ? { backgroundColor: brandColor } : {}}
              onClick={() => setActiveTab(tab)}
            >{tab}</button>
          ))}
        </div>
        <ul className="space-y-2">
          {filteredTickets.length > 0 ? (
            filteredTickets.map((ticket) => (
              <li key={ticket.id} className="bg-white rounded-xl shadow-sm cursor-pointer p-3 hover:bg-gray-50" onClick={() => onSelectTicket(ticket.id)}>
                <div className="flex items-center space-x-4">
                  <Avatar name={ticket.subject} />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{ticket.subject}</p>
                    <p className="text-xs text-gray-500 capitalize">{ticket.status || 'pending'}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-gray-500">{new Date(ticket.last_message?.created_at || ticket.created_at).toLocaleDateString()}</p>
                    {ticket.unread_messages_count > 0 && (
                      <span className="inline-flex items-center justify-center h-5 w-5 mt-1 text-xs font-semibold text-white rounded-full" style={{ backgroundColor: brandColor }}>
                        {ticket.unread_messages_count}
                      </span>
                    )}
                  </div>
                </div>
              </li>
            ))
          ) : (
            <p className="text-gray-500 text-center py-8">No tickets found.</p>
          )}
        </ul>
      </main>
      <SupportFormModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} brandColor={brandColor} contrastColor={'white'} onSubmit={onCreateTicket} />
    </div>
  );
};

// --- Sub-component: Message Window ---
const SupportMessageWindow = ({ ticket, isLoading, currentUser, onBack, brandColor, contrastColor, onSendMessage, Avatar }) => {
  const { push } = useToast();
  const [newMessage, setNewMessage] = useState('');
  const [attachment, setAttachment] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [ticket?.messages]);

  const handleSendMessageClick = () => {
    if (!ticket?.id) return;
    if (!newMessage.trim() && !attachment) { push('Please type a message or add an attachment.', { type: 'error' }); return; }
    onSendMessage(ticket.id, newMessage, attachment);
    setNewMessage('');
    setAttachment(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachment(file);
      push(`Selected file: ${file.name}`, { type: 'info' });
    }
  };

  const clearAttachment = () => {
    setAttachment(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };
  
  return (
    <div className="flex flex-col w-full h-full bg-gray-100">
      <header className="bg-white shadow-sm p-4 flex items-center flex-shrink-0">
        <button onClick={onBack} className="mr-4 text-gray-500 hover:text-gray-700" aria-label="Back">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
        </button>
        <div className="flex items-center space-x-3">
          <Avatar name={ticket?.subject || '?'} />
          <div>
            <h5 className="font-semibold text-gray-900">{ticket?.subject || 'Loading...'}</h5>
            <p className="text-xs text-gray-500">Ticket #{ticket?.id}</p>
          </div>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto p-4 space-y-2">
        {isLoading ? (
          <div className="text-center py-10 text-gray-500">Loading messages...</div>
        ) : (
          (ticket?.messages || []).map((msg) => {
            const isCurrentUser = msg.sender_id === currentUser.id;
            return (
              <div key={msg.id} className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                <div
                  className={`rounded-xl p-3 max-w-xs sm:max-w-md break-words shadow-sm ${isCurrentUser ? 'text-white' : 'bg-white text-gray-900'}`}
                  style={{ backgroundColor: isCurrentUser ? brandColor : '#FFFFFF', color: isCurrentUser ? contrastColor : '#1F2937' }}
                >
                  {msg.message && <p>{msg.message}</p>}
                  {msg.attachment && <a href={msg.attachment_url} target="_blank" rel="noopener noreferrer" className="text-sm underline mt-2 block font-medium">View Attachment</a>}
                </div>
                <p className={`text-xs text-gray-400 mt-1 px-1`}>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </main>
      <footer className="bg-white p-4 border-t border-gray-200 flex-shrink-0">
        <div className="flex items-center w-full px-4 py-2 bg-gray-100 rounded-full">
          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
          <button onClick={() => fileInputRef.current.click()} className="text-gray-500 hover:text-gray-700 mr-3" aria-label="Attach file">
            <img src={PaperClipIcon} alt="Attach" className="h-5 w-5" />
          </button>
          <input
            type="text"
            placeholder={attachment ? `File: ${attachment.name}` : "Type a message"}
            className="flex-1 bg-transparent border-none focus:outline-none text-gray-700"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(event) => event.key === 'Enter' && handleSendMessageClick()}
          />
          {attachment && <button onClick={clearAttachment} className="text-xs text-red-500 font-semibold mx-2">Clear</button>}
          <button onClick={handleSendMessageClick} className="text-gray-500 hover:text-gray-700 ml-3" style={{ color: brandColor }} aria-label="Send message">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.769 59.769 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" /></svg>
          </button>
        </div>
      </footer>
    </div>
  );
};

// --- Sub-component: New Ticket Modal ---
const SupportFormModal = ({ isOpen, onClose, brandColor, contrastColor, onSubmit }) => {
  const { push } = useToast();
  const [category, setCategory] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const { isLoading: isSubmitting } = useCreateSupportTicketMutation();

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!category || !subject.trim() || !description.trim()) {
      push('Please fill all fields.', { type: 'error' });
      return;
    }
    onSubmit({ category, subject, description });
    onClose();
  };

  return (
    <div className="fixed inset-0 backdrop-blur-xl flex items-center justify-center z-50 p-4">
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="p-6 flex justify-between items-center border-b">
          <h2 className="text-xl font-bold">New Support Ticket</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800" aria-label="Close modal">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg bg-white appearance-none focus:outline-none focus:ring-2" style={{'--tw-ring-color': brandColor}}>
            <option value="">Select Category</option>
            <option value="billing">Billing Issue</option>
            <option value="shipping">Shipping Issue</option>
            <option value="technical">Technical Issue</option>
            <option value="other">Other</option>
          </select>
          <input type="text" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2" style={{'--tw-ring-color': brandColor}} />
          <textarea rows="4" placeholder="Describe your issue in detail..." value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2" style={{'--tw-ring-color': brandColor}} />
          <button type="submit" disabled={isSubmitting} className="w-full py-3 font-semibold rounded-lg text-white" style={{ backgroundColor: brandColor, opacity: isSubmitting ? 0.7 : 1 }}>
            {isSubmitting ? 'Creating Ticket...' : 'Create Ticket'}
          </button>
        </form>
      </div>
    </div>
  );
};