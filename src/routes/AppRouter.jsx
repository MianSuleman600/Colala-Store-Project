import React, { Suspense, lazy, useEffect, useState } from 'react';
import { Routes, Route, Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getAuthTokens, apiRequest } from '../api/apiClient';
import { loginSuccess, logout } from '../features/auth/authSlice';
import { ENDPOINTS } from '../api/apiConfig';

import ScrollToTop from '../components/ui/ScrollToTop';
import NavBar from '../components/common/NavBar.jsx';
import ProtectedRoute from './ProtectedRoute';
import AuthModal from '../components/models/AuthModal.jsx';
import { openModal, closeModal, switchMode } from '../redux/modalSlice.js';
import NotificationPermissionPrompt from '../components/common/NotificationPermissionPrompt.jsx';
import AuthDebugger from '../components/debug/AuthDebugger.jsx';

// --- Session Hydrator ---
const SessionHydrator = ({ children }) => {
  const dispatch = useDispatch();
  const [isSessionChecked, setIsSessionChecked] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        // If already authenticated (from middleware restoration), skip API call
        if (isAuthenticated) {
          console.log('User already authenticated, skipping session check');
          setIsSessionChecked(true);
          return;
        }

        const { accessToken } = getAuthTokens();
        const storedUserId = localStorage.getItem('userId');

        console.log('Session check - Token exists:', !!accessToken, 'User ID exists:', !!storedUserId);

        if (accessToken && storedUserId) {
          console.log('Found stored tokens, attempting to restore session...');
          
          try {
            // Try to get user data from the API
            const overviewData = await apiRequest({
              url: ENDPOINTS.SELLER_ONBOARDING.STORE.OVERVIEW,
              method: 'GET',
            });

            if (overviewData && overviewData.store) {
              const storeData = overviewData.store;
              const userPayload = {
                id: parseInt(storedUserId, 10),
                full_name: storeData.name,
                email: storeData.email,
                phone: storeData.phone,
                store: storeData,
              };
              console.log('Session restored successfully:', userPayload);
              dispatch(loginSuccess({ user: userPayload, token: accessToken }));
            } else {
              console.warn('Session check failed (invalid overview data). Logging out.');
              dispatch(logout());
            }
          } catch (apiError) {
            console.error('API call failed during session restoration:', apiError);
            // If it's a 401, the token is invalid, so logout
            if (apiError.statusCode === 401) {
              console.log('Token is invalid, logging out...');
              dispatch(logout());
            } else {
              // For other errors, try to restore with minimal data
              console.log('API error but token exists, attempting minimal restoration...');
              const userPayload = {
                id: parseInt(storedUserId, 10),
                full_name: 'User', // Fallback name
                email: '', // Will be empty until API is available
                phone: '',
                store: null,
              };
              dispatch(loginSuccess({ user: userPayload, token: accessToken }));
            }
          }
        } else {
          console.log('No stored tokens found, user not logged in');
          // Clear any stale data
          if (storedUserId && !accessToken) {
            localStorage.removeItem('userId');
          }
        }
      } catch (error) {
        console.error('Session check failed:', error);
        // Only logout if we had tokens but something went wrong
        const { accessToken } = getAuthTokens();
        if (accessToken) {
          dispatch(logout());
        }
      } finally {
        setIsSessionChecked(true);
      }
    };

    checkUserSession();
  }, [dispatch, isAuthenticated]);

  if (!isSessionChecked) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-gray-600">Loading Application...</p>
          <p className="text-sm text-gray-500 mt-2">Restoring your session...</p>
        </div>
      </div>
    );
  }

  return children;
};

