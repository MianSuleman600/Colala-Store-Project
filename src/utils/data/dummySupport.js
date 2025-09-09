// src/utils/data/dummySupport.js
export const DUMMY_SUPPORT_CHATS = [
  {
    id: 'chat-1',
    name: 'Customer Agent - Adam',
    status: 'Pending',
    lastMessageTime: 'Today / 07:22 AM',
    unreadCount: 1,
    messages: [
      {
        id: 'm-1',
        sender: 'agent',
        content: { type: 'text', text: 'Hello! How can I help you today?' },
        timestamp: '07:20 AM',
      },
    ],
  },
  {
    id: 'chat-2',
    name: 'Vee Stores',
    status: 'Resolved',
    lastMessageTime: 'Today / 07:22 AM',
    unreadCount: 1,
    messages: [
      { id: 'm-1', sender: 'user', content: { type: 'text', text: 'How will I get the product delivered' }, timestamp: '07:22 AM' },
      { id: 'm-2', sender: 'agent', content: { type: 'text', text: 'Thank you for purchasing from us' }, timestamp: '07:22 AM' },
      { id: 'm-3', sender: 'agent', content: { type: 'text', text: 'I will arrange a dispatch rider soon and i will contact you' }, timestamp: '07:22 AM' },
      { id: 'm-4', sender: 'user', content: { type: 'text', text: 'Okay I will be expecting.' }, timestamp: '07:22 AM' },
    ],
  },
];

export const DUMMY_SUPPORT_TICKETS = []; // in-memory; structure created at runtime