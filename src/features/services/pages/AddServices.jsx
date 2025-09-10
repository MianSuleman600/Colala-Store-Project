import React, { useState, useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { PlusCircleIcon, XMarkIcon, CameraIcon, ChevronDownIcon, BriefcaseIcon } from '@heroicons/react/24/outline';

import { useStoreProfile } from '../../../services/queries/storeProfileQuery';
import { getContrastTextColor } from '../../../utils/colorUtils';
import { useToast } from '../../../components/ui/ToastProvider';
import { useCreateService } from '../../../services/mutations/useServicesMutation';

import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';

// You can move this to a config/constants file
const MAX_IMAGES = 5;
const MAX_IMAGE_MB = 3;
const MAX_VIDEO_MB = 25;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/webm'];

// Dummy service categories — replace with query if you have a category endpoint
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
  const { userId, isLoggedIn } = useSelector((state) => state.user);

  const { data: storeProfile } = useStoreProfile(userId, {
    enabled: isLoggedIn && !!userId,
  });

  const brandColor = useMemo(() => storeProfile?.brandColor || '#EF4444', [storeProfile]);
  const contrastTextColor = useMemo(() => getContrastTextColor(brandColor), [brandColor]);

  const brandBgStyle = { backgroundColor: brandColor, color: contrastTextColor };
  const brandTextStyle = { color: brandColor };
  const contrastTextStyle = { color: contrastTextColor };

  const [showServiceCategorySelectModal, setShowServiceCategorySelectModal] = useState(false);

  const [formData, setFormData] = useState({
    serviceName: '',
    serviceCategory: '',
    shortDescription: '',
    fullDescription: '',
    priceRangeFrom: '',
    priceRangeTo: '',
    discountPrice: '',
    serviceImages: [], // { file, fileUrl, fileName }
    serviceVideo: null, // { file, fileUrl, fileName }
    subServices: [
      { name: 'General', from: '5,000', to: '20,000' },
      { name: 'Male Wear', from: '5,000', to: '20,000' },
      { name: 'Female Wear', from: '5,000', to: '20,000' },
    ],
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [newSubServiceName, setNewSubServiceName] = useState('');

  // Create mutation
  const createService = useCreateService({
    onSuccess: (normalized) => {
      push('Service posted successfully!', { type: 'success' });
      // You can navigate to details if you have a route like /my-services/:id
      // navigate(`/my-services/${normalized?.id || normalized?._id}`);
    },
    onError: (err) => {
      push(err?.message || 'Failed to post service.', { type: 'error' });
    },
  });

  const asNumber = (val) => {
    if (val == null) return 0;
    const cleaned = String(val).replace(/[^\d.]/g, '');
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target || {};
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setValidationErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleServiceCategorySelect = (category) => {
    setFormData((prev) => ({ ...prev, serviceCategory: category }));
    setValidationErrors((prev) => ({ ...prev, serviceCategory: '' }));
    setShowServiceCategorySelectModal(false);
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target || {};
    if (!files || !files.length) return;

    if (name === 'serviceImages') {
      const incoming = Array.from(files);
      const next = [];

      for (const file of incoming) {
        const tooLarge = file.size > MAX_IMAGE_MB * 1024 * 1024;
        const badType = !ALLOWED_IMAGE_TYPES.includes(file.type);
        if (tooLarge || badType) {
          push(
            `Image "${file.name}" skipped (${badType ? 'bad type' : 'too large'}). Allowed: jpg, png, webp, <= ${MAX_IMAGE_MB}MB`,
            { type: 'error' }
          );
          continue;
        }
        next.push({
          file,
          fileUrl: URL.createObjectURL(file),
          fileName: file.name,
        });
      }

      setFormData((prev) => {
        const merged = [...prev.serviceImages, ...next].slice(0, MAX_IMAGES);
        if (merged.length < prev.serviceImages.length + next.length) {
          push(`Maximum ${MAX_IMAGES} images allowed. Extra images were ignored.`, { type: 'info' });
        }
        return { ...prev, serviceImages: merged };
      });
      setValidationErrors((prev) => ({ ...prev, serviceImages: '' }));
    }

    if (name === 'serviceVideo') {
      const file = files[0];
      if (!file) return;
      const tooLarge = file.size > MAX_VIDEO_MB * 1024 * 1024;
      const badType = !ALLOWED_VIDEO_TYPES.includes(file.type);
      if (tooLarge || badType) {
        push(
          `Video "${file.name}" rejected (${badType ? 'bad type' : 'too large'}). Allowed: mp4, mov, webm, <= ${MAX_VIDEO_MB}MB`,
          { type: 'error' }
        );
        return;
      }
      setFormData((prev) => ({
        ...prev,
        serviceVideo: { file, fileUrl: URL.createObjectURL(file), fileName: file.name },
      }));
    }
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      serviceImages: prev.serviceImages.filter((_, i) => i !== index),
    }));
  };

  const handleRemoveVideo = () => {
    setFormData((prev) => ({ ...prev, serviceVideo: null }));
  };

  const handleAddSubService = () => {
    const name = newSubServiceName.trim();
    if (!name) {
      push('Enter a sub-service name', { type: 'info' });
      return;
    }
    setFormData((prev) => ({
      ...prev,
      subServices: [...prev.subServices, { name, from: '', to: '' }],
    }));
    setNewSubServiceName('');
  };

  const handleRemoveSubService = (index) => {
    setFormData((prev) => ({
      ...prev,
      subServices: prev.subServices.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.serviceName.trim()) errors.serviceName = 'Service Name is required.';
    if (!formData.serviceCategory) errors.serviceCategory = 'Category is required.';
    if (!formData.shortDescription.trim()) errors.shortDescription = 'Short description is required.';
    if (!formData.fullDescription.trim()) errors.fullDescription = 'Full description is required.';
    if (formData.serviceImages.length < 1) errors.serviceImages = 'Upload at least 1 image.';

    const min = asNumber(formData.priceRangeFrom);
    const max = asNumber(formData.priceRangeTo);
    if (min <= 0 || max <= 0) errors.priceRangeFrom = 'Enter valid price range.';
    if (min > max) errors.priceRangeTo = 'Max price should be greater than min price.';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const buildFormData = () => {
    // FormData payload for multipart/form-data requests
    const fd = new FormData();

    const payload = {
      name: formData.serviceName.trim(),
      category: formData.serviceCategory,
      shortDescription: formData.shortDescription.trim(),
      fullDescription: formData.fullDescription.trim(),
      minPrice: asNumber(formData.priceRangeFrom),
      maxPrice: asNumber(formData.priceRangeTo),
      discountPrice: asNumber(formData.discountPrice) || undefined,
      subServices: formData.subServices.map((s) => ({
        name: s.name,
        from: asNumber(s.from),
        to: asNumber(s.to),
      })),
    };

    fd.append('payload', JSON.stringify(payload));

    for (const img of formData.serviceImages) {
      if (img?.file) fd.append('images', img.file);
    }
    if (formData.serviceVideo?.file) {
      fd.append('video', formData.serviceVideo.file);
    }

    return fd;
  };

  const handlePostService = async () => {
    if (!isLoggedIn) {
      push('Please log in to post a service.', { type: 'info' });
      return;
    }
    if (!validateForm()) {
      push('Please correct the highlighted errors.', { type: 'error' });
      return;
    }

    try {
      const fd = buildFormData();
      await createService.mutateAsync(fd);
      // Optionally reset form after success
      setFormData((prev) => ({
        ...prev,
        serviceName: '',
        serviceCategory: '',
        shortDescription: '',
        fullDescription: '',
        priceRangeFrom: '',
        priceRangeTo: '',
        discountPrice: '',
        serviceImages: [],
        serviceVideo: null,
        subServices: [],
      }));
    } catch (err) {
      // Toast handled in onError
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4 lg:p-8">
      <div className="relative flex w-full max-w-[1200px] bg-white rounded-2xl shadow-xl overflow-hidden p-8">
        <div className="flex flex-col md:flex-row w-full gap-8">
          {/* Left column - Media */}
          <div className="flex-1 flex flex-col space-y-6 text-left">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Add Service</h1>

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
              {formData.serviceImages.length < MAX_IMAGES && (
                <label className="w-[100px] h-[100px] rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400">
                  <CameraIcon className="h-8 w-8 text-gray-400" />
                  <span className="text-xs text-gray-500 mt-1">Add Image</span>
                  <input
                    type="file"
                    name="serviceImages"
                    className="sr-only"
                    onChange={handleFileChange}
                    accept={ALLOWED_IMAGE_TYPES.join(',')}
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
              <div className="mb-2 text-sm text-gray-700">Add optional video (max {MAX_VIDEO_MB}MB)</div>
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
                    accept={ALLOWED_VIDEO_TYPES.join(',')}
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

              {/* Sub-services (names only here; from/to can be edited after create if needed) */}
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
                      onClick={() => handleRemoveSubService(index)}
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
              onClick={handlePostService}
              disabled={createService.isPending}
              className="w-full max-w-md py-3 px-4 rounded-lg font-semibold mt-4 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={brandBgStyle}
            >
              {createService.isPending && (
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 100 16v4l3.5-3.5L12 20v4a8 8 0 01-8-8z" />
                </svg>
              )}
              <span style={contrastTextStyle}>{createService.isPending ? 'Posting...' : 'Post Service'}</span>
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
              onClick={() => handleServiceCategorySelect(cat)}
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