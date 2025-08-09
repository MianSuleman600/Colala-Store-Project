// Level2.jsx
import React, { useState, useEffect } from 'react';
import Input from '../../../../components/ui/Input';
import Button from '../../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import StepIndicator from '../../../../components/ui/StepIndicator'; // Import StepIndicator

// --- Icons ---
import {
    ArrowLeftIcon,
    BriefcaseIcon,
    IdentificationIcon,
    DocumentTextIcon, // For NIN/CAC slips
} from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

/**
 * Level2 Component
 * Renders the second step of the registration form for business details and document uploads.
 *
 * @param {object} props
 * @param {object} props.formData - The current state of the form.
 * @param {function} props.handleChange - The function to dispatch text input updates.
 * @param {function} props.handleFileChange - The function to dispatch file input updates.
 * @param {function} props.onBack - The function to go to the previous global step.
 * @param {function} props.onNext - The function to proceed to the next global step.
 * @param {function} [props.onLoginClick] - The function to switch to the login view (only for register mode).
 * @param {number} props.currentStep - The current active global step (from the main Register/UpgradeStorePage component).
 * @param {string} [props.mode='register'] - 'register' for registration flow, 'upgrade' for store upgrade flow.
 * @param {string} [props.brandColor='#EF4444'] - Primary brand color in hex (e.g., '#FF0000').
 * @param {string} [props.contrastColor='#FFFFFF'] - Contrast text color in hex (e.g., '#FFFFFF').
 */
