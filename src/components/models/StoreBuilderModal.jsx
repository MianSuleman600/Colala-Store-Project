// src/components/modals/StoreBuilderModal.jsx
import React, { useState, useEffect, useRef } from 'react';
import { X, UploadCloud, ChevronDown, Mail, Phone, MapPin } from 'lucide-react';
import Button from '../ui/Button';
import ImagePlaceholder from '../ui/ImagePlaceholder';
import { useGetStoreProfileQuery, useUpdateStoreProfileMutation } from '../../services/storeProfileApi';
import { useSelector } from 'react-redux';

/**
 * StoreBuilderModal Component
 * A modal for users to build and customize their store profile,
 * now refactored to use Redux Toolkit for data fetching and updates.
 *
 * @param {object} props
 * @param {boolean} props.isOpen - Controls the visibility of the modal.
 * @param {function} props.onClose - Callback function to close the modal.
 */
const StoreBuilderModal = ({
    isOpen,
    onClose
}) => {
    // Get userName AND userId from userSlice for initial form state and query
    const { userName, userId, isLoggedIn } = useSelector((state) => state.user); // <<< Added userId and isLoggedIn here

    // Fetch store profile data using RTK Query, passing the userId
    const { data: fetchedStoreData, error, isLoading, isFetching, refetch } = useGetStoreProfileQuery(userId, { // <<< Pass userId here
        skip: !isOpen || !isLoggedIn || !userId, // Skip query if modal is not open, or user is not logged in, or userId is not available
        refetchOnMountOrArgChange: true, // Refetch when modal opens or userId changes
    });

    // Mutation hook for updating store data
    const [updateStoreProfile, { isLoading: isUpdating, isSuccess: isUpdateSuccess }] = useUpdateStoreProfileMutation();

    // State to manage local form fields
    const [storeName, setStoreName] = useState('');
    const [storeEmail, setStoreEmail] = useState('');
    const [storePhoneNumber, setStorePhoneNumber] = useState('');
    const [showPhoneOnProfile, setShowPhoneOnProfile] = useState(false);
    const [storeLocation, setStoreLocation] = useState('Lagos');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [profileLogoPreview, setProfileLogoPreview] = useState(null);
    const [profileBannerPreview, setProfileBannerPreview] = useState(null);
    const [promotionalBannerPreview, setPromotionalBannerPreview] = useState(null);
    const [selectedBrandColor, setSelectedBrandColor] = useState('#EF4444');

    // Create refs for each file input
    const profileLogoInputRef = useRef(null);
    const profileBannerInputRef = useRef(null);
    const promotionalBannerInputRef = useRef(null);

    // Mock data for dropdowns and colors
    const locations = ['Lagos', 'Abuja', 'Port Harcourt', 'Ibadan'];
    const availableCategories = ['Electronics', 'Phones', 'Fashion', 'Groceries', 'Books', 'Home Goods'];
    const brandColors = [
        '#EF4444', '#3B82F6', '#008000', '#FFA500', '#800080',
        '#FFC0CB', '#00CED1', '#FFD700', '#A52A2A', '#06B6D4',
        '#6D28D9', '#EAB308', '#EC4899', '#16A34A', '#0000FF',
    ];

    // Effect to populate form fields when fetchedStoreData is loaded or changes
    useEffect(() => {
        if (fetchedStoreData) {
            setStoreName(fetchedStoreData.name || userName || '');
            setStoreEmail(fetchedStoreData.email || '');
            setStorePhoneNumber(fetchedStoreData.phoneNumber || '');
            setShowPhoneOnProfile(fetchedStoreData.showPhoneOnProfile || false);
            setStoreLocation(fetchedStoreData.location || 'Lagos');
            setSelectedCategories(fetchedStoreData.categories || []);
            setProfileLogoPreview(fetchedStoreData.profilePictureUrl || null);
            setProfileBannerPreview(fetchedStoreData.bannerImageUrl || null);
            setPromotionalBannerPreview(fetchedStoreData.promotionalBannerImageUrl || null);
            setSelectedBrandColor(fetchedStoreData.brandColor || '#EF4444');
        } else if (isLoggedIn && userName) { // If no fetched data, but userName is available from Redux and logged in
            setStoreName(userName); // Initialize with username if no store data yet
        }
    }, [fetchedStoreData, userName, isLoggedIn]);

    // Effect to close modal and potentially refetch data in other components on successful update
    useEffect(() => {
        if (isUpdateSuccess) {
            onClose();
            // You might want to refetch data for NavBar or other components
            // by dispatching an action or triggering a refetch here.
            // For example, if you have a way to refetch all store profiles or a specific one:
            // dispatch(storeProfileApi.util.invalidateTags(['StoreProfile']));
            // Or if NavBar's useGetStoreProfileQuery has refetchOnMountOrArgChange: true,
            // it will refetch automatically when userId (arg) doesn't change but the modal closes and reopens.
            // If you need immediate refetch in other components without modal re-opening:
            // Consider refetching the specific query in Navbar, e.g., using `refetch` returned by its hook
            // or by invalidating the 'StoreProfile' tag if your API slice is set up for it.
        }
    }, [isUpdateSuccess, onClose]);

    if (!isOpen) return null;

    // Handle initial loading and error states for data fetching
    if (!isLoggedIn || !userId) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <div className="bg-white shadow-xl w-[430px] max-w-2xl h-[200px] flex items-center justify-center rounded-2xl">
                    <p className="text-lg font-semibold text-gray-700">Please log in to manage your store profile.</p>
                    <Button onClick={onClose} className="ml-4 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300">Close</Button>
                </div>
            </div>
        );
    }

    if (isLoading || isFetching) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <div className="bg-white shadow-xl w-[430px] max-w-2xl h-[200px] flex items-center justify-center rounded-2xl">
                    <p className="text-lg font-semibold text-gray-700">Loading store data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <div className="bg-white shadow-xl w-[430px] max-w-2xl h-[200px] flex items-center justify-center rounded-2xl">
                    <p className="text-lg font-semibold text-red-600">Error loading store data: {error.message || 'Unknown error'}</p>
                    <Button onClick={onClose} className="ml-4 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300">Close</Button>
                </div>
            </div>
        );
    }

    // Handle file upload for images
    const handleImageUpload = (e, setImagePreview) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result); // reader.result is the base64 string
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle category selection/deselection
    const handleCategoryToggle = (category) => {
        setSelectedCategories(prevCategories =>
            prevCategories.includes(category)
                ? prevCategories.filter(cat => cat !== category)
                : [...prevCategories, category]
        );
    };

    const handleSave = async () => {
        // Construct the updated data payload.
        // It's crucial that your backend API's update endpoint is set up
        // to receive the userId either from the payload or from a URL parameter
        // to identify which store profile to update.
        const updatedData = {
            id: userId, // <<< IMPORTANT: Pass the userId with the update payload
            name: storeName,
            email: storeEmail,
            phoneNumber: storePhoneNumber,
            showPhoneOnProfile,
            location: storeLocation,
            categories: selectedCategories,
            profilePictureUrl: profileLogoPreview,
            bannerImageUrl: profileBannerPreview,
            promotionalBannerImageUrl: promotionalBannerPreview,
            brandColor: selectedBrandColor,
        };

        try {
            // Call the mutation to update store data
            await updateStoreProfile(updatedData).unwrap(); // .unwrap() throws an error for failed mutations
            // The isUpdateSuccess useEffect will handle closing the modal and potential refetching
        } catch (err) {
            console.error('Failed to save store data:', err);
            // Optionally, display an error message to the user (e.g., with react-hot-toast)
            alert('Failed to save store profile. Please try again.'); // Simple alert for demonstration
        }
    };

    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-[430px] max-w-2xl h-[90vh] flex flex-col overflow-hidden">
                {/* Modal Header */}
                <div className="relative text-black p-4 rounded-t-2xl flex items-center justify-between">
                    <h2 className="text-xl font-bold mx-auto" style={{ fontFamily: 'Oleo Script' }}>Store Builder</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 absolute right-4 top-1/2 -translate-y-1/2">
                        <X size={24} />
                    </button>
                </div>

                {/* Modal Body - Scrollable Content */}
                <div className="flex-grow p-6 overflow-y-auto custom-scrollbar">
                    {/* Upload Logo Section */}
                    <div className="mb-6 text-center">
                        <p className="text-gray-700 font-semibold mb-3">Upload a logo for your store</p>
                        <div
                            className="relative w-28 h-28 mx-auto rounded-full border-4 border-gray-200 overflow-hidden group cursor-pointer"
                            onClick={() => profileLogoInputRef.current?.click()} // Trigger click on hidden input
                        >
                            <ImagePlaceholder
                                src={profileLogoPreview}
                                alt="Store Logo"
                                className="w-full h-full object-cover"
                                placeholderText="Logo"
                            />
                            <input
                                type="file"
                                accept="image/*"
                                ref={profileLogoInputRef} // Attach ref
                                className="hidden" // Hide the input visually
                                onChange={(e) => handleImageUpload(e, setProfileLogoPreview)}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <UploadCloud size={30} className="text-white" />
                            </div>
                        </div>
                    </div>

                    {/* Store Info Inputs */}
                    <div className="space-y-4 mb-6">
                        {/* Store Name */}
                        <div>
                            <label htmlFor="storeName" className="block text-sm text-gray-700 sr-only">Store Name</label>
                            <input
                                type="text"
                                id="storeName"
                                placeholder="Sasha Stores"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                                value={storeName}
                                onChange={(e) => setStoreName(e.target.value)}
                            />
                        </div>

                        {/* Email */}
                        <div className="relative">
                            <label htmlFor="storeEmail" className="block text-sm text-gray-700 sr-only">Email</label>
                            <div className="flex items-center border border-gray-300 rounded-lg focus-within:ring-red-500 focus-within:border-red-500">
                                <Mail size={20} className="text-gray-400 ml-3 mr-2" />
                                <input
                                    type="email"
                                    id="storeEmail"
                                    placeholder="sashastores@gmail.com"
                                    className="w-full p-3 pr-20 outline-none rounded-r-lg"
                                    value={storeEmail}
                                    onChange={(e) => setStoreEmail(e.target.value)}
                                />
                                <Button className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-200 text-gray-700 text-xs px-3 py-1.5 rounded-md hover:bg-gray-300">
                                    Verify
                                </Button>
                            </div>
                        </div>

                        {/* Phone Number with Toggle */}
                        <div className="flex items-center space-x-4">
                            <div className="flex-grow relative">
                                <label htmlFor="phoneNumber" className="block text-sm text-gray-700 sr-only">Phone Number</label>
                                <div className="flex items-center border border-gray-300 rounded-lg focus-within:ring-red-500 focus-within:border-red-500">
                                    <Phone size={20} className="text-gray-400 ml-3 mr-2" />
                                    <input
                                        type="tel"
                                        id="phoneNumber"
                                        placeholder="0901234456"
                                        className="w-full p-3 outline-none rounded-r-lg"
                                        value={storePhoneNumber}
                                        onChange={(e) => setStorePhoneNumber(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex border border-gray-300 rounded-lg justify-around h-[50px] items-center">
                            <span className="text-sm text-gray-700 mr-2 whitespace-nowrap">Show Phone on profile</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={showPhoneOnProfile}
                                    onChange={() => setShowPhoneOnProfile(!showPhoneOnProfile)}
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                            </label>
                        </div>

                        {/* Location Dropdown */}
                        <div className="relative">
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700 sr-only">Location</label>
                            <div className="flex items-center border border-gray-300 rounded-lg focus-within:ring-red-500 focus-within:border-red-500">
                                <MapPin size={20} className="text-gray-400 ml-3 mr-2" />
                                <select
                                    id="location"
                                    className="w-full p-3 outline-none rounded-r-lg appearance-none bg-white pr-8"
                                    value={storeLocation}
                                    onChange={(e) => setStoreLocation(e.target.value)}
                                >
                                    {locations.map(loc => (
                                        <option key={loc} value={loc}>{loc}</option>
                                    ))}
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <ChevronDown size={16} className="text-gray-400" />
                                </div>
                            </div>
                        </div>

                        {/* Categories Selection */}
                        <div className="relative">
                            <label htmlFor="categories" className="block text-sm font-medium text-gray-700 sr-only">Select Categories</label>
                            <div className="flex items-center border border-gray-300 rounded-lg focus-within:ring-red-500 focus-within:border-red-500">
                                {/* Add a generic tag icon if available, or leave without icon if none fits */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 ml-3 mr-2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
                                <select
                                    id="categories"
                                    className="w-full p-3 outline-none rounded-r-lg appearance-none bg-white pr-8"
                                    onChange={(e) => handleCategoryToggle(e.target.value)}
                                    value="" // Reset select value after selection
                                >
                                    <option value="" disabled>Select a categories</option>
                                    {availableCategories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <ChevronDown size={16} className="text-gray-400" />
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-3">
                                {selectedCategories.map((cat, index) => (
                                    <span
                                        key={index}
                                        className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center
                                            ${cat === 'Electronics' ? 'bg-blue-100 text-blue-700 border-blue-300' :
                                                cat === 'Phones' ? 'bg-red-100 text-red-700 border-red-300' :
                                                    'bg-gray-100 text-gray-700 border-gray-300'}
                                        `}
                                    >
                                        {cat}
                                        <button
                                            onClick={() => handleCategoryToggle(cat)}
                                            className="ml-1.5 text-gray-500 hover:text-gray-700 focus:outline-none"
                                        >
                                            <X size={12} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Upload Profile Banner */}
                    <div className="mb-6">
                        <p className="text-gray-700 font-semibold mb-3">Upload profile banner for your store</p>
                        <div
                            className="relative w-full h-32 bg-gray-200 rounded-lg overflow-hidden group cursor-pointer"
                            onClick={() => profileBannerInputRef.current?.click()} // Trigger click on hidden input
                        >
                            <ImagePlaceholder
                                src={profileBannerPreview}
                                alt="Profile Banner"
                                className="w-full h-full object-cover"
                                placeholderText="Profile Banner"
                            />
                            <input
                                type="file"
                                accept="image/*"
                                ref={profileBannerInputRef} // Attach ref
                                className="hidden" // Hide the input visually
                                onChange={(e) => handleImageUpload(e, setProfileBannerPreview)}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <UploadCloud size={40} className="text-white" />
                            </div>
                        </div>
                    </div>

                    {/* Upload Promotional Banner */}
                    <div className="mb-6">
                        <p className="text-gray-700 font-semibold mb-3">Upload promotional banner for your store</p>
                        <div
                            className="relative w-full h-32 bg-gray-200 rounded-lg overflow-hidden group cursor-pointer"
                            onClick={() => promotionalBannerInputRef.current?.click()} // Trigger click on hidden input
                        >
                            <ImagePlaceholder
                                src={promotionalBannerPreview}
                                alt="Promotional Banner"
                                className="w-full h-full object-cover"
                                placeholderText="Promotional Banner"
                            />
                            <input
                                type="file"
                                accept="image/*"
                                ref={promotionalBannerInputRef} // Attach ref
                                className="hidden" // Hide the input visually
                                onChange={(e) => handleImageUpload(e, setPromotionalBannerPreview)}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <UploadCloud size={40} className="text-white" />
                            </div>
                        </div>
                    </div>

                    {/* Color Palette */}
                    <div className="mb-6">
                        <p className="text-gray-700 font-semibold mb-3">Select a color that suits your brand and your store shall be customized as such</p>
                        <div className="grid grid-cols-5 gap-3">
                            {brandColors.map((color, index) => (
                                <div
                                    key={index}
                                    className={`w-10 h-10 rounded-full cursor-pointer border-2 ${selectedBrandColor === color ? 'border-redd ring-2 ring-redd' : 'border-gray-200'}`}
                                    style={{ backgroundColor: color }}
                                    onClick={() => setSelectedBrandColor(color)}
                                    aria-label={`Select color ${color}`}
                                ></div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-center">
                    <Button
                        onClick={handleSave}
                        className="bg-red-500 text-white py-3 px-8 rounded-lg font-semibold hover:bg-red-600 transition-colors"
                        disabled={isUpdating}
                    >
                        {isUpdating ? 'Saving...' : 'Save Details'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default StoreBuilderModal;