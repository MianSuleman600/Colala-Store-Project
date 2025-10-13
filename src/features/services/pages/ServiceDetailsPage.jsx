// src/features/services/pages/ServiceDetailsPage.jsx

import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { TrashIcon, ChartBarIcon, PencilSquareIcon, HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

import { useStoreProfile } from '../../../services/queries/storeProfileQuery';
import { useService } from '../../../services/queries/useServiceQuery';
import { useDeleteService } from '../../../services/mutations/useServicesMutation';
import { useToast } from '../../../components/ui/ToastProvider';

import Button from '../../../components/ui/Button';
import { getContrastTextColor } from '../../../utils/colorUtils';
import BackButton from '../../../components/ui/BackButton';

import ProductMediaGallery from '../../products/pages/ProductMediaGallery';
import ProductMoreMenu from '../../products/pages/ProductMoreMenu';
import { useLike } from '../../../hooks/Products/useLike';
import { copyText } from '../../../utils/clipboard';
import ServiceStatModal from '../../../components/services/ServiceStatModal';
import { ASSETS_BASE } from '../../../api/apiConfig';
import { isVideoUrl } from '../../../utils/mediaUtils';

const ServiceDetailsPage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { push } = useToast();

  // ✅ AUTH FIX: Using the correct 'auth' slice from Redux store.
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const userId = user?.id;
  
  const { data: storeProfile } = useStoreProfile(userId, { enabled: isAuthenticated && !!userId });

  const brandColor = storeProfile?.brandColor || '#EF4444';
  const contrastTextColor = getContrastTextColor(brandColor);
  const brandTextStyle = { color: brandColor };
  const brandBgStyle = { backgroundColor: brandColor, color: contrastTextColor };

  const { data: service, isLoading, error } = useService(serviceId, { enabled: !!serviceId });

  const [selectedMedia, setSelectedMedia] = useState('');
  const videoRef = useRef(null);
  
  const mediaRawList = useMemo(() => {
    if (!service?.media) return [];
    return service.media.map(item => `${ASSETS_BASE}/storage/${item.path}`);
  }, [service]);

  useEffect(() => {
    if (mediaRawList.length > 0 && !selectedMedia) {
      setSelectedMedia(mediaRawList[0]);
    }
  }, [mediaRawList, selectedMedia]);

  const isVideoDisplay = useMemo(() => isVideoUrl(selectedMedia), [selectedMedia]);
  const handleThumbClick = (url) => setSelectedMedia(url);

  const [available, setAvailable] = useState(true);
  useEffect(() => {
    if (service) setAvailable(service.status === 'available');
  }, [service]);

  const { liked, toggle: toggleLike } = useLike(serviceId, userId);
  const deleteMutation = useDeleteService();

  const handleToggleLike = () => { /* ... */ };
  const handleDeleteService = () => { /* ... */ };
  const handleEditService = () => navigate(`/my-services/${serviceId}/edit`);
  const handleCopyLink = () => copyText(window.location.href, () => push('Link copied!', { type: 'success' }));
  const handleShare = () => { /* ... */ };
  const handleMarkUnavailable = () => { /* ... */ };
  const handleMarkAvailable = () => { /* ... */ };

  const currentStatus = available ? 'available' : 'unavailable';
  
  const [showServiceStatModal, setShowServiceStatModal] = useState(false);
  const openStatusModal = () => setShowServiceStatModal(true);
  const closeStatusModal = () => setShowServiceStatModal(false);

  // ✅ ROBUST GUARD CLAUSE: This is the main fix.
  // This block handles all loading, error, and "not found" states before trying to render the main component.
  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading service details...</div>;
  }
  
  if (error || !service) {
    return (
      <div className="p-8 text-center text-red-600">
        Error: Could not load service. It may have been deleted or does not exist.
        <BackButton fallback="/my-services" className="mt-4 block mx-auto"/>
      </div>
    );
  }

  // Because of the guard clause above, we can now safely assume 'service' exists.
  const galleryOverlay = (<></>); 
  const serviceName = service.name || '';
  const priceRange = `₦${Number(service.price_from || 0).toLocaleString()} - ₦${Number(service.price_to || 0).toLocaleString()}`;
  const shortDescription = service.short_description || 'No short description provided.';
  const fullDescription = service.full_description || 'No full description provided.';

  return (
    <div className="container mx-auto p-4 md:p-8 bg-gray-50 min-h-screen font-inter">
      <BackButton className="md:hidden mb-2" fallback="/my-services" />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800" style={{ fontFamily: 'Manrope' }}>
          My Service / <span style={brandTextStyle}>Service Details</span>
        </h1>
        <div className="flex items-center gap-1">
          <button type="button" onClick={handleToggleLike} aria-label={liked ? 'Unlike' : 'Like'} className="p-2 rounded-full bg-white hover:bg-gray-200" title={liked ? 'Unlike' : 'Like'}>
            {liked ? <HeartSolidIcon className="w-6 h-6" style={{color:brandColor}}/> : <HeartIcon className="w-6 h-6 text-gray-600" />}
          </button>
          <ProductMoreMenu currentStatus={currentStatus} onEdit={handleEditService} onBoost={() => push('Boost is not available for services.', { type: 'info' })} onStats={openStatusModal} onCopyLink={handleCopyLink} onShare={handleShare} onMarkSold={() => {}} onMarkUnavailable={handleMarkUnavailable} onMarkAvailable={handleMarkAvailable} onDelete={handleDeleteService} />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-8 border border-gray-200">
        <div className="lg:col-span-1">
          <ProductMediaGallery 
            brandColor={brandColor} 
            mediaRawList={mediaRawList} 
            selectedRaw={selectedMedia} 
            selectedDisplay={selectedMedia} 
            isVideoDisplay={isVideoDisplay} 
            videoRef={videoRef} 
            onThumbClick={handleThumbClick} 
            isPlaying={false}
            onPlayClick={() => {}}
            onVideoError={() => {}}
            onImageError={() => {}}
            overlayBottom={galleryOverlay} 
          />
        </div>
        <div className="flex flex-col lg:col-span-2">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{serviceName}</h2>
            <p className="text-2xl font-semibold mb-4" style={brandTextStyle}>{priceRange}</p>
            <p className="text-gray-600 mb-4">{shortDescription}</p>
            <div className="border-t pt-4">
                <h3 className="font-semibold text-lg mb-2">Full Description</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{fullDescription}</p>
            </div>
          <div className="flex justify-between items-center w-full mt-auto pt-6">
            <div className="flex space-x-3">
              <Button onClick={handleDeleteService} disabled={deleteMutation.isPending} className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600" aria-label="Delete Service" title="Delete">
                <TrashIcon className="h-6 w-6" />
              </Button>
              <Button onClick={openStatusModal} className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600" aria-label="Service Status" title="Service Status">
                <ChartBarIcon className="h-6 w-6" />
              </Button>
            </div>
            <Button onClick={handleEditService} className="px-6 py-3 rounded-lg font-semibold w-full max-w-xs shadow-md flex items-center justify-center gap-2" style={brandBgStyle}>
              <PencilSquareIcon className="h-5 w-5" /> Edit Service
            </Button>
          </div>
        </div>
      </div>
      
      {showServiceStatModal && (
        <ServiceStatModal
          isOpen={showServiceStatModal}
          onClose={closeStatusModal}
          serviceId={serviceId}
          brandColor={brandColor}
          contrastTextColor={contrastTextColor}
        />
      )}
    </div>
  );
};

export default ServiceDetailsPage;