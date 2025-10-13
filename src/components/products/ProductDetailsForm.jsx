// src/components/products/ProductDetailsForm.jsx

import React from 'react';
import { TagIcon, ChevronDownIcon, BuildingStorefrontIcon, DocumentTextIcon, XMarkIcon, MapPinIcon, TruckIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Input from '../ui/Input';
import Button from '../ui/Button';

const ProductDetailsForm = ({
    formData,
    handleChange,
    validationErrors,
    isSubmitting,
    isEdit,
    brandColor,
    contrastColor,
    selectedCategoryName, // This prop displays the chosen category name
    setShowCategorySelectModal,
    setShowBrandSelectModal,
    setShowFullDescriptionModal,
    renderFullDescriptionSummary,
    setShowAddVariantModal,
    handleRemoveVariant,
    setShowAvailabilityLocationsModal,
    setShowDeliveryLocationsModal,
    handlePostProduct,
}) => {

    const handleInformationTagChange = (e, index) => {
        const { value } = e.target;
        const newTags = [...formData.informationTags];
        newTags[index] = value;
        handleChange({ target: { name: 'informationTags', value: newTags } });
    };

    const handleWholesalePriceChange = (e, index, field) => {
        const { value } = e.target;
        const newWholesalePrices = [...formData.wholesalePrice];
        newWholesalePrices[index][field] = value;
        handleChange({ target: { name: 'wholesalePrice', value: newWholesalePrices } });
    };

    const handleAddWholesalePrice = () => {
        handleChange({
            target: {
                name: 'wholesalePrice',
                value: [...formData.wholesalePrice, { quantity: '', price: '' }],
            },
        });
    };

    const handleRemoveWholesalePrice = (index) => {
        const newWholesalePrices = formData.wholesalePrice.filter((_, i) => i !== index);
        handleChange({ target: { name: 'wholesalePrice', value: newWholesalePrices } });
    };

    return (
        <div className="p-6 rounded-2xl space-y-8">
            {/* General Details Section */}
            <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800">Product Details</h3>
                <Input type="text" name="productName" placeholder="Product Name" value={formData.productName} onChange={handleChange} className="h-14 rounded-xl" error={validationErrors.productName} />
                
                {/* Category Selector */}
                <div className="relative">
                    <div className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer h-14 ${validationErrors.category ? 'border-red-500' : 'border-gray-300'}`} onClick={() => setShowCategorySelectModal(true)}>
                        <div className="flex items-center gap-2"><TagIcon className="h-5 w-5 text-gray-400" /><span className="text-gray-700 font-medium">{selectedCategoryName}</span></div>
                        <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                    </div>
                    {validationErrors.category && <p className="text-xs mt-1 text-red-500">{validationErrors.category}</p>}
                </div>

                {/* Brand Selector */}
                <div className="relative">
                    <div className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer h-14 ${validationErrors.brand ? 'border-red-500' : 'border-gray-300'}`} onClick={() => setShowBrandSelectModal(true)}>
                        <div className="flex items-center gap-2"><BuildingStorefrontIcon className="h-5 w-5 text-gray-400" /><span className="text-gray-700 font-medium">{formData.brand || 'Brand'}</span></div>
                        <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                    </div>
                    {validationErrors.brand && <p className="text-xs mt-1 text-red-500">{validationErrors.brand}</p>}
                </div>

                <Input type="text" name="shortDescription" placeholder="Short description" value={formData.shortDescription} onChange={handleChange} className="h-14 rounded-xl" error={validationErrors.shortDescription} />
                <div className="relative">
                    <div className="flex items-center justify-between p-4 rounded-xl border cursor-pointer h-14" onClick={() => setShowFullDescriptionModal(true)}>
                        <div className="flex items-center gap-2"><DocumentTextIcon className="h-5 w-5 text-gray-400" /><span className="text-gray-700 font-medium truncate">{renderFullDescriptionSummary()}</span></div>
                        <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                    </div>
                </div>

                <Input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} className="h-14 rounded-xl" error={validationErrors.price} />
                <Input type="number" name="discountPrice" placeholder="Discount Price (Optional)" value={formData.discountPrice} onChange={handleChange} className="h-14 rounded-xl" />
            </div>

            {/* Wholesale Pricing Section */}
            <div className="space-y-4">
                {formData.wholesalePrice.length === 0 ? <p className="text-red-500 underline cursor-pointer font-medium" onClick={handleAddWholesalePrice}>Add Wholesale price</p> : 
                    <>
                        {formData.wholesalePrice.map((tier, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <Input type="number" placeholder="Min. Quantity" value={tier.quantity} onChange={(e) => handleWholesalePriceChange(e, index, 'quantity')} className="flex-1 h-14 rounded-xl" />
                                <Input type="number" placeholder="Price" value={tier.price} onChange={(e) => handleWholesalePriceChange(e, index, 'price')} className="flex-1 h-14 rounded-xl" />
                                <button type="button" onClick={() => handleRemoveWholesalePrice(index)}><XMarkIcon className="h-6 w-6 text-gray-500" /></button>
                            </div>
                        ))}
                        <p className="text-red-500 underline cursor-pointer font-medium" onClick={handleAddWholesalePrice}>Add another tier</p>
                    </>
                }
            </div>

            {/* Variants Section */}
            <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800">Add Variants</h3>
                <div className="flex items-center justify-between p-4 rounded-xl border cursor-pointer h-14" onClick={() => setShowAddVariantModal(true)}>
                    <span className="text-gray-700 font-medium">Add New Variant</span><ChevronRightIcon className="h-5 w-5 text-gray-400" />
                </div>
                {formData.variants.map((variant, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border">
                        <span className="text-sm font-medium">{variant.name}: {variant.options.join(', ')}</span>
                        <button type="button" onClick={() => handleRemoveVariant(index)}><XMarkIcon className="h-5 w-5 text-gray-500" /></button>
                    </div>
                ))}
            </div>

            {/* Locations Section */}
            <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800">Availability & Delivery</h3>
                <div className="space-y-2">
                    <p className="text-sm text-gray-500">Select where your product is available.</p>
                    <div className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer h-14`} onClick={() => setShowAvailabilityLocationsModal(true)}>
                        <div className="flex items-center gap-2"><MapPinIcon className="h-5 w-5 text-gray-400" />
                            <span className="text-gray-700 font-medium">
                                {formData.availabilityLocations.length > 0 ? `Selected (${formData.availabilityLocations.length})` : 'Select Availability Locations'}
                            </span>
                        </div>
                        <ChevronRightIcon className="h-4 w-4 text-gray-400" />
                    </div>
                </div>
                <div className="space-y-2">
                    <p className="text-sm text-gray-500">Select where you can deliver.</p>
                    <div className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer h-14`} onClick={() => setShowDeliveryLocationsModal(true)}>
                        <div className="flex items-center gap-2"><TruckIcon className="h-5 w-5 text-gray-400" />
                            <span className="text-gray-700 font-medium">
                                {formData.deliveryLocations.length > 0 ? `Selected (${formData.deliveryLocations.length})` : 'Select Delivery Locations'}
                            </span>
                        </div>
                        <ChevronRightIcon className="h-4 w-4 text-gray-400" />
                    </div>
                </div>
            </div>

            <Button onClick={handlePostProduct} className="w-full py-3 rounded-lg font-semibold" style={{ backgroundColor: brandColor, color: contrastColor }} disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : (isEdit ? 'Update Product' : 'Post Product')}
            </Button>
        </div>
    );
};

export default ProductDetailsForm;