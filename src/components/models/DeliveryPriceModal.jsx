import React, { useState, useEffect } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import LocationSelectModal from './LocationSelectModal';
import { XMarkIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
// ✅ DYNAMIC DATA: Import the location data and helper function.
import { states, getLgasByState } from '../../utils/locationData';

const DeliveryPriceModal = ({ initialData, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        state: '',
        localGovernment: '',
        variant: 'medium', // Default to 'medium' as it's required by the backend
        deliveryFee: '',
        markForFreeDelivery: false,
    });
    const [validationErrors, setValidationErrors] = useState({});
    const [showLocationSelectModal, setShowLocationSelectModal] = useState(false);
    const [modalTargetField, setModalTargetField] = useState(null); // 'state' or 'localGovernment'
    const [localGovernments, setLocalGovernments] = useState([]);

    useEffect(() => {
        const data = initialData || {
            state: '',
            localGovernment: '',
            variant: 'medium',
            deliveryFee: '',
            markForFreeDelivery: false,
        };
        setFormData(data);
        // If editing, pre-populate the LGAs for the initial state
        if (data.state) {
            setLocalGovernments(getLgasByState(data.state));
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
        setValidationErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
        const errors = {};
        if (!formData.state) errors.state = 'State is required.';
        if (!formData.localGovernment) errors.localGovernment = 'Local Government is required.';
        if (!formData.variant) errors.variant = 'Package size is required.';
        if (!formData.markForFreeDelivery && (!formData.deliveryFee || isNaN(formData.deliveryFee) || parseFloat(formData.deliveryFee) < 0)) {
            errors.deliveryFee = 'A valid fee is required (or mark as free).';
        }
        return errors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = validate();
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }
        onSave(formData);
    };

    const handleOpenLocationSelect = (targetField) => {
        setModalTargetField(targetField);
        setShowLocationSelectModal(true);
    };

    const handleSelectLocation = (selectedLocation) => {
        if (modalTargetField === 'state') {
            setFormData(prev => ({ ...prev, state: selectedLocation, localGovernment: '' }));
            // ✅ DYNAMIC DATA: Get LGAs for the newly selected state.
            setLocalGovernments(getLgasByState(selectedLocation));
        } else {
            setFormData(prev => ({ ...prev, localGovernment: selectedLocation }));
        }
        setValidationErrors(prev => ({ ...prev, [modalTargetField]: '' }));
        setShowLocationSelectModal(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg animate-slide-in-up">
                <button onClick={onCancel} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <XMarkIcon className="h-6 w-6" />
                </button>
                <h2 className="text-xl font-semibold text-gray-800 mb-6">{initialData ? 'Edit' : 'Add'} Delivery Price</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg border border-gray-300 bg-white cursor-pointer" onClick={() => handleOpenLocationSelect('state')}>
                        <span className="text-gray-700">{formData.state || 'Select State'}</span>
                        <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    {validationErrors.state && <p className="text-red-600 text-xs mt-1">{validationErrors.state}</p>}
                    
                    <div className="flex items-center justify-between p-3 rounded-lg border border-gray-300 bg-white cursor-pointer" onClick={() => handleOpenLocationSelect('localGovernment')}>
                        <span className="text-gray-700">{formData.localGovernment || 'Select Local Government'}</span>
                        <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    {validationErrors.localGovernment && <p className="text-red-600 text-xs mt-1">{validationErrors.localGovernment}</p>}
                    
                    <div>
                        <select
                            name="variant"
                            value={formData.variant}
                            onChange={handleChange}
                            className="w-full p-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-red-500 outline-none"
                        >
                            <option value="light">Light Package (e.g., phone case)</option>
                            <option value="medium">Medium Package (e.g., shoes)</option>
                            <option value="heavy">Heavy Package (e.g., appliance)</option>
                        </select>
                        {validationErrors.variant && <p className="text-red-600 text-xs mt-1">{validationErrors.variant}</p>}
                    </div>

                    <Input type="number" name="deliveryFee" placeholder="Delivery Fee (₦)" value={formData.deliveryFee} onChange={handleChange} disabled={formData.markForFreeDelivery} />
                    {validationErrors.deliveryFee && <p className="text-red-600 text-xs mt-1">{validationErrors.deliveryFee}</p>}
                    
                    <div className="flex items-center gap-2">
                        <input type="checkbox" id="markForFreeDelivery" name="markForFreeDelivery" checked={formData.markForFreeDelivery} onChange={handleChange} className="h-4 w-4 rounded text-red-600 focus:ring-red-500" />
                        <label htmlFor="markForFreeDelivery" className="text-sm text-gray-700">Mark for free delivery</label>
                    </div>
                    
                    <button type="submit" className="w-full rounded-lg bg-red-600 py-3 text-white font-semibold shadow-md hover:bg-red-700 transition-colors">Save</button>
                    <Button type="button" onClick={onCancel} className="w-full rounded-lg border bg-gray-100 py-3 text-gray-800 hover:bg-gray-200">Cancel</Button>
                </form>
            </div>

            {showLocationSelectModal && (
                <LocationSelectModal
                    onClose={() => setShowLocationSelectModal(false)}
                    onSelectLocation={handleSelectLocation}
                    title={modalTargetField === 'state' ? 'Select State' : 'Select Local Government'}
                    // ✅ DYNAMIC DATA: Pass the correct list to the location selector.
                    locations={modalTargetField === 'state' ? states.map(s => s.name) : localGovernments}
                />
            )}
        </div>
    );
};

export default DeliveryPriceModal;