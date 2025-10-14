import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { ASSETS_BASE } from '../../api/apiConfig';
import { useUpdateServiceStatus } from '../../services/mutations/useServicesMutation';
import { useToast } from '../ui/ToastProvider';

const ServiceStatModal = ({ isOpen, onClose, service, brandColor, contrastTextColor }) => {
  const navigate = useNavigate();
  const { push } = useToast();

  const updateStatusMutation = useUpdateServiceStatus({
    onSuccess: () => {
        push('Service status updated.', { type: 'success' });
        onClose(); // Close modal on success
    },
    onError: (err) => push(err.message || 'Failed to update status.', { type: 'error' }),
  });

  if (!isOpen || !service) return null;

  const handleEditService = () => {
    onClose(); // Close the modal before navigating
    navigate(`/my-services/${service.id}/edit`, { state: { service } });
  };

  // ✅ FIX: This now navigates to the correct private service details page.
  // It also passes the full service object in the state to prevent re-fetching.
  const handleViewService = () => {
    onClose();
    navigate(`/my-services/${service.id}/details`, { state: { service } });
  };
  
  const handleMarkUnavailable = () => {
    updateStatusMutation.mutate({ serviceId: service.id, status: 'unavailable' });
  };
  
  const firstImage = service.media?.find(m => m.type === 'image')?.path;
  const imageUrl = firstImage ? `${ASSETS_BASE}/storage/${firstImage}` : 'https://placehold.co/64x64/e0e0e0/000000?text=No+Image';
  const name = service.name || 'Untitled Service';
  const minPrice = service.price_from || 0;
  const maxPrice = service.price_to || 0;
  const dateCreated = new Date(service.created_at).toLocaleDateString();

  // Dummy chart data - replace with real data if your API provides it
  const chartData = [
    { date: 'Mon', impressions: service.impressions || 0, visitors: service.views || 0, chats: service.chats || 0 },
    { date: 'Tue', impressions: (service.impressions || 0) + 10, visitors: (service.views || 0) + 5, chats: (service.chats || 0) + 1 },
    { date: 'Wed', impressions: (service.impressions || 0) + 5, visitors: (service.views || 0) + 2, chats: (service.chats || 0) + 2 },
    // ... more data points can be added here
  ];

  const totals = {
    impression: service.impressions || 0,
    view: service.views || 0,
    phone_view: service.phone_views || 0,
    chat: service.chats || 0,
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Service Stats & Details" className="max-w-lg w-full">
      <div className="p-3 flex flex-col">
        <div className="flex items-center space-x-3 bg-white p-3 rounded-lg">
          <img src={imageUrl} alt={name} className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
          <div className="flex flex-col">
            <h3 className="text-base font-semibold text-gray-900">{name}</h3>
            <span className="text-sm font-bold" style={{ color: brandColor }}>
              ₦{Number(minPrice).toLocaleString()} - ₦{Number(maxPrice).toLocaleString()}
            </span>
            <span className="text-xs text-gray-500 mt-1">{dateCreated}</span>
          </div>
        </div>

        <div className="flex space-x-2 mt-3">
          <Button onClick={handleEditService} className="flex-1 py-2 text-sm rounded-xl text-white font-semibold flex items-center justify-center" style={{ backgroundColor: brandColor }}> Edit Service</Button>
          <Button onClick={handleViewService} className="flex-1 py-2 text-sm rounded-xl bg-black text-white font-semibold">View Service</Button>
        </div>

        <div className="bg-white rounded-xl p-1 border border-gray-200 w-full h-[220px] mt-3">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
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
          <div className="bg-white text-sm rounded-b-lg">
            <div className="flex justify-between border-b border-gray-200 px-3 py-2"><span>Date Created</span><span className="font-medium">{dateCreated || 'N/A'}</span></div>
            <div className="flex justify-between border-b border-gray-200 px-3 py-2"><span>Impressions</span><span className="font-medium">{totals.impression}</span></div>
            <div className="flex justify-between border-b border-gray-200 px-3 py-2"><span>Views</span><span className="font-medium">{totals.view}</span></div>
            <div className="flex justify-between border-b border-gray-200 px-3 py-2"><span>Phone Views</span><span className="font-medium">{totals.phone_view}</span></div>
            <div className="flex justify-between px-3 py-2"><span>Chats</span><span className="font-medium">{totals.chat}</span></div>
          </div>
        </div>
        
        <Button onClick={handleMarkUnavailable} disabled={updateStatusMutation.isPending} className="w-full py-2 text-sm rounded-xl font-semibold border border-black text-black bg-white mt-3">
          {updateStatusMutation.isPending ? 'Updating...' : 'Mark as Unavailable'}
        </Button>
      </div>
    </Modal>
  );
};

export default ServiceStatModal;