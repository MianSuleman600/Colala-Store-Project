// src/components/orders/OrderTrackerPanel.jsx
import React, { useState } from 'react';
import Button from '../ui/Button';
import OrderTrackingStep from './OrderTrackingStep';
import CodeInputModal from './CodeInputModal';
import FullOrderDetailsPanel from './FullOrderDetailsPanel';
import { getContrastTextColor } from '../../utils/colorUtils';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

/**
 * OrderTrackerPanel Component
 * Displays the full order tracking timeline for a specific item,
 * and now also manages the display of the Full Order Details.
 *
 * @param {object} props
 * @param {object} props.customerName - The name of the customer for the order.
 * @param {object} props.itemToTrack - The specific item object whose order is being tracked.
 * @param {function} props.onOpenChat - Callback to open chat with the customer.
 * @param {function} props.onBackToOrderDetails - Callback to go back to the main order details.
 * @param {string} props.brandColor - Primary brand color for styling.
 * @param {object} props.fullOrderData - The complete order object to pass to FullOrderDetailsPanel.
 */
const OrderTrackerPanel = ({ customerName, itemToTrack, onOpenChat, onBackToOrderDetails, brandColor, fullOrderData }) => {
    const contrastTextColor = getContrastTextColor(brandColor);

    // Dummy state for tracking progress (1: Order Placed, 2: Out for Delivery, 3: Delivered, 4: Funds Released, 5: Order Completed)
    const [currentTrackingStep, setCurrentTrackingStep] = useState(1);
    const [showCodeInputModal, setShowCodeInputModal] = useState(false);
    const [showFullDetails, setShowFullDetails] = useState(false);

    // DEBUG: Log current tracking step whenever it changes
    React.useEffect(() => {
        console.log(`[OrderTrackerPanel] currentTrackingStep is now: ${currentTrackingStep}`);
    }, [currentTrackingStep]);

    // DEBUG: Log fullOrderData when OrderTrackerPanel renders (initial and re-renders)
    React.useEffect(() => {
        console.log('[OrderTrackerPanel] Render - fullOrderData (received from OrderDetailsPanel):', fullOrderData);
    }, [fullOrderData]); // Dependency array includes fullOrderData to log changes


    const handleMarkAsOutForDelivery = () => {
        alert("Item marked as out for delivery!");
        setCurrentTrackingStep(2);
        console.log("[OrderTrackerPanel] 'Mark as out for delivery' clicked. Setting step to 2.");
    };

    const handleMarkAsDelivered = () => {
        alert("Preparing to mark as delivered. Please request code.");
        setCurrentTrackingStep(3);
        console.log("[OrderTrackerPanel] 'Mark as delivered' clicked. Setting step to 3.");
    };

    const handleRequestCode = () => {
        setShowCodeInputModal(true);
        console.log("[OrderTrackerPanel] 'Request Code' clicked. Opening CodeInputModal.");
    };

    const handleCodeProceed = (code) => {
        console.log(`[OrderTrackerPanel] Code entered: ${code}`);
        if (code === '1234') {
            alert("Code verified! Funds released.");
            setCurrentTrackingStep(4);
            setShowCodeInputModal(false);
            console.log("[OrderTrackerPanel] Code verified. Setting step to 4 (Funds Released).");
        } else {
            alert("Invalid code. Please try again.");
            console.log("[OrderTrackerPanel] Invalid code entered.");
        }
    };

    const handleDispute = () => {
        alert("Dispute initiated!");
    };

    const handleViewWallet = () => {
        alert("Navigating to Wallet and marking order as complete!");
        setCurrentTrackingStep(5);
        console.log("[OrderTrackerPanel] 'View Wallet' clicked. Setting step to 5 (Order Completed).");
    };

    const handleShowFullDetails = () => {
        // DEBUG: Log fullOrderData right before setting showFullDetails to true
        console.log('[OrderTrackerPanel] handleShowFullDetails clicked. Value of fullOrderData:', fullOrderData);
        setShowFullDetails(true);
        console.log("[OrderTrackerPanel] 'Full Details' clicked. Showing FullOrderDetailsPanel.");
    };

    const handleBackToTracker = () => {
        setShowFullDetails(false);
        console.log("[OrderTrackerPanel] 'Go Back to Tracker' clicked. Showing OrderTrackerPanel.");
    };

    // Dummy dates for demonstration
    const getStatusDate = (step) => {
        const date = new Date();
        if (step === 1) date.setHours(date.getHours() - 24);
        if (step === 2) date.setHours(date.getHours() - 12);
        if (step === 3) date.setHours(date.getHours() - 6);
        if (step === 4) date.setHours(date.getHours() - 1);
        return `${date.getDate()}th Aug 2025 - ${date.getHours()}:${date.getMinutes()} AM`;
    };

    return (
        <div className="space-y-6">
            {/* Conditional Back Button and Title */}
            <div className="flex items-center gap-2 lg:hidden mb-4">
               
                <h2 className="text-xl font-bold text-gray-800">
                    {customerName}'s Orders / Order Tracker {showFullDetails && '/ Full Order details'}
                </h2>
            </div>

            {/* Title for larger screens */}
            <h2 className="hidden lg:block text-2xl font-bold text-gray-800">
                {customerName}'s Orders / Order Tracker {showFullDetails && '/ Full Order details'}
            </h2>

            {/* Conditional Rendering: Show FullOrderDetailsPanel or OrderTrackerPanel */}
            {showFullDetails ? (
                // Ensure fullOrderData is valid before rendering FullOrderDetailsPanel
                fullOrderData ? (
                    <FullOrderDetailsPanel
                        order={fullOrderData} // Pass the full order data
                        brandColor={brandColor}
                        contrastTextColor={contrastTextColor}
                        onBackToTracker={handleBackToTracker}
                    />
                ) : (
                    <div className="p-6 bg-white rounded-xl shadow-md flex items-center justify-center h-full text-gray-500">
                        Loading full order details...
                    </div>
                )
            ) : (
                <>
                    {/* Action Buttons (Full Details / Open Chat) */}
                    <div className="flex space-x-4 mb-6">
                        <Button
                            onClick={handleShowFullDetails}
                            className="flex-1 py-2 px-4 rounded-lg text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300"
                        >
                            Full Details
                        </Button>
                        <Button
                            onClick={onOpenChat}
                            className="flex-1 py-2 px-4 rounded-lg text-sm font-medium"
                            style={{ backgroundColor: brandColor, color: contrastTextColor }}
                        >
                            Open Chat
                        </Button>
                    </div>

                    {/* Order Tracking Steps */}
                    <div className="relative">
                        <OrderTrackingStep
                            stepNumber={1}
                            title="Order Placed"
                            item={itemToTrack}
                            statusDate={getStatusDate(1)}
                            isActive={currentTrackingStep >= 1}
                            isCurrentStep={currentTrackingStep === 1}
                            brandColor={brandColor}
                            contrastTextColor={contrastTextColor}
                        />
                        <OrderTrackingStep
                            stepNumber={2}
                            title="Out for Delivery"
                            item={itemToTrack}
                            statusDate={getStatusDate(2)}
                            isActive={currentTrackingStep >= 2 || currentTrackingStep === 1}
                            isCurrentStep={currentTrackingStep === 2}
                            isNextActionableStep={currentTrackingStep === 1}
                            onMarkAsOutForDelivery={handleMarkAsOutForDelivery}
                            onMarkAsDelivered={handleMarkAsDelivered}
                            brandColor={brandColor}
                            contrastTextColor={contrastTextColor}
                        />
                        <OrderTrackingStep
                            stepNumber={3}
                            title="Delivered"
                            item={itemToTrack}
                            statusDate={getStatusDate(3)}
                            isActive={currentTrackingStep >= 3 || currentTrackingStep === 2}
                            isCurrentStep={currentTrackingStep === 3}
                            onRequestCode={handleRequestCode}
                            onDispute={handleDispute}
                            brandColor={brandColor}
                            contrastTextColor={contrastTextColor}
                        />
                        <OrderTrackingStep
                            stepNumber={4}
                            title="Funds Released"
                            item={itemToTrack}
                            statusDate={getStatusDate(4)}
                            isActive={currentTrackingStep >= 4}
                            isCurrentStep={currentTrackingStep === 4}
                            onViewWallet={handleViewWallet}
                            brandColor={brandColor}
                            contrastTextColor={contrastTextColor}
                        />
                        <OrderTrackingStep
                            stepNumber={5}
                            title="Order Completed"
                            item={itemToTrack}
                            statusDate={getStatusDate(5)}
                            isActive={currentTrackingStep >= 5}
                            isCurrentStep={currentTrackingStep === 5}
                            brandColor={brandColor}
                            contrastTextColor={contrastTextColor}
                        />
                    </div>
                </>
            )}

            {/* Code Input Modal */}
            {showCodeInputModal && (
                <CodeInputModal
                    isOpen={showCodeInputModal}
                    onClose={() => setShowCodeInputModal(false)}
                    onProceed={handleCodeProceed}
                    brandColor={brandColor}
                    contrastTextColor={contrastTextColor}
                />
            )}
        </div>
    );
};

export default OrderTrackerPanel;
