import React, { useMemo } from 'react';
import Card from './Card';
import { adjustBrightness, getContrastTextColor } from '../../utils/colorUtils';

/**
 * ActionCard Component
 * A card displaying an icon, title, and description with brand-aware styling.
 *
 * Props:
 * - icon: string (img src)
 * - title: string
 * - description: string
 * - onClick?: () => void
 * - className?: string
 * - isGuestView?: boolean
 * - brandColor?: string
 * - contrastTextColor?: string
 */
const ActionCard = ({
  icon,
  title,
  description,
  onClick,
  className = '',
  isGuestView = false,
  brandColor = '#EF4444',
  contrastTextColor,
}) => {
  // Compute safe contrast fallback when not provided
  const safeContrast = useMemo(
    () => contrastTextColor || getContrastTextColor(brandColor),
    [brandColor, contrastTextColor]
  );

  const iconBgColor = useMemo(() => adjustBrightness(brandColor, 200), [brandColor]);

  return (
    <Card
      className={`p-4 sm:p-6 flex flex-col items-start justify-start text-left rounded-2xl shadow-sm bg-white cursor-pointer transition-all duration-200
        ${className} ${isGuestView ? 'opacity-95' : 'hover:bg-gray-50'}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick?.();
      }}
      aria-label={title}
    >
      <div
        className="p-2 sm:p-3 rounded-full mb-3 sm:mb-4 flex items-center justify-center"
        style={{ backgroundColor: iconBgColor }}
      >
        <img
          src={icon}
          alt={`${title} icon`}
          className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
          width={24}
          height={24}
          loading="lazy"
        />
      </div>

      <h3 className={`text-sm sm:text-md mb-2 ${isGuestView ? 'text-gray-500' : ''}`} style={!isGuestView ? { color: brandColor } : {}}>
        {title}
      </h3>

      <p className="text-xs sm:text-sm text-gray-600">{description}</p>
    </Card>
  );
};

export default ActionCard;