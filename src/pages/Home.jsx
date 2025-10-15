// src/pages/HomePage.jsx
import React, { useState, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { openModal } from "../redux/modalSlice";
import { getContrastTextColor, adjustBrightness } from "../utils/colorUtils";
import { ASSETS_BASE } from "../api/apiConfig";

import StoreHeader from "../components/store/StoreHeader";
import StoreOwnerInfoSection from "../components/store/StoreOwnerInfoSection";
import InfoBox from "../components/ui/InfoBox";
import PromotionalBanner from "../components/ui/PromotionBanner";
import ActionCard from "../components/ui/ActionCard";
import SectionHeader from "../components/ui/SectionHeader";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import StoreProfileModal from "../components/models/StoreProfileModal";
import StoreBuilderModal from "../components/models/StoreBuilderModal";

import { useGetBuyerOrdersQuery } from "../services/queries/useOrderQuery";

import productIcon from "../assets/icons/product.png";
import checkIcon from "../assets/icons/check.png";
import chartbarIcon from "../assets/icons/ChartBar.png";
import shoppingCartIcon from "../assets/icons/ShoppingCart.png";

export default function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    isAuthenticated,
    user,
    status: authStatus,
  } = useSelector((state) => state.auth);
  const storeProfileFromRedux = user?.store || null;

  const [isStoreProfileModalOpen, setIsStoreProfileModalOpen] = useState(false);
  const [isStoreBuilderModalOpen, setIsStoreBuilderModalOpen] = useState(false);

  // ✅ Only call query if authenticated and user exists
  const shouldFetch = isAuthenticated && !!user?.id;
  // const { data: onboardingProgress } = useOnboardingProgressQuery(
  //   shouldFetch ? {} : { enabled: false }
  // );

  // Fetch buyer orders
  const {
    data: buyerOrders = [],
    isLoading: ordersLoading,
  } = useGetBuyerOrdersQuery(user?.id, { enabled: shouldFetch });

  // const combinedProgress = useMemo(() => {
  //   if (!onboardingProgress?.steps) return 0;
  //   const totalSteps = onboardingProgress.steps.length;
  //   const doneSteps = onboardingProgress.steps.filter(
  //     (s) => s.status === "done"
  //   ).length;
  //   return Math.round((doneSteps / totalSteps) * 100);
  // }, [onboardingProgress]);

  // Get latest 4 orders
  const latestOrders = useMemo(() => {
    console.log(
      "buyerOrders type:",
      typeof buyerOrders,
      "isArray:",
      Array.isArray(buyerOrders),
      "value:",
      buyerOrders
    );
    if (!Array.isArray(buyerOrders)) {
      console.warn("buyerOrders is not an array:", buyerOrders);
      return [];
    }
    return buyerOrders.slice(0, 4);
  }, [buyerOrders]);

  const brandColor = useMemo(
    () => storeProfileFromRedux?.theme_color || "#EF4444",
    [storeProfileFromRedux]
  );
  const contrastTextColor = useMemo(
    () => getContrastTextColor(brandColor),
    [brandColor]
  );
  const lightBrandColor = useMemo(
    () => adjustBrightness(brandColor, 100),
    [brandColor]
  );

  const isStoreOwner = !!isAuthenticated;

  const handleProtectedClick = useCallback(
    (path) => (isAuthenticated ? navigate(path) : dispatch(openModal("login"))),
    [isAuthenticated, navigate, dispatch]
  );

  const handleSubscribe = useCallback(
    () =>
      isAuthenticated
        ? navigate("/subscription")
        : dispatch(openModal("register")),
    [isAuthenticated, navigate, dispatch]
  );

  const handleOpenStoreBuilder = useCallback(() => {
    isAuthenticated
      ? setIsStoreBuilderModalOpen(true)
      : dispatch(openModal("register"));
  }, [isAuthenticated, dispatch]);

  const handleViewProfileClick = useCallback(() => {
    isAuthenticated
      ? setIsStoreProfileModalOpen(true)
      : dispatch(openModal("login"));
  }, [isAuthenticated, dispatch]);

  const handleOrderClick = useCallback(
    (orderId) => {
      if (isAuthenticated) {
        navigate("/orders", {
          state: { selectedOrderId: orderId },
        });
      } else {
        dispatch(openModal("login"));
      }
    },
    [isAuthenticated, navigate, dispatch]
  );

  // Loading skeleton
  if (authStatus === "loading" || (isAuthenticated && !storeProfileFromRedux)) {
    return (
      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <Skeleton height={150} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-12">
          <Skeleton height={400} />
          <div className="lg:col-span-2 space-y-6">
            <Skeleton height={150} />
            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} height={120} />
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  // const showInfoBox =
  //   isAuthenticated && onboardingProgress && combinedProgress < 100;

  return (
    <main className="mx-2 lg:mx-0F  px-4 sm:px-6 py-6 space-y-6">
      {/* Modals */}
      {isStoreProfileModalOpen && (
        <StoreProfileModal
          isOpen={isStoreProfileModalOpen}
          onClose={() => setIsStoreProfileModalOpen(false)}
          storeId={storeProfileFromRedux?.id}
        />
      )}
      {isStoreBuilderModalOpen && (
        <StoreBuilderModal
          isOpen={isStoreBuilderModalOpen}
          onClose={() => setIsStoreBuilderModalOpen(false)}
        />
      )}

      {/* Store Header */}
      <StoreHeader
        bannerImageUrl={
          storeProfileFromRedux
            ? `${ASSETS_BASE}${storeProfileFromRedux.banner_image}`
            : null
        }
        profilePictureUrl={
          storeProfileFromRedux
            ? `${ASSETS_BASE}${storeProfileFromRedux.profile_image}`
            : null
        }
      />

      <div className="grid grid-cols-1 mt-12 gap-6 lg:grid-cols-2">
        {/* Left Column */}
        <section className="lg:col-span-1 space-y-6">
          <StoreOwnerInfoSection
            storeData={storeProfileFromRedux}
            isLoggedIn={isAuthenticated}
            isStoreOwner={isStoreOwner}
            brandColor={brandColor}
            contrastTextColor={contrastTextColor}
            lightBrandColor={lightBrandColor}
          />

          <SectionHeader title="Latest Orders" style={{ color: brandColor }} />

          <Card className="p-4 min-h-[200px]">
            {!isAuthenticated ? (
              <div className="flex items-center justify-center h-full text-center">
                <div>
                  <p className="mb-2 text-gray-500">Login to view orders.</p>
                  <Button
                    style={{
                      backgroundColor: brandColor,
                      color: contrastTextColor,
                    }}
                    onClick={() => dispatch(openModal("login"))}
                  >
                    Login Now
                  </Button>
                </div>
              </div>
            ) : ordersLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
             ) : latestOrders.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                <p>No recent orders to display.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {latestOrders.map((order) => {
                  const displayName = order?.store?.store_name || order?.customer_name || `Order #${order.id}`;
                  const itemsCount = Array.isArray(order?.items) ? order.items.length : (order?.items_count ?? 0);
                  const totalAmount = Number(order?.subtotal_with_shipping ?? order?.total_amount ?? 0);
                  return (
                    <div
                      key={order.id}
                      onClick={() => handleOrderClick(order.id)}
                      className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 cursor-pointer transition-all"
                    >
                      <div className="flex items-center">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
                          style={{ backgroundColor: "#FDE2E2" }}
                        >
                          {/* cart icon from Orders list style */}
                          <img src={shoppingCartIcon} alt="cart" className="h-6 w-6" style={{ filter: "invert(23%) sepia(93%) saturate(3159%) hue-rotate(337deg) brightness(92%) contrast(99%)" }} />
                        </div>
                        <div>
                          <p className="text-base font-semibold text-gray-800">{displayName}</p>
                          <p className="text-xs text-gray-500">{itemsCount} {itemsCount === 1 ? 'Item' : 'Items'}</p>
                        </div>
                      </div>
                      <div>
                        <span className="text-base md:text-lg font-bold" style={{ color: brandColor }}>
                          ₦{totalAmount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  );
                })}
                {buyerOrders.length > 4 && (
                  <div className="text-center pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate("/orders")}
                      style={{ borderColor: brandColor, color: brandColor }}
                    >
                      View All Orders
                    </Button>
                  </div>
                )}
              </div>
            )}
          </Card>
        </section>

        {/* Right Column */}
        <section className="lg:col-span-1 space-y-6">
          <div className="flex justify-end gap-3">
            <Button
              style={{ backgroundColor: "black", color: "white" }}
              onClick={handleViewProfileClick}
              disabled={!isAuthenticated}
            >
              View Profile
            </Button>
            <Button
              style={{ backgroundColor: brandColor, color: contrastTextColor }}
              onClick={handleOpenStoreBuilder}
            >
              Store Builder
            </Button>
          </div>

           {/* InfoBox removed for cleaner layout */}

          <PromotionalBanner placement="home" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ActionCard
              title="My Orders"
              description="Manage your customer orders"
              icon={shoppingCartIcon}
              onClick={() => handleProtectedClick("/orders")}
              brandColor={brandColor}
            />
            <ActionCard
              title="My Products"
              description="Manage all your products here"
              icon={productIcon}
              onClick={() => handleProtectedClick("/my-products")}
              brandColor={brandColor}
            />
            <ActionCard
              title="Statistics"
              description="View detailed statistics"
              icon={chartbarIcon}
              onClick={() => handleProtectedClick("/statistics")}
              brandColor={brandColor}
            />
            <ActionCard
              title="Subscription"
              description="Manage your subscription"
              icon={checkIcon}
              onClick={handleSubscribe}
              brandColor={brandColor}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
