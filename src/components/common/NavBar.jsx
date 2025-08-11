// src/components/common/NavBar.jsx
import React, { useState } from 'react';
import { ShoppingCart, Search, Camera, User, Menu, X } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useGetStoreProfileQuery } from '../../services/storeProfileApi';
import { useNavigate, useLocation } from 'react-router-dom';
import { selectTotalItems } from '../../features/cart/cartSlice';
import CartDropdown from './CartDropdown';
import {getContrastTextColor} from '../../utils/colorUtils'

/**
 * Helper function to determine the best text color (black or white)
 * based on the background color for optimal contrast.
 * @param {string} hexcolor - The hex code of the background color.
 * @returns {string} - The hex code for the contrasting text color.
 */

/**
 * Determines the currently active navigation link based on the pathname.
 * @param {string} pathname - The current URL pathname.
 * @returns {string|null} - The name of the active link or null if none match.
 */
const getActiveNavLinkFromPath = (pathname) => {
    switch (pathname) {
        case '/':
            return 'Home';
        case '/feed':
            return 'Feed';
        case '/chat':
            return 'Chat';
        case '/orders':
            return 'Orders';
        case '/settings':
            return 'Settings';
        default:
            return null;
    }
};

/**
 * A responsive and dynamic navigation bar component.
 * It features a logo, search bar, user account link, and a shopping cart with a dropdown.
 * The colors adapt based on the fetched store profile.
 * @param {object} props - Component props.
 * @param {function} props.onSearchChange - Callback for search input value changes.
 * @param {function} props.onSearchSubmit - Callback for search input submission (e.g., on Enter key press).
 * @param {function} props.onAccountClick - Callback for when the account icon is clicked.
 * @param {function} props.onCameraClick - Callback for when the camera icon is clicked.
 */
