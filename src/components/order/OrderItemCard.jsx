
// src/components/orders/OrderItemCard.jsx
import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';

/**
 * OrderItemCard Component
 * Displays a single item within a customer's order details.
 *
 * @param {object} props
 * @param {object} props.item - The item object.
 * @param {string} props.item.imageUrl - URL of the item image.
 * @param {string} props.item.name - Name of the item.
 * @param {number} props.item.price - Price of the item.
 * @param {number} props.item.quantity - Quantity of the item.
 * @param {function} props.onTrackOrder - Callback for tracking the order, now passes the full item.
 * @param {string} props.brandColor - Primary brand color for styling.
 * @param {string} props.contrastTextColor - Text color for contrast.
 */
const OrderItemCard = ({ item, onTrackOrder, brandColor, contrastTextColor }) => {
    return (
        <Card className="flex items-center p-4 rounded-xl shadow-sm border border-gray-200 bg-white">
            {/* Item Image */}
            <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center mr-4">
                {item.imageUrl ? (
                    <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/80x80/e0e0e0/000000?text=No+Image"; }}
                    />
                ) : (
                    <span className="text-gray-400 text-center text-xs">No Image</span>
                )}
            </div>

            {/* Item Details */}
            <div className="flex-grow">
                <h3 className="text-base font-semibold text-gray-800">{item.name}</h3>
                <p className="text-sm font-bold mt-1" style={{ color: brandColor }}>
                    N{item.price.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">Qty : {item.quantity}</p>
            </div>

            {/* Track Order Button */}
            <div className="flex-shrink-0 ml-4">
                <Button
                    onClick={() => onTrackOrder(item)} // Pass the entire item object
                    className="py-2 px-4 rounded-lg text-sm font-medium"
                    style={{ backgroundColor: brandColor, color: contrastTextColor }}
                >
                    Track Order
                </Button>
            </div>
        </Card>
    );
};

export default OrderItemCard;
