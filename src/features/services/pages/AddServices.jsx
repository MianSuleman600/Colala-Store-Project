import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { PlusCircleIcon, XMarkIcon, CameraIcon, ChevronDownIcon, BriefcaseIcon } from '@heroicons/react/24/outline';

import { useStoreProfile } from '../../../services/queries/storeProfileQuery';
import { getContrastTextColor } from '../../../utils/colorUtils';
import { useToast } from '../../../components/ui/ToastProvider';

import { useServiceForm } from '../../../hooks/Service/useServiceForm';
import BackButton from '../../../components/ui/BackButton';

import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';

const dummyServiceCategories = [
  'Consulting',
  'Repairs',
  'Tutoring',
  'Cleaning',
  'Digital Marketing',
  'Event Planning',
];

function AddServicePage() {
  const { push } = useToast();
  const navigate = useNavigate();
  const { userId, isLoggedIn } = useSelector((state) => state.user);
  const { serviceId } = useParams();

  const { data: storeProfile } = useStoreProfile(userId, { enabled: isLoggedIn && !!userId });
  const brandColor = useMemo(() => storeProfile?.brandColor || '#EF4444', [storeProfile]);
  const contrastTextColor = useMemo(() => getContrastTextColor(brandColor), [brandColor]);

  const brandBgStyle = { backgroundColor: brandColor, color: contrastTextColor };
  const brandTextStyle = { color: brandColor };
  const contrastTextStyle = { color: contrastTextColor };

  const [showServiceCategorySelectModal, setShowServiceCategorySelectModal] = useState(false);
  const [newSubServiceName, setNewSubServiceName] = useState('');

  const {
    isEdit,
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
    onSuccess: (normalized, { mode }) => {
      push(mode === 'create' ? 'Service posted successfully!' : 'Service updated successfully!', { type: 'success' });
      const id = normalized?.id || serviceId;
      if (id) navigate(`/my-services/${id}/details`);
    },
    onError: (err) => {
      push(err?.message || 'Failed to save service.', { type: 'error' });
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
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4 lg:p-8">
        <div className="text-gray-700">Loading service...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4 lg:p-8">
      <div className="relative flex w-full max-w-[1200px] bg-white rounded-2xl shadow-xl overflow-hidden p-8">
        <div className="flex flex-col md:flex-row w-full gap-8">
          {/* Left column - Media */}
          <div className="flex-1 flex flex-col space-y-6 text-left">
            <div className="flex items-center gap-3 mb-4">
              <BackButton className="md:hidden" fallback="/my-services" />
              <h1 className="text-3xl font-bold text-gray-800">
                {isEdit ? 'Edit Service' : 'Add Service'}
              </h1>
            </div>

            {/* Images grid */}
            <div className="grid grid-cols-2 gap-4">
              {formData.serviceImages.map((img, index) => (
                <div key={index} className="relative w-[100px] h-[100px] rounded-lg border border-gray-300">
                  <img src={img.fileUrl} alt="" className="w-full h-full object-cover rounded-lg" />
                  <button
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1"
                    aria-label="Remove image"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {formData.serviceImages.length < MEDIA.MAX_IMAGES && (
                <label className="w-[100px] h-[100px] rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400">
                  <CameraIcon className="h-8 w-8 text-gray-400" />
                  <span className="text-xs text-gray-500 mt-1">Add Image</span>
                  <input
                    type="file"
                    name="serviceImages"
                    className="sr-only"
                    onChange={handleFileChange}
                    accept={MEDIA.ALLOWED_IMAGE_TYPES.join(',')}
                    multiple
                  />
                </label>
              )}
            </div>
            {validationErrors.serviceImages && (
              <p className="text-xs mt-1" style={brandTextStyle}>
                {validationErrors.serviceImages}
              </p>
            )}

            {/* Video */}
            <div>
              <div className="mb-2 text-sm text-gray-700">Add optional video (max {MEDIA.MAX_VIDEO_MB}MB)</div>
              {formData.serviceVideo ? (
                <div className="relative w-[160px] h-[90px] rounded-lg border border-gray-300">
                  <video src={formData.serviceVideo.fileUrl} className="w-full h-full object-cover rounded-lg" controls />
                  <button
                    onClick={handleRemoveVideo}
                    className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1"
                    aria-label="Remove video"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-gray-300 cursor-pointer hover:border-gray-400">
                  <CameraIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-600">Add Video</span>
                  <input
                    type="file"
                    name="serviceVideo"
                    className="sr-only"
                    onChange={handleFileChange}
                    accept={MEDIA.ALLOWED_VIDEO_TYPES.join(',')}
                  />
                </label>
              )}
            </div>
          </div>

          {/* Right column - Form */}
          <div className="flex-1 flex flex-col space-y-6 items-center">
            <div className="w-full max-w-md space-y-4">
              <Input
                type="text"
                name="serviceName"
                placeholder="Service Name"
                value={formData.serviceName}
                onChange={handleChange}
                className="h-[60px] rounded-[15px] border border-gray-300"
                error={validationErrors.serviceName}
              />

              {/* Category */}
              <div className="relative">
                <div
                  className="flex items-center justify-between p-3 rounded-[15px] border border-gray-300 bg-white cursor-pointer h-[60px]"
                  onClick={() => setShowServiceCategorySelectModal(true)}
                >
                  <div className="flex items-center gap-2">
                    <BriefcaseIcon className="h-5 w-5 text-gray-400" />
                    <span>{formData.serviceCategory || 'Service Category'}</span>
                  </div>
                  <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                </div>
                {validationErrors.serviceCategory && (
                  <p className="text-xs mt-1" style={brandTextStyle}>
                    {validationErrors.serviceCategory}
                  </p>
                )}
              </div>

              {/* Short Description */}
              <Input
                type="text"
                name="shortDescription"
                placeholder="Short description"
                value={formData.shortDescription}
                onChange={handleChange}
                className="h-[60px] rounded-[15px] border border-gray-300"
                error={validationErrors.shortDescription}
              />

              {/* Full Description */}
              <textarea
                name="fullDescription"
                placeholder="Add Full Description"
                value={formData.fullDescription}
                onChange={handleChange}
                rows="4"
                className="w-full p-3 rounded-[15px] border border-gray-300"
              />
              {validationErrors.fullDescription && (
                <p className="text-xs mt-1" style={brandTextStyle}>
                  {validationErrors.fullDescription}
                </p>
              )}

              {/* Price Range */}
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="text"
                  name="priceRangeFrom"
                  placeholder="Min Price (e.g., 5,000)"
                  value={formData.priceRangeFrom}
                  onChange={handleChange}
                  className="h-[60px] rounded-[15px] border border-gray-300"
                  error={validationErrors.priceRangeFrom}
                />
                <Input
                  type="text"
                  name="priceRangeTo"
                  placeholder="Max Price (e.g., 20,000)"
                  value={formData.priceRangeTo}
                  onChange={handleChange}
                  className="h-[60px] rounded-[15px] border border-gray-300"
                  error={validationErrors.priceRangeTo}
                />
              </div>

              {/* Discount (optional) */}
              <Input
                type="text"
                name="discountPrice"
                placeholder="Discount Price (optional)"
                value={formData.discountPrice}
                onChange={handleChange}
                className="h-[60px] rounded-[15px] border border-gray-300"
              />

              {/* Sub-services */}
              <div className="w-full mt-4">
                <div className="mb-2 font-medium text-gray-700">Sub-services</div>
                {formData.subServices.map((sub, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input
                      type="text"
                      value={sub.name}
                      readOnly
                      className="flex-1 rounded-[15px] border border-gray-300"
                    />
                    <button
                      onClick={() => removeSubService(index)}
                      type="button"
                      className="p-2 text-red-500"
                      aria-label="Remove sub-service"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Sub-service name"
                    value={newSubServiceName}
                    onChange={(e) => setNewSubServiceName(e.target.value)}
                    className="flex-1 rounded-[15px] border border-gray-300"
                  />
                  <button
                    onClick={handleAddSubService}
                    type="button"
                    className="p-2 text-green-600"
                    aria-label="Add sub-service"
                  >
                    <PlusCircleIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>
            </div>

            {/* Submit */}
            <Button
              onClick={submit}
              disabled={isSubmitting}
              className="w-full max-w-md py-3 px-4 rounded-lg font-semibold mt-4 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={brandBgStyle}
            >
              {isSubmitting && (
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 100 16v4l3.5-3.5L12 20v4a8 8 0 01-8-8z" />
                </svg>
              )}
              <span style={contrastTextStyle}>{isEdit ? 'Save Changes' : 'Post Service'}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Category modal */}
      <Modal
        isOpen={showServiceCategorySelectModal}
        onClose={() => setShowServiceCategorySelectModal(false)}
        title="Select Service Category"
      >
        <div className="space-y-2">
          {dummyServiceCategories.map((cat) => (
            <div
              key={cat}
              className="p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50"
              onClick={() => {
                handleServiceCategorySelect(cat);
                setShowServiceCategorySelectModal(false);
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleServiceCategorySelect(cat)}
            >
              {cat}
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}

export default AddServicePage;