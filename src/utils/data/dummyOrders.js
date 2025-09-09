// src/utils/data/dummyOrders.js
import pic1 from '../../assets/images/productImages/2.jpeg';
import pic2 from '../../assets/images/productImages/3.jpeg';

// Orders for default_user_id (Sasha Stores)
export const dummyOrders = [
  {
    id: 'order1',
    customerName: 'Adewale Fiazah',
    itemCount: 2,
    totalPrice: 9999990,
    status: 'New',
    conversationId: 'chat-1', // Link to the 'Sasha Stores' chat
    paymentMethod: 'Shopping Wallet',
    discountPoints: 500,
    phoneNumber: '0703123456789',
    deliveryAddress: 'No 7, abcd street, Ikeja, Lagos',
    itemsCost: 3000000,
    couponDiscount: 5000,
    pointsDiscount: 10000,
    deliveryFee: 10000,
    totalToPay: 2995000,
    items: [
      { id: 'item1-1', imageUrl: pic1, name: 'Iphone 16 pro max - Black', price: 2500000, quantity: 1, color: 'black', size: null },
      { id: 'item1-2', imageUrl: pic2, name: 'AirPods Pro 3', price: 500000, quantity: 1, color: null, size: null },
    ],
  },
  {
    id: 'order2',
    customerName: 'Adam Shawn',
    itemCount: 2,
    totalPrice: 9999990,
    status: 'New',
    conversationId: null, // This order does not have a chat yet
    paymentMethod: 'Bank Transfer',
    discountPoints: 200,
    phoneNumber: '08012345678',
    deliveryAddress: 'Flat 4, xyz avenue, Abuja, FCT',
    itemsCost: 2500000,
    couponDiscount: 0,
    pointsDiscount: 5000,
    deliveryFee: 15000,
    totalToPay: 2510000,
    items: [
      { id: 'item2-1', imageUrl: pic2, name: 'MacBook Air M3', price: 1800000, quantity: 1, color: 'spacegray', size: '13-inch' },
      { id: 'item2-2', imageUrl: pic1, name: 'Dell UltraSharp Monitor', price: 700000, quantity: 1, color: null, size: '27-inch' },
    ],
  },
  {
    id: 'order4',
    customerName: 'Sasha Sloan',
    itemCount: 2,
    totalPrice: 9999990,
    status: 'Completed',
    conversationId: null, // This order does not have a chat yet
    paymentMethod: 'Shopping Wallet',
    discountPoints: 0,
    phoneNumber: '07011223344',
    deliveryAddress: 'Block 5, def street, Enugu, Enugu',
    itemsCost: 3400000,
    couponDiscount: 0,
    pointsDiscount: 0,
    deliveryFee: 12000,
    totalToPay: 3412000,
    items: [
      { id: 'item4-1', imageUrl: 'https://placehold.co/80x80/cccccc/000000?text=TV', name: 'LG OLED TV', price: 3000000, quantity: 1, color: 'black', size: '65-inch' },
      { id: 'item4-2', imageUrl: 'https://placehold.co/80x80/cccccc/000000?text=Soundbar', price: 400000, quantity: 1, color: 'black', size: null },
    ],
  },
];

// Orders for another_user_id (Techie Hub)
export const dummyOrdersForTechieHub = [
  {
    id: 'order1',
    customerName: 'Mike Brown',
    itemCount: 2,
    totalPrice: 900000,
    status: 'New',
    conversationId: 'chat-2', // Link this order to the 'Vee Stores' chat
    paymentMethod: 'Card',
    discountPoints: 50,
    phoneNumber: '08099887766',
    deliveryAddress: 'Suite 5, Tech Street, Abuja',
    itemsCost: 850000,
    couponDiscount: 2000,
    pointsDiscount: 5000,
    deliveryFee: 15000,
    totalToPay: 838000,
    items: [
      { id: 'item1-1', imageUrl: pic1, name: 'Lenovo Laptop', price: 600000, quantity: 1, color: 'silver', size: '15-inch' },
      { id: 'item1-2', imageUrl: pic2, name: 'Wireless Mouse', price: 250000, quantity: 1, color: null, size: null },
    ],
  },
];