// src/components/orders/OrderTrackingStep.jsx
import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { CheckCircleIcon, ExclamationTriangleIcon, WalletIcon } from '@heroicons/react/24/outline';

/**
 * OrderTrackingStep Component
 * Displays a single step in the order tracking timeline.
 *
 * @param {object} props
 * @param {number} props.stepNumber - The number of this step (e.g., 1, 2, 3, 4, 5).
 * @param {string} props.title - The title of the step (e.g., "Order Placed").
 * @param {object} props.item - The item associated with this step (for image, name, price).
 * @param {string} props.statusDate - The date/time the status was achieved.
 * @param {boolean} props.isActive - True if this step is active or completed (red circle/line).
 * @param {boolean} props.isCurrentStep - True if this is the step where user actions are taken.
 * @param {boolean} [props.isNextActionableStep=false] - True if this step is the next one to be acted upon.
 * @param {function} [props.onMarkAsOutForDelivery] - Callback for "Mark as out for delivery" button.
 * @param {function} [props.onMarkAsDelivered] - Callback for "Mark as delivered" button.
 * @param {function} [props.onRequestCode] - Callback for "Request Code" button.
 * @param {function} [props.onDispute] - Callback for "Dispute" button.
 * @param {function} [props.onViewWallet] - Callback for "View Wallet" button.
 * @param {string} props.brandColor - Primary brand color for styling.
 * @param {string} props.contrastTextColor - Text color for contrast.
 */
const OrderTrackingStep = ({
    stepNumber,
    title,
    item,
    statusDate,
    isActive,
    isCurrentStep,
    isNextActionableStep = false,
    onMarkAsOutForDelivery,
    onMarkAsDelivered,
    onRequestCode,
    onDispute,
    onViewWallet, // Accept onViewWallet prop
    brandColor,
    contrastTextColor,
}) => {
    // DEBUG: Log props for each step
    React.useEffect(() => {
        console.log(`[OrderTrackingStep ${stepNumber}] Title: "${title}", isActive: ${isActive}, isCurrentStep: ${isCurrentStep}, isNextActionableStep: ${isNextActionableStep}`);
    }, [stepNumber, title, isActive, isCurrentStep, isNextActionableStep]);

    return (
        <div className="flex relative">
            {/* Vertical Line and Circle */}
            <div className="flex flex-col items-center mr-4">
                <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${isActive ? '' : 'bg-gray-300 text-white'
                        }`}
                    style={isActive ? { backgroundColor: brandColor, color: contrastTextColor } : {}}
                >
                    {stepNumber}
                </div>

                {stepNumber < 5 && (
                    <div
                        className={`flex-grow w-0.5 mt-1 ${!isActive ? 'bg-gray-300' : ''}`}
                        style={isActive ? { backgroundColor: brandColor } : {}}
                    ></div>
                )}

            </div>

            {/* Step Content Card */}
            <Card className={`flex-grow p-4 rounded-xl shadow-sm mb-6 ${isActive ? 'bg-white' : 'bg-gray-50'}`}>
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                    <span className="text-xs text-gray-500">{statusDate}</span>
                </div>

                <div className="flex items-center mb-4">
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
                    <div>
                        <p className="text-base font-medium text-gray-800">{item.name}</p>
                        <p className="text-sm font-bold mt-1" style={{ color: brandColor }}>
                            N{item.price.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">Qty : {item.quantity}</p>
                    </div>
                </div>

                {/* Conditional Buttons based on step and current status */}

                {/* --- Logic for "Out for Delivery" (Step 2) --- */}
                {title === "Out for Delivery" && (
                    <>
                        {/* "Mark as out for delivery" button (appears when it's the next actionable step) */}
                        {isNextActionableStep && (
                            <Button
                                onClick={onMarkAsOutForDelivery}
                                className="w-full py-2 px-4 rounded-lg text-sm font-medium"
                                style={{ backgroundColor: brandColor, color: contrastTextColor }}
                            >
                                <CheckCircleIcon className="h-4 w-4 mr-2 inline-block" /> Mark as out for delivery
                            </Button>
                        )}

                        {/* "Out for delivery" (completed state, read-only with low opacity) */}
                        {isActive && !isNextActionableStep && (
                            <div className="space-y-2">
                                <div
                                    className="w-full py-2 px-4 rounded-lg text-sm font-medium flex items-center justify-center opacity-70"
                                    style={{ backgroundColor: brandColor, color: contrastTextColor }}
                                >
                                    <CheckCircleIcon className="h-4 w-4 mr-2 inline-block" /> Out for delivery
                                </div>
                                {/* "Mark as Delivered" button (appears ONLY when Out for Delivery is complete AND Delivered is NOT yet current) */}
                                {isCurrentStep && onMarkAsDelivered && (
                                    <Button
                                        onClick={onMarkAsDelivered}
                                        className="w-full py-2 px-4 rounded-lg text-sm font-medium"
                                        style={{ backgroundColor: 'white', color: brandColor, border: `1px solid ${brandColor}` }}
                                    >
                                        Mark as Delivered
                                    </Button>
                                )}
                            </div>
                        )}
                    </>
                )}


                {/* --- Logic for "Delivered" (Step 3) --- */}
                {isCurrentStep && title === "Delivered" && (
                    <>
                        <div className="flex items-center bg-yellow-100 text-yellow-800 p-3 rounded-lg text-sm mb-4">
                            <ExclamationTriangleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                            <span>This order will only be marked as delivered once you enter the buyer's unique code</span>
                        </div>
                        <div className="flex space-x-2">
                            <Button
                                onClick={onRequestCode}
                                className="flex-1 py-2 px-4 rounded-lg text-sm font-medium"
                                style={{ backgroundColor: brandColor, color: contrastTextColor }}
                            >
                                Request Code
                            </Button>
                            <Button
                                onClick={onDispute}
                                className="flex-1 py-2 px-4 rounded-lg text-sm font-medium"
                                style={{ backgroundColor: 'white', color: brandColor, border: `1px solid ${brandColor}` }}
                            >
                                Dispute
                            </Button>
                        </div>
                    </>
                )}

                {/* --- Logic for "Funds Released" (Step 4) --- */}
                {isCurrentStep && title === "Funds Released" && (
                    <Button
                        onClick={onViewWallet} // This now triggers the completion of the order
                        className="w-full py-2 px-4 rounded-lg text-sm font-medium"
                        style={{ backgroundColor: brandColor, color: contrastTextColor }}
                    >
                        <WalletIcon className="h-4 w-4 mr-2 inline-block" /> View Wallet
                    </Button>
                )}

                {/* NEW: Logic for "Order Completed" (Step 5) */}
                {isCurrentStep && title === "Order Completed" && (
                    <div
                        className="w-full py-2 px-4 rounded-lg text-sm font-medium flex items-center justify-center opacity-70"
                        style={{ backgroundColor: brandColor, color: contrastTextColor }}
                    >
                        <CheckCircleIcon className="h-4 w-4 mr-2 inline-block" /> Order Completed
                    </div>
                )}
            </Card>
        </div>
    );
};

export default OrderTrackingStep;
