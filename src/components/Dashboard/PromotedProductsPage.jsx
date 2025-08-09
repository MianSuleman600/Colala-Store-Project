// src/pages/PromotedProductsPage.jsx
import React, { useState } from 'react';
import PromotedProductCard from '../../components/Dashboard/PromotedProductCard';
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import ScrollToTop from '../ui/ScrollToTop';

// Import the PromotedProductDetails component
import PromotedProductDetails from './PromotedProductDetails';

// Dummy images for promoted products (reusing from MyProductsPage or similar)
import img1 from '../../assets/images/productImages/2.jpeg';
import img2 from '../../assets/images/productImages/3.jpeg';
import img3 from '../../assets/images/productImages/4.jpeg';
import img4 from '../../assets/images/productImages/1.png';

/**
 * PromotedProductsPage Component
 * Displays a list of promoted products with search and category filtering,
 * or the details of a single promoted product, based on internal state.
 * Matches the design in 'pro.png' for the list and 'image_c692e6.png' for details.
 *
 * @param {object} props
 * @param {string} props.brandColor - The primary brand color for styling.
 * @param {string} props.contrastTextColor - The text color that contrasts well with brandColor.
 */
const PromotedProductsPage = ({ brandColor, contrastTextColor }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All Categories');

    // State to manage which product's details are currently being viewed
    const [selectedPromotedProductId, setSelectedPromotedProductId] = useState(null);

    // Dummy data for promoted products - defined directly here
    const promotedProducts = [
        {
            id: 'promoted1',
            imageUrl: img1,
            name: 'Dell Inspiron Laptop',
            price: 2000000,
            discountPrice: 1800000,
            hasFreeDelivery: true,
            hasBulkDiscount: true,
            productViews: 200,
            productClicks: 15,
            messages: 3,
            category: 'Electronics',
            status: 'Active',
           
            location: 'Lagos, Nigeria',
            promotionDetails: {
                reach: 2000,
                impressions: 2000,
                costPerClick: 10,
                amountSpent: 5000,
                dateCreated: '07/22/25 - 08:22 AM',
                endDate: '07/29/25 - 08:22 AM',
                daysRemaining: 7,
                status: 'Active',
            },
        },
        {
            id: 'promoted2',
            imageUrl: img2,
            name: 'Samsung Galaxy S23',
            price: 1500000,
            discountPrice: null,
            hasFreeDelivery: false,
            hasBulkDiscount: true,
            productViews: 180,
            productClicks: 12,
            messages: 5,
            category: 'Phones',
            status: 'Active',
            
            location: 'Abuja, Nigeria',
            promotionDetails: {
                reach: 1800,
                impressions: 1900,
                costPerClick: 12,
                amountSpent: 4500,
                dateCreated: '07/20/25 - 10:00 AM',
                endDate: '07/27/25 - 10:00 AM',
                daysRemaining: 7,
                status: 'Active',
            },
        },
        {
            id: 'promoted3',
            imageUrl: img3,
            name: 'Sony WH-1000XM5',
            price: 500000,
            discountPrice: 450000,
            hasFreeDelivery: true,
            hasBulkDiscount: false,
            productViews: 250,
            productClicks: 20,
            messages: 8,
            category: 'Audio',
            status: 'Active',
            
            location: 'Port Harcourt, Nigeria',
            promotionDetails: {
                reach: 2200,
                impressions: 2300,
                costPerClick: 8,
                amountSpent: 3000,
                dateCreated: '07/21/25 - 09:30 AM',
                endDate: '07/28/25 - 09:30 AM',
                daysRemaining: 7,
                status: 'Active',
            },
        },
        {
            id: 'promoted4',
            imageUrl: img4,
            name: 'Apple Watch Series 8',
            price: 800000,
            discountPrice: null,
            hasFreeDelivery: false,
            hasBulkDiscount: true,
            productViews: 300,
            productClicks: 25,
            messages: 10,
            category: 'Wearables',
            status: 'Active',
           
            location: 'Lagos, Nigeria',
            promotionDetails: {
                reach: 2500,
                impressions: 2600,
                costPerClick: 15,
                amountSpent: 6000,
                dateCreated: '07/19/25 - 11:00 AM',
                endDate: '07/26/25 - 11:00 AM',
                daysRemaining: 7,
                status: 'Active',
            },
        },
        {
            id: 'promoted5',
            imageUrl: img1,
            name: 'Canon EOS R5',
            price: 3000000,
            discountPrice: null,
            hasFreeDelivery: true,
            hasBulkDiscount: true,
            productViews: 100,
            productClicks: 5,
            messages: 1,
            category: 'Cameras',
            status: 'Active',
           
            location: 'Ibadan, Nigeria',
            promotionDetails: {
                reach: 1500,
                impressions: 1600,
                costPerClick: 20,
                amountSpent: 7000,
                dateCreated: '07/18/25 - 02:00 PM',
                endDate: '07/25/25 - 02:00 PM',
                daysRemaining: 7,
                status: 'Active',
            },
        },
    ];

    // Find the currently selected product for details view
    const productToDisplay = promotedProducts.find(p => p.id === selectedPromotedProductId);

    const filteredProducts = promotedProducts.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All Categories' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const categories = ['All Categories', ...new Set(promotedProducts.map(p => p.category))];

    // Function to handle clicking "View Details" on a card
    const handleViewDetails = (product) => {
        setSelectedPromotedProductId(product.id);
    };

    // Function to handle going back from the details view
    const handleBackToPromotedList = () => {
        setSelectedPromotedProductId(null);
    };

    return (
        <div className="p-4 md:p-0">
              <ScrollToTop/>
            {/* Title Section - Conditionally render based on view */}
            {selectedPromotedProductId && productToDisplay ? ( // Ensure productToDisplay exists
                <div className="flex items-center mb-6">
                    <button
                        onClick={handleBackToPromotedList}
                        className="text-gray-600 hover:text-gray-900 mr-3"
                        aria-label="Back to promoted products"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </button>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                        {productToDisplay.name} / <span style={{ color: brandColor }}>Promotion details</span>
                    </h2>
                </div>
            ) : (
                <h2 className="text-3xl text-gray-800 mb-6">Promoted Product</h2>
            )}


            {/* Conditional Rendering: Show details or list */}
            {selectedPromotedProductId && productToDisplay ? (
                // Render the details component
                <PromotedProductDetails
                    product={productToDisplay}
                    brandColor={brandColor}
                    contrastTextColor={contrastTextColor}
                    onBack={handleBackToPromotedList} // Pass the back handler
                />
            ) : (
                // Render the list view (search, categories, product grid)
                <>
                    {/* Search and Categories Section */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-8">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                placeholder="Search products"
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 shadow-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        </div>

                        <div className="relative sm:w-1/3 lg:w-1/4">
                            <select
                                className="block w-full pl-4 pr-10 py-3 text-base border border-gray-300 rounded-xl bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 appearance-none shadow-sm"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
                            </div>
                        </div>
                    </div>

                    {/* Promoted Products Grid */}
                    {filteredProducts.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-lg shadow-md">
                            <p className="text-lg text-gray-600">No promoted products found matching your criteria.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProducts.map(product => (
                                <PromotedProductCard
                                    key={product.id}
                                    product={product}
                                    brandColor={brandColor}
                                    contrastTextColor={contrastTextColor}
                                    onViewDetailsClick={handleViewDetails} // Pass the handler down
                                />
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default PromotedProductsPage;
