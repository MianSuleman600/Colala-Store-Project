// src/utils/data/dummyReferrals.js
import reviewerAvatar1 from '../../assets/images/productImages/2.jpeg';
import reviewerAvatar2 from '../../assets/images/productImages/3.jpeg';
import reviewerAvatar3 from '../../assets/images/productImages/4.jpeg';

export const DUMMY_REFERRAL_WALLET = {
  totalEarnings: 35000,
  totalReferrals: 20,
  referralCode: 'QERDEQWE',
  currency: '₦',
  availableBalance: 12000,
};

export const DUMMY_REFERRAL_TRANSACTIONS = [
  { id: 'tx-001', type: 'earning', amount: 2000, date: '2025-07-12T10:00:00Z', note: 'Order #123 commission' },
  { id: 'tx-002', type: 'withdrawal', amount: -5000, date: '2025-07-13T12:15:00Z', note: 'Bank withdrawal' },
  { id: 'tx-003', type: 'transfer', amount: -2000, date: '2025-07-14T09:30:00Z', note: 'Transfer to shopping wallet' },
];

export const DUMMY_REFERRAL_FAQS = {
  videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
  thumbnail: 'https://placehold.co/1200x234/000000/FFFFFF?text=Referral+Intro+Video',
  items: [
    { question: 'What is the referral program?', answer: 'Earn commission when people you refer make purchases.' },
    { question: 'How to earn on Colala?', answer: 'Share your code/link. When referred users buy, you earn a commission.' },
    { question: 'When can I withdraw?', answer: 'Once your available balance meets the minimum withdrawal threshold.' },
  ],
};

export const DUMMY_REFERRAL_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Dell Inspiron Laptop',
    price: 2000000,
    commission: '5%',
    store: 'Sasha Stores',
    storeAvatar: 'https://placehold.co/30x30/f44336/ffffff?text=S',
    imageUrl: 'https://placehold.co/80x80/e0e0e0/000000?text=Dell+Laptop',
  },
  {
    id: 'prod-2',
    name: 'Apple iPhone 15',
    price: 3200000,
    commission: '4%',
    store: 'Vee Store',
    storeAvatar: 'https://placehold.co/30x30/2196F3/ffffff?text=V',
    imageUrl: 'https://placehold.co/80x80/e0e0e0/000000?text=iPhone',
  },
];