import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { ShoppingCart, Search, Camera, User, Menu, X } from 'lucide-react';
// ✅ FIX: Import shallowEqual to resolve the Redux performance warning
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import { openModal } from '../../redux/modalSlice';
import { selectCartItemsByUser } from '../../features/cart/cartSlice';
import CartDropdown from './CartDropdown';

const linkPaths = {
  Home: '/',
  Feed: '/feed',
  Chat: '/chat',
  Orders: '/orders',
  Settings: '/settings',
};

const getActiveNavLinkFromPath = (pathname) =>
  Object.keys(linkPaths).find((key) => linkPaths[key] === pathname) || null;

function NavBar({ onSearchChange, onSearchSubmit, onCameraClick }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated, user, status } = useSelector((state) => state.auth);
  const userIdForCart = user?.id ?? 'guest';

  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const selectMemoizedCartItems = useMemo(() => selectCartItemsByUser(userIdForCart), [userIdForCart]);

  // ✅ FIX: Added `shallowEqual` to the selector.
  // This prevents the NavBar from re-rendering unnecessarily every time the Redux state updates,
  // resolving the performance warning from your console logs.
  const cartItems = useSelector(selectMemoizedCartItems, shallowEqual);
  
  const totalItems = useMemo(() => cartItems.reduce((t, item) => t + (item.quantity || 0), 0), [cartItems]);

  const brandColor = user?.store?.theme_color || '#EF4444';
  const contrastTextColor = '#fff';

  const handleSearchChangeInternal = useCallback((e) => {
    setSearchTerm(e.target.value);
    onSearchChange?.(e.target.value);
  }, [onSearchChange]);

  const handleSearchKeyDown = useCallback((e) => {
    if (e.key === 'Enter') onSearchSubmit?.(searchTerm);
  }, [onSearchSubmit, searchTerm]);

  const handleNavLinkClick = useCallback((k) => {
    navigate(linkPaths[k] || '/');
    setMobileMenuOpen(false);
    setIsCartOpen(false);
  }, [navigate]);
  
  const handleAccountClick = () => {
    navigate('/settings');
  };

  const handleCartToggle = () => setIsCartOpen((prev) => !prev);
  const handleCartClose = () => setIsCartOpen(false);

  useEffect(() => {
    setMobileMenuOpen(false);
    setIsCartOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setIsCartOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const displayedStoreName = isAuthenticated
    ? (status === 'loading' ? <Skeleton width={80} baseColor="#ffffff50" highlightColor="#ffffff80" /> : user?.full_name || 'My Store')
    : 'Guest';

  return (
    <div className="w-full sticky top-0 z-50">
      <nav className="flex flex-col">
        <div
          className="h-[64px] sm:h-[80px] flex items-center justify-between px-4 sm:px-6 lg:px-8 relative gap-3"
          style={{ backgroundColor: brandColor, color: contrastTextColor }}
        >
          <div className="flex sm:hidden items-center">
            {mobileMenuOpen ? (
              <X size={28} className="cursor-pointer" onClick={() => setMobileMenuOpen(false)} />
            ) : (
              <Menu size={28} className="cursor-pointer" onClick={() => setMobileMenuOpen(true)} />
            )}
          </div>
          <div className="flex-shrink-0 flex items-center justify-start w-[120px] sm:w-[150px] h-[40px] sm:h-[50px]">
            <img src="/logo.png" onClick={() => navigate('/')} alt="Logo" className="w-full h-full object-contain cursor-pointer" />
          </div>
          <div className="hidden sm:block flex-grow mx-2 sm:mx-4 max-w-lg">
            <div className="relative flex items-center w-full">
              <Search size={20} className="absolute left-3 text-gray-500" />
              <input type="text" placeholder="Search products, shop or category" className="w-full py-2.5 pl-10 pr-10 rounded-lg bg-white text-gray-800" value={searchTerm} onChange={handleSearchChangeInternal} onKeyDown={handleSearchKeyDown} />
              <Camera size={24} className="absolute right-3 text-gray-500 cursor-pointer" onClick={onCameraClick} />
            </div>
          </div>
          <div className="hidden sm:flex items-center justify-end gap-6 w-auto flex-shrink-0 relative">
            {!isAuthenticated ? (
              <button className="flex items-center gap-2 cursor-pointer" onClick={() => dispatch(openModal('login'))}>
                <User size={28} />
                <div className="flex flex-col items-start text-white">
                  <span className="text-xs">Welcome</span>
                  <span className="font-bold leading-tight">Sign In/Register</span>
                </div>
              </button>
            ) : (
              <button className="flex items-center gap-2 cursor-pointer" onClick={handleAccountClick}>
                <User size={28} />
                <div className="flex flex-col items-start">
                  <span className="text-xs">Hi {displayedStoreName}</span>
                  <span className="font-bold">Account</span>
                </div>
              </button>
            )}
            <div className="relative flex items-center gap-2">
              <button className="relative cursor-pointer" onClick={handleCartToggle}>
                <ShoppingCart size={28} />
                {totalItems > 0 && <span className="absolute -top-1 -right-2 bg-white text-red-500 text-xs rounded-full px-1.5 py-0.5">{totalItems}</span>}
              </button>
              {isCartOpen && <div className="hidden sm:block fixed inset-0 z-40" onClick={handleCartClose} />}
              {isCartOpen && <div className="hidden sm:block absolute right-0 top-full mt-2 z-50"><CartDropdown onClose={handleCartClose} brandColor={brandColor} contrastTextColor={contrastTextColor} userId={userIdForCart} /></div>}
            </div>
          </div>
          <div className="flex sm:hidden items-center gap-3 ml-auto">
            {!isAuthenticated ? (
              <button onClick={() => dispatch(openModal('login'))} className="p-1"><User size={24} /></button>
            ) : (
              <button onClick={handleAccountClick} className="p-1"><User size={24} /></button>
            )}
            <button className="relative p-1" onClick={handleCartToggle}>
              <ShoppingCart size={24} />
              {totalItems > 0 && <span className="absolute -top-1 -right-2 bg-white text-red-500 text-[10px] rounded-full px-1 py-0.5">{totalItems}</span>}
            </button>
          </div>
        </div>
        <div className="sm:hidden px-4 pt-2 pb-3 rounded-bl-[32px] rounded-br-[32px]" style={{ backgroundColor: brandColor }}>
          <div className="relative flex items-center w-full">
            <Search size={18} className="absolute left-3 text-gray-700" />
            <input type="text" placeholder="Search products, shop or category" className="w-full py-2 pl-9 pr-9 rounded-lg bg-white text-gray-800" value={searchTerm} onChange={handleSearchChangeInternal} onKeyDown={handleSearchKeyDown} />
            <Camera size={20} className="absolute right-3 text-gray-700 cursor-pointer" onClick={onCameraClick} />
          </div>
          {isAuthenticated && (
            <div className="mt-2 text-center">
              <span className="text-lg font-bold" style={{ color: contrastTextColor, fontFamily: 'Oleo Script' }}>{displayedStoreName}</span>
            </div>
          )}
        </div>
        <div className="hidden sm:flex w-full h-[70px] rounded-br-[32px] rounded-bl-[32px] items-center justify-start px-4 lg:px-8" style={{ backgroundColor: brandColor, color: contrastTextColor }}>
          {isAuthenticated && (
            <div className="text-2xl sm:text-3xl font-bold mr-6" style={{ fontFamily: 'Oleo Script', color: contrastTextColor }}>{displayedStoreName}</div>
          )}
          <div className="flex flex-grow justify-center gap-10 text-base">
            {Object.keys(linkPaths).map((link) => (
              <button key={link} className="flex flex-col items-center cursor-pointer group" onClick={() => handleNavLinkClick(link)}>
                <span>{link}</span>
                <div className={`h-1 mt-1 bg-white transition-transform ${getActiveNavLinkFromPath(location.pathname) === link ? 'scale-x-100' : 'scale-x-0'} group-hover:scale-x-100`} style={{ width: '32px', borderRadius: '2px' }} />
              </button>
            ))}
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="sm:hidden relative">
            <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setMobileMenuOpen(false)} />
            <div className="fixed top-[64px] left-0 right-0 z-50 bg-white rounded-b-2xl shadow-lg overflow-hidden">
              <div className="grid grid-cols-2 gap-2 p-4">
                {Object.keys(linkPaths).map((link) => (
                  <button key={link} className="py-3 px-4 rounded-lg bg-gray-100 text-gray-800 font-medium" onClick={() => handleNavLinkClick(link)}>{link}</button>
                ))}
                {!isAuthenticated ? (
                  <>
                    <button className="py-3 px-4 rounded-lg bg-red-500 text-white font-semibold" onClick={() => { setMobileMenuOpen(false); dispatch(openModal('login')); }}>Sign In</button>
                    <button className="py-3 px-4 rounded-lg bg-white border font-semibold text-red-500" onClick={() => { setMobileMenuOpen(false); dispatch(openModal('register')); }}>Register</button>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        )}
        {isCartOpen && <div className="sm:hidden"><CartDropdown onClose={handleCartClose} brandColor={brandColor} contrastTextColor={contrastTextColor} userId={userIdForCart} /></div>}
      </nav>
    </div>
  );
}

export default NavBar;