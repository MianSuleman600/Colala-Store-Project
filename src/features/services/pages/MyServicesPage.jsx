// src/features/services/pages/MyServicesPage.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';

import ProductDisplayCard from '../../../components/products/ProductDisplayCard';
import ServiceStatModal from '../../../components/services/ServiceStatModal';

import { getContrastTextColor, getLightBrandColor } from '../../../utils/colorUtils';
import { useStoreProfile } from '../../../services/queries/storeProfileQuery';
import { useToast } from '../../../components/ui/ToastProvider';
import { useServices } from '../../../services/queries/useServiceQuery';

const MyServicesPage = ({
  // Optional theme props (will fall back to store profile if not provided)
  brandColor: brandColorProp,
  contrastTextColor: contrastTextColorProp,
  lightBrandColor: lightBrandColorProp,
  // Controls the grid (sidebar = 1–3 cols, home = 1–5 cols)
  gridVariant = 'home',
}) => {
  const { push } = useToast();
  const { userId, isLoggedIn } = useSelector((state) => state.user || {});

  // Only fetch store profile if we don't already have theme from props
  const {
    data: storeProfile,
    isLoading: isProfileLoading,
    error: profileError,
  } = useStoreProfile(userId, {
    enabled: isLoggedIn && !!userId && !brandColorProp,
  });

  const {
    data: services = [],
    isLoading: isServicesLoading,
    error: servicesError,
  } = useServices({
    enabled: isLoggedIn && !!userId,
  });

  useEffect(() => {
    if (profileError) push('Failed to load store profile for services.', { type: 'error' });
    if (servicesError) push('Failed to load services.', { type: 'error' });
  }, [profileError, servicesError, push]);

  // Theme (prefer props, fall back to store profile)
  const brandColor = useMemo(
    () => brandColorProp || storeProfile?.brandColor || '#EF4444',
    [brandColorProp, storeProfile]
  );
  const contrastTextColor = useMemo(
    () => contrastTextColorProp || getContrastTextColor(brandColor),
    [contrastTextColorProp, brandColor]
  );
  const lightBrandColor = useMemo(
    () => lightBrandColorProp || getLightBrandColor(brandColor, 30),
    [lightBrandColorProp, brandColor]
  );

  // Grid classes (matches MyProductsPage)
  const gridClasses =
    gridVariant === 'sidebar'
      ? 'grid items-stretch grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3'
      : 'grid items-stretch grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5';

  // Stats modal
  const [showServiceStatModal, setShowServiceStatModal] = useState(false);
  const [selectedServiceStats, setSelectedServiceStats] = useState(null);

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
      <div className="flex min-h-[calc(100vh-100px)] flex-col items-center justify-center text-gray-600">
        <p className="mb-4 text-lg">Please log in to view your services.</p>
      </div>
    );
  }

  if (isProfileLoading || isServicesLoading) {
    return <div className="py-12 text-center text-gray-500">Loading services...</div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h2 className="mb-6 text-2xl font-bold text-gray-800">My Services</h2>

      {services.length === 0 ? (
        <div className="rounded-lg bg-white py-12 text-center shadow-md">
          <p className="mb-4 text-lg text-gray-600">You have no services yet.</p>
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
              // Support either prop name depending on your card implementation
              onViewDetailsClick={() => handleViewServiceStats(service.id)}
              onViewStatsClick={() => handleViewServiceStats(service.id)}
            />
          ))}
        </div>
      )}

      {showServiceStatModal && selectedServiceStats && (
        <ServiceStatModal
          isOpen={showServiceStatModal}
          onClose={() => setShowServiceStatModal(false)}
          serviceStats={selectedServiceStats}
          brandColor={brandColor}
          contrastTextColor={contrastTextColor}
          lightBrandColor={lightBrandColor}
        />
      )}
    </div>
  );
};

export default MyServicesPage;