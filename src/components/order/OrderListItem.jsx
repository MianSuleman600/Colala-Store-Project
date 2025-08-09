// src/components/orders/OrderListItem.jsx
import React from 'react';
import Card from '../ui/Card'; // Reusing your Card component
import { ShoppingCartIcon } from '@heroicons/react/24/outline'; // Icon for shopping cart

/**
 * OrderListItem Component
 * Displays a summary of a customer's order for the left-hand list.
 *
 * @param {object} props
 * @param {object} props.order - The order object.
 * @param {string} props.order.id - Unique ID of the order/customer.
 * @param {string} props.order.customerName - Name of the customer.
 * @param {number} props.order.itemCount - Number of items in the order.
 * @param {number} props.order.totalPrice - Total price of the order.
 * @param {boolean} props.isActive - Whether this item is currently selected/active.
 * @param {function} props.onClick - Callback function when the item is clicked.
 * @param {string} props.brandColor - Primary brand color for styling.
 */
const OrderListItem = ({ order, isActive, onClick, brandColor }) => {
    return (
        <Card
            className={`flex items-center p-4 rounded-xl cursor-pointer transition-all duration-200
                ${isActive ? 'border-2' : 'border border-gray-200 hover:shadow-md'}`}
            style={isActive ? { borderColor: brandColor, backgroundColor: '#FEE2E2' } : {}}
            onClick={() => onClick(order.id)}
        >
            {/* Cart Icon Circle */}
            <div
                className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center mr-4`}
                style={{ backgroundColor: isActive ? brandColor : '#FEE2E2' }}
            >
                <ShoppingCartIcon className="h-6 w-6" style={{ color: isActive ? 'white' : brandColor }} />
            </div>

            {/* Customer Info */}
            <div className="flex-grow">
                <h3 className="text-lg font-semibold text-gray-800">{order.customerName}</h3>
                <p className="text-sm text-gray-500" >{order.itemCount} items</p>
            </div>

            {/* Total Price */}
            <div className="flex-shrink-0 text-right">
                <span className="text-lg font-bold" style={{ color: brandColor }}>
                    N{order.totalPrice.toLocaleString()}
                </span>
            </div>
        </Card>
    );
};

export default OrderListItem;
