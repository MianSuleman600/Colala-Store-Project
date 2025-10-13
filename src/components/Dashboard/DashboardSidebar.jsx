// src/components/Dashboard/DashboardSidebar.js
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { XMarkIcon as XMarkIconSolid } from '@heroicons/react/24/outline';
import { Award, Lock, LogOut, Trash2 } from 'lucide-react';

import { authService } from '../../services/authService';
import { logout as logoutAction } from '../../features/auth/authSlice'; // Ensure this path is correct

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

const DashboardSidebar = ({
  activeItem,
  onSelectItem,
  toggleSidebar,
  children,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [processing, setProcessing] = useState({ logout: false, delete: false });

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

  return (
    // MODIFICATION: Removed lg:static and z-50.
    // The parent component (`SellerDashboardPage`) now controls all positioning.
    <aside className="w-full h-full bg-white rounded-2xl p-2 shadow-md flex flex-col">
      {children}

      {/* Mobile close button */}
      <div className="flex justify-between items-center mb-4 lg:hidden">
        <h2 className="text-xl font-bold text-gray-800">Dashboard</h2>
        <button onClick={toggleSidebar} className="text-gray-600 focus:outline-none" aria-label="Close sidebar">
          <XMarkIconSolid className="h-6 w-6" />
        </button>
      </div>

      <nav className="space-y-4 mt-3 flex-1 overflow-y-auto custom-scrollbar">
        {sidebarItems.map((item) => (
          <div
            key={item.name}
            className={`relative flex items-center p-3 pl-12 rounded-2xl cursor-pointer transition-all duration-300 transform border-2 ${
              activeItem === item.name ? 'bg-white text-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            style={activeItem === item.name ? { borderColor: item.color } : { borderColor: 'transparent' }}
            onClick={() => onSelectItem(item.name)}
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
                onClick={() => onSelectItem(item.name)}
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
    </aside>
  );
};

export default DashboardSidebar;