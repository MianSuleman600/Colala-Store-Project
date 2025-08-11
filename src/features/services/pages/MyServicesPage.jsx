// src/features/services/pages/MyServicesPage.jsx
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import ServiceDisplayCard from '../../../components/services/ServiceDisplayCard';
import ServiceStatModal from '../../../components/services/ServiceStatModal';
import { getContrastTextColor } from '../../../utils/colorUtils';

// Import RTK Query hook
import { useGetStoreProfileQuery } from '../../../services/storeProfileApi';

// Dummy images for demonstration
import serviceImage1 from '../../../assets/images/productImages/1.png';
import serviceImage2 from '../../../assets/images/productImages/3.jpeg';
import userProfilePic from '../../../assets/images/profileImage.png';

const MyServicesPage = () => {
    const navigate = useNavigate();
    
    // Get user ID and login status from Redux store
    const { userId, isLoggedIn } = useSelector((state) => state.user);

    // Fetch the store profile data using the RTK Query hook
    // The query will skip if the user is not logged in or the userId is not available
    const { data: storeProfile, isLoading: isProfileLoading, error: profileError } = useGetStoreProfileQuery(userId, {
        skip: !isLoggedIn || !userId,
    });

    // Use the brandColor from the fetched profile data, with a fallback
    const brandColor = storeProfile?.brandColor || '#EF4444';
    const contrastTextColor = getContrastTextColor(brandColor);

    const [activeTab, setActiveTab] = useState('services');
    const [showServiceStatModal, setShowServiceStatModal] = useState(false);
    const [selectedServiceStats, setSelectedServiceStats] = useState(null);

    const dummyServices = [
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
            dateCreated: 'July 19,2025 - 07:22AM',
            views: 2000,
            phoneViews: 15,
            chats: 5,
            chartData: [
                { date: '1 Jul', impressions: 50, visitors: 30, chats: 10 },
                { date: '2 Jul', impressions: 70, visitors: 45, chats: 15 },
                { date: '3 Jul', impressions: 40, visitors: 20, chats: 8 },
                { date: '4 Jul', impressions: 60, visitors: 35, chats: 12 },
                { date: '5 Jul', impressions: 80, visitors: 50, chats: 20 },
                { date: '6 Jul', impressions: 75, visitors: 48, chats: 18 },
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
            dateCreated: 'July 20,2025 - 08:30AM',
            views: 1500,
            phoneViews: 10,
            chats: 4,
            chartData: [
                { date: '1 Jul', impressions: 40, visitors: 25, chats: 8 },
                { date: '2 Jul', impressions: 60, visitors: 35, chats: 12 },
                { date: '3 Jul', impressions: 30, visitors: 18, chats: 6 },
                { date: '4 Jul', impressions: 50, visitors: 30, chats: 10 },
                { date: '5 Jul', impressions: 70, visitors: 40, chats: 14 },
                { date: '6 Jul', impressions: 65, visitors: 38, chats: 11 },
            ],
        },
    ];

    const dummyProducts = []; // Keep this empty or populate if you have product data

    const handleViewServiceStats = (serviceId) => {
        const service = dummyServices.find(s => s.id === serviceId);
        if (service) {
            setSelectedServiceStats(service);
            setShowServiceStatModal(true);
        }
    };

    const handleCloseServiceStatModal = () => {
        setShowServiceStatModal(false);
        setSelectedServiceStats(null);
    };

    if (!isLoggedIn) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Access Denied</h2>
                <p className="text-gray-700 mb-6">Please log in to view your services.</p>
                <Link to="/login" className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">
                    Go to Login
                </Link>
            </div>
        );
    }

    if (isProfileLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
                <p className="text-lg text-gray-700">Loading your store profile...</p>
            </div>
        );
    }

    if (profileError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
                <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Profile</h2>
                <p className="text-red-600 mb-6">Could not load store data: {profileError.message || 'Unknown error'}</p>
            </div>
        );
    }


    return (
        <div className="container mx-auto p-4 rounded-2xl md:p-8 bg-gray-50 min-h-screen">
           

            {activeTab === 'services' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-6">
                    {dummyServices.map(service => (
                        <ServiceDisplayCard
                            key={service.id}
                            service={service}
                            brandColor={brandColor}
                            onViewStatsClick={handleViewServiceStats}
                        />
                    ))}
                </div>
            )}

            {activeTab === 'products' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <p className="text-gray-600">My Products content will go here.</p>
                </div>
            )}

            {showServiceStatModal && selectedServiceStats && (
                <ServiceStatModal
                    isOpen={showServiceStatModal}
                    onClose={handleCloseServiceStatModal}
                    serviceStats={selectedServiceStats}
                    brandColor={brandColor}
                    contrastTextColor={contrastTextColor}
                />
            )}
        </div>
    );
};

export default MyServicesPage;
