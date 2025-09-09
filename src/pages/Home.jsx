// src/pages/HomePage.jsx
import React, { useState, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { openModal } from '../redux/modalSlice';
import ActionCard from '../components/ui/ActionCard';
import InfoBox from '../components/ui/InfoBox';
import StoreBuilderModal from '../components/models/StoreBuilderModal';
import StoreHeader from '../components/store/StoreHeader';
import StoreOwnerInfoSection from '../components/store/StoreOwnerInfoSection';
import StoreProfileModal from '../components/models/StoreProfileModal';
import Button from '../components/ui/Button';

// Updated: pull announcement banner (text)
import AnnouncementBanner from '../components/announcements/AnnouncementBanner';

// Keep your promotional banner UI (now DB-backed)
import PromotionBanner from '../components/ui/PromotionBanner';

import Card from '../components/ui/Card';
import SectionHeader from '../components/ui/SectionHeader';
import productIcon from '../assets/icons/product.png';
import checkIcon from '../assets/icons/check.png';
import chartbarIcon from '../assets/icons/ChartBar.png';
import shoppingCartIcon from '../assets/icons/ShoppingCart.png';
import { useStoreProfile } from '../services/queries/storeProfileQuery';
import { getContrastTextColor, adjustBrightness } from '../utils/colorUtils';

export default function HomePage() {
  const dispatch = useDispatch();
  const { isLoggedIn, userId } = useSelector((state) => state.user);
  const profileCompletion = useSelector((state) => state.registration.profileCompletion);

  const [isStoreBuilderModalOpen, setIsStoreBuilderModalOpen] = useState(false);
  const [isStoreProfileModalOpen, setIsStoreProfileModalOpen] = useState(false);
  const [selectedStoreIdForProfile, setSelectedStoreIdForProfile] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);

  const { data: storeProfileData, isLoading, error } = useStoreProfile(userId, {
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });

  const guestProfile = useMemo(
    () => ({
      name: 'Guest Store',
      storeName: 'Guest Store',
      brandColor: '#EF4444',
      profilePictureUrl: 'https://via.placeholder.com/150',
      bannerImageUrl: 'https://via.placeholder.com/1000x300',
      promotionalBannerImageUrl: 'https://via.placeholder.com/800x200',
    }),
    []
  );

  const storeProfile = isLoggedIn ? storeProfileData || {} : guestProfile;

  // Safe color derivations (with fallbacks)
  const brandColor = storeProfile?.brandColor || '#EF4444';
  const contrastTextColor = getContrastTextColor(brandColor);
  const lightBrandColor = adjustBrightness(brandColor, 100);
  const isStoreOwner = isLoggedIn && storeProfileData?.ownerId === userId;

  const handleProtectedClick = useCallback(
    (path) => {
      if (isLoggedIn) {
        window.location.href = path;
      } else {
        dispatch(openModal('login'));
      }
    },
    [isLoggedIn, dispatch]
  );

  const handleUpgradeStore = useCallback(() => {
    if (isLoggedIn) {
      window.location.href = '/store-upgrade';
    } else {
      dispatch(openModal('register'));
    }
  }, [isLoggedIn, dispatch]);

  const handleOpenStoreBuilder = useCallback(() => {
    if (isLoggedIn) {
      setIsStoreBuilderModalOpen(true);
    } else {
      dispatch(openModal('register'));
    }
  }, [isLoggedIn, dispatch]);

  const handleViewProfileClick = useCallback(() => {
    if (isLoggedIn) {
      setSelectedStoreIdForProfile(userId);
      setIsStoreProfileModalOpen(true);
    } else {
      dispatch(openModal('login'));
    }
  }, [isLoggedIn, userId, dispatch]);

  const handleFollowToggle = useCallback(() => {
    if (!isLoggedIn) {
      dispatch(openModal('login'));
      return;
    }
    if (isStoreOwner) return;
    setIsFollowing((prev) => !prev);
  }, [isLoggedIn, isStoreOwner, dispatch]);

  const handleLoginClick = useCallback(() => {
    dispatch(openModal('login'));
  }, [dispatch]);

  if (isLoading) {
    return (
      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <Skeleton height={200} />
        <Skeleton height={40} width={200} />
        <Skeleton count={3} height={60} />
      </main>
    );
  }

  return (
    <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {error && (
        <div className="text-center text-red-500">{error.message || 'Failed to load store data.'}</div>
      )}

   

      {/* Modals */}
      {isStoreBuilderModalOpen && (
        <StoreBuilderModal
          isOpen={isStoreBuilderModalOpen}
          onClose={() => setIsStoreBuilderModalOpen(false)}
          userId={userId}
        />
      )}
      {isStoreProfileModalOpen && (
        <StoreProfileModal
          isOpen={isStoreProfileModalOpen}
          onClose={() => setIsStoreProfileModalOpen(false)}
          storeId={selectedStoreIdForProfile}
          isFollowing={isFollowing}
          handleFollowToggle={handleFollowToggle}
          isStoreOwner={isStoreOwner}
        />
      )}

      {/* Store Header */}
      <StoreHeader
        bannerImageUrl={storeProfile?.bannerImageUrl}
        profilePictureUrl={storeProfile?.profilePictureUrl}
        isLoggedIn={isLoggedIn}
      />

      <div className="grid grid-cols-1 mt-8 lg:mt-12 gap-6 lg:grid-cols-3">
        {/* Left Panel */}
        <section className="lg:col-span-1 space-y-6">
          <StoreOwnerInfoSection
            storeData={storeProfile}
            isLoggedIn={isLoggedIn}
            isStoreOwner={isStoreOwner}
            onOpenAuthModal={(mode) => dispatch(openModal(mode || 'login'))}
            brandColor={brandColor}
            contrastTextColor={contrastTextColor}
            lightBrandColor={lightBrandColor}
            isFollowing={isFollowing}
            handleFollowToggle={handleFollowToggle}
          />

          <SectionHeader title="Latest Orders" style={{ color: brandColor }} />
          <Card
            className={`p-4 min-h-[200px] flex items-center justify-center text-gray-500 ${
              !isLoggedIn ? 'opacity-50' : ''
            }`}
          >
            {isLoggedIn ? (
              storeProfile?.latestOrders?.length > 0 ? (
                <ul className="space-y-3 w-full">
                  {storeProfile.latestOrders.map((order) => (
                    <li
                      key={order.id}
                      className="flex justify-between items-center text-gray-700 text-sm border p-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <div className="flex items-center">
                        <div className="p-2 rounded-full mr-3" style={{ backgroundColor: lightBrandColor }}>
                          <img src={shoppingCartIcon} alt="Cart" className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-gray-800">{order.customer}</p>
                          <p className="text-xs text-gray-500">{order.itemsCount} items</p>
                        </div>
                      </div>
                      <span className="font-bold" style={{ color: brandColor }}>
                        {order.amount}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No recent orders to display.</p>
              )
            ) : (
              <div className="text-center flex flex-col justify-center items-center">
                <p className="mb-2">Login to view your latest orders.</p>
                <Button
                  onClick={handleLoginClick}
                  className="py-2 px-4 rounded-lg w-30 font-semibold hover:bg-red-700 mt-4"
                  style={{ backgroundColor: brandColor, color: contrastTextColor }}
                >
                  Login Now
                </Button>
              </div>
            )}
          </Card>
        </section>

        {/* Right Panel */}
        <section className="lg:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row sm:justify-end sm:items-center gap-3 sm:gap-4 mb-2 sm:mb-6">
            <Button
              className="py-2 px-4 rounded-lg"
              style={{
                backgroundColor: 'black',
                color: 'white',
                opacity: isLoggedIn ? 1 : 0.9,
              }}
              aria-disabled={!isLoggedIn}
              onClick={handleViewProfileClick}
            >
              View Profile
            </Button>
            <Button
              className="py-2 px-4 rounded-lg"
              style={{
                backgroundColor: brandColor,
                color: contrastTextColor,
                opacity: isLoggedIn ? 1 : 0.95,
              }}
              aria-disabled={!isLoggedIn}
              onClick={handleOpenStoreBuilder}
            >
              Store Builder
            </Button>
          </div>

          <InfoBox
            title={
              isLoggedIn
                ? 'Complete your profile to unlock more features'
                : 'Finish creating your store to start selling and reaching our wide range of audience '
            }
            actionText={isLoggedIn ? 'Complete Now' : 'Create Store'}
            actionOnClick={
              isLoggedIn
                ? () => (window.location.href = '/complete-profile')
                : () => dispatch(openModal('register'))
            }
            completionPercentage={profileCompletion}
            actionButtonStyle={{ backgroundColor: brandColor, color: contrastTextColor }}
          />

          {/* DB-backed promotional banner for Home placement */}
          <PromotionBanner
            placement="home"
            onButtonClick={() => (window.location.href = '/shop')}
            className="mt-2"
          />

          {/* Action cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4">
            <ActionCard
              title="My Orders"
              description="Manage your orders effectively view and monitor every aspect of your customer orders"
              icon={shoppingCartIcon}
              onClick={() => handleProtectedClick('/orders')}
              brandColor={brandColor}
              contrastTextColor={contrastTextColor}
              isGuestView={!isLoggedIn}
            />
            <ActionCard
              title="My Products"
              description="This is home for all your products manage everything here"
              icon={productIcon}
              onClick={() => handleProtectedClick('/my-products')}
              brandColor={brandColor}
              contrastTextColor={contrastTextColor}
              isGuestView={!isLoggedIn}
            />
            <ActionCard
              title="Statistics"
              description="View detailed statistics for all your products."
              icon={chartbarIcon}
              onClick={() => handleProtectedClick('/statistics')}
              brandColor={brandColor}
              contrastTextColor={contrastTextColor}
              isGuestView={!isLoggedIn}
            />
            <ActionCard
              title="Subscription"
              description="Manage your subscription package here effectively"
              icon={checkIcon}
              onClick={handleUpgradeStore}
              brandColor={brandColor}
              contrastTextColor={contrastTextColor}
              isGuestView={!isLoggedIn}
            />
          </div>
        </section>
      </div>
    </main>
  );
}