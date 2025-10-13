// src/components/store/StoreOwnerInfoSection.jsx

import React, { useMemo } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { useNavigate } from 'react-router-dom';
import { MapPinIcon, PhoneIcon, EnvelopeIcon, TagIcon } from '@heroicons/react/24/outline';
import VerifiedIcon from '../../assets/icons/varified.png';
import MegaphoneIcon from '../../assets/icons/Megaphone.png';
import ShoppingBagIcon from '../../assets/icons/shop.png';
import UsersIcon from '../../assets/icons/profile.png';
import StarIcon from '../../assets/icons/star.png';
import StoreSocialLinks from './StoreSocialLinks';

const StoreOwnerInfoSection = ({
  storeData = {},
  isLoggedIn = false,
  isStoreOwner = false,
  onOpenAuthModal = () => {},
  brandColor = '#EF4444',
  contrastTextColor = '#FFFFFF',
  lightBrandColor = '#FCA5A5',
}) => {
  const navigate = useNavigate();

  const handleAddProduct = () => navigate('/add-product');
  const handleAddService = () => navigate('/add-service');

  // Data mapping from the normalized `storeData` object
  const storeName = storeData?.name || 'Store Name';
  const email = storeData?.email || '';
  const phoneNumber = storeData?.phone || '';
  const location = storeData?.location || '';
  const categories = storeData?.categories || [];
  const productsSold = storeData?.totalSold || 0;
  const followers = storeData?.followersCount || 0;
  const ratings = storeData?.averageRating || 0;
  const announcementText = storeData?.announcements?.[0]?.message || 'Welcome to our store!';

  return (
    <Card className="p-6 pt-16">
      <div className="rounded-lg space-y-4">
        {isLoggedIn ? (
          <>
            <div className="flex items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800 flex items-center">
                {storeName}
                <img src={VerifiedIcon} alt="Verified" className="h-5 w-5 ml-2" />
              </h3>
            </div>
            <div className="space-y-2 mb-4">
              {email && <p className="flex items-center text-sm text-gray-600"><EnvelopeIcon className="h-4 w-4 mr-2 text-gray-500" /> {email}</p>}
              {phoneNumber && <p className="flex items-center text-sm text-gray-600"><PhoneIcon className="h-4 w-4 mr-2 text-gray-500" /> {phoneNumber}</p>}
              {location && <p className="flex items-center text-sm text-gray-600"><MapPinIcon className="h-4 w-4 mr-2 text-gray-500" /> {location}</p>}
              <div className="flex items-start text-sm text-gray-600 pt-1">
                <TagIcon className="h-4 w-4 mr-2 text-gray-500 mt-1 flex-shrink-0" />
                <div className="flex flex-wrap gap-2">
                  {categories.length > 0 ? (
                    categories.map((cat) => (
                      <span key={cat.id} className="px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: lightBrandColor, color: brandColor }}>
                        {cat.title}
                      </span>
                    ))
                  ) : (<span className="text-gray-500">No categories</span>)}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 text-center bg-white rounded-2xl pt-4 shadow-lg overflow-hidden border">
              <div className="flex flex-col items-center p-2 border-r"><img src={ShoppingBagIcon} className="h-6 w-6 mb-1" alt="Products Sold" /><span className="font-semibold text-gray-800">{productsSold}</span><span className="text-xs text-gray-500">Qty Sold</span></div>
              <div className="flex flex-col items-center p-2 border-r"><img src={UsersIcon} className="h-6 w-6 mb-1" alt="Followers" /><span className="font-semibold text-gray-800">{followers}</span><span className="text-xs text-gray-500">Followers</span></div>
              <div className="flex flex-col items-center p-2"><img src={StarIcon} className="h-6 w-6 mb-1" alt="Ratings" /><span className="font-semibold text-gray-800">{ratings}</span><span className="text-xs text-gray-500">Ratings</span></div>
              <div className="col-span-3 flex items-center justify-center gap-2 w-full p-2 text-center text-xs" style={{ backgroundColor: brandColor, color: contrastTextColor }}>
                <img src={MegaphoneIcon} alt="Megaphone" className="h-4 w-4 flex-shrink-0" /><span className="break-words">{announcementText}</span>
              </div>
            </div>
            <StoreSocialLinks storeData={storeData} />
            {isStoreOwner && (
              <div className="flex space-x-4 mt-4">
                <Button onClick={handleAddProduct} className="flex-1" style={{ backgroundColor: brandColor, color: contrastTextColor }}>Add Product</Button>
                <Button onClick={handleAddService} className="flex-1 bg-black text-white">Add Service</Button>
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