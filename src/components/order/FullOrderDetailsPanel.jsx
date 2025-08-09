// src/components/orders/FullOrderDetailsPanel.jsx
import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { getContrastTextColor } from '../../utils/colorUtils';
import { ArrowLeftIcon } from '@heroicons/react/24/outline'; // Assuming you have this icon

/**
 * FullOrderDetailsPanel Component
 * Displays comprehensive details of a specific order, including items, pricing,
 * delivery address, and discount information. Matches the design in 'image_11ba44.png' and 'image_49b610.png'.
 *
 * @param {object} props
 * @param {object} props.order - The full order object to display.
 * @param {string} props.order.id - Order ID.
 * @param {object[]} props.order.items - Array of items in the order.
 * @param {number} props.order.totalPrice - Total price of the order.
 * @param {string} props.order.paymentMethod - Payment method.
 * @param {string} props.order.deliveryAddress - Delivery address.
 * @param {string} props.order.phoneNumber - Customer phone number.
 * @param {number} props.order.itemsCost - Cost of items.
 * @param {number} props.order.couponDiscount - Coupon discount amount.
 * @param {number} props.order.pointsDiscount - Points discount amount.
 * @param {number} props.order.deliveryFee - Delivery fee.
 * @param {number} props.order.totalToPay - Final total to pay.
 * @param {string} props.brandColor - Primary brand color for styling.
 * @param {string} props.contrastTextColor - Text color for contrast.
 * @param {function} props.onBackToTracker - Callback to go back to the order tracker.
 */
