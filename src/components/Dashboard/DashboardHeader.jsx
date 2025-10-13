// src/components/Dashboard/DashboardHeader.jsx

import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Bars3Icon } from '@heroicons/react/24/outline';
import Button from '../ui/Button';
import { getContrastTextColor } from '../../utils/colorUtils';
import { useWalletBalanceQuery, useEscrowWalletQuery } from '../../services/queries/useWalletQuery';
import { ASSETS_BASE } from '../../api/apiConfig';

const DashboardHeader = ({ toggleSidebar, showHamburger }) => {
  const navigate = useNavigate();
  
  const { user } = useSelector((state) => state.auth);
  const storeProfile = user?.store;

  const brandColor = useMemo(() => storeProfile?.brandColor || storeProfile?.theme_color || '#EF4444', [storeProfile]);
  const contrastTextColor = useMemo(() => getContrastTextColor(brandColor), [brandColor]);
  
  const { data: walletData } = useWalletBalanceQuery({ enabled: !!user });
  const { data: escrowData } = useEscrowWalletQuery({ enabled: !!user });

  const shoppingBalance = Number(walletData?.shopping_balance || 0).toLocaleString();
  const escrowBalance = Number(escrowData?.locked_balance || 0).toLocaleString();
  
  const storeName = storeProfile?.name || 'Your Store';
  const storeLocation = storeProfile?.location || '...';
  const profilePictureUrl = storeProfile?.profile_image 
    ? `${ASSETS_BASE}/storage/${storeProfile.profile_image.replace('/storage/', '')}` 
    : null;
  return (
    <div className="flex flex-col gap-2">
      {showHamburger && (
        <div className="flex justify-between items-center p-4 bg-white shadow-md rounded-xl lg:hidden">
          <h2 className="font-semibold text-lg text-gray-700">Dashboard</h2>
          <button onClick={toggleSidebar} className="text-gray-600" aria-label="Toggle sidebar">
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>
      )}

      <div className="flex items-center gap-4 p-4 rounded-xl bg-white shadow-md">
        <img
          src={profilePictureUrl || 'https://placehold.co/80x80/cccccc/000000?text=Store'}
          alt={`${storeName} avatar`}
          className="w-16 h-16 object-cover rounded-full"
        />
        <div className="flex flex-col">
          <h2 className="font-semibold text-xl">{storeName}</h2>
          <p className="text-sm text-gray-500">{storeLocation}</p>
        </div>
      </div>

      <div
        className="flex flex-col sm:flex-row items-stretch rounded-2xl p-2 shadow-md gap-2 overflow-hidden"
        style={{ backgroundColor: brandColor, color: contrastTextColor }}
      >
        <div className="flex-1 min-w-0 flex justify-between items-center p-2">
          <div className="min-w-0">
            <p className="text-sm">Escrow Wallet</p>
            <p className="text-lg font-bold truncate">₦{escrowBalance}</p>
          </div>
          {/* --- THIS IS THE FIX --- */}
          <Button
            className="text-sm rounded-md px-4 py-1 shrink-0"
            style={{ backgroundColor: 'white', color: brandColor }}
            onClick={() => navigate('/settings/wallet/escrow')} // Use absolute path
          >
            View
          </Button>
          {/* --- END OF FIX --- */}
        </div>

        <div className="block sm:hidden h-px w-full bg-white/20" />

        <div className="flex-1 min-w-0 flex justify-between items-center p-2">
          <div className="min-w-0">
            <p className="text-sm">Shopping Wallet</p>
            <p className="text-lg font-bold truncate">₦{shoppingBalance}</p>
          </div>
          {/* --- THIS IS THE FIX --- */}
          <Button
            className="text-sm rounded-md px-4 py-1 shrink-0"
            style={{ backgroundColor: 'white', color: brandColor }}
            onClick={() => navigate('/settings/wallet/shopping')} // Use absolute path
          >
            View
          </Button>
          {/* --- END OF FIX --- */}
        </div>
      </div>

      <Button
        className="w-full rounded-2xl font-semibold py-4"
        style={{ backgroundColor: brandColor, color: contrastTextColor }}
        onClick={() => navigate('/settings/store-upgrade')} // Example: navigate to a profile edit page
      >
        Edit Profile
      </Button>
    </div>
  );
};

export default DashboardHeader;