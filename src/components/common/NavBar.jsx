// src/components/common/NavBar.jsx
import React, { useState } from 'react';
import { ShoppingCart, Search, Camera, User, Menu, X } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useGetStoreProfileQuery } from '../../services/storeProfileApi';
import { useNavigate, useLocation } from 'react-router-dom';
import { selectTotalItems } from '../../features/cart/cartSlice';
import CartDropdown from './CartDropdown';

/**
 * Helper function to determine the best text color (black or white)
 * based on the background color for optimal contrast.
 */
const getContrastTextColor = (hexcolor) => {
    if (!hexcolor || typeof hexcolor !== 'string') {
        return '#000000';
    }

    const r = parseInt(hexcolor.slice(1, 3), 16);
    const g = parseInt(hexcolor.slice(3, 5), 16);
    const b = parseInt(hexcolor.slice(5, 7), 16);

    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
};

/**
 * Determines the currently active navigation link based on the pathname.
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

function NavBar({ onSearchChange, onSearchSubmit, onAccountClick, onCameraClick }) {
    const { userName, isLoggedIn, userId } = useSelector((state) => state.user);
    const totalItems = useSelector(selectTotalItems);
    const { data: storeProfile, isLoading: isProfileLoading, error: profileError } = useGetStoreProfileQuery(userId, {
        skip: !isLoggedIn || !userId,
    });

    const brandColor = storeProfile?.brandColor || '#EF4444';
    const contrastTextColor = getContrastTextColor(brandColor);

    const [searchTerm, setSearchTerm] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    
    const navigate = useNavigate();
    const location = useLocation();

    const currentActiveNavLink = getActiveNavLinkFromPath(location.pathname);
    const links = ['Home', 'Feed', 'Chat', 'Orders', 'Settings'];

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

    let displayedStoreName = 'My Store';
    if (!isLoggedIn) {
        displayedStoreName = 'Guest';
    } else if (isProfileLoading) {
        displayedStoreName = 'Loading...';
    } else if (profileError) {
        displayedStoreName = 'Error';
    } else if (storeProfile?.name) {
        displayedStoreName = storeProfile.name;
    } else if (userName) {
        displayedStoreName = userName;
    }

    return (
        <div className='w-full h-auto'>
            <nav className='flex flex-col h-full'>
                <div
                    className='h-[76px] w-full flex items-center justify-between sm:justify-center px-4 sm:px-6 lg:px-8 relative'
                    style={{ backgroundColor: brandColor, color: contrastTextColor }}
                >
                    <div className='sm:hidden flex items-center z-50'>
                        {mobileMenuOpen ? (
                            <X size={28} className='cursor-pointer' style={{ color: contrastTextColor }} onClick={() => setMobileMenuOpen(false)} />
                        ) : (
                            <Menu size={28} className='cursor-pointer' style={{ color: contrastTextColor }} onClick={() => setMobileMenuOpen(true)} />
                        )}
                    </div>
                    <div className='flex-shrink-0 flex items-center justify-start sm:w-auto w-[150px]'>
                        {/* OPTIMIZATION: Added width and height to prevent Cumulative Layout Shift (CLS) */}
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
                {mobileMenuOpen && (
                    <div className='sm:hidden bg-white text-black w-full py-4 px-6 shadow-md rounded-b-2xl absolute top-[76px] left-0 z-40'>
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
                        <div className='flex flex-col space-y-2'>
                            <div
                                className='py-2 px-1 cursor-pointer hover:bg-gray-100 rounded flex items-center gap-2'
                                onClick={onAccountClick}
                            >
                                <User size={20} />
                                <span className='font-semibold'>
                                    {isLoggedIn ? `Hi ${userName}` : 'Login/Register'}
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
