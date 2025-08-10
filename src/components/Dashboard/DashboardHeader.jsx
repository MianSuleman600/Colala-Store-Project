// src/components/Dashboard/DashboardHeader.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import { Bars3Icon } from '@heroicons/react/24/outline';
import WalletDashboard from './WalletDashboard';

const DashboardHeader = ({ brandColor, contrastTextColor, toggleSidebar, showHamburger, storeProfile }) => {
    const navigate = useNavigate();

    // Handler to navigate to the home page when the profile section is clicked
    const handleProfileClick = () => {
        navigate('/');
    };

    // We get the data from props instead of fetching it again here
    const escrowBalance = storeProfile?.escrowBalance?.toLocaleString() || '50,000';
    const shoppingBalance = storeProfile?.shoppingBalance?.toLocaleString() || '50,000';
    const storeName = storeProfile?.storeName || 'Sasha Stores';
    const storeLocation = storeProfile?.storeLocation || 'Laogs, Nigeria';

    const handleEditProfileClick = () => {
        navigate('/store-upgrade');
    };

    return (
        <div className="flex flex-col gap-4">
            {/* Hamburger button container - only show if showHamburger is true */}
            {showHamburger && (
                <div className="flex justify-between items-center p-4 bg-white shadow-md rounded-xl">
                    <h2 className="font-semibold text-lg text-gray-700">Dashboard</h2>
                    <button
                        onClick={toggleSidebar}
                        className="text-gray-600 focus:outline-none"
                    >
                        <Bars3Icon className="h-6 w-6" />
                    </button>
                </div>
            )}

            {/* Profile Section - Now clickable to navigate to the home page */}
            <div 
                className="flex items-center gap-4 p-4 rounded-xl bg-white shadow-md cursor-pointer"
                onClick={handleProfileClick}
            >
                <img
                    src={storeProfile?.profilePictureUrl || 'https://googleusercontent.com/file_content/0'}
                    alt="Store Avatar"
                    className="w-16 h-16 rounded-full"
                />
                <div className='flex flex-col'>
                    <h2 className="font-semibold text-xl">{storeName}</h2>
                    <p className="text-sm text-gray-500">{storeLocation}</p>
                </div>
            </div>

            {/* Wallet Cards container - responsive layout */}
            <div
                className="flex flex-col sm:flex-row items-center rounded-2xl p-4 shadow-md gap-4"
                style={{ backgroundColor: brandColor || '#EF4444', color: contrastTextColor || 'white' }}
            >
                {/* ... (wallet card content is the same) ... */}
                <div className="flex-1 flex justify-between items-center w-full">
                    <div>
                        <p className="text-[14px]">Escrow Wallet</p>
                        <p className="text-lg font-bold">₦{escrowBalance}</p>
                    </div>
                    <Button
                        className="text-[14px] rounded-md px-4 py-1"
                        style={{
                            backgroundColor: "white",
                            color: brandColor || "#EF4444",
                        }}
                        onClick={() => navigate("/wallet/escrow")}
                    >
                        View
                    </Button>
                </div>
                <div className="h-16 w-px bg-white opacity-20 hidden sm:block"></div>
                <div className="flex-1 flex justify-between items-center w-full">
                    <div>
                        <p className="text-[14px]">Shopping Wallet</p>
                        <p className="text-lg font-bold">₦{shoppingBalance}</p>
                    </div>
                    <Button
                        className="text-[14px] rounded-md px-4 py-1"
                        style={{
                            backgroundColor: "white",
                            color: brandColor || "#EF4444",
                        }}
                        onClick={() => navigate("/wallet/shopping")}
                    >
                        View
                    </Button>
                </div>
            </div>

            {/* Edit Profile Button */}
            <Button
                className="w-full rounded-2xl font-semibold py-4"
                style={{ backgroundColor: brandColor || '#EF4444', color: contrastTextColor || 'white' }}
                onClick={handleEditProfileClick}
            >
                Edit Profile
            </Button>
        </div>
    );
};

export default DashboardHeader;
