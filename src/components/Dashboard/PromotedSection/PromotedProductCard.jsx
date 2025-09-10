import React from 'react';
import ProductDisplayCard from '../../products/ProductDisplayCard';

const PromotedProductCard = ({
  product,
  brandColor,
  contrastTextColor,
  onViewDetailsClick = () => {},
  className = '', // optional: pass through extra layout classes if needed
}) => {
  return (
    <div className={`relative ${className}`}>
      <ProductDisplayCard
        item={{ ...product, isSponsored: true }}
        brandColor={brandColor}
        contrastTextColor={contrastTextColor}
        mode="sponsored"
        onViewDetailsClick={() => onViewDetailsClick(product?.id ?? product)}
      />
    </div>
  );
};

export default PromotedProductCard;