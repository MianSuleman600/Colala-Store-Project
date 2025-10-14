import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "../ui/Card";
import Button from "../ui/Button";
import {
  PencilSquareIcon,
  EllipsisVerticalIcon,
  FireIcon,
  ShoppingCartIcon,
  StarIcon,
  MapPinIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { getContrastTextColor } from "../../utils/colorUtils";
import { ASSETS_BASE } from "../../api/apiConfig";

const ProductDisplayCard = ({
  item = {},
  brandColor = "#EF4444",
  mode = "product",
  isUpdating = false,
  onAddToCart = () => {},
  onEdit = () => {},
  onMoreOptionsClick = () => {},
  onViewDetailsClick, // This prop is now used for the "View Details" button in service mode
  onViewStatsClick = () => {}, // This will now be triggered by the "View Details" button for services
  onDeleteClick = () => {},
  onMarkAsAvailable = () => {},
  onMarkAsUnavailable = () => {},
}) => {
  const navigate = useNavigate();
  const contrast = getContrastTextColor(brandColor);
  const isService = mode === "service";

  const normalizedItem = React.useMemo(() => {
    if (item.originalItem) {
      return item;
    }

    const rawStatus = (item.status || "available").toLowerCase();
    const firstProductImage = item.images?.[0]?.path;
    const firstServiceImage = item.media?.find(m => m.type === 'image')?.path;
    const firstImage = firstProductImage || firstServiceImage;

    return {
      id: item.id,
      name: item.name || "Untitled Item",
      imageUrl: firstImage ? `${ASSETS_BASE}/storage/${firstImage}` : null,
      price: parseFloat(item.discount_price ?? item.price ?? 0),
      originalPrice: item.discount_price != null ? parseFloat(item.price) : null,
      minPrice: parseFloat(item.price_from ?? 0),
      maxPrice: parseFloat(item.price_to ?? 0),
      category: item.category?.title || "Uncategorized",
      storeName: item.store?.store_name || "Store",
      storeLogo: item.store?.profile_image_url,
      rating: item.average_rating ?? item.rating ?? 0,
      status: rawStatus === "sold" || rawStatus === "out of stock" ? "sold" : rawStatus === "unavailable" || rawStatus === "inactive" ? "unavailable" : "available",
      originalItem: item,
    };
  }, [item]);

  const isSold = normalizedItem.status === "sold";
  const isUnavailable = normalizedItem.status === "unavailable";
  const isMasked = isSold || isUnavailable;
  const isDisabled = isMasked || isUpdating;
  const badgeText = isSold ? "Out of Stock" : isUnavailable ? "Unavailable" : null;

  const handleViewDetails = () => {
    // For services, the main click should open stats as per the new flow.
    if (isService) {
        onViewStatsClick();
        return;
    }
    // For products, it navigates to the details page.
    if (onViewDetailsClick) {
      onViewDetailsClick();
      return;
    }
    const path = `/my-products/${normalizedItem.id}/details`;
    navigate(path, { state: { product: normalizedItem.originalItem } });
  };
  
  const handleEdit = () => {
    onEdit(normalizedItem); 
  };
  
  const handleAddToCartClick = () => onAddToCart(normalizedItem.originalItem);

  return (
    <Card
      className={`relative flex h-full w-full flex-col overflow-hidden rounded-3xl bg-white shadow-lg`}
    >
      {isUpdating && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-white/70">
          <ArrowPathIcon className="h-8 w-8 animate-spin text-gray-800" />
        </div>
      )}
      {isMasked && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50">
          {badgeText && (
            <span className="rounded-lg px-3 py-2 text-2xl font-semibold uppercase text-white">
              {badgeText}
            </span>
          )}
        </div>
      )}

      <div
        className="relative h-40 w-full cursor-pointer bg-gray-100"
        onClick={handleViewDetails}
      >
        {normalizedItem.imageUrl ? (
          <img
            src={normalizedItem.imageUrl}
            alt={normalizedItem.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-400">
            No Image
          </div>
        )}
        {item.isSponsored && (
          <div className="absolute left-2 top-2 z-10 flex items-center rounded-md bg-black/60 px-2 py-1 text-xs text-white">
            <FireIcon className="mr-1 h-4 w-4 text-orange-400" /> Sponsored
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 bg-gray-100 px-3 py-2">
        <img
          src={normalizedItem.storeLogo || "https://placehold.co/24x24"}
          alt="store logo"
          className="h-6 w-6 rounded-full object-cover"
        />
        <span className="text-sm font-medium" style={{ color: brandColor }}>
          {normalizedItem.storeName}
        </span>
        <span
          className="ml-auto flex items-center gap-1 pr-1 text-sm"
          style={{ color: brandColor }}
        >
          <StarIcon className="h-4 w-4" />
          {normalizedItem.rating.toFixed(1)}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3
          className="mb-2 line-clamp-2 text-lg font-semibold text-gray-900 cursor-pointer"
          onClick={handleViewDetails}
        >
          {normalizedItem.name}
        </h3>

        {!isService ? (
          <div className="mb-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold" style={{ color: brandColor }}>
              ₦{normalizedItem.price.toLocaleString()}
            </span>
            {normalizedItem.originalPrice != null && (
              <span className="text-xs text-gray-400 line-through">
                ₦{normalizedItem.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        ) : (
          <div className="mb-3">
            <span className="text-xl font-bold" style={{ color: brandColor }}>
              ₦{normalizedItem.minPrice.toLocaleString()} - ₦
              {normalizedItem.maxPrice.toLocaleString()}
            </span>
          </div>
        )}

        <div className="mt-auto w-full pt-4 border-t">
          {/* ✅ FIX: Conditional rendering based on `mode` */ }
          {isService ? (
            // For "service" mode, show only the "View Details" button.
            <Button
              className="w-full rounded-xl py-3 font-semibold"
              style={{ backgroundColor: brandColor, color: contrast }}
              onClick={onViewStatsClick} // This now opens the stats modal.
              disabled={isDisabled}
            >
              View Details
            </Button>
          ) : (
            // For "product" mode, show the original layout.
            <div className="flex items-center justify-between">
              <span className="rounded-lg border px-2 py-1 text-gray-800 text-xs">
                {normalizedItem.category}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleEdit}
                  disabled={isDisabled}
                >
                  <PencilSquareIcon
                    className={`h-6 w-6 ${
                      isDisabled ? "text-gray-400" : "text-gray-700"
                    }`}
                  />
                </button>
                <button
                  type="button"
                  onClick={(e) =>
                    onMoreOptionsClick(e, normalizedItem.originalItem)
                  }
                  disabled={isDisabled}
                >
                  <EllipsisVerticalIcon
                    className={`h-6 w-6 ${
                      isDisabled ? "text-gray-400" : "text-gray-700"
                    }`}
                  />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ProductDisplayCard;