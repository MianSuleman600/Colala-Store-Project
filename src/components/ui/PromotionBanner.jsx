// src/components/ui/PromotionBanner.jsx
import React, { useEffect, useMemo } from 'react';
import Button from './Button';
import { useStoreProfile } from '../../services/queries/storeProfileQuery';
import { useSelector, useDispatch } from 'react-redux';
import shoppingBagImage from '../../assets/images/bag.png';
import { getContrastTextColor, getLightBrandColor } from '../../utils/colorUtils';
import { openModal } from '../../redux/modalSlice';

// New: DB-backed active banners
import { useActiveBannersQuery } from '../../services/queries/useBannerQuery.js';
import { announcementService } from '../../services/settings/announcementService.js';

const PromotionBanner = ({
  placement = 'home',
  storeName: propStoreName,
  titlePrefix = 'Shop with ease on',
  description = 'Shop from a variety of stores for your retail or wholesale products',
  buttonText = 'Shop Now',
  onButtonClick,
  className = '',
}) => {
  const dispatch = useDispatch();
  const { userId, isLoggedIn, userName } = useSelector((state) => state.user);
  const { data: storeProfile, isLoading: profileLoading, error: profileError } = useStoreProfile(userId, {
    enabled: !!userId,
  });

  // Fetch active banners for placement
  const { data: activeBanners = [], isLoading: bannerLoading } = useActiveBannersQuery(
    { placement },
    { staleTime: 30_000 }
  );

  // Choose first active or fallback to first
  const activeBanner = useMemo(() => {
    if (Array.isArray(activeBanners) && activeBanners.length) {
      return activeBanners.find((b) => b.active) || activeBanners[0];
    }
    return null;
  }, [activeBanners]);

  // Track impressions once per session
  useEffect(() => {
    if (!activeBanner) return;
    const key = `IMP_BANNER_${activeBanner.id}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, '1');
    announcementService.trackBannerImpression(activeBanner.id).catch(() => {});
  }, [activeBanner]);

  const currentStoreName = propStoreName || storeProfile?.storeName || userName || 'Our Store';
  const brandColor = storeProfile?.brandColor || '#EF4444';
  const contrastTextColor = getContrastTextColor(brandColor);
  const lighterCurveColor = getLightBrandColor(brandColor, 40);

  // Prefer DB banner, fallback to profile image, otherwise placeholder
  const promotionalImageUrl =
    activeBanner?.imageUrl || storeProfile?.promotionalBannerImageUrl || shoppingBagImage;
  const bannerLink = activeBanner?.link || '';

  // Not logged in view (your original gating)
  if (!isLoggedIn) {
    return (
      <div className={`relative w-full rounded-xl p-6 md:p-8 lg:p-10 flex items-center bg-[#DFDFDF] shadow-lg ${className}`}>
        <div>
          <h3 className="text-xl md:text-2xl font-semibold mb-2">Your promotional banners appear here</h3>
          <p className="text-gray-600 mb-6">Complete your store upgrade to proceed</p>
          <Button
            onClick={() => dispatch(openModal('register'))}
            className="bg-red-500 hover:bg-red-600 text-white py-3 px-8 rounded-full shadow-md transition-colors"
          >
            Proceed
          </Button>
        </div>
      </div>
    );
  }

  // Loading/errored profile still shows a simple fallback
  if ((profileLoading || bannerLoading) && isLoggedIn && userId) {
    return (
      <div
        className={`relative w-full rounded-2xl p-6 md:p-8 lg:p-10 flex items-center justify-center bg-gray-100 shadow-lg ${className}`}
      >
        <p className="text-gray-600">Loading banner...</p>
      </div>
    );
  }

  if (profileError && isLoggedIn && userId && !activeBanner) {
    console.error('Error fetching store profile for PromotionalBanner:', profileError);
    return (
      <div
        className={`relative w-full rounded-2xl p-6 md:p-8 lg:p-10 flex flex-col md:flex-row items-center justify-between overflow-hidden shadow-lg ${className}`}
        style={{ backgroundColor: '#ccc' }}
      >
        <div className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left mb-6 md:mb-0 md:w-1/2 lg:w-2/3">
          <h2 className="text-2xl md:text-3xl lg:text-4xl mb-3 leading-tight text-gray-800">Welcome to Our Store!</h2>
          <p className="text-sm md:text-base lg:text-lg mb-6 max-w-md text-gray-700">Discover amazing products.</p>
          <Button
            onClick={onButtonClick}
            className="w-full sm:w-auto bg-white py-3 px-8 rounded-2xl text-base hover:bg-gray-100 transition-colors shadow-md text-gray-800"
          >
            Shop Now
          </Button>
        </div>
        <div className="relative z-10 w-full md:w-1/2 lg:w-1/3 flex justify-center items-center mt-6 md:mt-0">
          <img
            src={shoppingBagImage}
            alt="Shopping Bag"
            className="w-40 md:w-48 lg:w-60 h-auto object-contain drop-shadow-xl"
            loading="lazy"
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full rounded-2xl p-6 md:p-8 lg:p-10 flex flex-col md:flex-row items-center justify-between overflow-hidden shadow-lg ${className}`}
      style={{ backgroundColor: brandColor }}
    >
      {/* Decorative Curves */}
      <div
        className="absolute top-0 left-0 w-40 h-40"
        style={{ backgroundColor: lighterCurveColor, borderBottomRightRadius: '100%', transform: 'translate(-5%, -20%)', zIndex: 0 }}
      />
      <div
        className="absolute bottom-0 left-0 w-40 h-40"
        style={{ backgroundColor: lighterCurveColor, borderTopRightRadius: '100%', transform: 'translate(-5%, 30%)', zIndex: 0 }}
      />

      {/* Text Section */}
      <div className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left mb-6 md:mb-0 md:w-1/2 lg:w-2/3">
        <h2 className="text-2xl md:text-3xl lg:text-4xl mb-3 leading-tight" style={{ color: contrastTextColor }}>
          {titlePrefix}{' '}
          <span style={{ fontFamily: 'Oleo Script', color: contrastTextColor }}>{currentStoreName}</span>
        </h2>
        <p className="text-sm md:text-base lg:text-lg mb-6 max-w-md" style={{ color: contrastTextColor }}>
          {description}
        </p>
        <Button
          onClick={onButtonClick}
          className="w-full sm:w-auto bg-white py-3 px-8 rounded-2xl text-base hover:bg-gray-100 transition-colors shadow-md"
          style={{ color: brandColor }}
        >
          {buttonText}
        </Button>
      </div>

      {/* Image Section (clickable if link provided) */}
      <div className="relative z-10 w-full md:w-1/2 lg:w-1/3 flex justify-center items-center mt-6 md:mt-0">
        {bannerLink ? (
          <a href={bannerLink} target="_blank" rel="noopener noreferrer" className="block">
            <img
              src={promotionalImageUrl}
              alt={activeBanner?.alt || currentStoreName || 'Promotional Banner'}
              className="w-40 md:w-48 lg:w-60 h-auto object-contain drop-shadow-xl"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://placehold.co/200x200/cccccc/333333?text=Promo+Image';
              }}
            />
          </a>
        ) : (
          <img
            src={promotionalImageUrl}
            alt={activeBanner?.alt || currentStoreName || 'Promotional Banner'}
            className="w-40 md:w-48 lg:w-60 h-auto object-contain drop-shadow-xl"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = 'https://placehold.co/200x200/cccccc/333333?text=Promo+Image';
            }}
          />
        )}
      </div>
    </div>
  );
};

export default PromotionBanner;