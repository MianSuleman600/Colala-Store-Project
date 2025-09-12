// src/features/products/hooks/useProductForm.js
import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { getContrastTextColor } from '../../utils/colorUtils';
import { useAddProduct, useUpdateProduct } from '../../services/mutations/useProductMutation';
import { useToast } from '../../components/ui/ToastProvider';
import { useSelector } from 'react-redux';

const isVideoUrl = (url = '') => {
  if (typeof url !== 'string') return false;
  const base = url.split('?')[0];
  return /^data:video\//i.test(url) || /^blob:/i.test(url) || /\.(mp4|webm|ogg|mov|m4v)$/i.test(base);
};

export function useProductForm({ product, isEdit }) {
  const { userId } = useSelector((s) => s.user);
  const { push } = useToast();

  const addMutation = useAddProduct(userId);
  const updateMutation = useUpdateProduct(userId);

  const [formData, setFormData] = useState({
    productImages: [],       // [{ fileObject, fileUrl }]
    productVideo: null,      // { fileObject, fileUrl } | null
    productName: '',
    category: '',
    brand: '',
    shortDescription: '',
    fullDescription: {
      mobileType: '',
      mobileBrand: '',
      model: '',
      storage: '',
      resolution: '',
      color: '',
      display: '',
      screenSize: '',
      battery: '',
      camera: '',
      generalDescription: '',
    },
    price: '',
    discountPrice: '',
    wholesalePrice: [],
    variants: [],
    couponCode: '',
    useLoyaltyPoints: false,
    informationTags: ['', '', ''],
    availabilityLocations: [],
    deliveryLocations: [],
  });

  const [validationErrors, setValidationErrors] = useState({});

  // Track created object URLs to revoke on unmount
  const createdUrls = useRef([]);

  useEffect(() => {
    return () => {
      createdUrls.current.forEach((u) => {
        try {
          URL.revokeObjectURL(u);
        } catch {}
      });
      createdUrls.current = [];
    };
  }, []);

  // Prefill in edit mode
  useEffect(() => {
    if (!isEdit || !product) return;
    const dp = product.detailsPageInfo || {};

    const thumbs = Array.isArray(dp.thumbnailUrls) ? dp.thumbnailUrls.filter((u) => !isVideoUrl(u)) : [];
    const main = dp.mainImageUrl && !isVideoUrl(dp.mainImageUrl) ? [dp.mainImageUrl] : [];
    const imageUrls = Array.from(new Set([...main, ...thumbs]));

    const images = imageUrls.map((u) => ({ fileObject: null, fileUrl: u }));
    const pVideo = dp.productVideo ? { fileObject: null, fileUrl: dp.productVideo } : null;

    setFormData((prev) => ({
      ...prev,
      productImages: images,
      productVideo: pVideo,
      productName: product.name || '',
      category: product.category || '',
      brand: product.brand || '',
      shortDescription: product.shortDescription || '',
      fullDescription: {
        ...prev.fullDescription,
        generalDescription: dp.description || '',
      },
      price: product.currentPrice ?? '',
      discountPrice: product.discountPrice ?? '',
    }));
  }, [isEdit, product]);

  // Handlers
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target || {};
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setValidationErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target || {};
    if (name === 'productImages' && files && files.length) {
      const newImages = Array.from(files).map((file) => {
        const url = URL.createObjectURL(file);
        createdUrls.current.push(url);
        return { fileObject: file, fileUrl: url };
      });
      setFormData((prev) => ({
        ...prev,
        productImages: [...prev.productImages, ...newImages].slice(0, 5),
      }));
      setValidationErrors((prev) => ({ ...prev, productImages: '' }));
    } else if (name === 'productVideo' && files && files[0]) {
      const f = files[0];
      const url = URL.createObjectURL(f);
      createdUrls.current.push(url);
      setFormData((prev) => ({ ...prev, productVideo: { fileObject: f, fileUrl: url } }));
      setValidationErrors((prev) => ({ ...prev, productVideo: '' }));
    }
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      productImages: prev.productImages.filter((_, i) => i !== index),
    }));
  };

  const handleRemoveVideo = () => {
    setFormData((prev) => ({ ...prev, productVideo: null }));
  };

  const handleToggleLocation = (location, type) => {
    setFormData((prev) => {
      const current = prev[type] || [];
      const updated = current.includes(location) ? current.filter((l) => l !== location) : [...current, location];
      return { ...prev, [type]: updated };
    });
  };

  const setValidation = (name, msg) => {
    setValidationErrors((prev) => ({ ...prev, [name]: msg }));
  };

  const validateForm = () => {
    const errors = {};
    const minImages = isEdit ? 1 : 3;
    if ((formData.productImages || []).length < minImages) {
      errors.productImages = `Upload at least ${minImages} image${minImages > 1 ? 's' : ''}.`;
    }
    if (!formData.productName?.trim()) errors.productName = 'Product Name required.';
    if (!formData.category) errors.category = 'Category required.';
    if (!formData.brand) errors.brand = 'Brand required.';
    if (!formData.shortDescription?.trim()) errors.shortDescription = 'Short description required.';
    if (!formData.fullDescription?.generalDescription?.trim()) {
      errors.fullDescription = 'Full description details required.';
    }
    if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0) {
      errors.price = 'Valid price required.';
    }
    if (
      formData.discountPrice &&
      (isNaN(formData.discountPrice) ||
        Number(formData.discountPrice) < 0 ||
        Number(formData.discountPrice) >= Number(formData.price))
    ) {
      errors.discountPrice = 'Discount must be less than price.';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const buildPayload = () => {
    const images = formData.productImages.map((m) => m.fileUrl).filter(Boolean);
    return {
      name: formData.productName,
      category: formData.category,
      brand: formData.brand,
      shortDescription: formData.shortDescription,
      currentPrice: Number(formData.price),
      discountPrice: formData.discountPrice ? Number(formData.discountPrice) : undefined,
      detailsPageInfo: {
        description: formData.fullDescription.generalDescription || '',
        mainImageUrl: images[0] || '',
        thumbnailUrls: images.slice(1),
        productVideo: formData.productVideo?.fileUrl || null,
      },
    };
  };

  const submit = async ({ onSuccessNavigateTo }) => {
    if (!validateForm()) {
      push('Please fix the errors before submitting.', { type: 'error' });
      return;
    }
    const payload = buildPayload();

    try {
      if (isEdit) {
        await updateMutation.mutateAsync({ id: product?.id, payload });
        push('Product updated successfully.', { type: 'success' });
        if (onSuccessNavigateTo) onSuccessNavigateTo();
      } else {
        await addMutation.mutateAsync(payload);
        push('Product added successfully.', { type: 'success' });
        if (onSuccessNavigateTo) onSuccessNavigateTo();
      }
    } catch (e) {
      push(e?.message || 'Failed to submit product.', { type: 'error' });
    }
  };

  return {
    formData,
    setFormData,
    validationErrors,
    setValidation,
    handleChange,
    handleFileChange,
    handleRemoveImage,
    handleRemoveVideo,
    handleToggleLocation,
    submit,
  };
}