import React, { useState, Suspense, lazy, useEffect } from 'react';
import { Routes, Route, Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ScrollToTop from '../components/ui/ScrollToTop.jsx';
import NavBar from '../components/common/NavBar';
import ProtectedRoute from './ProtectedRoute';

// Code-Splitting: Lazy-loading components
const LoginPage = lazy(() => import('../features/auth/pages/Login'));
const RegisterPage = lazy(() => import('../features/auth/pages/Register'));
const HomePage = lazy(() => import('../pages/Home'));
const AddProductPage = lazy(() => import('../features/products/pages/AddProductPage.jsx'));
const AddServicePage = lazy(() => import('../features/services/pages/AddServices.jsx'));
const MyProductsPage = lazy(() => import('../features/products/pages/MyProduct.jsx'));
const ProductDetailsPage = lazy(() => import('../features/products/pages/ProductDetailsPage.jsx'));
const BoostProductSetupPage = lazy(() => import('../features/products/pages/BoostProductSetupPage.jsx'));
const BoostAdPreviewPage = lazy(() => import('../features/products/pages/BoostAdPreviewPage.jsx'));
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

// Main layout with NavBar
const MainLayout = () => {
    const { isLoggedIn } = useSelector((state) => state.user);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const navigate = useNavigate();

    const handleSearchChange = (term) => console.log('Search term changed:', term);
    const handleSearchSubmit = (term) => console.log('Search submitted:', term);

    const handleAccountClick = () => {
        if (!isLoggedIn) {
            setShowRegisterModal(true);
        } else {
            navigate('/store-upgrade');
        }
    };

    const handleCameraClick = () => console.log('Camera clicked!');
    const handleLoginClickFromRegister = () => {
        setShowRegisterModal(false);
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <NavBar
                onSearchChange={handleSearchChange}
                onSearchSubmit={handleSearchSubmit}
                onAccountClick={handleAccountClick}
                onCameraClick={handleCameraClick}
            />
            <main className="flex-grow p-4 md:p-8">
                <Outlet />
            </main>

            {showRegisterModal && (
                <RegisterPage
                    onClose={() => setShowRegisterModal(false)}
                    onLoginClick={handleLoginClickFromRegister}
                />
            )}
        </div>
    );
};

// Router definition
function AppRouter() {
    const { isLoggedIn } = useSelector((state) => state.user);

    // OPTIMIZATION: Use preloading hints to fetch code for likely next pages.
    // This effect runs once when the user is logged in, silently fetching the code
    // for the Home and Feed pages to make navigation feel instantaneous.
    useEffect(() => {
        if (isLoggedIn) {
            console.log("Preloading Home and Feed pages...");
            // Preload the HomePage module
            HomePage.preload && HomePage.preload();
            // Preload the FeedPage module
            FeedPage.preload && FeedPage.preload();
        }
    }, [isLoggedIn]);

    return (
        <>
            <ScrollToTop />
            <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* Layout with nested routes */}
                    <Route path="/" element={<MainLayout />}>
                        <Route index element={<HomePage />} />
                        <Route path="checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
                        <Route path="store-upgrade" element={<ProtectedRoute><UpgradeStorePage /></ProtectedRoute>} />
                        <Route path="add-product" element={<ProtectedRoute><AddProductPage /></ProtectedRoute>} />
                        <Route path="add-service" element={<ProtectedRoute><AddServicePage /></ProtectedRoute>} />
                        <Route path="statistics" element={<ProtectedRoute><StatCard /></ProtectedRoute>} />
                        <Route path="subscription" element={<ProtectedRoute><SubscriptionPage /></ProtectedRoute>} />
                        <Route path="my-products" element={<ProtectedRoute><MyProductsPage /></ProtectedRoute>} />
                        <Route path="my-products/:productId/details" element={<ProtectedRoute><ProductDetailsPage /></ProtectedRoute>} />
                        <Route path="my-products/:productId/boost-setup" element={<ProtectedRoute><BoostProductSetupPage /></ProtectedRoute>} />
                        <Route path="my-products/:productId/boost-preview" element={<ProtectedRoute><BoostAdPreviewPage /></ProtectedRoute>} />
                        <Route path="my-services" element={<ProtectedRoute><MyServicesPage /></ProtectedRoute>} />
                        <Route path="my-services/:serviceId/details" element={<ProtectedRoute><ServiceDetailsPage /></ProtectedRoute>} />
                        <Route path="feed" element={<FeedPage />} />
                        <Route path="chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
                        <Route path="orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
                        <Route path="settings" element={<ProtectedRoute><SellerDashboardPage /></ProtectedRoute>} />
                        <Route path="wallet/escrow" element={<ProtectedRoute><WalletDashboard type="escrow" /></ProtectedRoute>} />
                        <Route path="wallet/shopping" element={<ProtectedRoute><WalletDashboard type="shopping" /></ProtectedRoute>} />
                    </Route>
                </Routes>
            </Suspense>
        </>
    );
}

export default AppRouter;