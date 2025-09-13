// src/pages/products/AddProductPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProductDetailsQuery } from '../../../services/queries/useproductsQuery';
import { useDummyData } from './data/useDummyData.js';
import { useProductForm } from '../../../hooks/Products/useProductForm.js';
import { getContrastTextColor } from '../../../utils/colorUtils';
import Modal from '../../../components/ui/Modal.jsx';
import Button from '../../../components/ui/Button';
import ProductMediaUpload from '../../../components/products/ProductMediaUpload.jsx';
import ProductDetailsForm from '../../../components/products/ProductDetailsForm.jsx';
import BulkUploadSection from '../../../components/products/BulkUploadSection.jsx';
import FullDescriptionModal from '../../../components/products/FullDescriptionModal.jsx';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

const AddProductPage = () => {
  const navigate = useNavigate();
  const { productId } = useParams(); // edit mode if present
  const isEdit = Boolean(productId);

  // Load product if editing
  const { data: product, isLoading: loadingProduct } = useProductDetailsQuery(productId, { enabled: isEdit });

  // Dummy lookup lists (replace with real queries when available)
  const { categories, brands, locations, mobileTypes, mobileBrands } = useDummyData();

  // Theme
  const brandColor = '#EF4444';
  const contrastColor = getContrastTextColor(brandColor);

  // Form hook
  const {
    formData,
    validationErrors,
    handleChange,
    handleFileChange,
    handleRemoveImage,
    handleRemoveVideo,
    handleToggleLocation,
    submit,
    setFormData,
  } = useProductForm({ product, isEdit });

  // Modals state
  const [showCategorySelectModal, setShowCategorySelectModal] = useState(false);
  const [showBrandSelectModal, setShowBrandSelectModal] = useState(false);
  const [showAddVariantModal, setShowAddVariantModal] = useState(false);
  const [showAvailabilityLocationsModal, setShowAvailabilityLocationsModal] = useState(false);
  const [showDeliveryLocationsModal, setShowDeliveryLocationsModal] = useState(false);
  const [showFullDescriptionModal, setShowFullDescriptionModal] = useState(false);

  // Variants temp
  const [currentVariantName, setCurrentVariantName] = useState('');
  const [currentVariantOptions, setCurrentVariantOptions] = useState('');

  // Full Description temp (lives in modal)
  const [tempFullDescription, setTempFullDescription] = useState(formData.fullDescription);
  useEffect(() => setTempFullDescription(formData.fullDescription), [formData.fullDescription]);

  const handleCategorySelect = (category) => {
    handleChange({ target: { name: 'category', value: category } });
    setShowCategorySelectModal(false);
  };
  const handleBrandSelect = (brand) => {
    handleChange({ target: { name: 'brand', value: brand } });
    setShowBrandSelectModal(false);
  };

  const handleAddVariant = () => {
    if (!currentVariantName.trim()) return;
    const optionsArray = currentVariantOptions.split(',').map((o) => o.trim()).filter(Boolean);
    if (!optionsArray.length) return;
    setFormData((prev) => ({
      ...prev,
      variants: [...prev.variants, { name: currentVariantName.trim(), options: optionsArray }],
    }));
    setCurrentVariantName('');
    setCurrentVariantOptions('');
    setShowAddVariantModal(false);
  };
  const handleRemoveVariant = (index) =>
    setFormData((prev) => ({ ...prev, variants: prev.variants.filter((_, i) => i !== index) }));

  const handleSaveFullDescription = () => {
    setFormData((prev) => ({ ...prev, fullDescription: tempFullDescription }));
    setShowFullDescriptionModal(false);
  };

  const handleSubmit = () =>
    submit({
      onSuccessNavigateTo: () => {
        if (isEdit) navigate(`/my-products/${productId}/details`);
        else navigate('/my-products');
      },
    });

  if (isEdit && loadingProduct) {
    return <div className="min-h-screen flex items-center justify-center">Loading product...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 w-full flex justify-center items-center p-8">
      <div className="relative flex w-full  bg-white rounded-2xl shadow-xl overflow-hidden lg:p-2">
        <div className="flex flex-col md:flex-row w-full gap-8">
          {/* Left: Media */}
          <div className="flex-1 flex flex-col space-y-6 text-left">
            <h1 className="text-3xl font-bold p-4 text-gray-800 mb-4">{isEdit ? 'Edit Product' : 'Add Product'}</h1>
            <ProductMediaUpload
              productImages={formData.productImages}
              productVideo={formData.productVideo}
              handleFileChange={handleFileChange}
              handleRemoveImage={handleRemoveImage}
              handleRemoveVideo={handleRemoveVideo}
              validationErrors={validationErrors}
            />
          </div>

          {/* Right: Details */}
          <div className="flex-1 flex flex-col space-y-6 text-left">
            <ProductDetailsForm
              formData={formData}
              handleChange={handleChange}
              validationErrors={validationErrors}
              brandColor={brandColor}
              contrastColor={contrastColor}
              setShowCategorySelectModal={setShowCategorySelectModal}
              setShowBrandSelectModal={setShowBrandSelectModal}
              setShowAddVariantModal={setShowAddVariantModal}
              setShowAvailabilityLocationsModal={setShowAvailabilityLocationsModal}
              setShowDeliveryLocationsModal={setShowDeliveryLocationsModal}
              setShowFullDescriptionModal={setShowFullDescriptionModal}
              handleRemoveVariant={handleRemoveVariant}
              renderFullDescriptionSummary={() => {
                const d = formData.fullDescription;
                const parts = [];
                if (d.mobileType) parts.push(`Type: ${d.mobileType}`);
                if (d.mobileBrand) parts.push(`Brand: ${d.mobileBrand}`);
                if (d.model) parts.push(`Model: ${d.model}`);
                if (d.storage) parts.push(`Storage: ${d.storage}`);
                if (d.resolution) parts.push(`Resolution: ${d.resolution}`);
                if (d.color) parts.push(`Color: ${d.color}`);
                if (d.screenSize) parts.push(`Screen Size: ${d.screenSize}`);
                if (d.battery) parts.push(`Battery: ${d.battery}`);
                if (d.camera) parts.push(`Camera: ${d.camera}`);
                if (d.generalDescription) parts.push(`Details: ${d.generalDescription}`);
                return parts.length ? parts.join(' | ') : 'No detailed description added.';
              }}
              handlePostProduct={handleSubmit}
              isEdit={isEdit}
            />

            {!isEdit && <BulkUploadSection handleBulkUpload={() => {}} brandColor={brandColor} />}
          </div>
        </div>

        {/* Category Modal */}
        <Modal isOpen={showCategorySelectModal} onClose={() => setShowCategorySelectModal(false)} title="Select Category">
          <div className="space-y-2">
            {categories.map((cat) => (
              <div key={cat} className="p-3 rounded-lg border cursor-pointer hover:bg-gray-50" onClick={() => handleCategorySelect(cat)}>
                {cat}
              </div>
            ))}
          </div>
        </Modal>

        {/* Brand Modal */}
        <Modal isOpen={showBrandSelectModal} onClose={() => setShowBrandSelectModal(false)} title="Select Brand">
          <div className="space-y-2">
            {brands.map((brand) => (
              <div key={brand} className="p-3 rounded-lg border cursor-pointer hover:bg-gray-50" onClick={() => handleBrandSelect(brand)}>
                {brand}
              </div>
            ))}
          </div>
        </Modal>

        {/* Variant Modal */}
        <Modal isOpen={showAddVariantModal} onClose={() => setShowAddVariantModal(false)} title="Add New Variant" className="max-w-md p-2">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Variant Name (e.g., Color, Size)"
              value={currentVariantName}
              onChange={(e) => setCurrentVariantName(e.target.value)}
              className="h-[60px] rounded-[15px] border border-gray-300 w-full p-4"
            />
            <input
              type="text"
              placeholder="Options (comma-separated, e.g., Red, Blue)"
              value={currentVariantOptions}
              onChange={(e) => setCurrentVariantOptions(e.target.value)}
              className="h-[60px] rounded-[15px] border border-gray-300 w-full p-4"
            />
            <Button onClick={handleAddVariant} className="w-full py-3 px-4 rounded-lg font-semibold" style={{ backgroundColor: brandColor, color: contrastColor }}>
              Add Variant
            </Button>
          </div>
        </Modal>

        {/* Availability Locations */}
        <Modal isOpen={showAvailabilityLocationsModal} onClose={() => setShowAvailabilityLocationsModal(false)} title="Select Availability Locations">
          <div className="space-y-2">
            {locations.map((loc) => (
              <div
                key={loc}
                className="flex items-center justify-between p-3 rounded-lg border cursor-pointer hover:bg-gray-50"
                onClick={() => handleToggleLocation(loc, 'availabilityLocations')}
              >
                <span>{loc}</span>
                {formData.availabilityLocations.includes(loc) && <CheckCircleIcon className="h-5 w-5 text-green-500" />}
              </div>
            ))}
          </div>
          <Button onClick={() => setShowAvailabilityLocationsModal(false)} className="w-full py-3 px-4 rounded-lg font-semibold mt-4" style={{ backgroundColor: brandColor, color: contrastColor }}>
            Done
          </Button>
        </Modal>

        {/* Delivery Locations */}
        <Modal isOpen={showDeliveryLocationsModal} onClose={() => setShowDeliveryLocationsModal(false)} title="Select Delivery Locations">
          <div className="space-y-2">
            {locations.map((loc) => (
              <div
                key={loc}
                className="flex items-center justify-between p-3 rounded-lg border cursor-pointer hover:bg-gray-50"
                onClick={() => handleToggleLocation(loc, 'deliveryLocations')}
              >
                <span>{loc}</span>
                {formData.deliveryLocations.includes(loc) && <CheckCircleIcon className="h-5 w-5 text-green-500" />}
              </div>
            ))}
          </div>
          <Button onClick={() => setShowDeliveryLocationsModal(false)} className="w-full py-3 px-4 rounded-lg font-semibold mt-4" style={{ backgroundColor: brandColor, color: contrastColor }}>
            Done
          </Button>
        </Modal>

        {/* Full Description */}
        <FullDescriptionModal
          isOpen={showFullDescriptionModal}
          onClose={() => setShowFullDescriptionModal(false)}
          tempFullDescription={tempFullDescription}
          handleFullDescriptionChange={(e) => {
            const { name, value } = e.target;
            setTempFullDescription((prev) => ({ ...prev, [name]: value }));
          }}
          handleSaveFullDescription={handleSaveFullDescription}
          mobileTypes={mobileTypes}
          mobileBrands={mobileBrands}
        />
      </div>
    </div>
  );
};

export default AddProductPage;