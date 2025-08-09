// src/features/products/pages/BoostProductSetupPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux'; // Assuming you use Redux for brandColor
import Button from '../../../components/ui/Button';
import { ChevronDownIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline'; // Icons for dropdown and budget toggle
import { getContrastTextColor } from '../../../utils/colorUtils'; // Utility for text color contrast

// IMPORTANT: We are removing the import for LocationSelectModal as per your request
// import LocationSelectModal from '../../../components/modals/LocationSelectModal'; 

// Dummy images for demonstration, match the ones in MyProductsPage
import dellLaptopImage from '../../../assets/images/productImages/2.jpeg'; // Example image matching Dell Inspiron Laptop
import iphoneImage from '../../../assets/images/productImages/3.jpeg'; // Example image for iPhone

// Dummy product data for the Boost Product Setup Page
const dummyProducts = {
    'prod1': {
        name: 'Dell Inspiron Laptop',
        currentPrice: 1800000, // Adjusted price to match err.jpg
        originalPrice: 2000000, // Adjusted original price to match err.jpg
        imageUrl: dellLaptopImage,
        discountText: '20% Off in bulk', // Adjusted discount text to match err.jpg
        isSponsored: true, // This product is already boosted or capable of being boosted
    },
    'prod2': {
        name: 'Samsung Galaxy S23',
        currentPrice: 1500000,
        originalPrice: null,
        imageUrl: iphoneImage,
        discountText: '20% Off in bulk', // Match style for consistency
        isSponsored: false,
    },
    // Add other products as needed, matching the dummy data in MyProductsPage
};

const BoostProductSetupPage = () => {
    const { productId } = useParams(); // Get product ID from URL
    const navigate = useNavigate();
    const brandColor = useSelector(state => state.ui?.brandColor) || '#EF4444'; // Default to Red-500
    const contrastTextColor = getContrastTextColor(brandColor);

    const [product, setProduct] = useState(null);
    const [dailyBudget, setDailyBudget] = useState(2000); // Default from bosoo.png
    const [duration, setDuration] = useState(20); // Default from bosoo.png
    const [location, setLocation] = useState('Location'); // Default location text from right.png
    const [audienceSliderValue, setAudienceSliderValue] = useState(50); // For "Get your post across several audiences"

    // IMPORTANT: Removing state for LocationSelectModal visibility as it's no longer used
    // const [showLocationModal, setShowLocationModal] = useState(false); 

    useEffect(() => {
        const fetchedProduct = dummyProducts[productId];
        if (fetchedProduct) {
            setProduct(fetchedProduct);
        } else {
            // Handle case where product is not found, e.g., redirect or show error
            navigate('/my-products'); // Redirect back to product list if ID is invalid
        }
    }, [productId, navigate]);

    if (!product) {
        return <div className="flex justify-center items-center h-screen">Loading boost setup...</div>;
    }

    const handleProceed = () => {
        // Navigate to the Boost Ad Preview Page, passing the current settings as state
        navigate(`/my-products/${productId}/boost-preview`, {
            state: {
                dailyBudget: dailyBudget,
                duration: duration,
                selectedLocation: location, // Pass the selected location
                audienceSliderValue: audienceSliderValue,
            }
        });
    };

    // IMPORTANT: Removing handlers for LocationSelectModal as it's no longer used
    // const handleOpenLocationModal = () => {
    //     setShowLocationModal(true);
    // };
    // const handleCloseLocationModal = () => {
    //     setShowLocationModal(false);
    // };
    // const handleSelectLocation = (selectedLocation) => {
    //     setLocation(selectedLocation);
    // };

    return (
        <div className="container mx-auto p-4 md:p-8 bg-gray-50 min-h-screen">
            {/* Header / Breadcrumb */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800" style={{ fontFamily: 'Manrope' }}>
                    My product / Product details / <span style={{ color: brandColor }}>Boost Product</span>
                </h1>
                {/* Could add back or close button here if desired */}
            </div>

            {/* Main Content Area */}
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 border border-gray-200">
                {/* Left Column: Product Display */}
                <div className="flex flex-col rounded-lg relative"> {/* Removed items-center, bg-gray-50, p-4, border border-gray-200 */}
                    {product.imageUrl && (
                        <>
                            <img src={product.imageUrl} alt={product.name} className="w-full max-h-80 object-cover rounded-lg mb-4" /> {/* Changed object-contain to object-cover and removed flex-col items-center from parent */}
                            {/* "Sponsored" Tag */}
                            <div className="absolute top-4 left-4 bg-yellow-400 text-gray-800 text-xs font-bold px-2 py-1 rounded-full flex items-center shadow-md">
                                <span className="w-2 h-2 bg-black rounded-full mr-1"></span> Sponsored
                            </div>
                        </>
                    )}
                    <div className='bg-white w-full h-1/3 p-4 rounded-lg shadow-md flex flex-col items-start'> {/* Changed items-center to items-start */}
                        <h2 className="text-xl font-bold text-gray-900 mt-2">{product.name}</h2>
                        <div className="flex items-baseline space-x-2 mt-2">
                            <span className="text-2xl font-bold" style={{ color: brandColor }}>₦{product.currentPrice.toLocaleString()}</span>
                            {product.originalPrice && (
                                <span className="text-lg text-gray-500 line-through">₦{product.originalPrice.toLocaleString()}</span>
                            )}
                        </div>
                        {product.discountText && (
                            <span className="mt-2 bg-yellow-400 text-gray-800 text-sm font-semibold px-3 py-1 rounded-full"> {/* Changed bg-green-500 to yellow-400 and text-white to text-gray-800 to match err.jpg */}
                                {product.discountText}
                            </span>
                        )}
                    </div>
                </div>

                {/* Right Column: Boost Options - Adjusted to match right.png */}
                <div className="flex flex-col space-y-6 p-2">
                    {/* Audience Slider */}
                    <div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={audienceSliderValue}
                            onChange={(e) => setAudienceSliderValue(e.target.value)}
                            className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                            style={{
                                background: `linear-gradient(to right, ${brandColor} ${audienceSliderValue}%, #e0e0e0 ${audienceSliderValue}%)`,
                            }}
                        />
                    </div>

                    {/* "Get your post across several audiences" heading and Location Dropdown */}
                    <div className='space-y-4'> {/* Added a container for these two elements */}
                        <h3 className="text-lg font-semibold text-gray-800">Get your post across several audiences</h3> {/* Moved heading here */}
                        <div>
                            <div className="relative">
                                {/* Reverted to native <select> element */}
                                <select
                                    id="location"
                                    name="location"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="block w-full pl-3 pt-4 pb-4 pr-10 py-4 text-base border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm appearance-none shadow-sm" // Adjusted styling to match right.png
                                >
                                    <option>Location</option> {/* Changed to "Location" to match right.png */}
                                    <option>All Locations</option>
                                    <option>Lagos, Nigeria</option>
                                    <option>Abuja, Nigeria</option>
                                    <option>Port Harcourt, Nigeria</option>
                                    {/* Add more options as needed */}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Daily Spending Limit */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label htmlFor="daily-budget" className="block text-md font-medium text-gray-700">Set your daily spending limit</label>
                            <AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-500 cursor-pointer hover:text-gray-700" title="Adjust budget settings" />
                        </div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Daily Budget</h4> {/* Retained for clarity, though not explicitly in right.png, it helps with UX */}
                        <div className="flex items-center space-x-4"> {/* Use flex to align slider and amount */}
                            <input
                                type="range"
                                min="0"
                                max="10000" // Example max budget
                                value={dailyBudget}
                                onChange={(e) => setDailyBudget(parseInt(e.target.value))}
                                className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                                style={{
                                    background: `linear-gradient(to right, ${brandColor} ${(dailyBudget / 10000) * 100}%, #e0e0e0 ${(dailyBudget / 10000) * 100}%)`,
                                }}
                            />
                            <span className="text-lg font-bold text-gray-900 whitespace-nowrap">₦{dailyBudget.toLocaleString()}</span> {/* Display budget amount */}
                        </div>
                    </div>

                    {/* Duration Slider */}
                    <div>
                        <h4 className="text-md font-medium text-gray-700 mb-1">Duration</h4>
                        <input
                            type="range"
                            min="1"
                            max="30" // Example max duration
                            value={duration}
                            onChange={(e) => setDuration(parseInt(e.target.value))}
                            className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                            style={{
                                background: `linear-gradient(to right, ${brandColor} ${(duration / 30) * 100}%, #e0e0e0 ${(duration / 30) * 100}%)`,
                            }}
                        />
                        <div className="text-sm text-gray-600 text-center mt-2">{duration} Days</div>
                    </div>
                </div>
            </div>

            {/* Bottom Proceed Button */}
            <div className="flex justify-center mt-8">
                <Button
                    onClick={handleProceed}
                    className="w-full max-w-sm py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-shadow"
                    style={{ backgroundColor: brandColor, color: contrastTextColor }}
                >
                    Proceed
                </Button>
            </div>

            {/* IMPORTANT: Removed Location Select Modal here */}
            {/* <LocationSelectModal
                isOpen={showLocationModal}
                onClose={handleCloseLocationModal}
                onSelectLocation={handleSelectLocation}
                title="Location"
                currentValue={location === 'Location' ? '' : location}
            /> */}
        </div>
    );
};

export default BoostProductSetupPage;