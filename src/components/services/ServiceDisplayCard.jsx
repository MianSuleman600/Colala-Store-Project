import React from 'react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { StarIcon } from '@heroicons/react/24/outline';

const ServiceDisplayCard = ({ service, brandColor, onViewStatsClick }) => {
  const serviceViews = service?.serviceViews || 200;
  const productClicks = service?.productClicks || 15;
  const messages = service?.messages || 3;

  return (
    <Card className="relative flex flex-col p-0 rounded-2xl shadow-lg w-full max-w-sm mx-auto overflow-hidden">
      <div className="relative w-full h-48 overflow-hidden">
        {service?.imageUrl ? (
          <img
            src={service.imageUrl}
            alt={service.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = 'https://placehold.co/300x192/e0e0e0/000000?text=No+Image';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">No Image Available</div>
        )}

        {(service?.userName || service?.profilePic || service?.rating) && (
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-3 bg-white bg-opacity-80 backdrop-blur-sm">
            <div className="flex items-center">
              {service?.profilePic && <img src={service.profilePic} alt="Profile" className="w-6 h-6 rounded-full mr-2 object-cover" />}
              {service?.userName && <span className="text-sm font-medium text-gray-800">{service.userName}</span>}
            </div>
            {service?.rating && (
              <div className="flex items-center text-sm text-gray-600">
                <StarIcon className="h-4 w-4 text-yellow-500 mr-1 fill-yellow-500" />
                <span>{service.rating}</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col items-start">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">{service?.name}</h3>

        <div className="flex items-baseline mb-3">
          <span className="text-xl font-bold" style={{ color: brandColor }}>
            ₦{service?.minPrice?.toLocaleString()} - ₦{service?.maxPrice?.toLocaleString()}
          </span>
        </div>

        <hr className="my-2 border-gray-300 w-full" />

        <div className="flex gap-2 flex-col mb-4 text-sm text-gray-700 w-full">
          <div className="flex justify-between items-center">
            <span>Service Views</span>
            <span className="font-semibold">{serviceViews}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Product Clicks</span>
            <span className="font-semibold">{productClicks}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Messages</span>
            <span className="font-semibold">{messages}</span>
          </div>
        </div>

        <Button
          onClick={() => onViewStatsClick(service.id)}
          className="w-full py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition-shadow"
          style={{ backgroundColor: brandColor, color: 'white' }}
        >
          Details
        </Button>
      </div>
    </Card>
  );
};

export default ServiceDisplayCard;