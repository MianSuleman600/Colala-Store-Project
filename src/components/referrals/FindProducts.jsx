import React, { useState } from 'react';
import { CameraIcon } from '@heroicons/react/24/outline';
import Card from '../ui/Card';
import Button from '../ui/Button';

// The component now accepts brandColor and contrastTextColor as props
const ProductSearch = ({ brandColor, contrastTextColor }) => {
    // Dummy data
    const productData = [
        {
            id: 1,
            name: 'Dell Inspiron Laptop',
            price: '2,000,000',
            commission: '5%',
            store: 'Sasha Stores',
            storeAvatar: 'https://placehold.co/30x30/f44336/ffffff?text=S',
            imageUrl: 'https://placehold.co/80x80/e0e0e0/000000?text=Dell+Laptop',
            
        },
        {
            id: 2,
            name: 'Dell Inspiron Laptop',
            price: '2,000,000',
            commission: '5%',
            store: 'Sasha Stores',
            storeAvatar: 'https://placehold.co/30x30/f44336/ffffff?text=S',
            imageUrl: 'https://placehold.co/80x80/e0e0e0/000000?text=Dell+Laptop',
        },
    ];

    const handleCopyLink = (productId) => {
        const referralLink = `https://colala.com/product/${productId}?ref=yourcode`;
        // In a real app, you would use a custom modal instead of alert
        navigator.clipboard.writeText(referralLink)
            .then(() => alert('Referral link copied!'))
            .catch(err => console.error('Failed to copy text:', err));
    };

    return (
        <div className="space-y-6 px-4 py-6">
            {/* Search bar */}
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search Product"
                    className="w-full pl-4 pr-14 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2"
                    // Applying brandColor to the focus ring
                    style={{ '--tw-ring-color': brandColor }}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center space-x-3">
                    <CameraIcon className="h-5 w-5 text-gray-500" />
                </div>
            </div>

            {/* Dropdown filters */}
            <div className="grid grid-cols-2 gap-4">
                <select className="p-3 border border-gray-300 rounded-xl text-gray-700">
                    <option>Category</option>
                </select>
                <select className="p-3 border border-gray-300 rounded-xl text-gray-700">
                    <option>Commission</option>
                </select>
            </div>

            {/* Product Cards */}
            <div className="space-y-4">
                {productData.map(product => (
                    <div
                        key={product.id}
                        className="bg-white rounded-[20px] shadow-sm flex p-4 items-center justify-between"
                    >
                        {/* Left Section: Image + Store Avatar vertically */}
                        <div className="flex flex-col items-center space-y-2 mr-4">
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="h-20 w-20 rounded-lg object-cover"
                            />
                            <div className="flex items-center space-x-1">
                                <img
                                    src={product.storeAvatar}
                                    className="h-5 w-5 rounded-full"
                                    alt="store"
                                />
                                {/* Applying brandColor to the store name */}
                                <span className="text-xs font-medium" style={{ color: brandColor }}>{product.store}</span>
                            </div>
                        </div>

                        {/* Center: Info */}
                        <div className="flex-1">
                            <p className="font-medium text-lg text-black">{product.name}</p>
                            {/* Applying brandColor to the price */}
                            <p className="font-semibold mt-1" style={{ color: brandColor }}>₦{product.price}</p>
                            <p className="text-gray-500 mt-2">
                                Commission : <span className="text-black font-medium">{product.commission}</span>
                            </p>
                        </div>

                        {/* Right: Button */}
                        <button
                            onClick={() => handleCopyLink(product.id)}
                            className="text-sm font-medium py-2 px-4 rounded-md transition-colors duration-200"
                            // Applying brandColor and contrastTextColor to the button
                            style={{ backgroundColor: brandColor, color: contrastTextColor }}
                        >
                            Copy link
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductSearch;
