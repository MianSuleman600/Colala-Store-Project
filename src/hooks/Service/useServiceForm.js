import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useCreateService, useUpdateService } from '../../services/mutations/useServicesMutation';
import { useService } from '../../services/queries/useServiceQuery';
import { useToast } from '../../components/ui/ToastProvider';

export const MEDIA = {
  MAX_IMAGES: 5,
  MAX_IMAGE_MB: 3,
  MAX_VIDEO_MB: 25,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/quicktime', 'video/webm'],
};

const asNumber = (val) => {
  if (val == null) return 0;
  const cleaned = String(val).replace(/[^\d.]/g, '');
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
};

const defaultCreateSubServices = [
  { name: 'General', from: '5,000', to: '20,000' },
  { name: 'Male Wear', from: '5,000', to: '20,000' },
  { name: 'Female Wear', from: '5,000', to: '20,000' },
];

const emptyForm = {
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
};

export function useServiceForm({ serviceId, onSuccess, onError } = {}) {
  const isEdit = Boolean(serviceId);
  const { push } = useToast();
  const { isLoggedIn } = useSelector((state) => state.user);

  const { data: service, isLoading: isLoadingService } = useService(serviceId, { enabled: isEdit });

  const [formData, setFormData] = useState({
    ...emptyForm,
    subServices: isEdit ? [] : defaultCreateSubServices,
  });
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (!isEdit || !service) return;

    const imgs = (service.images || service.media?.images || [])
      .filter(Boolean)
      .map((url) => ({
        file: null,
        fileUrl: url,
        fileName: url.split('/').pop() || 'image',
        existing: true,
      }));

    const videoUrl = service.media?.videoUrl || service.videoUrl || null;
    const priceBreakdown = Array.isArray(service.priceBreakdown) ? service.priceBreakdown : service.subServices;

    setFormData({
      serviceName: service.name || '',
      serviceCategory: service.category || '',
      shortDescription: service.shortDescription || service.shortDesc || '',
      fullDescription: service.fullDescription || service.description || '',
      priceRangeFrom: Number(service.minPrice || 0) ? Number(service.minPrice).toLocaleString() : '',
      priceRangeTo: Number(service.maxPrice || 0) ? Number(service.maxPrice).toLocaleString() : '',
      discountPrice: Number(service.discountPrice || 0) ? Number(service.discountPrice).toLocaleString() : '',
      serviceImages: imgs,
      serviceVideo: videoUrl
        ? { file: null, fileUrl: videoUrl, fileName: videoUrl.split('/').pop() || 'video', existing: true }
        : null,
      subServices:
        Array.isArray(priceBreakdown) && priceBreakdown.length
          ? priceBreakdown.map((s) => ({
              name: s.name || s.type || '',
              from: Number(s.min || s.from || 0) ? Number(s.min || s.from).toLocaleString() : '',
              to: Number(s.max || s.to || 0) ? Number(s.max || s.to).toLocaleString() : '',
            }))
          : [],
    });
  }, [isEdit, service]);

  const createMutation = useCreateService({
    onSuccess: (normalized) => {
      onSuccess?.(normalized, { mode: 'create' });
    },
    onError: (err) => {
      onError?.(err);
    },
  });

  const updateMutation = useUpdateService({
    onSuccess: (normalized) => {
      onSuccess?.(normalized, { mode: 'edit' });
    },
    onError: (err) => {
      onError?.(err);
    },
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target || {};
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setValidationErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleServiceCategorySelect = (category) => {
    setFormData((prev) => ({ ...prev, serviceCategory: category }));
    setValidationErrors((prev) => ({ ...prev, serviceCategory: '' }));
  };

  const [objectUrls, setObjectUrls] = useState([]);
  useEffect(() => {
    return () => {
      objectUrls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [objectUrls]);

  const handleFileChange = (e) => {
    const { name, files } = e.target || {};
    if (!files || !files.length) return;

    if (name === 'serviceImages') {
      const incoming = Array.from(files);
      const next = [];

      for (const file of incoming) {
        const tooLarge = file.size > MEDIA.MAX_IMAGE_MB * 1024 * 1024;
        const badType = !MEDIA.ALLOWED_IMAGE_TYPES.includes(file.type);
        if (tooLarge || badType) {
          push(
            `Image "${file.name}" skipped (${badType ? 'bad type' : 'too large'}). Allowed: jpg, png, webp, <= ${MEDIA.MAX_IMAGE_MB}MB`,
            { type: 'error' }
          );
          continue;
        }
        const url = URL.createObjectURL(file);
        next.push({ file, fileUrl: url, fileName: file.name });
        setObjectUrls((prev) => [...prev, url]);
      }

      setFormData((prev) => {
        const merged = [...prev.serviceImages, ...next].slice(0, MEDIA.MAX_IMAGES);
        if (merged.length < prev.serviceImages.length + next.length) {
          push(`Maximum ${MEDIA.MAX_IMAGES} images allowed. Extra images were ignored.`, { type: 'info' });
        }
        return { ...prev, serviceImages: merged };
      });
      setValidationErrors((prev) => ({ ...prev, serviceImages: '' }));
    }

    if (name === 'serviceVideo') {
      const file = files[0];
      if (!file) return;
      const tooLarge = file.size > MEDIA.MAX_VIDEO_MB * 1024 * 1024;
      const badType = !MEDIA.ALLOWED_VIDEO_TYPES.includes(file.type);
      if (tooLarge || badType) {
        push(
          `Video "${file.name}" rejected (${badType ? 'bad type' : 'too large'}). Allowed: mp4, mov, webm, <= ${MEDIA.MAX_VIDEO_MB}MB`,
          { type: 'error' }
        );
        return;
      }
      const url = URL.createObjectURL(file);
      setObjectUrls((prev) => [...prev, url]);
      setFormData((prev) => ({
        ...prev,
        serviceVideo: { file, fileUrl: url, fileName: file.name },
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

  const addSubService = (name) => {
    const clean = (name || '').trim();
    if (!clean) return false;
    setFormData((prev) => ({
      ...prev,
      subServices: [...prev.subServices, { name: clean, from: '', to: '' }],
    }));
    return true;
  };

  const removeSubService = (index) => {
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

    if (isEdit) {
      payload.existingImageUrls = formData.serviceImages
        .filter((img) => !img.file && img.fileUrl)
        .map((img) => img.fileUrl);

      if (formData.serviceVideo && !formData.serviceVideo.file && formData.serviceVideo.fileUrl) {
        payload.existingVideoUrl = formData.serviceVideo.fileUrl;
      }
    }

    const fd = new FormData();
    fd.append('payload', JSON.stringify(payload));

    for (const img of formData.serviceImages) {
      if (img?.file) fd.append('images', img.file);
    }
    if (formData.serviceVideo?.file) {
      fd.append('video', formData.serviceVideo.file);
    }
    return fd;
  };

  const submit = async () => {
    if (!isLoggedIn) {
      push('Please log in to continue.', { type: 'info' });
      return;
    }
    if (!validateForm()) {
      push('Please correct the highlighted errors.', { type: 'error' });
      return;
    }
    const fd = buildFormData();
    try {
      if (isEdit) {
        await updateMutation.mutateAsync({ serviceId, payload: fd });
      } else {
        await createMutation.mutateAsync(fd);
      }
    } catch {
      /* handled upstream */
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return {
    isEdit,
    isLoadingInit: isEdit && isLoadingService,
    formData,
    setFormData,
    validationErrors,
    setValidationErrors,
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
  };
}