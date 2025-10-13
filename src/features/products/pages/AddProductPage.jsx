// src/pages/products/AddProductPage.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useProductDetailsQuery } from '../../../services/queries/useproductsQuery';
import { 
  useCategoriesQuery, 
  useBrandsQuery, 
  useLocationsQuery,
  useDeliveryLocationsQuery,
  useMobileSpecsQuery,
} from '../../../services/queries/useCatalogQueries.js';
import { useProductForm } from '../../../hooks/Products/useProductForm.js';
import { getContrastTextColor } from '../../../utils/colorUtils';

// Component Imports
import Modal from '../../../components/ui/Modal.jsx';
import Button from '../../../components/ui/Button';
import ProductMediaUpload from '../../../components/products/ProductMediaUpload.jsx';
import ProductDetailsForm from '../../../components/products/ProductDetailsForm.jsx';
import BulkUploadSection from '../../../components/products/BulkUploadSection.jsx';
import FullDescriptionModal from '../../../components/products/FullDescriptionModal.jsx';

const AddProductPage = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const isEdit = Boolean(productId);
  const { user } = useSelector((state) => state.auth);
  const userId = user?.id;

  const { data: product, isLoading: loadingProduct } = useProductDetailsQuery(productId, { enabled: isEdit });
  const { data: categories = [], isLoading: categoriesLoading } = useCategoriesQuery();
  const { data: brands = [], isLoading: brandsLoading } = useBrandsQuery();
  const { data: availabilityLocations = [], isLoading: availabilityLoading } = useLocationsQuery(userId);
  const { data: deliveryLocations = [], isLoading: deliveryLoading } = useDeliveryLocationsQuery(userId);
  const { data: mobileSpecs = {} } = useMobileSpecsQuery();
  const { mobileTypes = [], mobileBrands = [] } = mobileSpecs;

  const brandColor = '#EF4444';
  const contrastColor = getContrastTextColor(brandColor);

  const {
    formData,
    setFormData,
    validationErrors,
    isSubmitting,
    handleChange,
    handleFileChange,
    handleRemoveImage,
    handleRemoveVideo,
    handleToggleLocation,
    submit,
  } = useProductForm({ product, isEdit });

  const [showCategorySelectModal, setShowCategorySelectModal] = useState(false);
  const [showBrandSelectModal, setShowBrandSelectModal] = useState(false);
  const [showAddVariantModal, setShowAddVariantModal] = useState(false);
  const [showAvailabilityLocationsModal, setShowAvailabilityLocationsModal] = useState(false);
  const [showDeliveryLocationsModal, setShowDeliveryLocationsModal] = useState(false);
  const [showFullDescriptionModal, setShowFullDescriptionModal] = useState(false);
  const [currentVariantName, setCurrentVariantName] = useState('');
  const [currentVariantOptions, setCurrentVariantOptions] = useState('');
  const [tempFullDescription, setTempFullDescription] = useState(formData.fullDescription);
  
  useEffect(() => {
    setTempFullDescription(formData.fullDescription);
  }, [formData.fullDescription]);

  const handleCategorySelect = (category) => { handleChange({ target: { name: 'category', value: category.id } }); setShowCategorySelectModal(false); };
  const handleBrandSelect = (brand) => { handleChange({ target: { name: 'brand', value: brand.name } }); setShowBrandSelectModal(false); };
  const handleAddVariant = () => { if (!currentVariantName.trim()) return; const optionsArray = currentVariantOptions.split(',').map((o) => o.trim()).filter(Boolean); if (!optionsArray.length) return; setFormData((prev) => ({ ...prev, variants: [...prev.variants, { name: currentVariantName.trim(), options: optionsArray }], })); setCurrentVariantName(''); setCurrentVariantOptions(''); setShowAddVariantModal(false); };
  const handleRemoveVariant = (index) => setFormData((prev) => ({ ...prev, variants: prev.variants.filter((_, i) => i !== index) }));
  const handleSaveFullDescription = () => { setFormData((prev) => ({ ...prev, fullDescription: tempFullDescription })); setShowFullDescriptionModal(false); };
  const handleSubmit = () => submit({ onSuccessNavigateTo: () => { if (isEdit) navigate(`/my-products/${productId}/details`); else navigate('/my-products'); }, });

  if (isEdit && loadingProduct) {
    return <div className="min-h-screen flex items-center justify-center">Loading product...</div>;
  }
  
  const selectedCategoryName = categories.find(c => c.id === formData.category)?.title || 'Category';

  const renderLocationModalContent = (type, locationList, isLoading) => (
    <div className="p-4">
      {isLoading ? <p>Loading locations...</p> : 
       locationList.length === 0 ? <p className="text-gray-500">No locations found. Please add them in your store setup first.</p> : 
       <ul className="space-y-2">{locationList.map((loc) => (<li key={loc} className="p-2 flex items-center justify-between rounded-lg hover:bg-gray-100"><span>{loc}</span><input type="checkbox" checked={formData[type].includes(loc)} onChange={() => handleToggleLocation(loc, type)} className="h-5 w-5 rounded text-blue-600 focus:ring-blue-500"/></li>))}</ul>
      }
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 w-full flex justify-center p-4 sm:p-8">
      <div className="relative flex w-full max-w-7xl bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="flex flex-col md:flex-row w-full gap-8 p-4 lg:p-2">
          <div className="flex-1 flex flex-col space-y-6">
            <h1 className="text-3xl font-bold text-gray-800 p-4">{isEdit ? 'Edit Product' : 'Add Product'}</h1>
            <ProductMediaUpload productImages={formData.productImages} productVideo={formData.productVideo} handleFileChange={handleFileChange} handleRemoveImage={handleRemoveImage} handleRemoveVideo={handleRemoveVideo} validationErrors={validationErrors} />
          </div>
          <div className="flex-1 flex flex-col space-y-6 overflow-y-auto" style={{ maxHeight: '90vh' }}>
            <ProductDetailsForm
              formData={formData} handleChange={handleChange} validationErrors={validationErrors} brandColor={brandColor} contrastColor={contrastColor} isSubmitting={isSubmitting} isEdit={isEdit}
              setShowCategorySelectModal={setShowCategorySelectModal} setShowBrandSelectModal={setShowBrandSelectModal} setShowAddVariantModal={setShowAddVariantModal} setShowAvailabilityLocationsModal={setShowAvailabilityLocationsModal} setShowDeliveryLocationsModal={setShowDeliveryLocationsModal} setShowFullDescriptionModal={setShowFullDescriptionModal}
              handleRemoveVariant={handleRemoveVariant} selectedCategoryName={selectedCategoryName} renderFullDescriptionSummary={() => "Click to add/edit detailed specifications"} handlePostProduct={handleSubmit}
            />
            {!isEdit && <BulkUploadSection brandColor={brandColor} />}
          </div>
        </div>

        {/* Modals */}
        <Modal isOpen={showCategorySelectModal} onClose={() => setShowCategorySelectModal(false)} title="Select Category">
          <div className="p-4">{categoriesLoading ? <p>Loading...</p> : <ul className="space-y-2">{categories.map((cat) => <li key={cat.id} onClick={() => handleCategorySelect(cat)} className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer flex items-center gap-3"><img src={cat.image_url} alt={cat.title} className="w-8 h-8 rounded-md object-cover" /><span>{cat.title}</span></li>)}</ul>}</div>
        </Modal>
        <Modal isOpen={showBrandSelectModal} onClose={() => setShowBrandSelectModal(false)} title="Select Brand">
          <div className="p-4">{brandsLoading ? <p>Loading...</p> : <ul className="space-y-2">{brands.map((brand) => <li key={brand.id} onClick={() => handleBrandSelect(brand)} className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer">{brand.name}</li>)}</ul>}</div>
        </Modal>
        <Modal isOpen={showAddVariantModal} onClose={() => setShowAddVariantModal(false)} title="Add New Variant">
          <div className="p-6 space-y-4">
            <input type="text" placeholder="Variant Name (e.g., Color)" value={currentVariantName} onChange={(e) => setCurrentVariantName(e.target.value)} className="w-full rounded-lg border-gray-300"/>
            <input type="text" placeholder="Options, comma separated (e.g., Red, Blue)" value={currentVariantOptions} onChange={(e) => setCurrentVariantOptions(e.target.value)} className="w-full rounded-lg border-gray-300"/>
            <Button onClick={handleAddVariant} className="w-full" style={{backgroundColor: brandColor, color: contrastColor}}>Add Variant</Button>
          </div>
        </Modal>
        <Modal isOpen={showAvailabilityLocationsModal} onClose={() => setShowAvailabilityLocationsModal(false)} title="Select Availability Locations">{renderLocationModalContent('availabilityLocations', availabilityLocations, availabilityLoading)}</Modal>
        <Modal isOpen={showDeliveryLocationsModal} onClose={() => setShowDeliveryLocationsModal(false)} title="Select Delivery Locations">{renderLocationModalContent('deliveryLocations', deliveryLocations, deliveryLoading)}</Modal>
        <FullDescriptionModal isOpen={showFullDescriptionModal} onClose={() => setShowFullDescriptionModal(false)} tempFullDescription={tempFullDescription} handleFullDescriptionChange={(e) => setTempFullDescription(p => ({ ...p, [e.target.name]: e.target.value }))} handleSaveFullDescription={handleSaveFullDescription} mobileTypes={mobileTypes} mobileBrands={mobileBrands} />
      </div>
    </div>
  );
};

export default AddProductPage;