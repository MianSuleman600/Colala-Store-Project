// src/utils/data/db.js
// Mock database with raw filenames, no hydration here
export const MOCK_DB = {
  storeProfiles: {
    default_user_id: {
      id: 'default_user_id',
      name: 'Sasha Stores',
      storeName: 'Sasha Stores',
      email: 'sashastores@example.com',
      phoneNumber: '0901234456',
      location: 'Lagos',
      categories: ['Electronics', 'Gadgets', 'Accessories'],
      profilePictureUrl: 'profileImage.png', // raw filenames
      bannerImageUrl: 'bannerImage.png',
      promotionalBannerImageUrl: 'bag.png',
      showPhoneOnProfile: true,
      brandColor: '#EF4444',
      latestOrders: [
        { id: 'order1', customer: 'John Doe', itemsCount: 3, amount: '$120' },
        { id: 'order2', customer: 'Jane Smith', itemsCount: 1, amount: '$45' },
        { id: 'order3', customer: 'Alice Johnson', itemsCount: 5, amount: '$250' },
      ],
      productsSold: 145,
      followers: 2300,
      ratings: 4.5,
      salesMessage: 'Check out our new products and get 20% off all electronics this month!',
      completionPercentage: 60,
      socialLinks: { facebook: '', twitter: '', instagram: '' },
    },
    another_user_id: {
      id: 'another_user_id',
      name: 'Techie Hub',
      storeName: 'Techie Hub',
      email: 'techiehub@example.com',
      phoneNumber: '0809876543',
      location: 'Abuja',
      categories: ['Computers', 'Laptops', 'Peripherals'],
      profilePictureUrl: 'profileImage.png',
      bannerImageUrl: 'bannerImage.png',
      promotionalBannerImageUrl: 'bag.png',
      showPhoneOnProfile: true,
      brandColor: '#3B82F6',
      latestOrders: [
        { id: 'order1', customer: 'Mike Brown', itemsCount: 2, amount: '$300' },
        { id: 'order2', customer: 'Sara White', itemsCount: 4, amount: '$600' },
      ],
      productsSold: 85,
      followers: 1200,
      ratings: 4.7,
      salesMessage: 'New arrivals this week! Get exclusive discounts on all laptops.',
      completionPercentage: 80,
      socialLinks: { facebook: '', twitter: '', instagram: '' },
    },
  },
};

// Return raw store profiles (normalization only)
export const getHydratedProfiles = (normalizeFn) => {
  if (!normalizeFn) return MOCK_DB.storeProfiles;
  return normalizeFn(MOCK_DB.storeProfiles);
};
