import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import { Bars3Icon } from '@heroicons/react/24/outline';

const DashboardHeader = ({ brandColor, contrastTextColor, toggleSidebar, showHamburger, storeProfile }) => {
  const navigate = useNavigate();

  const handleProfileClick = () => navigate('/');

  const escrowBalance = Number(storeProfile?.escrowBalance || 50000).toLocaleString();
  const shoppingBalance = Number(storeProfile?.shoppingBalance || 50000).toLocaleString();
  const storeName = storeProfile?.storeName || 'Sasha Stores';
  const storeLocation = storeProfile?.location || 'Lagos, Nigeria';

  return (
    <div className="flex flex-col gap-2">
      {/* Hamburger (mobile only) */}
      {showHamburger && (
        <div className="flex justify-between items-center p-4 bg-white shadow-md rounded-xl">
          <h2 className="font-semibold text-lg text-gray-700">Dashboard</h2>
          <button
            onClick={toggleSidebar}
            className="text-gray-600 focus:outline-none"
            aria-label="Toggle sidebar"
            aria-expanded={showHamburger}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>
      )}

      {/* Profile card */}
      <div
        className="flex items-center gap-4 p-4 rounded-xl bg-white shadow-md cursor-pointer"
        onClick={handleProfileClick}
        role="button"
        aria-label="Go to store home"
      >
        <img
          src={storeProfile?.profilePictureUrl || 'https://placehold.co/120x120/cccccc/000000?text=Store'}
          alt={`${storeName} avatar`}
          className="w-15 h-15 object-cover rounded-full"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = 'https://placehold.co/120x120/cccccc/000000?text=Store';
          }}
        />
        <div className="flex flex-col">
          <h2 className="font-semibold text-xl">{storeName}</h2>
          <p className="text-sm text-gray-500">{storeLocation}</p>
        </div>
      </div>

      {/* Wallets quick view */}
      <div
        className="flex flex-col sm:flex-row items-stretch rounded-2xl p-2 shadow-md gap-2 overflow-hidden"
        style={{ backgroundColor: brandColor || '#EF4444', color: contrastTextColor || '#FFFFFF' }}
      >
        <div className="flex-1 min-w-0 flex justify-between items-center">
          <div className="min-w-0">
            <p className="text-[14px]">Escrow Wallet</p>
            <p className="text-lg font-bold truncate">₦{escrowBalance}</p>
          </div>
          <Button
            className="text-[14px] rounded-md px-4 py-1 shrink-0"
            style={{ backgroundColor: 'white', color: brandColor || '#EF4444' }}
            onClick={() => navigate('wallet/escrow')}
          >
            View
          </Button>
        </div>

        {/* Divider */}
        <div className="hidden sm:block h-16 w-px bg-white/20" />
        {/* Optional: show a thin horizontal divider on mobile */}
        <div className="block sm:hidden h-px w-full bg-white/20" />

        <div className="flex-1 min-w-0 flex justify-between items-center">
          <div className="min-w-0">
            <p className="text-[14px]">Shopping Wallet</p>
            <p className="text-lg font-bold truncate">₦{shoppingBalance}</p>
          </div>
          <Button
            className="text-[14px] rounded-md px-4 py-1 shrink-0"
            style={{ backgroundColor: 'white', color: brandColor || '#EF4444' }}
            onClick={() => navigate('wallet/shopping')}
          >
            View
          </Button>
        </div>
      </div>

      <Button
        className="w-full rounded-2xl font-semibold py-4"
        style={{ backgroundColor: brandColor || '#EF4444', color: contrastTextColor || '#FFFFFF' }}
        onClick={() => navigate('store-upgrade')}
      >
        Edit Profile
      </Button>
    </div>
  );
};

export default DashboardHeader;