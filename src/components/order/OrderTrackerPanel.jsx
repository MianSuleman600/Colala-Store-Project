import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ ADD: Import useNavigate
import Button from '../ui/Button';
import OrderTrackingStep from './OrderTrackingStep';
import CodeInputModal from './CodeInputModal';
import FullOrderDetailsPanel from './FullOrderDetailsPanel';
import { getContrastTextColor } from '../../utils/colorUtils';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useToast } from '../ui/ToastProvider';
import { useMarkOrderOutForDeliveryMutation, useMarkOrderDeliveredMutation } from '../../services/mutations/useOrderMutation';

const OrderTrackerPanel = ({
  customerName,
  itemToTrack,
  onOpenChat,
  onBackToOrderDetails,
  brandColor,
  fullOrderData,
  userId,
}) => {
  const { push } = useToast();
  const navigate = useNavigate(); // ✅ ADD: Initialize navigate
  const contrastTextColor = useMemo(() => getContrastTextColor(brandColor), [brandColor]);

  const getInitialStep = (status) => {
    const s = String(status || '').toLowerCase();
    if (s.includes('completed')) return 5;
    if (s.includes('funds_released')) return 4;
    if (s.includes('delivered')) return 3;
    if (s.includes('out_for_delivery')) return 2;
    return 1;
  };

  const [currentTrackingStep, setCurrentTrackingStep] = useState(() => getInitialStep(fullOrderData?.status));
  const [showCodeInputModal, setShowCodeInputModal] = useState(false);
  const [showFullDetails, setShowFullDetails] = useState(false);

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
      setCurrentTrackingStep(3);
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
    if (fullOrderData?.id && !isMarkingOut) {
      markOutForDelivery(fullOrderData.id);
    }
  };
  
  const handleRequestCode = () => {
    setShowCodeInputModal(true);
  };
  
  const handleCodeProceed = (code) => {
    if (fullOrderData?.id && code.trim() && !isMarkingDelivered) {
      markDelivered({ orderId: fullOrderData.id, payload: { code } });
    }
  };

  // ✅ FIX: Implement the dispute navigation functionality.
  const handleDispute = () => {
    if (fullOrderData?.id) {
      navigate(`/dispute/${fullOrderData.id}`);
    } else {
      push('Cannot file dispute. Order ID is missing.', { type: 'error' });
    }
  };
  
  const handleViewWallet = () => push('Wallet functionality not yet implemented.', { type: 'info' });
  const handleShowFullDetails = () => setShowFullDetails(true);
  const handleBackToTracker = () => setShowFullDetails(false);

  const getStatusDate = () => {
    return fullOrderData?.updated_at ? new Date(fullOrderData.updated_at).toLocaleString() : 'Just now';
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
          {customerName} / Order Tracker {showFullDetails && ' / Full Details'}
        </h2>
      </div>
      <h2 className="hidden lg:block text-2xl font-bold text-gray-800">
        {customerName} / Order Tracker {showFullDetails && ' / Full Details'}
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
              brandColor={brandColor}
              contrastTextColor={contrastTextColor}
            />
            <OrderTrackingStep
              stepNumber={2}
              title="Out for Delivery"
              item={itemToTrack}
              statusDate={getStatusDate()}
              isActive={currentTrackingStep >= 2}
              showMarkAsOutForDeliveryButton={currentTrackingStep === 1}
              onMarkAsOutForDelivery={handleMarkAsOutForDelivery}
              isLoading={isMarkingOut}
              brandColor={brandColor}
              contrastTextColor={contrastTextColor}
            />
            <OrderTrackingStep
              stepNumber={3}
              title="Delivered"
              item={itemToTrack}
              statusDate={getStatusDate()}
              isActive={currentTrackingStep >= 3}
              showRequestCodeButton={currentTrackingStep === 2}
              onRequestCode={handleRequestCode}
              onDispute={handleDispute} // This now correctly points to the navigate function
              brandColor={brandColor}
              contrastTextColor={contrastTextColor}
            />
            <OrderTrackingStep
              stepNumber={4}
              title="Funds Released"
              item={itemToTrack}
              statusDate={getStatusDate()}
              isActive={currentTrackingStep >= 4}
              showViewWalletButton={currentTrackingStep === 3}
              onViewWallet={handleViewWallet}
              brandColor={brandColor}
              contrastTextColor={contrastTextColor}
            />
            <OrderTrackingStep
              stepNumber={5}
              title="Order Completed"
              item={itemToTrack}
              statusDate={getStatusDate()}
              isActive={currentTrackingStep >= 5}
              brandColor={brandColor}
              contrastTextColor={contrastTextColor}
            />
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