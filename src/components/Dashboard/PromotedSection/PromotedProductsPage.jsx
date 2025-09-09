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

import {
  useGetMyPromotionsQuery,
} from '../../../services/queries/usePromotionsQuery.js';
import {
  useExtendPromotion,
  usePausePromotion,
  useDeletePromotion,
} from '../../../services/mutations/usePromotionMutation.js';

const PromotedProductsPage = () => {
  const { push } = useToast();
  const { userId, isLoggedIn } = useSelector((s) => s.user);

  const { data: storeProfile } = useStoreProfile(userId, {
    enabled: isLoggedIn && !!userId,
  });
  const brandColor = useMemo(() => storeProfile?.brandColor || '#EF4444', [storeProfile]);
  const contrastTextColor = useMemo(() => getContrastTextColor(brandColor), [brandColor]);

  // Fetch promotions for this user
  const {
    data: promotions = [],
    isLoading,
    isError,
  } = useGetMyPromotionsQuery(userId, {}, { enabled: isLoggedIn && !!userId });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedPromotedProductId, setSelectedPromotedProductId] = useState(null);

  const categories = useMemo(
    () => ['All Categories', ...Array.from(new Set((promotions || []).map((p) => p.category).filter(Boolean)))],
    [promotions]
  );

  const filteredProducts = useMemo(() => {
    const s = searchTerm.trim().toLowerCase();
    const c = selectedCategory;
    return (promotions || []).filter((p) => {
      const matchesSearch = !s || (p.name || '').toLowerCase().includes(s);
      const matchesCategory = c === 'All Categories' || p.category === c;
      return matchesSearch && matchesCategory;
    });
  }, [promotions, searchTerm, selectedCategory]);

  const productToDisplay = useMemo(
    () => (promotions || []).find((p) => p.id === selectedPromotedProductId) || null,
    [promotions, selectedPromotedProductId]
  );

  const handleViewDetails = (product) => {
    if (!product?.id) {
      push('Invalid product.', { type: 'error' });
      return;
    }
    setSelectedPromotedProductId(product.id);
  };
  const handleBackToPromotedList = () => setSelectedPromotedProductId(null);

  // Extend modal
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [extendTarget, setExtendTarget] = useState(null);

  const openExtend = (product) => {
    setExtendTarget(product);
    setShowExtendModal(true);
  };
  const closeExtend = () => {
    setShowExtendModal(false);
    setExtendTarget(null);
  };

  // Mutations
  const extendMutation = useExtendPromotion(userId, {
    onSuccess: () => push('Promotion extended successfully.', { type: 'success' }),
    onError: (e) => push(e?.message || 'Failed to extend promotion.', { type: 'error' }),
  });

  const pauseMutation = usePausePromotion(userId, {
    onSuccess: () => push('Promotion paused.', { type: 'info' }),
    onError: (e) => push(e?.message || 'Failed to pause promotion.', { type: 'error' }),
  });

  const deleteMutation = useDeletePromotion(userId, {
    onSuccess: () => push('Promotion deleted.', { type: 'success' }),
    onError: (e) => push(e?.message || 'Failed to delete promotion.', { type: 'error' }),
  });

  const onExtendConfirm = ({ dailyBudget, durationDays }) => {
    if (!extendTarget?.id) return;
    extendMutation.mutate({ id: extendTarget.id, dailyBudget, durationDays });
    closeExtend();
  };

  const onHidePromotion = (product) => {
    if (!product?.id) return;
    pauseMutation.mutate(product.id);
  };

  const onDeletePromotion = (product) => {
    if (!product?.id) return;
    if (!window.confirm(`Delete promotion for "${product.name}"?`)) return;
    deleteMutation.mutate(product.id);
    setSelectedPromotedProductId(null);
  };

  const onAttachment = () => {
    push('Open attachments (not implemented).', { type: 'info' });
  };

  return (
    <div className="p-4 md:p-6">
      <ScrollToTop />

      {selectedPromotedProductId && productToDisplay ? (
        <div className="flex items-center mb-6">
          <button
            onClick={handleBackToPromotedList}
            className="text-gray-600 hover:text-gray-900 mr-3"
            aria-label="Back to promoted products"
            type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0 7-7m-7 7h18" />
            </svg>
          </button>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            {productToDisplay.name} / <span style={{ color: brandColor }}>Promotion details</span>
          </h2>
        </div>
      ) : (
        <h2 className="text-3xl text-gray-800 mb-6">Promoted Products</h2>
      )}

      {selectedPromotedProductId && productToDisplay ? (
        <PromotedProductDetails
          product={productToDisplay}
          brandColor={brandColor}
          contrastTextColor={contrastTextColor}
          onExtend={() => openExtend(productToDisplay)}
          onHide={() => onHidePromotion(productToDisplay)}
          onDelete={() => onDeletePromotion(productToDisplay)}
          onAttachment={onAttachment}
        />
      ) : (
        <>
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search products"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search promoted products"
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

          {isLoading ? (
            <div className="text-center py-12 text-gray-500">Loading promoted products...</div>
          ) : isError ? (
            <div className="text-center py-12 text-red-600">Failed to load promoted products.</div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <p className="text-lg text-gray-600">No promoted products found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <PromotedProductCard
                  key={product.id}
                  product={product}
                  brandColor={brandColor}
                  contrastTextColor={contrastTextColor}
                  onViewDetailsClick={handleViewDetails}
                />
              ))}
            </div>
          )}
        </>
      )}

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