const Level2 = ({
    formData,
    handleChange,
    handleFileChange,
    onBack,
    onNext,
    onLoginClick,
    currentStep,
    mode = 'register',
    brandColor = '#EF4444', // Default to hex color
    contrastColor = '#FFFFFF', // Default to hex color
}) => {
    const [validationErrors, setValidationErrors] = useState({});
    const [showBusinessTypes, setShowBusinessTypes] = useState(false);
    const navigate = useNavigate();

    const dummyBusinessTypes = ['Sole Proprietorship', 'Partnership', 'Limited Liability Company (LLC)', 'Corporation (Inc.)', 'Non-profit Organization', 'Other'];

    // Determine the active display step *within* Level2
    // Level2 handles global steps 4 and 5.
    // Global step 4 corresponds to Level2's internal step 1.
    // Global step 5 corresponds to Level2's internal step 2.
    const activeDisplayStep = currentStep - 3; // Subtract 3 because Level1 covers steps 1, 2, 3.

    /**
     * Handles the selection of a business type from the custom dropdown.
     */
    const handleBusinessTypeSelect = (type) => {
        handleChange({ target: { name: 'businessType', value: type } });
        setShowBusinessTypes(false);
        setValidationErrors((prev) => ({ ...prev, businessType: '' }));
    };

    /**
     * Validates fields based on the current active sub-step within Level2.
     * @returns {boolean} - True if the current sub-step is valid, false otherwise.
     */
    const validateCurrentSubStep = () => {
        const errors = {};

        if (activeDisplayStep === 1) { // Business Info (Business Name, Type, NIN, CAC numbers)
            if (!formData.businessName || !formData.businessName.trim()) {
                errors.businessName = 'Business Name is required.';
            }
            if (!formData.businessType) {
                errors.businessType = 'Business Type is required.';
            }
            if (!formData.ninNumber || !formData.ninNumber.trim()) {
                errors.ninNumber = 'NIN Number is required.';
            }
            if (!formData.cacNumber || !formData.cacNumber.trim()) {
                errors.cacNumber = 'CAC Number is required.';
            }
        } else if (activeDisplayStep === 2) { // Document Uploads (NIN Slip, CAC Certificate)
            // Check for file metadata existence (name property)
            if (!formData.ninSlip?.name) {
                errors.ninSlip = 'NIN Slip upload is required.';
            }
            if (!formData.cacCertificate?.name) {
                errors.cacCertificate = 'CAC Certificate upload is required.';
            }
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    /**
     * Handles the "Proceed" button click.
     */
    const handleProceed = () => {
        if (validateCurrentSubStep()) {
            onNext(); // This will increment the global currentStep
        }
    };

    /**
     * Handles the "Back" button click.
     */
    const handleBackClick = () => {
        onBack(); // Calls onBack from parent (Register.jsx or UpgradeStorePage.jsx)
    };

    /**
     * Handles the "Save and Exit" button click.
     */
    const handleSaveAndExit = () => {
        // Implement save logic here if needed
        navigate('/'); // Navigate to home or dashboard
    };

    // Inline styles for brand colors
    const brandBgStyle = { backgroundColor: brandColor };
    const brandTextStyle = { color: brandColor };
    const brandBorderStyle = { borderColor: brandColor };
    const brandRingStyle = { '--tw-ring-color': brandColor };
    const contrastTextStyle = { color: contrastColor };
    const brandHoverStyle = { filter: 'brightness(110%)' }; // Simple hover effect for hex colors

    const level2GlobalSteps = [1,2];

    return (
        <div className={`w-full h-full max-h-[90vh] ${mode === 'register' ? 'max-w-[389px] px-4 py-2 sm:px-8' : 'p-0'}`}>
            {/* Level Indicator Section */}
            <div className="w-full p-4 mt-6 border rounded-[15px] shadow-sm bg-white space-y-3 min-h-[60px] flex flex-col justify-center" style={brandBorderStyle}>
                <div className="flex items-center justify-between">
                    <h4 className="text-[18px] font-semibold leading-none font-manrope" style={brandTextStyle}>
                        {mode === 'register' ? 'Level 2' : 'Level 2'}
                    </h4>
                    {(mode === 'register' || mode === 'upgrade') && (
                        <button type="button" className="text-sm hover:underline whitespace-nowrap" style={brandTextStyle}>
                            View Benefits
                        </button>
                    )}
                </div>

                {/* StepIndicator only for register mode */}
                {mode === 'register' || mode ==="upgrade" && (
                    <StepIndicator
                        steps={level2GlobalSteps} // Level 2 has 2 internal steps
                        currentStep={activeDisplayStep}
                        brandColor={brandColor}
                        contrastColor={contrastColor}
                    />
                )}
            </div>

            {/* Form Section */}
            <div className="space-y-4 w-full mx-auto mt-8 flex flex-col h-full">
                {/* Internal Step 1: Business Information (for both modes) */}
                {activeDisplayStep === 1 && (
                    <>
                        {/* Business Name */}
                        <Input
                            type="text"
                            name="businessName"
                            placeholder="Business Name"
                            value={formData.businessName || ''}
                            onChange={handleChange}
                            icon={<BriefcaseIcon className="h-5 w-5 text-gray-400" />}
                            className="h-[60px] rounded-[15px] border border-gray-300"
                            error={validationErrors.businessName}
                        />
                        {validationErrors.businessName && (
                            <p className="text-xs mt-1" style={brandTextStyle}>{validationErrors.businessName}</p>
                        )}

                        {/* Business Type Dropdown */}
                        <div className="relative">
                            <Input
                                type="text"
                                name="businessType"
                                placeholder="Business Type"
                                value={formData.businessType || ''}
                                icon={<BriefcaseIcon className="h-5 w-5 text-gray-400" />}
                                rightIcon={
                                    <button
                                        type="button"
                                        onClick={() => setShowBusinessTypes(!showBusinessTypes)}
                                        className="p-1 focus:outline-none"
                                        aria-label="Toggle Business Type Dropdown"
                                    >
                                        <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                                    </button>
                                }
                                readOnly
                                onClick={() => setShowBusinessTypes(!showBusinessTypes)}
                                className="h-[60px] rounded-[15px] border border-gray-300 cursor-pointer"
                            />
                            {showBusinessTypes && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-[15px] shadow-lg max-h-48 overflow-y-auto custom-scrollbar">
                                    {dummyBusinessTypes.map((type) => (
                                        <div
                                            key={type}
                                            className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
                                            onClick={() => handleBusinessTypeSelect(type)}
                                        >
                                            {type}
                                        </div>
                                    ))}
                                </div>
                            )}
                            {validationErrors.businessType && (
                                <p className="text-xs mt-1" style={brandTextStyle}>{validationErrors.businessType}</p>
                            )}
                        </div>

                        {/* NIN Number */}
                        <Input
                            type="text"
                            name="ninNumber"
                            placeholder="NIN Number"
                            value={formData.ninNumber || ''}
                            onChange={handleChange}
                            icon={<IdentificationIcon className="h-5 w-5 text-gray-400" />}
                            className="h-[60px] rounded-[15px] border border-gray-300"
                            error={validationErrors.ninNumber}
                        />
                        {validationErrors.ninNumber && (
                            <p className="text-xs mt-1" style={brandTextStyle}>{validationErrors.ninNumber}</p>
                        )}

                        {/* CAC Number */}
                        <Input
                            type="text"
                            name="cacNumber"
                            placeholder="CAC Number"
                            value={formData.cacNumber || ''}
                            onChange={handleChange}
                            icon={<IdentificationIcon className="h-5 w-5 text-gray-400" />}
                            className="h-[60px] rounded-[15px] border border-gray-300"
                            error={validationErrors.cacNumber}
                        />
                        {validationErrors.cacNumber && (
                            <p className="text-xs mt-1" style={brandTextStyle}>{validationErrors.cacNumber}</p>
                        )}

                        {/* Buttons for Level 2, Internal Step 1 */}
                        <div className="flex gap-4 mt-auto">
                            <Button
                                type="button"
                                onClick={handleBackClick}
                                className="w-[54px] flex items-center justify-center gap-2 rounded-[15px] border border-gray-300 bg-gray-100 py-3 text-gray-800 shadow-sm hover:bg-gray-200"
                                aria-label="Go back to Level 1"
                            >
                                <ArrowLeftIcon className="h-5 w-5" />
                            </Button>

                            {mode === 'upgrade' && (
                                <Button
                                    type="button"
                                    onClick={handleSaveAndExit}
                                    className="rounded-[15px] py-3 text-base shadow-md bg-black text-white hover:bg-gray-800"
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

                {/* Internal Step 2: Document Uploads (NIN Slip, CAC Certificate) */}
                {activeDisplayStep === 2 && (
                    <>
                        {/* NIN Slip Upload */}
                        <label htmlFor="ninSlip" className="block text-sm font-medium text-gray-700">
                            Upload a copy of your NIN Slip
                        </label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md w-full min-h-[120px]">
                            <div className="space-y-1 text-center">
                                <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                                <div className="flex text-sm text-gray-600">
                                    <label
                                        htmlFor="ninSlip"
                                        className="relative cursor-pointer bg-white rounded-md font-medium"
                                        style={brandTextStyle}
                                    >
                                        <span>Upload NIN Slip</span>
                                        <input
                                            id="ninSlip"
                                            name="ninSlip"
                                            type="file"
                                            className="sr-only"
                                            onChange={handleFileChange}
                                            accept="image/*,application/pdf"
                                        />
                                    </label>
                                </div>
                                {formData.ninSlip?.name && (
                                    <p className="text-xs text-gray-500">Selected: {formData.ninSlip.name}</p>
                                )}
                                {/* Display image preview if URL is available */}
                                {formData.ninSlip?.fileUrl && (
                                    <img src={formData.ninSlip.fileUrl} alt="NIN Slip Preview" className="mt-2 max-h-24 mx-auto rounded-md object-cover" />
                                )}
                            </div>
                        </div>
                        {validationErrors.ninSlip && (
                            <p className="text-xs mt-1" style={brandTextStyle}>{validationErrors.ninSlip}</p>
                        )}

                        {/* CAC Certificate Upload */}
                        <label htmlFor="cacCertificate" className="block text-sm font-medium text-gray-700 mt-4">
                            Upload a copy of your CAC Certificate
                        </label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md w-full min-h-[120px]">
                            <div className="space-y-1 text-center">
                                <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                                <div className="flex text-sm text-gray-600">
                                    <label
                                        htmlFor="cacCertificate"
                                        className="relative cursor-pointer bg-white rounded-md font-medium"
                                        style={brandTextStyle}
                                    >
                                        <span>Upload CAC Certificate</span>
                                        <input
                                            id="cacCertificate"
                                            name="cacCertificate"
                                            type="file"
                                            className="sr-only"
                                            onChange={handleFileChange}
                                            accept="image/*,application/pdf"
                                        />
                                    </label>
                                </div>
                                {formData.cacCertificate?.name && (
                                    <p className="text-xs text-gray-500">Selected: {formData.cacCertificate.name}</p>
                                )}
                                {/* Display image preview if URL is available */}
                                {formData.cacCertificate?.fileUrl && (
                                    <img src={formData.cacCertificate.fileUrl} alt="CAC Certificate Preview" className="mt-2 max-h-24 mx-auto rounded-md object-cover" />
                                )}
                            </div>
                        </div>
                        {validationErrors.cacCertificate && (
                            <p className="text-xs mt-1" style={brandTextStyle}>{validationErrors.cacCertificate}</p>
                        )}

                        {/* Buttons for Level 2, Internal Step 2 */}
                        <div className="flex gap-4 w-full mt-auto">
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
                                    className="rounded-[15px] py-3 text-base shadow-md bg-black text-white hover:bg-gray-800"
                                >
                                    Save and Exit
                                </Button>
                            )}
                            <Button
                                type="button"
                                onClick={handleProceed}
                                className="flex-1 w-full rounded-[15px] py-3 text-base shadow-md"
                                style={{ ...brandBgStyle, ...contrastTextStyle, ...brandHoverStyle }}
                            >
                                {mode === 'register' ? 'Proceed To Level 3' : 'Proceed To Level 3'}
                            </Button>
                            {mode === 'register' && onLoginClick && (
                                <Button
                                    type="button"
                                    onClick={() => navigate("/")}
                                    className=" w-[100px] rounded-[15px] border border-gray-300 bg-black py-3 text-white text-xs shadow-sm hover:bg-gray-800"
                                >
                                    Home
                                </Button>
                            )}
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
        </div>
    );
};

export default Level2;
