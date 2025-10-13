// src/components/services/ServiceStatModal.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import { useServiceStats } from '../../services/queries/useServiceQuery';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import serviceImage from '../../assets/images/productImages/1.png';

const ServiceStatModal = ({ isOpen, onClose, serviceId, brandColor, contrastTextColor }) => {
  const navigate = useNavigate();

  // This hook now returns a comprehensive object with all data needed.
  const { data: serviceData, isLoading, isError } = useServiceStats(serviceId, {
    enabled: isOpen && !!serviceId,
  });

  if (!isOpen) return null;

  const handleEditService = () => navigate(`/my-services/${serviceId}/edit`);
  const handleViewService = () => navigate(`/my-services/${serviceId}/details`);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Service Stats & Details" className="max-w-lg max-h-[90vh] rounded-2xl">
      <div className="p-3 flex flex-col overflow-y-auto max-h-[calc(90vh-60px)]">
        {isLoading && <div className="p-10 text-center text-gray-500">Loading stats...</div>}
        {isError && <div className="p-10 text-center text-red-500">Could not load service statistics.</div>}
        
        {serviceData && !isLoading && (
          <>
            <div className="flex items-center space-x-3 bg-white p-3 rounded-lg">
              <img src={serviceData.imageUrl || serviceImage} alt={serviceData.name} className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
              <div className="flex flex-col">
                <h3 className="text-base font-semibold text-gray-900">{serviceData.name}</h3>
                <span className="text-sm font-bold" style={{ color: brandColor }}>
                  ₦{(serviceData.minPrice || 0).toLocaleString()} - ₦{(serviceData.maxPrice || 0).toLocaleString()}
                </span>
                <span className="text-xs text-gray-500 mt-1">{serviceData.dateCreated}</span>
              </div>
            </div>

            <div className="flex space-x-2 mt-3">
              <Button onClick={handleEditService} className="flex-1 py-2 text-sm rounded-xl text-white font-semibold flex items-center justify-center" style={{ backgroundColor: brandColor }}><PencilSquareIcon className="h-4 w-4 mr-1" /> Edit Service</Button>
              <Button onClick={handleViewService} className="flex-1 py-2 text-sm rounded-xl bg-black text-white font-semibold">View Service</Button>
            </div>

            <div className="bg-white rounded-xl p-1 border border-gray-200 w-full h-[220px] mt-3">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={serviceData.chartData || []} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
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

            <div className="rounded-lg border border-gray-200 mt-3">
              <div className="text-white text-center py-2 font-semibold text-base rounded-t-lg" style={{ backgroundColor: brandColor, color: contrastTextColor }}>Service Statistics</div>
              <div className="bg-white text-sm">
                <div className="flex justify-between border-b border-gray-200 px-3 py-2"><span>Date Created</span><span className="font-medium">{serviceData.dateCreated || 'N/A'}</span></div>
                <div className="flex justify-between border-b border-gray-200 px-3 py-2"><span>Impressions</span><span className="font-medium">{serviceData.totals?.impression || 0}</span></div>
                <div className="flex justify-between border-b border-gray-200 px-3 py-2"><span>Views</span><span className="font-medium">{serviceData.totals?.view || 0}</span></div>
                <div className="flex justify-between border-b border-gray-200 px-3 py-2"><span>Phone Views</span><span className="font-medium">{serviceData.totals?.phone_view || 0}</span></div>
                <div className="flex justify-between px-3 py-2"><span>Chats</span><span className="font-medium">{serviceData.totals?.chat || 0}</span></div>
              </div>
            </div>
            {/* You would add a mutation handler here for marking unavailable */}
            <Button className="w-full py-2 text-sm rounded-xl font-semibold border border-black text-black bg-white mt-3">Mark as Unavailable</Button>
          </>
        )}
      </div>
    </Modal>
  );
};

export default ServiceStatModal;