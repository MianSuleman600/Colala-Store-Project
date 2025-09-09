import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { CheckCircleIcon, ExclamationTriangleIcon, WalletIcon } from '@heroicons/react/24/outline';

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
  onViewWallet,
  brandColor,
  contrastTextColor,
}) => {
  const handleImageError = (e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = 'https://placehold.co/64x64/e0e0e0/000000?text=No+Image';
  };

  return (
    <div className="flex relative">
      <div className="flex flex-col items-center mr-4">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
            isActive ? '' : 'bg-gray-300 text-white'
          }`}
          style={isActive ? { backgroundColor: brandColor, color: contrastTextColor } : {}}
        >
          {stepNumber}
        </div>
        {stepNumber < 5 && (
          <div
            className={`flex-grow w-0.5 mt-1 ${!isActive ? 'bg-gray-300' : ''}`}
            style={isActive ? { backgroundColor: brandColor } : {}}
          />
        )}
      </div>

      <Card className={`flex-grow p-4 rounded-xl shadow-sm mb-6 ${isActive ? 'bg-white' : 'bg-gray-50'}`}>
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <span className="text-xs text-gray-500">{statusDate}</span>
        </div>

        <div className="flex items-center mb-4">
          <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center mr-3">
            {item?.imageUrl ? (
              <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" onError={handleImageError} />
            ) : (
              <span className="text-gray-400 text-center text-xs">No Image</span>
            )}
          </div>
          <div>
            <p className="text-base font-medium text-gray-800">{item?.name}</p>
            <p className="text-sm font-bold mt-1" style={{ color: brandColor }}>
              N{item?.price?.toLocaleString?.() || '0'}
            </p>
            <p className="text-xs text-gray-500">Qty: {item?.quantity ?? 0}</p>
          </div>
        </div>

        {title === 'Out for Delivery' && (
          <>
            {isNextActionableStep && (
              <Button
                onClick={onMarkAsOutForDelivery}
                className="w-full py-2 px-4 rounded-lg text-sm font-medium"
                style={{ backgroundColor: brandColor, color: contrastTextColor }}
              >
                <CheckCircleIcon className="h-4 w-4 mr-2 inline-block" /> Mark as out for delivery
              </Button>
            )}

            {isActive && !isNextActionableStep && (
              <div className="space-y-2">
                <div
                  className="w-full py-2 px-4 rounded-lg text-sm font-medium flex items-center justify-center opacity-70"
                  style={{ backgroundColor: brandColor, color: contrastTextColor }}
                >
                  <CheckCircleIcon className="h-4 w-4 mr-2 inline-block" /> Out for delivery
                </div>
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

        {isCurrentStep && title === 'Delivered' && (
          <>
            <div className="flex items-center bg-yellow-100 text-yellow-800 p-3 rounded-lg text-sm mb-4">
              <ExclamationTriangleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
              <span>Enter buyer's code to mark as delivered</span>
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

        {isCurrentStep && title === 'Funds Released' && (
          <Button
            onClick={onViewWallet}
            className="w-full py-2 px-4 rounded-lg text-sm font-medium"
            style={{ backgroundColor: brandColor, color: contrastTextColor }}
          >
            <WalletIcon className="h-4 w-4 mr-2 inline-block" /> View Wallet
          </Button>
        )}

        {isCurrentStep && title === 'Order Completed' && (
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