// --- Lazy Imports ---
const HomePage = lazy(() => import('../pages/Home'));
const AddProductPage = lazy(() => import('../features/products/pages/AddProductPage.jsx'));
const MyProductsPage = lazy(() => import('../features/products/pages/MyProduct.jsx'));
const ProductDetailsPage = lazy(() => import('../features/products/pages/ProductDetailsPage.jsx'));
const BoostProductSetupPage = lazy(() => import('../features/products/pages/BoostProductSetupPage.jsx'));
const BoostAdPreviewPage = lazy(() => import('../features/products/pages/BoostAdPreviewPage.jsx'));
const AddServicePage = lazy(() => import('../features/services/pages/AddServices.jsx'));
const MyServicesPage = lazy(() => import('../features/services/pages/MyServicesPage.jsx'));
const ServiceDetailsPage = lazy(() => import('../features/services/pages/ServiceDetailsPage'));
const FeedPage = lazy(() => import('../features/feed/pages/FeedPage'));
const ChatPage = lazy(() => import('../features/chat/ChatPage.jsx'));
const OrdersPage = lazy(() => import('../features/orders/pages/OrdersPage.jsx'));
const SellerDashboardPage = lazy(() => import('../pages/SellerDashboardPage.jsx'));
const StatCard = lazy(() => import('../components/Dashboard/AnalyticsPage.jsx'));
const SubscriptionPage = lazy(() => import('../components/Dashboard/SubscriptionPage.jsx'));
const WalletDashboard = lazy(() => import('../components/Dashboard/WalletDashboard.jsx'));
const CheckoutPage = lazy(() => import('../features/cart/CheckoutPage'));
const UpgradeStorePage = lazy(() => import('../features/Upgradestore/Upgradestore.jsx'));
const SearchPage = lazy(() => import('../pages/SearchPage.jsx'));

// --- Layout ---
const MainLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { open, mode } = useSelector((state) => state.modal);

  const handleAccountClick = () => {
    if (!isAuthenticated) dispatch(openModal('register'));
    else navigate('/settings');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <NavBar
        onSearchChange={(term) => console.log('Search changed:', term)}
        onSearchSubmit={(term) => console.log('Search submitted:', term)}
        onAccountClick={handleAccountClick}
        onCameraClick={() => console.log('Camera clicked')}
      />

      <NotificationPermissionPrompt delayMs={10000} debugForceShow={false} debugLog />

      <main className="flex-grow p-4 md:p-8">
        <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
          <Outlet />
        </Suspense>
      </main>

      {/* <AuthDebugger /> */}

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

// --- Router ---
function AppRouter() {
  return (
    <>
      <ScrollToTop />
      <SessionHydrator>
        <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="feed" element={<ProtectedRoute><FeedPage /></ProtectedRoute>} />
              <Route path="checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
              <Route path="store-upgrade" element={<ProtectedRoute><UpgradeStorePage /></ProtectedRoute>} />
              <Route path="search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
              {/* Products */}
              <Route path="add-product" element={<ProtectedRoute><AddProductPage /></ProtectedRoute>} />
              <Route path="my-products" element={<ProtectedRoute><MyProductsPage /></ProtectedRoute>} />
              <Route path="my-products/:productId/details" element={<ProtectedRoute><ProductDetailsPage /></ProtectedRoute>} />
              <Route path="my-products/:productId/edit" element={<ProtectedRoute><AddProductPage /></ProtectedRoute>} />
              <Route path="my-products/:productId/stats" element={<ProtectedRoute><StatCard /></ProtectedRoute>} />
              <Route path="my-products/:productId/boost-setup" element={<ProtectedRoute><BoostProductSetupPage /></ProtectedRoute>} />
              <Route path="my-products/:productId/boost-preview" element={<ProtectedRoute><BoostAdPreviewPage /></ProtectedRoute>} />

              {/* Services */}
              <Route path="add-service" element={<ProtectedRoute><AddServicePage /></ProtectedRoute>} />
              <Route path="my-services" element={<ProtectedRoute><MyServicesPage /></ProtectedRoute>} />
              <Route path="my-services/:serviceId/details" element={<ProtectedRoute><ServiceDetailsPage /></ProtectedRoute>} />
              <Route path="my-services/:serviceId/edit" element={<ProtectedRoute><AddServicePage /></ProtectedRoute>} />

              {/* Chat & Orders */}
              <Route path="chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
              <Route path="chat/:conversationId" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
              <Route path="orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />

              {/* Statistics / Subscription */}
              <Route path="statistics" element={<ProtectedRoute><StatCard /></ProtectedRoute>} />
              <Route path="subscription" element={<ProtectedRoute><SubscriptionPage /></ProtectedRoute>} />

              {/* ✅ Nested Settings Routes */}
              <Route
                path="settings"
                element={
                  <ProtectedRoute>
                    <SellerDashboardPage />
                  </ProtectedRoute>
                }
              >
                <Route path="wallet">
                  <Route index element={<WalletDashboard type="overview" />} />
                  <Route path="escrow" element={<WalletDashboard type="escrow" />} />
                  <Route path="shopping" element={<WalletDashboard type="shopping" />} />
                </Route>
                <Route path="store-upgrade" element={<UpgradeStorePage />} />
              </Route>
            </Route>
          </Routes>
        </Suspense>
      </SessionHydrator>
    </>
  );
}

export default AppRouter;
