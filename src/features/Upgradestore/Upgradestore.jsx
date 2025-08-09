// UpgradeStorePage.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Import your existing Level components
// Adjust paths as per your project structure
import Level1 from '../../features/auth/pages/register/Level1';
import Level2 from '../../features/auth/pages/register/Level2';
import Level3 from '../../features/auth/pages/register/Level3';
import StepIndicator from '../../components/ui/StepIndicator'; // Horizontal StepIndicator
import VerticalStepIndicator from '../../components/ui/VerticalStepIndicator'; // Vertical StepIndicator
import CircularProgress from '../../components/ui/CircularProgress'; // Import the new CircularProgress component

// Import Redux slice actions and RTK Query hooks
import { updateField } from '../../features/auth/registrationSlice';
import { useGetStoreProfileQuery, useUpdateStoreProfileMutation } from '../../services/storeProfileApi';

import Button from '../../components/ui/Button'; // Assuming this path

// Icons (for sidebar benefits/requirements)
import { CheckCircleIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

/**
 * Helper function to determine contrast text color (black or white)
 * based on the background color's luminance.
 * @param {string} hexcolor - The background color in hex format (e.g., '#RRGGBB').
 * @returns {string} The contrast text color ('#000000' for dark background, '#FFFFFF' for light background).
 */
const getContrastTextColor = (hexcolor) => {
    if (!hexcolor || typeof hexcolor !== 'string') {
        return '#FFFFFF'; // Default to white if color is invalid
    }

    const cleanHex = hexcolor.startsWith('#') ? hexcolor.slice(1) : hexcolor;
    const expandedHex = cleanHex.length === 3
        ? cleanHex.split('').map(char => char + char).join('')
        : cleanHex;

    const r = parseInt(expandedHex.substring(0, 2), 16);
    const g = parseInt(expandedHex.substring(2, 4), 16);
    const b = parseInt(expandedHex.substring(4, 6), 16);

    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
};


/**
 * UpgradeStorePage Component
 * This component orchestrates the multi-step store upgrade process.
 * It manages the overall form data (via Redux), current step, and handles submission.
 * It fetches existing store profile data to pre-fill the form.
 * It reuses the existing Level1, Level2, Level3 components by passing a 'mode' prop.
 */
const UpgradeStorePage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Get user and form data from Redux store
    const { userId, isLoggedIn } = useSelector((state) => state.user);
    const { formData, profileCompletion } = useSelector((state) => state.registration);

    // Fetch existing store profile data using RTK Query
    const { data: currentStoreProfile, isLoading: isProfileLoading, error: profileError, refetch } = useGetStoreProfileQuery(userId, {
        skip: !isLoggedIn || !userId,
        refetchOnMountOrArgChange: true,
    });

    // Mutation hook for updating store data
    const [updateStoreProfile, { isLoading: isUpdating, isSuccess: isUpdateSuccess, error: updateError }] = useUpdateStoreProfileMutation();

    // Local state for current GLOBAL step in the upgrade process
    // Level1: 1,2,3 | Level2: 4,5 | Level3: 6,7
    const [currentStep, setCurrentStep] = useState(1);

    // Determine brand and contrast colors dynamically from formData.selectedColor
    const brandColor = formData.selectedColor || '#EF4444';
    const contrastColor = getContrastTextColor(brandColor);

    // Effect to populate form data in Redux when store profile is loaded
    useEffect(() => {
        if (currentStoreProfile) {
            dispatch(updateField({ name: 'storeName', value: currentStoreProfile.name || '' }));
            dispatch(updateField({ name: 'storeLocation', value: currentStoreProfile.location || '' }));
            dispatch(updateField({ name: 'categories', value: currentStoreProfile.categories || [] }));
            dispatch(updateField({ name: 'businessName', value: currentStoreProfile.businessName || '' }));
            dispatch(updateField({ name: 'businessType', value: currentStoreProfile.businessType || '' }));
            dispatch(updateField({ name: 'ninNumber', value: currentStoreProfile.ninNumber || '' }));
            dispatch(updateField({ name: 'cacNumber', value: currentStoreProfile.cacNumber || '' }));
            dispatch(updateField({ name: 'hasPhysicalStore', value: currentStoreProfile.hasPhysicalStore ?? false }));
            dispatch(updateField({ name: 'storeAddress', value: currentStoreProfile.storeAddress || { state: '', localGovernment: '', fullAddress: '', openingHours: [] } }));
            dispatch(updateField({ name: 'deliveryPricing', value: currentStoreProfile.deliveryPricing || [] }));
            dispatch(updateField({ name: 'selectedColor', value: currentStoreProfile.selectedColor || '#EF4444' }));
            dispatch(updateField({ name: 'addWhatsappLink', value: currentStoreProfile.whatsappLink || '' }));
            dispatch(updateField({ name: 'addInstagramLink', value: currentStoreProfile.instagramLink || '' }));
            dispatch(updateField({ name: 'addFacebookLink', value: currentStoreProfile.facebookLink || '' }));
            dispatch(updateField({ name: 'addTwitterLink', value: currentStoreProfile.twitterLink || '' }));
            dispatch(updateField({ name: 'level', value: currentStoreProfile.level || 'Level 1' })); // Corrected: Use 'level' for Redux state

            // For file fields, if the profile has a URL, we can store a placeholder object with the name
            // The actual File object won't be re-populated from a URL, it would need re-uploading if changed.
            if (currentStoreProfile.profilePictureUrl) {
                dispatch(updateField({ name: 'profilePicture', value: { name: 'existing_profile_picture.jpg', url: currentStoreProfile.profilePictureUrl } }));
            }
            if (currentStoreProfile.storeBannerUrl) {
                dispatch(updateField({ name: 'storeBanner', value: { name: 'existing_store_banner.jpg', url: currentStoreProfile.storeBannerUrl } }));
            }
            if (currentStoreProfile.ninSlipUrl) {
                dispatch(updateField({ name: 'ninSlip', value: { name: 'existing_nin_slip.pdf', url: currentStoreProfile.ninSlipUrl } }));
            }
            if (currentStoreProfile.cacCertificateUrl) {
                dispatch(updateField({ name: 'cacCertificate', value: { name: 'existing_cac_certificate.pdf', url: currentStoreProfile.cacCertificateUrl } }));
            }
            if (currentStoreProfile.storeVideoUrl) {
                dispatch(updateField({ name: 'storeVideo', value: { name: 'existing_store_video.mp4', url: currentStoreProfile.storeVideoUrl } }));
            }
        }
    }, [currentStoreProfile, dispatch]);

    // Handle form field changes (dispatches to Redux)
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        dispatch(updateField({ name, value: type === 'checkbox' ? checked : value }));
    };

    // Handle file changes (dispatches to Redux)
    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files && files[0]) {
            const file = files[0];
            // Store file metadata (name, size, type) and the file object itself in Redux state
            // NOTE: Storing File objects directly in Redux state is generally discouraged due to non-serializability.
            // For production, consider using a separate mechanism (e.g., local component state, or a dedicated file upload service)
            // to manage the actual File objects, and only store references/metadata in Redux.
            dispatch(updateField({ name, value: { name: file.name, size: file.size, type: file.type, fileObject: file } }));
        } else {
            // If file is cleared, remove from Redux
            dispatch(updateField({ name, value: null }));
        }
    };

    // Handle navigation to the next global step
    const handleNext = () => {
        setCurrentStep(prev => prev + 1);
    };

    // Handle navigation to the previous global step
    const handleBack = () => {
        setCurrentStep(prev => Math.max(1, prev - 1));
    };

    // Handle final form submission
    const handleSubmit = async () => {
        if (!isLoggedIn || !userId) {
            const showLoginRequiredModal = () => {
                const modal = document.createElement('div');
                modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50';
                modal.innerHTML = `
                    <div class="bg-white p-8 rounded-lg shadow-xl text-center">
                        <p class="text-lg font-semibold text-red-600 mb-4">You must be logged in to upgrade your store.</p>
                        <button id="closeLoginModal" class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">OK</button>
                    </div>
                `;
                document.body.appendChild(modal);
                document.getElementById('closeLoginModal').onclick = () => {
                    document.body.removeChild(modal);
                    navigate('/login');
                };
            };
            showLoginRequiredModal();
            return;
        }

        const dataToSend = new FormData();
        dataToSend.append('userId', userId);
        dataToSend.append('name', formData.storeName);
        dataToSend.append('location', formData.storeLocation);
        dataToSend.append('categories', JSON.stringify(formData.categories));
        dataToSend.append('businessName', formData.businessName);
        dataToSend.append('businessType', formData.businessType);
        dataToSend.append('ninNumber', formData.ninNumber);
        dataToSend.append('cacNumber', formData.cacNumber);
        dataToSend.append('hasPhysicalStore', formData.hasPhysicalStore);
        dataToSend.append('storeAddress', JSON.stringify(formData.storeAddress));
        dataToSend.append('deliveryPricing', JSON.stringify(formData.deliveryPricing));
        dataToSend.append('selectedColor', formData.selectedColor);
        dataToSend.append('whatsappLink', formData.addWhatsappLink);
        dataToSend.append('instagramLink', formData.addInstagramLink);
        dataToSend.append('facebookLink', formData.addFacebookLink);
        dataToSend.append('twitterLink', formData.addTwitterLink);
        dataToSend.append('level', formData.selectedUpgradeLevel);

        // Append actual File objects from the Redux state's fileObject property
        if (formData.profilePicture?.fileObject instanceof File) { dataToSend.append('profilePicture', formData.profilePicture.fileObject); }
        if (formData.storeBanner?.fileObject instanceof File) { dataToSend.append('storeBanner', formData.storeBanner.fileObject); }
        if (formData.ninSlip?.fileObject instanceof File) { dataToSend.append('ninSlip', formData.ninSlip.fileObject); }
        if (formData.cacCertificate?.fileObject instanceof File) { dataToSend.append('cacCertificate', formData.cacCertificate.fileObject); }
        if (formData.storeVideo?.fileObject instanceof File) { dataToSend.append('storeVideo', formData.storeVideo.fileObject); }

        try {
            await updateStoreProfile(dataToSend).unwrap();
            const showSuccessModal = () => {
                const modal = document.createElement('div');
                modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50';
                modal.innerHTML = `
                    <div class="bg-white p-8 rounded-lg shadow-xl text-center">
                        <p class="text-lg font-semibold text-green-600 mb-4">Store successfully upgraded to ${formData.selectedUpgradeLevel}!</p>
                        <button id="closeSuccessModal" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Go to My Store</button>
                    </div>
                `;
                document.body.appendChild(modal);
                document.getElementById('closeSuccessModal').onclick = () => {
                    document.body.removeChild(modal);
                    navigate('/store-upgrade'); // Navigate to store profile or dashboard after upgrade
                };
            };
            showSuccessModal();

        } catch (err) {
            console.error('Failed to upgrade store:', err);
            const showFailureModal = () => {
                const modal = document.createElement('div');
                modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50';
                modal.innerHTML = `
                    <div class="bg-white p-8 rounded-lg shadow-xl text-center">
                        <p class="text-lg font-semibold text-red-600 mb-4">Failed to upgrade store: ${err.data?.message || err.message || 'Unknown error'}</p>
                        <button id="closeErrorModal" class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">OK</button>
                    </div>
                `;
                document.body.appendChild(modal);
                document.getElementById('closeErrorModal').onclick = () => {
                    document.body.removeChild(modal);
                };
            };
            showFailureModal();
        }
    };

    if (!isLoggedIn) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Access Denied</h2>
                <p className="text-gray-700 mb-6">Please log in to upgrade your store.</p>
                <Button onClick={() => navigate('/login')} className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">
                    Go to Login
                </Button>
            </div>
        );
    }

    if (isProfileLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
                <p className="text-lg text-gray-700">Loading your store profile...</p>
            </div>
        );
    }

    if (profileError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
                <h2 className="2xl font-bold text-red-600 mb-4">Error Loading Profile</h2>
                <p className="text-red-600 mb-6">Could not load store data: {profileError.message || 'Unknown error'}</p>
                <Button onClick={() => refetch()} className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600">
                    Retry
                </Button>
            </div>
        );
    }

    // Define total steps for the progress indicator
    const totalSteps = 7; // Level1 (3 steps) + Level2 (2 steps) + Level3 (2 steps)

    // Dummy data for sidebar levels
    const sidebarLevels = [
        {
            id: 1,
            title: 'Level 1',
            completion: 80, // Added completion percentage for each level
            requirements: ['Level requirement 1', 'Level requirement 2'],
            benefits: ['Benefit 1', 'Benefit 2'],
        },
        {
            id: 2,
            title: 'Level 2',
            completion: 50, // Example completion
            requirements: ['Level requirement 1', 'Level requirement 2'],
            benefits: ['Benefit 1', 'Benefit 2'],
        },
        {
            id: 3,
            title: 'Level 3',
            completion: 20, // Example completion
            requirements: ['Level requirement 1', 'Level requirement 2'],
            benefits: ['Benefit 1', 'Benefit 2'],
        },
    ];

    // Inline styles for brand colors (re-defined here for UpgradeStorePage's own use)
    const brandBgStyle = { backgroundColor: brandColor };
    const brandTextStyle = { color: brandColor };
    const contrastTextStyle = { color: contrastColor };
    // FIX: Define brandHoverStyle here to make it accessible
    const brandHoverStyle = { filter: 'brightness(110%)' };


    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4 lg:p-8">

            <div className="relative flex w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Left Sidebar - Levels Overview */}
                <div className="hidden lg:flex flex-col w-[350px] bg-white p-8 border-r border-gray-200 space-y-6 overflow-y-auto">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Create Store</h1>
                    {/* Vertical Step Indicator and Level Cards */}
                    <div className="flex">
                        <VerticalStepIndicator
                            steps={[1, 2, 3]}
                            currentStep={Math.floor((currentStep - 1) / (totalSteps / 3)) + 1}
                            brandColor={brandColor}
                            contrastColor={contrastColor}
                        />

                        <div className="flex-1 space-y-6"> {/* Container for Level Cards */}
                            {sidebarLevels.map((level) => (
                                <div key={level.id} className="p-4 border border-gray-300 rounded-2xl shadow-sm">
                                    <div className="flex items-center justify-between mb-2">
                                        <h2 className="text-lg font-bold text-gray-800">{level.title}</h2> {/* Changed to font-bold */}
                                        {/* Replaced static div with CircularProgress component */}
                                        <CircularProgress
                                            percentage={level.completion}
                                            size={40}
                                            strokeWidth={4}
                                            color={brandColor}
                                            textColor={brandColor} // Text color matches brand color
                                        />
                                    </div>
                                    <p className="text-sm text-gray-600 mb-3">Percentage Completion</p> {/* Added text */}
                                    <p className="text-lg font-bold mb-4" style={brandTextStyle}>{level.completion}%</p> {/* Added percentage text */}

                                    <h3 className="text-sm font-semibold text-gray-700 mb-1">Level Requirements</h3>
                                    <ul className="text-sm text-gray-600 space-y-1 mb-3">
                                        {level.requirements.map((req, idx) => (
                                            <li key={idx} className="flex items-center">
                                                <CheckCircleIcon className="h-4 w-4 mr-2 text-green-500" /> {req}
                                            </li>
                                        ))}
                                    </ul>
                                    <h3 className="text-sm font-semibold text-gray-700 mb-1">Level Benefits</h3>
                                    <ul className="text-sm text-gray-600 space-y-1 mb-3">
                                        {level.benefits.map((benefit, idx) => (
                                            <li key={idx} className="flex items-center">
                                                <CheckCircleIcon className="h-4 w-4 mr-2 text-green-500" /> {benefit}
                                            </li>
                                        ))}
                                    </ul>
                                    <Button
                                        className="w-full py-3 rounded-[15px] text-base shadow-md" // Adjusted styling for button
                                        style={{ backgroundColor: brandColor, color: contrastColor, ...brandHoverStyle }}
                                    >
                                        View Details
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Content Area - Form Steps */}
                <div className="flex-1 p-6 md:p-8 flex flex-col">
                    {/* Progress Bar (visible on both small and large screens) */}
                    <div className="w-full bg-gray-200 rounded-full h-4 mb-8">
                        <div
                            className="h-4 rounded-full"
                            style={{ width: `${profileCompletion}%`, backgroundColor: brandColor }}
                        ></div>
                        <p className="text-center text-sm mt-2 text-gray-600">{profileCompletion}% Complete</p>
                    </div>

                    {/* Render current step component */}
                    {currentStep >= 1 && currentStep <= 3 && (
                        <Level1
                            formData={formData}
                            handleChange={handleChange}
                            handleFileChange={handleFileChange}
                            onNext={handleNext}
                            onBack={handleBack}
                            currentStep={currentStep}
                            mode="upgrade"
                            brandColor={brandColor}
                            contrastColor={contrastColor}
                        />
                    )}
                    {currentStep >= 4 && currentStep <= 5 && (
                        <Level2
                            formData={formData}
                            handleChange={handleChange}
                            handleFileChange={handleFileChange}
                            onNext={handleNext}
                            onBack={handleBack}
                            currentStep={currentStep}
                            mode="upgrade"
                            brandColor={brandColor}
                            contrastColor={contrastColor}
                        />
                    )}
                    {currentStep >= 6 && currentStep <= 7 && (
                        <Level3
                            formData={formData}
                            handleChange={handleChange}
                            handleFileChange={handleFileChange}
                            onBack={handleBack}
                            onSubmit={handleSubmit}
                            currentStep={currentStep}
                            mode="upgrade"
                            brandColor={brandColor}
                            contrastColor={contrastColor}
                        />
                    )}

                    {/* Navigation Buttons (Outside individual level components for consistent placement) */}
                    <div className="flex justify-between mt-8 pt-4 border-t border-gray-200">
                        {currentStep === totalSteps && (
                            <Button
                                onClick={handleSubmit}
                                className={`w-full py-2 px-4 rounded-lg transition-colors`}
                                style={{ backgroundColor: brandColor, color: contrastColor }}
                                disabled={isUpdating}
                            >
                                {isUpdating ? 'Upgrading...' : 'Confirm Upgrade'}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpgradeStorePage;
