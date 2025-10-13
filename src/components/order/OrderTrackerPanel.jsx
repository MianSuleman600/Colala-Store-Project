import React, { useState, useEffect, useMemo } from 'react';
import Button from '../ui/Button';
import OrderTrackingStep from './OrderTrackingStep';
import CodeInputModal from './CodeInputModal';
import FullOrderDetailsPanel from './FullOrderDetailsPanel';
import { getContrastTextColor } from '../../utils/colorUtils';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useToast } from '../ui/ToastProvider';
// ✅ THE FIX: Import and use the mutation hooks.
import { useMarkOrderOutForDeliveryMutation, useMarkOrderDeliveredMutation } from '../../services/mutations/useOrderMutation';

const OrderTrackerPanel = ({
  customerName,
  itemToTrack,
  onOpenChat,
  onBackToOrderDetails,
  brandColor,
  fullOrderData,
  userId, // Receive userId as a prop
}) => {
  const { push } = useToast();
  const contrastTextColor = useMemo(() => getContrastTextColor(brandColor), [brandColor]);

  const getInitialStep = (status) => {
    const s = (status || '').toLowerCase();
    if (s.includes('delivered')) return 3;
    if (s.includes('out_for_delivery')) return 2;
    return 1; // Default is 'Order placed'
  };

  const [currentTrackingStep, setCurrentTrackingStep] = useState(() => getInitialStep(fullOrderData?.status));
  const [showCodeInputModal, setShowCodeInputModal] = useState(false);
  const [showFullDetails, setShowFullDetails] = useState(false);

  // ✅ THE FIX: Initialize the mutation hooks, passing the userId for query invalidation.
  const { mutate: markOutForDelivery, isLoading: isMarkingOut } = useMarkOrderOutForDeliveryMutation({
    userId,
    onSuccess: () => {
      push('Order marked as Out for Delivery.', { type: 'success' });
      setCurrentTrackingStep(2);
    },
    onError: (err) => {
      push(err.data?.message || 'Failed to update status.', { type: 'error' });
    },
  });

  const { mutate: markDelivered, isLoading: isMarkingDelivered } = useMarkOrderDeliveredMutation({
    userId,
    onSuccess: () => {
      push('Code verified! Order marked as Delivered.', { type: 'success' });
      setCurrentTrackingStep(3); // Move UI to "Delivered" state
      setShowCodeInputModal(false);
    },
    onError: (err) => {
      push(err.data?.message || 'Invalid code or failed to update status.', { type: 'error' });
    },
  });
  
  useEffect(() => {
    setCurrentTrackingStep(getInitialStep(fullOrderData?.status));
  }, [fullOrderData?.status]);

  const handleMarkAsOutForDelivery = () => {
    // ✅ THE FIX: Call the mutation with the correct store order ID.
    if (fullOrderData?.id && !isMarkingOut) {
      markOutForDelivery(fullOrderData.id);
    }
  };

  const handleMarkAsDelivered = () => {
    // This button is now purely for display/UI flow if needed, but the main action is requesting the code.
    setShowCodeInputModal(true);
  };
  
  const handleCodeProceed = (code) => {
    // ✅ THE FIX: Call the mutation with the order ID and the code payload.
    if (fullOrderData?.id && code.trim() && !isMarkingDelivered) {
      markDelivered({ orderId: fullOrderData.id, payload: { code } });
    }
  };

  const handleDispute = () => push('Dispute functionality not yet implemented.', { type: 'info' });
  const handleViewWallet = () => push('Wallet functionality not yet implemented.', { type: 'info' });
  const handleShowFullDetails = () => setShowFullDetails(true);
  const handleBackToTracker = () => setShowFullDetails(false);

  const getStatusDate = () => {
    // Use the real date from the API, with a fallback.
    return fullOrderData?.updatedAt ? new Date(fullOrderData.updatedAt).toLocaleString() : 'Just now';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 lg:hidden mb-2">
        <button
          onClick={showFullDetails ? handleBackToTracker : onBackToOrderDetails}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
          aria-label="Back"
          type="button"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </button>
        <h2 className="text-lg font-semibold text-gray-800">
          {customerName} • Order Tracker {showFullDetails && ' / Full Details'}
        </h2>
      </div>

      <h2 className="hidden lg:block text-2xl font-bold text-gray-800">
        {customerName} • Order Tracker {showFullDetails && ' / Full Details'}
      </h2>

      {showFullDetails ? (
        fullOrderData ? (
          <FullOrderDetailsPanel
            order={fullOrderData}
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

          <div className="relative">
            <OrderTrackingStep
              stepNumber={1}
              title="Order Placed"
              item={itemToTrack}
              statusDate={getStatusDate()}
              isActive={currentTrackingStep >= 1}
              isCurrentStep={currentTrackingStep === 1}
              isNextActionableStep={currentTrackingStep === 1}
              onMarkAsOutForDelivery={handleMarkAsOutForDelivery}
              isLoading={isMarkingOut}
              brandColor={brandColor}
              contrastTextColor={contrastTextColor}
            />
            <OrderTrackingStep
              stepNumber={2}
              title="Out for Delivery"
              item={itemToTrack}
              statusDate={getStatusDate()}
              isActive={currentTrackingStep >= 2}
              isCurrentStep={currentTrackingStep === 2}
              isNextActionableStep={false} // Action is now on the "Delivered" step
              onMarkAsDelivered={handleMarkAsDelivered}
              brandColor={brandColor}
              contrastTextColor={contrastTextColor}
            />
            <OrderTrackingStep
              stepNumber={3}
              title="Delivered"
              item={itemToTrack}
              statusDate={getStatusDate()}
              isActive={currentTrackingStep >= 3}
              isCurrentStep={currentTrackingStep === 3}
              isNextActionableStep={currentTrackingStep === 2}
              onRequestCode={handleMarkAsDelivered} // This button opens the code modal
              onDispute={handleDispute}
              brandColor={brandColor}
              contrastTextColor={contrastTextColor}
            />
            {/* The backend handles the final steps automatically after delivery confirmation */}
          </div>
        </>
      )}

      {showCodeInputModal && (
        <CodeInputModal
          isOpen={showCodeInputModal}
          onClose={() => setShowCodeInputModal(false)}
          onProceed={handleCodeProceed}
          isLoading={isMarkingDelivered}
          brandColor={brandColor}
          contrastTextColor={contrastTextColor}
        />
      )}
    </div>
  );
};

export default OrderTrackerPanel;