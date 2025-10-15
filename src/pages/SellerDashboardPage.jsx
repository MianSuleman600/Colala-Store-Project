// src/pages/SellerDashboardPage.jsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import DashboardHeader from "../components/Dashboard/DashboardHeader";
import DashboardSidebar from "../components/Dashboard/DashboardSidebar";
import MobileSettingsLayout from "../components/Dashboard/MobileSettingsLayout";
import MyServicesPage from "../features/services/pages/MyServicesPage";
import MyProductsPage from "../features/products/pages/MyProduct";
import AnalyticsPage from "../components/Dashboard/AnalyticsPage";
import SubscriptionPage from "../components/Dashboard/SubscriptionPage";
import PromotedProductsPage from "../components/Dashboard/PromotedSection/PromotedProductsPage";
import ManageCouponsPointsPage from "../components/Dashboard/ManageCoupons/ManageCouponsPointsPage";
import ManageAnnouncementsPage from "../components/announcements/ManageAnnouncementsPage";
import MyReviewsPage from "../components/Dashboard/MyReviewsPage";
import ReferralsPage from "../components/Dashboard/ReferralsPage";
import SupportPage from "../components/Dashboard/SupportPage";
import FAQs from "../components/referrals/FAQs";
import LeaderBoard from "../components/Dashboard/LeaderBoard";
import AccessControl from "../components/Dashboard/AccessControl";

import { useStoreProfile } from "../services/queries/storeProfileQuery";
import { getContrastTextColor } from "../utils/colorUtils";

const SellerDashboardPage = () => {
  const [activeSidebarItem, setActiveSidebarItem] = useState("My Products");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { userId } = useSelector((state) => state.user || {});

  // ✅ Only call hook when userId exists to avoid invalid hook usage
  const {
    data: storeProfile,
    error,
    isLoading,
  } = useStoreProfile(userId, {
    enabled: !!userId,
  });

  // Sidebar scroll handling
  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isSidebarOpen]);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const hasNestedRoute =
    location.pathname.startsWith("/settings/wallet") ||
    location.pathname.startsWith("/settings/store-upgrade");

  const brandColor = useMemo(
    () => storeProfile?.brandColor || "#EF4444",
    [storeProfile]
  );
  const contrastTextColor = useMemo(
    () => getContrastTextColor(brandColor),
    [brandColor]
  );
  const lightBrandColor = useMemo(
    () => (contrastTextColor === "#FFFFFF" ? "#FEE2E2" : "#FFCCCC"),
    [contrastTextColor]
  );

  const toggleSidebar = useCallback(
    () => setIsSidebarOpen((prev) => !prev),
    []
  );

  const handleItemClick = useCallback(
    (itemName) => {
      setActiveSidebarItem(itemName);
      setIsSidebarOpen(false);
      if (hasNestedRoute) {
        navigate("/settings");
      }
    },
    [hasNestedRoute, navigate]
  );

  // Loading/Error/No User
  if (!userId)
    return (
      <div className="p-8 text-center text-gray-500">
        Please log in to view your dashboard.
      </div>
    );

  if (isLoading)
    return <div className="p-8 text-center text-gray-600">Loading...</div>;

  if (error)
    return (
      <div className="p-8 text-center text-red-600">
        Error: {error.message || "Failed to load store profile"}
      </div>
    );

  // ✅ Safely render inner content
  const renderPageContent = () => {
    switch (activeSidebarItem) {
      case "My Products":
        return (
          <MyProductsPage
            brandColor={brandColor}
            contrastTextColor={contrastTextColor}
            lightBrandColor={lightBrandColor}
            showAddProductButton={false}
            gridVariant="sidebar"
          />
        );
      case "My Service":
        return (
          <MyServicesPage
            brandColor={brandColor}
            contrastTextColor={contrastTextColor}
            lightBrandColor={lightBrandColor}
            gridVariant="sidebar"
          />
        );
      case "Analytics":
        return <AnalyticsPage brandColor={brandColor} />;
      case "Subscriptions":
        return <SubscriptionPage brandColor={brandColor} />;
      case "Promoted Products":
        return (
          <PromotedProductsPage
            brandColor={brandColor}
            contrastTextColor={contrastTextColor}
          />
        );
      case "Manage Coupons/ Points":
        return (
          <ManageCouponsPointsPage
            brandColor={brandColor}
            contrastTextColor={contrastTextColor}
            lightBrandColor={lightBrandColor}
          />
        );
      case "Announcements":
        return (
          <ManageAnnouncementsPage
            brandColor={brandColor}
            contrastTextColor={contrastTextColor}
          />
        );
      case "Reviews":
        return (
          <MyReviewsPage
            brandColor={brandColor}
            contrastTextColor={contrastTextColor}
          />
        );
      case "Referrals":
        return (
          <ReferralsPage
            brandColor={brandColor}
            contrastTextColor={contrastTextColor}
          />
        );
      case "Support":
        return (
          <SupportPage
            brandColor={brandColor}
            contrastTextColor={contrastTextColor}
          />
        );
      case "FAQs":
        return (
          <div>
            <h2 className="p-2 text-3xl font-bold">FAQs</h2>
            <FAQs
              brandColor={brandColor}
              contrastTextColor={contrastTextColor}
            />
          </div>
        );
      case "Seller Leaderboard":
        return <LeaderBoard />;
      case "Account Access Control":
        return (
          <AccessControl
            brandColor={brandColor}
            contrastTextColor={contrastTextColor}
          />
        );
      default:
        return (
          <div className="text-gray-500 text-center mt-10">
            Select a menu item.
          </div>
        );
    }
  };

  return (
    <>
      {/* Mobile Layout */}
      <div className="lg:hidden">
        <MobileSettingsLayout />
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full min-w-[380px] transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          z-50 lg:z-auto lg:static lg:translate-x-0 lg:w-80`}
      >
        <div className="h-full p-2">
          <DashboardSidebar
            activeItem={activeSidebarItem}
            onSelectItem={handleItemClick}
            toggleSidebar={toggleSidebar}
          >
            <div className="hidden lg:block mb-4">
              <DashboardHeader
                brandColor={brandColor}
                contrastTextColor={contrastTextColor}
                toggleSidebar={toggleSidebar}
                showHamburger={false}
                storeProfile={storeProfile}
              />
            </div>
          </DashboardSidebar>
        </div>
      </div>

      {/* Overlay (mobile) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 lg:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden p-3 sm:p-4">
          <DashboardHeader
            brandColor={brandColor}
            contrastTextColor={contrastTextColor}
            toggleSidebar={toggleSidebar}
            showHamburger={true}
            storeProfile={storeProfile}
          />
        </div>

        <main className="flex-1 overflow-y-auto custom-scrollbar p-3 sm:p-4 lg:p-0">
          {hasNestedRoute ? <Outlet /> : renderPageContent()}
        </main>
      </div>
      </div>
    </>
  );
};

export default SellerDashboardPage;
