// src/pages/products/MyProductsPage.jsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ProductDisplayCard from '../../../components/products/ProductDisplayCard.jsx';
import ProductStatModal from '../../../components/products/ProductStatModal.jsx';
import MoreOptionsPopover from '../../../components/products/MoreOptionsPopover.jsx';
import Button from '../../../components/ui/Button';
import { PlusIcon, TrashIcon, PencilIcon, ChartBarIcon } from '@heroicons/react/24/outline';

import BoostAdModal from '../../../components/products/BoostAdModal.jsx';
import MyServicesPage from '../../../features/services/pages/MyServicesPage.jsx';

// Import dummy product images
import img1 from '../../../assets/images/productImages/2.jpeg';
import img2 from '../../../assets/images/productImages/3.jpeg';
import img3 from '../../../assets/images/productImages/4.jpeg';
import img4 from '../../../assets/images/productImages/1.png';

/**
 * MyProductsPage Component
 * Displays a list of products owned by the logged-in user, with filtering tabs
 * and actions for each product including a statistics modal and a more options popover.
 * Now includes a main tab for "My Services" which renders the MyServicesPage component.
 * Accepts brandColor, contrastTextColor, and lightBrandColor as props for consistent theming.
 * `showAddProductButton` prop controls the visibility of the "Add New Product" button.
 * Matches the 'p.png' design for standalone use, adapted for dashboard integration.
 *
 * @param {object} props
 * @param {string} props.brandColor - The primary brand color.
 * @param {string} props.contrastTextColor - The text color that contrasts well with brandColor.
 * @param {string} props.lightBrandColor - A lighter shade of the brand color.
 * @param {boolean} [props.showAddProductButton=true] - Whether to display the "Add New Product" button. Defaults to true.
 */
