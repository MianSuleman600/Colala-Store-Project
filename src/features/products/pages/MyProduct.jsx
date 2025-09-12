// src/pages/.../MyProductsPage.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
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

const normalizeStatus = (s) => {
  const raw = String(s || '').trim().toLowerCase();
  if (raw === 'available' || raw === 'active') return 'available';
  if (['sold', 'sold out', 'out of stock', 'oos'].includes(raw)) return 'sold';
  if (raw === 'unavailable' || raw === 'inactive') return 'unavailable';
  return 'available';
};

const MyProductsPage = ({ showAddProductButton = true, gridVariant = 'home' }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { push } = useToast();

  const userId = useSelector((state) => state.user.userId);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  // Brand/theme
  const { data: storeProfile, error: profileError } = useStoreProfile(userId, {
    enabled: isLoggedIn && !!userId,
  });

  // Products
  const {
    data: products = [],
    error: productsError,
    isLoading: productsLoading,
  } = useGetMyProductsQuery(userId, { enabled: isLoggedIn && !!userId });

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

  // Mutations with toasts (PASS userId!)
  const updateProductMutation = useUpdateProduct(userId, {
    onSuccess: () => push('Product updated.', { type: 'success' }),
    onError: (err) => push(err?.message || 'Error updating product.', { type: 'error' }),
  });

  const deleteProductMutation = useDeleteProduct(userId, {
    onSuccess: () => push('Product deleted.', { type: 'success' }),
    onError: (err) => push(err?.message || 'Error deleting product.', { type: 'error' }),
  });

  // Filtered products
  const filteredProducts = useMemo(() => {
    return (products || []).filter((product) => {
      if (productFilterTab === 'All') return true;
      if (productFilterTab === 'Sponsored') return Boolean(product.isSponsored);
      if (productFilterTab === 'Out of Stock') {
        const ns = normalizeStatus(product.status);
        return ns === 'sold' || ns === 'unavailable';
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
    if (selectedProductForBoost) navigate(`/my-products/${selectedProductForBoost}/boost-setup`);
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
    metrics: product.metrics ?? {},
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

  // Product actions (optimistic updates + API patch)
  const cacheKey = ['myProducts', userId || 'anonymous'];

  const handleMarkAsSold = (productId) => {
    // optimistic
    queryClient.setQueryData(cacheKey, (old = []) =>
      old.map((p) => (p.id === productId ? { ...p, status: 'sold' } : p))
    );
    // patch
    updateProductMutation.mutate(
      { id: productId, payload: { status: 'sold' } },
      {
        onError: () => queryClient.invalidateQueries({ queryKey: cacheKey }),
      }
    );
    setShowMoreOptionsPopover(false);
  };

  const handleMarkAsUnavailable = (productId) => {
    queryClient.setQueryData(cacheKey, (old = []) =>
      old.map((p) => (p.id === productId ? { ...p, status: 'unavailable' } : p))
    );
    updateProductMutation.mutate(
      { id: productId, payload: { status: 'unavailable' } },
      {
        onError: () => queryClient.invalidateQueries({ queryKey: cacheKey }),
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
      const prev = queryClient.getQueryData(cacheKey) || [];
      queryClient.setQueryData(cacheKey, (curr = []) => curr.filter((p) => p.id !== productId));
      deleteProductMutation.mutate(productId, {
        onError: () => queryClient.setQueryData(cacheKey, prev),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: cacheKey }),
      });
    }
    setShowMoreOptionsPopover(false);
  };

  const handleEditProduct = (productId) => navigate(`/my-products/${productId}/details`);

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-[calc(100vh-100px)] flex-col items-center justify-center text-gray-600">
        <p className="mb-4 text-lg">Please log in to view your products.</p>
        <Button
          onClick={() => navigate('/login')}
          style={{ backgroundColor: brandColor, color: contrastTextColor }}
          className="rounded-lg py-2 px-6 font-semibold"
        >
          Login Now
        </Button>
      </div>
    );
  }

  const gridClasses =
    gridVariant === 'sidebar'
      ? 'grid items-stretch grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3'
      : 'grid items-stretch grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5';

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h2 className="mb-6 text-2xl font-bold text-gray-800">My Product/Services</h2>

      {/* Main Tabs */}
      <div className="mb-6 flex border-b border-gray-200">
        {['products', 'services'].map((tab) => {
          const active = selectedMainTab === tab;
          return (
            <button
              key={tab}
              type="button"
              className={`px-4 py-2 text-lg font-medium ${active ? 'border-b-2' : 'text-gray-500 hover:text-gray-700'}`}
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
          {showAddProductButton && (
            <div className="mb-6 flex w-full justify-end">
              <Button
                onClick={handleAddProductClick}
                style={{ backgroundColor: brandColor, color: contrastTextColor }}
                className="flex w-full items-center rounded-lg py-2 px-6 font-semibold shadow-md transition-shadow hover:shadow-lg sm:w-auto"
              >
                <PlusIcon className="mr-2 h-5 w-5" /> Add New Product
              </Button>
            </div>
          )}

          {/* Filter Tabs */}
          <div className="mb-6 flex space-x-4">
            {['All', 'Sponsored', 'Out of Stock'].map((tab) => {
              const isActive = productFilterTab === tab;
              return (
                <Button
                  key={tab}
                  onClick={() => setProductFilterTab(tab)}
                  className={`rounded-lg py-2 px-4 font-semibold transition-colors duration-200 ${
                    isActive ? 'shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  style={isActive ? { backgroundColor: brandColor, color: contrastTextColor } : {}}
                >
                  {tab}
                </Button>
              );
            })}
          </div>

          {/* Product List */}
          {productsLoading ? (
            <div className="py-12 text-center text-gray-500">Loading products...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="rounded-lg bg-white py-12 text-center shadow-md">
              <p className="mb-4 text-lg text-gray-600">
                No products found for this filter.
                {productFilterTab === 'All' && ' Click "Add New Product" to get started!'}
              </p>
            </div>
          ) : (
            <div className={gridClasses}>
              {filteredProducts.map((product) => (
                <ProductDisplayCard
                  key={product.id}
                  item={product}
                  brandColor={brandColor}
                  contrastTextColor={contrastTextColor}
                  mode={productFilterTab === 'Sponsored' ? 'sponsored' : 'product'}
                  onEdit={() => handleEditProduct(product.id)}
                  onMoreOptionsClick={handleMoreOptionsClick}
                  onViewDetailsClick={() => handleProductStatClick(product.id)}
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