import React from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import serviceImage from '../../assets/images/productImages/1.png';

const ServiceStatModal = ({
  isOpen,
  onClose,
  serviceStats,
  brandColor,
  contrastTextColor,
}) => {
  const navigate = useNavigate();

  if (!isOpen || !serviceStats) return null;

  const maxImpression = Math.max(...serviceStats.chartData.map(d => d.impressions), 1);
  const maxVisitor = Math.max(...serviceStats.chartData.map(d => d.visitors), 1);
  const maxChat = Math.max(...serviceStats.chartData.map(d => d.chats), 1);
  const chartHeightPx = 120;

  const chartData = serviceStats.chartData || [];

  const handleEditService = () => {
    navigate('/add-service');
    onClose();
  };

  const handleViewService = () => {
    navigate(`/my-services/${serviceStats.id}/details`);
    onClose();
  };

  const handleMarkAsUnavailable = () => {
    if (window.confirm(`Are you sure you want to mark "${serviceStats.serviceName}" as Unavailable?`)) {
      alert('Service marked as Unavailable!');
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Service details"
      className="max-w-sm max-h-[90vh]"
    >
      <div className="p-3 flex flex-col space-y-4 overflow-y-auto max-h-[calc(90vh-60px)] over pb-2">
        
        {/* Service Info */}
        <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
          <img
            src={serviceStats.imageUrl || serviceImage}
            alt={serviceStats.serviceName}
            className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
          />
          <div className="flex flex-col">
            <h3 className="text-base  text-gray-900">{serviceStats.serviceName}</h3>
            <span className="text-sm font-bold" style={{ color: brandColor }}>
              ₦{serviceStats.minPrice.toLocaleString()} - ₦{serviceStats.maxPrice.toLocaleString()}
            </span>
            <span className="text-xs text-gray-500 mt-1">{serviceStats.dateCreated}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex space-x-2">
          <Button
            onClick={handleEditService}
            className="flex-1 py-2 text-sm rounded-xl shadow-sm flex items-center justify-center"
            style={{ backgroundColor: brandColor, color: contrastTextColor }}
          >
            <PencilSquareIcon className="h-3 w-3 mr-1" /> Edit Service
          </Button>
          <Button
            onClick={handleViewService}
            className="flex-1 py-2 text-sm rounded-xl font-semibold shadow-sm flex items-center justify-center bg-gray-800 text-white hover:bg-black"
          >
            View Details
          </Button>
        </div>

        {/* Chart */}
        <div className="bg-white p-1 rounded-lg border border-gray-200 relative">
          <div className="absolute left-2 top-10 bottom-10 flex flex-col justify-between text-[10px] text-gray-500">
            <span>100</span>
            <span>50</span>
            <span>0</span>
          </div>

          <div className="flex justify-between items-center mb-3 ml-8">
            <div className="flex space-x-2 text-xs font-medium">
              <span className="flex items-center text-red-500">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span> Impressions
              </span>
              <span className="flex items-center text-green-500">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span> Visitors
              </span>
              <span className="flex items-center text-orange-500">
                <span className="w-2 h-2 bg-orange-500 rounded-full mr-1"></span> Chats
              </span>
            </div>
          </div>

          <div className="w-full h-[120px] bg-white rounded-md flex items-end justify-around p-1 border-b border-l border-gray-300 ml-4 relative">
            <div className="absolute inset-0 flex flex-col justify-between pb-2 pt-2">
              <hr className="border-t border-gray-200 w-full" />
              <hr className="border-t border-gray-200 w-full" />
              <hr className="border-t border-gray-200 w-full" />
            </div>

            {chartData.map((data, index) => (
              <div key={index} className="flex flex-col items-center h-full justify-end w-1/6 px-0.5 z-10">
                <div className="flex items-end h-full w-full justify-center">
                  <div
                    className="w-1/3 bg-red-500 rounded-t-sm mx-0.5"
                    style={{ height: `${(data.impressions / maxImpression) * chartHeightPx}px`, maxHeight: '100%' }}
                  ></div>
                  <div
                    className="w-1/3 bg-green-500 rounded-t-sm mx-0.5"
                    style={{ height: `${(data.visitors / maxVisitor) * chartHeightPx}px`, maxHeight: '100%' }}
                  ></div>
                  <div
                    className="w-1/3 bg-orange-500 rounded-t-sm mx-0.5"
                    style={{ height: `${(data.chats / maxChat) * chartHeightPx}px`, maxHeight: '100%' }}
                  ></div>
                </div>
                <span className="text-[10px] text-gray-500 mt-1">{data.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-lg p-3 border border-gray-200 text-sm">
          <h3
            className="text-base mb-3 rounded-md text-center"
            style={{ backgroundColor: brandColor, color: contrastTextColor, padding: '6px 12px' }}
          >
            Service Statistics
          </h3>
          <div className="space-y-2 text-gray-700">
            <div className="flex justify-between"><span>Order ID</span><span>{serviceStats.orderId}</span></div>
            <div className="flex justify-between"><span>Date Created</span><span>{serviceStats.dateCreated}</span></div>
            <div className="flex justify-between"><span>Views</span><span>{serviceStats.views}</span></div>
            <div className="flex justify-between font-medium"><span>Phone Views</span><span>{serviceStats.phoneViews}</span></div>
            <div className="flex justify-between font-medium"><span>Chats</span><span>{serviceStats.chats}</span></div>
          </div>
        </div>

        {/* Mark Unavailable */}
        <Button
          onClick={handleMarkAsUnavailable}
          className="w-full py-2 text-sm rounded-xl font-semibold shadow-sm hover:shadow-md transition-shadow bg-gray-200 text-gray-700 hover:bg-gray-300"
        >
          Mark as Unavailable
        </Button>
      </div>
    </Modal>
  );
};

export default ServiceStatModal;
