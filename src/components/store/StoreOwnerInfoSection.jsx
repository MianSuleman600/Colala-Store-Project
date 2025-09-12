// src/components/store/StoreOwnerInfoSection.jsx
import React, { useMemo } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import StoreSocialLinks from './StoreSocialLinks';
import { useNavigate } from 'react-router-dom';

// Hooks: active announcements (DB-backed)
import { useActiveAnnouncementsQuery } from '../../services/queries/useAnnouncementQuery';

// Icons
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  TagIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import VerifiedIcon from '../../assets/icons/varified.png';
import MegaphoneIcon from '../../assets/icons/Megaphone.png';
import ShoppingBagIcon from '../../assets/icons/shop.png';
import UsersIcon from '../../assets/icons/profile.png';
import StarIcon from '../../assets/icons/star.png';
import {
  ShoppingBagIcon as ShoppingBagSolid,
  UsersIcon as UsersSolid,
  StarIcon as StarSolid,
} from '@heroicons/react/24/solid';

const StoreOwnerInfoSection = ({
  storeData = {},
  isLoggedIn = false,
  onOpenAuthModal = () => {},
  brandColor = '#EF4444',
  contrastTextColor = '#FFFFFF',
  lightBrandColor = '#FCA5A5',
}) => {
  const navigate = useNavigate();

  const handleAddProduct = () => navigate('/add-product');
  const handleAddService = () => navigate('/add-service');

  const storeName = storeData?.storeName || storeData?.name || 'Guest Store';
  const email = storeData?.email || '';
  const phoneNumber = storeData?.phoneNumber || '';
  const location = storeData?.location || '';
  const categories = storeData?.categories || [];
  const productsSold = storeData?.productsSold || 0;
  const followers = storeData?.followers || 0;
  const ratings = storeData?.ratings || 0;
  const salesMessage = storeData?.salesMessage || 'No promotional message.';

  // Fetch active announcements (optionally scoped by storeId if your API supports it)
  const { data: activeAnnouncements = [] } = useActiveAnnouncementsQuery(
    { storeId: storeData?.id }, // remove or keep based on your backend filter
    { staleTime: 30_000 }
  );

  // Choose announcement text to display in the footer bar:
  // - Highest priority active announcement (or first)
  // - Fallback to salesMessage if none
  const announcementText = useMemo(() => {
    if (Array.isArray(activeAnnouncements) && activeAnnouncements.length) {
      const sorted = [...activeAnnouncements].sort(
        (a, b) => (b.priority || 0) - (a.priority || 0)
      );
      const ann = sorted.find((a) => a.active) || sorted[0];
      return (ann?.text || '').trim();
    }
    return '';
  }, [activeAnnouncements]);

  const displayFooterText =
    announcementText || salesMessage || 'No announcement available.';

  return (
    <Card className={`p-6 ${!isLoggedIn ? 'opacity-100' : ''}`}>
      <div className="rounded-lg space-y-4">
        {isLoggedIn ? (
          <>
            {/* Store Info */}
            <div className="flex items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800 flex items-center">
                {storeName}
                <img src={VerifiedIcon} alt="Verified" className="h-5 w-5 ml-2" />
              </h3>
            </div>

            {/* Contact Info */}
            <div className="space-y-2 mb-4">
              {email && (
                <p className="flex items-center text-sm text-gray-600">
                  <EnvelopeIcon className="h-4 w-4 mr-2 text-gray-500" /> {email}
                </p>
              )}
              {phoneNumber && (
                <p className="flex items-center text-sm text-gray-600">
                  <PhoneIcon className="h-4 w-4 mr-2 text-gray-500" /> {phoneNumber}
                </p>
              )}
              {location && (
                <p className="flex items-center text-sm text-gray-600">
                  <MapPinIcon className="h-4 w-4 mr-2 text-gray-500" /> {location}
                </p>
              )}

              {/* Categories */}
              <div className="flex items-center text-sm text-gray-600 flex-wrap">
                <TagIcon className="h-4 w-4 mr-2 text-gray-500" />
                <div className="flex flex-wrap gap-2 ml-1">
                  {categories.length > 0 ? (
                    categories.map((cat, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 rounded-full text-xs"
                        style={{ backgroundColor: lightBrandColor, color: contrastTextColor }}
                      >
                        {cat}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500">No categories added</span>
                  )}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 text-center bg-white rounded-2xl pt-4 shadow-lg overflow-hidden">
              <div className="flex flex-col items-center border-r border-gray-300">
                <img src={ShoppingBagIcon} className="h-6 w-6 mb-1" alt="Products Sold" />
                <span className="font-semibold text-gray-800">{productsSold}</span>
                <span className="text-xs text-gray-500">Qty Sold</span>
              </div>
              <div className="flex flex-col items-center border-r border-gray-300">
                <img src={UsersIcon} className="h-6 w-6 mb-1" alt="Followers" />
                <span className="font-semibold text-gray-800">{followers}</span>
                <span className="text-xs text-gray-500">Followers</span>
              </div>
              <div className="flex flex-col items-center">
                <img src={StarIcon} className="h-6 w-6 mb-1" alt="Ratings" />
                <span className="font-semibold text-gray-800">{ratings}</span>
                <span className="text-xs text-gray-500">Ratings</span>
              </div>

              {/* Footer bar: Announcement text replaces salesMessage */}
              <div
                className="col-span-3 flex items-center justify-center gap-2 w-full p-2 rounded-b-2xl text-sm sm:text-base flex-wrap sm:flex-nowrap text-center"
                style={{ backgroundColor: brandColor, color: contrastTextColor }}
              >
                <img src={MegaphoneIcon} alt="Megaphone" className="h-4 w-4 flex-shrink-0" />
                <span className="break-words">{displayFooterText}</span>
              </div>
            </div>

            {/* Social Links */}
            <StoreSocialLinks isLoggedIn={isLoggedIn} storeData={storeData} />

            {/* Actions */}
            <div className="flex  space-x-4 mt-4">
              <Button
                onClick={handleAddProduct}
                className="flex-1 py-2 px-4 rounded-2xl"
                style={{ backgroundColor: brandColor, color: contrastTextColor }}
              >
                Add Product
              </Button>
              <Button
                onClick={handleAddService}
                className="flex-1 py-2 px-4 rounded-2xl bg-black text-white hover:bg-gray-700"
              >
                Add Service
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-800">Sasha Stores</h3>
            </div>
            <div className="space-y-2 mb-4">
              <p className="flex items-center text-sm text-gray-600">
                <EnvelopeIcon className="h-4 w-4 mr-2 text-gray-500" /> sashastores@gmail.com
              </p>
              <p className="flex items-center text-sm text-gray-600">
                <PhoneIcon className="h-4 w-4 mr-2 text-gray-500" /> 070123456789
              </p>
              <p className="flex items-center text-sm text-gray-600">
                <MapPinIcon className="h-4 w-4 mr-2 text-gray-500" /> Lagos, Nigeria
              </p>
              <div className="flex items-center text-sm text-gray-600">
                <TagIcon className="h-4 w-4 mr-2 text-gray-500" /> Category
                <span className="text-red-500 ml-1 cursor-pointer">Add New</span>
              </div>
            </div>
            <div className="grid grid-cols-3 text-center bg-gray-200 rounded-lg py-4 shadow-sm mb-4">
              <div className="flex flex-col items-center">
                <img src={ShoppingBagIcon} className="h-6 w-6 text-gray-500 mb-1" alt="Qty Sold" />
                <span className="text-sm text-gray-700 font-semibold">-</span>
                <span className="text-xs text-gray-500">Qty Sold</span>
              </div>
              <div className="flex flex-col items-center">
                <img src={UsersIcon} className="h-6 w-6 text-gray-500 mb-1" alt="Followers" />
                <span className="text-sm text-gray-700 font-semibold">-</span>
                <span className="text-xs text-gray-500">Followers</span>
              </div>
              <div className="flex flex-col items-center">
                <img src={StarIcon} className="h-6 w-6 text-gray-500 mb-1" alt="Ratings" />
                <span className="text-sm text-gray-700 font-semibold">-</span>
                <span className="text-xs text-gray-500">Ratings</span>
              </div>
            </div>
            <div className="flex space-x-4 mt-4">
              <Button
                onClick={() => onOpenAuthModal('register')}
                className="flex-1 py-2 px-4 rounded-2xl text-white bg-redd/50"
              >
                Add Product
              </Button>
              <Button
                onClick={() => onOpenAuthModal('register')}
                className="flex-1 py-2 px-4 rounded-2xl bg-black/50 text-white"
              >
                Add Service
              </Button>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};

export default StoreOwnerInfoSection;