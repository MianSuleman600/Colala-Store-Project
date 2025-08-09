import React, { useState } from 'react';
// Assuming these icons and components are available from your project setup
import {
    XMarkIcon,
    CameraIcon,
    DocumentTextIcon,
    ArrowDownTrayIcon,
    ArrowUpTrayIcon,
    TagIcon,
    BuildingStorefrontIcon,
    ChevronDownIcon,
    PlusCircleIcon,
    MapPinIcon,
    CheckCircleIcon,
    BriefcaseIcon,
    CurrencyDollarIcon,
    CalendarDaysIcon,
    UserGroupIcon,
} from '@heroicons/react/24/outline'; // Adjust import path as needed

// Dummy components for illustration (replace with your actual components)
const Input = ({ type, name, placeholder, value, onChange, className, error, readOnly = false }) => (
    <div className="w-full">
        <input
            type={type}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={`w-full p-3 ${className} ${error ? 'border-red-500' : ''}`}
            readOnly={readOnly}
        />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
);

const Button = ({ onClick, className, children, style }) => (
    <button onClick={onClick} className={className} style={style}>
        {children}
    </button>
);

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
                <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                    <XMarkIcon className="h-6 w-6" />
                </button>
                {children}
            </div>
        </div>
    );
};

// --- Dummy Data (replace with actual data fetched from backend) ---
const dummyServiceCategories = ['Consulting', 'Repairs', 'Tutoring', 'Cleaning', 'Digital Marketing', 'Event Planning'];
const dummyServiceTypes = ['Online', 'In-person', 'Hybrid']; // Not used in this version based on requirements, but kept for reference if needed.
const dummyLocations = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Miami', 'Online Only']; // Not used in this version based on requirements, but kept for reference if needed.


const brandColor = '#F2746B'; // Using the salmon/coral color from your button
const contrastColor = '#FFFFFF'; // White for contrast
const brandBgStyle = { backgroundColor: brandColor, color: contrastColor };
const brandTextStyle = { color: brandColor };
const brandRingStyle = { '--tw-ring-color': brandColor };
const contrastTextStyle = { color: contrastColor }; // Defined correctly as an object for the span inside the button


