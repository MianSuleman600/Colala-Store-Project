// src/pages/products/MyProductsPage.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// UI Components
import ProductDisplayCard from '../../../components/products/ProductDisplayCard.jsx';
import ProductStatModal from '../../../components/products/ProductStatModal.jsx';
import MoreOptionsPopover from '../../../components/products/MoreOptionsPopover.jsx';
import BoostAdModal from '../../../components/products/BoostAdModal.jsx';
import MyServicesPage from '../../../features/services/pages/MyServicesPage.jsx';
import Button from '../../../components/ui/Button';
import { useToast } from '../../../components/ui/ToastProvider';
import { PlusIcon } from '@heroicons/react/24/outline';

// React Query Hooks
import { useGetMyProductsQuery } from '../../../services/queries/useproductsQuery.js';
import { useDeleteProductMutation, useMarkProductStatusMutation } from '../../../services/mutations/useProductMutation.js';

// Utils
import { getContrastTextColor } from '../../../utils/colorUtils.js';

// Helper to standardize product status strings
const normalizeStatus = (s) => {
  const raw = String(s || '').trim().toLowerCase();
  if (raw === 'available' || raw === 'active') return 'available';
  if (['sold', 'sold out', 'out of stock', 'oos'].includes(raw)) return 'sold';
  if (raw === 'unavailable' || raw === 'inactive') return 'unavailable';
  return 'available';
};

