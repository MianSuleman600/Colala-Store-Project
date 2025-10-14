// src/hooks/Products/useProductForm.js

import { useEffect, useState, useRef } from 'react';
import { useToast } from '../../components/ui/ToastProvider';
import { useSelector } from 'react-redux';
import {
  useAddProductMutation,
  useUpdateProductMutation,
  useCreateVariantMutation,
  useUpdateVariantMutation,
  useDeleteVariantMutation,
  useUpdateBulkPricesMutation,
  useUpdateDeliveryOptionsMutation
} from '../../services/mutations/useProductMutation';

const isVideoUrl = (url = '') => {
  if (typeof url !== 'string') return false;
  const base = url.split('?')[0];
  return /^data:video\//i.test(url) || /^blob:/i.test(url) || /\.(mp4|webm|ogg|mov|m4v)$/i.test(base);
};

const initialFormData = {
  productImages: [],
  productVideo: null,
  productName: '',
  category: '',
  brand: '',
  shortDescription: '',
  fullDescription: {
    mobileType: '', mobileBrand: '', model: '', storage: '', resolution: '',
    color: '', display: '', screenSize: '', battery: '', camera: '', generalDescription: '',
  },
  price: '',
  discountPrice: '',
  has_variants: false,
  wholesalePrice: [],
  variants: [],
  couponCode: '',
  useLoyaltyPoints: false,
  informationTags: ['', '', ''],
  availabilityLocations: [],
  deliveryLocations: [],
};