const MyProductsPage = ({ brandColor, contrastTextColor, lightBrandColor, showAddProductButton = true }) => {
    const navigate = useNavigate();
    // const { userId, isLoggedIn } = useSelector((state) => state.user); // Uncomment and use if Redux is set up

    // Dummy user ID and login status for frontend demonstration
    const userId = 'user123'; // Placeholder
    const isLoggedIn = true; // Assume logged in for now for demonstration

    // NEW: State to manage the main tab selection: 'products' or 'services'
    const [selectedMainTab, setSelectedMainTab] = useState('products');

    // Dummy product data - more comprehensive for stats and status
    const [products, setProducts] = useState([
        {
            id: 'prod1',
            imageUrl: img1,
            name: 'Dell Inspiron Laptop',
            price: 2000000,
            discountPrice: 1800000,
            status: 'Active', // Active, Draft, Sold Out, Unavailable
            isSponsored: true,
            productViews: 200,
            productClicks: 15,
            messages: 3,
            category: 'Electronics',
            hasFreeDelivery: true,
            hasBulkDiscount: true,
            location: 'Lagos, Nigeria',
            // Dummy chart data for modal - crucial for ProductStatModal
            chartData: [
                { date: '1 Jul', Impressions: 50, Visitors: 30, Orders: 10 },
                { date: '2 Jul', Impressions: 70, Visitors: 45, Orders: 15 },
                { date: '3 Jul', Impressions: 40, Visitors: 20, Orders: 8 },
                { date: '4 Jul', Impressions: 60, Visitors: 35, Orders: 12 },
                { date: '5 Jul', Impressions: 80, Visitors: 50, Orders: 20 },
                { date: '6 Jul', Impressions: 75, Visitors: 48, Orders: 18 },
                { date: '7 Jul', Impressions: 90, Visitors: 60, Orders: 25 },
            ],
            inCart: 25,
            completedOrders: 18,
            impressions: 500,
            profileClicks: 75,
            chats: 12,
            noClicks: 5,
        },
        {
            id: 'prod2',
            imageUrl: img2,
            name: 'Samsung Galaxy S23',
            price: 1500000,
            discountPrice: null,
            status: 'Active',
            isSponsored: false,
            productViews: 150,
            productClicks: 10,
            messages: 5,
            category: 'Phones',
            hasFreeDelivery: false,
            hasBulkDiscount: true, // Example: has bulk discount
            location: 'Abuja, Nigeria',
            chartData: [], // Example: No specific data for this one
            inCart: 10,
            completedOrders: 5,
            impressions: 300,
            profileClicks: 40,
            chats: 8,
            noClicks: 2,
        },
        {
            id: 'prod3',
            imageUrl: img3,
            name: 'Sony WH-1000XM5',
            price: 500000,
            discountPrice: 450000,
            status: 'Sold Out', // Example of an out of stock product
            isSponsored: false,
            productViews: 300,
            productClicks: 25,
            messages: 10,
            category: 'Audio',
            hasFreeDelivery: true,
            hasBulkDiscount: false,
            location: 'Port Harcourt, Nigeria',
            chartData: [],
            inCart: 30,
            completedOrders: 25,
            impressions: 600,
            profileClicks: 90,
            chats: 15,
            noClicks: 8,
        },
        {
            id: 'prod4',
            imageUrl: img4, // Using img4 for consistency with your provided images
            name: 'Apple Watch Series 8',
            price: 800000,
            discountPrice: null,
            status: 'Active',
            isSponsored: true,
            productViews: 400,
            productClicks: 30,
            messages: 7,
            category: 'Wearables',
            hasFreeDelivery: true,
            hasBulkDiscount: true,
            location: 'Lagos, Nigeria',
            chartData: [],
            inCart: 40,
            completedOrders: 30,
            impressions: 800,
            profileClicks: 100,
            chats: 20,
            noClicks: 10,
        },
        {
            id: 'prod5',
            imageUrl: img1, // Reusing image
            name: 'Canon EOS R5',
            price: 3000000,
            discountPrice: null,
            status: 'Unavailable', // Another example of an out of stock product
            isSponsored: false,
            productViews: 100,
            productClicks: 5,
            messages: 1,
            category: 'Cameras',
            hasFreeDelivery: false,
            hasBulkDiscount: false,
            location: 'Ibadan, Nigeria',
            chartData: [],
            inCart: 10,
            completedOrders: 0,
            impressions: 300,
            profileClicks: 20,
            chats: 5,
            noClicks: 15,
        },
    ]);

    // State for product filtering tabs: 'All', 'Sponsored', 'Out of Stock'
    const [productFilterTab, setProductFilterTab] = useState('All');

    // State for Product Stat Modal
    const [showProductStatModal, setShowProductStatModal] = useState(false);
    const [selectedProductStats, setSelectedProductStats] = useState(null);

    // NEW: State for Boost Ad Modal
    const [showBoostAdModal, setShowBoostAdModal] = useState(false);
    const [selectedProductForBoost, setSelectedProductForBoost] = useState(null);


    // State for More Options Popover
    const [showMoreOptionsPopover, setShowMoreOptionsPopover] = useState(false);
    const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
    const [selectedProductForOptions, setSelectedProductForOptions] = useState(null);

    // useEffect to open Product Stat Modal when data is ready
    useEffect(() => {
        if (selectedProductStats) {
            console.log('MyProductsPage - useEffect: selectedProductStats detected. Opening Product Stat modal.');
            setShowProductStatModal(true);
        }
    }, [selectedProductStats]);

    // NEW useEffect to open Boost Ad Modal when data is ready
    useEffect(() => {
        if (selectedProductForBoost) {
            console.log('MyProductsPage - useEffect: selectedProductForBoost detected. Opening Boost Ad modal.');
            setShowBoostAdModal(true);
        }
    }, [selectedProductForBoost]);


    // NEW: Handler for closing the Product Stat Modal
    const handleCloseProductStatModal = () => {
        console.log('MyProductsPage - handleCloseProductStatModal: Closing modal and clearing stats.');
        setShowProductStatModal(false);
        setSelectedProductStats(null);
    };

    // NEW: Handler for closing the Boost Ad Modal
    const handleCloseBoostAdModal = () => {
        console.log('MyProductsPage - handleCloseBoostAdModal: Closing Boost Ad modal.');
        setShowBoostAdModal(false);
        setSelectedProductForBoost(null); // Clear selected product for boost
    };

    // NEW: Handler for proceeding from Boost Ad Modal
    const handleProceedBoostAd = () => {
        console.log(`Proceeding with boost for product: ${selectedProductForBoost}`);
        // Here you would typically navigate to a boost setup page or trigger an API call
        navigate(`/my-products/${selectedProductForBoost}/boost-setup`); // Example navigation
        handleCloseBoostAdModal(); // Close the modal
    };


    const handleAddProductClick = () => {
        navigate('/add-product');
    };

    const handleEditProduct = (productId) => {
        console.log(`Editing product: ${productId}`);
        navigate(`/my-products/${productId}/details`);
        setShowMoreOptionsPopover(false); // Close popover after action
    };

    // Handler for "Product Stat" action in the popover
    const handleProductStatClick = (productId) => {
        const product = products.find(p => p.id === productId);
        if (product) {
            setSelectedProductStats({
                productName: product.name,
                views: product.productViews,
                inCart: product.inCart,
                completedOrders: product.completedOrders,
                impressions: product.impressions,
                profileClicks: product.profileClicks,
                chats: product.chats,
                noClicks: product.noClicks,
                chartData: product.chartData,
            });
            console.log('MyProductsPage - Inside handleProductStatClick: Product stats set. Popover will close.');
        }
        setShowMoreOptionsPopover(false);
    };

    // Handler for "More Options" ellipsis button click
    const handleMoreOptionsClick = (event, productId) => {
        event.stopPropagation();
        const rect = event.currentTarget.getBoundingClientRect();
        setPopoverPosition({
            top: rect.bottom + window.scrollY + 5,
            left: rect.right + window.scrollX - 192, // Adjust as needed for popover width
        });
        setSelectedProductForOptions(productId);
        setShowMoreOptionsPopover(true);
    };

    // Handler for "Mark as Sold" action
    const handleMarkAsSold = (productId) => {
        console.log(`Marking product ${productId} as Sold`);
        setProducts(prevProducts =>
            prevProducts.map(p =>
                p.id === productId ? { ...p, status: 'Sold Out' } : p
            )
        );
        // Replaced alert with a custom message or modal for better UX
        // alert(`Product ${productId} marked as Sold!`);
        setShowMoreOptionsPopover(false);
    };

    // Handler for "Mark as Unavailable" action
    const handleMarkAsUnavailable = (productId) => {
        console.log(`Marking product ${productId} as Unavailable`);
        setProducts(prevProducts =>
            prevProducts.map(p =>
                p.id === productId ? { ...p, status: 'Unavailable' } : p
            )
        );
        // Replaced alert with a custom message or modal for better UX
        // alert(`Product ${productId} marked as Unavailable!`);
        setShowMoreOptionsPopover(false);
    };

    // MODIFIED Handler for "Boost Product" action
    const handleBoostProduct = (productId) => {
        console.log(`MyProductsPage - Inside handleBoostProduct: Setting product for boost: ${productId}`);
        setSelectedProductForBoost(productId); // Set the product ID for the boost modal
        setShowMoreOptionsPopover(false); // Close the popover
        // The useEffect will now open the BoostAdModal
    };

    // Handler for "Delete Product" action (from popover)
    const handleDeleteProduct = (productId) => {
        // Replaced window.confirm with a custom modal for better UX
        const confirmDelete = window.confirm(`Are you sure you want to delete product ${productId}? This action cannot be undone.`);
        if (confirmDelete) {
            setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));
            console.log(`Deleting product: ${productId}`);
            // alert(`Product ${productId} deleted!`);
        }
        setShowMoreOptionsPopover(false);
    };

    // Filter products based on the selected 'productFilterTab'
    const filteredProducts = products.filter(product => {
        if (productFilterTab === 'All') return true;
        if (productFilterTab === 'Sponsored') return product.isSponsored;
        if (productFilterTab === 'Out of Stock') return product.status === 'Sold Out' || product.status === 'Unavailable';
        return true;
    });

    // Render login prompt if not logged in
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
            {/* Main Title */}
            <h2 className="text-2xl font-bold text-gray-800 mb-6">My Product/Services</h2>

            {/* Main Tabs: My Products | My Services */}
            <div className="flex border-b border-gray-200 mb-6">
                <button
                    className={`py-2 px-4 text-lg font-medium ${selectedMainTab === 'products' ? 'border-b-2' : 'text-gray-500 hover:text-gray-700'}`}
                    style={selectedMainTab === 'products' ? { borderColor: brandColor, color: brandColor } : {}}
                    onClick={() => setSelectedMainTab('products')}
                >
                    My Products
                </button>
                <button
                    className={`py-2 px-4 text-lg font-medium ${selectedMainTab === 'services' ? 'border-b-2' : 'text-gray-500 hover:text-gray-700'}`}
                    style={selectedMainTab === 'services' ? { borderColor: brandColor, color: brandColor } : {}}
                    onClick={() => setSelectedMainTab('services')}
                >
                    My Services
                </button>
            </div>

            {/* Conditional Content based on Main Tab */}
            {selectedMainTab === 'products' ? (
                <>
                    {/* Conditional rendering for the "Add New Product" button */}
                    {showAddProductButton && (
                        <div className="flex justify-end mb-6">
                            <Button
                                onClick={handleAddProductClick}
                                style={{ backgroundColor: brandColor, color: contrastTextColor }}
                                className="py-2 px-6 rounded-lg font-semibold flex items-center shadow-md hover:shadow-lg transition-shadow"
                            >
                                <PlusIcon className="h-5 w-5 mr-2" /> Add New Product
                            </Button>
                        </div>
                    )}

                    {/* Product Filtering Tabs */}
                    <div className="flex space-x-4 mb-6">
                        {['All', 'Sponsored', 'Out of Stock'].map(tab => (
                            <Button
                                key={tab}
                                onClick={() => setProductFilterTab(tab)}
                                className={`py-2 px-4 rounded-lg font-semibold ${productFilterTab === tab ? '' : 'bg-gray-200 text-gray-700'}`}
                                style={productFilterTab === tab ? { backgroundColor: brandColor, color: contrastTextColor } : {}}
                            >
                                {tab}
                            </Button>
                        ))}
                    </div>

                    {/* Conditional rendering for no products found based on filter */}
                    {filteredProducts.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-lg shadow-md">
                            <p className="text-lg text-gray-600 mb-4">
                                No products found for this filter.
                                {productFilterTab === 'All' && ' Click "Add Your First Product" to get started!'}
                            </p>
                            {/* Show "Add Your First Product" button only if 'All' tab is selected AND showAddProductButton is true */}
                            {productFilterTab === 'All' && showAddProductButton && (
                                <Button
                                    onClick={handleAddProductClick}
                                    style={{ backgroundColor: brandColor, color: contrastTextColor }}
                                    className="py-2 px-6 rounded-lg font-semibold"
                                >
                                    Add Your First Product
                                </Button>
                            )}
                        </div>
                    ) : (
                        // Grid for displaying ProductDisplayCards
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-6">
                            {filteredProducts.map(product => (
                                <ProductDisplayCard
                                    key={product.id}
                                    product={product}
                                    brandColor={brandColor}
                                    contrastTextColor={contrastTextColor}
                                    lightBrandColor={lightBrandColor}
                                    mode="default" // Explicitly set to 'default' for this page
                                    onEdit={() => handleEditProduct(product.id)}
                                    // onDelete={() => handleDeleteProduct(product.id)} // This prop is not used by ProductDisplayCard
                                    // onViewStats={() => handleProductStatClick(product.id)} // This prop is not used by ProductDisplayCard
                                    // onBoostPost={() => handleBoostProduct(product.id)} // This prop is not used by ProductDisplayCard
                                    onMoreOptionsClick={handleMoreOptionsClick} // Pass for the ellipsis popover button
                                />
                            ))}
                        </div>
                    )}
                </>
            ) : (
                // Render MyServicesPage when 'My Services' tab is selected
                <MyServicesPage
                    brandColor={brandColor}
                    contrastTextColor={contrastTextColor}
                    lightBrandColor={lightBrandColor}
                />
            )}


            {/* Product Stat Modal: Renders only when showProductStatModal is true and data is available */}
            {showProductStatModal && selectedProductStats && (
                <ProductStatModal
                    isOpen={showProductStatModal}
                    onClose={handleCloseProductStatModal}
                    productStats={selectedProductStats}
                    brandColor={brandColor}
                    contrastTextColor={contrastTextColor}
                    lightBrandColor={lightBrandColor}
                />
            )}

            {/* NEW: Boost Ad Modal: Renders only when showBoostAdModal is true */}
            {showBoostAdModal && (
                <BoostAdModal
                    isOpen={showBoostAdModal}
                    onClose={handleCloseBoostAdModal}
                    onProceed={handleProceedBoostAd}
                    brandColor={brandColor}
                    contrastTextColor={contrastTextColor}
                />
            )}

            {/* More Options Popover: Renders only when showMoreOptionsPopover is true and a product is selected */}
            {showMoreOptionsPopover && selectedProductForOptions && (
                <MoreOptionsPopover
                    isOpen={showMoreOptionsPopover}
                    onClose={() => setShowMoreOptionsPopover(false)}
                    position={popoverPosition}
                    productId={selectedProductForOptions}
                    onProductStatClick={handleProductStatClick}
                    onMarkAsSold={handleMarkAsSold}
                    onMarkAsUnavailable={handleMarkAsUnavailable}
                    onBoostProduct={handleBoostProduct} // This will now open the BoostAdModal
                    onDeleteProduct={handleDeleteProduct}
                />
            )}
        </div>
    );
};

export default MyProductsPage;
