import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { TrashIcon, ChartBarIcon, PencilSquareIcon, HeartIcon, StarIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useStoreProfile } from '../../../services/queries/storeProfileQuery';
import { useService } from '../../../services/queries/useServiceQuery';
import { useDeleteService, useUpdateServiceStatus } from '../../../services/mutations/useServicesMutation';
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
  const location = useLocation();
  const { push } = useToast();

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const userId = user?.id;
  
  const { data: storeProfile } = useStoreProfile(userId, { enabled: isAuthenticated && !!userId });

  const brandColor = storeProfile?.brandColor || '#EF4444';
  const contrastTextColor = getContrastTextColor(brandColor);
  const brandTextStyle = { color: brandColor };
  const brandBgStyle = { backgroundColor: brandColor, color: contrastTextColor };

  const serviceFromState = location.state?.service;
  const { data: serviceFromApi, isLoading, error, refetch } = useService(serviceId, { enabled: !!serviceId && !serviceFromState });
  const service = serviceFromState || serviceFromApi;

  const [selectedMedia, setSelectedMedia] = useState('');
  const videoRef = useRef(null);
  
  const mediaRawList = useMemo(() => {
    if (!service?.media) return [];
    return service.media.map(item => `${ASSETS_BASE}/storage/${item.path}`);
  }, [service]);

  useEffect(() => {
    if (mediaRawList.length > 0) {
      setSelectedMedia(mediaRawList[0]);
    } else {
      setSelectedMedia('');
    }
  }, [mediaRawList]);

  const isVideoDisplay = useMemo(() => isVideoUrl(selectedMedia), [selectedMedia]);
  const handleThumbClick = (url) => setSelectedMedia(url);

  const [available, setAvailable] = useState(true);
  useEffect(() => {
    if (service) setAvailable(service.status === 'active');
  }, [service]);

  const { liked, toggle: toggleLike } = useLike(serviceId, userId);
  
  const deleteMutation = useDeleteService({
    onSuccess: () => {
        push('Service deleted successfully.', { type: 'success' });
        navigate('/my-services');
    },
    onError: (err) => {
        push(err.message || 'Failed to delete service.', { type: 'error' });
    }
  });

  const updateStatusMutation = useUpdateServiceStatus({
    onSuccess: (updatedService) => {
        push('Service status updated.', { type: 'success' });
        setAvailable(updatedService.status === 'active');
        refetch();
    },
    onError: (err) => {
        push(err.message || 'Failed to update status.', { type: 'error' });
    }
  });

  const handleToggleLike = () => { /* Logic to call like/unlike mutation */ };

  const handleDeleteService = () => {
    if (window.confirm('Are you sure you want to permanently delete this service?')) {
        deleteMutation.mutate({ serviceId });
    }
  };

  const handleEditService = () => {
    if (!service) {
        push("Service data is not available to edit.", { type: "error" });
        return;
    }
    navigate(`/my-services/${serviceId}/edit`, { state: { service } });
  };

  const handleCopyLink = () => copyText(window.location.href, () => push('Link copied!', { type: 'success' }));
  const handleShare = () => { /* Future share logic */ };
  const handleMarkUnavailable = () => updateStatusMutation.mutate({ serviceId, status: 'unavailable' });
  const handleMarkAvailable = () => updateStatusMutation.mutate({ serviceId, status: 'active' });

  const currentStatus = available ? 'available' : 'unavailable';
  
  const [showServiceStatModal, setShowServiceStatModal] = useState(false);
  const openStatusModal = () => setShowServiceStatModal(true);
  const closeStatusModal = () => setShowServiceStatModal(false);

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

  const store = service.store;
  const storeLogoUrl = store?.profile_image ? `${ASSETS_BASE}/storage/${store.profile_image}` : 'https://placehold.co/40x40/e0e0e0/000000?text=S';
  
  const galleryOverlay = (
    <div className="p-3 bg-black/50 text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={storeLogoUrl} alt={store?.store_name || 'Store'} className="w-8 h-8 rounded-full object-cover border-2 border-white"/>
          <p className="font-bold text-sm line-clamp-1">{store?.store_name || 'Store Name'}</p>
        </div>
        <div className="flex items-center gap-1 text-sm text-gray-200">
          <StarIcon className="w-5 h-5 text-yellow-400"/>
          <span>{Number(store?.average_rating || 0).toFixed(1)}</span>
        </div>
      </div>
    </div>
  ); 

  const serviceName = service.name || '';
  const priceRange = `₦${Number(service.price_from || 0).toLocaleString()} - ₦${Number(service.price_to || 0).toLocaleString()}`;
  const shortDescription = service.short_description || 'No short description provided.';
  const fullDescription = service.full_description || 'No full description provided.';

  return (
    <div className="container mx-auto p-4 md:p-8 bg-gray-50 min-h-screen font-inter">
      <BackButton className="md:hidden mb-2" fallback="/my-services" />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800" style={{ fontFamily: 'Manrope' }}>My Service / <span style={brandTextStyle}>Service Details</span></h1>
        <div className="flex items-center gap-1">
          <button type="button" onClick={handleToggleLike} aria-label={liked ? 'Unlike' : 'Like'} className="p-2 ..."><HeartSolidIcon className="w-6 h-6" style={{color:brandColor}}/></button>
          <ProductMoreMenu currentStatus={currentStatus} onEdit={handleEditService} onBoost={() => {}} onStats={openStatusModal} onCopyLink={handleCopyLink} onShare={handleShare} onMarkSold={() => {}} onMarkUnavailable={handleMarkUnavailable} onMarkAvailable={handleMarkAvailable} onDelete={handleDeleteService} />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-8 border border-gray-200">
        <div className="lg:col-span-1">
          <ProductMediaGallery brandColor={brandColor} mediaRawList={mediaRawList} selectedRaw={selectedMedia} selectedDisplay={selectedMedia} isVideoDisplay={isVideoDisplay} videoRef={videoRef} onThumbClick={handleThumbClick} isPlaying={false} onPlayClick={() => {}} onVideoError={() => {}} onImageError={() => {}} overlayBottom={galleryOverlay} />
        </div>
        <div className="flex flex-col lg:col-span-2">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{serviceName}</h2>
          <p className="text-2xl font-semibold mb-4" style={brandTextStyle}>{priceRange}</p>
          <p className="text-gray-600 mb-4">{shortDescription}</p>
          <div className="border-t pt-4"><h3 className="font-semibold text-lg mb-2">Full Description</h3><p className="text-gray-700 whitespace-pre-wrap">{fullDescription}</p></div>
          {service.sub_services && service.sub_services.length > 0 && (
            <div className="border-t pt-4 mt-4">
              <h3 className="font-semibold text-lg mb-3">Price Breakdown</h3>
              <div className="bg-gray-100 rounded-lg p-4 space-y-3">
                {service.sub_services.map((sub) => (
                  <div key={sub.id} className="flex justify-between items-center text-sm pb-2 border-b border-gray-200 last:border-b-0 last:pb-0">
                    <span className="text-gray-600">{sub.name}</span>
                    <span className="font-semibold text-gray-800">₦{Number(sub.price_from || 0).toLocaleString()} - ₦{Number(sub.price_to || 0).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="flex justify-between items-center w-full mt-auto pt-6">
            <div className="flex space-x-3">
              <Button onClick={handleDeleteService} disabled={deleteMutation.isPending} className="p-3 ..."><TrashIcon className="h-6 w-6" /></Button>
              <Button onClick={openStatusModal} className="p-3 ..."><ChartBarIcon className="h-6 w-6" /></Button>
            </div>
            <Button onClick={handleEditService} className="px-6 py-3 ..." style={brandBgStyle}><PencilSquareIcon className="h-5 w-5" /> Edit Service</Button>
          </div>
        </div>
      </div>
      {showServiceStatModal && (
        <ServiceStatModal isOpen={showServiceStatModal} onClose={closeStatusModal} service={service} brandColor={brandColor} contrastTextColor={contrastTextColor} />
      )}
    </div>
  );
};

export default ServiceDetailsPage;