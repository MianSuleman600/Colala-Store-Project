import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Button from './Button'; // Make sure this import path is correct
import { useBannersQuery } from '../../services/queries/useBannerQuery';
import { getContrastTextColor, adjustBrightness } from '../../utils/colorUtils';
import shoppingBagImage from '../../assets/images/bag.png';

const PromotionalBanner = ({ className = '' }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  // Get dynamic colors from the logged-in user's profile
  const brandColor = useMemo(() => user?.store?.brandColor || user?.store?.theme_color || '#EF4444', [user]);
  const contrastTextColor = useMemo(() => getContrastTextColor(brandColor), [brandColor]);
  const lighterCurveColor = useMemo(() => adjustBrightness(brandColor, 40), [brandColor]);

  // Fetch ALL banners. The backend returns them sorted with the most recent first.
  const { data: allBanners = [], isLoading } = useBannersQuery();

  // Select the most recent banner to display (the first one in the list).
  const banner = useMemo(() => {
    if (isLoading || allBanners.length === 0) return null;
    return allBanners[0];
  }, [allBanners, isLoading]);

  // If there's no banner to show, render nothing.
  if (!banner) {
    return null;
  }
  
  // --- RESTORED UI LOGIC ---
  // Use data from the banner if available, otherwise use default text.
  const titlePrefix = banner.title || 'Shop with ease on'; // The 'title' field is not in your current API, so it uses the default.
  const description = banner.description || 'Shop from a variety of stores for your retail or wholesale products';
  const buttonText = banner.button_text || 'Shop Now';
  const storeName = user?.store?.store_name || 'Our Store';

  const handleButtonClick = () => {
    if (banner.link) {
      if (banner.link.startsWith('http')) {
        window.open(banner.link, '_blank', 'noopener,noreferrer');
      } else {
        navigate(banner.link);
      }
    } else {
      // Default action if no link is provided, e.g., navigate to a general shop page.
      navigate('/shop');
    }
  };
  // --- END RESTORED UI LOGIC ---

  return (
    <div 
      className={`relative w-full rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between overflow-hidden shadow-lg ${className}`} 
      style={{ backgroundColor: brandColor }}
    >
      {/* Decorative curves */}
      <div className="absolute top-0 left-0 w-40 h-40" style={{ backgroundColor: lighterCurveColor, borderBottomRightRadius: '100%', transform: 'translate(-5%, -20%)' }} />
      <div className="absolute bottom-0 left-0 w-40 h-40" style={{ backgroundColor: lighterCurveColor, borderTopRightRadius: '100%', transform: 'translate(-5%, 30%)' }} />
      
      {/* Text content */}
      <div className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left mb-6 md:mb-0 md:w-1/2 lg:w-2/3">
        <h2 className="text-2xl md:text-3xl lg:text-4xl mb-3 leading-tight" style={{ color: contrastTextColor }}>
          {titlePrefix} <span style={{ fontFamily: 'Oleo Script', color: contrastTextColor }}>{storeName}</span>
        </h2>
        <p className="text-sm md:text-base lg:text-lg mb-6 max-w-md" style={{ color: contrastTextColor }}>{description}</p>
        <Button onClick={handleButtonClick} className="bg-white" style={{ color: brandColor }}>
          {buttonText}
        </Button>
      </div>

      {/* Image content */}
      <div className="relative z-10 w-full md:w-1/2 lg:w-1/3 flex justify-center items-center mt-6 md:mt-0">
        <img 
          src={banner.imageUrl || shoppingBagImage} 
          alt={banner.alt || 'Promotional Banner'} 
          className="w-40 md:w-48 lg:w-60 h-auto object-contain drop-shadow-xl" 
          loading="lazy" 
        />
      </div>
    </div>
  );
};

export default PromotionalBanner;