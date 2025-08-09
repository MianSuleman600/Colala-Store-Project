// src/pages/products/AddProductPage.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'; // Assuming Redux for user/auth state
import { useNavigate } from 'react-router-dom';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal.jsx'; // Assuming a generic Modal component

// Icons
import {
    CameraIcon, TagIcon, BuildingStorefrontIcon, MapPinIcon,
    XMarkIcon, ChevronDownIcon, PlusCircleIcon, TruckIcon,
    GiftIcon, CheckCircleIcon, ArrowDownTrayIcon, ArrowUpTrayIcon,
    DocumentTextIcon // New icon for description
} from '@heroicons/react/24/outline';
import { getContrastTextColor } from '../../../utils/colorUtils'; // Assuming you have this helper

// Placeholder for RTK Query Product API
// You'll need to define your productApi service (e.g., in services/productApi.js)
// For now, these are just placeholders to show how it would be used.
// import { useAddProductMutation, useBulkUploadProductsMutation } from '../../services/productApi';

const dummyCategories = ['Electronics', 'Apparel', 'Books', 'Home & Kitchen', 'Sports', 'Beauty'];
const dummyBrands = ['Brand A', 'Brand B', 'Brand C', 'Generic'];
const dummyLocations = ['Lagos', 'Abuja', 'Port Harcourt', 'Ibadan']; // For availability/delivery

// Dummy data for the description modal's dropdowns
const dummyMobileTypes = ['Smartphones', 'Feature Phones', 'Tablets'];
const dummyMobileBrands = ['Apple', 'Samsung', 'Google', 'Xiaomi', 'Oppo'];

const AddProductPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    // const { userId, isLoggedIn } = useSelector((state) => state.user); // Assuming user state from Redux

    // Placeholder RTK Query hooks
    // const [addProduct, { isLoading: isAddingProduct, isSuccess: addProductSuccess, error: addProductError }] = useAddProductMutation();
    // const [bulkUploadProducts, { isLoading: isBulkUploading, isSuccess: bulkUploadProductsSuccess, error: bulkUploadProductsError }] = useBulkUploadProductsMutation();

    const [formData, setFormData] = useState({
        productImages: [], // Array of File objects or URLs
        productVideo: null, // File object or URL
        productName: '',
        category: '',
        brand: '',
        shortDescription: '',
        // Changed fullDescription to an object for structured data
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
            // Add a raw text field for general description if needed, or remove if fully structured
            generalDescription: '',
        },
        price: '',
        discountPrice: '',
        wholesalePrice: [], // { minQuantity, price }
        variants: [], // { name, options: [] }
        couponCode: '',
        useLoyaltyPoints: false,
        informationTags: ['', '', ''], // Up to 3 optional tags
        availabilityLocations: [],
        deliveryLocations: [],
    });

    const [validationErrors, setValidationErrors] = useState({});
    const [showCategorySelectModal, setShowCategorySelectModal] = useState(false);
    const [showBrandSelectModal, setShowBrandSelectModal] = useState(false);
    const [showAddVariantModal, setShowAddVariantModal] = useState(false);
    const [showAvailabilityLocationsModal, setShowAvailabilityLocationsModal] = useState(false);
    const [showDeliveryLocationsModal, setShowDeliveryLocationsModal] = useState(false);
    const [showFullDescriptionModal, setShowFullDescriptionModal] = useState(false); // New state for description modal

    // Dynamic state for adding new variant
    const [currentVariantName, setCurrentVariantName] = useState('');
    const [currentVariantOptions, setCurrentVariantOptions] = useState(''); // Comma-separated string

    // State for the full description modal's internal form
    const [tempFullDescription, setTempFullDescription] = useState(formData.fullDescription);

    // Brand colors (you might get this from user preferences or a global theme)
    const brandColor = '#EF4444'; // Example brand color
    const contrastColor = getContrastTextColor(brandColor); // Assuming getContrastTextColor is available
    const brandBgStyle = { backgroundColor: brandColor };
    const brandTextStyle = { color: brandColor };
    const brandHoverStyle = { filter: 'brightness(110%)' };
    const brandBorderStyle = { borderColor: brandColor };
    const brandRingStyle = { '--tw-ring-color': brandColor };
    const contrastTextStyle = { color: contrastColor };


    // Effect to update tempFullDescription when formData.fullDescription changes (e.g., on initial load or reset)
    useEffect(() => {
        setTempFullDescription(formData.fullDescription);
    }, [formData.fullDescription]);


    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        setValidationErrors(prev => ({ ...prev, [name]: '' })); // Clear error on change
    };

    // Handler for the full description modal's inputs
    const handleFullDescriptionChange = (e) => {
        const { name, value } = e.target;
        setTempFullDescription(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handler for selecting from description modal dropdowns
    const handleDescriptionModalSelect = (name, value) => {
        setTempFullDescription(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveFullDescription = () => {
        // You might add validation for tempFullDescription here
        setFormData(prev => ({
            ...prev,
            fullDescription: tempFullDescription
        }));
        setShowFullDescriptionModal(false);
        setValidationErrors(prev => ({ ...prev, fullDescription: '' })); // Clear error
    };


    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (name === 'productImages') {
            const newImages = Array.from(files).map(file => ({
                fileObject: file,
                fileUrl: URL.createObjectURL(file)
            }));
            setFormData(prev => {
                const updatedImages = [...prev.productImages, ...newImages];
                // Limit to 3 images
                return {
                    ...prev,
                    productImages: updatedImages.slice(0, 3)
                };
            });
        } else if (name === 'productVideo' && files && files[0]) {
            const file = files[0];
            const fileUrl = URL.createObjectURL(file);
            setFormData(prev => ({
                ...prev,
                productVideo: { fileObject: file, fileUrl: fileUrl }
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
        setFormData(prev => ({
            ...prev,
            productVideo: null
        }));
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
        if (!currentVariantName.trim()) {
            // alert('Variant name cannot be empty.'); // Replace with custom modal
            console.error('Variant name cannot be empty.');
            return;
        }
        const optionsArray = currentVariantOptions.split(',').map(opt => opt.trim()).filter(opt => opt !== '');
        if (optionsArray.length === 0) {
            // alert('Please enter at least one option for the variant.'); // Replace with custom modal
            console.error('Please enter at least one option for the variant.');
            return;
        }

        setFormData(prev => ({
            ...prev,
            variants: [...prev.variants, { name: currentVariantName.trim(), options: optionsArray }]
        }));
        setCurrentVariantName('');
        setCurrentVariantOptions('');
        setShowAddVariantModal(false);
    };

    const handleRemoveVariant = (index) => {
        setFormData(prev => ({
            ...prev,
            variants: prev.variants.filter((_, i) => i !== index)
        }));
    };

    const handleToggleLocation = (location, type) => {
        setFormData(prev => {
            const currentLocations = prev[type];
            let updatedLocations;
            if (currentLocations.includes(location)) {
                updatedLocations = currentLocations.filter(loc => loc !== location);
            } else {
                updatedLocations = [...currentLocations, location];
            }
            return { ...prev, [type]: updatedLocations };
        });
    };

    const validateForm = () => {
        const errors = {};
        if (formData.productImages.length < 3) errors.productImages = 'Upload at least 3 clear pictures.';
        if (!formData.productName.trim()) errors.productName = 'Product Name is required.';
        if (!formData.category) errors.category = 'Category is required.';
        if (!formData.brand) errors.brand = 'Brand is required.';
        if (!formData.shortDescription.trim()) errors.shortDescription = 'Short description is required.';
        // Validate fullDescription object
        if (!formData.fullDescription.model.trim() || !formData.fullDescription.mobileType.trim()) {
            errors.fullDescription = 'Full description details (e.g., Model, Mobile Type) are required.';
        }
        if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) <= 0) errors.price = 'Valid price is required.';
        if (formData.discountPrice && (isNaN(formData.discountPrice) || parseFloat(formData.discountPrice) < 0 || parseFloat(formData.discountPrice) >= parseFloat(formData.price))) {
            errors.discountPrice = 'Discount price must be valid and less than regular price.';
        }
        if (formData.availabilityLocations.length === 0) errors.availabilityLocations = 'At least one availability location is required.';
        if (formData.deliveryLocations.length === 0) errors.deliveryLocations = 'At least one delivery location is required.';


        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handlePostProduct = async () => {
        if (!validateForm()) {
            // alert('Please fill in all required fields and correct errors.'); // Replace with custom modal
            console.error('Please fill in all required fields and correct errors.');
            return;
        }

        const dataToSend = new FormData();
        // Append all form data
        Object.keys(formData).forEach(key => {
            if (key === 'productImages') {
                formData.productImages.forEach((img, index) => {
                    if (img.fileObject) dataToSend.append(`productImages[${index}]`, img.fileObject);
                });
            } else if (key === 'productVideo' && formData.productVideo?.fileObject) {
                dataToSend.append('productVideo', formData.productVideo.fileObject);
            } else if (key === 'fullDescription') {
                // Stringify the fullDescription object
                dataToSend.append(key, JSON.stringify(formData[key]));
            }
            else if (Array.isArray(formData[key])) {
                dataToSend.append(key, JSON.stringify(formData[key]));
            } else if (typeof formData[key] === 'object' && formData[key] !== null) {
                dataToSend.append(key, JSON.stringify(formData[key]));
            }
            else {
                dataToSend.append(key, formData[key]);
            }
        });

        console.log('Submitting product data:', formData);
        // try {
        //     await addProduct(dataToSend).unwrap();
        //     alert('Product added successfully!'); // Replace with custom modal
        //     navigate('/my-products'); // Redirect or clear form
        // } catch (error) {
        //     console.error('Failed to add product:', error);
        //     alert('Failed to add product.'); // Replace with custom modal
        // }
        // alert('Product added successfully! (Simulated)'); // For demo
        console.log('Product added successfully! (Simulated)'); // For demo
    };

    const handleBulkUpload = async () => {
        // Implement bulk upload logic here
        // This would typically involve uploading a CSV file and processing it
        // alert('Bulk upload initiated! (Simulated)'); // For demo
        console.log('Bulk upload initiated! (Simulated)'); // For demo
    };

    // Function to render a summary of the full description
    const renderFullDescriptionSummary = () => {
        const desc = formData.fullDescription;
        const parts = [];
        if (desc.mobileType) parts.push(`Type: ${desc.mobileType}`);
        if (desc.mobileBrand) parts.push(`Brand: ${desc.mobileBrand}`);
        if (desc.model) parts.push(`Model: ${desc.model}`);
        if (desc.storage) parts.push(`Storage: ${desc.storage}`);
        if (desc.resolution) parts.push(`Resolution: ${desc.resolution}`);
        if (desc.color) parts.push(`Color: ${desc.color}`);
        // if (desc.display) parts.push(`Display: ${desc.display}`); // Removed as per image, but kept in state
        if (desc.screenSize) parts.push(`Screen Size: ${desc.screenSize}`);
        if (desc.battery) parts.push(`Battery: ${desc.battery}`);
        if (desc.camera) parts.push(`Camera: ${desc.camera}`);
        if (desc.generalDescription) parts.push(`Details: ${desc.generalDescription}`);

        return parts.length > 0 ? parts.join(' | ') : 'No detailed description added. Click to add.';
    };


    return (

        <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4 lg:p-8">
            {/* Main content container with white background and rounded corners */}
            <div className="relative flex w-full max-w-[1200px] bg-white rounded-2xl shadow-xl overflow-hidden p-8">

                {/* Main content area, acting as a flex container for your two columns */}
                <div className="flex flex-col md:flex-row w-full gap-8"> {/* Added md:flex-row and gap-8 for spacing */}

                    {/* Left Column: Files Section (Product Media and Bulk Upload) */}
                    {/* flex-1 will make it take up roughly half the width. text-left ensures content aligns left. */}
                    <div className="flex-1 flex flex-col space-y-6 text-left">
                        <h1 className="text-3xl font-bold text-gray-800 mb-4" style={{ fontFamily: 'Manrope' }}>Add Product</h1>

                        {/* Product Media */}
                        <div className="flex flex-col gap-6"> {/* Changed from md:flex-row to flex-col for better stacking within the half-width */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Upload at least 3 clear pictures of your product
                                    </label>
                                    <div className="grid grid-cols-2 gap-4">
                                        {formData.productImages.map((img, index) => (
                                            <div key={index} className="relative w-[100px] h-[100px] rounded-lg border border-gray-300 flex items-center justify-center overflow-hidden">
                                                <img src={img.fileUrl} alt={`Product ${index}`} className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveImage(index)}
                                                    className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1 text-xs"
                                                >
                                                    <XMarkIcon className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                        {formData.productImages.length < 5 && (
                                            <label className="w-[100px] h-[100px] rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400">
                                                <CameraIcon className="h-8 w-8 text-gray-400" />
                                                <span className="text-xs text-gray-500 mt-1">Add Image</span>
                                                <input
                                                    type="file"
                                                    name="productImages"
                                                    className="sr-only"
                                                    onChange={handleFileChange}
                                                    accept="image/*"
                                                    multiple
                                                />
                                            </label>
                                        )}
                                    </div>
                                    {validationErrors.productImages && <p className="text-xs mt-1" style={brandTextStyle}>{validationErrors.productImages}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Upload at least 1 video of your product
                                    </label>
                                    <div className="w-[100px] h-[100px] rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 relative">
                                        {formData.productVideo?.fileUrl ? (
                                            <>
                                                <video src={formData.productVideo.fileUrl} className="w-full h-full object-cover rounded-lg" controls />
                                                <button
                                                    type="button"
                                                    onClick={handleRemoveVideo}
                                                    className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1 text-xs"
                                                >
                                                    <XMarkIcon className="h-4 w-4" />
                                                </button>
                                            </>
                                        ) : (
                                            <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                                                <CameraIcon className="h-8 w-8 text-gray-400" />
                                                <span className="text-xs text-gray-500 mt-1">Add Video</span>
                                                <input
                                                    type="file"
                                                    name="productVideo"
                                                    className="sr-only"
                                                    onChange={handleFileChange}
                                                    accept="video/*"
                                                />
                                            </label>
                                        )}
                                    </div>
                                    {validationErrors.productVideo && <p className="text-xs mt-1" style={brandTextStyle}>{validationErrors.productVideo}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Bulk Upload Section */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Bulk Upload Products</h2>
                            <p className="text-gray-600 mb-4">
                                Upload several products at once with our bulk template, follow the steps below to proceed:
                            </p>
                            <ul className="list-none space-y-2 mb-6">
                                <li className="flex items-center text-gray-700">
                                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" /> Download bulk template below
                                </li>
                                <li className="flex items-center text-gray-700">
                                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" /> Fill the template accordingly
                                </li>
                                <li className="flex items-center text-gray-700">
                                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" /> Upload the filled template in the space provided
                                </li>
                                <li className="flex items-center text-gray-700">
                                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" /> Bulk Upload Successful
                                </li>
                            </ul>

                            {/* Download Template */}
                            <div className="flex items-center justify-between p-4 rounded-lg border border-gray-300 bg-white shadow-sm mb-6">
                                <div className="flex items-center gap-3">
                                    <DocumentTextIcon className="h-6 w-6 text-gray-500" />
                                    <div>
                                        <p className="font-medium text-gray-800">Download CSV bulk template</p>
                                        <p className="text-xs text-gray-500">300 kb</p>
                                    </div>
                                </div>
                                <a href="/path/to/bulk_template.csv" download className="text-gray-500 hover:text-gray-700">
                                    <ArrowDownTrayIcon className="h-6 w-6" />
                                </a>
                            </div>

                            {/* Upload Filled Template */}
                            <div className="w-full h-40 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 relative mb-6">
                                <ArrowUpTrayIcon className="h-10 w-10 text-gray-400" />
                                <span className="text-sm text-gray-500 mt-2">Upload Filled template</span>
                                <input
                                    type="file"
                                    name="bulkUploadFile"
                                    className="sr-only"
                                    onChange={(e) => console.log('Bulk upload file selected:', e.target.files[0])}
                                    accept=".csv"
                                />
                            </div>

                            <Button
                                onClick={handleBulkUpload}
                                className="w-full py-3 px-4 rounded-lg font-semibold bg-gray-800 text-white"
                            >
                                Upload Bulk Products
                            </Button>
                        </div>
                    </div>

                    {/* Right Column: All other Inputs and Dropdowns */}
                    {/* flex-1 will make it take up roughly half the width. items-center for horizontal centering. */}
                    <div className="flex-1 flex flex-col space-y-6 items-center">
                        <div className="w-full max-w-md space-y-4"> {/* Added a max-width for inputs within this column */}
                            <Input
                                type="text"
                                name="productName"
                                placeholder="Product Name"
                                value={formData.productName}
                                onChange={handleChange}
                                className="h-[60px] rounded-[15px] border border-gray-300"
                                error={validationErrors.productName}
                            />
                            <div className="relative">
                                <div
                                    className="flex items-center justify-between p-3 rounded-[15px] border border-gray-300 bg-white cursor-pointer h-[60px] shadow-sm"
                                    onClick={() => setShowCategorySelectModal(true)}
                                >
                                    <div className="flex items-center gap-2">
                                        <TagIcon className="h-5 w-5 text-gray-400" />
                                        <span className="text-gray-700">
                                            {formData.category || 'Category'}
                                        </span>
                                    </div>
                                    <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                                </div>
                                {validationErrors.category && <p className="text-xs mt-1" style={brandTextStyle}>{validationErrors.category}</p>}
                            </div>

                            <div className="relative">
                                <div
                                    className="flex items-center justify-between p-3 rounded-[15px] border border-gray-300 bg-white cursor-pointer h-[60px] shadow-sm"
                                    onClick={() => setShowBrandSelectModal(true)}
                                >
                                    <div className="flex items-center gap-2">
                                        <BuildingStorefrontIcon className="h-5 w-5 text-gray-400" />
                                        <span className="text-gray-700">
                                            {formData.brand || 'Brand'}
                                        </span>
                                    </div>
                                    <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                                </div>
                                {validationErrors.brand && <p className="text-xs mt-1" style={brandTextStyle}>{validationErrors.brand}</p>}
                            </div>

                            <Input
                                type="text"
                                name="shortDescription"
                                placeholder="Short description"
                                value={formData.shortDescription}
                                onChange={handleChange}
                                className="h-[60px] rounded-[15px] border border-gray-300"
                                error={validationErrors.shortDescription}
                            />

                            {/* Replaced textarea with a clickable div for Full Description */}
                            <div className="relative">
                                <div
                                    className={`flex items-center justify-between p-3 rounded-[15px] border bg-white cursor-pointer h-[60px] shadow-sm ${validationErrors.fullDescription ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    onClick={() => setShowFullDescriptionModal(true)}
                                >
                                    <div className="flex items-center gap-2">
                                        <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                                        <span className="text-gray-700 overflow-hidden whitespace-nowrap text-ellipsis">
                                            {renderFullDescriptionSummary()}
                                        </span>
                                    </div>
                                    <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                                </div>
                                {validationErrors.fullDescription && <p className="text-xs mt-1" style={brandTextStyle}>{validationErrors.fullDescription}</p>}
                            </div>


                            <Input
                                type="number"
                                name="price"
                                placeholder="Price"
                                value={formData.price}
                                onChange={handleChange}
                                className="h-[60px] rounded-[15px] border border-gray-300"
                                error={validationErrors.price}
                            />
                            <Input
                                type="number"
                                name="discountPrice"
                                placeholder="Discount Price"
                                value={formData.discountPrice}
                                onChange={handleChange}
                                className="h-[60px] rounded-[15px] border border-gray-300"
                                error={validationErrors.discountPrice}
                            />
                        </div>

                        {/* Add Wholesale Price (Placeholder) */}
                        <div className="w-full max-w-md mt-6 text-left">
                            <h3 className="text-sm font-semibold text-gray-700 mb-2" style={brandTextStyle}>Add Wholesale price</h3>
                            <p className="text-xs text-gray-500">
                                (This section would allow adding tiered pricing based on quantity)
                            </p>
                        </div>

                        {/* Add Variants */}
                        <div className="w-full max-w-md mt-6 text-left">
                            <h3 className="text-sm font-semibold text-gray-700 mb-2">Add Variants</h3>
                            <p className="text-xs text-gray-500 mb-4">Variants include colors and size.</p>
                            <div
                                className="flex items-center justify-between p-3 rounded-[15px] border border-gray-300 bg-white cursor-pointer h-[60px] shadow-sm"
                                onClick={() => setShowAddVariantModal(true)}
                            >
                                <div className="flex items-center gap-2">
                                    <PlusCircleIcon className="h-5 w-5 text-gray-400" />
                                    <span className="text-gray-700">Add New Variant</span>
                                </div>
                                <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                            </div>
                            <div className="mt-2 space-y-2">
                                {formData.variants.map((variant, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200">
                                        <span className="text-sm font-medium text-gray-800">{variant.name}: {variant.options.join(', ')}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveVariant(index)}
                                            className="text-gray-500 hover:text-gray-700"
                                        >
                                            <XMarkIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Promotions */}
                        <div className="w-full max-w-md mt-6 text-left">
                            <h3 className="text-sm font-semibold text-gray-700 mb-2">Promotions</h3>
                            <p className="text-xs text-gray-500 mb-4">Promote your product via coupon codes.</p>
                            <Input
                                type="text"
                                name="couponCode"
                                placeholder="Coupon code to be used"
                                value={formData.couponCode}
                                onChange={handleChange}
                                className="h-[60px] rounded-[15px] border border-gray-300"
                            />
                            <div className="flex items-center mt-4">
                                <input
                                    type="checkbox"
                                    name="useLoyaltyPoints"
                                    checked={formData.useLoyaltyPoints}
                                    onChange={handleChange}
                                    className="h-5 w-5 rounded focus:ring-2"
                                    style={{ borderColor: brandColor, ...brandRingStyle }}
                                />
                                <label htmlFor="useLoyaltyPoints" className="ml-2 text-sm text-gray-700">
                                    Buyers can use loyalty points during purchase
                                </label>
                            </div>
                        </div>

                        {/* Others (Information Tags) */}
                        <div className="w-full max-w-md mt-6 text-left">
                            <h3 className="text-sm font-semibold text-gray-700 mb-2">Others</h3>
                            {formData.informationTags.map((tag, index) => (
                                <Input
                                    key={index}
                                    type="text"
                                    name={`informationTags[${index}]`}
                                    placeholder={`Information tag ${index + 1} (optional)`}
                                    value={tag}
                                    onChange={(e) => {
                                        const newTags = [...formData.informationTags];
                                        newTags[index] = e.target.value;
                                        setFormData(prev => ({ ...prev, informationTags: newTags }));
                                    }}
                                    className="h-[60px] rounded-[15px] border border-gray-300 mb-2"
                                />
                            ))}
                        </div>

                        {/* Availability Locations */}
                        <div className="w-full max-w-md mt-6 text-left">
                            <h3 className="text-sm font-semibold text-gray-700 mb-2">Availability locations</h3>
                            <div
                                className="flex items-center justify-between p-3 rounded-[15px] border border-gray-300 bg-white cursor-pointer h-[60px] shadow-sm"
                                onClick={() => setShowAvailabilityLocationsModal(true)}
                            >
                                <div className="flex items-center gap-2">
                                    <MapPinIcon className="h-5 w-5 text-gray-400" />
                                    <span className="text-gray-700">
                                        {formData.availabilityLocations.length > 0
                                            ? `Selected (${formData.availabilityLocations.length})`
                                            : 'Select Locations'}
                                    </span>
                                </div>
                                <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                            </div>
                            {validationErrors.availabilityLocations && <p className="text-xs mt-1" style={brandTextStyle}>{validationErrors.availabilityLocations}</p>}
                            <div className="flex flex-wrap gap-2 mt-2">
                                {formData.availabilityLocations.map(loc => (
                                    <span key={loc} className="inline-flex items-center px-3 py-1 rounded-full text-sm" style={{ backgroundColor: brandColor, color: contrastColor }}>
                                        {loc}
                                        <button type="button" onClick={() => handleToggleLocation(loc, 'availabilityLocations')} className="ml-2 text-white hover:text-gray-200">
                                            <XMarkIcon className="h-4 w-4" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Delivery Locations */}
                        <div className="w-full max-w-md mt-6 text-left">
                            <h3 className="text-sm font-semibold text-gray-700 mb-2">Delivery locations</h3>
                            <div
                                className="flex items-center justify-between p-3 rounded-[15px] border border-gray-300 bg-white cursor-pointer h-[60px] shadow-sm"
                                onClick={() => setShowDeliveryLocationsModal(true)}
                            >
                                <div className="flex items-center gap-2">
                                    <TruckIcon className="h-5 w-5 text-gray-400" />
                                    <span className="text-gray-700">
                                        {formData.deliveryLocations.length > 0
                                            ? `Selected (${formData.deliveryLocations.length})`
                                            : 'Select Locations'}
                                    </span>
                                </div>
                                <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                            </div>
                            {validationErrors.deliveryLocations && <p className="text-xs mt-1" style={brandTextStyle}>{validationErrors.deliveryLocations}</p>}
                            <div className="flex flex-wrap gap-2 mt-2">
                                {formData.deliveryLocations.map(loc => (
                                    <span key={loc} className="inline-flex items-center px-3 py-1 rounded-full text-sm" style={{ backgroundColor: brandColor, color: contrastColor }}>
                                        {loc}
                                        <button type="button" onClick={() => handleToggleLocation(loc, 'deliveryLocations')} className="ml-2 text-white hover:text-gray-200">
                                            <XMarkIcon className="h-4 w-4" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Post Product Button */}
                        <Button
                            onClick={handlePostProduct}
                            className="w-full max-w-md py-3 px-4 rounded-lg font-semibold mt-8"
                            style={brandBgStyle}
                        >
                            <span style={contrastTextStyle}>Post Product</span>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Modals (keep these outside the main two-column flex container) */}
            {/* Category Select Modal */}
            <Modal
                isOpen={showCategorySelectModal}
                onClose={() => setShowCategorySelectModal(false)}
                title="Select Category"
            >
                <div className="space-y-2">
                    {dummyCategories.map((cat) => (
                        <div
                            key={cat}
                            className="p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50"
                            onClick={() => handleCategorySelect(cat)}
                        >
                            {cat}
                        </div>
                    ))}
                </div>
            </Modal>

            {/* Brand Select Modal */}
            <Modal
                isOpen={showBrandSelectModal}
                onClose={() => setShowBrandSelectModal(false)}
                title="Select Brand"
            >
                <div className="space-y-2">
                    {dummyBrands.map((brand) => (
                        <div
                            key={brand}
                            className="p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50"
                            onClick={() => handleBrandSelect(brand)}
                        >
                            {brand}
                        </div>
                    ))}
                </div>
            </Modal>

            {/* Add Variant Modal */}
            <Modal
                isOpen={showAddVariantModal}
                onClose={() => setShowAddVariantModal(false)}
                title="Add New Variant"
            >
                <div className="space-y-4">
                    <Input
                        type="text"
                        placeholder="Variant Name (e.g., Color, Size)"
                        value={currentVariantName}
                        onChange={(e) => setCurrentVariantName(e.target.value)}
                        className="h-[60px] rounded-[15px] border border-gray-300"
                    />
                    <Input
                        type="text"
                        placeholder="Options (comma-separated, e.g., Red, Blue, Green)"
                        value={currentVariantOptions}
                        onChange={(e) => setCurrentVariantOptions(e.target.value)}
                        className="h-[60px] rounded-[15px] border border-gray-300"
                    />
                    <Button
                        onClick={handleAddVariant}
                        className="w-full py-3 px-4 rounded-lg font-semibold"
                        style={brandBgStyle}
                    >
                        <span style={contrastTextStyle}>Add Variant</span>
                    </Button>
                </div>
            </Modal>

            {/* Availability Locations Modal */}
            <Modal
                isOpen={showAvailabilityLocationsModal}
                onClose={() => setShowAvailabilityLocationsModal(false)}
                title="Select Availability Locations"
            >
                <div className="space-y-2">
                    {dummyLocations.map((loc) => (
                        <div
                            key={loc}
                            className="flex items-center justify-between p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50"
                            onClick={() => handleToggleLocation(loc, 'availabilityLocations')}
                        >
                            <span>{loc}</span>
                            {formData.availabilityLocations.includes(loc) && (
                                <CheckCircleIcon className="h-5 w-5 text-green-500" />
                            )}
                        </div>
                    ))}
                </div>
                <Button
                    onClick={() => setShowAvailabilityLocationsModal(false)}
                    className="w-full py-3 px-4 rounded-lg font-semibold mt-4"
                    style={brandBgStyle}
                >
                    <span style={contrastTextStyle}>Done</span>
                </Button>
            </Modal>

            {/* Delivery Locations Modal */}
            <Modal
                isOpen={showDeliveryLocationsModal}
                onClose={() => setShowDeliveryLocationsModal(false)}
                title="Select Delivery Locations"
            >
                <div className="space-y-2">
                    {dummyLocations.map((loc) => (
                        <div
                            key={loc}
                            className="flex items-center justify-between p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50"
                            onClick={() => handleToggleLocation(loc, 'deliveryLocations')}
                        >
                            <span>{loc}</span>
                            {formData.deliveryLocations.includes(loc) && (
                                <CheckCircleIcon className="h-5 w-5 text-green-500" />
                            )}
                        </div>
                    ))}
                </div>
                <Button
                    onClick={() => setShowDeliveryLocationsModal(false)}
                    className="w-full py-3 px-4 rounded-lg font-semibold mt-4"
                    style={brandBgStyle}
                >
                    <span style={contrastTextStyle}>Done</span>
                </Button>
            </Modal>

            {/* Full Description Modal */}
            <Modal
                isOpen={showFullDescriptionModal}
                onClose={() => setShowFullDescriptionModal(false)}
                title="Full Description"
            >
                <div className="space-y-4 p-4">
                    {/* Mobile Phones (Type) - Now a native <select> */}
                    <div>
                        <label htmlFor="mobileType" className="block text-sm font-medium text-gray-700 mb-1">Mobile Type</label>
                        <select
                            id="mobileType"
                            name="mobileType"
                            value={tempFullDescription.mobileType}
                            onChange={handleFullDescriptionChange}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-[15px] h-[60px] shadow-sm"
                        >
                            <option value="">Select Mobile Type</option>
                            {dummyMobileTypes.map((type) => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    {/* Apple (Mobile Brand) - Now a native <select> */}
                    <div>
                        <label htmlFor="mobileBrand" className="block text-sm font-medium text-gray-700 mb-1">Mobile Brand</label>
                        <select
                            id="mobileBrand"
                            name="mobileBrand"
                            value={tempFullDescription.mobileBrand}
                            onChange={handleFullDescriptionChange}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-[15px] h-[60px] shadow-sm"
                        >
                            <option value="">Select Mobile Brand</option>
                            {dummyMobileBrands.map((brand) => (
                                <option key={brand} value={brand}>{brand}</option>
                            ))}
                        </select>
                    </div>

                    {/* Model Input (remains as Input component) */}
                    <div>
                        <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                        <Input
                            type="text"
                            name="model"
                            id="model"
                            placeholder="Model"
                            value={tempFullDescription.model}
                            onChange={handleFullDescriptionChange}
                            className="h-[60px] rounded-[15px] border border-gray-300 shadow-sm"
                        />
                    </div>

                    {/* Storage Input (remains as Input component) */}
                    <div>
                        <label htmlFor="storage" className="block text-sm font-medium text-gray-700 mb-1">Storage</label>
                        <Input
                            type="text"
                            name="storage"
                            id="storage"
                            placeholder="Storage"
                            value={tempFullDescription.storage}
                            onChange={handleFullDescriptionChange}
                            className="h-[60px] rounded-[15px] border border-gray-300 shadow-sm"
                        />
                    </div>

                    {/* Resolution Input (remains as Input component) */}
                    <div>
                        <label htmlFor="resolution" className="block text-sm font-medium text-gray-700 mb-1">Resolution</label>
                        <Input
                            type="text"
                            name="resolution"
                            id="resolution"
                            placeholder="Resolution"
                            value={tempFullDescription.resolution}
                            onChange={handleFullDescriptionChange}
                            className="h-[60px] rounded-[15px] border border-gray-300 shadow-sm"
                        />
                    </div>

                    {/* Color Input (remains as Input component) */}
                    <div>
                        <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                        <Input
                            type="text"
                            name="color"
                            id="color"
                            placeholder="Color"
                            value={tempFullDescription.color}
                            onChange={handleFullDescriptionChange}
                            className="h-[60px] rounded-[15px] border border-gray-300 shadow-sm"
                        />
                    </div>

                    {/* Display Input (remains as Input component) */}
                    <div>
                        <label htmlFor="display" className="block text-sm font-medium text-gray-700 mb-1">Display</label>
                        <Input
                            type="text"
                            name="display"
                            id="display"
                            placeholder="Display"
                            value={tempFullDescription.display}
                            onChange={handleFullDescriptionChange}
                            className="h-[60px] rounded-[15px] border border-gray-300 shadow-sm"
                        />
                    </div>

                    {/* Screen Size Input (remains as Input component) */}
                    <div>
                        <label htmlFor="screenSize" className="block text-sm font-medium text-gray-700 mb-1">Screen Size</label>
                        <Input
                            type="text"
                            name="screenSize"
                            id="screenSize"
                            placeholder="Screen Size"
                            value={tempFullDescription.screenSize}
                            onChange={handleFullDescriptionChange}
                            className="h-[60px] rounded-[15px] border border-gray-300 shadow-sm"
                        />
                    </div>

                    {/* Battery Input (remains as Input component) */}
                    <div>
                        <label htmlFor="battery" className="block text-sm font-medium text-gray-700 mb-1">Battery</label>
                        <Input
                            type="text"
                            name="battery"
                            id="battery"
                            placeholder="Battery"
                            value={tempFullDescription.battery}
                            onChange={handleFullDescriptionChange}
                            className="h-[60px] rounded-[15px] border border-gray-300 shadow-sm"
                        />
                    </div>

                    {/* Camera Input (remains as Input component) */}
                    <div>
                        <label htmlFor="camera" className="block text-sm font-medium text-gray-700 mb-1">Camera</label>
                        <Input
                            type="text"
                            name="camera"
                            id="camera"
                            placeholder="Camera"
                            value={tempFullDescription.camera}
                            onChange={handleFullDescriptionChange}
                            className="h-[60px] rounded-[15px] border border-gray-300 shadow-sm"
                        />
                    </div>

                    {/* General Description - Textarea */}
                    <div>
                        <label htmlFor="generalDescription" className="block text-sm font-medium text-gray-700 mb-1">Additional Details (Optional)</label>
                        <textarea
                            name="generalDescription"
                            id="generalDescription"
                            placeholder="Any additional details or features..."
                            value={tempFullDescription.generalDescription}
                            onChange={handleFullDescriptionChange}
                            rows="3"
                            className="w-full p-3 rounded-[15px] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-sm"
                        ></textarea>
                    </div>

                    <Button
                        onClick={handleSaveFullDescription}
                        className="w-full py-3 px-4 rounded-lg font-semibold"
                        style={brandBgStyle}
                    >
                        <span style={contrastTextStyle}>Save</span>
                    </Button>
                </div>
            </Modal>
        </div>
    );
};

export default AddProductPage;