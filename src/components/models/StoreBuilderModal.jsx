import React, { useEffect, useRef, useReducer } from 'react';
import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { X, UploadCloud, ChevronDown, Mail, Phone, MapPin, Loader2 } from 'lucide-react';
import Button from '../ui/Button';
import ImagePlaceholder from '../ui/ImagePlaceholder';
import { useToast } from '../ui/ToastProvider';
import { useStoreBuilderQuery, useUpdateStoreBuilderMutation } from '../../services/queries/storeBuilderQueries';
import { apiRequest } from '../../api/apiClient';
import { ENDPOINTS } from '../../api/apiConfig';
import { states } from '../../utils/locationData';

// Helper to safely map API data to local state structure
const mapApiDataToState = (data) => ({
    storeName: data?.store_name || '',
    email: data?.store_email || '',
    phoneNumber: data?.store_phone || '',
    showPhoneOnProfile: !!data?.show_phone_on_profile,
    location: data?.store_location || 'Lagos',
    categories: data?.categories?.map(c => c.id) || [],
    profilePictureUrl: data?.profile_image || null,
    bannerImageUrl: data?.banner_image || null,
    promotionalBannerImageUrl: data?.promotional_banner || null,
    brandColor: data?.theme_color || '#EF4444',
    newProfileFile: null,
    newBannerFile: null,
    newPromoFile: null,
});

const initialProfile = mapApiDataToState(null); // Initialize with default values

function profileReducer(state, action) {
    switch (action.type) {
        case 'INIT': 
            // Use the mapApiDataToState helper to ensure all fields are correctly initialized
            return { ...state, ...mapApiDataToState(action.payload) };
        case 'SET_FIELD': 
            return { ...state, [action.field]: action.value };
        case 'SET_IMAGE': 
            return { ...state, [action.field]: action.file, [action.previewField]: action.previewUrl };
        case 'TOGGLE_CATEGORY': {
            const has = state.categories.includes(action.categoryId);
            return { ...state, categories: has ? state.categories.filter(id => id !== action.categoryId) : [...state.categories, action.categoryId] };
        }
        default: return state;
    }
}

