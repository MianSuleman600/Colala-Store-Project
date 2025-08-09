// src/features/products/pages/BoostAdPreviewPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Button from '../../../components/ui/Button';
// Import necessary icons from Heroicons, excluding PencilIcon now
import { MapPinIcon, CurrencyDollarIcon, StarIcon, TruckIcon, TagIcon } from '@heroicons/react/24/outline';
import { getContrastTextColor } from '../../../utils/colorUtils';

// Import your local icons
import ShoppingCartIconPng from '../../../assets/icons/shopping-cart.png';
import SponsoredIconPng from '../../../assets/icons/Sponsored.png';
import EditIconPng from '../../../assets/icons/edit.png'; // Import your local edit.png icon

// Dummy images for demonstration
import dellLaptopImage from '../../../assets/images/productImages/2.jpeg';
import userProfilePic from '../../../assets/images/profileImage.png';

const BoostAdPreviewPage = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const { state } = useLocation();

    const brandColor = useSelector(state => state.ui?.brandColor) || '#EF4444';
    const contrastTextColor = getContrastTextColor(brandColor);

    const {
        dailyBudget = 2000,
        duration = 7,
        selectedLocation = 'Lagos, Nigeria',
        audienceSliderValue = 50,
    } = state || {};

    const product = {
        name: 'Dell Inspiron Laptop',
        currentPrice: 2000000,
        originalPrice: 2500000,
        imageUrl: dellLaptopImage,
        discountText: '20% Off in bulk',
        profilePic: userProfilePic,
        userName: 'Sasha Stores',
        rating: 4.5,
        hasFreeDelivery: true,
    };

    const totalApproximateSpend = dailyBudget * duration;

    const estimatedReach = '1k - 2k Accounts';
    const estimatedProductClicks = 500;
    const spendingWalletBalance = 3000000;

    const handleBoostProduct = () => {
        console.log("Boosting product with settings:", {
            productId,
            dailyBudget,
            duration,
            selectedLocation,
            totalApproximateSpend,
        });
        alert(`Product ${product.name} boosted successfully for ₦${totalApproximateSpend.toLocaleString()}!`);
        navigate(`/my-products/${productId}/details`);
    };

    const handleEditLocation = () => {
        navigate(`/my-products/${productId}/boost-setup`, {
            state: { dailyBudget, duration, selectedLocation, audienceSliderValue }
        });
    };

    const handleEditBudget = () => {
        navigate(`/my-products/${productId}/boost-setup`, {
            state: { dailyBudget, duration, selectedLocation, audienceSliderValue }
        });
    };

    return (
        <div className="container mx-auto outline-none p-4 md:p-8 bg-gray-50 min-h-screen">
            {/* Header / Breadcrumb */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800" style={{ fontFamily: 'Manrope' }}>
                    My product / Product details / <span style={{ color: brandColor }}>Boost Product</span>
                </h1>
            </div>

            <p className="text-lg font-semibold text-gray-700 mb-6">Your ad is almost ready</p>

            <div className="flex w-1/2 justify-between bg-white p-3 rounded-2xl border border-amber-50 items-center mb-4">
                <div className="flex flex-col">
                    <h3 className="text-lg font-semibold text-gray-800">Ad Preview</h3>
                    <p className="text-sm text-gray-500">This is how your ad will appear to your customers</p>
                </div>
                {/* Use the local edit.png icon here */}
                <img src={EditIconPng} alt="Edit Ad" className="h-5 w-5  text-gray-500 cursor-pointer hover:opacity-75" />
            </div>

            {/* Main Content Area */}
            <div className=" rounded-lg   p-4 md:p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 outline-none">

                {/* Ad Preview Section */}
                <div className="flex flex-col rounded-lg  relative  p-3  ">


                    {/* Ad Content Card */}
                    <div className="relative bg-white  rounded-2xl flex flex-col shadow-lg overflow-hidden border border-gray-100">
                        {/* Ad Image Section */}
                        <div className="relative w-full h-auto">
                            {/* "Sponsored" Tag using local image */}
                            <div className="absolute top-3 left-3 bg-yellow-400 text-gray-800 text-xs font-bold px-2.5 py-1 rounded-full flex items-center shadow-md z-10">
                                <img src={SponsoredIconPng} alt="Sponsored" className="h-4 w-auto" />Sponsored
                            </div>

                            <img src={product.imageUrl} alt={product.name} className="w-full h-64 object-cover" />

                            {/* User Info (positioned over the image) */}
                            <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-3 bg-white bg-opacity-80 backdrop-blur-sm">
                                <div className="flex items-center">
                                    <img src={product.profilePic} alt="Profile" className="w-6 h-6 rounded-full mr-2 object-cover" />
                                    <span className="text-sm font-medium text-gray-800">{product.userName}</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <StarIcon className="h-4 w-4 text-yellow-500 mr-1 fill-yellow-500" />
                                    <span>{product.rating}</span>
                                </div>
                            </div>
                        </div>

                        {/* Product Details Section */}
                        <div className="p-4 flex flex-col items-start bg-white">
                            <h4 className="text-lg font-bold text-gray-900 mb-1">{product.name}</h4>
                            <div className="flex items-baseline space-x-2">
                                <span className="text-xl font-bold" style={{ color: brandColor }}>₦{product.currentPrice.toLocaleString()}</span>
                                {product.originalPrice && (
                                    <span className="text-md text-gray-500 line-through">₦{product.originalPrice.toLocaleString()}</span>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-2 mt-3 mb-4">
                                {product.hasFreeDelivery && (
                                    <span className="flex items-center bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                                        <TruckIcon className="h-3 w-3 mr-1" /> Free delivery
                                    </span>
                                )}
                                {product.discountText && (
                                    <span className="flex items-center bg-orange-100 text-orange-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                                        <TagIcon className="h-3 w-3 mr-1" /> {product.discountText}
                                    </span>
                                )}
                            </div>

                            <div className="flex justify-between items-center w-full text-sm text-gray-600">
                                <span className="flex items-center">
                                    <MapPinIcon className="h-4 w-4 mr-1 text-gray-500" /> {selectedLocation}
                                </span>
                                <img src={ShoppingCartIconPng} alt="Shopping Cart" className="h-10 w-10 cursor-pointer hover:opacity-75" />
                            </div>
                        </div>
                    </div>

                    {/* Boost Product Button */}
                    <Button
                        onClick={handleBoostProduct}
                        className="w-full mt-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-shadow"
                        style={{ backgroundColor: brandColor, color: contrastTextColor }}
                    >
                        Boost Product
                    </Button>
                </div>

                {/* Right Column: Summary and Wallet */}
                <div className="flex flex-col space-y-6 p-2">
                    {/* Top Slider (for visual consistency, not functional here) */}
                    <div className="w-full h-2 rounded-lg bg-gray-300">
                        <div className="h-full rounded-lg" style={{ width: `${audienceSliderValue}%`, backgroundColor: brandColor }}></div>
                    </div>

                    {/* Location Card */}
                    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 flex justify-between items-center">
                        <div className="flex items-center">
                            <MapPinIcon className="h-5 w-5 text-gray-500 mr-2" />
                            <span className="text-lg font-medium text-gray-800">{selectedLocation}</span>
                        </div>
                        <button onClick={handleEditLocation} className="text-gray-500 hover:text-gray-700">
                            {/* Use the local edit.png icon here */}
                            <img src={EditIconPng} alt="Edit Location" className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Daily Budget & Duration Card */}
                    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 flex justify-between items-center">
                        <div className="flex items-center">
                            <CurrencyDollarIcon className="h-5 w-5 text-gray-500 mr-2" />
                            <span className="text-lg font-medium text-gray-800">₦{dailyBudget.toLocaleString()} for {duration} day</span>
                        </div>
                        <button onClick={handleEditBudget} className="text-gray-500 hover:text-gray-700">
                            {/* Use the local edit.png icon here */}
                            <img src={EditIconPng} alt="Edit Budget" className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Total Approximate Spend */}
                    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 flex justify-between items-center">
                        <span className="text-lg  text-gray-800">Total Approximate Spend</span>
                        <span className="text-xl font-bold" style={{ color: brandColor }}>₦{totalApproximateSpend.toLocaleString()}</span>
                    </div>

                    {/* Spending Wallet Balance - Adjusted for gradient background, full width, and white text */}
                    <div className="w-full bg-gradient-to-r from-red-600 to-purple-800 rounded-lg p-4 flex flex-col items-start text-white">
                        <div className="flex justify-between items-center  w-full mb-2">
                            <span className="text-lg font-semibold">Spending Wallet Balance</span>
                            <Button
                                className="px-4 py-2 text-sm   font-semibold rounded-md border border-white"
                                style={{ backgroundColor: 'white', color: brandColor }} // White background, brand color text
                            >
                                Top Up
                            </Button>
                        </div>
                        <span className="text-3xl font-bold">₦{spendingWalletBalance.toLocaleString()}</span>
                    </div>

                    {/* Estimated Reach - Adjusted for solid background, full width, and white text */}
                    <div className="w-full bg-red-600 rounded-lg p-4 flex justify-between items-center text-white">
                        <span className="text-lg font-semibold">Estimated Reach</span>
                        <span className="text-lg font-medium">{estimatedReach}</span>
                    </div>

                    {/* Estimated Product Clicks - Adjusted for solid background, full width, and white text */}
                    <div className="w-full bg-red-600 rounded-lg p-4 flex justify-between items-center text-white">
                        <span className="text-lg font-semibold">Estimated Product Clicks</span>
                        <span className="text-lg font-medium">{estimatedProductClicks}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BoostAdPreviewPage;