export function useProductForm({ product, isEdit }) {
  const { userId } = useSelector((s) => s.auth);
  const { push } = useToast();

  const { mutateAsync: addProduct, isLoading: isAdding } = useAddProductMutation({ userId });
  const { mutateAsync: updateProduct, isLoading: isUpdating } = useUpdateProductMutation({ userId });
  const { mutateAsync: createVariant } = useCreateVariantMutation();
  const { mutateAsync: updateVariant } = useUpdateVariantMutation();
  const { mutateAsync: deleteVariant } = useDeleteVariantMutation();
  const { mutateAsync: updateBulkPrices } = useUpdateBulkPricesMutation();
  const { mutateAsync: updateDeliveryOptions } = useUpdateDeliveryOptionsMutation();

  const isSubmitting = isAdding || isUpdating;

  const [formData, setFormData] = useState(initialFormData);
  const [validationErrors, setValidationErrors] = useState({});
  const createdUrls = useRef([]);

  useEffect(() => () => { createdUrls.current.forEach(URL.revokeObjectURL); }, []);

  useEffect(() => {
    if (isEdit && product) {
      const dp = product.detailsPageInfo || {};
      const thumbs = (dp.thumbnailUrls || []).filter(u => u && !isVideoUrl(u));
      const main = (dp.mainImageUrl && !isVideoUrl(dp.mainImageUrl)) ? [dp.mainImageUrl] : [];
      const imageUrls = Array.from(new Set([...main, ...thumbs]));

      // Ensure wholesalePrice elements have required keys even if empty
      const sanitizedWholesalePrice = (product.wholesalePrice || []).map(priceItem => ({
        min_quantity: priceItem.min_quantity ?? '',
        price: priceItem.price ?? '',
        ...priceItem,
      }));

      setFormData({
        ...initialFormData,
        ...product,
        productImages: imageUrls.map(u => ({ fileObject: null, fileUrl: u })),
        productVideo: dp.productVideo ? { fileObject: null, fileUrl: dp.productVideo } : null,
        productName: product.name || '',
        category: product.category_id || product.category || '',
        shortDescription: product.shortDescription || '',
        fullDescription: { ...initialFormData.fullDescription, ...product.fullDescription, generalDescription: dp.description || '' },
        price: product.currentPrice ?? '',
        has_variants: !!product.has_variants,
        wholesalePrice: sanitizedWholesalePrice, // Use sanitized data
        variants: product.variants || [],
        deliveryLocations: product.deliveryLocations || [],
        availabilityLocations: product.availabilityLocations || [],
      });
    } else if (!isEdit) {
      setFormData(initialFormData);
    }
  }, [isEdit, product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValidationErrors(prev => ({ ...prev, [name]: undefined }));
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (!files || files.length === 0) return;
    if (name === 'productVideo') {
      const file = files[0];
      const fileUrl = URL.createObjectURL(file);
      createdUrls.current.push(fileUrl);
      setFormData((prev) => ({ ...prev, productVideo: { fileObject: file, fileUrl } }));
    } else if (name === 'productImages') {
      const newImages = Array.from(files).map((file) => {
        const fileUrl = URL.createObjectURL(file);
        createdUrls.current.push(fileUrl);
        return { fileObject: file, fileUrl };
      });
      setFormData((prev) => ({ ...prev, productImages: [...prev.productImages, ...newImages] }));
    }
  };

  const handleRemoveImage = (index) => setFormData((prev) => ({ ...prev, productImages: prev.productImages.filter((_, i) => i !== index) }));
  const handleRemoveVideo = () => setFormData((prev) => ({ ...prev, productVideo: null }));
  const handleToggleLocation = (location, type) => {
    setFormData((prev) => {
      const current = prev[type] || [];
      const newLocations = current.includes(location) ? current.filter((loc) => loc !== location) : [...current, location];
      return { ...prev, [type]: newLocations };
    });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.productName.trim()) errors.productName = "Product name is required.";
    if (!formData.category) errors.category = "Category is required.";
    if (!formData.price || Number(formData.price) <= 0) errors.price = "A valid price is required.";
    if (!formData.productImages || formData.productImages.length === 0) errors.productImages = "At least one image is required.";
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const submit = async ({ onSuccessNavigateTo }) => {
    if (!validateForm()) {
      push('Please fix the errors before submitting.', { type: 'error' });
      return;
    }

    try {
      const corePayload = new FormData();
      corePayload.append('name', formData.productName);
      corePayload.append('category_id', formData.category);
      corePayload.append('brand', formData.brand);
      corePayload.append('short_description', formData.shortDescription);
      corePayload.append('price', formData.price);
      if (formData.discountPrice) corePayload.append('discount_price', formData.discountPrice);
      corePayload.append('has_variants', formData.has_variants ? '1' : '0');

      // Filter the array to only include NEW images that have a file object.
      const newImageFiles = formData.productImages.filter(img => img.fileObject);

      // Loop over this *filtered* array to ensure the indexes are contiguous (0, 1, 2...).
      newImageFiles.forEach((img, index) => {
        corePayload.append(`images[${index}]`, img.fileObject);
      });

      if (formData.productVideo?.fileObject) corePayload.append('video', formData.productVideo.fileObject);

      const result = isEdit
        ? await updateProduct({ id: product.id, payload: corePayload })
        : await addProduct(corePayload);

      const savedProduct = result.data;
      const productId = savedProduct?.id;
      if (!productId) throw new Error("Failed to get a valid Product ID after saving.");

      const subTasks = [];
      if (formData.has_variants) {
        const originalVariants = product?.variants || [];
        const currentVariants = formData.variants || [];

        originalVariants.forEach(ov => { if (!currentVariants.some(cv => cv.id === ov.id)) subTasks.push(deleteVariant({ productId, variantId: ov.id })) });
        currentVariants.forEach(cv => {
          const p = { name: cv.name, options: cv.options };
          if (cv.id) subTasks.push(updateVariant({ productId, variantId: cv.id, payload: p }));
          else subTasks.push(createVariant({ productId, payload: p }));
        });
      }

      // ✅ FIX: Validate and filter wholesalePrice to ensure required fields are present and valid
      const validWholesalePrices = (formData.wholesalePrice || []).filter(item => {
        const minQuantity = Number(item.min_quantity);
        const price = Number(item.price);
        return !isNaN(minQuantity) && minQuantity > 0 && !isNaN(price) && price > 0;
      });

      if (validWholesalePrices.length > 0) {
        // The API likely expects the payload to be under a 'prices' key in the body, 
        // as per the error: 'The prices.0.min_quantity field is required.'
        const bulkPricePayload = { prices: validWholesalePrices };
        subTasks.push(updateBulkPrices({ productId, payload: bulkPricePayload }));
      }
      // ❌ Original line removed: if (formData.wholesalePrice?.length > 0) subTasks.push(updateBulkPrices({ productId, payload: formData.wholesalePrice }));

      if (formData.deliveryLocations?.length > 0) subTasks.push(updateDeliveryOptions({ productId, payload: formData.deliveryLocations }));

      await Promise.all(subTasks);

      push('Product saved successfully!', { type: 'success' });
      if (onSuccessNavigateTo) onSuccessNavigateTo();

    } catch (error) {
      console.error("Full product save failed:", error);
      // Check for the specific 422 error response structure
      const apiErrorMessage = error.response?.data?.errors?.prices?.[0] ||
        error.response?.data?.message ||
        error.message ||
        'An error occurred while saving.';
      push(apiErrorMessage, { type: 'error' });
    }
  };

  return { formData, setFormData, validationErrors, isSubmitting, handleChange, handleFileChange, handleRemoveImage, handleRemoveVideo, handleToggleLocation, submit };
}