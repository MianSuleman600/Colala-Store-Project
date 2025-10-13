import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { CameraIcon } from '@heroicons/react/24/outline';
import Card from '../../components/ui/Card';
import { useReferralProductsQuery, useReferralWalletQuery } from '../../services/queries/useReferralQuery.js';
import { copyText } from '../../utils/clipboard.js';
import { useToast } from '../../components/ui/ToastProvider';
import { getContrastTextColor } from '../../utils/colorUtils';

const ProductSearch = () => {
  const { push } = useToast();
  
  // Get user and brand color from Redux state
  const { user } = useSelector((state) => state.auth);
  const brandColor = useMemo(() => user?.store?.brandColor || user?.store?.theme_color || '#EF4444', [user]);
  const contrastTextColor = useMemo(() => getContrastTextColor(brandColor), [brandColor]);

  // State for the filter inputs
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [commission, setCommission] = useState('');
  
  // Fetch data from React Query
  const { data: wallet } = useReferralWalletQuery();
  // --- OPTIMIZATION: Fetch the full list of products only ONCE ---
  // The query parameters are removed, so this hook will not re-fetch on filter changes.
  const { data: allProducts = [], isLoading } = useReferralProductsQuery();

  const code = wallet?.referralCode || '';

  // --- CLIENT-SIDE FILTERING LOGIC ---
  const filteredProducts = useMemo(() => {
    // Start with the full list of products
    let products = allProducts;
    
    // Apply search filter (case-insensitive)
    if (search) {
      const searchTerm = search.toLowerCase();
      products = products.filter(product => 
        product.name?.toLowerCase().includes(searchTerm) ||
        product.store?.store_name?.toLowerCase().includes(searchTerm)
      );
    }
    
    // Apply category filter
    if (category) {
      // Assumes product.category.name or similar structure. Adjust if needed.
      products = products.filter(product => product.category?.name === category);
    }

    // Apply commission filter (example logic, adjust as needed)
    if (commission) {
      const commissionValue = parseFloat(commission);
      products = products.filter(product => (product.commission || 0) >= commissionValue);
    }
    
    return products;
  }, [allProducts, search, category, commission]); // This memo re-runs only when these dependencies change
  // --- END OF CLIENT-SIDE FILTERING ---


  const handleCopyLink = async (productId) => {
    try {
      if (!productId || !code) throw new Error('Referral code or Product ID is missing.');
      const referralLink = `${window.location.origin}/product/${productId}?ref=${code}`;
      await copyText(referralLink);
      push('Referral link copied!', { type: 'success' });
    } catch (err) {
      push(err.message || 'Failed to copy link', { type: 'error' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <input
          type="text"
          placeholder="Search Product or Store"
          className="w-full pl-4 pr-14 py-3 rounded-xl border focus:outline-none focus:ring-2"
          style={{ '--tw-ring-color': brandColor }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center space-x-3">
          <CameraIcon className="h-5 w-5 text-gray-500" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <select className="p-3 border border-gray-300 rounded-xl text-gray-700" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          {/* You can dynamically populate these options from another query */}
        </select>
        <select className="p-3 border border-gray-300 rounded-xl text-gray-700" value={commission} onChange={(e) => setCommission(e.target.value)}>
          <option value="">Any Commission</option>
          <option value="5">5% or more</option>
          <option value="10">10% or more</option>
        </select>
      </div>
      <div className="space-y-4">
        {isLoading ? (
          <Card className="p-4 text-center">Loading products...</Card>
        ) : filteredProducts.length === 0 ? (
          <Card className="p-4 text-center">No products found for your filters.</Card>
        ) : (
          // We now map over the `filteredProducts` array
          filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl shadow-sm flex p-4 items-center">
              <div className="flex flex-col items-center space-y-2 mr-4 flex-shrink-0">
                <img src={product.images?.[0]?.path_url || 'https://placehold.co/80x80'} alt={product.name} className="h-20 w-20 rounded-lg object-cover" />
                <div className="flex items-center space-x-1">
                  <img src={product.store?.profile_image_url || 'https://placehold.co/20x20'} className="h-5 w-5 rounded-full" alt={product.store?.store_name} />
                  <span className="text-xs font-medium" style={{ color: brandColor }}>{product.store?.store_name}</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-lg truncate">{product.name}</p>
                <p className="font-semibold mt-1" style={{ color: brandColor }}>₦{Intl.NumberFormat().format(product.price)}</p>
                <p className="text-gray-500 mt-2">Commission: <span className="text-black font-medium">{product.commission ? `${product.commission}%` : 'N/A'}</span></p>
              </div>
              <button
                onClick={() => handleCopyLink(product.id)}
                className="text-sm font-medium py-2 px-4 rounded-md ml-4 flex-shrink-0"
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