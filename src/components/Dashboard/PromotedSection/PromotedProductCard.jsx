// src/components/Dashboard/PromotedSection/PromotedProductCard.jsx
import React from 'react';
import ProductDisplayCard from '../../products/ProductDisplayCard';
import SponsoredIconPng from '../../../assets/icons/Sponsored.png';

const PromotedProductCard = ({ product, brandColor, contrastTextColor, onViewDetailsClick = () => {} }) => {
  return (
    <div className="relative">
      <div className="absolute top-3 left-3 bg-yellow-400 text-gray-800 text-xs font-bold px-2.5 py-1 rounded-full flex items-center shadow-md z-10">
        <img src={SponsoredIconPng} alt="Sponsored" className="h-4 w-auto mr-1" /> Sponsored
      </div>
      <ProductDisplayCard
        product={{ ...product, isSponsored: true }}
        brandColor={brandColor}
        contrastTextColor={contrastTextColor}
        mode="promoted"
        onViewDetailsClick={() => onViewDetailsClick(product)}
      />
    </div>
  );
};

export default PromotedProductCard;