import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ArrowLeft, Award, Lock, LogOut, Trash2 } from "lucide-react";

import { useStoreProfile } from "../../services/queries/storeProfileQuery";
import { getContrastTextColor } from "../../utils/colorUtils";
import { authService } from "../../services/authService";
import { logout as logoutAction } from "../../features/auth/authSlice";

// Icon imports from your project structure
import SubscriptionsIcon from '../../assets/icons/settingsIcons/subscribe.png';
import AnnouncementsIcon from '../../assets/icons/settingsIcons/annocement.png';
import AnalyticsIcon from '../../assets/icons/settingsIcons/analytic.png';
import FAQsIcon from '../../assets/icons/settingsIcons/faq.png';
import ManageCouponsIcon from '../../assets/icons/settingsIcons/manage.png';
import PromotedProductsIcon from '../../assets/icons/settingsIcons/promote.png';
import ReferralsIcon from '../../assets/icons/settingsIcons/refrel.png';
import ReviewsIcon from '../../assets/icons/settingsIcons/review.png';
import ShoppingCartIcon from '../../assets/icons/settingsIcons/ShoppingCartSimple.png';
import SupportIcon from '../../assets/icons/settingsIcons/support.png';

// Import all the page components
import MyProductsPage from "../../features/products/pages/MyProduct";
import MyServicesPage from "../../features/services/pages/MyServicesPage";
import AnalyticsPage from "../Dashboard/AnalyticsPage";
import SubscriptionPage from "../Dashboard/SubscriptionPage";
import PromotedProductsPage from "../Dashboard/PromotedSection/PromotedProductsPage";
import ManageCouponsPointsPage from "../Dashboard/ManageCoupons/ManageCouponsPointsPage";
import ManageAnnouncementsPage from "../announcements/ManageAnnouncementsPage";
import MyReviewsPage from "../Dashboard/MyReviewsPage";
import ReferralsPage from "../Dashboard/ReferralsPage";
import SupportPage from "../Dashboard/SupportPage";
import FAQs from "../referrals/FAQs";
import LeaderBoard from "../Dashboard/LeaderBoard";
import AccessControl from "../Dashboard/AccessControl";

const sidebarItems = [
  { name: 'My Products', icon: ShoppingCartIcon, color: '#EF4444' },
  { name: 'Analytics', icon: AnalyticsIcon, color: '#A78BFA' },
  { name: 'Subscriptions', icon: SubscriptionsIcon, badge: 'Subscription Active', color: '#34D399' },
  { name: 'Promoted Products', icon: PromotedProductsIcon, color: '#20B2AA' },
  { name: 'Manage Coupons/ Points', icon: ManageCouponsIcon, color: '#F97316' },
  { name: 'Announcements', icon: AnnouncementsIcon, color: '#3B82F6' },
  { name: 'Reviews', icon: ReviewsIcon, color: '#C23630' },
  { name: 'Referrals', icon: ReferralsIcon, color: '#7030A0' },
  { name: 'Support', icon: SupportIcon, color: '#E17000' },
  { name: 'FAQs', icon: FAQsIcon, color: '#2F75B5' },
];

const otherItems = [
  { name: 'Seller Leaderboard', icon: Award, color: '#6B7280' },
  { name: 'Account Access Control', icon: Lock, color: '#6B7280' },
];

const MobileSettingsLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState('menu'); // 'menu' or specific page id
  const [processing, setProcessing] = useState({ logout: false, delete: false });
  
  const { userId } = useSelector((state) => state.user || {});
  const { data: storeProfile } = useStoreProfile(userId, { enabled: !!userId });

  const brandColor = useMemo(() => storeProfile?.brandColor || "#EF4444", [storeProfile]);
  const contrastTextColor = useMemo(() => getContrastTextColor(brandColor), [brandColor]);

  const handleLogout = async () => {
    if (processing.logout) return;
    setProcessing((s) => ({ ...s, logout: true }));
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout API call failed, but logging out on client-side anyway.", error);
    } finally {
      dispatch(logoutAction());
      navigate('/', { replace: true });
    }
  };

  const handleDeleteAccount = async () => {
    if (processing.delete) return;
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action is permanent and cannot be undone.'
    );
    if (!confirmed) return;

    setProcessing((s) => ({ ...s, delete: true }));
    try {
      await authService.deleteAccount();
      dispatch(logoutAction());
      navigate('/', { replace: true });
    } catch (error) {
      console.error("Failed to delete account:", error);
    } finally {
      setProcessing((s) => ({ ...s, delete: false }));
    }
  };

  const handleMenuClick = (itemName) => {
    if (itemName === 'Logout') {
      handleLogout();
      return;
    }
    if (itemName === 'Delete Account') {
      handleDeleteAccount();
      return;
    }
    setCurrentPage(itemName.toLowerCase().replace(/\s+/g, '-'));
  };

  const handleBackClick = () => {
    setCurrentPage('menu');
  };

  const renderPageContent = () => {
    switch (currentPage) {
      case 'my-products':
        return <MyProductsPage brandColor={brandColor} contrastTextColor={contrastTextColor} lightBrandColor="#FEE2E2" showAddProductButton={false} gridVariant="sidebar" />;
      case 'analytics':
        return <AnalyticsPage brandColor={brandColor} />;
      case 'subscriptions':
        return <SubscriptionPage brandColor={brandColor} />;
      case 'promoted-products':
        return <PromotedProductsPage brandColor={brandColor} contrastTextColor={contrastTextColor} />;
      case 'manage-coupons/-points':
        return <ManageCouponsPointsPage brandColor={brandColor} contrastTextColor={contrastTextColor} lightBrandColor="#FEE2E2" />;
      case 'announcements':
        return <ManageAnnouncementsPage brandColor={brandColor} contrastTextColor={contrastTextColor} />;
      case 'reviews':
        return <MyReviewsPage brandColor={brandColor} contrastTextColor={contrastTextColor} />;
      case 'referrals':
        return <ReferralsPage brandColor={brandColor} contrastTextColor={contrastTextColor} />;
      case 'support':
        return <SupportPage brandColor={brandColor} contrastTextColor={contrastTextColor} />;
      case 'faqs':
        return <FAQs brandColor={brandColor} contrastTextColor={contrastTextColor} />;
      case 'seller-leaderboard':
        return <LeaderBoard brandColor={brandColor} contrastTextColor={contrastTextColor} />;
      case 'account-access-control':
        return <AccessControl brandColor={brandColor} contrastTextColor={contrastTextColor} />;
      default:
        return null;
    }
  };

  if (currentPage === 'menu') {
    return (
      <div className="min-h-screen bg-gray-100 p-2">
        <div className="bg-white rounded-2xl p-2 shadow-md">
          {/* Header */}
          <div className="p-4">
            <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
          </div>

          {/* Menu Items with Old Sidebar Styling */}
          <nav className="space-y-4 mt-3 flex-1 overflow-y-auto custom-scrollbar">
            {sidebarItems.map((item) => (
              <div
                key={item.name}
                className="relative flex items-center p-3 pl-12 rounded-2xl cursor-pointer transition-all duration-300 transform border-2 bg-gray-100 text-gray-700 hover:bg-gray-200"
                style={{ borderColor: 'transparent' }}
                onClick={() => handleMenuClick(item.name)}
                role="button"
                aria-label={`Go to ${item.name}`}
              >
                <div
                  className="absolute left-0 top-0 bottom-0 w-10 h-full flex items-center justify-center rounded-l-2xl"
                  style={{ backgroundColor: item.color }}
                >
                  <img
                    src={item.icon}
                    alt={`${item.name} icon`}
                    className="w-5 h-5"
                    style={{ filter: 'brightness(0) invert(1)' }}
                  />
                </div>
                <span className="font-medium flex-1 pl-2">{item.name}</span>
                {item.badge && (
                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-100 text-green-700">
                    {item.badge}
                  </span>
                )}
              </div>
            ))}

            <div className="mt-6 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-500 mb-3 px-3">Others</h4>
              <nav className="space-y-1">
                {otherItems.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                    style={{ color: item.color }}
                    onClick={() => handleMenuClick(item.name)}
                    role="button"
                    aria-label={`Go to ${item.name}`}
                  >
                    <item.icon size={20} className="mr-3" />
                    <span className="font-medium">{item.name}</span>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={processing.logout}
                  className={`w-full flex items-center p-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors duration-200 text-left ${
                    processing.logout ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                  aria-label="Logout"
                >
                  <LogOut size={20} className="mr-3" />
                  <span className="font-medium">{processing.logout ? 'Logging out...' : 'Logout'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={processing.delete}
                  className={`w-full flex items-center p-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors duration-200 text-left ${
                    processing.delete ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                  aria-label="Delete account"
                >
                  <Trash2 size={20} className="mr-3" />
                  <span className="font-medium">{processing.delete ? 'Deleting...' : 'Delete Account'}</span>
                </button>
              </nav>
            </div>
          </nav>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header with Back Button */}
      <div className="bg-white shadow-sm">
        <div className="p-4 flex items-center space-x-3">
          <button
            onClick={handleBackClick}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">
            {sidebarItems.find(item => item.name.toLowerCase().replace(/\s+/g, '-') === currentPage)?.name || 'Settings'}
          </h1>
        </div>
      </div>

      {/* Page Content */}
      <div className="flex-1">
        {renderPageContent()}
      </div>
    </div>
  );
};

export default MobileSettingsLayout;
