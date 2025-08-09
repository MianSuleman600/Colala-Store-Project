// src/components/ui/DeliveryPriceCard.jsx
import React from 'react';
import Button from './Button'; // Assuming Button component path

/**
 * DeliveryPriceCard Component
 * Displays a single delivery price entry as a card, matching the design in asa.png.
 *
 * @param {object} props
 * @param {object} props.priceEntry - The delivery price object { state, localGovernment, deliveryFee, markForFreeDelivery }
 * @param {function} props.onEdit - Callback function to edit this entry.
 * @param {function} props.onDelete - Callback function to delete this entry.
 */
const DeliveryPriceCard = ({ priceEntry, onEdit, onDelete }) => {
    // Ensure deliveryFee is a number for formatting, default to 0 if not
    const formattedDeliveryFee = parseFloat(priceEntry.deliveryFee || 0).toLocaleString();

    return (
        <div className="p-4 border border-gray-200 rounded-2xl bg-white shadow-sm relative overflow-hidden">
            {/* "Free Delivery Active" label */}
            {priceEntry.markForFreeDelivery && (
                <div className="absolute top-0 right-0 bg-green-500 text-white text-xs px-3 py-1 rounded-bl-lg font-medium">
                    Free Delivery Active
                </div>
            )}

            {/* Content Container (adjusting based on the image's structure) */}
            <div className="space-y-2 mb-4"> {/* Adjusted spacing */}
                {/* State */}
                <div>
                    <p className="text-sm text-gray-500">State</p>
                    <p className="text-base font-bold text-gray-800">{priceEntry.state}</p>
                </div>

                {/* Local Government */}
                <div>
                    <p className="text-sm text-gray-500">Local Government</p>
                    <p className="text-base font-bold text-gray-700">{priceEntry.localGovernment}</p>
                </div>

                {/* Price */}
                <div>
                    <p className="block text-sm text-gray-500">Price</p>
                    <p className="text-lg font-bold text-gray-900">
                        {priceEntry.markForFreeDelivery
                            ? 'Free'
                            : `₦${formattedDeliveryFee}`}
                    </p>
                </div>
            </div>

            {/* Edit and Delete Buttons */}
            <div className="flex justify-end gap-2">
                <Button
                    type="button"
                    onClick={onEdit}
                    // Adjusted styles to match the image, typically `redd` is your primary action color
                    className="px-4 py-2 text-sm rounded-md bg-redd text-white hover:bg-red-700 shadow-sm transition-colors"
                >
                    Edit
                </Button>
                <Button
                    type="button"
                    onClick={onDelete}
                    // Adjusted styles to match the image
                    className="px-4 py-2 text-sm rounded-md border border-redd text-redd hover:bg-red-50  shadow-sm transition-colors"
                >
                    Delete
                </Button>
            </div>
        </div>
    );
};

export default DeliveryPriceCard;