// src/pages/referrals/FindProducts.jsx
import React, { useState } from 'react';
import { CameraIcon } from '@heroicons/react/24/outline';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { useReferralProductsQuery, useReferralWalletQuery } from '../../services/queries/useReferralQuery.js';
import { copyText } from '../../utils/clipboard.js';

const toast = (type, message) => {
  try {
    window.dispatchEvent(new CustomEvent('SHOW_ALERT', { detail: { type, message } }));
  } catch {}
};

const ProductSearch = ({ brandColor = '#EF4444', contrastTextColor = '#ffffff' }) => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [commission, setCommission] = useState('');
  const { data: wallet } = useReferralWalletQuery();
  const { data: products = [], isLoading } = useReferralProductsQuery({ search, category, commission });

  const code = wallet?.referralCode || '';

  const handleCopyLink = async (productId) => {
    try {
      if (!productId) throw new Error('Invalid product');
      if (!code) throw new Error('Your referral code is missing');

      const origin =
        typeof window !== 'undefined' && window.location?.origin
          ? window.location.origin
          : 'https://colala.com';

      const referralLink = `${origin}/product/${encodeURIComponent(productId)}?ref=${encodeURIComponent(code)}`;
      await copyText(referralLink);
      toast('success', 'Referral link copied!');
    } catch (err) {
      toast('error', err?.message || 'Failed to copy referral link');
    }
  };

  return (
    <div className="space-y-6 px-4 py-6">
      {/* Search bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search Product"
          className="w-full pl-4 pr-14 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2"
          style={{ '--tw-ring-color': brandColor }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center space-x-3">
          <CameraIcon className="h-5 w-5 text-gray-500" />
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-2 gap-4">
        <select
          className="p-3 border border-gray-300 rounded-xl text-gray-700"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Category</option>
          <option value="electronics">Electronics</option>
        </select>
        <select
          className="p-3 border border-gray-300 rounded-xl text-gray-700"
          value={commission}
          onChange={(e) => setCommission(e.target.value)}
        >
          <option value="">Commission</option>
          <option value="5%">5%</option>
          <option value="4%">4%</option>
        </select>
      </div>

      {/* Product Cards */}
      <div className="space-y-4">
        {isLoading ? (
          <Card className="p-4">Loading...</Card>
        ) : products.length === 0 ? (
          <Card className="p-4">No products found.</Card>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-[20px] shadow-sm flex p-4 items-center justify-between"
            >
              <div className="flex flex-col items-center space-y-2 mr-4">
                <img src={product.imageUrl} alt={product.name} className="h-20 w-20 rounded-lg object-cover" />
                <div className="flex items-center space-x-1">
                  <img src={product.storeAvatar} className="h-5 w-5 rounded-full" alt="store" />
                  <span className="text-xs font-medium" style={{ color: brandColor }}>
                    {product.store}
                  </span>
                </div>
              </div>

              <div className="flex-1">
                <p className="font-medium text-lg text-black">{product.name}</p>
                <p className="font-semibold mt-1" style={{ color: brandColor }}>
                  ₦{Intl.NumberFormat().format(product.price)}
                </p>
                <p className="text-gray-500 mt-2">
                  Commission : <span className="text-black font-medium">{product.commission}</span>
                </p>
              </div>

              <button
                onClick={() => handleCopyLink(product.id)}
                className="text-sm font-medium py-2 px-4 rounded-md transition-colors duration-200"
                style={{ backgroundColor: brandColor, color: contrastTextColor }}
              >
                Copy link
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductSearch;