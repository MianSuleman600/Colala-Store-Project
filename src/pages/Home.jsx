import React, { useState, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import { openModal } from '../redux/modalSlice';
import { getContrastTextColor, adjustBrightness } from '../utils/colorUtils';
import { ASSETS_BASE } from '../api/apiConfig';

import StoreHeader from '../components/store/StoreHeader';
import StoreOwnerInfoSection from '../components/store/StoreOwnerInfoSection';
import InfoBox from '../components/ui/InfoBox';
import PromotionalBanner from '../components/ui/PromotionBanner';
import ActionCard from '../components/ui/ActionCard';
import SectionHeader from '../components/ui/SectionHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import StoreProfileModal from '../components/models/StoreProfileModal';

import StoreBuilderModal from '../components/models/StoreBuilderModal';


import { useOnboardingProgressQuery } from '../services/queries/useOnboardingQuery';


import productIcon from '../assets/icons/product.png';
import checkIcon from '../assets/icons/check.png';
import chartbarIcon from '../assets/icons/ChartBar.png';
import shoppingCartIcon from '../assets/icons/ShoppingCart.png';

export default function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user, status: authStatus } = useSelector((state) => state.auth);
  const storeProfileFromRedux = user?.store;



  const [isStoreProfileModalOpen, setIsStoreProfileModalOpen] = useState(false);

  const [isStoreBuilderModalOpen, setIsStoreBuilderModalOpen] = useState(false);

  const { data: onboardingProgress, isLoading: isProgressLoading } = useOnboardingProgressQuery({
    enabled: isAuthenticated && !!user?.id,
  });

  // Compute combined progress based on steps
  const combinedProgress = useMemo(() => {
    if (!onboardingProgress?.steps) return 0;
    const totalSteps = onboardingProgress.steps.length;
    const doneSteps = onboardingProgress.steps.filter(step => step.status === 'done').length;
    return Math.round((doneSteps / totalSteps) * 100);
  }, [onboardingProgress]);

  const brandColor = useMemo(() => storeProfileFromRedux?.theme_color || '#EF4444', [storeProfileFromRedux]);
  const contrastTextColor = useMemo(() => getContrastTextColor(brandColor), [brandColor]);
  const lightBrandColor = useMemo(() => adjustBrightness(brandColor, 100), [brandColor]);
  const isStoreOwner = isAuthenticated;

  const handleProtectedClick = useCallback((path) => {
    isAuthenticated ? navigate(path) : dispatch(openModal('login'));
  }, [isAuthenticated, dispatch, navigate]);

  const handleSubscribe = useCallback(() => {
    isAuthenticated ? navigate('/subscription') : dispatch(openModal('register'));
  }, [isAuthenticated, dispatch, navigate]);

  const handleOpenStoreBuilder = useCallback(() => {
    if (isAuthenticated) {
      setIsStoreBuilderModalOpen(true);
    } else {
      dispatch(openModal('register'));
    }
  }, [isAuthenticated, dispatch]);

  const handleViewProfileClick = useCallback(() => {
    isAuthenticated ? setIsStoreProfileModalOpen(true) : dispatch(openModal('login'));
  }, [isAuthenticated, dispatch]);

  if (authStatus === 'loading' || (isAuthenticated && !storeProfileFromRedux)) {
    return (
      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <Skeleton height={150} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-12">
          <Skeleton height={400} />
          <div className="lg:col-span-2 space-y-6">
            <Skeleton height={150} />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton height={120} />
              <Skeleton height={120} />
              <Skeleton height={120} />
              <Skeleton height={120} />
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Determine if the InfoBox should be shown based on backend data
  const showInfoBox = isAuthenticated && onboardingProgress && combinedProgress < 100;

  return (
    <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {isStoreProfileModalOpen && (
        <StoreProfileModal
          isOpen={isStoreProfileModalOpen}
          onClose={() => setIsStoreProfileModalOpen(false)}
          storeId={storeProfileFromRedux?.id}
        />
      )}

      {isStoreBuilderModalOpen && <StoreBuilderModal isOpen={isStoreBuilderModalOpen} onClose={() => setIsStoreBuilderModalOpen(false)} />}

      <StoreHeader
        bannerImageUrl={storeProfileFromRedux ? `${ASSETS_BASE}${storeProfileFromRedux.banner_image}` : null}
        profilePictureUrl={storeProfileFromRedux ? `${ASSETS_BASE}${storeProfileFromRedux.profile_image}` : null}
      />

      <div className="grid grid-cols-1 mt-12 gap-6 lg:grid-cols-3">
        <section className="lg:col-span-1 space-y-6">
          <StoreOwnerInfoSection
            storeData={storeProfileFromRedux}
            isLoggedIn={isAuthenticated}
            isStoreOwner={isStoreOwner}
            brandColor={brandColor}
            contrastTextColor={contrastTextColor}
            lightBrandColor={lightBrandColor}
          />
          <SectionHeader title="Latest Orders" style={{ color: brandColor }} />
          <Card className="p-4 min-h-[200px] flex items-center justify-center text-gray-500">
            {isAuthenticated ? (
              <p>No recent orders to display.</p>
            ) : (
              <div className="text-center">
                <p className="mb-2">Login to view orders.</p>
                <Button style={{ backgroundColor: brandColor, color: contrastTextColor }} onClick={() => dispatch(openModal('login'))}>
                  Login Now
                </Button>
              </div>
            )}
          </Card>
        </section>

        <section className="lg:col-span-2 space-y-6">
          <div className="flex justify-end gap-3">
            <Button style={{ backgroundColor: 'black', color: 'white' }} onClick={handleViewProfileClick} disabled={!isAuthenticated}>
              View Profile
            </Button>
            <Button style={{ backgroundColor: brandColor, color: contrastTextColor }} onClick={handleOpenStoreBuilder}>
              Store Builder
            </Button>
          </div>

          {showInfoBox && (
            <InfoBox
              title={isAuthenticated ? 'Complete your profile to unlock more features' : 'Create your store to start selling'}
              actionText={isAuthenticated ? 'Complete Now' : 'Create Store'}
              actionOnClick={isAuthenticated ? () => navigate('/store-upgrade') : () => dispatch(openModal('register'))}
              completionPercentage={combinedProgress}
              actionButtonStyle={{ backgroundColor: brandColor, color: contrastTextColor }}
            />
          )}

          <PromotionalBanner placement="home" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ActionCard title="My Orders" description="Manage your customer orders" icon={shoppingCartIcon} onClick={() => handleProtectedClick('/orders')} brandColor={brandColor} />
            <ActionCard title="My Products" description="Manage all your products here" icon={productIcon} onClick={() => handleProtectedClick('/my-products')} brandColor={brandColor} />
            <ActionCard title="Statistics" description="View detailed statistics" icon={chartbarIcon} onClick={() => handleProtectedClick('/statistics')} brandColor={brandColor} />
            <ActionCard title="Subscription" description="Manage your subscription" icon={checkIcon} onClick={handleSubscribe} brandColor={brandColor} />
          </div>
        </section>
      </div>
    </main>
  );
}
