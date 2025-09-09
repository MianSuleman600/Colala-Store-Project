import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

import ProductDisplayCard from '../../../components/products/ProductDisplayCard.jsx';
import ProductStatModal from '../../../components/products/ProductStatModal.jsx';
import MoreOptionsPopover from '../../../components/products/MoreOptionsPopover.jsx';
import BoostAdModal from '../../../components/products/BoostAdModal.jsx';
import MyServicesPage from '../../../features/services/pages/MyServicesPage.jsx';

import Button from '../../../components/ui/Button';
import { PlusIcon } from '@heroicons/react/24/outline';

import { useStoreProfile } from '../../../services/queries/storeProfileQuery';
import { useGetMyProductsQuery } from '../../../services/queries/useproductsQuery.js';
import { useUpdateProduct, useDeleteProduct } from '../../../services/mutations/useProductMutation.js';

import { getLightBrandColor, getContrastTextColor } from '../../../utils/colorUtils.js';
import { useToast } from '../../../components/ui/ToastProvider';

const MyProductsPage = ({ showAddProductButton = true }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { push } = useToast();

  const userId = useSelector((state) => state.user.userId);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  // Brand/theme
  const { data: storeProfile, error: profileError } = useStoreProfile(userId, {
    enabled: isLoggedIn && !!userId,
  });

  // Products (already normalized in the query)
  const {
    data: products = [],
    error: productsError,
    isLoading: productsLoading,
  } = useGetMyProductsQuery(userId, { enabled: isLoggedIn && !!userId });

  // Surface errors via toast
  useEffect(() => {
    if (profileError) push('Failed to load store profile.', { type: 'error' });
    if (productsError) push('Failed to load your products.', { type: 'error' });
  }, [profileError, productsError, push]);

  // Theme colors
  const brandColor = useMemo(() => storeProfile?.brandColor || '#EF4444', [storeProfile]);
  const contrastTextColor = useMemo(() => getContrastTextColor(brandColor), [brandColor]);
  const lightBrandColor = useMemo(() => getLightBrandColor(brandColor, 30), [brandColor]);

  // Tabs & modals
  const [selectedMainTab, setSelectedMainTab] = useState('products');
  const [productFilterTab, setProductFilterTab] = useState('All');

  const [showProductStatModal, setShowProductStatModal] = useState(false);
  const [selectedProductStats, setSelectedProductStats] = useState(null);

  const [showBoostAdModal, setShowBoostAdModal] = useState(false);
  const [selectedProductForBoost, setSelectedProductForBoost] = useState(null);

  const [showMoreOptionsPopover, setShowMoreOptionsPopover] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
  const [selectedProductForOptions, setSelectedProductForOptions] = useState(null);

  // Mutations with toasts
  const updateProductMutation = useUpdateProduct({
    onSuccess: () => push('Product updated.', { type: 'success' }),
    onError: (err) => push(err?.message || 'Error updating product.', { type: 'error' }),
  });

  const deleteProductMutation = useDeleteProduct({
    onSuccess: () => push('Product deleted.', { type: 'success' }),
    onError: (err) => push(err?.message || 'Error deleting product.', { type: 'error' }),
  });

  // Filtered products
  const filteredProducts = useMemo(() => {
    return (products || []).filter((product) => {
      if (productFilterTab === 'All') return true;
      if (productFilterTab === 'Sponsored') return Boolean(product.isSponsored);
      if (productFilterTab === 'Out of Stock') {
        return product.status === 'Sold Out' || product.status === 'Unavailable';
      }
      return true;
    });
  }, [products, productFilterTab]);

  // Modal handlers
  const handleCloseProductStatModal = () => {
    setShowProductStatModal(false);
    setSelectedProductStats(null);
  };

  const handleCloseBoostAdModal = () => {
    setShowBoostAdModal(false);
    setSelectedProductForBoost(null);
  };

  const handleProceedBoostAd = () => {
    if (selectedProductForBoost) {
      navigate(`/my-products/${selectedProductForBoost}/boost-setup`);
    }
    handleCloseBoostAdModal();
  };

  const handleAddProductClick = () => navigate('/add-product');

  const handleMoreOptionsClick = (event, productId) => {
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
    setPopoverPosition({
      top: rect.bottom + window.scrollY + 5,
      left: Math.max(8, rect.right + window.scrollX - 192),
    });
    setSelectedProductForOptions(productId);
    setShowMoreOptionsPopover(true);
  };

  const handleProductStatClick = (productId) => {
    const product = (products || []).find((p) => p.id === productId);
    if (!product) {
      push('Product not found.', { type: 'error' });
      setShowMoreOptionsPopover(false);
      return;
    }

    setSelectedProductStats({
      productId: product.id,
      productName: product.name ?? 'Unnamed Product',
      views: product.metrics?.productViews ?? 0,
      clicks: product.metrics?.productClicks ?? 0,
      messages: product.metrics?.messages ?? 0,
      inCart: product.metrics?.inCart ?? 0,
      completedOrders: product.metrics?.completedOrders ?? 0,
      impressions: product.metrics?.impressions ?? 0,
      profileClicks: product.metrics?.profileClicks ?? 0,
      chats: product.metrics?.chats ?? 0,
      noClicks: product.metrics?.noClicks ?? 0,
      estimatedReach: product.metrics?.estimatedReach ?? 'N/A',
      estimatedProductClicks: product.metrics?.estimatedProductClicks ?? 0,
      spendingWalletBalance: product.metrics?.spendingWalletBalance ?? 0,
      chartData: product.chartData ?? [],
      name: product.name,
    });

    setShowProductStatModal(true);
    setShowMoreOptionsPopover(false);
  };

  const handleBoostProduct = (productId) => {
    setSelectedProductForBoost(productId);
    setShowBoostAdModal(true);
    setShowMoreOptionsPopover(false);
  };

  // Product actions (optimistic updates using React Query cache)
  const handleMarkAsSold = (productId) => {
    queryClient.setQueryData(['myProducts', userId || 'anonymous'], (old = []) =>
      old.map((p) => (p.id === productId ? { ...p, status: 'Sold Out' } : p))
    );
    updateProductMutation.mutate(
      { id: productId, payload: { status: 'Sold Out' } },
      {
        onError: () => queryClient.invalidateQueries({ queryKey: ['myProducts', userId || 'anonymous'] }),
      }
    );
    setShowMoreOptionsPopover(false);
  };

  const handleMarkAsUnavailable = (productId) => {
    queryClient.setQueryData(['myProducts', userId || 'anonymous'], (old = []) =>
      old.map((p) => (p.id === productId ? { ...p, status: 'Unavailable' } : p))
    );
    updateProductMutation.mutate(
      { id: productId, payload: { status: 'Unavailable' } },
      {
        onError: () => queryClient.invalidateQueries({ queryKey: ['myProducts', userId || 'anonymous'] }),
      }
    );
    setShowMoreOptionsPopover(false);
  };

  const handleDeleteProduct = (productId) => {
    if (!productId) {
      push('Invalid product id.', { type: 'error' });
      return;
    }
    if (window.confirm('Are you sure you want to delete this product?')) {
      const prev = queryClient.getQueryData(['myProducts', userId || 'anonymous']) || [];
      queryClient.setQueryData(['myProducts', userId || 'anonymous'], (curr = []) =>
        curr.filter((p) => p.id !== productId)
      );
      deleteProductMutation.mutate(productId, {
        onError: () => queryClient.setQueryData(['myProducts', userId || 'anonymous'], prev),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['myProducts', userId || 'anonymous'] }),
      });
    }
    setShowMoreOptionsPopover(false);
  };

  const handleEditProduct = (productId) => navigate(`/my-products/${productId}/details`);

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] text-gray-600">
        <p className="text-lg mb-4">Please log in to view your products.</p>
        <Button
          onClick={() => navigate('/login')}
          style={{ backgroundColor: brandColor, color: contrastTextColor }}
          className="py-2 px-6 rounded-lg font-semibold"
        >
          Login Now
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Product/Services</h2>

      {/* Main Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        {['products', 'services'].map((tab) => {
          const active = selectedMainTab === tab;
          return (
            <button
              key={tab}
              type="button"
              className={`py-2 px-4 text-lg font-medium ${active ? 'border-b-2' : 'text-gray-500 hover:text-gray-700'}`}
              style={active ? { borderColor: brandColor, color: brandColor } : {}}
              onClick={() => setSelectedMainTab(tab)}
              aria-pressed={active}
            >
              {tab === 'products' ? 'My Products' : 'My Services'}
            </button>
          );
        })}
      </div>

      {selectedMainTab === 'products' ? (
        <>
          {/* Add Product Button */}
          {showAddProductButton && (
            <div className="flex w-full justify-end mb-6">
              <Button
                onClick={handleAddProductClick}
                style={{ backgroundColor: brandColor, color: contrastTextColor }}
                className="py-2 px-6 rounded-lg w-full sm:w-auto font-semibold flex items-center shadow-md hover:shadow-lg transition-shadow"
              >
                <PlusIcon className="h-5 w-5 mr-2" /> Add New Product
              </Button>
            </div>
          )}

          {/* Filter Tabs */}
          <div className="flex space-x-4 mb-6">
            {['All', 'Sponsored', 'Out of Stock'].map((tab) => {
              const isActive = productFilterTab === tab;
              return (
                <Button
                  key={tab}
                  onClick={() => setProductFilterTab(tab)}
                  className={`py-2 px-4 rounded-lg font-semibold transition-colors duration-200 ${isActive ? 'shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  style={isActive ? { backgroundColor: brandColor, color: contrastTextColor } : {}}
                >
                  {tab}
                </Button>
              );
            })}
          </div>

          {/* Product List */}
          {productsLoading ? (
            <div className="text-center py-12 text-gray-500">Loading products...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <p className="text-lg text-gray-600 mb-4">
                No products found for this filter.
                {productFilterTab === 'All' && ' Click "Add Your First Product" to get started!'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductDisplayCard
                  key={product.id}
                  product={product}
                  brandColor={brandColor}
                  contrastTextColor={contrastTextColor}
                  lightBrandColor={lightBrandColor}
                  mode="default"
                  onEdit={() => handleEditProduct(product.id)}
                  onMoreOptionsClick={handleMoreOptionsClick}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <MyServicesPage />
      )}

      {/* Modals */}
      {showProductStatModal && selectedProductStats && (
        <ProductStatModal
          isOpen={showProductStatModal}
          onClose={handleCloseProductStatModal}
          productStats={selectedProductStats}
          brandColor={brandColor}
        />
      )}

      {showBoostAdModal && (
        <BoostAdModal
          isOpen={showBoostAdModal}
          onClose={handleCloseBoostAdModal}
          onProceed={handleProceedBoostAd}
          brandColor={brandColor}
          contrastTextColor={contrastTextColor}
        />
      )}

      {showMoreOptionsPopover && selectedProductForOptions && (
        <MoreOptionsPopover
          isOpen={showMoreOptionsPopover}
          onClose={() => setShowMoreOptionsPopover(false)}
          position={popoverPosition}
          productId={selectedProductForOptions}
          onProductStatClick={handleProductStatClick}
          onMarkAsSold={handleMarkAsSold}
          onMarkAsUnavailable={handleMarkAsUnavailable}
          onBoostProduct={handleBoostProduct}
          onDeleteProduct={handleDeleteProduct}
        />
      )}
    </div>
  );
};

export default MyProductsPage;