function NavBar({ onSearchChange, onSearchSubmit, onAccountClick, onCameraClick }) {
    // Redux state and hooks
    const { isLoggedIn, userId } = useSelector((state) => state.user);
    const totalItems = useSelector(selectTotalItems);
    const { data: storeProfile, isLoading: isProfileLoading, error: profileError } = useGetStoreProfileQuery(userId, {
        skip: !isLoggedIn || !userId,
    });
    const navigate = useNavigate();
    const location = useLocation();

    // State for local component UI
    const [searchTerm, setSearchTerm] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Dynamic styling based on store profile
    const brandColor = storeProfile?.brandColor || '#EF4444';
    const contrastTextColor = getContrastTextColor(brandColor);

    // Get active navigation link
    const currentActiveNavLink = getActiveNavLinkFromPath(location.pathname);
    const links = ['Home', 'Feed', 'Chat', 'Orders', 'Settings'];

    // Helper to determine the displayed store name/user state
    const getDisplayedName = () => {
        if (!isLoggedIn) return 'Guest';
        if (isProfileLoading) return 'Loading...';
        if (profileError) return 'Error';
        // CORRECTED: Use storeName property
        return storeProfile?.storeName || 'My Store';
    };
    const displayedStoreName = getDisplayedName();

    // Event handlers
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        if (onSearchChange) onSearchChange(value);
    };

    const handleSearchKeyDown = (e) => {
        if (e.key === 'Enter' && onSearchSubmit) {
            onSearchSubmit(searchTerm);
        }
    };

    const handleNavLinkClick = (linkName) => {
        let path = '/';
        switch (linkName) {
            case 'Home': path = '/'; break;
            case 'Feed': path = '/feed'; break;
            case 'Chat': path = '/chat'; break;
            case 'Orders': path = '/orders'; break;
            case 'Settings': path = '/settings'; break;
            default: path = '/';
        }
        navigate(path);
        setMobileMenuOpen(false);
    };

    const handleLogoClick = () => {
        navigate('/');
    };

    return (
        <div className='w-full h-auto'>
            <nav className='flex flex-col h-full'>
                {/* Top bar with logo, search (desktop), and icons */}
                <div
                    className='h-[76px] w-full flex items-center justify-between sm:justify-center px-4 sm:px-6 lg:px-8 relative'
                    style={{ backgroundColor: brandColor, color: contrastTextColor }}
                >
                    {/* Mobile Menu Toggle */}
                    <div className='sm:hidden flex items-center z-50'>
                        {mobileMenuOpen ? (
                            <X size={28} className='cursor-pointer' style={{ color: contrastTextColor }} onClick={() => setMobileMenuOpen(false)} />
                        ) : (
                            <Menu size={28} className='cursor-pointer' style={{ color: contrastTextColor }} onClick={() => setMobileMenuOpen(true)} />
                        )}
                    </div>
                    {/* Logo Section */}
                    <div className='flex-shrink-0 flex items-center justify-start sm:w-auto w-[150px]'>
                        <img
                            src='/logo.png'
                            onClick={handleLogoClick}
                            alt='Colala Mall Logo'
                            className='w-full h-auto max-w-[150px] object-contain cursor-pointer'
                            width="150"
                            height="50"
                            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/150x50/cccccc/333333?text=Logo"; }}
                        />
                    </div>
                    {/* Desktop Search Bar */}
                    <div className='flex-grow mx-4 max-w-lg hidden sm:block'>
                        <div className='relative flex items-center w-full'>
                            <Search size={20} className='absolute left-3 text-gray-500' />
                            <input
                                type='text'
                                placeholder='Search any product, shop or category'
                                className='w-full py-2 pl-10 pr-10 rounded-lg bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500'
                                value={searchTerm}
                                onChange={handleSearchChange}
                                onKeyDown={handleSearchKeyDown}
                            />
                            <Camera
                                size={20}
                                className='absolute right-3 text-gray-500 cursor-pointer'
                                onClick={onCameraClick}
                            />
                        </div>
                    </div>
                    {/* Desktop User and Cart Icons */}
                    <div className='hidden sm:flex items-center justify-center gap-4 w-[200px] flex-shrink-0'>
                        <div
                            className='flex flex-col items-center text-sm sm:text-base cursor-pointer'
                            onClick={onAccountClick}
                        >
                            <User size={20} style={{ color: contrastTextColor }} />
                            <span className='font-bold'>{isLoggedIn ? 'Account' : 'Login/Register'}</span>
                        </div>
                        <div
                            className='relative flex flex-col items-center text-sm sm:text-base cursor-pointer'
                            onClick={() => setIsCartOpen(!isCartOpen)}
                        >
                            <ShoppingCart size={20} style={{ color: contrastTextColor }} />
                            {totalItems > 0 && (
                                <span className='absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-1'>
                                    {totalItems}
                                </span>
                            )}
                            <span>Cart</span>
                            {isCartOpen && (
                                <CartDropdown
                                    onClose={() => setIsCartOpen(false)}
                                    brandColor={brandColor}
                                    contrastTextColor={contrastTextColor}
                                />
                            )}
                        </div>
                    </div>
                    {/* Mobile Cart Icon */}
                    <div className='sm:hidden flex items-center z-50'>
                        <div
                            className='relative flex items-center cursor-pointer'
                            onClick={() => setIsCartOpen(!isCartOpen)}
                        >
                            <ShoppingCart size={24} style={{ color: contrastTextColor }} />
                            {totalItems > 0 && (
                                <span className='absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1'>{totalItems}</span>
                            )}
                            {isCartOpen && (
                                <CartDropdown
                                    onClose={() => setIsCartOpen(false)}
                                    brandColor={brandColor}
                                    contrastTextColor={contrastTextColor}
                                />
                            )}
                        </div>
                    </div>
                </div>
                {/* Bottom bar with store name and navigation links */}
                <div
                    className='w-full h-[77px] rounded-br-[50px] rounded-bl-[50px] relative flex items-center justify-center px-4 sm:px-6 lg:px-8'
                    style={{ backgroundColor: brandColor, color: contrastTextColor }}
                >
                    {isLoggedIn && (
                        <div
                            className='absolute left-1/2 -translate-x-1/2 lg:left-[210px] sm:left-[210px] md:left-12 sm:translate-x-0 text-xl sm:text-2xl font-bold whitespace-nowrap'
                            style={{ fontFamily: 'Oleo Script', color: contrastTextColor }}
                        >
                            {displayedStoreName}
                        </div>
                    )}
                    {/* Desktop Navigation Links */}
                    <div className='hidden sm:flex gap-3 sm:gap-8 text-sm sm:text-base'>
                        {links.map((link) => (
                            <div
                                key={link}
                                className='flex flex-col justify-start items-center cursor-pointer group'
                                onClick={() => handleNavLinkClick(link)}
                            >
                                <span style={{ color: contrastTextColor }}>{link}</span>
                                <div
                                    className={`h-0.5 mt-1 bg-white transition-transform duration-300 origin-left ${
                                        currentActiveNavLink === link ? 'scale-x-100' : 'scale-x-0'
                                    } group-hover:scale-x-100`}
                                    style={{ width: '32px', backgroundColor: contrastTextColor }}
                                ></div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Mobile Menu Dropdown */}
                {mobileMenuOpen && (
                    <div className='sm:hidden bg-white text-black w-full py-4 px-6 shadow-md rounded-b-2xl absolute top-[76px] left-0 z-40'>
                        {/* Mobile Search Bar */}
                        <div className='flex items-center w-full mb-4'>
                            <div className='relative flex-grow'>
                                <Search size={20} className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500' />
                                <input
                                    type='text'
                                    placeholder='Search...'
                                    className='w-full py-2 pl-10 pr-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500'
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    onKeyDown={handleSearchKeyDown}
                                />
                            </div>
                            <Camera
                                size={20}
                                className='ml-3 text-gray-500 cursor-pointer'
                                onClick={onCameraClick}
                            />
                        </div>
                        {/* Mobile Navigation Links */}
                        <div className='flex flex-col space-y-2'>
                            <div
                                className='py-2 px-1 cursor-pointer hover:bg-gray-100 rounded flex items-center gap-2'
                                onClick={onAccountClick}
                            >
                                <User size={20} />
                                <span className='font-semibold'>
                                    {isLoggedIn ? `Hi ${displayedStoreName}` : 'Login/Register'}
                                </span>
                            </div>
                            <hr className='border-gray-300 my-2' />
                            {links.map((link) => (
                                <div
                                    key={link}
                                    className='py-2 px-1 cursor-pointer hover:bg-gray-100 rounded font-medium'
                                    onClick={() => handleNavLinkClick(link)}
                                >
                                    {link}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </nav>
        </div>
    );
}

export default NavBar;
