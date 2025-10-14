// src/features/products/pages/PromotedProductsPage.jsx
import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import PromotedProductCard from '../../../components/Dashboard/PromotedSection/PromotedProductCard';
import ExtendPromotionModal from '../../../components/Dashboard/PromotedSection/ExtendPromotionModal';
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import ScrollToTop from '../../../components/ui/ScrollToTop';
import { useStoreProfile } from '../../../services/queries/storeProfileQuery';
import { useToast } from '../../../components/ui/ToastProvider';
import { getContrastTextColor } from '../../../utils/colorUtils';
import PromotedProductDetails from './PromotedProductDetails';

import { useBoostsQuery } from '../../../services/queries/useBoostsQuery.js';
import {
  useExtendBoostMutation,
  usePauseBoostMutation,
  useDeleteBoostMutation,
} from '../../../services/mutations/useBoostMutation.js';

const PromotedProductsPage = () => {
  const { push } = useToast();
  const { userId, isLoggedIn } = useSelector((s) => s.user);

  // --- Theme (Brand colors)
  const { data: storeProfile } = useStoreProfile(userId, {
    enabled: isLoggedIn && !!userId,
  });
  const brandColor = useMemo(() => storeProfile?.brandColor || '#EF4444', [storeProfile]);
  const contrastTextColor = useMemo(() => getContrastTextColor(brandColor), [brandColor]);

  // --- Fetch all boosts (promoted products)
  const {
    data: boostsResponse,
    isLoading,
    isError,
  } = useBoostsQuery({ enabled: isLoggedIn && !!userId });

  // ✅ Safely extract array of boosts from API response
  const boosts = useMemo(() => {
    if (boostsResponse?.status === 'success' && Array.isArray(boostsResponse.data)) {
      return boostsResponse.data;
    }
    return boostsResponse?.data || [];
  }, [boostsResponse]);

  // --- Filters & local state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedBoostId, setSelectedBoostId] = useState(null);

  // ✅ Extract categories (use product name/category safely)
  const categories = useMemo(() => {
    return ['All Categories', ...Array.from(new Set(
      (boosts || [])
        .map((b) => b.product?.category || null)
        .filter(Boolean)
    ))];
  }, [boosts]);

  // ✅ Filter logic
  const filteredBoosts = useMemo(() => {
    const s = searchTerm.trim().toLowerCase();
    const c = selectedCategory;
    return (boosts || []).filter((b) => {
      const productName = b.product?.name || '';
      const matchesSearch = !s || productName.toLowerCase().includes(s);
      const matchesCategory = c === 'All Categories' || b.product?.category === c;
      return matchesSearch && matchesCategory;
    });
  }, [boosts, searchTerm, selectedCategory]);

  // ✅ Selected boost
  const boostToDisplay = useMemo(
    () => (boosts || []).find((b) => b.id === selectedBoostId) || null,
    [boosts, selectedBoostId]
  );

  // ✅ Normalize selected boost into details-friendly product shape
  const detailsProduct = useMemo(() => {
    if (!boostToDisplay) return null;
    const p = boostToDisplay.product || {};
    const firstImage = p.images?.[0]?.url || p.images?.[0]?.path_url || p.imageUrl || null;
    return {
      id: p.id,
      name: p.name || 'Untitled Item',
      imageUrl: firstImage || null,
      price: Number.isFinite(Number(p.price)) ? Number(p.price) : 0,
      discountPrice: Number.isFinite(Number(p.discount_price)) ? Number(p.discount_price) : null,
      finalPrice: Number.isFinite(Number(p.final_price)) ? Number(p.final_price) : null,
      isSponsored: true,
      // Map boost campaign metrics/details for display
      promotionDetails: {
        status: boostToDisplay.status || 'running',
        paymentStatus: boostToDisplay.payment_status,
        paymentMethod: boostToDisplay.payment_method,
        durationDays: boostToDisplay.duration,
        budgetDaily: boostToDisplay.budget,
        totalAmount: boostToDisplay.total_amount,
        reach: boostToDisplay.reach,
        impressions: boostToDisplay.impressions,
        clicks: boostToDisplay.clicks,
        costPerClick: boostToDisplay.cpc,
        startDate: boostToDisplay.start_date,
        createdAt: boostToDisplay.created_at,
      },
      // convenience
      location: boostToDisplay.location || p.location,
    };
  }, [boostToDisplay]);

  // --- Navigation handlers
  const handleViewDetails = (boost) => {
    if (!boost?.id) {
      push('Invalid product.', { type: 'error' });
      return;
    }
    setSelectedBoostId(boost.id);
  };
  const handleBackToList = () => setSelectedBoostId(null);

  // --- Extend Modal
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [extendTarget, setExtendTarget] = useState(null);
  const openExtend = (boost) => {
    setExtendTarget(boost);
    setShowExtendModal(true);
  };
  const closeExtend = () => {
    setShowExtendModal(false);
    setExtendTarget(null);
  };

  // --- Mutations
  const extendMutation = useExtendBoostMutation({
    onSuccess: () => push('Boost extended successfully.', { type: 'success' }),
    onError: (e) => push(e?.message || 'Failed to extend boost.', { type: 'error' }),
  });

  const pauseMutation = usePauseBoostMutation({
    onSuccess: () => push('Boost paused.', { type: 'info' }),
    onError: (e) => push(e?.message || 'Failed to pause boost.', { type: 'error' }),
  });

  const deleteMutation = useDeleteBoostMutation({
    onSuccess: () => push('Boost deleted.', { type: 'success' }),
    onError: (e) => push(e?.message || 'Failed to delete boost.', { type: 'error' }),
  });

  // --- Handlers
  const onExtendConfirm = ({ dailyBudget, durationDays }) => {
    if (!extendTarget?.id) return;
    extendMutation.mutate({ id: extendTarget.id, dailyBudget, durationDays });
    closeExtend();
  };

  const onHideBoost = (boost) => {
    if (!boost?.id) return;
    pauseMutation.mutate(boost.id);
  };

  const onDeleteBoost = (boost) => {
    if (!boost?.id) return;
    if (!window.confirm(`Delete boost for "${boost.product?.name}"?`)) return;
    deleteMutation.mutate(boost.id);
    setSelectedBoostId(null);
  };

  const onAttachment = () => push('Open attachments (not implemented).', { type: 'info' });

  // --- Render
  return (
    <div className="p-4 md:p-6">
      <ScrollToTop />

      {selectedBoostId && boostToDisplay ? (
        <div className="flex items-center mb-6">
          <button
            onClick={handleBackToList}
            className="text-gray-600 hover:text-gray-900 mr-3"
            aria-label="Back to boosted products"
            type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0 7-7m-7 7h18" />
            </svg>
          </button>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            {boostToDisplay.product?.name} / <span style={{ color: brandColor }}>Boost Details</span>
          </h2>
        </div>
      ) : (
        <h2 className="text-3xl text-gray-800 mb-6">Promoted Products</h2>
      )}

      {selectedBoostId && boostToDisplay ? (
        <PromotedProductDetails
          product={detailsProduct}
          brandColor={brandColor}
          contrastTextColor={contrastTextColor}
          onExtend={() => openExtend(boostToDisplay)}
          onHide={() => onHideBoost(boostToDisplay)}
          onDelete={() => onDeleteBoost(boostToDisplay)}
          onAttachment={onAttachment}
        />
      ) : (
        <>
          {/* Search + Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search products"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search boosted products"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>

            <div className="relative sm:w-1/3 lg:w-1/4">
              <select
                className="block w-full pl-4 pr-10 py-3 text-base border border-gray-300 rounded-xl bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 appearance-none shadow-sm"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                aria-label="Filter by category"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
              </div>
            </div>
          </div>

          {/* Results */}
          {isLoading ? (
            <div className="text-center py-12 text-gray-500">Loading boosted products...</div>
          ) : isError ? (
            <div className="text-center py-12 text-red-600">Failed to load boosted products.</div>
          ) : filteredBoosts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <p className="text-lg text-gray-600">No boosted products found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBoosts.map((boost) => (
                <PromotedProductCard
                  key={boost.id}
                  product={boost.product}
                  boost={boost}
                  brandColor={brandColor}
                  contrastTextColor={contrastTextColor}
                  onViewDetailsClick={handleViewDetails}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Extend Modal */}
      {showExtendModal && extendTarget && (
        <ExtendPromotionModal
          isOpen={showExtendModal}
          onClose={closeExtend}
          onConfirm={onExtendConfirm}
          product={extendTarget}
          brandColor={brandColor}
          contrastTextColor={contrastTextColor}
        />
      )}
    </div>
  );
};

export default PromotedProductsPage;
