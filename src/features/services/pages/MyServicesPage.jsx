import React, { useState, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ProductDisplayCard from '../../../components/products/ProductDisplayCard';
import ServiceStatModal from '../../../components/services/ServiceStatModal';
import Button from '../../../components/ui/Button';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useToast } from '../../../components/ui/ToastProvider';
import { useServices } from '../../../services/queries/useServiceQuery';
import { getContrastTextColor } from '../../../utils/colorUtils';
import { useDeleteService, useUpdateServiceStatus } from '../../../services/mutations/useServicesMutation';

const MyServicesPage = ({ gridVariant = 'home' }) => {
  const { push } = useToast();
  const navigate = useNavigate();
  
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const userId = user?.id;

  const { data: services = [], isLoading: isServicesLoading, error: servicesError } = useServices(userId, { enabled: isAuthenticated && !!userId });

  useEffect(() => {
    if (servicesError) push('Failed to load your services.', { type: 'error' });
  }, [servicesError, push]);

  const brandColor = useMemo(() => user?.store?.theme_color || '#EF4444', [user]);
  const contrastTextColor = useMemo(() => getContrastTextColor(brandColor), [brandColor]);
  
  const gridClasses = gridVariant === 'sidebar'
      ? 'grid items-stretch grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3'
      : 'grid items-stretch grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5';

  const [showServiceStatModal, setShowServiceStatModal] = useState(false);
  const [selectedServiceForStats, setSelectedServiceForStats] = useState(null);

  const deleteMutation = useDeleteService({ 
    onSuccess: () => push('Service deleted.', { type: 'success' }),
    onError: (err) => push(err.message || 'Failed to delete service.', { type: 'error' }),
  });

  const updateStatusMutation = useUpdateServiceStatus({
    onSuccess: () => push('Service status updated.', { type: 'success' }),
    onError: (err) => push(err.message || 'Failed to update status.', { type: 'error' }),
  });

  // ✅ FIX: This function now opens the stats modal, as requested.
  const handleViewServiceStats = (service) => {
    setSelectedServiceForStats(service);
    setShowServiceStatModal(true);
  };

  const handleEditService = (normalizedService) => {
    const rawServiceData = normalizedService.originalItem;
    if (!rawServiceData) {
      push("Cannot edit service: data is missing.", { type: 'error' });
      return;
    }
    navigate(`/my-services/${rawServiceData.id}/edit`, { state: { service: rawServiceData } });
  };

  const handleDeleteService = (serviceId) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      deleteMutation.mutate({ serviceId });
    }
  };

  const handleMarkStatus = (serviceId, status) => {
    updateStatusMutation.mutate({ serviceId, status });
  };

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[calc(100vh-100px)] flex-col items-center justify-center text-gray-600">
        <p className="mb-4 text-lg">Please log in to view your services.</p>
      </div>
    );
  }

  if (isServicesLoading) {
    return <div className="py-12 text-center text-gray-500">Loading services...</div>;
  }

  return (
    <>
      <div className="mb-6 flex w-full justify-end">
        <Button
            onClick={() => navigate('/add-service')}
            style={{ backgroundColor: brandColor, color: contrastTextColor }}
            className="flex w-full items-center rounded-lg py-2 px-6 font-semibold shadow-md transition-shadow hover:shadow-lg sm:w-auto"
        >
            <PlusIcon className="mr-2 h-5 w-5" /> Add New Service
        </Button>
      </div>

      {services.length === 0 ? (
        <div className="rounded-lg bg-white py-12 text-center shadow-md">
          <p className="mb-4 text-lg text-gray-600">You have no services yet. Click "Add New Service" to get started!</p>
        </div>
      ) : (
        <div className={gridClasses}>
          {services.map((service) => (
            <ProductDisplayCard
              key={service.id}
              item={service}
              mode="service"
              brandColor={brandColor}
              contrastTextColor={contrastTextColor}
              // ✅ FIX: The card's "Edit" button should now be handled by a "More Options" menu
              // For simplicity, we can pass a dummy onEdit here for now, or build out a MoreOptionsPopover for services.
              // The main action is onViewStatsClick.
              onEdit={() => handleEditService({ originalItem: service })} // Placeholder for a more complex menu
              onViewStatsClick={() => handleViewServiceStats(service)}
            />
          ))}
        </div>
      )}
      
      {showServiceStatModal && selectedServiceForStats && (
        <ServiceStatModal
          isOpen={showServiceStatModal}
          onClose={() => setShowServiceStatModal(false)}
          service={selectedServiceForStats}
          brandColor={brandColor}
          contrastTextColor={contrastTextColor}
        />
      )}
    </>
  );
};

export default MyServicesPage;