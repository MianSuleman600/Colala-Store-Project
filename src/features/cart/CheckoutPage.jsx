// src/pages/CheckoutPage.jsx
import React from "react";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { getContrastTextColor } from '../../utils/colorUtils';

import { useGetStoreProfileQuery } from '../../services/storeProfileApi';

// ----- Selectors (defined outside to avoid re-creation) -----
const selectCartItems = (state) => state.cart.items;

const selectTotalCost = createSelector([selectCartItems], (items) => {
    if (!Array.isArray(items)) {
        return 0;
    }
    return items.reduce((total, item) => {
        const price = parseFloat(item.currentPrice);
        const quantity = parseFloat(item.quantity);

        if (!isNaN(price) && !isNaN(quantity)) {
            return total + price * quantity;
        }
        return total;
    }, 0);
});

export default function CheckoutPage() {
    const navigate = useNavigate();
    const cartItems = useSelector(selectCartItems);
    const totalCost = useSelector(selectTotalCost);

    const userId = 'default_user_id';
    const { data: storeProfile, error, isLoading } = useGetStoreProfileQuery(userId);

    if (isLoading) {
        return <div className="p-8 text-center text-gray-600">Loading...</div>;
    }

    if (error) {
        return <div className="p-8 text-center text-red-600">Error: {error.message}</div>;
    }

    const brandColor = storeProfile?.brandColor || '#EF4444';
    const contrastTextColor = getContrastTextColor(brandColor);

    // Form handling logic would go here
    const handlePlaceOrder = (e) => {
        e.preventDefault();
        // 1. Validate form data
        // 2. Process payment (e.g., call a payment gateway API)
        // 3. Clear cart
        // 4. Navigate to an order confirmation page
        console.log("Placing order...");
        // navigate("/order-confirmation");
    };

    // Corrected formatPrice function to handle Naira and large integers
    const formatPrice = (price) => {
        if (typeof price !== 'number' || isNaN(price)) {
            return "₦0";
        }
        const formattedPrice = price.toLocaleString("en-NG", {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        });
        return formattedPrice;
    };

    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center mb-6">
                    {/* Dynamic color applied to the "Back to shopping" link */}
                    <Link to="/" className="hover:text-gray-800 transition" style={{ color: brandColor }}>
                        <ArrowLeftIcon className="h-5 w-5 inline-block mr-2" />
                        Back to shopping
                    </Link>
                </div>

                <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Checkout</h2>

                {cartItems.length === 0 ? (
                    <div className="text-center text-gray-500">
                        <p className="text-xl mb-4">Your cart is empty.</p>
                        {/* Dynamic color applied to the "Start shopping" link */}
                        <Link to="/" className="hover:underline" style={{ color: brandColor }}>
                            Start shopping
                        </Link>
                    </div>
                ) : (
                    <div className="lg:grid lg:grid-cols-3 lg:gap-8">
                        {/* Order Summary */}
                        <div className="lg:col-span-1 bg-gray-50 p-6 rounded-lg shadow-md mb-6 lg:mb-0">
                            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                            <div className="space-y-4">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-12 h-12 object-cover rounded"
                                            />
                                            <div>
                                                <h3 className="font-medium text-gray-800">{item.name}</h3>
                                                <p className="text-sm text-gray-500">{item.quantity} × {formatPrice(item.currentPrice)}</p>
                                            </div>
                                        </div>
                                        <span className="font-bold text-gray-800">
                                            {formatPrice(item.currentPrice * item.quantity)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t mt-4 pt-4">
                                <div className="flex justify-between items-center text-xl font-bold">
                                    <span>Total:</span>
                                    {/* Dynamic color applied to the total cost */}
                                    <span style={{ color: brandColor }}>{formatPrice(totalCost)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Checkout Form */}
                        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
                            <form onSubmit={handlePlaceOrder}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                                        <input type="text" id="firstName" name="firstName" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                                    </div>
                                    <div>
                                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                                        <input type="text" id="lastName" name="lastName" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                    <input type="email" id="email" name="email" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                                </div>
                                <div className="mt-4">
                                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                                    <input type="text" id="address" name="address" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                    <div>
                                        <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                                        <input type="text" id="city" name="city" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                                    </div>
                                    <div>
                                        <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
                                        <input type="text" id="state" name="state" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                                    </div>
                                    <div>
                                        <label htmlFor="zip" className="block text-sm font-medium text-gray-700">ZIP</label>
                                        <input type="text" id="zip" name="zip" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                                    </div>
                                </div>

                                <h2 className="text-xl font-semibold mt-8 mb-4">Payment Information</h2>
                                {/* Placeholder for payment fields */}
                                <div className="bg-gray-100 p-4 rounded-md text-gray-500">
                                    <p>Payment form integration (e.g., Stripe, PayPal) would go here.</p>
                                </div>

                                <div className="mt-6">
                                    {/* Dynamic colors applied to the "Place Order" button */}
                                    <button
                                        type="submit"
                                        className="w-full py-3 px-4 font-semibold rounded-md transition"
                                        style={{ backgroundColor: brandColor, color: contrastTextColor }}
                                    >
                                        Place Order
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
