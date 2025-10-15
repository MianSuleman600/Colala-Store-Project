// src/components/store/StoreHeader.jsx

import React from 'react';
import ImagePlaceholder from '../ui/ImagePlaceholder';
import { ArrowLeftIcon, ShareIcon, UserPlusIcon, UserMinusIcon } from '@heroicons/react/24/outline';

const StoreHeader = ({
  bannerImageUrl,
  profilePictureUrl,
  isModalOpen,
  handleGoBack,
  handleShare,
  isFollowing,
  handleFollowToggle,
  isStoreOwner,
}) => {
  return (
    <div className="w-full h-[120px] sm:h-[150px] bg-gray-200 mb-6 sm:mb-8 md:mb-12 relative rounded-2xl">
      <ImagePlaceholder
        src={bannerImageUrl}
        alt="Store Banner"
        className="w-full h-full rounded-2xl object-cover"
      />
      
      {isModalOpen && (
        <>
          <div className="absolute top-4 left-4">
            <button
              onClick={handleGoBack}
              className="p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
          </div>
          <div className="absolute top-4 right-4 flex items-center gap-2">
            {!isStoreOwner && (
              <button
                onClick={handleFollowToggle}
                className="p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
              >
                {isFollowing ? <UserMinusIcon className="w-5 h-5" /> : <UserPlusIcon className="w-5 h-5" />}
              </button>
            )}
            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
            >
              <ShareIcon className="w-5 h-5" />
            </button>
          </div>
        </>
      )}

      <div className="absolute left-4 sm:left-6 -bottom-6 sm:-bottom-8 md:-bottom-10">
        <ImagePlaceholder
          src={profilePictureUrl}
          alt="Profile Picture"
          className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-full object-cover border-3 sm:border-4 border-white shadow-lg"
        />
      </div>
    </div>
  );
};

export default StoreHeader;