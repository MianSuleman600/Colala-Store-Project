// src/components/announcements/PromotionalBanner.jsx
import React, { useEffect, useMemo } from 'react';
import { useActiveBannersQuery } from '../../hooks/useBannerQuery.js';
import { announcementService } from '../../services/announcementService.js';

const PromotionalBanner = ({ placement = 'home', className = '' }) => {
  const { data } = useActiveBannersQuery({ placement });

  const banner = useMemo(() => {
    if (!Array.isArray(data) || !data.length) return null;
    return data.find((b) => b.active) || data[0];
  }, [data]);

  useEffect(() => {
    if (!banner) return;
    const IMP_KEY = `IMP_BANNER_${banner.id}`;
    const already = sessionStorage.getItem(IMP_KEY);
    if (already) return;
    sessionStorage.setItem(IMP_KEY, '1');
    announcementService.trackBannerImpression(banner.id).catch(() => {});
  }, [banner]);

  if (!banner) return null;

  return (
    <div className={`w-full ${className}`}>
      <a href={banner.link || '#'} target={banner.link ? '_blank' : undefined} rel="noopener noreferrer">
        <img
          src={banner.imageUrl}
          alt={banner.alt || 'Promotional banner'}
          className="w-full h-auto rounded-md object-cover"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = 'https://placehold.co/1200x320/e0e0e0/000000?text=No+Banner+Image';
          }}
        />
      </a>
    </div>
  );
};

export default PromotionalBanner;