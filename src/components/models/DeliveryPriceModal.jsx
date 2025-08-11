// DeliveryPriceModal.jsx
import React, { useState, useEffect } from 'react';
import Input from '../ui/Input'; // Adjust path as needed
import Button from '../ui/Button'; // Still import for other buttons like Cancel
import LocationSelectModal from './LocationSelectModal'; // Adjust path as needed
import { XMarkIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

/**
 * DeliveryPriceModal Component
 * A modal form for adding or editing a delivery price entry.
 *
 * @param {object} props
 * @param {object} [props.initialData] - Initial data for the form when editing.
 * @param {function} props.onSave - Callback function when the form is saved. Receives the new/updated data.
 * @param {function} props.onCancel - Callback function to cancel the operation.
 */
const DeliveryPriceModal = ({ initialData, onSave, onCancel }) => {
    const [formData, setFormData] = useState(initialData || {
        state: '',
        localGovernment: '',
        deliveryFee: '',
        markForFreeDelivery: false,
    });
    const [validationErrors, setValidationErrors] = useState({});

    const [showLocationSelectModal, setShowLocationSelectModal] = useState(false);
    const [modalTargetField, setModalTargetField] = useState(null); // 'state' or 'localGovernment' for current modal

    // Add state to store the list of local governments for the selected state
    const [localGovernments, setLocalGovernments] = useState([]);

    useEffect(() => {
        console.log("DeliveryPriceModal: initialData changed. Resetting form.");
        setFormData(initialData || {
            state: '',
            localGovernment: '',
            deliveryFee: '',
            markForFreeDelivery: false,
        });
        setValidationErrors({}); // Clear errors on initialData change
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        console.log(`DeliveryPriceModal: Handling change for ${name}: ${value}`);
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        setValidationErrors(prev => ({ ...prev, [name]: '' })); // Clear error on change
    };

    const validate = () => {
        const errors = {};
        if (!formData.state) errors.state = 'State is required.';
        if (!formData.localGovernment) errors.localGovernment = 'Local Government is required.';
        if (!formData.markForFreeDelivery && (!formData.deliveryFee || isNaN(formData.deliveryFee) || parseFloat(formData.deliveryFee) < 0)) {
            errors.deliveryFee = 'Valid Delivery Fee is required or mark for free delivery.';
        }
        console.log("DeliveryPriceModal: Validation results:", errors);
        return errors;
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // Crucially prevent default form submission
        console.log("DeliveryPriceModal: handleSubmit triggered. Default prevented.");
        const errors = validate();
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            console.log("DeliveryPriceModal: Validation failed.");
            return;
        }
        console.log("DeliveryPriceModal: Validation passed. Calling onSave with data:", formData);
        onSave(formData);
    };

    // --- Location Select Modal Handlers ---
    const handleOpenLocationSelect = (targetField) => {
        console.log(`DeliveryPriceModal: Opening location select for ${targetField}.`);
        setModalTargetField(targetField);
        setShowLocationSelectModal(true);
    };

    const handleSelectLocation = (selectedLocation) => {
        console.log(`DeliveryPriceModal: Selected location ${selectedLocation} for ${modalTargetField}.`);

        // Check if the user is selecting a State
        if (modalTargetField === 'state') {
            setFormData(prev => ({
                ...prev,
                state: selectedLocation,
                localGovernment: '', // IMPORTANT: Reset local government when a new state is selected
            }));
            // Here you would fetch the local governments for the selected state
            // For now, let's use a dummy list
            if (selectedLocation === 'Lagos State') {
                setLocalGovernments(['Ajeromi-Ifelodun', 'Alimosho', 'Amuwo-Odofin', 'Apapa', 'Badagry', 'Epe', 'Eti-Osa', 'Ibeju-Lekki', 'Ifako-Ijaiye', 'Ikeja', 'Ikorodu', 'Kosofe', 'Lagos Island', 'Lagos Mainland', 'Mushin', 'Ojo', 'Oshodi-Isolo', 'Shomolu', 'Surulere']);
            } else if (selectedLocation === 'FCT, Abuja') {
                setLocalGovernments(['Abaji', 'Bwari', 'Gwagwalada', 'Kuje', 'Kwali', 'Municipal Area Council']);
            } else {
                setLocalGovernments([]);
            }
        } else {
            // If the user is selecting a Local Government
            setFormData(prev => ({
                ...prev,
                [modalTargetField]: selectedLocation
            }));
        }

        setValidationErrors(prev => ({ ...prev, [modalTargetField]: '' }));
        setShowLocationSelectModal(false);
        setModalTargetField(null); // Clear the target field
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            {/* ... Modal content ... */}
            <div className="relative w-full max-w-sm rounded-[20px] bg-white p-6 shadow-lg transform transition-all scale-100 opacity-100 animate-slide-in-up">
                {/* Close Button */}
                <button
                    onClick={onCancel}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
                >
                    <XMarkIcon className="h-6 w-6" />
                </button>

                <h2 className="text-xl font-semibold text-gray-800 mb-6">{initialData ? 'Edit Delivery Price' : 'Add New Delivery Price'}</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* State Selection */}
                    <div
                        className="flex items-center justify-between p-3 rounded-[10px] border border-gray-300 bg-white cursor-pointer h-[50px]"
                        onClick={() => handleOpenLocationSelect('state')}
                    >
                        <span className="text-gray-700">{formData.state || 'Select State'}</span>
                        <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    {validationErrors.state && <p className="text-red-600 text-xs mt-1">{validationErrors.state}</p>}

                    {/* Local Government Selection */}
                    <div
                        className="flex items-center justify-between p-3 rounded-[10px] border border-gray-300 bg-white cursor-pointer h-[50px]"
                        onClick={() => handleOpenLocationSelect('localGovernment')}
                    >
                        <span className="text-gray-700">{formData.localGovernment || 'Select Local Government'}</span>
                        <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    {validationErrors.localGovernment && <p className="text-red-600 text-xs mt-1">{validationErrors.localGovernment}</p>}

                    <Input
                        type="number"
                        name="deliveryFee"
                        placeholder="Delivery Fee"
                        value={formData.deliveryFee}
                        onChange={handleChange}
                        disabled={formData.markForFreeDelivery}
                        className="h-[50px] rounded-[10px] border border-gray-300"
                    />
                    {validationErrors.deliveryFee && <p className="text-red-600 text-xs mt-1">{validationErrors.deliveryFee}</p>}

                    <div className="flex items-center gap-2 mt-3">
                        <input
                            type="checkbox"
                            id="markForFreeDelivery"
                            name="markForFreeDelivery"
                            checked={formData.markForFreeDelivery}
                            onChange={handleChange}
                            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                        />
                        <label htmlFor="markForFreeDelivery" className="text-sm text-gray-700">Mark for free delivery</label>
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-[15px] bg-redd py-3 text-white text-base shadow-md hover:bg-redd"
                    >
                        Save
                    </button>
                    <Button
                        type="button"
                        onClick={onCancel}
                        className="w-full rounded-[15px] border border-gray-300 bg-gray-100 py-3 text-gray-800 shadow-sm hover:bg-gray-200"
                    >
                        Cancel
                    </Button>
                </form>
            </div>

            {/* Location Select Modal */}
            {showLocationSelectModal && (
                <LocationSelectModal
                    onClose={() => setShowLocationSelectModal(false)}
                    onSelectLocation={handleSelectLocation}
                    title={modalTargetField === 'state' ? 'State' : 'Local Government'}
                    currentValue={modalTargetField === 'state' ? formData.state : formData.localGovernment}
                    // IMPORTANT: Pass the relevant list of locations to the modal
                    locations={modalTargetField === 'state' ? ['Lagos State', 'FCT, Abuja', 'Ogun State'] : localGovernments}
                    popularLocations={modalTargetField === 'state' ? ['Lagos State', 'FCT, Abuja'] : []}
                />
            )}
        </div>
    );
};

export default DeliveryPriceModal;
