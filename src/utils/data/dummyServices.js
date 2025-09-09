// src/features/services/data/dummyServices.js
import serviceImage1 from '../../assets/images/productImages/1.png';
import serviceImage2 from '../../assets/images/productImages/3.jpeg';
import userProfilePic from '../../assets/images/profileImage.png';

export const dummyServices = [
    {
        id: 'service-1',
        imageUrl: serviceImage1,
        name: 'Sasha Fashion Designer',
        minPrice: 5000,
        maxPrice: 20000,
        serviceViews: 200,
        productClicks: 15,
        messages: 3,
        userName: 'Sasha Stores',
        profilePic: userProfilePic,
        rating: 4.5,
        orderId: 'ORD-1234DFKFK',
        dateCreated: 'July 19, 2025 - 07:22AM',
        views: 2000,
        phoneViews: 15,
        chats: 5,
        chartData: [
            { date: '1 Jul', impressions: 50, visitors: 30, chats: 10 },
            { date: '2 Jul', impressions: 70, visitors: 45, chats: 15 },
            { date: '3 Jul', impressions: 40, visitors: 20, chats: 8 },
        ],
    },
    {
        id: 'service-2',
        imageUrl: serviceImage2,
        name: 'Sasha Fashion Designer',
        minPrice: 5000,
        maxPrice: 20000,
        serviceViews: 200,
        productClicks: 15,
        messages: 3,
        userName: 'Sasha Stores',
        profilePic: userProfilePic,
        rating: 4.5,
        orderId: 'ORD-5678GHIJL',
        dateCreated: 'July 20, 2025 - 08:30AM',
        views: 1500,
        phoneViews: 10,
        chats: 4,
        chartData: [
            { date: '1 Jul', impressions: 40, visitors: 25, chats: 8 },
            { date: '2 Jul', impressions: 60, visitors: 35, chats: 12 },
            { date: '3 Jul', impressions: 30, visitors: 18, chats: 6 },
        ],
    },
];

