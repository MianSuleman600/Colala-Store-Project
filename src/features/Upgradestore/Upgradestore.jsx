// UpgradeStorePage.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Import your existing Level components
import Level1 from '../../features/auth/pages/register/Level1';
import Level2 from '../../features/auth/pages/register/Level2';
import Level3 from '../../features/auth/pages/register/Level3';
import CircularProgress from '../../components/ui/CircularProgress';
import SuccessModal from '../../components/models/SuccessModal'; // Reusable modal
import ErrorModal from '../../components/models/ErrorModal';     // Reusable modal

// Import Redux slice actions and RTK Query hooks
import { updateField, setStep, resetRegistration } from '../../features/auth/registrationSlice';
import { useGetStoreProfileQuery, useUpdateStoreProfileMutation } from '../../services/storeProfileApi';

// Import Tailwind components
import Button from '../../components/ui/Button';

// Icons
import { CheckCircleIcon } from '@heroicons/react/24/outline';

// IMPORTANT: Removed duplicated getContrastTextColor.
// Now importing it from the single source of truth utility file.
import { getContrastTextColor } from '../../utils/colorUtils';

const UpgradeStorePage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { userId, isLoggedIn } = useSelector((state) => state.user);
    const { formData, profileCompletion, currentStep } = useSelector((state) => state.registration);

    // Local state for non-serializable File objects
    const [filesToUpload, setFilesToUpload] = useState({});
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [modalErrorMessage, setModalErrorMessage] = useState('');
    
    // RTK Query hooks
    const { data: currentStoreProfile, isLoading: isProfileLoading, error: profileError, refetch } = useGetStoreProfileQuery(userId, {
        skip: !isLoggedIn || !userId,
        refetchOnMountOrArgChange: true,
    });
    const [updateStoreProfile, { isLoading: isUpdating, isSuccess: isUpdateSuccess, error: updateError }] = useUpdateStoreProfileMutation();

    // Effect to reset form state on component unmount
    useEffect(() => {
        return () => {
            dispatch(resetRegistration());
        };
    }, [dispatch]);

    // Effect to populate form data when profile is loaded from the API
    useEffect(() => {
        if (currentStoreProfile) {
            for (const key in currentStoreProfile) {
                const value = currentStoreProfile[key];
                if (value !== null && value !== undefined) {
                    // Explicitly handle boolean values from the API to avoid the "string `false`" warning.
                    let processedValue = value;
                    if (typeof value === 'string') {
                        if (value === 'true') processedValue = true;
                        if (value === 'false') processedValue = false;
                    }
                    dispatch(updateField({ name: key, value: processedValue }));
                }
            }
            // Add a check to explicitly set the selectedColor from the fetched brandColor.
            if (currentStoreProfile.brandColor) {
                dispatch(updateField({ name: 'selectedColor', value: currentStoreProfile.brandColor }));
            }
        }
    }, [currentStoreProfile, dispatch]);

    // Effect to handle success/error states after a mutation
    useEffect(() => {
        if (isUpdateSuccess) {
            setShowSuccessModal(true);
            // Call the refetch function to get the latest data from the server.
            refetch();
        }
        if (updateError) {
            setModalErrorMessage(updateError.data?.message || 'An unknown error occurred during the update.');
            setShowErrorModal(true);
        }
    }, [isUpdateSuccess, updateError, refetch]); // Add refetch to dependency array

    // Derived state for colors
    const brandColor = currentStoreProfile?.brandColor  || '#EF4444';
    const contrastColor = getContrastTextColor(brandColor);

    const commonProps = {
        formData,
        handleChange: (e) => {
            const { name, value, type, checked } = e.target;
            dispatch(updateField({ name, value: type === 'checkbox' ? checked : value }));
        },
        handleFileChange: (e) => {
            const { name, files } = e.target;
            if (files && files[0]) {
                const file = files[0];
                dispatch(updateField({ name, value: { name: file.name, size: file.size, type: file.type } }));
                setFilesToUpload(prev => ({ ...prev, [name]: file }));
            } else {
                dispatch(updateField({ name, value: null }));
                setFilesToUpload(prev => {
                    const newState = { ...prev };
                    delete newState[name];
                    return newState;
                });
            }
        },
        onNext: () => dispatch(setStep(currentStep + 1)),
        onBack: () => dispatch(setStep(currentStep - 1)),
        onSubmit: async () => {
            if (!isLoggedIn || !userId) return;
            
            const dataToSend = new FormData();
            
            for (const key in formData) {
                // Check if we have an actual file object to upload
                if (filesToUpload[key]) {
                    dataToSend.append(key, filesToUpload[key]);
                } else if (formData[key] instanceof Object && formData[key] !== null) {
                    // Append serialized objects or arrays
                    dataToSend.append(key, JSON.stringify(formData[key]));
                } else {
                    // Append primitive values
                    dataToSend.append(key, formData[key]);
                }
            }
            // ADDED: Append the profile completion percentage from the Redux state
            dataToSend.append('completionPercentage', profileCompletion);

            // Call the RTK Query mutation with the updated data
            await updateStoreProfile({ id: userId, data: dataToSend });
        },
        currentStep,
        mode: 'upgrade',
        brandColor,
        contrastColor,
        isSubmitting: isUpdating,
        // Pass any other necessary state
    };

    const renderStepContent = () => {
        if (currentStep >= 1 && currentStep <= 3) {
            return <Level1 {...commonProps} />;
        }
        if (currentStep >= 4 && currentStep <= 5) {
            return <Level2 {...commonProps} />;
        }
        if (currentStep >= 6 && currentStep <= 7) {
            return <Level3 {...commonProps} />;
        }
        return null;
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
                <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Profile</h2>
                <p className="text-red-600 mb-6">Could not load store data: {profileError.message || 'Unknown error'}</p>
            </div>
        );
    }
    
    const sidebarLevels = [
        { id: 1, title: 'Level 1', completion: 80, requirements: ['Level requirement 1', 'Level requirement 2'], benefits: ['Benefit 1', 'Benefit 2'] },
        { id: 2, title: 'Level 2', completion: 50, requirements: ['Level requirement 1', 'Level requirement 2'], benefits: ['Benefit 1', 'Benefit 2'] },
        { id: 3, title: 'Level 3', completion: 20, requirements: ['Level requirement 1', 'Level requirement 2'], benefits: ['Benefit 1', 'Benefit 2'] },
    ];

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4 lg:p-8">
            <div className="relative flex w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Left Sidebar - Levels Overview */}
                <div className="hidden lg:flex flex-col w-[350px] bg-white p-8 border-r border-gray-200 space-y-6 overflow-y-auto">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Create Store</h1>
                    <div className="flex">
                        <div className="flex-1 space-y-6">
                            {sidebarLevels.map((level) => (
                                <div key={level.id} className="p-4 border border-gray-300 rounded-2xl shadow-sm">
                                    <div className="flex items-center justify-between mb-2">
                                        <h2 className="text-lg font-bold text-gray-800">{level.title}</h2>
                                        <CircularProgress
                                            percentage={level.completion}
                                            size={40}
                                            strokeWidth={4}
                                            color={brandColor}
                                            textColor={brandColor}
                                        />
                                    </div>
                                    <p className="text-sm text-gray-600 mb-3">Percentage Completion</p>
                                    <p className="text-lg font-bold mb-4" style={{ color: brandColor }}>{level.completion}%</p>
                                    <h3 className="text-sm font-semibold text-gray-700 mb-1">Level Requirements</h3>
                                    <ul className="text-sm text-gray-600 space-y-1 mb-3">
                                        {level.requirements.map((req, idx) => (
                                            <li key={idx} className="flex items-center">
                                                <CheckCircleIcon className="h-4 w-4 mr-2 text-green-500" /> {req}
                                            </li>
                                        ))}
                                    </ul>
                                    <Button
                                        className="w-full py-3 rounded-[15px] text-base shadow-md"
                                        style={{ backgroundColor: brandColor, color: contrastColor }}
                                    >
                                        View Details
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Content Area - Form Steps */}
                <div className="flex-1 p-6 md:p-8 flex flex-col overflow-y-auto">
                    <div className="w-full bg-gray-200 rounded-full h-4 mb-8">
                        <div
                            className="h-4 rounded-full transition-all duration-500 ease-in-out"
                            style={{ width: `${profileCompletion}%`, backgroundColor: brandColor }}
                        ></div>
                        <p className="text-center text-sm mt-2 text-gray-600">{profileCompletion}% Complete</p>
                    </div>
                    {renderStepContent()}
                </div>
            </div>
            {/* Render modals based on state */}
            {showSuccessModal && (
                <SuccessModal
                    onClose={() => {
                        setShowSuccessModal(false);
                        navigate('/'); // Redirect to dashboard after success
                    }}
                />
            )}
            {showErrorModal && (
                <ErrorModal
                    message={modalErrorMessage}
                    onClose={() => setShowErrorModal(false)}
                />
            )}
        </div>
    );
};

export default UpgradeStorePage;
