import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    updateField,
    setStep,
    resetRegistration,
} from '../registrationSlice';
import { useNavigate } from 'react-router-dom';

// Assuming you have these RTK Query hooks defined in your API slice
// This is the key part of the solution to differentiate API calls
import { useRegisterUserMutation, useUpdateStoreProfileMutation } from '../../../services/storeProfileApi';

// Your UI Components
import Button from '../../../components/ui/Button';
import Level1 from './register/Level1';
import Level2 from './register/Level2';
import Level3 from './register/Level3';
import SuccessModal from '../../../components/models/SuccessModal';

// Assets
import registerBannerImage from '../../../assets/images/login-banner.jpg';
import registerOverlayImage from '../../../assets/images/login-overlay.jpg';

// Icons
import { XMarkIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

/**
 * Register Component
 * This component orchestrates the multi-step user registration process.
 * It manages the overall form data, current step, and handles submission.
 * It also displays add-on services on the left panel.
 *
 * @param {object} props
 * @param {function} props.onClose - Function to close the registration modal.
 * @param {function} props.onLoginClick - Function to switch to the login view/modal.
 * @param {string} [props.mode='register'] - 'register' for new user, 'upgrade' for existing store.
 */
const Register = ({ onClose, onLoginClick, mode = 'register' }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { formData, currentStep } = useSelector((state) => state.registration);

    // RTK Query hooks for both registration and profile update
    const [registerUser, {
        isLoading: isRegistering,
        isSuccess: isRegisterSuccess,
        isError: isRegisterError,
        error: registerError
    }] = useRegisterUserMutation();

    const [updateStoreProfile, {
        isLoading: isUpdating,
        isSuccess: isUpdateSuccess,
        isError: isUpdateError,
        error: updateError
    }] = useUpdateStoreProfileMutation();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // This useEffect handles the navigation/modals after a successful submission
    useEffect(() => {
        if (isRegisterSuccess || isUpdateSuccess) {
            setShowSuccessModal(true);
            // Optionally reset the form data after success
            // dispatch(resetRegistration());
        }
        if (isRegisterError || isUpdateError) {
            // Handle error state, maybe show an error toast or modal
            console.error("Submission error:", registerError || updateError);
        }
    }, [isRegisterSuccess, isUpdateSuccess, isRegisterError, isUpdateError, registerError, updateError, dispatch]);


    // --- Submission Handler with Conditional Logic ---
    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            if (mode === 'register') {
                // Logic for new user registration
                const registrationResult = await registerUser(formData).unwrap();
                console.log('Registration successful:', registrationResult);
            } else if (mode === 'upgrade') {
                // Logic for store upgrade, using the separate API endpoint
                const upgradeResult = await updateStoreProfile(formData).unwrap();
                console.log('Store upgrade successful:', upgradeResult);
            }
        } catch (err) {
            // Handle API errors
            console.error('Submission failed:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    // A small helper to manage navigation
    const handleNextStep = () => {
        dispatch(setStep(currentStep + 1));
    };
    const handleBackStep = () => {
        dispatch(setStep(currentStep - 1));
    };

    // A small helper to dispatch simple field updates
    const handleChange = ({ target: { name, value } }) => {
        dispatch(updateField({ name, value }));
    };

    const handleSuccessModalClose = () => {
        setShowSuccessModal(false);
        onClose();
    };

    const steps = [1, 2, 3];
    const maxSteps = 3;
    const isLastStep = currentStep === maxSteps;

    // Determine the content for the left panel based on the current step
    const leftPanelContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <>
                        <h2 className="text-2xl font-bold font-manrope text-white mb-2">Get started with your Business on our platform</h2>
                        <p className="text-sm font-light text-white font-manrope">
                            Create a Store account for free. Get access to a wide range of products for your business.
                        </p>
                    </>
                );
            case 2:
                return (
                    <>
                        <h2 className="text-2xl font-bold font-manrope text-white mb-2">Build your Store’s Profile</h2>
                        <p className="text-sm font-light text-white font-manrope">
                            Fill in your business details. Upload your CAC, CAC registration number, and other necessary documents.
                        </p>
                    </>
                );
            case 3:
                return (
                    <>
                        <h2 className="text-2xl font-bold font-manrope text-white mb-2">Customize Your Store</h2>
                        <p className="text-sm font-light text-white font-manrope">
                            Give your store a personal touch. Upload a video, set your opening hours, and choose a brand color.
                        </p>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex w-full h-full max-w-[1240px] rounded-lg overflow-hidden mx-auto bg-white shadow-xl min-h-[600px]">
            {/* Left Panel */}
            <div
                className="w-full sm:w-[450px] p-8 hidden sm:flex flex-col justify-end relative"
                style={{
                    backgroundImage: `url(${registerBannerImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: `url(${registerOverlayImage})`,
                    }}
                ></div>
                <div className="relative z-10 text-white flex flex-col space-y-4">
                    <div className="flex items-center gap-2">
                        {steps.map(step => (
                            <div key={step} className={`w-8 h-1 rounded-full ${step <= currentStep ? 'bg-white' : 'bg-gray-400'}`}></div>
                        ))}
                    </div>
                    {leftPanelContent()}
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="flex-1 overflow-y-auto relative p-8">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 z-10"
                    aria-label="Close registration"
                >
                    <XMarkIcon className="h-6 w-6" />
                </button>

                {currentStep === 1 && (
                    <Level1
                        formData={formData}
                        handleChange={handleChange}
                        onNext={handleNextStep}
                        onBack={onClose}
                    />
                )}
                {currentStep === 2 && (
                    <Level2
                        formData={formData}
                        handleChange={handleChange}
                        onNext={handleNextStep}
                        onBack={handleBackStep}
                    />
                )}
                {currentStep === 3 && (
                    <Level3
                        formData={formData}
                        handleChange={handleChange}
                        handleFileChange={handleChange}
                        onNext={handleNextStep}
                        onBack={handleBackStep}
                        onSubmit={handleSubmit}
                        onLoginClick={onLoginClick}
                        currentStep={currentStep}
                        mode={mode} // This is the crucial prop that drives the conditional logic
                    />
                )}
            </div>

            {/* Success Modal */}
            {showSuccessModal && (
                <SuccessModal
                    onClose={handleSuccessModalClose}
                    title={mode === 'register' ? "Registration Successful!" : "Upgrade Successful!"}
                    message={
                        mode === 'register'
                            ? "Your store has been successfully created. You can now log in and start selling."
                            : "Your store profile has been successfully updated. Your new features are now active."
                    }
                />
            )}
        </div>
    );
};

export default Register;
