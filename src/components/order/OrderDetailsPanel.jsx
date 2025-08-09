// src/components/orders/OrderDetailsPanel.jsx
import React, { useState, useEffect } from 'react'; // Import useEffect
import Card from '../ui/Card';
import Button from '../ui/Button';
import OrderItemCard from './OrderItemCard';
import OrderTrackerPanel from './OrderTrackerPanel'; // Import the new tracker panel
import { getContrastTextColor } from '../../utils/colorUtils';
import { ArrowLeftIcon } from '@heroicons/react/24/outline'; // For the back button icon

/**
 * OrderDetailsPanel Component
 * Displays the detailed view of a selected customer's order, including status tabs and items.
 * Now supports switching to an Order Tracker view for individual items.
 * Matches the design in 'r.png', '3.png', '4.png', '5.png'.
 *
 * @param {object} props
 * @param {object} props.customerOrder - The detailed order object for the selected customer.
 * @param {string} props.customerOrder.customerName - Name of the customer.
 * @param {object[]} props.customerOrder.items - Array of items in the order.
 * @param {string} props.brandColor - Primary brand color for styling.
 * @param {function} props.onBackToList - Callback to navigate back to the order list (for mobile).
 * @param {object} props.fullOrderData - The complete order object to pass to FullOrderDetailsPanel. <--- ADDED THIS PROP
 */
const OrderDetailsPanel = ({ customerOrder, brandColor, onBackToList, fullOrderData }) => { // <--- ADDED fullOrderData HERE
    const [activeStatusTab, setActiveStatusTab] = useState('Order placed'); // Default active tab
    const [showTracker, setShowTracker] = useState(false); // <--- NEW STATE: Controls whether to show tracker
    const [itemToTrack, setItemToTrack] = useState(null); // <--- NEW STATE: Holds the item for tracking

    const contrastTextColor = getContrastTextColor(brandColor);

    // DEBUG: Log customerOrder and fullOrderData when OrderDetailsPanel renders
    useEffect(() => { // Using useEffect for initial render and prop changes
        console.log('[OrderDetailsPanel] Render - customerOrder:', customerOrder);
        console.log('[OrderDetailsPanel] Render - fullOrderData (received from OrdersPage):', fullOrderData);
    }, [customerOrder, fullOrderData]);


    if (!customerOrder) {
        return (
            <div className="p-6 bg-white rounded-xl shadow-md flex items-center justify-center h-full text-gray-500">
                Select an order to view details.
            </div>
        );
    }

    // This function is called when "Track Order" button is clicked in OrderItemCard
    const handleTrackOrder = (item) => { // <--- MODIFIED: Receives the full item object
        console.log(`[OrderDetailsPanel] Tracking order for item: ${item.id}`);
        setItemToTrack(item);     // Set the item to be tracked
        setShowTracker(true);     // Show the tracker panel
    };

    const handleOpenChat = () => {
        console.log(`[OrderDetailsPanel] Opening chat with ${customerOrder.customerName}`);
        alert(`Opening chat with ${customerOrder.customerName}`);
    };

    // This function is called when "Full Details" button in OrderTrackerPanel is clicked
    const handleBackToOrderDetails = () => {
        setShowTracker(false); // Hide the tracker panel
        setItemToTrack(null);  // Clear the tracked item
        console.log("[OrderDetailsPanel] Back to order details (from tracker)."); // DEBUG
    };

    return (
        <div className="space-y-6">
            {/* Back Button for Mobile */}
            {/* This button's behavior changes based on whether the tracker is open */}
            <div className="flex items-center gap-2 lg:hidden mb-4">
                <button
                    onClick={showTracker ? handleBackToOrderDetails : onBackToList} // <--- CONDITIONAL BACK BEHAVIOR
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
                    aria-label="Back"
                >
                    <ArrowLeftIcon className="h-5 w-5" />
                </button>
               
            </div>

          


            {/* Conditional Rendering: Show Tracker or Items List */}
            {showTracker && itemToTrack ? ( // <--- CONDITIONAL RENDERING LOGIC
                <OrderTrackerPanel
                    customerName={customerOrder.customerName}
                    itemToTrack={itemToTrack}
                    onOpenChat={handleOpenChat}
                    onBackToOrderDetails={handleBackToOrderDetails} // Pass the handler to go back
                    brandColor={brandColor}
                    fullOrderData={fullOrderData} // <--- NOW PASSING THE PROP HERE!
                />
            ) : (
                <>
                    {/* Status Tabs (only visible when not in tracker view) */}
                    <div className="flex space-x-2 sm:space-x-4 overflow-x-auto pb-2 no-scrollbar">
                        {['Order placed', 'Out for delivery', 'Delivered', 'Completed'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveStatusTab(tab)}
                                className={`py-2 px-4 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors duration-200 flex-shrink-0
                                    ${activeStatusTab === tab
                                        ? 'shadow-md'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                style={activeStatusTab === tab ? { backgroundColor: brandColor, color: contrastTextColor } : {}}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Items in Cart Section */}
                    {/* Corrected the h3 styling to remove redundant background and padding, inherited from Card */}
                    <Card className="p-4 rounded-xl shadow-md" style={{ backgroundColor: brandColor }}>
                        <h3 className="text-lg  text-white mb-4 p-4  rounded-2xl" style={{backgroundColor:brandColor}}>Items in cart</h3>
                        <div className="space-y-4">
                            {customerOrder.items.map(item => (
                                <OrderItemCard
                                    key={item.id}
                                    item={item}
                                    onTrackOrder={handleTrackOrder}
                                    brandColor={brandColor}
                                    contrastTextColor={contrastTextColor}
                                />
                            ))}
                        </div>
                    </Card>

                    {/* Open Chat Button */}
                    <Button
                        onClick={handleOpenChat}
                        className="w-full py-3 px-6 rounded-xl font-semibold text-lg"
                        style={{ backgroundColor: 'white', color: brandColor, border: `1px solid ${brandColor}` }}
                    >
                        Open Chat
                    </Button>
                </>
            )}
        </div>
    );
};

export default OrderDetailsPanel;
