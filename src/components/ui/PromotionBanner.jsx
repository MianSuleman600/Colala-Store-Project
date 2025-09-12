import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import { useStoreProfile } from '../../services/queries/storeProfileQuery';
import { useSelector, useDispatch } from 'react-redux';
import shoppingBagImage from '../../assets/images/bag.png';
import { getContrastTextColor, getLightBrandColor } from '../../utils/colorUtils';
import { openModal } from '../../redux/modalSlice';

// IMPORTANT: use the hooks version and ensure the hook uses the SAME announcementService module your settings page uses
import { useActiveBannersQuery } from '../../services/queries/useBannerQuery.js';
import { announcementService } from '../../services/settings/announcementService.js';

import renderFilePreview from '../../utils/FilePreview';

// Resolve relative URLs to absolute (uses env base for your API assets)
const ASSET_BASE =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_ASSETS_BASE_URL) || '';

const toAbsolute = (p) => {
  if (!p) return '';
  if (/^https?:\/\//i.test(p) || /^data:|^blob:/i.test(p)) return p;
  if (!ASSET_BASE) return p; // fallback to whatever was provided
  return `${String(ASSET_BASE).replace(/\/+$/, '')}/${String(p).replace(/^\/+/, '')}`;
};

const PromotionBanner = ({
  placement = 'home',
  storeName: propStoreName,
  titlePrefix = 'Shop with ease on',
  description = 'Shop from a variety of stores for your retail or wholesale products',
  buttonText = 'Shop Now',
  onButtonClick,
  className = '',
  showPreview = false, // default off to avoid unnecessary preview work
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userId, isLoggedIn, userName } = useSelector((state) => state.user);

  const { data: storeProfile, isLoading: profileLoading, error: profileError } = useStoreProfile(userId, {
    enabled: !!userId,
  });

  // Force-refetch so newly created banners show immediately after navigating from settings
  const { data: promoBanner, isLoading: bannerLoading } = useActiveBannersQuery(
    { placement },
    {
      staleTime: 0,
      refetchOnMount: 'always',
      refetchOnWindowFocus: 'always',
      refetchOnReconnect: 'always',
      select: (banners) => {
        const list = Array.isArray(banners) ? banners : [];
        // Prefer explicitly active banners
        const first = list.find((b) => b.active) || list[0];
        if (!first) return null;
        // Normalize possible backend fields and ensure absolute image URL
        const imageRaw = first.imageUrl || first.image_url || first.image || first.image_path || first.url;
        return {
          id: first.id,
          imageUrl: toAbsolute(imageRaw),
          link: first.link || first.target_url || first.href || '',
          alt: first.alt || first.title || 'Promotional Banner',
        };
      },
    }
  );

  // Track impressions once per session (won't loop due to sessionStorage guard)
  useEffect(() => {
    if (!promoBanner?.id) return;
    const key = `IMP_BANNER_${promoBanner.id}`;
    try {
      if (typeof sessionStorage !== 'undefined' && !sessionStorage.getItem(key)) {
        sessionStorage.setItem(key, '1');
        announcementService.trackBannerImpression(promoBanner.id).catch(() => {});
      }
    } catch {}
  }, [promoBanner?.id]);

  const currentStoreName = propStoreName || storeProfile?.storeName || userName || 'Our Store';
  const brandColor = storeProfile?.brandColor || '#EF4444';
  const contrastTextColor = getContrastTextColor(brandColor);
  const lighterCurveColor = getLightBrandColor(brandColor, 40);

  const promotionalImageUrl =
    promoBanner?.imageUrl || storeProfile?.promotionalBannerImageUrl || shoppingBagImage;
  const bannerLink = promoBanner?.link || '';
  const bannerAlt = promoBanner?.alt || currentStoreName || 'Promotional Banner';

  // Don’t full-reload the page; use SPA navigation for fallback
  const handleShopNowClick = () => {
    if (bannerLink) {
      window.open(bannerLink, '_blank', 'noopener,noreferrer');
    } else if (typeof onButtonClick === 'function') {
      onButtonClick();
    } else {
      navigate('/shop');
    }
  };

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

  if ((profileLoading || bannerLoading) && isLoggedIn && userId) {
    return (
      <div className={`relative w-full rounded-2xl p-6 md:p-8 lg:p-10 flex items-center justify-center bg-gray-100 shadow-lg ${className}`}>
        <p className="text-gray-600">Loading banner...</p>
      </div>
    );
  }

  if (profileError && isLoggedIn && userId && !promoBanner) {
    console.error('Error fetching store profile for PromotionalBanner:', profileError);
    return (
      <div className={`relative w-full rounded-2xl p-6 md:p-8 lg:p-10 flex flex-col md:flex-row items-center justify-between overflow-hidden shadow-lg ${className}`} style={{ backgroundColor: '#ccc' }}>
        <div className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left mb-6 md:mb-0 md:w-1/2 lg:w-2/3">
          <h2 className="text-2xl md:text-3xl lg:text-4xl mb-3 leading-tight text-gray-800">Welcome to Our Store!</h2>
          <p className="text-sm md:text-base lg:text-lg mb-6 max-w-md text-gray-700">Discover amazing products.</p>
          <Button
            onClick={handleShopNowClick}
            className="w-full sm:w-auto bg-white py-3 px-8 rounded-2xl text-base hover:bg-gray-100 transition-colors shadow-md text-gray-800"
          >
            Shop Now
          </Button>
        </div>
        <div className="relative z-10 w-full md:w-1/2 lg:w-1/3 flex justify-center items-center mt-6 md:mt-0">
          <img src={shoppingBagImage} alt="Shopping Bag" className="w-40 md:w-48 lg:w-60 h-auto object-contain drop-shadow-xl" loading="lazy" />
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full rounded-2xl p-6 md:p-8 lg:p-10 flex flex-col md:flex-row items-center justify-between overflow-hidden shadow-lg ${className}`} style={{ backgroundColor: brandColor }}>
      <div className="absolute top-0 left-0 w-40 h-40" style={{ backgroundColor: lighterCurveColor, borderBottomRightRadius: '100%', transform: 'translate(-5%, -20%)', zIndex: 0 }} />
      <div className="absolute bottom-0 left-0 w-40 h-40" style={{ backgroundColor: lighterCurveColor, borderTopRightRadius: '100%', transform: 'translate(-5%, 30%)', zIndex: 0 }} />

      <div className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left mb-6 md:mb-0 md:w-1/2 lg:w-2/3">
        <h2 className="text-2xl md:text-3xl lg:text-4xl mb-3 leading-tight" style={{ color: contrastTextColor }}>
          {titlePrefix} <span style={{ fontFamily: 'Oleo Script', color: contrastTextColor }}>{currentStoreName}</span>
        </h2>
        <p className="text-sm md:text-base lg:text-lg mb-6 max-w-md" style={{ color: contrastTextColor }}>
          {description}
        </p>
        <Button
          onClick={handleShopNowClick}
          className="w-full sm:w-auto bg-white py-3 px-8 rounded-2xl text-base hover:bg-gray-100 transition-colors shadow-md"
          style={{ color: brandColor }}
        >
          {buttonText}
        </Button>
      </div>

      <div className="relative z-10 rounded-2xl w-full md:w-1/2 lg:w-1/3 flex flex-col justify-center items-center mt-6 md:mt-0">
        {bannerLink ? (
          <a href={bannerLink} target="_blank" rel="noopener noreferrer" className="block">
            <img
              src={promotionalImageUrl}
              alt={bannerAlt}
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
            alt={bannerAlt}
            className="w-40 md:w-48 lg:w-60 h-auto object-contain rounded-2xl drop-shadow-xl"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = 'https://placehold.co/200x200/cccccc/333333?text=Promo+Image';
            }}
          />
        )}

        {showPreview && (
          <div className="mt-3 w-full flex justify-center">
            {renderFilePreview(promotionalImageUrl, {
              alt: `${bannerAlt} preview`,
              className: 'max-h-24 mx-auto rounded object-contain',
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PromotionBanner;