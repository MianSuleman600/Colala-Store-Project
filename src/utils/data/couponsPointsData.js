// src/data/couponsPointsData.js

import img1 from '../../assets/images/productImages/2.jpeg';
import img2 from '../../assets/images/productImages/3.jpeg';
import img3 from '../../assets/images/productImages/4.jpeg';
import img4 from '../../assets/images/productImages/1.png';

// Coupons
export const DUMMY_COUPONS = [
  { id: 'c1', code: 'NEW123', dateCreated: '07-16-25/05:33AM', timesUsed: 25, maxUsage: 50, percentageOff: 10, usagePerUser: 1, expiryDate: '2025-12-31' },
  { id: 'c2', code: 'SAVEBIG', dateCreated: '07-15-25/11:00AM', timesUsed: 10, maxUsage: 20, percentageOff: 20, usagePerUser: 5, expiryDate: '2025-11-15' },
  { id: 'c3', code: 'WELCOME50', dateCreated: '07-14-25/09:00AM', timesUsed: 5, maxUsage: 100, percentageOff: 50, usagePerUser: 1, expiryDate: '2025-10-01' },
];

// Customer points
export const DUMMY_CUSTOMER_POINTS = [
  { id: 'cust1', name: 'Adewale Faizah', avatar: img1, points: 200 },
  { id: 'cust2', name: 'Liam Chen', avatar: img2, points: 150 },
  { id: 'cust3', name: 'Sophia Martinez', avatar: img3, points: 220 },
  { id: 'cust4', name: 'Omar Patel', avatar: img4, points: 180 },
  { id: 'cust5', name: 'Isabella Johnson', avatar: img1, points: 170 },
  { id: 'cust6', name: 'Mia Robinson', avatar: img2, points: 210 },
];

// Points summary
export const DUMMY_POINTS_SUMMARY = {
  totalPointsBalance: 5000,
};