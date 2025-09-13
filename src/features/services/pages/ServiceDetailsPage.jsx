import React, { useMemo, useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  StarIcon,
  TrashIcon,
  ChartBarIcon,
  PencilSquareIcon,
  HeartIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

import { useStoreProfile } from '../../../services/queries/storeProfileQuery';
import { useService } from '../../../services/queries/useServiceQuery';
import { useDeleteService } from '../../../services/mutations/useServicesMutation';
import { useToast } from '../../../components/ui/ToastProvider';

import Button from '../../../components/ui/Button';
import { getContrastTextColor } from '../../../utils/colorUtils';
import BackButton from '../../../components/ui/BackButton';

// Reuse product components/hooks/utils
import ProductMediaGallery from '../../products/pages/ProductMediaGallery';
import ProductMoreMenu from '../../products/pages/ProductMoreMenu';
import { useMediaGallery } from '../../../hooks/Products/useMediaGallery';
import { useLike } from '../../../hooks/Products/useLike';
import { copyText } from '../../../utils/clipboard';

import ServiceStatModal from '../../../components/services/ServiceStatModal';

const ServiceDetailsPage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { push } = useToast();

  const { userId, isLoggedIn } = useSelector((state) => state.user);
  const { data: storeProfile } = useStoreProfile(userId, { enabled: isLoggedIn && !!userId });

  const brandColor = storeProfile?.brandColor || '#EF4444';
  const contrastTextColor = getContrastTextColor(brandColor);
  const brandTextStyle = { color: brandColor };
  const brandBgStyle = { backgroundColor: brandColor, color: contrastTextColor };

  const { data: service, isLoading, error } = useService(serviceId, { enabled: !!serviceId });

  // Normalize URLs
  const normalizeUrl = (x) => {
    if (!x) return '';
    if (typeof x === 'string') return x;
    if (typeof x === 'object') return x.url || x.src || x.fileUrl || x.path || '';
    return '';
  };

  // Build gallery input
  const imageUrls = useMemo(() => {
    const raw = service?.images || service?.media?.images || [];
    const arr = Array.isArray(raw) ? raw.map(normalizeUrl).filter(Boolean) : [];
    if (service?.imageUrl) arr.unshift(normalizeUrl(service.imageUrl));
    const seen = new Set();
    return arr.filter((u) => (u && !seen.has(u) ? (seen.add(u), true) : false));
  }, [service]);

  const videoUrl = useMemo(() => normalizeUrl(service?.media?.videoUrl || service?.videoUrl), [service]);

  const productLike = useMemo(() => {
    const thumbs = [...imageUrls];
    if (videoUrl) thumbs.push(videoUrl);
    return {
      id: service?.id || service?._id || serviceId,
      detailsPageInfo: {
        thumbnailUrls: thumbs,
        mainImageUrl: imageUrls[0] || videoUrl || '',
      },
      imageUrl: imageUrls[0] || '',
    };
  }, [service, imageUrls, videoUrl, serviceId]);

  // Reuse media gallery hook
  const {
    mediaRawList,
    selectedRaw,
    selectedDisplay,
    isVideoDisplay,
    isPlaying,
    videoRef,
    handleThumbClick,
    handlePlayClick,
    handleVideoError,
    handleImageError,
  } = useMediaGallery(productLike);

  // Availability (UI only; integrate with API if needed)
  const [available, setAvailable] = useState(true);
  useEffect(() => {
    if (service) {
      setAvailable(service.available ?? service.status === 'available' ?? true);
    }
  }, [service]);

  // Like
  const { liked, toggle: toggleLike } = useLike(serviceId, userId);
  const handleToggleLike = () => {
    if (!isLoggedIn) {
      push('Please log in to like services.', { type: 'info' });
      return;
    }
    toggleLike();
    push(!liked ? 'Added to favorites.' : 'Removed from favorites.', { type: 'success' });
  };

  // Delete
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

  // Edit
  const handleEditService = () => {
    navigate(`/my-services/${serviceId}/edit`, { state: { from: location.pathname } });
  };

  // 3-dot menu (reused ProductMoreMenu)
  const currentStatus = available ? 'available' : 'unavailable';
  const handleCopyLink = async () => {
    try {
      await copyText(window.location.href);
      push('Link copied to clipboard.', { type: 'success' });
    } catch {
      push('Failed to copy link.', { type: 'error' });
    }
  };
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: service?.name || 'Service', url: window.location.href });
      } else {
        await copyText(window.location.href);
        push('Link copied to clipboard.', { type: 'success' });
      }
    } catch {
      // cancelled
    }
  };
  const handleMarkUnavailable = () => {
    if (window.confirm('Mark this service as Unavailable?')) {
      setAvailable(false);
      push('Service marked as Unavailable.', { type: 'success' });
    }
  };
  const handleMarkAvailable = () => {
    if (window.confirm('Mark this service as Available?')) {
      setAvailable(true);
      push('Service marked as Available.', { type: 'success' });
    }
  };
  const handleMarkSold = () => {
    // Not applicable for services, but kept for ProductMoreMenu signature
    push('Not applicable for services.', { type: 'info' });
  };

  // Status/Stats modal
  const [showServiceStatModal, setShowServiceStatModal] = useState(false);
  const openStatusModal = () => setShowServiceStatModal(true);
  const closeStatusModal = () => setShowServiceStatModal(false);

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

  const serviceName = service.name || '';
  const priceMin = Number(service.minPrice || 0);
  const priceMax = Number(service.maxPrice || 0);
  const storeName = service.userName || service.storeName || '';
  const storePic = service.profilePic || '';
  const rating = service.rating;

  const statsPayload = {
    id: service.id || service._id || serviceId,
    name: serviceName,
    minPrice: priceMin,
    maxPrice: priceMax,
    dateCreated: service.createdAt ? new Date(service.createdAt).toLocaleDateString() : service.dateCreated || '',
    imageUrl: imageUrls[0] || service.imageUrl || '',
    chartData: service.chartData || [],
    orderId: service.orderId,
    views: service.views,
    phoneViews: service.phoneViews,
    chats: service.chats,
  };

  // Bottom overlay (services only): store avatar + name + rating
  const galleryOverlay = (
    <div className="px-3 py-2 bg-gradient-to-t from-black/70 to-transparent">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {storePic ? (
            <img
              src={storePic}
              alt="Profile"
              className="w-7 h-7 rounded-full object-cover border border-white/30"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://placehold.co/28x28/e0e0e0/000000?text=';
              }}
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-white/20" />
          )}
          {storeName && <span className="text-sm font-medium text-white">{storeName}</span>}
        </div>
        {rating ? (
          <div className="flex items-center text-xs text-white">
            <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
            <span>{rating}</span>
          </div>
        ) : null}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-4 md:p-8 bg-gray-50 min-h-screen font-inter">
       <BackButton className="md:hidden mb-2" fallback="/my-services" />
      {/* Header */}
      <div className="flex  justify-between items-center mb-6">
        
        <div className="flex flex-col items-center gap-3">
         
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800" style={{ fontFamily: 'Manrope' }}>
            My Service / <span style={brandTextStyle}>Service Details</span>
          </h1>
        </div>

        {/* Keep like + menu in header to avoid dropdown clipping inside the viewer */}
        <div className="flex  items-center gap-1">
          <button
            type="button"
            onClick={handleToggleLike}
            aria-label={liked ? 'Unlike' : 'Like'}
            className="p-2 rounded-full bg-white hover:bg-gray-200"
            title={liked ? 'Unlike' : 'Like'}
          >
            {liked ? (
              <HeartSolidIcon className="w-6 h-6" style={{color:brandColor}}/>
            ) : (
              <HeartIcon className="w-6 h-6 text-gray-600" />
            )}
          </button>

          <ProductMoreMenu
            currentStatus={currentStatus}
            onEdit={handleEditService}
            onBoost={() => push('Boost is not available for services (yet).', { type: 'info' })}
            onStats={openStatusModal}
            onCopyLink={handleCopyLink}
            onShare={handleShare}
            onMarkSold={handleMarkSold}
            onMarkUnavailable={handleMarkUnavailable}
            onMarkAvailable={handleMarkAvailable}
            onDelete={handleDeleteService}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-8 border border-gray-200">
        {/* Media gallery with service overlay */}
        <div className="lg:col-span-1">
          <ProductMediaGallery
            brandColor={brandColor}
            mediaRawList={mediaRawList}
            selectedRaw={selectedRaw}
            selectedDisplay={selectedDisplay}
            isVideoDisplay={isVideoDisplay}
            videoRef={videoRef}
            isPlaying={isPlaying}
            onThumbClick={handleThumbClick}
            onPlayClick={handlePlayClick}
            onVideoError={handleVideoError}
            onImageError={handleImageError}
            overlayBottom={galleryOverlay}
          />
        </div>

        {/* Details */}
        <div className="flex flex-col lg:col-span-2">
          <div className="flex  justify-between items-center mb-2">
            <h2 className="text-2xl font-bold text-gray-900">{serviceName}</h2>
            {rating && (
              <div className="flex items-center text-lg text-gray-600 flex-shrink-0">
                <StarIcon className="h-5 w-5 text-yellow-500 mr-1" />
                <span className="text-md font-medium">{rating}</span>
              </div>
            )}
          </div>

          <div className="flex items-baseline mb-4">
            <span className="text-2xl font-bold" style={brandTextStyle}>
              ₦{priceMin.toLocaleString()} - ₦{priceMax.toLocaleString()}
            </span>
            {!available && (
              <span className="ml-3 text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-800 uppercase tracking-wide">
                Unavailable
              </span>
            )}
          </div>

          <hr className="my-4 border-gray-300" />

          {/* Description */}
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
          <p className="text-gray-700 mb-6 leading-relaxed">
            {service.fullDescription || service.description || service.shortDescription || 'No description provided.'}
          </p>

          <hr className="my-4 border-gray-300" />

          {/* Price breakdown */}
          {Array.isArray(service.priceBreakdown) && service.priceBreakdown.length > 0 && (
            <>
              <h3 className="text-lg text-gray-500 mb-3">Price Breakdown</h3>
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
                title="Delete"
              >
                <TrashIcon className="h-6 w-6" />
              </Button>

              {/* Status button -> opens ServiceStatModal */}
              <Button
                onClick={openStatusModal}
                className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors shadow-sm"
                aria-label="Service Status"
                title="Service Status"
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

      {/* Service Status/Stats Modal */}
      {showServiceStatModal && (
        <ServiceStatModal
          isOpen={showServiceStatModal}
          onClose={closeStatusModal}
          serviceStats={statsPayload}
          brandColor={brandColor}
          contrastTextColor={contrastTextColor}
        />
      )}
    </div>
  );
};

export default ServiceDetailsPage;