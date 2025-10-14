import React, { useState, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { PlusCircleIcon, XMarkIcon, CameraIcon, ChevronDownIcon, BriefcaseIcon } from '@heroicons/react/24/outline';
import { useStoreProfile } from '../../../services/queries/storeProfileQuery';
import { getContrastTextColor } from '../../../utils/colorUtils';
import { useToast } from '../../../components/ui/ToastProvider';
import { useServiceForm } from '../../../hooks/Service/useServiceForm';
import { useServiceCategories } from '../../../services/queries/useServiceQuery';
import BackButton from '../../../components/ui/BackButton';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';

function AddServicePage() {
  const { push } = useToast();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const userId = user?.id;
  const { serviceId } = useParams();
  const location = useLocation();
  const isEdit = Boolean(serviceId);

  const { data: storeProfile } = useStoreProfile(userId, { enabled: isAuthenticated && !!userId });
  const brandColor = useMemo(() => storeProfile?.brandColor || '#EF4444', [storeProfile]);
  const contrastTextColor = useMemo(() => getContrastTextColor(brandColor), [brandColor]);
  const brandBgStyle = { backgroundColor: brandColor, color: contrastTextColor };
  const brandTextStyle = { color: brandColor };

  const { data: serviceCategoriesData } = useServiceCategories();
  const serviceCategories = useMemo(() => serviceCategoriesData?.data || serviceCategoriesData || [], [serviceCategoriesData]);

  const [showServiceCategorySelectModal, setShowServiceCategorySelectModal] = useState(false);
  const [newSubServiceName, setNewSubServiceName] = useState('');

  const serviceFromState = location.state?.service;

  const {
    isLoadingInit,
    formData,
    validationErrors,
    handleChange,
    handleFileChange,
    handleRemoveImage,
    handleRemoveVideo,
    addSubService,
    removeSubService,
    handleServiceCategorySelect,
    submit,
    isSubmitting,
    MEDIA,
  } = useServiceForm({
    serviceId,
    serviceFromState,
    // ✅ FIX: The onSuccess handler now receives the full API response.
    // We extract the fresh data and pass it directly to the details page.
    onSuccess: (response) => {
      const savedService = response?.data || response;
      console.log('[DEBUG AddServicePage] onSuccess - Received updated service data:', savedService);
      push(isEdit ? 'Service updated successfully!' : 'Service posted successfully!', { type: 'success' });
      const id = savedService?.id || serviceId;
      if (id) {
        navigate(`/my-services/${id}/details`, { state: { service: savedService } });
      }
    },
    onError: (err) => {
      // Errors are handled in the hook
    },
  });

  const handleAddSubService = () => {
    if (!newSubServiceName.trim()) {
      push('Enter a sub-service name', { type: 'info' });
      return;
    }
    addSubService(newSubServiceName.trim());
    setNewSubServiceName('');
  };

  if (isEdit && isLoadingInit) {
    return <div className="p-8 text-center">Loading service...</div>;
  }
  
  const totalMediaCount = formData.serviceImages.length + (formData.serviceVideo ? 1 : 0);

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4 lg:p-8">
      <div className="relative flex w-full max-w-[1200px] bg-white rounded-2xl shadow-xl overflow-hidden p-8">
        <div className="flex flex-col md:flex-row w-full gap-8">
          <div className="flex-1 flex flex-col space-y-6 text-left">
            <div className="flex items-center gap-3 mb-4">
              <BackButton className="md:hidden" fallback="/my-services" />
              <h1 className="text-3xl font-bold text-gray-800">{isEdit ? 'Edit Service' : 'Add Service'}</h1>
            </div>
            <div className="mb-2">
              <h2 className="font-semibold text-gray-800">Service Media</h2>
              <p className="text-sm text-gray-500">Add up to {MEDIA.MAX_TOTAL_MEDIA} total files (images and video).</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {formData.serviceImages.map((img, index) => (
                <div key={img.fileUrl || index} className="relative w-full aspect-square rounded-lg border border-gray-300">
                  <img src={img.fileUrl} alt={`Service preview ${index + 1}`} className="w-full h-full object-cover rounded-lg" />
                  <button onClick={() => handleRemoveImage(index)} className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1" aria-label="Remove image"><XMarkIcon className="h-4 w-4" /></button>
                </div>
              ))}
              {totalMediaCount < MEDIA.MAX_TOTAL_MEDIA && (
                <label className="w-full aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400">
                  <CameraIcon className="h-8 w-8 text-gray-400" />
                  <span className="text-xs text-gray-500 mt-1">Add Image</span>
                  <input type="file" name="serviceImages" className="sr-only" onChange={handleFileChange} accept={MEDIA.ALLOWED_IMAGE_TYPES.join(',')} multiple/>
                </label>
              )}
            </div>
            <div>
              <div className="mb-2 text-sm text-gray-700">Optional video (counts towards {MEDIA.MAX_TOTAL_MEDIA} file limit)</div>
              {formData.serviceVideo ? (
                <div className="relative w-[160px] h-[90px] rounded-lg border border-gray-300">
                  <video src={formData.serviceVideo.fileUrl} className="w-full h-full object-cover rounded-lg" controls />
                  <button onClick={handleRemoveVideo} className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1" aria-label="Remove video"><XMarkIcon className="h-4 w-4" /></button>
                </div>
              ) : (
                totalMediaCount < MEDIA.MAX_TOTAL_MEDIA && (
                  <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-gray-300 cursor-pointer hover:border-gray-400">
                    <CameraIcon className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-600">Add Video</span>
                    <input type="file" name="serviceVideo" className="sr-only" onChange={handleFileChange} accept={MEDIA.ALLOWED_VIDEO_TYPES.join(',')}/>
                  </label>
                )
              )}
            </div>
          </div>
          <div className="flex-1 flex flex-col space-y-6 items-center">
            <div className="w-full max-w-md space-y-4">
              <Input type="text" name="serviceName" placeholder="Service Name" value={formData.serviceName} onChange={handleChange} error={validationErrors.serviceName}/>
              <div className="relative">
                <div className="flex items-center justify-between p-3 rounded-lg border bg-white cursor-pointer" onClick={() => setShowServiceCategorySelectModal(true)}>
                  <div className="flex items-center gap-2">
                    <BriefcaseIcon className="h-5 w-5 text-gray-400" />
                    <span>{formData.serviceCategory?.title || formData.serviceCategory?.name || 'Service Category'}</span>
                  </div>
                  <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                </div>
                {validationErrors.serviceCategory && <p className="text-xs mt-1" style={brandTextStyle}>{validationErrors.serviceCategory}</p>}
              </div>
              <Input type="text" name="shortDescription" placeholder="Short description" value={formData.shortDescription} onChange={handleChange} error={validationErrors.shortDescription}/>
              <textarea name="fullDescription" placeholder="Add Full Description" value={formData.fullDescription} onChange={handleChange} rows="4" className="w-full p-3 rounded-lg border focus:ring-1 focus:ring-inset" style={{ '--tw-ring-color': brandColor }} />
              <div className="grid grid-cols-2 gap-2">
                <Input type="number" name="priceRangeFrom" placeholder="Min Price" value={formData.priceRangeFrom} onChange={handleChange} error={validationErrors.priceRangeFrom}/>
                <Input type="number" name="priceRangeTo" placeholder="Max Price" value={formData.priceRangeTo} onChange={handleChange} error={validationErrors.priceRangeTo}/>
              </div>
              <Input type="number" name="discountPrice" placeholder="Discount Price (optional)" value={formData.discountPrice} onChange={handleChange}/>
              <div className="w-full mt-4">
                <div className="mb-2 font-medium text-gray-700">Sub-services</div>
                {formData.subServices.map((sub, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input type="text" value={sub.name} readOnly className="flex-1 bg-gray-50"/>
                    <button onClick={() => removeSubService(index)} type="button" className="p-2 text-red-500" aria-label="Remove sub-service"><XMarkIcon className="h-5 w-5" /></button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Input type="text" placeholder="Sub-service name" value={newSubServiceName} onChange={(e) => setNewSubServiceName(e.target.value)}/>
                  <button onClick={handleAddSubService} type="button" className="p-2 text-green-600" aria-label="Add sub-service"><PlusCircleIcon className="h-6 w-6" /></button>
                </div>
              </div>
            </div>
            <Button onClick={submit} disabled={isSubmitting} className="w-full max-w-md py-3 px-4 rounded-lg font-semibold mt-4" style={brandBgStyle}>
              {isSubmitting ? 'Saving...' : (isEdit ? 'Save Changes' : 'Post Service')}
            </Button>
          </div>
        </div>
      </div>
      <Modal isOpen={showServiceCategorySelectModal} onClose={() => setShowServiceCategorySelectModal(false)} title="Select Service Category">
        <div className="space-y-2">
          {serviceCategories.length > 0 ? (
            serviceCategories.map((cat) => (
              <div key={cat.id} className="p-3 rounded-lg border cursor-pointer hover:bg-gray-50"
                onClick={() => { handleServiceCategorySelect(cat); setShowServiceCategorySelectModal(false); }}
              >{cat.title || cat.name}</div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">No categories found.</div>
          )}
        </div>
      </Modal>
    </div>
  );
}

export default AddServicePage;