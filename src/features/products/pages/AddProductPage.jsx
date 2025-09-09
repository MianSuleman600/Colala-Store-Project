// src/pages/products/AddProductPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Correct for navigation
import { useDispatch, useSelector } from 'react-redux'; // ✅ Correct for Redux

import FullDescriptionModal from '../../../components/products/FullDescriptionModal.jsx';
import ProductMediaUpload from '../../../components/products/ProductMediaUpload.jsx';
import ProductDetailsForm from '../../../components/products/ProductDetailsForm.jsx';
import BulkUploadSection from '../../../components/products/BulkUploadSection.jsx';
import Modal from '../../../components/ui/Modal.jsx';
import Button from '../../../components/ui/Button';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { getContrastTextColor } from '../../../utils/colorUtils';
import { useDummyData } from './data/useDummyData.js';

const AddProductPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Fetch data from useDummyData hook
  const { categories, brands, locations, mobileTypes, mobileBrands } = useDummyData();

  const [formData, setFormData] = useState({
    productImages: [],
    productVideo: null,
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
      generalDescription: ''
    },
    price: '',
    discountPrice: '',
    wholesalePrice: [],
    variants: [],
    couponCode: '',
    useLoyaltyPoints: false,
    informationTags: ['', '', ''],
    availabilityLocations: [],
    deliveryLocations: []
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [showCategorySelectModal, setShowCategorySelectModal] = useState(false);
  const [showBrandSelectModal, setShowBrandSelectModal] = useState(false);
  const [showAddVariantModal, setShowAddVariantModal] = useState(false);
  const [showAvailabilityLocationsModal, setShowAvailabilityLocationsModal] = useState(false);
  const [showDeliveryLocationsModal, setShowDeliveryLocationsModal] = useState(false);
  const [showFullDescriptionModal, setShowFullDescriptionModal] = useState(false);

  const [currentVariantName, setCurrentVariantName] = useState('');
  const [currentVariantOptions, setCurrentVariantOptions] = useState('');
  const [tempFullDescription, setTempFullDescription] = useState(formData.fullDescription);

  const brandColor = '#EF4444';
  const contrastColor = getContrastTextColor(brandColor);
  const brandBgStyle = { backgroundColor: brandColor };
  const contrastTextStyle = { color: contrastColor };

  useEffect(() => {
    setTempFullDescription(formData.fullDescription);
  }, [formData.fullDescription]);

  // ---------- Handlers ----------
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setValidationErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleFullDescriptionChange = (e) => {
    const { name, value } = e.target;
    setTempFullDescription(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveFullDescription = () => {
    setFormData(prev => ({ ...prev, fullDescription: tempFullDescription }));
    setShowFullDescriptionModal(false);
    setValidationErrors(prev => ({ ...prev, fullDescription: '' }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === 'productImages') {
      const newImages = Array.from(files).map(file => ({
        fileObject: file,
        fileUrl: URL.createObjectURL(file)
      }));
      setFormData(prev => ({
        ...prev,
        productImages: [...prev.productImages, ...newImages].slice(0, 3)
      }));
    } else if (name === 'productVideo' && files && files[0]) {
      const file = files[0];
      setFormData(prev => ({
        ...prev,
        productVideo: { fileObject: file, fileUrl: URL.createObjectURL(file) }
      }));
    }
    setValidationErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      productImages: prev.productImages.filter((_, i) => i !== index)
    }));
  };

  const handleRemoveVideo = () => {
    setFormData(prev => ({ ...prev, productVideo: null }));
  };

  const handleCategorySelect = (category) => {
    setFormData(prev => ({ ...prev, category }));
    setShowCategorySelectModal(false);
    setValidationErrors(prev => ({ ...prev, category: '' }));
  };

  const handleBrandSelect = (brand) => {
    setFormData(prev => ({ ...prev, brand }));
    setShowBrandSelectModal(false);
    setValidationErrors(prev => ({ ...prev, brand: '' }));
  };

  const handleAddVariant = () => {
    if (!currentVariantName.trim()) return console.error('Variant name cannot be empty.');
    const optionsArray = currentVariantOptions.split(',').map(opt => opt.trim()).filter(opt => opt !== '');
    if (optionsArray.length === 0) return console.error('Enter at least one option.');
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, { name: currentVariantName.trim(), options: optionsArray }]
    }));
    setCurrentVariantName('');
    setCurrentVariantOptions('');
    setShowAddVariantModal(false);
  };

  const handleRemoveVariant = (index) => {
    setFormData(prev => ({ ...prev, variants: prev.variants.filter((_, i) => i !== index) }));
  };

  const handleToggleLocation = (location, type) => {
    setFormData(prev => {
      const currentLocations = prev[type];
      const updatedLocations = currentLocations.includes(location)
        ? currentLocations.filter(loc => loc !== location)
        : [...currentLocations, location];
      return { ...prev, [type]: updatedLocations };
    });
  };

  const validateForm = () => {
    const errors = {};
    if (formData.productImages.length < 3) errors.productImages = 'Upload at least 3 images.';
    if (!formData.productName.trim()) errors.productName = 'Product Name required.';
    if (!formData.category) errors.category = 'Category required.';
    if (!formData.brand) errors.brand = 'Brand required.';
    if (!formData.shortDescription.trim()) errors.shortDescription = 'Short description required.';
    if (!formData.fullDescription.model.trim() || !formData.fullDescription.mobileType.trim()) {
      errors.fullDescription = 'Full description details required.';
    }
    if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) <= 0) errors.price = 'Valid price required.';
    if (formData.discountPrice && (isNaN(formData.discountPrice) || parseFloat(formData.discountPrice) < 0 || parseFloat(formData.discountPrice) >= parseFloat(formData.price))) {
      errors.discountPrice = 'Discount must be less than price.';
    }
    if (formData.availabilityLocations.length === 0) errors.availabilityLocations = 'Select at least one availability location.';
    if (formData.deliveryLocations.length === 0) errors.deliveryLocations = 'Select at least one delivery location.';
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePostProduct = async () => {
    if (!validateForm()) return console.error('Fix errors before submitting.');
    console.log('Submitting product:', formData);
    alert('Product submitted (simulated)');
  };

  const handleBulkUpload = async () => {
    console.log('Bulk upload initiated (simulated)');
  };

  const renderFullDescriptionSummary = () => {
    const desc = formData.fullDescription;
    const parts = [];
    if (desc.mobileType) parts.push(`Type: ${desc.mobileType}`);
    if (desc.mobileBrand) parts.push(`Brand: ${desc.mobileBrand}`);
    if (desc.model) parts.push(`Model: ${desc.model}`);
    if (desc.storage) parts.push(`Storage: ${desc.storage}`);
    if (desc.resolution) parts.push(`Resolution: ${desc.resolution}`);
    if (desc.color) parts.push(`Color: ${desc.color}`);
    if (desc.screenSize) parts.push(`Screen Size: ${desc.screenSize}`);
    if (desc.battery) parts.push(`Battery: ${desc.battery}`);
    if (desc.camera) parts.push(`Camera: ${desc.camera}`);
    if (desc.generalDescription) parts.push(`Details: ${desc.generalDescription}`);
    return parts.length > 0 ? parts.join(' | ') : 'No detailed description added.';
  };

  // ---------- JSX ----------
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4 lg:p-8">
      <div className="relative flex w-full max-w-[1200px] bg-white rounded-2xl shadow-xl overflow-hidden p-8">
        <div className="flex flex-col md:flex-row w-full gap-8">
          <div className="flex-1 flex flex-col space-y-6 text-left">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Add Product</h1>
            <ProductMediaUpload
              productImages={formData.productImages}
              productVideo={formData.productVideo}
              handleFileChange={handleFileChange}
              handleRemoveImage={handleRemoveImage}
              handleRemoveVideo={handleRemoveVideo}
              validationErrors={validationErrors}
            />
          </div>

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
              renderFullDescriptionSummary={renderFullDescriptionSummary}
              handlePostProduct={handlePostProduct}
            />
            <BulkUploadSection handleBulkUpload={handleBulkUpload} brandColor={brandColor} />
          </div>
        </div>

        {/* ---------- Modals ---------- */}
        <Modal isOpen={showCategorySelectModal} onClose={() => setShowCategorySelectModal(false)} title="Select Category">
          <div className="space-y-2">
            {categories.map(cat => (
              <div key={cat} className="p-3 rounded-lg border cursor-pointer hover:bg-gray-50" onClick={() => handleCategorySelect(cat)}>{cat}</div>
            ))}
          </div>
        </Modal>

        <Modal isOpen={showBrandSelectModal} onClose={() => setShowBrandSelectModal(false)} title="Select Brand">
          <div className="space-y-2">
            {brands.map(brand => (
              <div key={brand} className="p-3 rounded-lg border cursor-pointer hover:bg-gray-50" onClick={() => handleBrandSelect(brand)}>{brand}</div>
            ))}
          </div>
        </Modal>

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
            <Button onClick={handleAddVariant} className="w-full py-3 px-4 rounded-lg font-semibold" style={brandBgStyle}>
              <span style={contrastTextStyle}>Add Variant</span>
            </Button>
          </div>
        </Modal>

        <Modal isOpen={showAvailabilityLocationsModal} onClose={() => setShowAvailabilityLocationsModal(false)} title="Select Availability Locations">
          <div className="space-y-2">
            {locations.map(loc => (
              <div key={loc} className="flex items-center justify-between p-3 rounded-lg border cursor-pointer hover:bg-gray-50" onClick={() => handleToggleLocation(loc, 'availabilityLocations')}>
                <span>{loc}</span>
                {formData.availabilityLocations.includes(loc) && <CheckCircleIcon className="h-5 w-5 text-green-500" />}
              </div>
            ))}
          </div>
          <Button onClick={() => setShowAvailabilityLocationsModal(false)} className="w-full py-3 px-4 rounded-lg font-semibold mt-4" style={brandBgStyle}><span style={contrastTextStyle}>Done</span></Button>
        </Modal>

        <Modal isOpen={showDeliveryLocationsModal} onClose={() => setShowDeliveryLocationsModal(false)} title="Select Delivery Locations">
          <div className="space-y-2">
            {locations.map(loc => (
              <div key={loc} className="flex items-center justify-between p-3 rounded-lg border cursor-pointer hover:bg-gray-50" onClick={() => handleToggleLocation(loc, 'deliveryLocations')}>
                <span>{loc}</span>
                {formData.deliveryLocations.includes(loc) && <CheckCircleIcon className="h-5 w-5 text-green-500" />}
              </div>
            ))}
          </div>
          <Button onClick={() => setShowDeliveryLocationsModal(false)} className="w-full py-3 px-4 rounded-lg font-semibold mt-4" style={brandBgStyle}><span style={contrastTextStyle}>Done</span></Button>
        </Modal>

        <FullDescriptionModal
          isOpen={showFullDescriptionModal}
          onClose={() => setShowFullDescriptionModal(false)}
          tempFullDescription={tempFullDescription}
          handleFullDescriptionChange={handleFullDescriptionChange}
          handleSaveFullDescription={handleSaveFullDescription}
          mobileTypes={mobileTypes}        // fetched from useDummyData
          mobileBrands={mobileBrands}      // fetched from useDummyData
        />
      </div>
    </div>
  );
};

export default AddProductPage;
