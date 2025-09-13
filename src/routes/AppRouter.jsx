// src/routes/AppRouter.jsx
import React, { Suspense, lazy } from 'react';
import { Routes, Route, Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import ScrollToTop from '../components/ui/ScrollToTop';
import NavBar from '../components/common/NavBar';
import ProtectedRoute from './ProtectedRoute';
import AuthModal from '../components/models/AuthModal.jsx';
import { openModal, closeModal, switchMode } from '../redux/modalSlice.js';

// Lazy-loaded pages
const HomePage = lazy(() => import('../pages/Home'));

// Products (new pages folder)
const AddProductPage = lazy(() => import('../features/products/pages/AddProductPage.jsx'));
const MyProductsPage = lazy(() => import('../features/products/pages/MyProduct.jsx'));
const ProductDetailsPage = lazy(() => import('../features/products/pages/ProductDetailsPage.jsx'));

// Product boost (kept in features)
const BoostProductSetupPage = lazy(() => import('../features/products/pages/BoostProductSetupPage.jsx'));
const BoostAdPreviewPage = lazy(() => import('../features/products/pages/BoostAdPreviewPage.jsx'));

// Services
const AddServicePage = lazy(() => import('../features/services/pages/AddServices.jsx'));
const MyServicesPage = lazy(() => import('../features/services/pages/MyServicesPage.jsx'));
const ServiceDetailsPage = lazy(() => import('../features/services/pages/ServiceDetailsPage'));

// Other features
const FeedPage = lazy(() => import('../features/feed/pages/FeedPage'));
const ChatPage = lazy(() => import('../features/chat/ChatPage.jsx'));
const OrdersPage = lazy(() => import('../features/orders/pages/OrdersPage.jsx'));
const SellerDashboardPage = lazy(() => import('../pages/SellerDashboardPage.jsx'));
const StatCard = lazy(() => import('../components/Dashboard/AnalyticsPage.jsx'));
const SubscriptionPage = lazy(() => import('../components/Dashboard/SubscriptionPage.jsx'));
const WalletDashboard = lazy(() => import('../components/Dashboard/WalletDashboard.jsx'));
const CheckoutPage = lazy(() => import('../features/cart/CheckoutPage'));
const UpgradeStorePage = lazy(() => import('../features/Upgradestore/Upgradestore.jsx'));

const MainLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn } = useSelector((state) => state.user);
  const { open, mode } = useSelector((state) => state.modal);

  const handleAccountClick = () => {
    if (!isLoggedIn) {
      dispatch(openModal('register'));
    } else {
      navigate('/store-upgrade');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <NavBar
        onSearchChange={(term) => console.log('Search term changed:', term)}
        onSearchSubmit={(term) => console.log('Search submitted:', term)}
        onAccountClick={handleAccountClick}
        onCameraClick={() => console.log('Camera clicked!')}
        onLoginClick={() => dispatch(openModal('login'))}
        onRegisterClick={() => dispatch(openModal('register'))}
      />

      <main className="flex-grow p-4 md:p-8">
        <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
          <Outlet />
        </Suspense>
      </main>

      {open && (
        <AuthModal
          mode={mode}
          onClose={() => dispatch(closeModal())}
          onSwitchMode={(newMode) => dispatch(switchMode(newMode))}
        />
      )}
    </div>
  );
};

function AppRouter() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            {/* Public */}
            <Route index element={<HomePage />} />
            <Route path="feed" element={<FeedPage />} />

            {/* Protected */}
            <Route path="checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
            <Route path="store-upgrade" element={<ProtectedRoute><UpgradeStorePage /></ProtectedRoute>} />

            {/* Products */}
            <Route path="add-product" element={<ProtectedRoute><AddProductPage /></ProtectedRoute>} />
            <Route path="my-products" element={<ProtectedRoute><MyProductsPage /></ProtectedRoute>} />
            <Route path="my-products/:productId/details" element={<ProtectedRoute><ProductDetailsPage /></ProtectedRoute>} />
            {/* Edit reuses AddProductPage in edit mode (detected via :productId) */}
            <Route path="my-products/:productId/edit" element={<ProtectedRoute><AddProductPage /></ProtectedRoute>} />
            {/* Optional: product stats page (placeholder uses StatCard) */}
            <Route path="my-products/:productId/stats" element={<ProtectedRoute><StatCard /></ProtectedRoute>} />

            {/* Product boost */}
            <Route path="my-products/:productId/boost-setup" element={<ProtectedRoute><BoostProductSetupPage /></ProtectedRoute>} />
            <Route path="my-products/:productId/boost-preview" element={<ProtectedRoute><BoostAdPreviewPage /></ProtectedRoute>} />
            <Route path="my-services/:serviceId/edit" element={<ProtectedRoute><AddServicePage /></ProtectedRoute>} />

            {/* Services */}
            <Route path="add-service" element={<ProtectedRoute><AddServicePage /></ProtectedRoute>} />
            <Route path="my-services" element={<ProtectedRoute><MyServicesPage /></ProtectedRoute>} />
            <Route path="my-services/:serviceId/details" element={<ProtectedRoute><ServiceDetailsPage /></ProtectedRoute>} />

            {/* Chat/Orders */}
            <Route path="chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
            <Route path="chat/:conversationId" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
            <Route path="orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />

            {/* Analytics / Subscription */}
            <Route path="statistics" element={<ProtectedRoute><StatCard /></ProtectedRoute>} />
            <Route path="subscription" element={<ProtectedRoute><SubscriptionPage /></ProtectedRoute>} />

            {/* Settings (Seller Dashboard) with nested routes */}
            <Route path="settings" element={<ProtectedRoute><SellerDashboardPage /></ProtectedRoute>}>
              <Route path="wallet">
                <Route path="escrow" element={<WalletDashboard type="escrow" />} />
                <Route path="shopping" element={<WalletDashboard type="shopping" />} />
              </Route>
              <Route path="store-upgrade" element={<UpgradeStorePage />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}

export default AppRouter;