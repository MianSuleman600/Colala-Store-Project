// src/components/store/StoreOwnerInfoSection.jsx

import React from "react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import { useNavigate } from "react-router-dom";
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import VerifiedIcon from "../../assets/icons/varified.png";
import MegaphoneIcon from "../../assets/icons/Megaphone.png";
import ShoppingBagIcon from "../../assets/icons/shop.png";
import UsersIcon from "../../assets/icons/profile.png";
import StarIcon from "../../assets/icons/star.png";
import StoreSocialLinks from "./StoreSocialLinks";

const StoreOwnerInfoSection = ({
  storeData = {},
  isLoggedIn = false,
  isStoreOwner = false,
  brandColor = "#EF4444",
  contrastTextColor = "#FFFFFF",
  lightBrandColor = "#FCA5A5",
}) => {
  const navigate = useNavigate();

  const handleAddProduct = () => navigate("/add-product");
  const handleAddService = () => navigate("/add-service");

  // Data mapping from the API response structure
  const storeName = storeData?.name || storeData?.store_name || "Store Name";
  const email = storeData?.email || storeData?.store_email || "";
  const phoneNumber = storeData?.phone || storeData?.store_phone || "";
  const location = storeData?.location || storeData?.store_location || "";
  const categories = storeData?.categories || [];

  // Map the correct fields from API response
  const productsSold =
    storeData?.totalSold || storeData?.sold_items_sum_qty || 0;
  const followers =
    storeData?.followersCount || storeData?.followers_count || 0;
  const ratings = storeData?.averageRating || storeData?.average_rating || 0;
  const announcementText =
    storeData?.announcements?.[0]?.message || "Welcome to our store!";

  // Debug logging to see what data we're getting
  console.log("StoreOwnerInfoSection - storeData:", storeData);
  console.log(
    "StoreOwnerInfoSection - productsSold:",
    productsSold,
    "followers:",
    followers,
    "ratings:",
    ratings
  );

  return (
    <Card className="p-3 sm:p-4 md:p-6">
      <div className="rounded-lg space-y-4">
        {isLoggedIn ? (
          <>
            <div className="flex items-center mb-3 sm:mb-4">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center">
                {storeName}
                <img
                  src={VerifiedIcon}
                  alt="Verified"
                  className="h-5 w-5 ml-2"
                />
              </h3>
            </div>
            <div className="space-y-2 mb-3 sm:mb-4">
              {email && (
                <p className="flex items-center text-sm text-gray-600">
                  <EnvelopeIcon className="h-4 w-4 mr-2 text-gray-500" />{" "}
                  {email}
                </p>
              )}
              {phoneNumber && (
                <p className="flex items-center text-sm text-gray-600">
                  <PhoneIcon className="h-4 w-4 mr-2 text-gray-500" />{" "}
                  {phoneNumber}
                </p>
              )}
              {location && (
                <p className="flex items-center text-sm text-gray-600">
                  <MapPinIcon className="h-4 w-4 mr-2 text-gray-500" />{" "}
                  {location}
                </p>
              )}
              <div className="flex items-start text-sm text-gray-600 pt-1">
                <TagIcon className="h-4 w-4 mr-2 text-gray-500 mt-1 flex-shrink-0" />
                Category
                <div className="flex flex-wrap gap-2 ms-2">
                  {categories.length > 0 ? (
                    categories.map((cat) => (
                      <span
                        key={cat.id}
                        className="px-2 py-0.5 rounded-full text-xs"
                        style={{
                          backgroundColor: lightBrandColor,
                          color: brandColor,
                        }}
                      >
                        {cat.title}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500">No categories</span>
                  )}
                </div>
              </div>
            </div>
            {/* Metrics Card */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
              {/* --- Top Section: Metrics --- */}
              <div className="grid grid-cols-3 divide-x divide-gray-200 text-center py-2 sm:py-3">
                {/* Qty Sold */}
                <div className="flex flex-col items-center justify-center px-1">
                  <img
                    src={ShoppingBagIcon}
                    alt="Products Sold"
                    className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500 mb-1"
                  />
                  <span className="text-xs text-gray-500">Qty Sold</span>
                  <span className="text-sm sm:text-lg font-semibold text-gray-900">
                    {productsSold}
                  </span>
                </div>

                {/* Followers */}
                <div className="flex flex-col items-center justify-center px-1">
                  <img
                    src={UsersIcon}
                    alt="Followers"
                    className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500 mb-1"
                  />
                  <span className="text-xs text-gray-500">Followers</span>
                  <span className="text-sm sm:text-lg font-semibold text-gray-900">
                    {followers}
                  </span>
                </div>

                {/* Ratings */}
                <div className="flex flex-col items-center justify-center px-1">
                  <img
                    src={StarIcon}
                    alt="Ratings"
                    className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500 mb-1"
                  />
                  <span className="text-xs text-gray-500">Ratings</span>
                  <span className="text-sm sm:text-lg font-semibold text-gray-900">
                    {ratings}
                  </span>
                </div>
              </div>

              {/* --- Bottom Section: Announcement Banner --- */}
              <div
                className="flex items-center mt- gap-2 px-4 py-2 text-sm font-medium"
                style={{
                  backgroundColor: brandColor,
                  color: contrastTextColor,
                }}
              >
                <img
                  src={MegaphoneIcon}
                  alt="Announcement"
                  className="h-4 w-4 flex-shrink-0 opacity-90"
                />
                <span className="truncate">{announcementText}</span>
              </div>
            </div>

            <StoreSocialLinks storeData={storeData} />
            {isStoreOwner && (
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4">
                <Button
                  onClick={handleAddProduct}
                  className="flex-1 py-2 sm:py-3"
                  style={{
                    backgroundColor: brandColor,
                    color: contrastTextColor,
                  }}
                >
                  Add Product
                </Button>
                <Button
                  onClick={handleAddService}
                  className="flex-1 py-2 sm:py-3 bg-black text-white"
                >
                  Add Service
                </Button>
              </div>
            )}
          </>
        ) : (
          <> {/* Your original Guest view JSX can go here */} </>
        )}
      </div>
    </Card>
  );
};

export default StoreOwnerInfoSection;
