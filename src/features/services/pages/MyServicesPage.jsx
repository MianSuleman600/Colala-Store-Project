// src/features/services/pages/MyServicesPage.jsx

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


const MyServicesPage = ({ gridVariant = 'home' }) => {
  const { push } = useToast();
  const navigate = useNavigate();
  
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const userId = user?.id;

  const {
    data: services = [],
    isLoading: isServicesLoading,
    error: servicesError,
  } = useServices(userId, {
    enabled: isAuthenticated && !!userId,
  });

  useEffect(() => {
    if (servicesError) push('Failed to load your services.', { type: 'error' });
  }, [servicesError, push]);

  const brandColor = useMemo(() => user?.store?.theme_color || '#EF4444', [user]);
  const contrastTextColor = useMemo(() => getContrastTextColor(brandColor), [brandColor]);
  
  const gridClasses = gridVariant === 'sidebar'
      ? 'grid items-stretch grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3'
      : 'grid items-stretch grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5';

  const [showServiceStatModal, setShowServiceStatModal] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState(null);

  const handleViewServiceStats = (serviceId) => {
    setSelectedServiceId(serviceId);
    setShowServiceStatModal(true);
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
              onEdit={() => navigate(`/my-services/${service.id}/edit`)}
              onViewDetailsClick={() => navigate(`/my-services/${service.id}/details`)}
              onMoreOptionsClick={(e) => { /* Logic for a MoreOptionsPopover for services would go here */ }}
            />
          ))}
        </div>
      )}
      
      {showServiceStatModal && selectedServiceId && (
        <ServiceStatModal
          isOpen={showServiceStatModal}
          onClose={() => setShowServiceStatModal(false)}
          serviceId={selectedServiceId}
          brandColor={brandColor}
          contrastTextColor={contrastTextColor}
        />
      )}
    </>
  );
};

export default MyServicesPage;