function AddServicePage() {
    const [formData, setFormData] = useState({
        serviceName: '',
        serviceCategory: '',
        shortDescription: '',
        fullDescription: '',
        priceRangeFrom: '',
        priceRangeTo: '',
        discountPrice: '',
        serviceImages: [],
        serviceVideo: null,
        subServices: [
            // Initial dummy sub-services as seen in ser2.png
            { name: 'General', from: '5,000', to: '20,000' },
            { name: 'Male Wear', from: '5,000', to: '20,000' },
            { name: 'Female Wear', from: '5,000', to: '20,000' },
            { name: 'Kids Wear', from: '5,000', to: '20,000' },
            { name: 'Wedding Wears', from: '5,000', to: '20,000' },
        ],
        couponCode: '', // Not shown in current requirements, but kept from previous version
        useLoyaltyPoints: false, // Not shown in current requirements, but kept from previous version
        informationTags: ['', '', ''], // Not shown in current requirements, but kept from previous version
        serviceAreas: [], // Not shown in current requirements, but kept from previous version
        clientRequirements: '', // Not shown in current requirements, but kept from previous version
        schedulingInfo: '', // Not shown in current requirements, but kept from previous version
    });

    const [validationErrors, setValidationErrors] = useState({});
    const [showServiceCategorySelectModal, setShowServiceCategorySelectModal] = useState(false);
    const [newSubServiceName, setNewSubServiceName] = useState('');
    const [newSubServiceFrom, setNewSubServiceFrom] = useState('');
    const [newSubServiceTo, setNewSubServiceTo] = useState('');


    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        setValidationErrors(prev => ({ ...prev, [name]: '' })); // Clear error on change
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        const newFiles = Array.from(files).map(file => ({
            file: file,
            fileUrl: URL.createObjectURL(file), // Create a temporary URL for preview
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
        }));

        if (name === "serviceImages") {
            setFormData(prev => ({
                ...prev,
                serviceImages: [...prev.serviceImages, ...newFiles].slice(0, 5) // Limit to 5 images
            }));
        } else if (name === "serviceVideo") {
            setFormData(prev => ({ ...prev, serviceVideo: newFiles[0] || null }));
        }
        setValidationErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleRemoveImage = (index) => {
        setFormData(prev => ({
            ...prev,
            serviceImages: prev.serviceImages.filter((_, i) => i !== index)
        }));
    };

    const handleRemoveVideo = () => {
        setFormData(prev => ({ ...prev, serviceVideo: null }));
    };

    const handleServiceCategorySelect = (category) => {
        setFormData(prev => ({ ...prev, serviceCategory: category }));
        setShowServiceCategorySelectModal(false);
        setValidationErrors(prev => ({ ...prev, serviceCategory: '' }));
    };

    const handleAddSubService = () => {
        if (newSubServiceName.trim() && newSubServiceFrom.trim() && newSubServiceTo.trim()) {
            setFormData(prev => ({
                ...prev,
                subServices: [
                    ...prev.subServices,
                    {
                        name: newSubServiceName.trim(),
                        from: newSubServiceFrom.trim(),
                        to: newSubServiceTo.trim(),
                    }
                ]
            }));
            setNewSubServiceName('');
            setNewSubServiceFrom('');
            setNewSubServiceTo('');
        }
    };

    const handleRemoveSubService = (index) => {
        setFormData(prev => ({
            ...prev,
            subServices: prev.subServices.filter((_, i) => i !== index)
        }));
    };


    // This function is not explicitly used in the current simplified design, but kept for potential future use.
    const handleToggleLocation = (location, field) => {
        setFormData(prev => {
            const currentLocations = prev[field];
            if (currentLocations.includes(location)) {
                return { ...prev, [field]: currentLocations.filter(loc => loc !== location) };
            } else {
                return { ...prev, [field]: [...currentLocations, location] };
            }
        });
        setValidationErrors(prev => ({ ...prev, [field]: '' }));
    };

    const validateForm = () => {
        let errors = {};
        if (!formData.serviceName.trim()) errors.serviceName = 'Service Name is required.';
        if (!formData.serviceCategory) errors.serviceCategory = 'Category is required.';
        if (!formData.shortDescription.trim()) errors.shortDescription = 'Short description is required.';
        if (!formData.fullDescription.trim()) errors.fullDescription = 'Full description is required.';
        if (!formData.priceRangeFrom || isNaN(parseFloat(formData.priceRangeFrom.replace(/,/g, ''))) || parseFloat(formData.priceRangeFrom.replace(/,/g, '')) <= 0) {
            errors.priceRangeFrom = 'Valid "From" price is required.';
        }
        if (!formData.priceRangeTo || isNaN(parseFloat(formData.priceRangeTo.replace(/,/g, ''))) || parseFloat(formData.priceRangeTo.replace(/,/g, '')) <= 0) {
            errors.priceRangeTo = 'Valid "To" price is required.';
        }
        if (parseFloat(formData.priceRangeFrom.replace(/,/g, '')) > parseFloat(formData.priceRangeTo.replace(/,/g, ''))) {
            errors.priceRangeTo = '"To" price cannot be less than "From" price.';
        }
        if (formData.discountPrice && (isNaN(parseFloat(formData.discountPrice.replace(/,/g, ''))) || parseFloat(formData.discountPrice.replace(/,/g, '')) < 0)) {
            errors.discountPrice = 'Discount Price must be a positive number or empty.';
        }
        if (formData.serviceImages.length < 1) errors.serviceImages = 'Upload at least 1 image for your service portfolio.';

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handlePostService = () => {
        if (validateForm()) {
            console.log("Service Data Submitted:", formData);
            // Here you would typically send formData to your backend API
            alert("Service posted successfully! (Simulated)");
            // Reset form or redirect
        } else {
            alert("Please correct the errors in the form.");
        }
    };


    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4 lg:p-8">
            {/* Main content container with white background and rounded corners */}
            <div className="relative flex w-full max-w-[1200px] bg-white rounded-2xl shadow-xl overflow-hidden p-8">

                {/* Main content area, acting as a flex container for your two columns */}
                <div className="flex flex-col md:flex-row w-full gap-8">

                    {/* Left Column: Media Section */}
                    <div className="flex-1 flex flex-col space-y-6 text-left">
                        <h1 className="text-3xl font-bold text-gray-800 mb-4" style={{ fontFamily: 'Manrope' }}>Add Service</h1>

                        {/* Service Media (Portfolio/Examples) */}
                        <div className="flex flex-col gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Upload at least 1 clear picture or example of your service
                                    </label>
                                    <div className="grid grid-cols-2 gap-4">
                                        {formData.serviceImages.map((img, index) => (
                                            <div key={index} className="relative w-[100px] h-[100px] rounded-lg border border-gray-300 flex items-center justify-center overflow-hidden">
                                                <img src={img.fileUrl} alt={`Service ${index}`} className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveImage(index)}
                                                    className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1 text-xs"
                                                >
                                                    <XMarkIcon className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                        {formData.serviceImages.length < 5 && (
                                            <label className="w-[100px] h-[100px] rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400">
                                                <CameraIcon className="h-8 w-8 text-gray-400" />
                                                <span className="text-xs text-gray-500 mt-1">Add Image</span>
                                                <input
                                                    type="file"
                                                    name="serviceImages"
                                                    className="sr-only"
                                                    onChange={handleFileChange}
                                                    accept="image/*"
                                                    multiple
                                                />
                                            </label>
                                        )}
                                    </div>
                                    {validationErrors.serviceImages && <p className="text-xs mt-1" style={brandTextStyle}>{validationErrors.serviceImages}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Upload 1 video showcasing your service (optional)
                                    </label>
                                    <div className="w-[100px] h-[100px] rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 relative">
                                        {formData.serviceVideo?.fileUrl ? (
                                            <>
                                                <video src={formData.serviceVideo.fileUrl} className="w-full h-full object-cover rounded-lg" controls />
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
                                                    name="serviceVideo"
                                                    className="sr-only"
                                                    onChange={handleFileChange}
                                                    accept="video/*"
                                                />
                                            </label>
                                        )}
                                    </div>
                                    {validationErrors.serviceVideo && <p className="text-xs mt-1" style={brandTextStyle}>{validationErrors.serviceVideo}</p>}
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Right Column: All other Inputs and Dropdowns */}
                    <div className="flex-1 flex flex-col space-y-6 items-center">
                        <div className="w-full max-w-md space-y-4">
                            <Input
                                type="text"
                                name="serviceName"
                                placeholder="Service Name"
                                value={formData.serviceName}
                                onChange={handleChange}
                                className="h-[60px] rounded-[15px] border border-gray-300"
                                error={validationErrors.serviceName}
                            />
                            <div className="relative">
                                <div
                                    className="flex items-center justify-between p-3 rounded-[15px] border border-gray-300 bg-white cursor-pointer h-[60px] shadow-sm"
                                    onClick={() => setShowServiceCategorySelectModal(true)}
                                >
                                    <div className="flex items-center gap-2">
                                        <BriefcaseIcon className="h-5 w-5 text-gray-400" />
                                        <span className="text-gray-700">
                                            {formData.serviceCategory || 'Service Category'}
                                        </span>
                                    </div>
                                    <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                                </div>
                                {validationErrors.serviceCategory && <p className="text-xs mt-1" style={brandTextStyle}>{validationErrors.serviceCategory}</p>}
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

                            {/* Full Description Text Area (Not a modal) */}
                            <div className="w-full">
                                <textarea
                                    name="fullDescription"
                                    placeholder="Add Full Description"
                                    value={formData.fullDescription}
                                    onChange={handleChange}
                                    rows="6" // Adjust rows as needed for desired height
                                    className={`w-full p-3 rounded-[15px] border ${validationErrors.fullDescription ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-${brandColor} focus:border-transparent resize-y`}
                                ></textarea>
                                {validationErrors.fullDescription && <p className="text-red-500 text-xs mt-1">{validationErrors.fullDescription}</p>}
                            </div>

                            {/* Price Range */}
                            <div className="w-full">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                                <div className="flex gap-4">
                                    <Input
                                        type="text" // Changed to text to allow 'N' symbol if you wish, or can keep as 'number' and handle formatting
                                        name="priceRangeFrom"
                                        placeholder="From (e.g., 5,000)"
                                        value={formData.priceRangeFrom}
                                        onChange={handleChange}
                                        className="h-[60px] rounded-[15px] border border-gray-300 flex-1"
                                        error={validationErrors.priceRangeFrom}
                                    />
                                    <Input
                                        type="text" // Changed to text to allow 'N' symbol if you wish, or can keep as 'number' and handle formatting
                                        name="priceRangeTo"
                                        placeholder="To (e.g., 20,000)"
                                        value={formData.priceRangeTo}
                                        onChange={handleChange}
                                        className="h-[60px] rounded-[15px] border border-gray-300 flex-1"
                                        error={validationErrors.priceRangeTo}
                                    />
                                </div>
                            </div>


                            {/* Discount Price */}
                            <Input
                                type="text" // Changed to text to allow 'N' symbol if you wish, or can keep as 'number' and handle formatting
                                name="discountPrice"
                                placeholder="Discount Price (Optional)"
                                value={formData.discountPrice}
                                onChange={handleChange}
                                className="h-[60px] rounded-[15px] border border-gray-300"
                                error={validationErrors.discountPrice}
                            />

                            {/* Add Sub-Service (Optional) Section */}
                            <div className="w-full mt-6 text-left p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                                <h3 className="text-base font-bold text-gray-800 mb-2">Add Sub-Service (Optional)</h3>
                                <p className="text-sm text-gray-600 mb-4">You can add subservices name and prices for more clarity to your users</p>

                                {/* Existing Sub-Services */}
                                <div className="space-y-3 mb-4">
                                    {formData.subServices.map((sub, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                            <Input
                                                type="text"
                                                value={sub.name}
                                                readOnly={true}
                                                className="h-[60px] rounded-[15px] border border-gray-300 flex-1"
                                            />
                                            <Input
                                                type="text"
                                                value={`N${sub.from}`}
                                                readOnly={true}
                                                className="h-[60px] rounded-[15px] border border-gray-300 w-24 text-center"
                                            />
                                            <Input
                                                type="text"
                                                value={`N${sub.to}`}
                                                readOnly={true}
                                                className="h-[60px] rounded-[15px] border border-gray-300 w-24 text-center"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveSubService(index)}
                                                className="text-gray-500 hover:text-red-500 p-2"
                                                title="Remove Sub-Service"
                                            >
                                                <XMarkIcon className="h-5 w-5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {/* New Sub-Service Input Fields */}
                                <div className="flex items-center gap-3 mb-4">
                                    <Input
                                        type="text"
                                        placeholder="Subservice name"
                                        value={newSubServiceName}
                                        onChange={(e) => setNewSubServiceName(e.target.value)}
                                        className="h-[60px] rounded-[15px] border border-gray-300 flex-1"
                                    />
                                    <Input
                                        type="text" // Changed to text to allow 'N' symbol if you wish, or can keep as 'number' and handle formatting
                                        placeholder="From"
                                        value={newSubServiceFrom}
                                        onChange={(e) => setNewSubServiceFrom(e.target.value)}
                                        className="h-[60px] rounded-[15px] border border-gray-300 w-24 text-center"
                                    />
                                    <Input
                                        type="text" // Changed to text to allow 'N' symbol if you wish, or can keep as 'number' and handle formatting
                                        placeholder="To"
                                        value={newSubServiceTo}
                                        onChange={(e) => setNewSubServiceTo(e.target.value)}
                                        className="h-[60px] rounded-[15px] border border-gray-300 w-24 text-center"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddSubService}
                                        className="p-2 text-gray-500 hover:text-green-600"
                                        title="Add Sub-Service"
                                    >
                                        <PlusCircleIcon className="h-6 w-6" />
                                    </button>
                                </div>
                            </div>

                        </div>

                        {/* Post Service Button */}
                        <Button
                            onClick={handlePostService}
                            className="w-full max-w-md py-3 px-4 rounded-lg font-semibold mt-8"
                            style={brandBgStyle}
                        >
                            <span style={contrastTextStyle}>Post Service</span>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {/* Service Category Select Modal */}
            <Modal
                isOpen={showServiceCategorySelectModal}
                onClose={() => setShowServiceCategorySelectModal(false)}
                title="Select Service Category"
            >
                <div className="space-y-2">
                    {dummyServiceCategories.map((cat) => (
                        <div
                            key={cat}
                            className="p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50"
                            onClick={() => handleServiceCategorySelect(cat)}
                        >
                            {cat}
                        </div>
                    ))}
                </div>
            </Modal>
        </div>
    );
}

export default AddServicePage;