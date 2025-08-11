import React from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import serviceImage from '../../assets/images/productImages/1.png';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const ServiceStatModal = ({
  isOpen,
  onClose,
  serviceStats,
  brandColor, // Accept brandColor prop
  contrastTextColor, // Accept contrastTextColor prop
}) => {
  const navigate = useNavigate();

  if (!isOpen || !serviceStats) return null;

  const chartData = serviceStats.chartData || [];
  
  // This is the debugging line to check the chart data.
  // It will log the array to your browser's console.
  console.log("Chart Data received:", chartData);

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
      className="max-w-lg max-h-[90vh] rounded-2xl"
    >
      <div className="p-3 flex flex-col  overflow-y-auto max-h-[calc(90vh-60px)]">

        {/* Service Info - Visual Match */}
        <div className="flex items-center space-x-3 bg-white p-3 rounded-lg">
          <img
            src={serviceStats.imageUrl || serviceImage}
            alt={serviceStats.serviceName}
            className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
          />
          <div className="flex flex-col">
            <h3 className="text-base font-semibold text-gray-900">{serviceStats.serviceName}</h3>
            <span className="text-sm font-bold text-red-500">
              ₦{serviceStats.minPrice.toLocaleString()} - ₦{serviceStats.maxPrice.toLocaleString()}
            </span>
            <span className="text-xs text-gray-500 mt-1">{serviceStats.dateCreated}</span>
          </div>
        </div>

        {/* Action Buttons - Visual Match */}
        <div className="flex space-x-2">
          <Button
            onClick={handleEditService}
            className="flex-1 py-2 text-sm rounded-xl bg-red-500 text-white font-semibold flex items-center justify-center"
            style={{ backgroundColor: brandColor }} // Apply brandColor
          >
            <PencilSquareIcon className="h-4 w-4 mr-1" /> Edit Service
          </Button>
          <Button
            onClick={handleViewService}
            className="flex-1 py-2 text-sm rounded-xl bg-black text-white font-semibold"
          >
            View Service
          </Button>
        </div>

        {/* Chart - Optimized for Visibility */}
        <div className="bg-white rounded-xl p-1 border border-gray-200 w-full h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: '10px' }} />
              <Bar dataKey="impressions" fill={brandColor} radius={[3, 3, 0, 0]} name="Impressions" />
              <Bar dataKey="visitors" fill="#00B050" radius={[3, 3, 0, 0]} name="Visitors" />
              <Bar dataKey="chats" fill="#FF0000" radius={[3, 3, 0, 0]} name="Chats" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Stats Table - Visual Match */}
        <div className="rounded-lg border border-gray-200">
          <div
            className="text-white text-center py-2 font-semibold text-base rounded-t-lg"
            style={{ backgroundColor: brandColor, color: contrastTextColor }} // Apply brandColor and contrastTextColor
          >
            Service Statistics
          </div>
          <div className="bg-white text-sm">
            <div className="flex justify-between border-b border-gray-200 px-3 py-2">
              <span>Order ID</span>
              <span className="font-medium">{serviceStats.orderId}</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 px-3 py-2">
              <span>Date Created</span>
              <span className="font-medium">{serviceStats.dateCreated}</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 px-3 py-2">
              <span>Views</span>
              <span className="font-medium">{serviceStats.views}</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 px-3 py-2">
              <span>Phone Views</span>
              <span className="font-medium">{serviceStats.phoneViews}</span>
            </div>
            <div className="flex justify-between px-3 py-2">
              <span>Chats</span>
              <span className="font-medium">{serviceStats.chats}</span>
            </div>
          </div>
        </div>

        {/* Mark Unavailable Button - Visual Match */}
        <Button
          onClick={handleMarkAsUnavailable}
          className="w-full py-2 text-sm rounded-xl font-semibold border border-black text-black bg-white"
        >
          Mark as Unavailable
        </Button>
      </div>
    </Modal>
  );
};

export default ServiceStatModal;