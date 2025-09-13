import serviceImage1 from '../../assets/images/productImages/1.png';
import serviceImage2 from '../../assets/images/productImages/3.jpeg';
import userProfilePic from '../../assets/images/profileImage.png';
import serviceVideo from '../../assets/video/1.mp4';

export const dummyServices = [
  {
    id: 'service-1',
    name: 'Sasha Fashion Designer',
    userName: 'Sasha Stores',
    profilePic: userProfilePic,
    rating: 4.5,
    // Media
    imageUrl: serviceImage1,
    images: [serviceImage1, serviceImage2],
    media: {
      images: [serviceImage1, serviceImage2],
      videoUrl: serviceVideo,
    },
    videoUrl: serviceVideo,
    // Pricing
    minPrice: 5000,
    maxPrice: 20000,
    discountPrice: 3500,
    priceBreakdown: [
      { name: 'General', from: 5000, to: 20000 },
      { name: 'Male Wear', from: 7000, to: 25000 },
      { name: 'Female Wear', from: 6000, to: 22000 },
    ],
    // Descriptions
    shortDescription: 'Tailored outfits for every occasion.',
    fullDescription:
      'Expert fashion designer specializing in bespoke clothing for men and women. From casual to haute couture, we craft the perfect fit. Delivery available nationwide.',
    // Stats
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
    status: 'available',
    available: true,
  },
  {
    id: 'service-2',
    name: 'Elite Tailoring Services',
    userName: 'Elite Couture',
    profilePic: userProfilePic,
    rating: 4.7,
    // Media
    imageUrl: serviceImage2,
    images: [serviceImage2, serviceImage1],
    media: {
      images: [serviceImage2, serviceImage1],
      videoUrl: serviceVideo,
    },
    videoUrl: serviceVideo,
    // Pricing
    minPrice: 8000,
    maxPrice: 30000,
    discountPrice: 6500,
    priceBreakdown: [
      { name: 'Custom Suits', from: 15000, to: 35000 },
      { name: 'Evening Gowns', from: 20000, to: 50000 },
      { name: 'Alterations', from: 5000, to: 12000 },
    ],
    // Descriptions
    shortDescription: 'Premium tailoring for the perfect silhouette.',
    fullDescription:
      'From bespoke suits to elegant gowns, we bring your vision to life. Premium fabrics and craftsmanship. Book a fitting session today.',
    // Stats
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
    status: 'available',
    available: true,
  },
];