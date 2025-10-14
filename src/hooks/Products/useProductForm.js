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
import { ASSETS_BASE } from '../../api/apiConfig';

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
  const { user } = useSelector((s) => s.auth);
  const userId = user?.id;
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
    // --- DEBUGGING LINE ---
    console.log('[DEBUG useProductForm] Received RAW product data for form population:', product);

    if (isEdit && product) {
      // ✅ FIX: Use 'path' from the images array to build the full URL.
      const imageUrls = (product.images || []).map(img => {
        const url = img.path;
        if (!url) return null;
        const fullUrl = url.startsWith('http') ? url : `${ASSETS_BASE}/storage/${url}`;
        return { fileObject: null, fileUrl: fullUrl };
      }).filter(Boolean);

      // ✅ FIX: The video is a string path. Build the full URL.
      const videoUrl = product.video;
      const fullVideoUrl = videoUrl
        ? videoUrl.startsWith('http') ? videoUrl : `${ASSETS_BASE}/storage/${videoUrl}`
        : null;
      
      const populatedData = {
        ...initialFormData,
        ...product,
        productImages: imageUrls,
        productVideo: fullVideoUrl ? { fileObject: null, fileUrl: fullVideoUrl } : null,
        productName: product.name || '',
        // ✅ FIX: Set the category_id from the RAW object.
        category: product.category_id || '',
        brand: product.brand || '',
        shortDescription: product.description || '',
        price: product.price ?? '',
        discountPrice: product.discount_price ?? '',
        has_variants: !!product.has_variants,
        wholesalePrice: (product.wholesale_prices || []).map(p => ({ ...p, min_quantity: p.min_quantity ?? '', price: p.price ?? '' })),
        variants: product.variants || [],
      };

      // --- DEBUGGING LINE ---
      console.log('[DEBUG useProductForm] Populating form with this data:', populatedData);
      setFormData(populatedData);
      
    } else if (!isEdit) {
      setFormData(initialFormData);
    }
  }, [isEdit, product]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValidationErrors(prev => ({ ...prev, [name]: undefined }));
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
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

      formData.productImages.forEach((img, index) => {
        if (img.fileObject) {
          corePayload.append(`images[${index}]`, img.fileObject);
        } else if (img.fileUrl && isEdit) {
          const relativeUrl = img.fileUrl.replace(`${ASSETS_BASE}/storage/`, '');
          corePayload.append(`existing_images[${index}]`, relativeUrl);
        }
      });
      
      if (formData.productVideo?.fileObject) {
        corePayload.append('video', formData.productVideo.fileObject);
      } else if (formData.productVideo?.fileUrl && isEdit) {
        const relativeUrl = formData.productVideo.fileUrl.replace(`${ASSETS_BASE}/storage/`, '');
        corePayload.append('existing_video', relativeUrl);
      }

      const result = isEdit
        ? await updateProduct({ id: product.id, payload: corePayload })
        : await addProduct(corePayload);

      const savedProduct = result.data;
      const productId = savedProduct?.id;
      if (!productId) throw new Error("Failed to get a valid Product ID after saving.");

      const subTasks = [];
      const validWholesalePrices = (formData.wholesalePrice || []).filter(item => Number(item.min_quantity) > 0 && Number(item.price) > 0);
      if (validWholesalePrices.length > 0) {
        subTasks.push(updateBulkPrices({ productId, payload: { prices: validWholesalePrices } }));
      }
      
      await Promise.all(subTasks);

      push('Product saved successfully!', { type: 'success' });
      if (onSuccessNavigateTo) onSuccessNavigateTo();

    } catch (error) {
       console.error("Full product save failed:", error);
       const apiErrorMessage = error.response?.data?.message || error.message || 'An error occurred while saving.';
       push(apiErrorMessage, { type: 'error' });
    }
  };

  return { formData, setFormData, validationErrors, isSubmitting, handleChange, handleFileChange, handleRemoveImage, handleRemoveVideo, handleToggleLocation, submit };
}