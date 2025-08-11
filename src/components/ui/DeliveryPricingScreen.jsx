// src/components/ui/DeliveryPricingScreen.jsx
import React, { useState } from 'react';
import Button from './Button'; // Adjust path as needed
import DeliveryPriceModal from '../models/DeliveryPriceModal'; // Adjust path as needed
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

/**
 * DeliveryPricingScreen Component
 * This component acts as a modal overlay specifically for adding or editing
 * a single delivery price entry. It does not manage or display a list of prices.
 *
 * @param {object} props
 * @param {object | null} props.initialData - The delivery pricing object to edit, or null for a new entry.
 * @param {function} props.onSave - Callback to save the new/edited delivery pricing object.
 * @param {function} props.onClose - Callback to close this DeliveryPricingScreen modal.
 */
const DeliveryPricingScreen = ({ initialData, onSave, onClose }) => {
    // DeliveryPriceModal should always be visible when DeliveryPricingScreen is open
    // We don't need a separate state to control its visibility if DeliveryPricingScreen's job is just to wrap it.
    // The previous state was technically redundant if the screen's purpose is always to show the modal.

    const handleInnerSave = (priceData) => {
        onSave(priceData); // Pass the data up to Level3
        onClose(); // Close the outer DeliveryPricingScreen modal immediately after save
    };

    const handleInnerCancel = () => {
        onClose(); // Close the outer DeliveryPricingScreen modal on cancel
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 space-y-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center gap-2 mb-6">
                    <Button
                        type="button"
                        onClick={handleInnerCancel} // Back button acts as cancel for the whole process
                        className="p-2 rounded-full bg-gray-100 text-gray-800 hover:bg-gray-200"
                    >
                        <ArrowLeftIcon className="h-5 w-5" />
                    </Button>
                    <h2 className="text-xl text-gray-800 font-semibold">
                        {initialData ? 'Edit Delivery Price' : 'Add New Delivery Price'}
                    </h2>
                </div>

                {/* DeliveryPriceModal is always rendered inside this screen */}
                <DeliveryPriceModal
                    initialData={initialData}
                    onSave={handleInnerSave}
                    onCancel={handleInnerCancel}
                />
            </div>
        </div>
    );
};

export default DeliveryPricingScreen;

