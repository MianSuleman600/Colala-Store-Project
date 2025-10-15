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
  // onAddToCart = () => {},
  onEdit = () => {},
  onMoreOptionsClick = () => {},
  onViewDetailsClick, // This prop is now used for the "View Details" button in service mode
  onViewStatsClick = () => {}, // This will now be triggered by the "View Details" button for services
}) => {
  const navigate = useNavigate();
  const contrast = getContrastTextColor(brandColor);
  const isService = mode === "service";

  const normalizedItem = React.useMemo(() => {
    if (item.originalItem) {
      return item;
    }

    // Debug logging to see the actual API data
    console.log("ProductDisplayCard - Raw item data:", item);
    console.log("ProductDisplayCard - Normalized metrics:", item.metrics);
    console.log("ProductDisplayCard - Direct API fields:", {
      views: item.views,
      clicks: item.clicks,
      carts: item.carts,
      orders: item.orders,
      chats: item.chats,
      impressions: item.impressions,
    });
    console.log("ProductDisplayCard - Statistics mapping:", {
      views: item.metrics?.productViews || item.views,
      clicks: item.metrics?.productClicks || item.clicks,
      carts: item.metrics?.inCart || item.carts,
      orders: item.metrics?.completedOrders || item.orders,
      chats: item.metrics?.messages || item.chats,
      impressions: item.metrics?.impressions || item.impressions,
    });

    const rawStatus = (item.status || "available").toLowerCase();
    const firstProductImage = item.images?.[0]?.path;
    const firstServiceImage = item.media?.find((m) => m.type === "image")?.path;
    const firstImage = firstProductImage || firstServiceImage;

    return {
      id: item.id,
      name: item.name || "Untitled Item",
      imageUrl: firstImage ? `${ASSETS_BASE}/storage/${firstImage}` : null,
      price: parseFloat(item.discount_price ?? item.price ?? 0),
      originalPrice:
        item.discount_price != null ? parseFloat(item.price) : null,
      minPrice: parseFloat(item.price_from ?? 0),
      maxPrice: parseFloat(item.price_to ?? 0),
      category: item.category?.title || "Uncategorized",
      storeName: item.store?.store_name || "Store",
      storeLogo: item.store?.profile_image_url,
      rating: item.average_rating ?? item.rating ?? 0,
      status:
        rawStatus === "sold" || rawStatus === "out of stock"
          ? "sold"
          : rawStatus === "unavailable" || rawStatus === "inactive"
          ? "unavailable"
          : "available",
      originalItem: item,
      // Statistics data from API (mapped from normalized data)
      views: item.metrics?.productViews || item.views || 0,
      clicks: item.metrics?.productClicks || item.clicks || 0,
      carts: item.metrics?.inCart || item.carts || 0,
      orders: item.metrics?.completedOrders || item.orders || 0,
      chats: item.metrics?.messages || item.chats || 0,
      impressions: item.metrics?.impressions || item.impressions || 0,
      average_rating: item.average_rating || 0,
    };
  }, [item]);

  const isSold = normalizedItem.status === "sold";
  const isUnavailable = normalizedItem.status === "unavailable";
  const isMasked = isSold || isUnavailable;
  const isDisabled = isMasked || isUpdating;
  const badgeText = isSold
    ? "Out of Stock"
    : isUnavailable
    ? "Unavailable"
    : null;

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

  // const handleAddToCartClick = () => onAddToCart(normalizedItem.originalItem);

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
      <div className="flex flex-1 flex-col px-4 py-2">
        <h3
          className="mb-2 line-clamp-2 text-lg font-semibold text-gray-900 cursor-pointer"
          onClick={handleViewDetails}
        >
          {normalizedItem.name}
        </h3>

        {!isService ? (
          <>
            {/* Statistics Section */}
            <div className="mb-4 space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Product Views</span>
                <span className="font-semibold text-gray-900">
                  {normalizedItem.views || normalizedItem.metrics?.productViews || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Product Clicks</span>
                <span className="font-semibold text-gray-900">
                  {normalizedItem.clicks || normalizedItem.metrics?.productClicks || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Messages</span>
                <span className="font-semibold text-gray-900">
                  {normalizedItem.chats || normalizedItem.metrics?.messages || 0}
                </span>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="mb-3">
              <span className="text-xl font-bold" style={{ color: brandColor }}>
                ₦{normalizedItem.minPrice.toLocaleString()} - ₦
                {normalizedItem.maxPrice.toLocaleString()}
              </span>
            </div>
            
            {/* Service Statistics Section */}
            <div className="mb-4 space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Service Views</span>
                <span className="font-semibold text-gray-900">
                  {normalizedItem.views || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Product Clicks</span>
                <span className="font-semibold text-gray-900">
                  {normalizedItem.clicks || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Messages</span>
                <span className="font-semibold text-gray-900">
                  {normalizedItem.chats || 0}
                </span>
              </div>
            </div>
          </>
        )}

        <div className="mt-auto w-full pt-4 border-t">
          {/* ✅ FIX: Conditional rendering based on `mode` */}
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
            // For "product" mode, show the new layout matching the design.
            <div className="flex items-center justify-between">
              <span
                className="rounded-lg px-3 py-1 text-xs font-medium text-white"
                style={{ backgroundColor: brandColor }}
              >
                {normalizedItem.category}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleEdit}
                  disabled={isDisabled}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 bg-white hover:bg-gray-50"
                >
                  <PencilSquareIcon
                    className={`h-4 w-4 ${
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
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 bg-white hover:bg-gray-50"
                >
                  <EllipsisVerticalIcon
                    className={`h-4 w-4 ${
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
