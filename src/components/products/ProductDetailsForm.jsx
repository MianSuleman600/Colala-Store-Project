import React from 'react';
import { TagIcon, ChevronDownIcon, BuildingStorefrontIcon, DocumentTextIcon, XMarkIcon, MapPinIcon, TruckIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Input from '../ui/Input';
import Button from '../ui/Button';

// Define a custom brand color using a CSS variable for Tailwind
const brandColor = '#EF4444';
const contrastColor = '#FFFFFF';

const ProductDetailsForm = ({
    formData,
    handleChange,
    validationErrors,
    setShowCategorySelectModal,
    setShowBrandSelectModal,
    setShowFullDescriptionModal,
    renderFullDescriptionSummary,
    setShowAddVariantModal,
    handleRemoveVariant,
    setShowAvailabilityLocationsModal,
    handleToggleLocation,
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
        handleChange({
            target: {
                name: 'wholesalePrice',
                value: newWholesalePrices,
            },
        });
    };

    return (
        <div className="p-6 rounded-2xl space-y-8">
            {/* General Details Section */}
            <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800">Product Details</h3>
                <Input
                    type="text"
                    name="productName"
                    placeholder="Product Name"
                    value={formData.productName}
                    onChange={handleChange}
                    className="h-14 rounded-xl"
                    error={validationErrors.productName}
                />
                <div className="relative">
                    <div
                        className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer h-14 transition-colors hover:border-blue-500 ${validationErrors.category ? 'border-red-500' : 'border-gray-300'}`}
                        onClick={() => setShowCategorySelectModal(true)}
                    >
                        <div className="flex items-center gap-2">
                            <TagIcon className="h-5 w-5 text-gray-400" />
                            <span className="text-gray-700 font-medium">
                                {formData.category || 'Category'}
                            </span>
                        </div>
                        <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                    </div>
                    {validationErrors.category && <p className="text-xs mt-1 text-red-500">{validationErrors.category}</p>}
                </div>

                <div className="relative">
                    <div
                        className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer h-14 transition-colors hover:border-blue-500 ${validationErrors.brand ? 'border-red-500' : 'border-gray-300'}`}
                        onClick={() => setShowBrandSelectModal(true)}
                    >
                        <div className="flex items-center gap-2">
                            <BuildingStorefrontIcon className="h-5 w-5 text-gray-400" />
                            <span className="text-gray-700 font-medium">
                                {formData.brand || 'Brand'}
                            </span>
                        </div>
                        <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                    </div>
                    {validationErrors.brand && <p className="text-xs mt-1 text-red-500">{validationErrors.brand}</p>}
                </div>

                <Input
                    type="text"
                    name="shortDescription"
                    placeholder="Short description"
                    value={formData.shortDescription}
                    onChange={handleChange}
                    className="h-14 rounded-xl"
                    error={validationErrors.shortDescription}
                />

                <div className="relative">
                    <div
                        className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer h-14 transition-colors hover:border-blue-500 ${validationErrors.fullDescription ? 'border-red-500' : 'border-gray-300'}`}
                        onClick={() => setShowFullDescriptionModal(true)}
                    >
                        <div className="flex items-center gap-2">
                            <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                            <span className="text-gray-700 font-medium overflow-hidden whitespace-nowrap text-ellipsis">
                                {renderFullDescriptionSummary()}
                            </span>
                        </div>
                        <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                    </div>
                    {validationErrors.fullDescription && <p className="text-xs mt-1 text-red-500">{validationErrors.fullDescription}</p>}
                </div>

                <Input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={formData.price}
                    onChange={handleChange}
                    className="h-14 rounded-xl"
                    error={validationErrors.price}
                />
                <Input
                    type="number"
                    name="discountPrice"
                    placeholder="Discount Price (Optional)"
                    value={formData.discountPrice}
                    onChange={handleChange}
                    className="h-14 rounded-xl"
                    error={validationErrors.discountPrice}
                />
            </div>

            {/* Wholesale Pricing Section */}
            <div className="space-y-4">
                
                {formData.wholesalePrice.length === 0 ? (
                    <p
                        className="text-red-500 underline cursor-pointer font-medium hover:text-red-600 transition-colors"
                        onClick={handleAddWholesalePrice}
                    >
                        Add Wholesale price
                    </p>
                ) : (
                    <>
                        {formData.wholesalePrice.map((tier, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <Input
                                    type="number"
                                    name={`wholesale-quantity-${index}`}
                                    placeholder="Min. Quantity"
                                    value={tier.quantity}
                                    onChange={(e) => handleWholesalePriceChange(e, index, 'quantity')}
                                    className="flex-1 h-14 rounded-xl"
                                />
                                <Input
                                    type="number"
                                    name={`wholesale-price-${index}`}
                                    placeholder="Price"
                                    value={tier.price}
                                    onChange={(e) => handleWholesalePriceChange(e, index, 'price')}
                                    className="flex-1 h-14 rounded-xl"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveWholesalePrice(index)}
                                    className="text-gray-500 hover:text-red-500 transition-colors"
                                >
                                    <XMarkIcon className="h-6 w-6" />
                                </button>
                            </div>
                        ))}
                        <p
                            className="text-red-500 underline cursor-pointer font-medium hover:text-red-600 transition-colors"
                            onClick={handleAddWholesalePrice}
                        >
                            Add another tier
                        </p>
                    </>
                )}
            </div>

           

            {/* Variants Section */}
            <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800">Add Variants</h3>
                <p className="text-sm text-gray-500">Variants include colors and sizes.</p>
                <div
                    className="flex items-center justify-between p-4 rounded-xl border cursor-pointer h-14 transition-colors hover:border-blue-500"
                    onClick={() => setShowAddVariantModal(true)}
                >
                    <div className="flex items-center gap-2">
                        <span className="text-gray-700 font-medium">Add New Variant</span>
                    </div>
                    <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                </div>
                {formData.variants.map((variant, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-white border border-gray-200">
                        <span className="text-sm font-medium text-gray-800">{variant.name}: {variant.options.join(', ')}</span>
                        <button
                            type="button"
                            onClick={() => handleRemoveVariant(index)}
                            className="text-gray-500 hover:text-red-500 transition-colors"
                        >
                            <XMarkIcon className="h-5 w-5" />
                        </button>
                    </div>
                ))}
            </div>

             {/* Promotions Section */}
            <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800">Promotions</h3>
                <p className="text-sm text-gray-500">Promote your product via coupon codes.</p>
                <div className="relative">
                    <Input
                        type="text"
                        name="couponCode"
                        placeholder="Coupon code to be used"
                        value={formData.couponCode}
                        onChange={handleChange}
                        className="h-14 rounded-xl pr-12"
                    />
                    <ChevronRightIcon className="h-5 w-5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2" />
                </div>
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="useLoyaltyPoints"
                        name="useLoyaltyPoints"
                        checked={formData.useLoyaltyPoints}
                        onChange={handleChange}
                        className="h-5 w-5 rounded text-blue-600 focus:ring-blue-500"
                        style={{ backgroundColor: brandColor }}
                    />
                    <label htmlFor="useLoyaltyPoints" className="text-gray-700 font-medium">
                        Buyers can use loyalty points during purchase
                    </label>
                </div>
            </div>

            {/* Other Details Section */}
            <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800">Other Details</h3>
                <p className="text-sm text-gray-500">Add any additional information or tags.</p>
                {formData.informationTags.map((tag, index) => (
                    <Input
                        key={index}
                        type="text"
                        name={`informationTags-${index}`}
                        placeholder={`Information tag ${index + 1} (optional)`}
                        value={tag}
                        onChange={(e) => handleInformationTagChange(e, index)}
                        className="h-14 rounded-xl"
                    />
                ))}
            </div>

            {/* Locations Section */}
            <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800">Availability & Delivery</h3>
                {/* Availability Locations */}
                <div className="space-y-2">
                    <p className="text-sm text-gray-500">Select where your product is available.</p>
                    <div
                        className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer h-14 transition-colors hover:border-blue-500 ${validationErrors.availabilityLocations ? 'border-red-500' : 'border-gray-300'}`}
                        onClick={() => setShowAvailabilityLocationsModal(true)}
                    >
                        <div className="flex items-center gap-2">
                            <MapPinIcon className="h-5 w-5 text-gray-400" />
                            <span className="text-gray-700 font-medium">
                                {formData.availabilityLocations.length > 0
                                    ? `Selected (${formData.availabilityLocations.length})`
                                    : 'Select Availability Locations'}
                            </span>
                        </div>
                        <ChevronRightIcon className="h-4 w-4 text-gray-400" />
                    </div>
                    {validationErrors.availabilityLocations && <p className="text-xs mt-1 text-red-500">{validationErrors.availabilityLocations}</p>}
                    <div className="flex flex-wrap gap-2 mt-2">
                        {formData.availabilityLocations.map(loc => (
                            <span key={loc} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                                {loc}
                                <button type="button" onClick={() => handleToggleLocation(loc, 'availabilityLocations')} className="ml-2 text-blue-600 hover:text-blue-800">
                                    <XMarkIcon className="h-4 w-4" />
                                </button>
                            </span>
                        ))}
                    </div>
                </div>

                {/* Delivery Locations */}
                <div className="space-y-2">
                    <p className="text-sm text-gray-500">Select where you can deliver.</p>
                    <div
                        className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer h-14 transition-colors hover:border-blue-500 ${validationErrors.deliveryLocations ? 'border-red-500' : 'border-gray-300'}`}
                        onClick={() => setShowDeliveryLocationsModal(true)}
                    >
                        <div className="flex items-center gap-2">
                            <TruckIcon className="h-5 w-5 text-gray-400" />
                            <span className="text-gray-700 font-medium">
                                {formData.deliveryLocations.length > 0
                                    ? `Selected (${formData.deliveryLocations.length})`
                                    : 'Select Delivery Locations'}
                            </span>
                        </div>
                        <ChevronRightIcon className="h-4 w-4 text-gray-400" />
                    </div>
                    {validationErrors.deliveryLocations && <p className="text-xs mt-1 text-red-500">{validationErrors.deliveryLocations}</p>}
                    <div className="flex flex-wrap gap-2 mt-2">
                        {formData.deliveryLocations.map(loc => (
                            <span key={loc} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                                {loc}
                                <button type="button" onClick={() => handleToggleLocation(loc, 'deliveryLocations')} className="ml-2 text-blue-600 hover:text-blue-800">
                                    <XMarkIcon className="h-4 w-4" />
                                </button>
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Post Product Button */}
            <Button
                onClick={handlePostProduct}
                className="w-full py-3 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                style={{ backgroundColor: brandColor, color: contrastColor }}
            >
                Post Product
            </Button>
        </div>
    );
};

export default ProductDetailsForm;
