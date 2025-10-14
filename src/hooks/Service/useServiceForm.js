import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useCreateService, useUpdateService } from '../../services/mutations/useServicesMutation';
import { useService } from '../../services/queries/useServiceQuery';
import { useToast } from '../../components/ui/ToastProvider';
import { ASSETS_BASE } from '../../api/apiConfig';

export const MEDIA = {
  MAX_IMAGES: 5,
  MAX_TOTAL_MEDIA: 5,
  MAX_IMAGE_MB: 5,
  MAX_VIDEO_MB: 5,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/quicktime', 'video/mov'],
};

const asNumber = (val) => {
  if (val == null || val === '') return null;
  const cleaned = String(val).replace(/[^\d.]/g, '');
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
};

const emptyForm = {
  serviceName: '',
  serviceCategory: null,
  shortDescription: '',
  fullDescription: '',
  priceRangeFrom: '',
  priceRangeTo: '',
  discountPrice: '',
  serviceImages: [],
  serviceVideo: null,
  subServices: [],
};

export function useServiceForm({ serviceId, serviceFromState, onSuccess, onError } = {}) {
  const isEdit = Boolean(serviceId);
  const { push } = useToast();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const { data: serviceFromApi, isLoading: isLoadingService } = useService(serviceId, { 
    enabled: isEdit && !serviceFromState 
  });

  const service = serviceFromState || serviceFromApi;

  const [formData, setFormData] = useState(emptyForm);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (!isEdit || !service) return;
    const imgs = (service.media || []).filter(item => item.type === 'image').map((item) => ({ file: null, fileUrl: `${ASSETS_BASE}/storage/${item.path}`, existing: true }));
    const videoPath = service.video || (service.media || []).find(item => item.type === 'video')?.path;
    setFormData({
      serviceName: service.name || '',
      serviceCategory: service.category ? { id: service.category_id, name: service.category.title } : null,
      shortDescription: service.short_description || '',
      fullDescription: service.full_description || '',
      priceRangeFrom: service.price_from ? String(service.price_from) : '',
      priceRangeTo: service.price_to ? String(service.price_to) : '',
      discountPrice: service.discount_price ? String(service.discount_price) : '',
      serviceImages: imgs,
      serviceVideo: videoPath ? { file: null, fileUrl: `${ASSETS_BASE}/storage/${videoPath}`, existing: true } : null,
      subServices: (service.sub_services || []).map(s => ({ name: s.name, price_from: s.price_from, price_to: s.price_to })),
    });
  }, [isEdit, service]);

  // ✅ FIX: The hook's internal onSuccess now passes the full response data to the parent component's onSuccess function.
  const createMutation = useCreateService({ onSuccess: (response) => onSuccess?.(response, { mode: 'create' }), onError });
  const updateMutation = useUpdateService({ onSuccess: (response) => onSuccess?.(response, { mode: 'edit' }), onError });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setValidationErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleServiceCategorySelect = (category) => {
    setFormData((prev) => ({ ...prev, serviceCategory: category }));
    setValidationErrors((prev) => ({ ...prev, serviceCategory: '' }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (!files || !files.length) return;
    setFormData(currentState => {
      const currentMediaCount = currentState.serviceImages.length + (currentState.serviceVideo ? 1 : 0);
      if (name === 'serviceImages') {
        const availableSlots = MEDIA.MAX_TOTAL_MEDIA - currentMediaCount;
        if (availableSlots <= 0) {
          push(`You can upload a maximum of ${MEDIA.MAX_TOTAL_MEDIA} media files.`, { type: 'info' });
          return currentState;
        }
        const validFiles = Array.from(files).map(file => {
          if (file.size > MEDIA.MAX_IMAGE_MB * 1024 * 1024) {
            push(`Image "${file.name}" is too large (Max ${MEDIA.MAX_IMAGE_MB}MB).`, { type: 'error' });
            return null;
          }
          if (!MEDIA.ALLOWED_IMAGE_TYPES.includes(file.type)) {
            push(`Image "${file.name}" has an invalid type.`, { type: 'error' });
            return null;
          }
          return { file, fileUrl: URL.createObjectURL(file) };
        }).filter(Boolean);

        const filesToAdd = validFiles.slice(0, availableSlots);
        if (validFiles.length > filesToAdd.length) {
          push(`Only ${filesToAdd.length} images were added to stay within the limit.`, { type: 'warning' });
        }
        return { ...currentState, serviceImages: [...currentState.serviceImages, ...filesToAdd] };
      }
      if (name === 'serviceVideo') {
         if (currentMediaCount >= MEDIA.MAX_TOTAL_MEDIA) {
            push(`You have reached the maximum of ${MEDIA.MAX_TOTAL_MEDIA} media files.`, { type: 'info' });
            return currentState;
        }
        const file = files[0];
        if (file.size > MEDIA.MAX_VIDEO_MB * 1024 * 1024) {
          push(`Video is too large (Max ${MEDIA.MAX_VIDEO_MB}MB).`, { type: 'error' });
          return currentState;
        }
        if (!MEDIA.ALLOWED_VIDEO_TYPES.includes(file.type)) {
          push(`Video has an invalid file type.`, { type: 'error' });
          return currentState;
        }
        return { ...currentState, serviceVideo: { file, fileUrl: URL.createObjectURL(file) } };
      }
      return currentState;
    });
  };

  const handleRemoveImage = (index) => setFormData((prev) => ({ ...prev, serviceImages: prev.serviceImages.filter((_, i) => i !== index) }));
  const handleRemoveVideo = () => setFormData((prev) => ({ ...prev, serviceVideo: null }));
  const addSubService = (name) => setFormData((prev) => ({ ...prev, subServices: [...prev.subServices, { name, price_from: '', price_to: '' }] }));
  const removeSubService = (index) => setFormData((prev) => ({ ...prev, subServices: prev.subServices.filter((_, i) => i !== index) }));

  const validateForm = () => {
    const errors = {};
    if (!formData.serviceName.trim()) errors.serviceName = 'Service Name is required.';
    if (!formData.serviceCategory?.id) errors.serviceCategory = 'Category is required.';
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const buildPayload = () => {
    const fd = new FormData();
    fd.append('name', formData.serviceName);
    fd.append('category_id', formData.serviceCategory?.id || '');
    fd.append('short_description', formData.shortDescription);
    fd.append('full_description', formData.fullDescription);
    if (asNumber(formData.priceRangeFrom) !== null) fd.append('price_from', asNumber(formData.priceRangeFrom));
    if (asNumber(formData.priceRangeTo) !== null) fd.append('price_to', asNumber(formData.priceRangeTo));
    if (asNumber(formData.discountPrice) !== null) fd.append('discount_price', asNumber(formData.discountPrice));
    
    formData.serviceImages.filter(img => img.file).forEach(img => {
      fd.append('media[]', img.file);
    });

    if (formData.serviceVideo?.file) {
      fd.append('video', formData.serviceVideo.file);
    }
    
    formData.subServices.forEach((sub, index) => {
      fd.append(`sub_services[${index}][name]`, sub.name);
      fd.append(`sub_services[${index}][price_from]`, sub.price_from || '');
      fd.append(`sub_services[${index}][price_to]`, sub.price_to || '');
    });
    
    return fd;
  };

  const submit = async () => {
    if (!isAuthenticated) {
      push('Please log in to continue.', { type: 'info' });
      return;
    }
    if (!validateForm()) {
      push('Please correct the highlighted errors.', { type: 'error' });
      return;
    }
    
    const payload = buildPayload();
    
    try {
        if (isEdit) {
          payload.append('_method', 'POST'); 
          await updateMutation.mutateAsync({ serviceId, payload });
        } else {
          await createMutation.mutateAsync(payload);
        }
    } catch (error) {
        let userMessage = 'An unexpected error occurred. Please try again.';
        if (error.statusCode === 422 && error.data) {
            userMessage = error.data.message || 'Please check your input.';
            if (error.data.data) {
                const firstErrorKey = Object.keys(error.data.data)[0];
                const firstErrorMessage = error.data.data[firstErrorKey][0];
                if (firstErrorMessage) { userMessage = firstErrorMessage; }
            }
        } else if (error.message) { userMessage = error.message; }
        push(userMessage, { type: 'error' });
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return {
    isEdit,
    isLoadingInit: isEdit && isLoadingService && !serviceFromState,
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
  };
}