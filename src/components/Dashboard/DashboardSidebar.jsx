import React from 'react';
import {
    Award, Lock, LogOut, Trash2
} from 'lucide-react';
import { XMarkIcon as XMarkIconSolid } from '@heroicons/react/24/outline';

// Import local icons
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

// Define sidebar items with specific colors for their icons/text when inactive
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

const DashboardSidebar = ({ brandColor, contrastTextColor, activeItem, onSelectItem, toggleSidebar,children }) => {
    return (
        <aside className="w-full h-full bg-white rounded-2xl p-4 shadow-md flex flex-col lg:static z-50">
           
           {children} {/* This is where the large-screen header will be rendered */}
            {/* Close button for small screens */}
            <div className="flex justify-between items-center mb-4 lg:hidden">
                <h2 className="text-xl font-bold text-gray-800">Dashboard</h2>
                <button
                    onClick={toggleSidebar}
                    className="text-gray-600 focus:outline-none"
                >
                    <XMarkIconSolid className="h-6 w-6" />
                </button>
            </div>

            <nav className="space-y-4 mt-3 flex-1 overflow-y-auto custom-scrollbar">
                {sidebarItems.map(item => (
                    <div
                        key={item.name}
                        className={`relative flex items-center p-3 pl-12 rounded-2xl cursor-pointer transition-all duration-300 transform border-2 ${activeItem === item.name
                                ? 'bg-white text-gray-700'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        style={activeItem === item.name
                            ? { borderColor: item.color }
                            : { borderColor: 'transparent' }
                        }
                        onClick={() => onSelectItem(item.name)}
                    >
                        <div
                            className={`absolute left-0 top-0 bottom-0 w-10 h-full flex items-center justify-center rounded-l-2xl`}
                            style={{
                                backgroundColor: item.color,
                            }}
                        >
                            {typeof item.icon === 'string' ? (
                                <img
                                    src={item.icon}
                                    alt={`${item.name} icon`}
                                    className="w-5 h-5"
                                    style={{
                                        filter: 'brightness(0) invert(1)',
                                    }}
                                />
                            ) : (
                                <item.icon
                                    size={20}
                                    style={{
                                        color: '#FFFFFF'
                                    }}
                                />
                            )}
                        </div>
                        <span className="font-medium flex-1 pl-2">{item.name}</span>
                        {item.badge && (
                            <span
                                className={`text-xs font-semibold px-2 py-1 rounded-bl-xl rounded-tl-xl ${item.badge === 'Subscription Active' ? 'bg-[#34D399] text-green-700' : 'bg-gray-200 text-gray-700'
                                    }`}
                            >
                                {item.badge}
                            </span>
                        )}
                    </div>
                ))}

                <div className="mt-6 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-500 mb-3">Others</h4>
                    <nav className="space-y-2">
                        {otherItems.map(item => (
                            <div
                                key={item.name}
                                className="flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                                style={{ color: item.color }}
                                onClick={() => onSelectItem(item.name)}
                            >
                                <item.icon size={20} className="mr-3" style={{ color: item.color }} />
                                <span className="font-medium">{item.name}</span>
                            </div>
                        ))}
                        <div className="flex items-center p-3 rounded-lg cursor-pointer text-red-600 hover:bg-red-50 transition-colors duration-200 mt-4">
                            <LogOut size={20} className="mr-3" />
                            <span className="font-medium">Logout</span>
                        </div>
                        <div className="flex items-center p-3 rounded-lg cursor-pointer text-red-600 hover:bg-red-50 transition-colors duration-200">
                            <Trash2 size={20} className="mr-3" />
                            <span className="font-medium">Delete Account</span>
                        </div>
                    </nav>
                </div>
            </nav>
        </aside>
    );
};

export default DashboardSidebar;