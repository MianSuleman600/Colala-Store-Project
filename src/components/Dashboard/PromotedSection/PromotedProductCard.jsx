import React from "react";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import Button from "../../ui/Button";

const PromotedProductCard = ({
  product,
  boost,
  brandColor,
  contrastTextColor,
  onViewDetailsClick = () => {},
  className = "",
}) => {
  // Get the first image from the API response
  const firstImage =
    product?.images?.[0]?.url || product?.images?.[0]?.path_url || null;

  // Calculate prices
  const currentPrice = parseFloat(
    product?.discount_price || product?.price || 0
  );
  const originalPrice = product?.discount_price
    ? parseFloat(product?.price || 0)
    : null;

  // Get boost statistics
  const views = boost?.reach || 0;
  const clicks = boost?.clicks || 0;
  const messages = 0; // This might need to be added to the API response

  return (
    <div
      className={`bg-gray-100 rounded-2xl overflow-hidden shadow-md ${className}`}
    >
      {/* Product Image Section */}
      <div className="relative h-48 bg-white">
        {firstImage ? (
          <img
            src={firstImage}
            alt={product?.name || "Product"}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
        ) : null}
        <div
          className={`w-full h-full flex items-center justify-center text-gray-400 ${
            firstImage ? "hidden" : "flex"
          }`}
        >
          No Image
        </div>
      </div>

      {/* Product Details Section */}
      <div className="p-4 bg-white">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {product?.name || "Untitled Product"}
        </h3>

        {/* Price Section */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-2xl font-bold text-red-500">
            ₦{currentPrice.toLocaleString()}
          </span>
          {originalPrice && (
            <span className="text-sm text-gray-400 line-through">
              ₦{originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Tags */}

        {/* Divider */}
        <div className="border-t border-gray-200 my-4"></div>

        {/* Statistics */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Product Views</span>
            <span className="font-semibold">{views.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Product Clicks</span>
            <span className="font-semibold">{clicks.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Messages</span>
            <span className="font-semibold">{messages.toLocaleString()}</span>
          </div>
        </div>

        {/* View Details Button */}
        <Button
          className="w-full rounded-xl py-3 font-semibold"
          style={{ backgroundColor: brandColor, color: contrastTextColor }}
          onClick={() => onViewDetailsClick(boost)}
        >
          View Details
        </Button>
      </div>
    </div>
  );
};

export default PromotedProductCard;
