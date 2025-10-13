// src/components/announcements/PromotionalBanner.jsx
import React, { useMemo } from 'react';
import { useActiveBannersQuery } from '../../services/queries/useBannerQuery.js'; // Corrected import path

const PromotionalBanner = ({ placement = 'home', className = '' }) => {
  // The hook now handles filtering by active status and placement.
  // We just need to get the resulting data.
  const { data: banners, isLoading } = useActiveBannersQuery({ placement });

  // Select the single banner to display from the filtered list.
  // In a real scenario, you might want to sort by priority or date.
  const banner = useMemo(() => {
    if (!Array.isArray(banners) || banners.length === 0) return null;
    // Simply take the first banner from the already-filtered list.
    return banners[0];
  }, [banners]);

  // --- REMOVED ---
  // The useEffect for impression tracking has been removed as the function doesn't exist.
  // --- END REMOVED ---

  // Render nothing if loading or if no suitable banner is found.
  if (isLoading || !banner) {
    return null;
  }

  return (
    <div className={`w-full ${className}`}>
      <a href={banner.link || '#'} target={banner.link ? '_blank' : undefined} rel="noopener noreferrer">
        <img
          src={banner.imageUrl}
          alt={banner.alt || 'Promotional banner'}
          className="w-full h-auto rounded-md object-cover"
          // Add a fallback for broken image links
          onError={(e) => {
            e.currentTarget.style.display = 'none'; // Hide the broken image element
          }}
        />
      </a>
    </div>
  );
};

export default PromotionalBanner;