const FullOrderDetailsPanel = ({ order, brandColor, contrastTextColor, onBackToTracker }) => {
    // DEBUG: Log the 'order' prop received by this component
    console.log('[FullOrderDetailsPanel] Received order prop:', order);

    if (!order) {
        return (
            <div className="p-6 bg-white rounded-xl shadow-md flex items-center justify-center h-full text-gray-500">
                No order details available.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header with Back Button (for mobile) and Title - Moved from OrderTrackerPanel for consistency */}
            {/* This header is now managed by the parent OrderTrackerPanel for title consistency */}
            {/* The back button functionality is handled by onBackToTracker prop */}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-1 space-y-4">
                    {/* Order ID and Item List Card (Red Background) */}
                    <Card className="p-4 rounded-xl shadow-md" style={{ backgroundColor: brandColor }}>
                        {/* Order ID Title inside the red card */}
                        <h3 className="text-lg  text-white mb-4 p-4 rounded-2xl" style={{ backgroundColor: brandColor }}>ORD-{order.id?.slice(0, 7).toUpperCase()}FG</h3>

                        <div className="space-y-4">
                            {order.items?.map(item => (
                                <div key={item.id} className="flex items-center p-3 rounded-lg bg-white shadow-sm">
                                    <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center mr-3">
                                        {item.imageUrl ? (
                                            <img
                                                src={item.imageUrl}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/64x64/e0e0e0/000000?text=No+Image"; }}
                                            />
                                        ) : (
                                            <span className="text-gray-400 text-center text-xs">No Image</span>
                                        )}
                                    </div>
                                    <div className="flex-grow">
                                        <p className="text-base font-medium text-gray-800">{item.name}</p>
                                        <p className="text-sm font-bold mt-1" style={{ color: brandColor }}>
                                            N{item.price?.toLocaleString()}
                                        </p>
                                        <div className='flex items-center justify-start gap-6'>
                                            <p className="text-xs text-gray-500">Qty : {item.quantity}</p>
                                            {item.color && (
                                                <div className="flex items-center text-xs text-gray-500 mt-1">
                                                    Color: <span className="w-5 h-5 rounded-full ml-1" style={{ backgroundColor: item.color }}></span>
                                                </div>
                                            )}
                                            {item.size && <p className="text-xs text-gray-500">Size: {item.size}</p>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Coupon Code Input */}
                    <Card className="p-4 rounded-xl shadow-md bg-white">
                        <label htmlFor="couponCode" className="block text-sm font-medium text-gray-700 mb-2">
                            Do you have a coupon code, input here
                        </label>
                        <input
                            type="text"
                            id="couponCode"
                            placeholder="NEW200"
                            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                    </Card>

                    {/* Discount Points */}
                    <Card className="p-4 rounded-xl shadow-md bg-white">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-700">Discount Points</span>
                            <span className="text-sm text-gray-500">Bal : {order.discountPoints?.toLocaleString()} Points</span>
                        </div>
                        <input
                            type="number"
                            placeholder="200"
                            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                        <p className="text-red-500 text-xs bg-[#ffcccc] p-2 rounded-2xl  mt-2" style={{ border: `1px solid ${brandColor}` }}
                        >Kindly note that 1 point is equivalent to 1nd</p>
                    </Card>

                    {/* Delivery Address */}
                    <Card className="p-4 rounded-xl bg-white">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-3">
                            <h4 className="text-sm font-semibold text-gray-800">Delivery Address</h4>
                            <span className="text-xs text-red-500">Delivery fee/Location</span>
                        </div>

                        {/* Info Box */}
                        <div className="rounded-xl border border-gray-200 p-4 space-y-3">
                            {/* Phone number */}
                            <div>
                                <p className="text-xs text-gray-400">Phone number</p>
                                <p className="text-sm text-gray-800 font-medium">{order.phoneNumber}</p>
                            </div>

                            {/* Address */}
                            <div>
                                <p className="text-xs text-gray-400">Address</p>
                                <p className="text-sm text-gray-800 font-medium">{order.deliveryAddress}</p>
                            </div>
                        </div>
                    </Card>


                    {/* Price Breakdown */}
                    <Card className="p-4 rounded-xl shadow-md bg-white">
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">

                            <div className="">Ord Id</div>
                            <div className="text-right text-gray-800 font-semibold">Ord-{order.id?.slice(0, 7).toLowerCase()}dmw</div>

                            <div className="">Items Cost</div>
                            <div className="text-right text-gray-800 font-semibold">N{order.itemsCost?.toLocaleString()}</div>

                            <div className="font-medium">Coupon Discount</div>
                            <div className="text-right  font-semibold" style={{ color: brandColor }}>-N{order.couponDiscount?.toLocaleString()}</div>

                            <div className="font-medium">Points Discount</div>
                            <div className="text-right  font-semibold" style={{ color: brandColor }}>-N{order.pointsDiscount?.toLocaleString()}</div>

                            <div className="font-medium">Delivery fee</div>
                            <div className="text-right text-gray-800 font-semibold">N{order.deliveryFee?.toLocaleString()}</div>

                            <div className=" text-lg font-bold">Total to pay</div>
                            <div className="text-right text-lg font-bold" style={{ color: brandColor }}>
                                N{order.totalToPay?.toLocaleString()}
                            </div>
                        </div>
                    </Card>

                    {/* Review Buttons */}
                    <div className="flex space-x-4 mt-6">
                        <Button
                            onClick={() => alert('View Product Review')}
                            className="flex-1 py-3 px-6 rounded-xl font-semibold text-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
                        >
                            View Product Review
                        </Button>
                        <Button
                            onClick={() => alert('View Store Review')}
                            className="flex-1 py-3 px-6 rounded-xl font-semibold text-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
                        >
                            View Store Review
                        </Button>
                    </div>
                </div>
                {/* Right Column */}
                < div className="lg:col-span-1 space-y-4" >
                    {/* Tracking ID, Total Items, Payment Method, Total */}
                    < Card className="p-4 rounded-xl shadow-md bg-white" >
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                            <div className="font-medium">Tracking Id</div>
                            <div className="text-right text-gray-800 font-semibold">Ord-{order.id?.slice(0, 7).toLowerCase()}dndkwd</div>

                            <div className="font-medium">Total items</div>
                            <div className="text-right text-gray-800 font-semibold">{order.itemCount}</div>

                            <div className="font-medium">Payment method</div>
                            <div className="text-right text-gray-800 font-semibold">{order.paymentMethod}</div>

                            <div className="font-medium">Total</div>
                            <div className="text-right text-gray-800 font-semibold" style={{ color: brandColor }}>
                                N{order.totalPrice?.toLocaleString()}
                            </div>
                        </div>
                    </Card >
                    {/* Back Button to Tracker */}
                    < div className="mt-8" >
                        <Button
                            onClick={onBackToTracker}
                            className="w-full py-3 px-6 rounded-xl font-semibold text-lg"
                            style={{ backgroundColor: 'white', color: brandColor, border: `1px solid ${brandColor}` }}
                        >
                            Go Back to Tracker
                        </Button>
                    </div >



                </div >

            </div >




        </div >
    );
};

export default FullOrderDetailsPanel;
