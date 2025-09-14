import React, { useState, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import ProductDisplayCard from '../../../components/products/ProductDisplayCard';
import ServiceStatModal from '../../../components/services/ServiceStatModal';
import { getContrastTextColor } from '../../../utils/colorUtils';
import { useStoreProfile } from '../../../services/queries/storeProfileQuery';
import { useToast } from '../../../components/ui/ToastProvider';
import { useServices } from '../../../services/queries/useServiceQuery';

const MyServicesPage = ({gridVariant = 'home'}) => {
  const { push } = useToast();
  const { userId, isLoggedIn } = useSelector((state) => state.user);

  const { data: storeProfile, isLoading: isProfileLoading, error: profileError } = useStoreProfile(userId, {
    enabled: isLoggedIn && !!userId,
  });

  const { data: services = [], isLoading: isServicesLoading, error: servicesError } = useServices({
    enabled: isLoggedIn && !!userId,
  });

  useEffect(() => {
    if (profileError) push('Failed to load store profile for services.', { type: 'error' });
    if (servicesError) push('Failed to load services.', { type: 'error' });
  }, [profileError, servicesError, push]);

  const brandColor = useMemo(() => storeProfile?.brandColor || '#EF4444', [storeProfile]);
  const contrastTextColor = useMemo(() => getContrastTextColor(brandColor), [brandColor]);

  const [activeTab] = useState('services');
  const [showServiceStatModal, setShowServiceStatModal] = useState(false);
  const [selectedServiceStats, setSelectedServiceStats] = useState(null);

   const gridClasses =
    gridVariant === 'sidebar'
      ? 'grid items-stretch grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3'
      : 'grid items-stretch grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5';

  const handleViewServiceStats = (serviceId) => {
    const service = services.find((s) => s.id === serviceId);
    if (service) {
      setSelectedServiceStats(service);
      setShowServiceStatModal(true);
    } else {
      push('Service not found.', { type: 'error' });
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-gray-50 p-4">
        <h2 className="mb-4 text-2xl font-bold text-gray-800">Access Denied</h2>
        <p className="mb-6 text-gray-700">Please log in to view your services.</p>
      </div>
    );
  }

  if (isProfileLoading || isServicesLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-gray-50 p-4">
        <p className="text-lg text-gray-700">Loading your store profile and services...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto min-h-screen rounded-2xl bg-gray-50 p-4 md:p-8">
      {activeTab === 'services' && (
        services.length === 0 ? (
          <div className="text-center py-16 text-gray-600">You have no services yet.</div>
        ) : (
          <div  className={gridClasses}>
            {services.map((service) => (
              <ProductDisplayCard
                key={service.id}
                item={service}
                brandColor={brandColor}
                contrastTextColor={contrastTextColor}
                mode="service"
                onViewStatsClick={handleViewServiceStats}
              />
            ))}
          </div>
        )
      )}

      {showServiceStatModal && selectedServiceStats && (
        <ServiceStatModal
          isOpen={showServiceStatModal}
          onClose={() => setShowServiceStatModal(false)}
          serviceStats={selectedServiceStats}
          brandColor={brandColor}
          contrastTextColor={contrastTextColor}
        />
      )}
    </div>
  );
};

export default MyServicesPage;