const StoreBuilderModal = ({ isOpen, onClose }) => {
    const { push } = useToast();
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    // 1. Fetch existing store data
    const { data: fetchedStoreData, isLoading: profileLoading, error: profileError } = useStoreBuilderQuery({
        enabled: !!isAuthenticated,
    });

    // 2. Mutation for updating the store
    const { mutate: updateStore, isLoading: isUpdating } = useUpdateStoreBuilderMutation({
        onSuccess: () => {
            push('Store details saved successfully!', { type: 'success' });
            onClose();
        },
        onError: (err) => {
            push(err.data?.message || 'Failed to save details.', { type: 'error' });
        }
    });

    // 3. Fetch categories
    const { data: availableCategoriesData, isLoading: categoriesLoading } = useQuery({
        queryKey: ['allCategories'],
        queryFn: () => apiRequest({ url: ENDPOINTS.SELLER_ONBOARDING.CATALOG.CATEGORIES }),
        staleTime: Infinity,
    });
    const availableCategories = availableCategoriesData?.items || [];

    const [storeProfile, dispatch] = useReducer(profileReducer, initialProfile);
    const fileInputRefs = { profileLogo: useRef(null), profileBanner: useRef(null), promotionalBanner: useRef(null) };
    const brandColors = ['#EF4444', '#3B82F6', '#008000', '#FFA500', '#800080', '#FFC0CB', '#00CED1', '#FFD700', '#A52A2A', '#06B6D4', '#6D28D9', '#EAB308', '#EC4899', '#16A34A', '#0000FF'];

    // 4. Initialization Logic (Populates form with fetched data)
    useEffect(() => {
        if (fetchedStoreData) {
            // When data is available, initialize the state
            dispatch({ type: 'INIT', payload: fetchedStoreData });
        } else if (isAuthenticated && user?.full_name) {
            // If authenticated but no store data yet, use the user's name as a default store name
            dispatch({ type: 'SET_FIELD', field: 'storeName', value: user.full_name });
        }
    }, [fetchedStoreData, user, isAuthenticated]);

    const handleImageUpload = (e, field, previewField) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const previewUrl = URL.createObjectURL(file);
        // Field will be newProfileFile, newBannerFile, etc.
        dispatch({ type: 'SET_IMAGE', field, file, previewField, previewUrl });
    };

    const handleCategoryToggle = (categoryId) => {
        const id = parseInt(categoryId, 10);
        if (!isNaN(id)) dispatch({ type: 'TOGGLE_CATEGORY', categoryId: id });
    };

    const handleSave = () => {
        const formDataToSubmit = new FormData();
        
        // Append all text fields
        formDataToSubmit.append('store_name', storeProfile.storeName);
        formDataToSubmit.append('store_email', storeProfile.email);
        formDataToSubmit.append('store_phone', storeProfile.phoneNumber);
        formDataToSubmit.append('show_phone_on_profile', storeProfile.showPhoneOnProfile ? '1' : '0');
        formDataToSubmit.append('store_location', storeProfile.location);
        formDataToSubmit.append('theme_color', storeProfile.brandColor);
        
        // Append categories array
        storeProfile.categories.forEach(catId => formDataToSubmit.append('categories[]', catId));
        
        // Append new file uploads (only if a new file was selected)
        if (storeProfile.newProfileFile) formDataToSubmit.append('profile_image', storeProfile.newProfileFile);
        if (storeProfile.newBannerFile) formDataToSubmit.append('banner_image', storeProfile.newBannerFile);
        if (storeProfile.newPromoFile) formDataToSubmit.append('promotional_banner', storeProfile.newPromoFile);
        
        updateStore(formDataToSubmit);
    };

    if (!isOpen) return null;

    if (!isAuthenticated) {
        // You'll need to add a proper unauthenticated state render here
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-inter">
            <div className="bg-white rounded-2xl shadow-xl w-[430px] max-w-2xl h-[90vh] flex flex-col overflow-hidden">
                <div className="relative text-black p-4 rounded-t-2xl flex items-center justify-between border-b">
                    <h2 className="text-xl font-bold mx-auto" style={{ fontFamily: 'Oleo Script' }}>Store Builder</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition-colors">
                        <X size={24} />
                    </button>
                </div>
                <div className="flex-grow p-6 overflow-y-auto custom-scrollbar relative">
                    {(profileLoading || categoriesLoading) && <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-20"><Loader2 className="h-8 w-8 animate-spin text-red-500" /></div>}
                    {profileError && <p className="text-center text-red-600">Error: {profileError.message}</p>}

                    <div className="mb-6 text-center">
                        <p className="text-gray-700 font-semibold mb-3">Upload a logo for your store</p>
                        <div className="relative w-28 h-28 mx-auto rounded-full border-4 border-gray-200 overflow-hidden group cursor-pointer" onClick={() => fileInputRefs.profileLogo.current?.click()}>
                            <ImagePlaceholder src={storeProfile.profilePictureUrl} alt="Store Logo" className="w-full h-full object-cover rounded-full" placeholderText="Logo" />
                            <input type="file" accept="image/*" ref={fileInputRefs.profileLogo} className="hidden" onChange={(e) => handleImageUpload(e, 'newProfileFile', 'profilePictureUrl')} />
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><UploadCloud size={30} className="text-white" /></div>
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-4 mb-6">
                        {/* Store Name */}
                        <input type="text" id="storeName" placeholder="Sasha Stores" className="w-full p-3 border border-gray-300 rounded-lg" value={storeProfile.storeName} onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'storeName', value: e.target.value })} />
                        
                        {/* Store Email (with Verify button) */}
                        <div className="relative">
                            <div className="flex items-center border border-gray-300 rounded-lg">
                                <Mail size={20} className="text-gray-400 ml-3 mr-2" />
                                <input type="email" id="storeEmail" placeholder="sashastores@gmail.com" className="w-full p-3 pr-20 outline-none rounded-r-lg" value={storeProfile.email} onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'email', value: e.target.value })} />
                                <Button className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-200 text-gray-700 text-xs px-3 py-1.5 rounded-md">Verify</Button>
                            </div>
                        </div>
                        
                        {/* Phone Number */}
                        <div className="flex items-center space-x-4">
                            <div className="flex-grow relative">
                                <div className="flex items-center border border-gray-300 rounded-lg">
                                    <Phone size={20} className="text-gray-400 ml-3 mr-2" />
                                    <input type="tel" id="phoneNumber" placeholder="0901234456" className="w-full p-3 outline-none rounded-r-lg" value={storeProfile.phoneNumber} onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'phoneNumber', value: e.target.value })} />
                                </div>
                            </div>
                        </div>
                        
                        {/* Show Phone Toggle */}
                        <div className="flex border border-gray-300 rounded-lg justify-around h-[50px] items-center">
                            <span className="text-sm text-gray-700 mr-2 whitespace-nowrap">Show Phone on profile</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" checked={storeProfile.showPhoneOnProfile} onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'showPhoneOnProfile', value: e.target.checked })} />
                                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                            </label>
                        </div>
                        
                        {/* Location/State Select */}
                        <div className="relative">
                            <div className="flex items-center border border-gray-300 rounded-lg">
                                <MapPin size={20} className="text-gray-400 ml-3 mr-2" />
                                <select id="location" className="w-full p-3 outline-none rounded-r-lg appearance-none bg-white pr-8" value={storeProfile.location} onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'location', value: e.target.value })}>
                                    {states.map((s) => <option key={s.name} value={s.name}>{s.name}</option>)}
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"><ChevronDown size={16} className="text-gray-400" /></div>
                            </div>
                        </div>
                        
                        {/* Categories Select and Tags */}
                        <div className="relative">
                            <div className="flex items-center border border-gray-300 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 ml-3 mr-2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
                                <select id="categories" className="w-full p-3 outline-none rounded-r-lg appearance-none bg-white pr-8" onChange={(e) => handleCategoryToggle(e.target.value)} value="">
                                    <option value="" disabled>Select a category</option>
                                    {availableCategories.map((cat) => <option key={cat.id} value={cat.id}>{cat.title}</option>)}
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"><ChevronDown size={16} className="text-gray-400" /></div>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-3">
                                {storeProfile.categories.map((catId) => { 
                                    const category = availableCategories.find(c => c.id === catId); 
                                    return category ? (
                                        <span key={catId} className="px-3 py-1 rounded-full text-xs font-semibold border bg-gray-100 text-gray-700 border-gray-300 flex items-center">
                                            {category.title}
                                            <button onClick={() => handleCategoryToggle(catId)} className="ml-1.5 text-gray-500 hover:text-gray-700">
                                                <X size={12} />
                                            </button>
                                        </span>
                                    ) : null;
                                })}
                            </div>
                        </div>
                    </div>
                    
                    {/* Profile Banner Upload */}
                    <div className="mb-6">
                        <p className="text-gray-700 font-semibold mb-3">Upload profile banner for your store</p>
                        <div className="relative w-full h-32 bg-gray-200 rounded-lg group cursor-pointer" onClick={() => fileInputRefs.profileBanner.current?.click()}>
                            <ImagePlaceholder src={storeProfile.bannerImageUrl} alt="Profile Banner" className="w-full h-full object-cover" placeholderText="Profile Banner" />
                            <input type="file" accept="image/*" ref={fileInputRefs.profileBanner} className="hidden" onChange={(e) => handleImageUpload(e, 'newBannerFile', 'bannerImageUrl')} />
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><UploadCloud size={40} className="text-white" /></div>
                        </div>
                    </div>
                    
                    {/* Promotional Banner Upload */}
                    <div className="mb-6">
                        <p className="text-gray-700 font-semibold mb-3">Upload promotional banner for your store</p>
                        <div className="relative w-full h-32 bg-gray-200 rounded-lg group cursor-pointer" onClick={() => fileInputRefs.promotionalBanner.current?.click()}>
                            <ImagePlaceholder src={storeProfile.promotionalBannerImageUrl} alt="Promotional Banner" className="w-full h-full object-cover" placeholderText="Promotional Banner" />
                            <input type="file" accept="image/*" ref={fileInputRefs.promotionalBanner} className="hidden" onChange={(e) => handleImageUpload(e, 'newPromoFile', 'promotionalBannerImageUrl')} />
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><UploadCloud size={40} className="text-white" /></div>
                        </div>
                    </div>
                    
                    {/* Brand Color Selector */}
                    <div className="mb-6">
                        <p className="text-gray-700 font-semibold mb-3">Select a color that suits your brand and your store shall be customized as such</p>
                        <div className="grid grid-cols-5 gap-3">
                            {brandColors.map((color) => (
                                <div 
                                    key={color} 
                                    className={`w-10 h-10 rounded-full cursor-pointer border-2 transition-all ${storeProfile.brandColor === color ? 'border-red-500 ring-2 ring-red-500' : 'border-gray-200'}`} 
                                    style={{ backgroundColor: color }} 
                                    onClick={() => dispatch({ type: 'SET_FIELD', field: 'brandColor', value: color })} 
                                />
                            ))}
                        </div>
                    </div>
                </div>
                
                {/* Footer Save Button */}
                <div className="p-4 bg-gray-50 border-t flex flex-col items-center">
                    <Button onClick={handleSave} className="bg-red-500 text-white py-3 px-8 rounded-lg font-semibold hover:bg-red-600 transition-colors w-full" disabled={isUpdating}>
                        {isUpdating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin inline" /> Saving...</> : 'Save Details'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default StoreBuilderModal;