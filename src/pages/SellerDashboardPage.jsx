import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import DashboardHeader from '../components/Dashboard/DashboardHeader';
import DashboardSidebar from '../components/Dashboard/DashboardSidebar';
import MyProductsPage from '../features/products/pages/MyProduct';
import AnalyticsPage from '../components/Dashboard/AnalyticsPage';
import SubscriptionPage from '../components/Dashboard/SubscriptionPage';
import PromotedProductsPage from '../components/Dashboard/PromotedProductsPage';
import { getContrastTextColor } from '../utils/colorUtils';
import ManageCouponsPointsPage from '../components/Dashboard/ManageCouponsPointsPage';
import ManageAnnouncementsPage from '../components/Dashboard/ManageAnnouncementsPage';
import MyReviewsPage from '../components/Dashboard/MyReviewsPage';
import ReferralsPage from '../components/Dashboard/ReferralsPage';
import SupportPage from '../components/Dashboard/SupportPage';
import FAQs from "../components/referrals/FAQs";
import LeaderBoard from '../components/Dashboard/LeaderBoard';
import AccessControl from '../components/Dashboard/AccessControl';
import { useGetStoreProfileQuery } from '../services/storeProfileApi';
import { useSelector } from 'react-redux';

const SellerDashboardPage = () => {
    const [activeSidebarItem, setActiveSidebarItem] = useState('My Products');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

     const { isLoggedIn, userName, userId } = useSelector((state) => state.user);
    const { data: storeProfile, error, isLoading } = useGetStoreProfileQuery(userId);

    // Disable body scroll when sidebar is open
    useEffect(() => {
        document.body.style.overflow = isSidebarOpen ? 'hidden' : 'unset';
    }, [isSidebarOpen]);

    if (isLoading) {
        return <div className="p-8 text-center text-gray-600">Loading...</div>;
    }

    if (error) {
        return <div className="p-8 text-center text-red-600">Error: {error.message}</div>;
    }

    const brandColor = storeProfile?.brandColor || '#EF4444';
    const contrastTextColor = getContrastTextColor(brandColor);
    const lightBrandColor = contrastTextColor === '#FFFFFF' ? '#FEE2E2' : '#FFCCCC';

    const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

    const handleItemClick = (itemName) => {
        setActiveSidebarItem(itemName);
        setIsSidebarOpen(false);
    };

    const renderPageContent = () => {
        switch (activeSidebarItem) {
            case 'My Products':
                return <MyProductsPage brandColor={brandColor} contrastTextColor={contrastTextColor} lightBrandColor={lightBrandColor} showAddProductButton={false} />;
            case 'Analytics':
                return <AnalyticsPage brandColor={brandColor} />;
            case 'Subscriptions':
                return <SubscriptionPage brandColor={brandColor} />;
            case 'Promoted Products':
                return <PromotedProductsPage brandColor={brandColor} contrastTextColor={contrastTextColor} />;
            case 'Manage Coupons/ Points':
                return <ManageCouponsPointsPage brandColor={brandColor} contrastTextColor={contrastTextColor} lightBrandColor={lightBrandColor} />;
            case 'Announcements':
                return <ManageAnnouncementsPage brandColor={brandColor} contrastTextColor={contrastTextColor} />;
            case 'Reviews':
                return <MyReviewsPage brandColor={brandColor} contrastTextColor={contrastTextColor} />;
            case 'Referrals':
                return <ReferralsPage brandColor={brandColor} contrastTextColor={contrastTextColor} />;
            case 'Support':
                return <SupportPage brandColor={brandColor} contrastTextColor={contrastTextColor} />;
            case 'FAQs':
                return (
                    <div>
                        <h2 className='p-2 text-3xl font-bold'>FAQs</h2>
                        <FAQs brandColor={brandColor} contrastTextColor={contrastTextColor} />
                    </div>
                );
            case 'Seller Leaderboard':
                return <LeaderBoard />;
            case 'Account Access Control':
                return <AccessControl brandColor={brandColor} contrastTextColor={contrastTextColor} />;
            default:
                return <div>Select a menu item.</div>;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex lg:flex-row">
            {/* Sidebar */}
            <div className={`
                fixed lg:static inset-0 z-50 transform transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0 lg:w-1/4 xl:w-[400px]
            `}>
                <DashboardSidebar
                    brandColor={brandColor}
                    contrastTextColor={contrastTextColor}
                    activeItem={activeSidebarItem}
                    onSelectItem={handleItemClick}
                    toggleSidebar={toggleSidebar}
                    isSidebarOpen={isSidebarOpen}
                >
                    {/* Desktop header */}
                    <div className="hidden lg:block mb-4">
                        <DashboardHeader
                            brandColor={brandColor}
                            contrastTextColor={contrastTextColor}
                            toggleSidebar={toggleSidebar}
                            showHamburger={false}
                            storeProfile={storeProfile}
                        />
                    </div>
                </DashboardSidebar>
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Mobile header */}
                <div className='lg:hidden'>
                    <DashboardHeader
                        brandColor={brandColor}
                        contrastTextColor={contrastTextColor}
                        toggleSidebar={toggleSidebar}
                        showHamburger={true}
                        storeProfile={storeProfile}
                    />
                </div>
                <main className="flex-1 p-4 lg:p-8 overflow-y-auto custom-scrollbar">
                    {renderPageContent()}
                    {/* Nested routes (wallet pages) */}
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default SellerDashboardPage;
