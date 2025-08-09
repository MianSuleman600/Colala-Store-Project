// src/pages/OrdersPage.jsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import OrderListItem from '../../../components/order/OrderListItem';
import OrderDetailsPanel from '../../../components/order/OrderDetailsPanel';
import Button from '../../../components/ui/Button';
import { getContrastTextColor } from '../../../utils/colorUtils';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

import { useGetStoreProfileQuery } from '../../../services/storeProfileApi';

import pic1 from '../../../assets/images/productImages/2.jpeg';
import pic2 from '../../../assets/images/productImages/3.jpeg';


/**
 * OrdersPage Component
 * Displays a list of customer orders on the left and detailed view of a selected order on the right.
 * Retrieves userId from URL query parameters.
 * Matches the designs in 'l.png' and 'r.png', now with responsive behavior for small devices.
 */
const OrdersPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Extract userId from URL query parameters
    const queryParams = new URLSearchParams(location.search);
    const userId = queryParams.get('userId') || 'defaultUser';

    // Dummy login status for frontend demonstration (can be linked to actual auth later)
    const isLoggedIn = true;

    // Use a hardcoded `userId` for demonstration since the user-provided code
    // is using a query param, but the hook might need a real ID.
    const mockUserId = 'default_user_id';

    const {
        data: storeProfile,
        isLoading: isProfileLoading,
        error: profileError
    } = useGetStoreProfileQuery(mockUserId, {
        skip: !isLoggedIn || !mockUserId,
    });



    // Use state for brand colors to ensure re-renders
    const [brandColor, setBrandColor] = useState('#EF4444');
    const [contrastTextColor, setContrastTextColor] = useState(getContrastTextColor('#EF4444'));
    
    // Update state when storeProfile data is available
    useEffect(() => {
        if (storeProfile && storeProfile.brandColor) {
            setBrandColor(storeProfile.brandColor);
            console.log(brandColor)
            setContrastTextColor(getContrastTextColor(storeProfile.brandColor));
        }
    }, [storeProfile]);

    // Dummy order data - ENHANCED with more details for FullOrderDetailsPanel
    const [orders, setOrders] = useState([
        {
            id: 'order1',
            customerName: 'Adewale Fiazah',
            itemCount: 2,
            totalPrice: 9999990,
            status: 'New', // 'New' or 'Completed'
            paymentMethod: 'Shopping Wallet',
            discountPoints: 500,
            phoneNumber: '0703123456789',
            deliveryAddress: 'No 7, abcd street, Ikeja, Lagos',
            itemsCost: 3000000,
            couponDiscount: 5000,
            pointsDiscount: 10000,
            deliveryFee: 10000,
            totalToPay: 2995000,
            items: [
                { id: 'item1-1', imageUrl: pic1, name: 'Iphone 16 pro max - Black', price: 2500000, quantity: 1, color: 'black', size: null },
                { id: 'item1-2', imageUrl: pic2, name: 'AirPods Pro 3', price: 500000, quantity: 1, color: null, size: null },
            ],
        },
        {
            id: 'order2',
            customerName: 'Adam Shawn',
            itemCount: 2,
            totalPrice: 9999990,
            status: 'New',
            paymentMethod: 'Bank Transfer',
            discountPoints: 200,
            phoneNumber: '08012345678',
            deliveryAddress: 'Flat 4, xyz avenue, Abuja, FCT',
            itemsCost: 2500000,
            couponDiscount: 0,
            pointsDiscount: 5000,
            deliveryFee: 15000,
            totalToPay: 2510000,
            items: [
                { id: 'item2-1', imageUrl: pic2, name: 'MacBook Air M3', price: 1800000, quantity: 1, color: 'spacegray', size: '13-inch' },
                { id: 'item2-2', imageUrl: pic1, name: 'Dell UltraSharp Monitor', price: 700000, quantity: 1, color: null, size: '27-inch' },
            ],
        },
        {
            id: 'order3',
            customerName: 'Chris Ade',
            itemCount: 2,
            totalPrice: 9999990,
            status: 'New',
            paymentMethod: 'Card',
            discountPoints: 100,
            phoneNumber: '09098765432',
            deliveryAddress: 'House 10, abc road, Port Harcourt, Rivers',
            itemsCost: 1800000,
            couponDiscount: 10000,
            pointsDiscount: 2000,
            deliveryFee: 8000,
            totalToPay: 1796000,
            items: [
                { id: 'item3-1', imageUrl: 'https://placehold.co/80x80/cccccc/000000?text=Camera', name: 'Sony Alpha A7 III', price: 1200000, quantity: 1, color: 'black', size: null },
                { id: 'item3-2', imageUrl: 'https://placehold.co/80x80/cccccc/000000?text=Lens', name: 'Sigma 24-70mm Lens', price: 600000, quantity: 1, color: null, size: null },
            ],
        },
        {
            id: 'order4',
            customerName: 'Sasha Sloan',
            itemCount: 2,
            totalPrice: 9999990,
            status: 'Completed',
            paymentMethod: 'Shopping Wallet',
            discountPoints: 0,
            phoneNumber: '07011223344',
            deliveryAddress: 'Block 5, def street, Enugu, Enugu',
            itemsCost: 3400000,
            couponDiscount: 0,
            pointsDiscount: 0,
            deliveryFee: 12000,
            totalToPay: 3412000,
            items: [
                { id: 'item4-1', imageUrl: 'https://placehold.co/80x80/cccccc/000000?text=TV', name: 'LG OLED TV', price: 3000000, quantity: 1, color: 'black', size: '65-inch' },
                { id: 'item4-2', imageUrl: 'https://placehold.co/80x80/cccccc/000000?text=Soundbar', name: 'Bose Soundbar', price: 400000, quantity: 1, color: 'black', size: null },
            ],
        },
        {
            id: 'order5',
            customerName: 'Ben Dibs',
            itemCount: 2,
            totalPrice: 9999990,
            status: 'New',
            paymentMethod: 'Card',
            discountPoints: 300,
            phoneNumber: '08155667788',
            deliveryAddress: 'Suite 2, ghi road, Kaduna, Kaduna',
            itemsCost: 1100000,
            couponDiscount: 2000,
            pointsDiscount: 3000,
            deliveryFee: 9000,
            totalToPay: 1094000,
            items: [
                { id: 'item5-1', imageUrl: 'https://placehold.co/80x80/cccccc/000000?text=Drone', name: 'DJI Mavic Air 3', price: 900000, quantity: 1, color: 'white', size: null },
                { id: 'item5-2', imageUrl: 'https://placehold.co/80x80/cccccc/000000?text=Gimbal', name: 'DJI Ronin SC', price: 200000, quantity: 1, color: 'black', size: null },
            ],
        },
    ]);

    const [activeOrderTab, setActiveOrderTab] = useState('New');
    const [selectedOrderId, setSelectedOrderId] = useState(orders[0]?.id || null);

    const [showOrderList, setShowOrderList] = useState(true);
    const [showOrderDetails, setShowOrderDetails] = useState(false);

    useEffect(() => {
        const filtered = orders.filter(order => order.status === activeOrderTab);
        if (selectedOrderId && !filtered.some(order => order.id === selectedOrderId)) {
            setSelectedOrderId(filtered[0]?.id || null);
        } else if (!selectedOrderId && filtered.length > 0) {
            setSelectedOrderId(filtered[0].id);
        }
    }, [activeOrderTab, orders, selectedOrderId]);

    const handleOrderListItemClick = (orderId) => {
        setSelectedOrderId(orderId);
        setShowOrderList(false);
        setShowOrderDetails(true);
    };

    const handleBackToList = () => {
        setShowOrderDetails(false);
        setShowOrderList(true);
        setSelectedOrderId(null);
    };

    const filteredOrders = orders.filter(order => order.status === activeOrderTab);

    const selectedOrder = orders.find(order => order.id === selectedOrderId);

    if (!isLoggedIn) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] text-gray-600">
                <p className="text-lg mb-4">Please log in to view your orders.</p>
                <Button
                    onClick={() => navigate('/login')}
                    style={{ backgroundColor: brandColor, color: contrastTextColor }}
                    className="py-2 px-6 rounded-lg font-semibold"
                >
                    Login Now
                </Button>
            </div>
        );
    }
    
    // Add a loading state
    if (isProfileLoading) {
      return <div className="text-center py-8">Loading store profile...</div>;
    }

    return (
        <div className="container mx-auto p-4 md:p-8">
            {/* Header with brand color */}
           
               
                {/* Back button for mobile on the header */}
                {showOrderDetails && (
                    <button
                        onClick={handleBackToList}
                        className="lg:hidden flex items-center space-x-2 p-2 rounded-full"
                        style={{ color: contrastTextColor, backgroundColor: 'rgba(0,0,0,0.1)' }}
                    >
                        <ArrowLeftIcon className="h-5 w-5" />
                        <span className="text-sm font-medium hidden sm:inline">Back</span>
                    </button>
                )}
            

            <div className="grid grid-cols-1 lg:grid-cols-[30%_70%] lg:gap-8">
                {/* Left Column: Order List and Tabs - Visible on small screens if showOrderDetails is false, always on large screens */}
                <div className={`lg:col-span-1 space-y-4 ${showOrderDetails ? 'hidden lg:block' : ''}`}>
                    {/* Main Tabs (New/Completed) - Now inside the left column */}
                    <div className="flex space-x-4 mb-6">
                        <button
                            onClick={() => setActiveOrderTab('New')}
                            className={`py-2 px-6 rounded-lg font-semibold transition-colors duration-200 flex-1 ${activeOrderTab === 'New' ? '' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                            style={activeOrderTab === 'New' ? { backgroundColor: brandColor, color: contrastTextColor } : {}}
                        >
                            New
                        </button>
                        <button
                            onClick={() => setActiveOrderTab('Completed')}
                            className={`py-2 px-6 rounded-lg font-semibold transition-colors duration-200 flex-1 ${activeOrderTab === 'Completed' ? '' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                            style={activeOrderTab === 'Completed' ? { backgroundColor: brandColor, color: contrastTextColor } : {}}
                        >
                            Completed
                        </button>
                    </div>

                    {filteredOrders.length === 0 ? (
                        <div className="p-6 bg-white rounded-xl shadow-md text-center text-gray-500">
                            No {activeOrderTab.toLowerCase()} orders found.
                        </div>
                    ) : (
                        filteredOrders.map(order => (
                            <OrderListItem
                                key={order.id}
                                order={order}
                                isActive={order.id === selectedOrderId}
                                onClick={handleOrderListItemClick}
                                brandColor={brandColor}
                            />
                        ))
                    )}
                </div>

                {/* Right Column: Order Details Panel - Visible on small screens if showOrderDetails is true, always on large screens */}
                <div className={`lg:col-span-1 ${showOrderList ? 'hidden lg:block' : ''}`}>
                    <OrderDetailsPanel
                        customerOrder={selectedOrder}
                        brandColor={brandColor}
                        onBackToList={handleBackToList}
                        fullOrderData={selectedOrder}
                    />
                </div>
            </div>
        </div>
    );
};

export default OrdersPage;
