// Level1.jsx
import React, { useState, useEffect } from 'react';
import Input from '../../../../components/ui/Input';
import Button from '../../../../components/ui/Button';
import StepIndicator from '../../../../components/ui/StepIndicator';
// Import all three new modals
import EnterEmailModal from '../../../../components/models/EnterEmailModal';
import OtpInputModal from '../../../../components/models/ResetPasswordModal'; // Renamed import for clarity, but still refers to ResetPasswordModal.jsx
import SetNewPasswordModal from '../../../../components/models/SetNewPasswordModal';

import { useNavigate } from 'react-router-dom';
import {
    EnvelopeIcon,
    LockClosedIcon,
    ArrowLeftIcon,
    EyeIcon,
    EyeSlashIcon,
    PhoneIcon,
    MapPinIcon,
    BuildingStorefrontIcon,
    CameraIcon,
    TagIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

// Dummy locations for the select input
const locations = ['Lagos', 'Abuja', 'Port Harcourt', 'Ibadan']; // Example locations

/**
 * Level1 Component
 * Renders the first step of the registration form or store details for upgrade.
 *
 * @param {object} props
 * @param {object} props.formData - The current state of the form.
 * @param {function} props.handleChange - Function to dispatch text input updates.
 * @param {function} props.handleFileChange - Function to dispatch file input updates.
 * @param {function} props.onNext - Function to proceed to the next step (global step).
 * @param {function} props.onBack - Function to go to the previous step (global step).
 * @param {function} [props.onLoginClick] - Function to switch to the login view (only for register mode).
 * @param {number} props.currentStep - The current active global step.
 * @param {string} [props.mode='register'] - 'register' for registration flow, 'upgrade' for store upgrade flow.
 * @param {string} [props.brandColor='#e53e3e'] - Primary brand color in hex (e.g., '#FF0000').
 * @param {string} [props.contrastColor='#EBEBEB'] - Contrast text color in hex (e.g., '#FFFFFF').
 */
const Level1 = ({
    formData,
    handleChange,
    handleFileChange,
    onNext,
    onBack,
    onLoginClick,
    currentStep,
    mode = 'register',
    brandColor = '#e53e3e', // Default to hex color
    contrastColor = '#EBEBEB', // Reverting to white for better contrast on brand color
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false); // State for new change password field visibility
    const [validationErrors, setValidationErrors] = useState({});
    const [showCategorySelectModal, setShowCategorySelectModal] = useState(false);

    // States for the multi-step password reset flow
    const [showEnterEmailModal, setShowEnterEmailModal] = useState(false);
    const [showOtpInputModal, setShowOtpInputModal] = useState(false);
    const [showSetNewPasswordModal, setShowSetNewPasswordModal] = useState(false);
    const [resetEmail, setResetEmail] = useState(''); // Store the email entered in the first step
    const [resetOtp, setResetOtp] = useState('');     // Store the OTP entered in the second step

    const navigate = useNavigate();

    // Dummy categories for selection (you'd likely fetch these from an API)
    const dummyCategories = ['Electronics', 'Phones', 'Fashion', 'Home Goods', 'Books', 'Jewelry', 'Sports', 'Automotive', 'Health & Beauty', 'Pet Supplies'];

    useEffect(() => {
        // Ensure categories is initialized as an array
        if (!formData.categories) {
            handleChange({ target: { name: 'categories', value: [] } });
        }
    }, [formData.categories, handleChange]);

    const handleCategoryToggle = (category) => {
        const currentCategories = Array.isArray(formData.categories) ? formData.categories : [];
        let updatedCategories;
        if (currentCategories.includes(category)) {
            updatedCategories = currentCategories.filter(cat => cat !== category);
        } else {
            updatedCategories = [...currentCategories, category];
        }
        handleChange({ target: { name: 'categories', value: updatedCategories } });
        setValidationErrors(prev => ({ ...prev, categories: '' }));
    };

    const handleRemoveCategory = (categoryToRemove) => {
        const currentCategories = Array.isArray(formData.categories) ? formData.categories : [];
        const updatedCategories = currentCategories.filter(cat => cat !== categoryToRemove);
        handleChange({ target: { name: 'categories', value: updatedCategories } });
    };

    // Define the global step numbers that Level1 is responsible for
    const level1GlobalSteps = [1, 2, 3];

    // Determine the active display step *within* Level1 (1, 2, or 3)
    const activeDisplayStep = currentStep;

    // Validation Logic for the current active sub-step based on mode
    const validateCurrentSubStep = () => {
        const errors = {};

        // Validation for Step 1 (Store Info: Name, Location, Email, Phone, Password/Referral/Change Password)
        if (activeDisplayStep === 1) {
            if (!formData.storeName || !formData.storeName.trim()) {
                errors.storeName = 'Store Name is required.';
            }
            if (!formData.storeLocation || !formData.storeLocation.trim()) {
                errors.storeLocation = 'Store Location is required.';
            }
            if (!formData.email || !formData.email.trim()) {
                errors.email = 'Email is required.';
            } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
                errors.email = 'Invalid email format.';
            }
            if (!formData.phoneNumber || !formData.phoneNumber.trim()) {
                errors.phoneNumber = 'Phone Number is required.';
            }

            if (mode === 'register') { // Password is only required for registration
                if (!formData.password) {
                    errors.password = 'Password is required.';
                } else if (formData.password.length < 6) {
                    errors.password = 'Password must be at least 6 characters.';
                }
            } else if (mode === 'upgrade') { // New: Validate changePassword if provided
                if (showChangePassword && (!formData.changePassword || formData.changePassword.trim().length < 6)) {
                    errors.changePassword = 'New Password must be at least 6 characters if provided.';
                }
            }

            // Referral code is optional, but if provided, must meet length requirement
            if (formData.referralCode && formData.referralCode.trim() && formData.referralCode.length < 3) {
                errors.referralCode = 'Referral Code must be at least 3 characters if provided.';
            }
        }
        // Validation for Step 2 (Images: Profile Picture, Store Banner)
        else if (activeDisplayStep === 2) {
            // Check for file metadata existence (name property)
            if (!formData.profilePicture?.name) {
                errors.profilePicture = 'Profile Picture is required.';
            }
            if (!formData.storeBanner?.name) {
                errors.storeBanner = 'Store Banner is required.';
            }
        }
        // Validation for Step 3 (Categories & Social Links)
        else if (activeDisplayStep === 3) {
            if (!formData.categories || formData.categories.length === 0) {
                errors.categories = 'At least one category is required.';
            }
            // Social links are optional, but if provided, must be valid URLs
            if (formData.addWhatsappLink && !/^https?:\/\/.+/.test(formData.addWhatsappLink)) {
                errors.addWhatsappLink = 'Invalid WhatsApp link format.';
            }
            if (formData.addInstagramLink && !/^https?:\/\/.+/.test(formData.addInstagramLink)) {
                errors.addInstagramLink = 'Invalid Instagram link format.';
            }
            if (formData.addFacebookLink && !/^https?:\/\/.+/.test(formData.addFacebookLink)) {
                errors.addFacebookLink = 'Invalid Facebook link format.';
            }
            if (formData.addTwitterLink && !/^https?:\/\/.+/.test(formData.addTwitterLink)) {
                errors.addTwitterLink = 'Invalid Twitter link format.';
            }
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleProceed = () => {
        if (validateCurrentSubStep()) {
            onNext(); // Advance the global step
        }
    };

    const handleBackClick = () => {
        onBack(); // Go back the global step
    };

    const handleSaveAndExit = () => {
        // Implement save logic here if needed, e.g., dispatch an action to save form data
        navigate('/'); // Navigate to home or dashboard
    };

    // --- Password Reset Flow Handlers ---

    const handleOpenResetPasswordFlow = () => {
        setShowEnterEmailModal(true); // Start the flow with the email input modal
    };

    const handleEmailSubmit = (email) => {
        setResetEmail(email);
        console.log(`Email submitted for reset: ${email}. Simulating OTP send.`);
        // In a real app, trigger backend to send OTP to this email
        setShowEnterEmailModal(false);
        setShowOtpInputModal(true); // Move to OTP input modal
    };

    const handleOtpConfirm = (otp) => {
        setResetOtp(otp);
        console.log(`OTP confirmed: ${otp}. Simulating OTP verification.`);
        // In a real app, verify OTP with backend using resetEmail and otp
        // If successful:
        setShowOtpInputModal(false);
        setShowSetNewPasswordModal(true); // Move to set new password modal
        // If failed: show error on OtpInputModal
    };

    const handleSetNewPassword = (newPassword) => {
        console.log(`New password set: ${newPassword}. Using email: ${resetEmail}, OTP: ${resetOtp}`);
        // In a real app, send resetEmail, resetOtp, and newPassword to backend to finalize reset
        // Example:
        // try {
        //     const response = await finalizePasswordResetApiCall(resetEmail, resetOtp, newPassword);
        //     if (response.success) {
        //         console.log('Password reset successfully!');
        //         // Show success message, then redirect to login
        //         navigate('/login');
        //     } else {
        //         console.error('Password reset failed:', response.error);
        //         // Show error on SetNewPasswordModal
        //     }
        // } catch (error) {
        //     console.error('Error during password reset:', error);
        // }
        setShowSetNewPasswordModal(false); // Close modal regardless for this demo
        setResetEmail(''); // Clear stored data
        setResetOtp('');
        alert('Password reset process completed! (Simulated)'); // Use a custom message box in production
    };

    const handleCloseAllResetModals = () => {
        setShowEnterEmailModal(false);
        setShowOtpInputModal(false);
        setShowSetNewPasswordModal(false);
        setResetEmail(''); // Clear any pending reset data
        setResetOtp('');
    };

    // Determine the title based on the mode
    const title = `Level 1`;

    // Inline styles for brand colors
    const brandBgStyle = { backgroundColor: brandColor };
    const brandTextStyle = { color: brandColor };
    const brandBorderStyle = { borderColor: brandColor };
    const brandRingStyle = { '--tw-ring-color': brandColor }; // For ring color
    const contrastTextStyle = { color: contrastColor };
    const brandHoverStyle = { filter: 'brightness(110%)' }; // Simple hover effect for hex colors

    return (
        <div className={`w-full h-full max-h-[90vh] ${mode === 'register' ? 'max-w-[389px] px-4 py-2 sm:px-8' : 'p-0'}`}>
            {/* Dynamic Level Indicator / Title */}
            <div className="w-full p-4 mt-6 border rounded-[15px] shadow-sm bg-white space-y-3 min-h-[60px] flex flex-col justify-center" style={brandBorderStyle}>
                <div className="flex items-center justify-between">
                    <h4 className="text-[18px] font-semibold leading-none font-manrope" style={brandTextStyle}>
                        {title}
                    </h4>
                    {(mode === 'register' || mode === 'upgrade') && (
                        <button
                            type="button"
                            className="text-sm hover:underline whitespace-nowrap"
                            style={brandTextStyle}
                        >
                            View Benefits
                        </button>
                    )}

                </div>
                {/* StepIndicator only for register mode */}
                {mode === 'register' || mode === 'upgrade' && (
                    <StepIndicator
                        steps={level1GlobalSteps}
                        currentStep={activeDisplayStep}
                        brandColor={brandColor}
                        contrastColor={contrastColor}
                    />
                )}
            </div>

            {/* Form Inputs Per Step */}
            <div className="space-y-4 w-full mx-auto mt-8 flex flex-col h-full"> {/* Added flex-col h-full for better flex control */}
                {/* Step 1: Store Info (Name, Location, Email, Phone, Password/Referral/Change Password) */}
                {activeDisplayStep === 1 && (
                    <>
                        <Input
                            type="text"
                            name="storeName"
                            placeholder="Store Name"
                            value={formData.storeName || ''}
                            onChange={handleChange}
                            icon={<BuildingStorefrontIcon className="h-5 w-5 text-gray-400" />}
                            className="h-[60px] rounded-[15px] border border-gray-300"
                            error={validationErrors.storeName}
                        />
                        {validationErrors.storeName && <p className="text-xs mt-1" style={brandTextStyle}>{validationErrors.storeName}</p>}

                        <div className="relative">
                            <label htmlFor="storeLocation" className="sr-only">Store Location</label>
                            <div className="flex items-center border border-gray-300 rounded-[15px] h-[60px] focus-within:ring-2" style={validationErrors.storeLocation ? { borderColor: brandColor, ...brandRingStyle } : {}}>
                                <MapPinIcon className="h-5 w-5 text-gray-400 ml-3 mr-2" />
                                <select
                                    id="storeLocation"
                                    name="storeLocation"
                                    className="w-full p-3 outline-none rounded-r-[15px] appearance-none bg-white pr-8 text-gray-800"
                                    value={formData.storeLocation || ''}
                                    onChange={handleChange}
                                >
                                    <option value="" disabled>Select Store Location</option>
                                    {locations.map(loc => (
                                        <option key={loc} value={loc}>{loc}</option>
                                    ))}
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                                </div>
                            </div>
                            {validationErrors.storeLocation && <p className="text-xs mt-1" style={brandTextStyle}>{validationErrors.storeLocation}</p>}
                        </div>

                        <Input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email || ''}
                            onChange={handleChange}
                            icon={<EnvelopeIcon className="h-5 w-5 text-gray-400" />}
                            className="h-[60px] rounded-[15px] border border-gray-300"
                            error={validationErrors.email}
                        />
                        {validationErrors.email && <p className="text-xs mt-1" style={brandTextStyle}>{validationErrors.email}</p>}

                        <Input
                            type="tel"
                            name="phoneNumber"
                            placeholder="Phone Number"
                            value={formData.phoneNumber || ''}
                            onChange={handleChange}
                            icon={<PhoneIcon className="h-5 w-5 text-gray-400" />}
                            className="h-[60px] rounded-[15px] border border-gray-300"
                            error={validationErrors.phoneNumber}
                        />
                        {validationErrors.phoneNumber && <p className="text-xs mt-1" style={brandTextStyle}>{validationErrors.phoneNumber}</p>}

                        {/* Password input only for register mode */}
                        {mode === 'register' && (
                            <>
                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    placeholder="Password"
                                    value={formData.password || ''}
                                    onChange={handleChange}
                                    icon={<LockClosedIcon className="h-5 w-5 text-gray-400" />}
                                    rightIcon={
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="p-1"
                                            aria-label="Toggle Password Visibility"
                                        >
                                            {showPassword ? (
                                                <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                                            ) : (
                                                <EyeIcon className="h-5 w-5 text-gray-400" />
                                            )}
                                        </button>
                                    }
                                    className="h-[60px] rounded-[15px] border border-gray-300"
                                    error={validationErrors.password}
                                />
                                {validationErrors.password && <p className="text-xs mt-1" style={brandTextStyle}>{validationErrors.password}</p>}
                                <button
                                    type="button"
                                    onClick={handleOpenResetPasswordFlow} // Opens the email input modal
                                    className="text-sm font-medium hover:underline text-right w-full block mt-2"
                                    style={brandTextStyle}
                                >
                                    Forgot Password?
                                </button>
                            </>
                        )}
                        {/* NEW: Change Password field for upgrade mode */}
                        {mode === 'upgrade' && (
                            <>
                                <div className="flex items-center justify-between mt-4">
                                    <label htmlFor="changePasswordToggle" className="text-gray-700 text-sm">Change Password?</label>
                                    <input
                                        type="checkbox"
                                        id="changePasswordToggle"
                                        name="changePasswordToggle" // Using a dummy name for toggle, actual field is 'changePassword'
                                        checked={showChangePassword}
                                        onChange={() => setShowChangePassword(!showChangePassword)}
                                        className="h-5 w-5 rounded focus:ring-2"
                                        style={{ borderColor: brandColor, ...brandRingStyle }}
                                    />
                                </div>
                                {showChangePassword && (
                                    <>
                                        <Input
                                            type={showPassword ? 'text' : 'password'}
                                            name="changePassword" // This is the field that holds the new password
                                            placeholder="New Password (Optional)"
                                            value={formData.changePassword || ''}
                                            onChange={handleChange}
                                            icon={<LockClosedIcon className="h-5 w-5 text-gray-400" />}
                                            rightIcon={
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="p-1"
                                                    aria-label="Toggle Password Visibility"
                                                >
                                                    {showPassword ? (
                                                        <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                                                    ) : (
                                                        <EyeIcon className="h-5 w-5 text-gray-400" />
                                                    )}
                                                </button>
                                            }
                                            className="h-[60px] rounded-[15px] border border-gray-300 mt-2"
                                            error={validationErrors.changePassword}
                                        />
                                        <button
                                            type="button"
                                            onClick={handleOpenResetPasswordFlow} // Opens the email input modal
                                            className="text-sm font-medium hover:underline text-right w-full block mt-2"
                                            style={brandTextStyle}
                                        >
                                            Reset Password
                                        </button>
                                    </>
                                )}
                                {validationErrors.changePassword && <p className="text-xs mt-1" style={brandTextStyle}>{validationErrors.changePassword}</p>}
                            </>
                        )}

                        <Input
                            type="text"
                            name="referralCode"
                            placeholder="Referral Code (Optional)"
                            value={formData.referralCode || ''}
                            onChange={handleChange}
                            className="h-[60px] rounded-[15px] border border-gray-300"
                            error={validationErrors.referralCode}
                        />
                        {validationErrors.referralCode && <p className="text-xs mt-1" style={brandTextStyle}>{validationErrors.referralCode}</p>}

                        {/* Buttons for Step 1 */}
                        {/* Added mt-auto to push buttons to the bottom */}
                        <div className="flex gap-4 mt-auto">
                            {/* Back button: Only for upgrade mode and if not the first step */}
                            {mode === 'upgrade' && currentStep > 1 && (
                                <Button
                                    type="button"
                                    onClick={handleBackClick}
                                    className="w-[54px] flex items-center justify-center gap-2 rounded-[15px] border border-gray-300 bg-gray-100 py-3 text-gray-800 shadow-sm hover:bg-gray-200"
                                >
                                    <ArrowLeftIcon className="h-5 w-5" />
                                </Button>
                            )}
                            {/* Save and Exit button: Only for upgrade mode */}
                            {mode === 'upgrade' && (
                                <Button
                                    type="button"
                                    onClick={handleSaveAndExit}
                                    className={`rounded-[15px] py-3 text-base shadow-md bg-black text-white hover:bg-gray-800 ${mode === 'upgrade' && currentStep === 1 ? 'flex-1' : ''}`}
                                >
                                    Save and Exit
                                </Button>
                            )}
                            <Button
                                type="button"
                                onClick={handleProceed}
                                className="flex-1 rounded-[15px] py-3 text-base shadow-md"
                                style={{ ...brandBgStyle, ...contrastTextStyle, ...brandHoverStyle }}
                            >
                                {mode === 'register' ? 'Create Account' : 'Proceed'}
                            </Button>
                        </div>
                        {mode === 'register' && (
                            <>
                                <Button
                                    onClick={onLoginClick}
                                    className="w-full rounded-[15px] border border-gray-300 bg-gray-100 py-3 text-gray-800 shadow-sm hover:bg-gray-200"
                                >
                                    Login
                                </Button>
                                <p className="text-[10px] text-center text-gray-600 font-manrope font-normal leading-[100%] tracking-[0%] mt-4 w-[306px] mx-auto">
                                    By proceeding you agree to Colala’s <span style={brandTextStyle}>terms of use</span> and{' '}
                                    <span style={brandTextStyle}>privacy policy</span>
                                </p>
                            </>
                        )}
                    </>
                )}

                {/* Step 2: Image Uploads (Profile Picture, Store Banner) */}
                {activeDisplayStep === 2 && (
                    <>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md w-full min-h-[120px]">
                            <div className="space-y-1 text-center">
                                <CameraIcon className="mx-auto h-12 w-12 text-gray-400" />
                                <div className="flex text-sm text-gray-600">
                                    <label
                                        htmlFor="profilePicture"
                                        className="relative cursor-pointer bg-white rounded-md font-medium"
                                        style={brandTextStyle}
                                    >
                                        <span>Upload Profile Picture</span>
                                        <input
                                            id="profilePicture"
                                            name="profilePicture"
                                            type="file"
                                            className="sr-only"
                                            onChange={handleFileChange} // This calls the parent's handleFileChange
                                            accept="image/*"
                                        />
                                    </label>
                                </div>
                                {/* Display file name if available (assuming parent stores it) */}
                                {formData.profilePicture?.name && (
                                    <p className="text-xs text-gray-500">Selected: {formData.profilePicture.name}</p>
                                )}
                                {/* Display image preview if URL is available */}
                                {formData.profilePicture?.fileUrl && (
                                    <img src={formData.profilePicture.fileUrl} alt="Profile Preview" className="mt-2 max-h-24 mx-auto rounded-md object-cover" />
                                )}
                            </div>
                        </div>
                        {validationErrors.profilePicture && (
                            <p className="text-xs mt-1" style={brandTextStyle}>{validationErrors.profilePicture}</p>
                        )}

                        <div className="mt-4 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md w-full min-h-[120px]">
                            <div className="space-y-1 text-center">
                                <CameraIcon className="mx-auto h-12 w-12 text-gray-400" />
                                <div className="flex text-sm text-gray-600">
                                    <label
                                        htmlFor="storeBanner"
                                        className="relative cursor-pointer bg-white rounded-md font-medium"
                                        style={brandTextStyle}
                                    >
                                        <span>Upload Store Banner</span>
                                        <input
                                            id="storeBanner"
                                            name="storeBanner"
                                            type="file"
                                            className="sr-only"
                                            onChange={handleFileChange} // This calls the parent's handleFileChange
                                            accept="image/*"
                                        />
                                    </label>
                                </div>
                                {/* Display file name if available (assuming parent stores it) */}
                                {formData.storeBanner?.name && (
                                    <p className="text-xs text-gray-500">Selected: {formData.storeBanner.name}</p>
                                )}
                                {/* Display image preview if URL is available */}
                                {formData.storeBanner?.fileUrl && (
                                    <img src={formData.storeBanner.fileUrl} alt="Banner Preview" className="mt-2 max-h-24 mx-auto rounded-md object-cover" />
                                )}
                            </div>
                        </div>
                        {validationErrors.storeBanner && (
                            <p className="text-xs mt-1" style={brandTextStyle}>{validationErrors.storeBanner}</p>
                        )}

                        {/* Buttons for Step 2 */}
                        <div className="flex gap-4 mt-auto"> {/* Added mt-auto here as well */}
                            <Button
                                type="button"
                                onClick={handleBackClick}
                                className="w-[54px] flex items-center justify-center gap-2 rounded-[15px] border border-gray-300 bg-gray-100 py-3 text-gray-800 shadow-sm hover:bg-gray-200"
                            >
                                <ArrowLeftIcon className="h-5 w-5" />
                            </Button>
                            {mode === 'upgrade' && (
                                <Button
                                    type="button"
                                    onClick={handleSaveAndExit}
                                    className={`rounded-[15px] py-3 text-base shadow-md bg-black text-white hover:bg-gray-800`}
                                >
                                    Save and Exit
                                </Button>
                            )}
                            <Button
                                type="button"
                                onClick={handleProceed}
                                className="flex-1 rounded-[15px] py-3 text-base shadow-md"
                                style={{ ...brandBgStyle, ...contrastTextStyle, ...brandHoverStyle }}
                            >
                                Proceed
                            </Button>
                        </div>
                        {mode === 'register' && onLoginClick && (
                            <Button
                                onClick={onLoginClick}
                                className="w-full rounded-[15px] border border-gray-300 bg-gray-100 py-3 text-gray-800 shadow-sm hover:bg-gray-200"
                            >
                                Login
                            </Button>
                        )}
                    </>
                )}

                {/* Step 3: Categories & Social Links */}
                {activeDisplayStep === 3 && (
                    <>
                        <label className="block text-sm text-gray-700">Add Category</label>
                        <div
                            className="flex items-center justify-between p-3 rounded-[15px] border border-gray-300 bg-white cursor-pointer h-[60px] shadow-sm"
                            onClick={() => setShowCategorySelectModal(true)}
                        >
                            <div className="flex items-center gap-2">
                                <TagIcon className="h-5 w-5 text-gray-400" />
                                <span className="text-gray-700">
                                    {Array.isArray(formData.categories) && formData.categories.length > 0
                                        ? `Selected (${formData.categories.length})`
                                        : 'Select Category'}
                                </span>
                            </div>
                        </div>
                        {validationErrors.categories && <p className="text-xs mt-1" style={brandTextStyle}>{validationErrors.categories}</p>}

                        {Array.isArray(formData.categories) && formData.categories.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {formData.categories.map((category) => (
                                    <span
                                        key={category}
                                        className="inline-flex items-center px-3 py-1 rounded-full text-sm"
                                        style={{ ...brandBgStyle, ...contrastTextStyle }}
                                    >
                                        {category}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveCategory(category)}
                                            className="ml-1 -mr-1 h-4 w-4 hover:text-gray-200"
                                            style={contrastTextStyle}
                                            aria-label={`Remove ${category}`}
                                        >
                                            <XMarkIcon className="h-4 w-4" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Social Links */}
                        <h5 className="text-sm font-semibold text-gray-700 mt-4">Social Links (Optional)</h5>
                        <Input
                            type="url"
                            name="addWhatsappLink"
                            placeholder="WhatsApp Link"
                            value={formData.addWhatsappLink || ''}
                            onChange={handleChange}
                            className="h-[60px] rounded-[15px] border border-gray-300"
                            error={validationErrors.addWhatsappLink}
                        />
                        {validationErrors.addWhatsappLink && <p className="text-xs mt-1" style={brandTextStyle}>{validationErrors.addWhatsappLink}</p>}
                        <Input
                            type="url"
                            name="addInstagramLink"
                            placeholder="Instagram Link"
                            value={formData.addInstagramLink || ''}
                            onChange={handleChange}
                            className="h-[60px] rounded-[15px] border border-gray-300"
                            error={validationErrors.addInstagramLink}
                        />
                        {validationErrors.addInstagramLink && <p className="text-xs mt-1" style={brandTextStyle}>{validationErrors.addInstagramLink}</p>}
                        <Input
                            type="url"
                            name="addFacebookLink"
                            placeholder="Facebook Link"
                            value={formData.addFacebookLink || ''}
                            onChange={handleChange}
                            className="h-[60px] rounded-[15px] border border-gray-300"
                            error={validationErrors.addFacebookLink}
                        />
                        {validationErrors.addFacebookLink && <p className="text-xs mt-1" style={brandTextStyle}>{validationErrors.addFacebookLink}</p>}
                        <Input
                            type="url"
                            name="addTwitterLink"
                            placeholder="Twitter Link"
                            value={formData.addTwitterLink || ''}
                            onChange={handleChange}
                            className="h-[60px] rounded-[15px] border border-gray-300"
                            error={validationErrors.addTwitterLink}
                        />
                        {validationErrors.addTwitterLink && <p className="text-xs mt-1" style={brandTextStyle}>{validationErrors.addTwitterLink}</p>}

                        {/* Buttons for Step 3 */}
                        <div className="flex gap-4 mt-auto">
                            <Button
                                type="button"
                                onClick={handleBackClick}
                                className="w-[54px] flex items-center justify-center gap-2 rounded-[15px] border border-gray-300 bg-gray-100 py-3 text-gray-800 shadow-sm hover:bg-gray-200"
                            >
                                <ArrowLeftIcon className="h-5 w-5" />
                            </Button>
                            {mode === 'upgrade' && (
                                <Button
                                    type="button"
                                    onClick={handleSaveAndExit}
                                    className={`rounded-[15px] py-3 text-base shadow-md bg-black text-white hover:bg-gray-800`}
                                >
                                    Save and Exit
                                </Button>
                            )}
                            <Button
                                type="button"
                                onClick={handleProceed}
                                className="flex-1 rounded-[15px] py-3 text-base shadow-md"
                                style={{ ...brandBgStyle, ...contrastTextStyle, ...brandHoverStyle }}
                            >
                                Proceed
                            </Button>
                        </div>
                        {mode === 'register' && onLoginClick && (
                            <Button
                                onClick={onLoginClick}
                                className="w-full rounded-[15px] border border-gray-300 bg-gray-100 py-3 text-gray-800 shadow-sm hover:bg-gray-200 mt-4"
                            >
                                Login
                            </Button>
                        )}
                    </>
                )}
            </div>

            {/* Modals for the password reset flow */}
            <EnterEmailModal
                isOpen={showEnterEmailModal}
                onClose={handleCloseAllResetModals} // Close all modals if user cancels at this stage
                onEmailSubmit={handleEmailSubmit}
                brandColor={brandColor}
                contrastColor={contrastColor}
            />

            <OtpInputModal
                isOpen={showOtpInputModal}
                onClose={handleCloseAllResetModals} // Close all modals if user cancels at this stage
                onOtpConfirm={handleOtpConfirm}
                email={resetEmail} // Pass the email to the OTP modal for resend logic
                brandColor={brandColor}
                contrastColor={contrastColor}
            />

            <SetNewPasswordModal
                isOpen={showSetNewPasswordModal}
                onClose={handleCloseAllResetModals} // Close all modals if user cancels at this stage
                onSetPassword={handleSetNewPassword}
                brandColor={brandColor}
                contrastColor={contrastColor}
            />

            {/* Category Select Modal (Existing) */}
            {showCategorySelectModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-[20px] shadow-lg w-full max-w-sm p-6 relative">
                        <button
                            type="button"
                            onClick={() => setShowCategorySelectModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
                            aria-label="Close"
                        >
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                        <h3 className="text-xl font-semibold mb-4 text-gray-800">Select Categories</h3>
                        <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto custom-scrollbar">
                            {dummyCategories.map((category) => (
                                <div
                                    key={category}
                                    className={`flex items-center p-3 rounded-lg border cursor-pointer ${
                                        Array.isArray(formData.categories) && formData.categories.includes(category)
                                            ? 'border-2'
                                            : 'border-gray-300'
                                    }`}
                                    style={Array.isArray(formData.categories) && formData.categories.includes(category) ? brandBorderStyle : {}}
                                    onClick={() => handleCategoryToggle(category)}
                                >
                                    <input
                                        type="checkbox"
                                        readOnly
                                        checked={Array.isArray(formData.categories) && formData.categories.includes(category)}
                                        className="mr-2 h-4 w-4 rounded"
                                        style={{ borderColor: brandColor, ...brandRingStyle }}
                                    />
                                    <span className="text-sm text-gray-700">{category}</span>
                                </div>
                            ))}
                        </div>
                        <Button
                            type="button"
                            onClick={() => setShowCategorySelectModal(false)}
                            className="w-full rounded-[15px] py-3 text-base shadow-md mt-6"
                            style={{ ...brandBgStyle, ...contrastTextStyle, ...brandHoverStyle }}
                        >
                            Done
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Level1;
