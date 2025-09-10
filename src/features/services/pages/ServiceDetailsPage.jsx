import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  StarIcon,
  TrashIcon,
  ChartBarIcon,
  PencilSquareIcon,
  PlayCircleIcon,
  HeartIcon,
  EllipsisHorizontalIcon,
} from '@heroicons/react/24/outline';

import { useStoreProfile } from '../../../services/queries/storeProfileQuery';
import { useService } from '../../../services/queries/useServiceQuery';
import { useDeleteService } from '../../../services/mutations/useServiceMutation';
import { useToast } from '../../../components/ui/ToastProvider';

import Button from '../../../components/ui/Button';
import { getContrastTextColor } from '../../../utils/colorUtils';

const ServiceDetailsPage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { push } = useToast();

  const { userId, isLoggedIn } = useSelector((state) => state.user);
  const { data: storeProfile } = useStoreProfile(userId, {
    enabled: isLoggedIn && !!userId,
  });

  const brandColor = storeProfile?.brandColor || '#EF4444';
  const contrastTextColor = getContrastTextColor(brandColor);
  const brandTextStyle = { color: brandColor };
  const brandBgStyle = { backgroundColor: brandColor, color: contrastTextColor };

  const { data: service, isLoading, error } = useService(serviceId, { enabled: !!serviceId });

  const images = useMemo(() => {
    if (!service) return [];
    const imgs = service.images || service.media?.images || [];
    return Array.isArray(imgs) ? imgs : [];
  }, [service]);

  const [mainImage, setMainImage] = useState(null);

  React.useEffect(() => {
    if (images.length) setMainImage(images[0]);
  }, [images]);

  const deleteMutation = useDeleteService({
    onSuccess: () => {
      push('Service deleted.', { type: 'success' });
      navigate('/my-services');
    },
    onError: (err) => push(err?.message || 'Failed to delete service.', { type: 'error' }),
  });

  const handleDeleteService = () => {
    if (!serviceId) return;
    if (window.confirm('Are you sure you want to delete this service? This cannot be undone.')) {
      deleteMutation.mutate({ serviceId });
    }
  };

  const handleViewStatistics = () => {
    push('Opening statistics...', { type: 'info' });
    // Example: navigate(`/my-services/${serviceId}/stats`);
  };

  const handleEditService = () => {
    navigate(`/my-services/${serviceId}/edit`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 md:p-8 bg-gray-50 min-h-screen">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-80 bg-gray-200 rounded" />
          <div className="h-32 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="container mx-auto p-8 text-center text-red-600">
        {error?.message || 'Service not found.'}
      </div>
    );
  }

  const hasVideo = Boolean(service.media?.videoUrl || service.videoUrl);
  const videoUrl = service.media?.videoUrl || service.videoUrl;

  return (
    <div className="container mx-auto p-4 md:p-8 bg-gray-50 min-h-screen font-inter">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800" style={{ fontFamily: 'Manrope' }}>
          My Service / <span style={brandTextStyle}>Service Details</span>
        </h1>
        <div className="flex space-x-4">
          <HeartIcon className="w-6 h-6 text-gray-600 cursor-pointer hover:text-red-500 transition-colors" />
          <EllipsisHorizontalIcon className="w-6 h-6 text-gray-600 cursor-pointer hover:text-gray-800 transition-colors" />
        </div>
      </div>

      {/* Main content */}
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-8 border border-gray-200">
        {/* Images */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start lg:col-span-1 space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex flex-row lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2 flex-shrink-0">
            {images.length ? (
              images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  className={`w-16 h-16 object-cover rounded-md cursor-pointer transition-all duration-200 ${
                    mainImage === img ? 'border-2 border-blue-500 shadow-md' : 'border-2 border-transparent hover:border-gray-300'
                  }`}
                  onClick={() => setMainImage(img)}
                />
              ))
            ) : (
              <div className="text-xs text-gray-400">No images</div>
            )}
          </div>
          <div className="relative w-full h-80 rounded-2xl overflow-hidden shadow-md flex-grow">
            {mainImage ? (
              <img src={mainImage} alt={service.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">No Image</div>
            )}
            {hasVideo && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <a href={videoUrl} target="_blank" rel="noreferrer" aria-label="Play video">
                  <PlayCircleIcon className="h-20 w-20 text-white cursor-pointer opacity-90 hover:opacity-100 transition-opacity" />
                </a>
              </div>
            )}
            {(service.userName || service.profilePic || service.rating) && (
              <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-3 bg-black/70">
                <div className="flex items-center">
                  {service.profilePic && (
                    <img src={service.profilePic} alt="Profile" className="w-6 h-6 rounded-full mr-2 object-cover" />
                  )}
                  {service.userName && <span className="text-sm font-medium text-white">{service.userName}</span>}
                </div>
                {service.rating && (
                  <div className="flex items-center text-sm text-white">
                    <StarIcon className="h-4 w-4 text-yellow-500 mr-1" />
                    <span>{service.rating}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col lg:col-span-2">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-bold text-gray-900">{service.name}</h2>
            {service.rating && (
              <div className="flex items-center text-lg text-gray-600 flex-shrink-0">
                <StarIcon className="h-5 w-5 text-yellow-500 mr-1" />
                <span className="text-md font-medium">{service.rating}</span>
              </div>
            )}
          </div>

          <div className="flex items-baseline mb-4">
            <span className="text-2xl font-bold" style={brandTextStyle}>
              ₦{Number(service.minPrice || 0).toLocaleString()} - ₦{Number(service.maxPrice || 0).toLocaleString()}
            </span>
          </div>

          <hr className="my-4 border-gray-300" />

          <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
          <p className="text-gray-700 mb-6 leading-relaxed">{service.description || service.fullDescription}</p>

          <hr className="my-4 border-gray-300" />

          {Array.isArray(service.priceBreakdown) && service.priceBreakdown.length > 0 && (
            <>
              <h3 className="text-lg text-gray-800 mb-3">Price Breakdown</h3>
              <div className="space-y-3 mb-8">
                {service.priceBreakdown.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-[#ededed] p-3 rounded-lg border border-gray-200"
                  >
                    <span className="font-medium text-gray-700">{item.type || item.name}</span>
                    <span className="font-semibold text-lg" style={brandTextStyle}>
                      ₦{Number(item.min || item.from || 0).toLocaleString()} - ₦{Number(item.max || item.to || 0).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}

          <hr className="my-4 border-gray-300" />

          <div className="flex justify-between items-center w-full mt-auto pt-6">
            <div className="flex space-x-3">
              <Button
                onClick={handleDeleteService}
                disabled={deleteMutation.isPending}
                className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors shadow-sm disabled:opacity-60"
                aria-label="Delete Service"
              >
                <TrashIcon className="h-6 w-6" />
              </Button>
              <Button
                onClick={handleViewStatistics}
                className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors shadow-sm"
                aria-label="View Statistics"
              >
                <ChartBarIcon className="h-6 w-6" />
              </Button>
            </div>
            <Button
              onClick={handleEditService}
              className="px-6 py-3 rounded-lg font-semibold w-full shadow-md hover:shadow-lg transition-shadow flex items-center justify-center gap-2"
              style={brandBgStyle}
            >
              <PencilSquareIcon className="h-5 w-5" /> Edit Service
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailsPage;