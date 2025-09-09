// src/utils/data/dummychats.js
import userProfilePicSasha from '../../assets/images/profileImage.png';
import userProfilePicVee from '../../assets/images/feed/2.png';
import userProfilePicAdam from '../../assets/images/feed/3.png';
import userProfilePicScent from '../../assets/images/productImages/1.png';
import userProfilePicPower from '../../assets/images/productImages/2.jpeg';
import userProfilePicCreamila from '../../assets/images/productImages/3.jpeg';
import userProfilePicDannova from '../../assets/images/productImages/4.jpeg';
import iphone16proMax from '../../assets/images/feed/2.png';

export const dummyChats = [
  {
    // Updated ID for consistency with dummyOrders.js
    id: 'chat-1', 
    userName: 'Sasha Stores',
    userProfilePic: userProfilePicSasha,
    lastMessage: 'How will I get my goods delivered?',
    time: 'Today / 07:22 AM',
    unreadCount: 1,
    messages: [
      // Product/Cart message
      {
        id: 'msg-1-1',
        type: 'cart',
        payload: {
          items: [
            { name: 'Iphone 16 pro max - Black', price: 5000000, qty: 1, image: iphone16proMax },
            { name: 'Iphone 16 pro max - Red', price: 2500000, qty: 2, image: iphone16proMax },
          ],
          totalPrice: 10000000,
        },
        time: '07:22 AM',
      },
      // Text messages
      { id: 'msg-1-2', type: 'text', text: 'How will I get the product delivered?', time: '07:22 AM', sender: 'sent' },
      { id: 'msg-1-3', type: 'text', text: 'Thank you for purchasing from us', time: '07:22 AM', sender: 'received' },
      { id: 'msg-1-4', type: 'text', text: 'I will arrange a dispatch rider soon', time: '07:22 AM', sender: 'received' },
      { id: 'msg-1-5', type: 'text', text: 'Okay I will be expecting.', time: '07:22 AM', sender: 'sent' },
      // Image message
      {
        id: 'msg-1-6',
        type: 'image',
        payload: { url: userProfilePicSasha, caption: 'Here is the product image' },
        time: '07:23 AM',
        sender: 'received',
      },
    ],
  },
  {
    id: 'chat-2',
    userName: 'Vee Stores',
    userProfilePic: userProfilePicVee,
    lastMessage: 'How will my goods delivered?',
    time: 'Today / 07:22 AM',
    unreadCount: 1,
    messages: [
      { id: 'msg-2-1', type: 'text', text: 'Hello Vee!', time: '07:20 AM', sender: 'received' },
      { id: 'msg-2-2', type: 'text', text: 'Hi there!', time: '07:21 AM', sender: 'sent' },
    ],
  },
  {
    id: 'chat-3',
    userName: 'Adam Stores',
    userProfilePic: userProfilePicAdam,
    lastMessage: 'Good day Adam!',
    time: 'Today / 07:22 AM',
    unreadCount: 0,
    messages: [
      { id: 'msg-3-1', type: 'text', text: 'Good day Adam!', time: '07:25 AM', sender: 'received' },
    ],
  },
  {
    id: 'chat-4',
    userName: 'Scent Villa Stores',
    userProfilePic: userProfilePicScent,
    lastMessage: 'Hi Scent Villa!',
    time: 'Today / 07:22 AM',
    unreadCount: 0,
    messages: [
      { id: 'msg-4-1', type: 'text', text: 'Hi Scent Villa!', time: '07:30 AM', sender: 'received' },
      // Product message example
      {
        id: 'msg-4-2',
        type: 'cart',
        payload: {
          items: [
            { name: 'Perfume Set', price: 4500, qty: 1, image: userProfilePicScent },
          ],
          totalPrice: 4500,
        },
        time: '07:31 AM',
      },
    ],
  },
  {
    id: 'chat-5',
    userName: 'Power Stores',
    userProfilePic: userProfilePicPower,
    lastMessage: 'Greetings Power!',
    time: 'Today / 07:22 AM',
    unreadCount: 0,
    messages: [
      { id: 'msg-5-1', type: 'text', text: 'Greetings Power!', time: '07:35 AM', sender: 'received' },
    ],
  },
  {
    id: 'chat-6',
    userName: 'Creamila Stores',
    userProfilePic: userProfilePicCreamila,
    lastMessage: 'Hello Creamila!',
    time: 'Today / 07:22 AM',
    unreadCount: 0,
    messages: [
      { id: 'msg-6-1', type: 'text', text: 'Hello Creamila!', time: '07:40 AM', sender: 'received' },
    ],
  },
  {
    id: 'chat-7',
    userName: 'Dannova Stores',
    userProfilePic: userProfilePicDannova,
    lastMessage: 'Hi Dannova!',
    time: 'Today / 07:22 AM',
    unreadCount: 0,
    messages: [
      { id: 'msg-7-1', type: 'text', text: 'Hi Dannova!', time: '07:45 AM', sender: 'received' },
    ],
  },
];