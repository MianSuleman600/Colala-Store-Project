// src/components/StoreBuilderModal.jsx

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { X, UploadCloud, ChevronDown, Mail, Phone, MapPin, Loader2 } from 'lucide-react';
import Button from '../ui/Button';
import ImagePlaceholder from '../ui/ImagePlaceholder';
import { useGetStoreProfileQuery, useUpdateStoreProfileMutation } from '../../services/storeProfileApi';
import { useSelector } from 'react-redux';

/**
 * StoreBuilderModal Component
 * A modal for users to build and customize their store profile.
 *
 * @param {object} props
 * @param {boolean} props.isOpen - Controls the visibility of the modal.
 * @param {function} props.onClose - Callback function to close the modal.
 */
const StoreBuilderModal = ({
    isOpen,
    onClose
}) => {
    // Get user info from Redux state for initial form population and API calls.
    const { userName, userId, isLoggedIn } = useSelector((state) => state.user);

    // RTK Query hook to fetch the store profile data.
    const {
        data: fetchedStoreData,
        error,
        isLoading: isFetching,
    } = useGetStoreProfileQuery(userId, {
        skip: !isOpen || !isLoggedIn || !userId,
        refetchOnMountOrArgChange: true,
    });

    // RTK Query hook to handle the mutation (update operation).
    const [
        updateStoreProfile,
        {
            isLoading: isUpdating,
            isSuccess: isUpdateSuccess,
            error: updateError,
            reset
        }
    ] = useUpdateStoreProfileMutation();

    // State to manage local form fields.
    const [storeProfile, setStoreProfile] = useState({
        storeName: '',
        email: '',
        phoneNumber: '',
        showPhoneOnProfile: false,
        location: 'Lagos',
        categories: [],
        profilePictureUrl: null,
        bannerImageUrl: null,
        promotionalBannerImageUrl: null,
        brandColor: '#EF4444',
    });

    // Refs for file inputs, allowing for programmatic clicks.
    const fileInputRefs = {
        profileLogo: useRef(null),
        profileBanner: useRef(null),
        promotionalBanner: useRef(null),
    };

    // Mock data for dropdowns and colors.
    const locations = ['Lagos', 'Abuja', 'Port Harcourt', 'Ibadan'];
    const availableCategories = ['Electronics', 'Phones', 'Fashion', 'Groceries', 'Books', 'Home Goods'];
    const brandColors = [
        '#EF4444', '#3B82F6', '#008000', '#FFA500', '#800080',
        '#FFC0CB', '#00CED1', '#FFD700', '#A52A2A', '#06B6D4',
        '#6D28D9', '#EAB308', '#EC4899', '#16A34A', '#0000FF',
    ];

    // Effect to populate form fields when data is loaded from the API.
    useEffect(() => {
        if (fetchedStoreData) {
            setStoreProfile({
                storeName: fetchedStoreData.storeName || userName || '',
                email: fetchedStoreData.email || '',
                phoneNumber: fetchedStoreData.phoneNumber || '',
                showPhoneOnProfile: fetchedStoreData.showPhoneOnProfile || false,
                location: fetchedStoreData.location || 'Lagos',
                categories: Array.isArray(fetchedStoreData.categories) ? fetchedStoreData.categories : [],
                profilePictureUrl: fetchedStoreData.profilePictureUrl || null,
                bannerImageUrl: fetchedStoreData.bannerImageUrl || null,
                promotionalBannerImageUrl: fetchedStoreData.promotionalBannerImageUrl || null,
                brandColor: fetchedStoreData.brandColor || '#EF4444',
            });
        } else if (isLoggedIn && userName) {
            setStoreProfile(prev => ({ ...prev, storeName: userName }));
        }
    }, [fetchedStoreData, userName, isLoggedIn]);

    // Effect to handle modal closing on successful update.
    useEffect(() => {
        if (isUpdateSuccess) {
            onClose();
            reset();
        }
    }, [isUpdateSuccess, onClose, reset]);

    const handleImageUpload = useCallback((e, imageType) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setStoreProfile(prev => ({
                    ...prev,
                    [imageType]: reader.result,
                }));
            };
            reader.readAsDataURL(file);
        }
    }, []);

    const handleCategoryToggle = useCallback((category) => {
        setStoreProfile(prev => {
            const { categories } = prev;
            const newCategories = categories.includes(category)
                ? categories.filter(cat => cat !== category)
                : [...categories, category];
            return { ...prev, categories: newCategories };
        });
    }, []);

    const handleSave = useCallback(async () => {
        if (!userId) {
            console.error("User ID is missing. Cannot save store data.");
            return;
        }

        if (!storeProfile) {
            console.error("Store profile data is not available. Cannot save.");
            return;
        }

        try {
            // FIX: Pass the payload in the correct format { id: ..., data: ... }
            await updateStoreProfile({
                id: userId,
                data: storeProfile, // Pass the storeProfile object as the 'data' key
            }).unwrap();
        } catch (err) {
            console.error('Failed to save store data:', err);
        }
    }, [storeProfile, userId, updateStoreProfile]);

    const MemoizedModal = useMemo(() => {
        if (!isOpen) return null;

        if (!isLoggedIn || !userId) {
            return (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white shadow-xl w-[430px] max-w-2xl h-[200px] flex flex-col items-center justify-center rounded-2xl">
                        <p className="text-lg font-semibold text-gray-700">Please log in to manage your store profile.</p>
                        <Button onClick={onClose} className="mt-4 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300">Close</Button>
                    </div>
                </div>
            );
        }

        return (
            <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 z-50 flex items-center justify-center p-4 font-inter">
                <div className="bg-white rounded-2xl shadow-xl w-[430px] max-w-2xl h-[90vh] flex flex-col overflow-hidden">
                    {/* Modal Header */}
                    <div className="relative text-black p-4 rounded-t-2xl flex items-center justify-between">
                        <h2 className="text-xl font-bold mx-auto" style={{ fontFamily: 'Oleo Script' }}>Store Builder</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Modal Body - Scrollable Content */}
                    <div className="flex-grow p-6 overflow-y-auto custom-scrollbar">
                        {/* Show fetching loader or error message */}
                        {(isFetching) && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80">
                                <Loader2 className="h-8 w-8 animate-spin text-red-500" />
                            </div>
                        )}
                        {(error) && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 p-4">
                                <p className="text-center text-lg font-semibold text-red-600">
                                    Error: {error.message || 'Could not load store data.'}
                                </p>
                            </div>
                        )}

                        {/* Upload Logo Section */}
                        <div className="mb-6 text-center">
                            <p className="text-gray-700 font-semibold mb-3">Upload a logo for your store</p>
                            <div
                                className="relative w-28 h-28 mx-auto rounded-full border-4 border-gray-200 overflow-hidden group cursor-pointer"
                                onClick={() => fileInputRefs.profileLogo.current?.click()}
                            >
                                <ImagePlaceholder
                                    src={storeProfile.profilePictureUrl}
                                    alt="Store Logo"
                                    className="w-full h-full object-cover"
                                    placeholderText="Logo"
                                />
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={fileInputRefs.profileLogo}
                                    className="hidden"
                                    onChange={(e) => handleImageUpload(e, 'profilePictureUrl')}
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
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 transition-colors"
                                    value={storeProfile.storeName}
                                    onChange={(e) => setStoreProfile(prev => ({ ...prev, storeName: e.target.value }))}
                                />
                            </div>

                            {/* Email */}
                            <div className="relative">
                                <label htmlFor="storeEmail" className="block text-sm text-gray-700 sr-only">Email</label>
                                <div className="flex items-center border border-gray-300 rounded-lg focus-within:ring-red-500 focus-within:border-red-500 transition-colors">
                                    <Mail size={20} className="text-gray-400 ml-3 mr-2" />
                                    <input
                                        type="email"
                                        id="storeEmail"
                                        placeholder="sashastores@gmail.com"
                                        className="w-full p-3 pr-20 outline-none rounded-r-lg"
                                        value={storeProfile.email}
                                        onChange={(e) => setStoreProfile(prev => ({ ...prev, email: e.target.value }))}
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
                                    <div className="flex items-center border border-gray-300 rounded-lg focus-within:ring-red-500 focus-within:border-red-500 transition-colors">
                                        <Phone size={20} className="text-gray-400 ml-3 mr-2" />
                                        <input
                                            type="tel"
                                            id="phoneNumber"
                                            placeholder="0901234456"
                                            className="w-full p-3 outline-none rounded-r-lg"
                                            value={storeProfile.phoneNumber}
                                            onChange={(e) => setStoreProfile(prev => ({ ...prev, phoneNumber: e.target.value }))}
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
                                        checked={storeProfile.showPhoneOnProfile}
                                        onChange={(e) => setStoreProfile(prev => ({ ...prev, showPhoneOnProfile: e.target.checked }))}
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                                </label>
                            </div>

                            {/* Location Dropdown */}
                            <div className="relative">
                                <label htmlFor="location" className="block text-sm font-medium text-gray-700 sr-only">Location</label>
                                <div className="flex items-center border border-gray-300 rounded-lg focus-within:ring-red-500 focus-within:border-red-500 transition-colors">
                                    <MapPin size={20} className="text-gray-400 ml-3 mr-2" />
                                    <select
                                        id="location"
                                        className="w-full p-3 outline-none rounded-r-lg appearance-none bg-white pr-8"
                                        value={storeProfile.location}
                                        onChange={(e) => setStoreProfile(prev => ({ ...prev, location: e.target.value }))}
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
                                <div className="flex items-center border border-gray-300 rounded-lg focus-within:ring-red-500 focus-within:border-red-500 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 ml-3 mr-2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
                                    <select
                                        id="categories"
                                        className="w-full p-3 outline-none rounded-r-lg appearance-none bg-white pr-8"
                                        onChange={(e) => handleCategoryToggle(e.target.value)}
                                        value=""
                                    >
                                        <option value="" disabled>Select a category</option>
                                        {availableCategories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <ChevronDown size={16} className="text-gray-400" />
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {storeProfile.categories.map((cat, index) => (
                                        <span
                                            key={index}
                                            className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center
                                                ${cat === 'Electronics' ? 'bg-blue-100 text-blue-700 border-blue-300' :
                                                cat === 'Phones' ? 'bg-red-100 text-red-700 border-red-300' :
                                                'bg-gray-100 text-gray-700 border-gray-300'
                                            }`}
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
                                onClick={() => fileInputRefs.profileBanner.current?.click()}
                            >
                                <ImagePlaceholder
                                    src={storeProfile.bannerImageUrl}
                                    alt="Profile Banner"
                                    className="w-full h-full object-cover"
                                    placeholderText="Profile Banner"
                                />
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={fileInputRefs.profileBanner}
                                    className="hidden"
                                    onChange={(e) => handleImageUpload(e, 'bannerImageUrl')}
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
                                onClick={() => fileInputRefs.promotionalBanner.current?.click()}
                            >
                                <ImagePlaceholder
                                    src={storeProfile.promotionalBannerImageUrl}
                                    alt="Promotional Banner"
                                    className="w-full h-full object-cover"
                                    placeholderText="Promotional Banner"
                                />
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={fileInputRefs.promotionalBanner}
                                    className="hidden"
                                    onChange={(e) => handleImageUpload(e, 'promotionalBannerImageUrl')}
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
                                        className={`w-10 h-10 rounded-full cursor-pointer border-2 transition-all duration-200
                                            ${storeProfile.brandColor === color ? 'border-red-500 ring-2 ring-red-500' : 'border-gray-200'}`}
                                        style={{ backgroundColor: color }}
                                        onClick={() => setStoreProfile(prev => ({ ...prev, brandColor: color }))}
                                        aria-label={`Select color ${color}`}
                                    ></div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="p-4 bg-gray-50 border-t border-gray-200 flex flex-col items-center">
                        {/* Display any save error messages */}
                        {updateError && (
                            <p className="text-sm text-red-500 mb-2">{updateError.data.data}</p>
                        )}
                        <Button
                            onClick={handleSave}
                            className="bg-red-500 text-white py-3 px-8 rounded-lg font-semibold hover:bg-red-600 transition-colors w-full"
                            disabled={isUpdating}
                        >
                            {isUpdating ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
                                    Saving...
                                </>
                            ) : (
                                'Save Details'
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        );
    }, [isOpen, isLoggedIn, userId, fetchedStoreData, isUpdating, isUpdateSuccess, error, updateError, storeProfile, userName, onClose, handleImageUpload, handleCategoryToggle, handleSave]);

    return MemoizedModal;
};

export default StoreBuilderModal;
