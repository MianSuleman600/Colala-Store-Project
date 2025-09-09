import React, { useState, useEffect, useMemo } from 'react';
import Button from '../ui/Button';
import OrderTrackingStep from './OrderTrackingStep';
import CodeInputModal from './CodeInputModal';
import FullOrderDetailsPanel from './FullOrderDetailsPanel';
import { getContrastTextColor } from '../../utils/colorUtils';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useToast } from '../ui/ToastProvider';

const OrderTrackerPanel = ({
  customerName,
  itemToTrack,
  onOpenChat,
  onBackToOrderDetails,
  brandColor,
  fullOrderData,
}) => {
  const { push } = useToast();
  const contrastTextColor = useMemo(() => getContrastTextColor(brandColor), [brandColor]);

  const [currentTrackingStep, setCurrentTrackingStep] = useState(1);
  const [showCodeInputModal, setShowCodeInputModal] = useState(false);
  const [showFullDetails, setShowFullDetails] = useState(false);

  useEffect(() => {
    return () => setShowCodeInputModal(false);
  }, [itemToTrack]);

  const handleMarkAsOutForDelivery = () => {
    push('Item marked as out for delivery.', { type: 'success' });
    setCurrentTrackingStep(2);
  };

  const handleMarkAsDelivered = () => {
    push('Preparing to mark as delivered. Please request code.', { type: 'info' });
    setCurrentTrackingStep(3);
  };

  const handleRequestCode = () => setShowCodeInputModal(true);

  const handleCodeProceed = (code) => {
    if (code === '1234') {
      push('Code verified! Funds will be released.', { type: 'success' });
      setCurrentTrackingStep(4);
      setShowCodeInputModal(false);
    } else {
      push('Invalid code. Please try again.', { type: 'error' });
    }
  };

  const handleDispute = () => push('Dispute initiated.', { type: 'info' });

  const handleViewWallet = () => {
    push('Navigating to Wallet and completing order.', { type: 'success' });
    setCurrentTrackingStep(5);
  };

  const handleShowFullDetails = () => setShowFullDetails(true);
  const handleBackToTracker = () => setShowFullDetails(false);

  const getStatusDate = (step) => {
    const date = new Date();
    if (step === 1) date.setHours(date.getHours() - 24);
    if (step === 2) date.setHours(date.getHours() - 12);
    if (step === 3) date.setHours(date.getHours() - 6);
    if (step === 4) date.setHours(date.getHours() - 1);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} - ${date
      .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      .toUpperCase()}`;
  };

  return (
    <div className="space-y-6">
      {/* Mobile header (OrderDetailsPanel hides its mobile header when tracker is shown) */}
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

      {/* Desktop header */}
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
          {/* Action Buttons */}
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

          {/* Tracking Steps */}
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