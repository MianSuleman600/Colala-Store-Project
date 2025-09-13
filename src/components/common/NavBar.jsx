import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { ShoppingCart, Search, Camera, User, Menu, X, Bell, BellOff } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useStoreProfile } from '../../services/queries/storeProfileQuery';
import { useNavigate, useLocation } from 'react-router-dom';
import { selectCartItemsByUser } from '../../features/cart/cartSlice';
import CartDropdown from './CartDropdown';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { openModal } from '../../redux/modalSlice';
import { useToast } from '../../components/ui/ToastProvider';
import {
  isPushSupported,
  getCurrentSubscription,
  subscribeToPush,
  unsubscribeFromPush,
} from '../../utils/pushNotifications';

const linkPaths = {
  Home: '/',
  Feed: '/feed',
  Chat: '/chat',
  Orders: '/orders',
  Settings: '/settings',
};

const getActiveNavLinkFromPath = (pathname) =>
  Object.keys(linkPaths).find((key) => linkPaths[key] === pathname) || null;

function NavBar({ onSearchChange, onSearchSubmit, onCameraClick, onAccountClick }) {
  const dispatch = useDispatch();
  const { isLoggedIn, userId } = useSelector((state) => state.user);
  const userIdForCart = userId ?? 'guest';
  const navigate = useNavigate();
  const location = useLocation();
  const { push } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Push notifications state
  const [pushSupported, setPushSupported] = useState(true);
  const [pushSubscribed, setPushSubscribed] = useState(false);
  const [pushLoading, setPushLoading] = useState(false);

  // Cart selectors
  const selectMemoizedCartItems = useMemo(
    () => selectCartItemsByUser(userIdForCart),
    [userIdForCart]
  );
  const cartItems = useSelector(selectMemoizedCartItems);
  const totalItems = useMemo(
    () => cartItems.reduce((t, item) => t + (item.quantity || 0), 0),
    [cartItems]
  );

  // Store profile (for brand color)
  const { data: storeProfileData, isLoading } = useStoreProfile(userId, {
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });

  const guestProfile = { storeName: 'Guest', brandColor: '#EF4444' };
  const storeProfile = isLoggedIn ? storeProfileData || {} : guestProfile;
  const brandColor = storeProfile?.brandColor || '#EF4444';
  const contrastTextColor = '#fff';

  // Initialize push supported + current subscription
  useEffect(() => {
    (async () => {
      try {
        const supported = await isPushSupported();
        setPushSupported(supported);
        if (!supported) return;
        const sub = await getCurrentSubscription();
        setPushSubscribed(!!sub);
      } catch {
        setPushSupported(false);
      }
    })();
  }, []);

  const handleToggleNotifications = async () => {
    if (!pushSupported) {
      push('Notifications are not supported on this browser.', { type: 'warning' });
      return;
    }
    try {
      setPushLoading(true);
      if (pushSubscribed) {
        await unsubscribeFromPush();
        setPushSubscribed(false);
        push('Notifications disabled.', { type: 'success' });
      } else {
        await subscribeToPush();
        setPushSubscribed(true);
        push('Notifications enabled.', { type: 'success' });
      }
    } catch (e) {
      console.error(e);
      push(e?.message || 'Unable to update notification subscription.', { type: 'error' });
    } finally {
      setPushLoading(false);
    }
  };

  // Handlers
  const handleSearchChangeInternal = useCallback(
    (e) => {
      const val = e.target.value;
      setSearchTerm(val);
      onSearchChange?.(val);
    },
    [onSearchChange]
  );

  const handleSearchKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter') onSearchSubmit?.(searchTerm);
    },
    [onSearchSubmit, searchTerm]
  );

  const handleNavLinkClick = useCallback(
    (k) => {
      navigate(linkPaths[k] || '/');
      setMobileMenuOpen(false);
      setIsCartOpen(false);
    },
    [navigate]
  );

  const handleCartToggle = () => setIsCartOpen((prev) => !prev);
  const handleCartClose = () => setIsCartOpen(false);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setIsCartOpen(false);
  }, [location.pathname]);

  // Close on ESC
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

  const displayedStoreName = isLoggedIn
    ? isLoading
      ? <Skeleton width={80} />
      : storeProfile?.storeName || 'My Store'
    : 'Guest';

  return (
    <div className="w-full sticky top-0 z-50">
      <nav className="flex flex-col">
        {/* Top bar */}
        <div
          className="h-[64px] sm:h-[80px] flex items-center justify-between px-4 sm:px-6 lg:px-8 relative gap-3"
          style={{ backgroundColor: brandColor, color: contrastTextColor }}
        >
          {/* Mobile Menu Toggle */}
          <div className="flex sm:hidden items-center">
            {mobileMenuOpen ? (
              <X size={28} className="cursor-pointer" onClick={() => setMobileMenuOpen(false)} />
            ) : (
              <Menu size={28} className="cursor-pointer" onClick={() => setMobileMenuOpen(true)} />
            )}
          </div>

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center justify-start w-[120px] sm:w-[150px] h-[40px] sm:h-[50px]">
            <img
              src="/logo.png"
              onClick={() => navigate('/')}
              alt="Logo"
              className="w-full h-full object-contain cursor-pointer"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://placehold.co/150x50/cccccc/333333?text=Logo';
              }}
            />
          </div>

          {/* Search (Desktop/Tablet) */}
          <div className="hidden sm:block flex-grow mx-2 sm:mx-4 max-w-lg">
            <div className="relative flex items-center w-full">
              <Search size={20} className="absolute left-3 text-gray-500" />
              <input
                type="text"
                placeholder="Search products, shop or category"
                className="w-full py-2.5 pl-10 pr-10 rounded-lg bg-white text-gray-800"
                value={searchTerm}
                onChange={handleSearchChangeInternal}
                onKeyDown={handleSearchKeyDown}
              />
              <Camera
                size={24}
                className="absolute right-3 text-gray-500 cursor-pointer"
                onClick={onCameraClick}
              />
            </div>
          </div>

          {/* Right group (Desktop) */}
          <div className="hidden sm:flex items-center justify-end gap-6 w-auto flex-shrink-0 relative">
            {/* Notifications Button (Desktop) */}
            {pushSupported && (
              <button
                className="flex items-center gap-2 cursor-pointer disabled:opacity-60"
                onClick={handleToggleNotifications}
                disabled={pushLoading}
                aria-label={pushSubscribed ? 'Disable notifications' : 'Enable notifications'}
                title={pushSubscribed ? 'Disable notifications' : 'Enable notifications'}
              >
                {pushSubscribed ? <Bell size={24} /> : <BellOff size={24} />}
                <span className="hidden lg:inline">
                  {pushLoading ? 'Please wait...' : pushSubscribed ? 'Notifications On' : 'Enable Notifications'}
                </span>
              </button>
            )}

            {!isLoggedIn ? (
              <button
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => dispatch(openModal('login'))}
                aria-label="Sign in or Register"
              >
                <User size={28} />
                <div className="flex flex-col items-start text-white">
                  <span className="text-xs">Welcome</span>
                  <span className="font-bold leading-tight">Sign In/Register</span>
                </div>
              </button>
            ) : (
              <button
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => onAccountClick?.()}
                aria-label="Account"
              >
                <User size={28} />
                <div className="flex flex-col items-start">
                  <span className="text-xs">Hi {displayedStoreName}</span>
                  <span className="font-bold">Account</span>
                </div>
              </button>
            )}

            {/* Cart (Desktop) */}
            <div className="relative flex items-center gap-2">
              <button
                className="relative cursor-pointer"
                onClick={handleCartToggle}
                aria-expanded={isCartOpen ? 'true' : 'false'}
                aria-label="Open cart"
              >
                <ShoppingCart size={28} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-2 bg-white text-red-500 text-xs rounded-full px-1.5 py-0.5">
                    {totalItems}
                  </span>
                )}
              </button>

              {isCartOpen && (
                <>
                  {/* Click-away overlay (desktop/tablet) */}
                  <div
                    className="hidden sm:block fixed inset-0 z-40"
                    onClick={handleCartClose}
                    aria-hidden="true"
                  />
                  {/* Anchor dropdown (desktop) */}
                  <div className="hidden sm:block absolute right-0 top-full z-50">
                    <CartDropdown
                      onClose={handleCartClose}
                      brandColor={brandColor}
                      contrastTextColor={contrastTextColor}
                      userId={userIdForCart}
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right icons (Mobile) */}
          <div className="flex sm:hidden items-center gap-3 ml-auto">
            {/* Notifications (Mobile) */}
            {pushSupported && (
              <button
                aria-label={pushSubscribed ? 'Disable notifications' : 'Enable notifications'}
                title={pushSubscribed ? 'Disable notifications' : 'Enable notifications'}
                onClick={handleToggleNotifications}
                disabled={pushLoading}
                className="p-1 disabled:opacity-60"
              >
                {pushSubscribed ? <Bell size={24} /> : <BellOff size={24} />}
              </button>
            )}

            {!isLoggedIn ? (
              <button
                aria-label="Sign in or Register"
                onClick={() => dispatch(openModal('login'))}
                className="p-1"
              >
                <User size={24} />
              </button>
            ) : (
              <button aria-label="Account" onClick={() => onAccountClick?.()} className="p-1">
                <User size={24} />
              </button>
            )}

            <button
              className="relative p-1"
              onClick={handleCartToggle}
              aria-expanded={isCartOpen ? 'true' : 'false'}
              aria-label="Open cart"
            >
              <ShoppingCart size={24} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-2 bg-white text-red-500 text-[10px] rounded-full px-1 py-0.5">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search (Mobile) */}
        <div
          className="sm:hidden px-4 pt-2 pb-3 rounded-bl-[32px] rounded-br-[32px]"
          style={{ backgroundColor: brandColor }}
        >
          <div className="relative flex items-center w-full">
            <Search size={18} className="absolute left-3 text-gray-700" />
            <input
              type="text"
              placeholder="Search products, shop or category"
              className="w-full py-2 pl-9 pr-9 rounded-lg bg-white text-gray-800"
              value={searchTerm}
              onChange={handleSearchChangeInternal}
              onKeyDown={handleSearchKeyDown}
            />
            <Camera
              size={20}
              className="absolute right-3 text-gray-700 cursor-pointer"
              onClick={onCameraClick}
            />
          </div>

          {isLoggedIn && (
            <div className="mt-2 text-center">
              <span
                className="text-lg font-bold"
                style={{ color: contrastTextColor, fontFamily: 'Oleo Script' }}
              >
                {displayedStoreName}
              </span>
            </div>
          )}
        </div>

        {/* Links row (hidden on mobile; rounded on desktop) */}
        <div
          className="hidden sm:flex w-full h-[70px] rounded-br-[32px] rounded-bl-[32px] items-center justify-start px-4 lg:px-8"
          style={{ backgroundColor: brandColor, color: contrastTextColor }}
        >
          {isLoggedIn && (
            <div
              className="text-2xl sm:text-3xl font-bold mr-6"
              style={{ fontFamily: 'Oleo Script', color: contrastTextColor }}
            >
              {displayedStoreName}
            </div>
          )}
          <div className="flex flex-grow justify-center gap-10 text-base">
            {Object.keys(linkPaths).map((link) => (
              <button
                key={link}
                className="flex flex-col items-center cursor-pointer group"
                onClick={() => handleNavLinkClick(link)}
              >
                <span>{link}</span>
                <div
                  className={`h-1 mt-1 bg-white transition-transform ${
                    getActiveNavLinkFromPath(location.pathname) === link
                      ? 'scale-x-100'
                      : 'scale-x-0'
                  } group-hover:scale-x-100`}
                  style={{ width: '32px', borderRadius: '2px' }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="sm:hidden relative">
            <div
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />
            <div className="fixed top-[64px] left-0 right-0 z-50 bg-white rounded-b-2xl shadow-lg overflow-hidden">
              <div className="grid grid-cols-2 gap-2 p-4">
                {Object.keys(linkPaths).map((link) => (
                  <button
                    key={link}
                    className="py-3 px-4 rounded-lg bg-gray-100 text-gray-800 font-medium"
                    onClick={() => handleNavLinkClick(link)}
                  >
                    {link}
                  </button>
                ))}
                {!isLoggedIn ? (
                  <>
                    <button
                      className="py-3 px-4 rounded-lg bg-red-500 text-white font-semibold"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        dispatch(openModal('login'));
                      }}
                    >
                      Sign In
                    </button>
                    <button
                      className="py-3 px-4 rounded-lg bg-white border font-semibold text-red-500"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        dispatch(openModal('register'));
                      }}
                    >
                      Register
                    </button>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        )}

        {/* Mobile Cart Sheet */}
        {isCartOpen && (
          <div className="sm:hidden">
            <CartDropdown
              onClose={handleCartClose}
              brandColor={brandColor}
              contrastTextColor={contrastTextColor}
              userId={userIdForCart}
            />
          </div>
        )}
      </nav>
    </div>
  );
}

export default NavBar;