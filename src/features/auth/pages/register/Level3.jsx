// src/components/auth/register/Level3.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { updateField } from '../../../../features/auth/registrationSlice';
import { useNavigate } from 'react-router-dom';

// --- UI Components (assuming these paths are correct) ---
import Input from '../../../../components/ui/Input';
import Button from '../../../../components/ui/Button';
import LocationSelectModal from '../../../../components/models/LocationSelectModal';
import DeliveryPricingScreen from '../../../../components/ui/DeliveryPricingScreen';
import DeliveryPriceCard from '../../../../components/ui/DeliveryPriceCard';
import StepIndicator from '../../../../components/ui/StepIndicator';

// --- Icons ---
import {
    ArrowLeftIcon,
    ChevronRightIcon,
    CameraIcon,
    TrashIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';

/**
 * Level3 Component
 * The final step of the registration, handling store customization and address details,
 * or the confirmation step for the store upgrade flow.
 *
 * @param {object} props
 * @param {object} props.formData - The current state of the form.
 * @param {function} props.handleChange - A function to dispatch simple field updates.
 * @param {function} props.handleFileChange - A function to dispatch file updates.
 * @param {function} props.onBack - A function to navigate to the previous step.
 * @param {function} props.onNext - A function to proceed to the next step (if there were more).
 * @param {function} props.onSubmit - The final submission handler.
 * @param {function} [props.onLoginClick] - Handler to switch to the login modal (only for register mode).
 * @param {number} props.currentStep - The current active step in the main registration flow.
 * @param {string} [props.mode='register'] - 'register' for registration flow, 'upgrade' for store upgrade flow.
 * @param {string} [props.brandColor='#EF4444'] - Primary brand color in hex (e.g., '#FF0000').
 * @param {string} [props.contrastColor='#FFFFFF'] - Contrast text color in hex (e.g., '#FFFFFF').
 */
const Level3 = ({
    formData,
    handleChange,
    handleFileChange,
    onBack,
    onNext,
    onSubmit,
    onLoginClick,
    currentStep,
    mode = 'register',
    brandColor = '#EF4444',
    contrastColor = '#FFFFFF',
}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // --- Local UI State ---
    const [validationErrors, setValidationErrors] = useState({});
    const [showStoreAddressForm, setShowStoreAddressForm] = useState(false);
    const [showDeliveryPricingModal, setShowDeliveryPricingModal] = useState(false);
    const [editingDeliveryPriceData, setEditingDeliveryPriceData] = useState(null);
    const [editingDeliveryPriceIndex, setEditingDeliveryPriceIndex] = useState(null);
    const [showLocationSelectModal, setShowLocationSelectModal] = useState(false);
    const [modalTargetField, setModalTargetField] = useState(null);

    // Dummy data for brand color selection and opening hours
    const dummyColors = ['#FF0000', '#0000FF', '#008000', '#FFA500', '#800080', '#FFC0CB', '#00CED1', '#FFD700', '#A52A2A'];
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    // Define the global step numbers for Level 3's sub-steps
    const level3StartStepRegister = 6;
    const level3StepsRegister = [level3StartStepRegister, level3StartStepRegister + 1];
    const activeDisplayStepRegister = currentStep - level3StartStepRegister + 1;
    const activeDisplayStepUpgrade = 1;

    // --- IMPORTANT: Provide robust default values for formData and its nested objects ---
    const currentFormData = {
        ...(formData || {}),
        hasPhysicalStore: formData?.hasPhysicalStore ?? false,
        storeVideo: formData?.storeVideo ?? null,
        storeAddress: {
            state: formData?.storeAddress?.state ?? '',
            localGovernment: formData?.storeAddress?.localGovernment ?? '',
            fullAddress: formData?.storeAddress?.fullAddress ?? '',
            openingHours: formData?.storeAddress?.openingHours || daysOfWeek.map(day => ({ day, from: '', to: '' })),
        },
        deliveryPricing: formData?.deliveryPricing ?? [],
        selectedColor: formData?.selectedColor ?? '#FF0000',
    };

    const { hasPhysicalStore, storeVideo, storeAddress, deliveryPricing, selectedColor } = currentFormData;


    // --- Handlers for Complex State Updates ---

    // Handles changes for individual store address fields (e.g., fullAddress)
    const handleStoreAddressChange = useCallback((e) => {
        const { name, value } = e.target;
        const newStoreAddress = {
            ...storeAddress,
            [name]: value,
        };
        dispatch(updateField({ name: 'storeAddress', value: newStoreAddress }));
        setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }, [dispatch, storeAddress]);

    // Handles changes for opening hours (from/to for each day)
    const handleOpeningHoursChange = useCallback((dayIndex, field, value) => {
        const updatedHours = [...storeAddress.openingHours];
        updatedHours[dayIndex] = { ...updatedHours[dayIndex], [field]: value };
        const newStoreAddress = { ...storeAddress, openingHours: updatedHours };
        dispatch(updateField({ name: 'storeAddress', value: newStoreAddress }));
    }, [dispatch, storeAddress]);

    // This handler is called by DeliveryPricingScreen (our add/edit modal) when a price is saved.
    const handleSaveDeliveryPrice = useCallback((priceData) => {
        let updatedPricing;
        if (editingDeliveryPriceIndex !== null) {
            updatedPricing = deliveryPricing.map((item, idx) =>
                idx === editingDeliveryPriceIndex ? priceData : item
            );
        } else {
            updatedPricing = [...deliveryPricing, priceData];
        }
        dispatch(updateField({ name: 'deliveryPricing', value: updatedPricing }));
        setValidationErrors(prev => ({ ...prev, deliveryPricingStatus: '' }));
        setEditingDeliveryPriceData(null);
        setEditingDeliveryPriceIndex(null);
        setShowDeliveryPricingModal(false);
    }, [dispatch, deliveryPricing, editingDeliveryPriceIndex]);

    // Handlers to open the DeliveryPricingScreen modal for adding or editing
    const handleAddDeliveryPrice = useCallback(() => {
        setEditingDeliveryPriceData(null);
        setEditingDeliveryPriceIndex(null);
        setShowDeliveryPricingModal(true);
    }, []);

    const handleEditDeliveryPrice = useCallback((index) => {
        setEditingDeliveryPriceData(deliveryPricing[index]);
        setEditingDeliveryPriceIndex(index);
        setShowDeliveryPricingModal(true);
    }, [deliveryPricing]);

    // Handler to delete a delivery zone directly from the Level3 display list
    const handleDeleteDeliveryZone = useCallback((indexToDelete) => {
        const updatedPricing = deliveryPricing.filter((_, index) => index !== indexToDelete);
        dispatch(updateField({ name: 'deliveryPricing', value: updatedPricing }));
    }, [dispatch, deliveryPricing]);

    // Handles selection of the brand color
    const handleColorSelect = useCallback((color) => {
        dispatch(updateField({ name: 'selectedColor', value: color }));
    }, [dispatch]);

    // --- Location Modal Handlers (for store address state/LGA) ---
    const handleOpenLocationSelect = useCallback((targetField) => {
        setModalTargetField(targetField);
        setShowLocationSelectModal(true);
    }, []);

    const handleSelectLocation = useCallback((selectedLocation) => {
        const keys = modalTargetField.split('.');
        const fieldToUpdate = keys[1];

        const newStoreAddress = {
            ...storeAddress,
            [fieldToUpdate]: selectedLocation,
        };
        dispatch(updateField({ name: 'storeAddress', value: newStoreAddress }));

        if (fieldToUpdate === 'state') setValidationErrors(prev => ({ ...prev, storeAddressState: '' }));
        if (fieldToUpdate === 'localGovernment') setValidationErrors(prev => ({ ...prev, storeAddressLGA: '' }));

        setShowLocationSelectModal(false);
        setModalTargetField(null);
    }, [dispatch, modalTargetField, storeAddress]);

    // --- Validation Logic for Sub-steps ---
    const validateStep1 = useCallback(() => {
        const errors = {};
        if (hasPhysicalStore && !storeVideo?.name) {
            errors.storeVideo = "A 1-minute video of your store is required if you have a physical store.";
        }
        setValidationErrors(errors);
        return !hasPhysicalStore || (hasPhysicalStore && storeVideo?.name);
    }, [hasPhysicalStore, storeVideo]);

    const validateStoreAddress = useCallback(() => {
        const errors = {};
        if (!storeAddress.state) errors.storeAddressState = 'State is required.';
        if (!storeAddress.localGovernment) errors.storeAddressLGA = 'Local Government is required.';
        if (!storeAddress.fullAddress.trim()) errors.storeAddressFull = 'Full Address is required.';
        return errors;
    }, [storeAddress]);

    const validateStep2 = useCallback(() => {
        const errors = {};
        if (hasPhysicalStore) {
            if (showStoreAddressForm) {
                const addressErrors = validateStoreAddress();
                if (Object.keys(addressErrors).length > 0) {
                    errors.storeAddressStatus = "Please save or complete the store address details.";
                }
            }
            // Ensure address is filled if physical store is true and form is not open or has errors
            if (!storeAddress.fullAddress || !storeAddress.state || !storeAddress.localGovernment) {
                if (!showStoreAddressForm || (showStoreAddressForm && Object.keys(validateStoreAddress()).length > 0)) {
                    errors.storeAddressStatus = "Store address must be fully added if you have a physical store.";
                }
            }
        }
        // CORRECTED: Safely check for deliveryPricing array and its length
        if (!deliveryPricing || deliveryPricing.length === 0) {
            errors.deliveryPricingStatus = "At least one delivery price zone must be added.";
        }
        if (!selectedColor) {
            errors.selectedColor = "Please select a color for your brand.";
        }
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    }, [hasPhysicalStore, showStoreAddressForm, storeAddress, deliveryPricing, selectedColor, validateStoreAddress]);

    // Handler to save the store address details
    const handleSaveStoreAddress = useCallback(() => {
        const errors = validateStoreAddress();
        if (Object.keys(errors).length > 0) {
            setValidationErrors(prev => ({ ...prev, ...errors }));
            return false;
        }
        setValidationErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.storeAddressState;
            delete newErrors.storeAddressLGA;
            delete newErrors.storeAddressFull;
            delete newErrors.storeAddressStatus;
            return newErrors;
        });
        setShowStoreAddressForm(false);
        return true;
    }, [validateStoreAddress]);

    // --- Navigation Handlers ---
    const handleProceed = useCallback(() => {
        if (mode === 'register') {
            if (activeDisplayStepRegister === 1) {
                if (validateStep1()) {
                    onNext();
                }
            } else if (activeDisplayStepRegister === 2) {
                if (validateStep2()) {
                    onSubmit();
                }
            }
        } else if (mode === 'upgrade') {
            if (validateStep1() && validateStep2()) {
                onSubmit();
            }
        }
    }, [mode, activeDisplayStepRegister, onNext, onSubmit, validateStep1, validateStep2]);

    const handleBackClick = useCallback(() => {
        onBack();
    }, [onBack]);

    // Inline styles for brand colors
    const brandBgStyle = { backgroundColor: brandColor };
    const brandTextStyle = { color: brandColor };
    const brandBorderStyle = { borderColor: brandColor };
    const brandRingStyle = { '--tw-ring-color': brandColor };
    const contrastTextStyle = { color: contrastColor };
    const brandHoverStyle = { filter: 'brightness(110%)' };

    // Determine which steps and currentStep to pass to StepIndicator based on mode
    const stepsForIndicator = mode === 'register' ? level3StepsRegister : [1];
    const currentStepForIndicator = mode === 'register' ? activeDisplayStepRegister : activeDisplayStepUpgrade;

    return (
        <div className={`w-full h-full max-h-[90vh] ${mode === 'register' ? 'max-w-[389px] px-4 py-2 sm:px-8' : 'p-0'}`}>
            {/* Level Indicator / Title */}
            <div className="w-full p-4 mt-6 border rounded-[15px] shadow-sm bg-white space-y-3 min-h-[60px] flex flex-col justify-center" style={brandBorderStyle}>
                <div className="flex items-center justify-between">
                    <h4 className="text-[18px] font-semibold leading-none font-manrope" style={brandTextStyle}>
                        {mode === 'register' ? 'Level 3' : 'Upgrade Store'}
                    </h4>
                    {(mode === 'register' || mode === 'upgrade') && (
                        <button type="button" className="text-sm hover:underline whitespace-nowrap" style={brandTextStyle}>
                            View Benefits
                        </button>
                    )}
                </div>

                {/* StepIndicator - Now always visible, with corrected props */}
                <StepIndicator
                    steps={stepsForIndicator}
                    currentStep={currentStepForIndicator}
                    brandColor={brandColor}
                    contrastColor={contrastColor}
                />
            </div>

            <form onSubmit={(e) => { e.preventDefault(); }} className="space-y-4 w-full mx-auto mt-8 flex flex-col h-full">
                {/* Level 3, Step 1 (Register Mode) or always visible (Upgrade Mode) */}
                {(mode === 'register' && activeDisplayStepRegister === 1) || mode === 'upgrade' ? (
                    <>
                        <div className="flex items-center justify-between p-3 rounded-[15px] border border-gray-300 bg-white cursor-pointer h-[60px] shadow-sm">
                            <span className="text-gray-700 font-medium">Does your business have a physical store?</span>
                            <label htmlFor="hasPhysicalStoreToggle" className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    id="hasPhysicalStoreToggle"
                                    className="sr-only peer"
                                    checked={hasPhysicalStore}
                                    onChange={() => handleChange({ target: { name: 'hasPhysicalStore', value: !hasPhysicalStore } })}
                                />
                                <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`} style={hasPhysicalStore ? { backgroundColor: brandColor } : {}}></div>
                            </label>
                        </div>

                        {hasPhysicalStore && (
                            <>
                                <label htmlFor="storeVideo" className="block text-sm font-medium text-gray-700 mt-4">
                                    Upload a 1 minute video of your store
                                </label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md w-full min-h-[120px]">
                                    <div className="space-y-1 text-center">
                                        <CameraIcon className="mx-auto h-12 w-12 text-gray-400" />
                                        <div className="flex text-sm text-gray-600">
                                            <label
                                                htmlFor="storeVideo"
                                                className="relative cursor-pointer bg-white rounded-md font-medium"
                                                style={brandTextStyle}
                                            >
                                                <span>Upload video</span>
                                                <input
                                                    id="storeVideo"
                                                    name="storeVideo"
                                                    type="file"
                                                    className="sr-only"
                                                    onChange={handleFileChange}
                                                    accept="video/*"
                                                />
                                            </label>
                                        </div>
                                        {storeVideo?.name && (
                                            <p className="text-xs text-gray-500">Selected: {storeVideo.name}</p>
                                        )}
                                        {storeVideo?.fileUrl && (
                                            <video controls src={storeVideo.fileUrl} className="mt-2 max-h-24 mx-auto rounded-md object-cover" />
                                        )}
                                    </div>
                                </div>
                                {validationErrors.storeVideo && (
                                    <p className="text-xs mt-1" style={brandTextStyle}>{validationErrors.storeVideo}</p>
                                )}
                            </>
                        )}
                    </>
                ) : null}

                {/* Level 3, Step 2 (Register Mode) or always visible (Upgrade Mode) */}
                {(mode === 'register' && activeDisplayStepRegister === 2) || mode === 'upgrade' ? (
                    <>
                        {/* ADD STORE ADDRESS */}
                        {hasPhysicalStore && (
                            <>
                                <div
                                    className="flex items-center justify-between p-3 rounded-[10px] border border-gray-300 bg-white cursor-pointer h-[50px] shadow-sm"
                                    onClick={() => setShowStoreAddressForm(!showStoreAddressForm)}
                                >
                                    <span className="text-gray-700 font-medium">
                                        {storeAddress.fullAddress ? 'Edit Store Address' : 'Add Store Address'}
                                    </span>
                                    <ChevronRightIcon className="h-5 w-5" />
                                </div>
                                {validationErrors.storeAddressStatus && <p className="text-xs mt-1" style={brandTextStyle}>{validationErrors.storeAddressStatus}</p>}
                            </>
                        )}

                        {hasPhysicalStore && showStoreAddressForm && (
                            <div className="mt-4 p-4 border border-gray-200 rounded-md bg-white shadow-sm space-y-3">
                                <h4 className="font-semibold text-gray-700">Enter Store Address</h4>

                                <div
                                    className="flex items-center justify-between p-3 rounded-[10px] border border-gray-300 bg-white cursor-pointer h-[50px]"
                                    onClick={() => handleOpenLocationSelect('storeAddress.state')}
                                >
                                    <span className="text-gray-700">{storeAddress.state || 'Select State'}</span>
                                    <ChevronRightIcon className="h-5 w-5" />
                                </div>
                                {validationErrors.storeAddressState && <p className="text-xs mt-1" style={brandTextStyle}>{validationErrors.storeAddressState}</p>}

                                <div
                                    className="flex items-center justify-between p-3 rounded-[10px] border border-gray-300 bg-white cursor-pointer h-[50px]"
                                    onClick={() => handleOpenLocationSelect('storeAddress.localGovernment')}
                                >
                                    <span className="text-gray-700">{storeAddress.localGovernment || 'Select Local Government'}</span>
                                    <ChevronRightIcon className="h-5 w-5" />
                                </div>
                                {validationErrors.storeAddressLGA && <p className="text-xs mt-1" style={brandTextStyle}>{validationErrors.storeAddressLGA}</p>}

                                <Input
                                    type="text" name="fullAddress" placeholder="Enter full address"
                                    value={storeAddress.fullAddress} onChange={handleStoreAddressChange}
                                    className="h-[50px] rounded-[10px] border border-gray-300"
                                />
                                {validationErrors.storeAddressFull && <p className="text-xs mt-1" style={brandTextStyle}>{validationErrors.storeAddressFull}</p>}

                                <h5 className="text-sm font-semibold text-gray-700 mt-4 mb-2">Opening Hours</h5>
                                <div className="space-y-3">
                                    {daysOfWeek.map((day, index) => (
                                        <div key={day} className="flex flex-wrap items-center gap-2 sm:gap-4">
                                            <label className="w-24 text-sm text-gray-600">{day}</label>
                                            <Input
                                                type="time"
                                                value={storeAddress.openingHours[index]?.from ?? ''}
                                                onChange={(e) => handleOpeningHoursChange(index, 'from', e.target.value)}
                                                className="flex-1 min-w-[100px] h-[40px] rounded-[8px] border-gray-300"
                                            />
                                            <span className="text-gray-500">to</span>
                                            <Input
                                                type="time"
                                                value={storeAddress.openingHours[index]?.to ?? ''}
                                                onChange={(e) => handleOpeningHoursChange(index, 'to', e.target.value)}
                                                className="flex-1 min-w-[100px] h-[40px] rounded-[8px] border-gray-300"
                                            />
                                        </div>
                                    ))}
                                </div>

                                <Button type="button" onClick={handleSaveStoreAddress} className="w-full rounded-[10px] cursor-pointer py-2 text-sm mt-4" style={{ ...brandBgStyle, ...contrastTextStyle, ...brandHoverStyle }}>Save Address</Button>
                                <Button type="button" onClick={() => setShowStoreAddressForm(false)} className="w-full rounded-[10px] cursor-pointer border border-gray-300 bg-gray-100 py-2 text-gray-800 text-sm hover:bg-gray-200 mt-2">Cancel</Button>
                            </div>
                        )}

                        {/* ADD DELIVERY PRICE */}
                        <div
                            className="flex items-center justify-between p-3 rounded-[10px] border border-gray-300 bg-white cursor-pointer h-[50px] shadow-sm"
                            onClick={handleAddDeliveryPrice}
                        >
                            <span className="text-gray-700 font-medium">Add Delivery Pricing</span>
                            <ChevronRightIcon className="h-5 w-5" />
                        </div>
                        {validationErrors.deliveryPricingStatus && <p className="text-xs mt-1" style={brandTextStyle}>{validationErrors.deliveryPricingStatus}</p>}

                        {/* Display existing Delivery Zones */}
                        {Array.isArray(deliveryPricing) && deliveryPricing.length > 0 && (
                            <div className="mt-4 p-4 rounded-md bg-white shadow-sm space-y-3">
                                {deliveryPricing.map((zone, index) => (
                                    <DeliveryPriceCard
                                        key={index}
                                        priceEntry={zone}
                                        onEdit={() => handleEditDeliveryPrice(index)}
                                        onDelete={() => handleDeleteDeliveryZone(index)}
                                        brandColor={brandColor}
                                        contrastColor={contrastColor}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Select a color that suits your brand */}
                        <p className="text-sm text-gray-600 mb-3">Select a color that suits your brand and your store shall be customized as such</p>
                        <div className="grid grid-cols-5 gap-3 p-3 border border-gray-300 rounded-[15px] bg-white shadow-sm">
                            {dummyColors.map((color) => (
                                <div
                                    key={color}
                                    className={`w-10 h-10 rounded-full cursor-pointer border-2 ${selectedColor === color ? 'border-gray-500' : 'border-transparent'}`}
                                    style={{ backgroundColor: color }}
                                    onClick={() => handleColorSelect(color)}
                                    aria-label={`Select color ${color}`}
                                ></div>
                            ))}
                        </div>
                        {validationErrors.selectedColor && <p className="text-xs mt-1" style={brandTextStyle}>{validationErrors.selectedColor}</p>}
                    </>
                ) : null}


                {/* Action Buttons */}
                <div className="flex gap-2 w-full mt-auto">
                    <Button
                        type="button"
                        onClick={handleBackClick}
                        className="flex items-center cursor-pointer justify-center rounded-[15px] border border-gray-300 bg-gray-100 p-3 text-gray-800 shadow-sm hover:bg-gray-200"
                        aria-label="Go back"
                    >
                        <ArrowLeftIcon className="h-5 w-5" />
                    </Button>
                    <Button
                        type="button"
                        onClick={handleProceed}
                        className="flex-1 w-full cursor-pointer rounded-[15px] py-3 text-base shadow-md"
                        style={{ ...brandBgStyle, ...contrastTextStyle, ...brandHoverStyle }}
                    >
                        {mode === 'register' && activeDisplayStepRegister === 1 ? 'Proceed' : (mode === 'register' ? 'Complete Registration' : 'Confirm Upgrade')}
                    </Button>
                    {(mode === 'register' && onLoginClick) || (mode === 'upgrade') ? (
                        <Button
                            type="button"
                            onClick={() => navigate("/")}
                            className="w-[100px] rounded-[15px] cursor-pointer border border-gray-300 bg-black py-3 text-white text-xs shadow-sm hover:bg-gray-800"
                        >
                            Home
                        </Button>
                    ) : null}
                </div>
                {mode === 'register' && onLoginClick && (
                    <Button
                        onClick={onLoginClick}
                        className="w-full rounded-[15px] cursor-pointer border border-gray-300 bg-gray-100 py-3 text-gray-800 shadow-sm hover:bg-gray-200 mt-4"
                    >
                        Login
                    </Button>
                )}
            </form>

            {/* Location Select Modal (for store address state/LGA) */}
            {showLocationSelectModal && (
                <LocationSelectModal
                    onClose={() => setShowLocationSelectModal(false)}
                    onSelectLocation={handleSelectLocation}
                    title={modalTargetField.includes('state') ? 'Select State' : 'Select Local Government'}
                    currentValue={modalTargetField.includes('state') ? storeAddress.state : storeAddress.localGovernment}
                />
            )}

            {/* Delivery Pricing Screen Modal (rendered as an overlay for ADDING/EDITING) */}
            {showDeliveryPricingModal && (
                <DeliveryPricingScreen
                    initialData={editingDeliveryPriceData}
                    onSave={handleSaveDeliveryPrice}
                    onClose={() => {
                        setShowDeliveryPricingModal(false);
                        setEditingDeliveryPriceData(null);
                        setEditingDeliveryPriceIndex(null);
                    }}
                    brandColor={brandColor}
                    contrastColor={contrastColor}
                />
            )}
        </div>
    );
};

export default Level3;