const MyProductsPage = ({ showAddProductButton = true, gridVariant = 'home' }) => {
  const navigate = useNavigate();
  const { push } = useToast();

  // --- 1. Data and State Management ---
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const userId = user?.id;

  // Data Fetching
  const {
    data: products = [],
    error: productsError,
    isLoading: productsLoading,
  } = useGetMyProductsQuery(userId, { enabled: isAuthenticated && !!userId });

  // Mutations
  const deleteProductMutation = useDeleteProductMutation({
    userId,
    onSuccess: () => push('Product deleted.', { type: 'success' }),
    onError: (err) => push(err?.message || 'Error deleting product.', { type: 'error' }),
  });

  const markStatusMutation = useMarkProductStatusMutation({
    userId,
    onSuccess: () => push('Product status updated.', { type: 'success' }),
    onError: (err) => push(err?.message || 'Error updating status.', { type: 'error' }),
  });

  // Get mutation loading state to provide targeted feedback on the specific card being updated
  const { isLoading: isStatusUpdating, variables: statusUpdateVars } = markStatusMutation;

  // Local UI State
  const [selectedMainTab, setSelectedMainTab] = useState('products');
  const [productFilterTab, setProductFilterTab] = useState('All');
  const [showProductStatModal, setShowProductStatModal] = useState(false);
  const [selectedProductIdForStats, setSelectedProductIdForStats] = useState(null);
  const [showBoostAdModal, setShowBoostAdModal] = useState(false);
  const [selectedProductForBoost, setSelectedProductForBoost] = useState(null);
  const [showMoreOptionsPopover, setShowMoreOptionsPopover] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
  const [selectedProductForOptions, setSelectedProductForOptions] = useState(null);

  // Derived State
  const brandColor = useMemo(() => user?.store?.theme_color || '#EF4444', [user]);
  const contrastTextColor = useMemo(() => getContrastTextColor(brandColor), [brandColor]);

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

  // --- 2. Effects ---
  useEffect(() => {
    if (productsError) {
      push('Failed to load your products.', { type: 'error' });
    }
  }, [productsError, push]);

  // --- 3. Event Handlers ---
  const handleAddProductClick = () => navigate('/add-product');
  const handleEditProduct = (productId) => navigate(`/my-products/${productId}/edit`);

  const handleMoreOptionsClick = (event, product) => {
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
    setPopoverPosition({
      top: rect.bottom + window.scrollY + 5,
      left: Math.max(8, rect.right + window.scrollX - 208), // Popover width approx 208px
    });
    setSelectedProductForOptions(product);
    setShowMoreOptionsPopover(true);
  };

  const handleProductStatClick = (productId) => {
    setSelectedProductIdForStats(productId);
    setShowProductStatModal(true);
    setShowMoreOptionsPopover(false);
  };

  const handleBoostProduct = (product) => {
    setSelectedProductForBoost(product);
    setShowBoostAdModal(true);
    setShowMoreOptionsPopover(false);
  };

  const handleProceedBoostAd = () => {
    if (selectedProductForBoost) navigate(`/my-products/${selectedProductForBoost.id}/boost-setup`);
    setShowBoostAdModal(false);
    setSelectedProductForBoost(null);
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProductMutation.mutate(productId);
    }
    setShowMoreOptionsPopover(false);
  };

  const handleMarkAsSold = (productId) => {
    markStatusMutation.mutate({ productId, status: 'sold' });
    setShowMoreOptionsPopover(false);
  };

  const handleMarkAsUnavailable = (productId) => {
    markStatusMutation.mutate({ productId, status: 'unavailable' });
    setShowMoreOptionsPopover(false);
  };

  const handleMarkAsAvailable = (productId) => {
    markStatusMutation.mutate({ productId, status: 'available' });
    setShowMoreOptionsPopover(false);
  };

  // --- 4. Render Logic ---
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[calc(100vh-100px)] flex-col items-center justify-center text-gray-600">
        <p className="mb-4 text-lg">Please log in to view your products.</p>
        <Button onClick={() => navigate('/login')} style={{ backgroundColor: brandColor, color: contrastTextColor }} className="rounded-lg py-2 px-6 font-semibold">
          Login Now
        </Button>
      </div>
    );
  }

  const gridClasses =
    gridVariant === 'sidebar'
      ? 'grid items-stretch grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3'
      // Default 'home' grid
      : 'grid items-stretch grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5';

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h2 className="mb-6 text-2xl font-bold text-gray-800">My Product/Services</h2>

      {/* Main Tabs (Products/Services) */}
      <div className="mb-6 flex border-b border-gray-200">
        {['products', 'services'].map((tab) => {
          const active = selectedMainTab === tab;
          return (
            <button key={tab} type="button" className={`px-4 py-2 text-lg font-medium capitalize ${active ? 'border-b-2' : 'text-gray-500 hover:text-gray-700'}`} style={active ? { borderColor: brandColor, color: brandColor } : {}} onClick={() => setSelectedMainTab(tab)} aria-pressed={active}>
              {tab === 'products' ? 'My Products' : 'My Services'}
            </button>
          );
        })}
      </div>

      {selectedMainTab === 'products' ? (
        <>
          {showAddProductButton && (
            <div className="mb-6 flex w-full justify-end">
              <Button onClick={handleAddProductClick} style={{ backgroundColor: brandColor, color: contrastTextColor }} className="flex w-full items-center rounded-lg py-2 px-6 font-semibold shadow-md transition-shadow hover:shadow-lg sm:w-auto">
                <PlusIcon className="mr-2 h-5 w-5" /> Add New Product
              </Button>
            </div>
          )}

          {/* Product Filter Tabs */}
          <div className="mb-6 flex flex-wrap gap-2">
            {['All', 'Sponsored', 'Out of Stock'].map((tab) => {
              const isActive = productFilterTab === tab;
              return (
                <Button key={tab} onClick={() => setProductFilterTab(tab)} className={`rounded-lg py-2 px-4 font-semibold transition-colors duration-200 ${isActive ? 'shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`} style={isActive ? { backgroundColor: brandColor, color: contrastTextColor } : {}}>
                  {tab}
                </Button>
              );
            })}
          </div>

          {/* Product Grid */}
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
                  mode="product"
                  onEdit={() => handleEditProduct(product.id)}
                  onMoreOptionsClick={(e, prod) => handleMoreOptionsClick(e, prod)}
                  onViewStatsClick={() => handleProductStatClick(product.id)}
                  isUpdating={isStatusUpdating && statusUpdateVars?.productId === product.id}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <MyServicesPage gridVariant={gridVariant} />
      )}

      {/* Modals and Popovers */}
      <ProductStatModal isOpen={showProductStatModal} onClose={() => setShowProductStatModal(false)} productId={selectedProductIdForStats} brandColor={brandColor} />

      <BoostAdModal isOpen={showBoostAdModal} onClose={() => setShowBoostAdModal(false)} onProceed={handleProceedBoostAd} brandColor={brandColor} contrastTextColor={contrastTextColor} />

      {showMoreOptionsPopover && selectedProductForOptions && (
        <MoreOptionsPopover
          isOpen={showMoreOptionsPopover}
          onClose={() => setShowMoreOptionsPopover(false)}
          position={popoverPosition}
          product={selectedProductForOptions}
          onProductStatClick={handleProductStatClick}
          onMarkAsSold={handleMarkAsSold}
          onMarkAsUnavailable={handleMarkAsUnavailable}
          onMarkAsAvailable={handleMarkAsAvailable}

          onBoostProduct={handleBoostProduct}
          onDeleteProduct={handleDeleteProduct}
        />
      )}
    </div>
  );
};

export default MyProductsPage;