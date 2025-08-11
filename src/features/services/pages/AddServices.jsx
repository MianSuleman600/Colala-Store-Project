import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useGetStoreProfileQuery } from '../../../services/storeProfileApi';
import {getContrastTextColor} from '../../../utils/colorUtils'
import {
    XMarkIcon,
    CameraIcon,
    ChevronDownIcon,
    PlusCircleIcon,
    BriefcaseIcon
} from '@heroicons/react/24/outline';



// --- Reusable Input ---
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

// --- Reusable Button ---
const Button = ({ onClick, className, children, style }) => (
    <button onClick={onClick} className={className} style={style}>
        {children}
    </button>
);

// --- Modal Component ---
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

// Dummy service categories
const dummyServiceCategories = [
    'Consulting',
    'Repairs',
    'Tutoring',
    'Cleaning',
    'Digital Marketing',
    'Event Planning'
];

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
            { name: 'General', from: '5,000', to: '20,000' },
            { name: 'Male Wear', from: '5,000', to: '20,000' },
            { name: 'Female Wear', from: '5,000', to: '20,000' }
        ]
    });

    const [validationErrors, setValidationErrors] = useState({});
    const [showServiceCategorySelectModal, setShowServiceCategorySelectModal] = useState(false);
    const [newSubServiceName, setNewSubServiceName] = useState('');
    const [newSubServiceFrom, setNewSubServiceFrom] = useState('');
    const [newSubServiceTo, setNewSubServiceTo] = useState('');

    const { userId, isLoggedIn } = useSelector((state) => state.user);
    const { data: storeProfile } = useGetStoreProfileQuery(userId, {
        skip: !isLoggedIn || !userId,
    });

    // Dynamic brand color from API
    const brandColor = storeProfile?.brandColor || '#EF4444';
    const contrastTextColor = getContrastTextColor(brandColor);

    const brandBgStyle = { backgroundColor: brandColor, color: contrastTextColor };
    const brandTextStyle = { color: brandColor };
    const contrastTextStyle = { color: contrastTextColor };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        setValidationErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        const newFiles = Array.from(files).map(file => ({
            file: file,
            fileUrl: URL.createObjectURL(file),
            fileName: file.name
        }));

        if (name === "serviceImages") {
            setFormData(prev => ({
                ...prev,
                serviceImages: [...prev.serviceImages, ...newFiles].slice(0, 5)
            }));
        } else if (name === "serviceVideo") {
            setFormData(prev => ({ ...prev, serviceVideo: newFiles[0] || null }));
        }
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
    };

    const handleAddSubService = () => {
        if (newSubServiceName && newSubServiceFrom && newSubServiceTo) {
            setFormData(prev => ({
                ...prev,
                subServices: [...prev.subServices, {
                    name: newSubServiceName,
                    from: newSubServiceFrom,
                    to: newSubServiceTo
                }]
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

    const validateForm = () => {
        let errors = {};
        if (!formData.serviceName.trim()) errors.serviceName = 'Service Name is required.';
        if (!formData.serviceCategory) errors.serviceCategory = 'Category is required.';
        if (!formData.shortDescription.trim()) errors.shortDescription = 'Short description is required.';
        if (!formData.fullDescription.trim()) errors.fullDescription = 'Full description is required.';
        if (formData.serviceImages.length < 1) errors.serviceImages = 'Upload at least 1 image.';
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handlePostService = () => {
        if (validateForm()) {
            console.log("Service Data Submitted:", formData);
            alert("Service posted successfully! (Simulated)");
        } else {
            alert("Please correct the errors.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4 lg:p-8">
            <div className="relative flex w-full max-w-[1200px] bg-white rounded-2xl shadow-xl overflow-hidden p-8">
                <div className="flex flex-col md:flex-row w-full gap-8">
                    
                    {/* Left column - Media */}
                    <div className="flex-1 flex flex-col space-y-6 text-left">
                        <h1 className="text-3xl font-bold text-gray-800 mb-4">Add Service</h1>
                        <div className="grid grid-cols-2 gap-4">
                            {formData.serviceImages.map((img, index) => (
                                <div key={index} className="relative w-[100px] h-[100px] rounded-lg border border-gray-300">
                                    <img src={img.fileUrl} alt="" className="w-full h-full object-cover rounded-lg" />
                                    <button onClick={() => handleRemoveImage(index)}
                                        className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1">
                                        <XMarkIcon className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                            {formData.serviceImages.length < 5 && (
                                <label className="w-[100px] h-[100px] rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400">
                                    <CameraIcon className="h-8 w-8 text-gray-400" />
                                    <span className="text-xs text-gray-500 mt-1">Add Image</span>
                                    <input type="file" name="serviceImages" className="sr-only" onChange={handleFileChange} accept="image/*" multiple />
                                </label>
                            )}
                        </div>
                        {validationErrors.serviceImages && <p className="text-xs mt-1" style={brandTextStyle}>{validationErrors.serviceImages}</p>}
                    </div>

                    {/* Right column - Form */}
                    <div className="flex-1 flex flex-col space-y-6 items-center">
                        <div className="w-full max-w-md space-y-4">
                            <Input type="text" name="serviceName" placeholder="Service Name"
                                value={formData.serviceName} onChange={handleChange}
                                className="h-[60px] rounded-[15px] border border-gray-300"
                                error={validationErrors.serviceName} />

                            {/* Category */}
                            <div className="relative">
                                <div className="flex items-center justify-between p-3 rounded-[15px] border border-gray-300 bg-white cursor-pointer h-[60px]"
                                    onClick={() => setShowServiceCategorySelectModal(true)}>
                                    <div className="flex items-center gap-2">
                                        <BriefcaseIcon className="h-5 w-5 text-gray-400" />
                                        <span>{formData.serviceCategory || 'Service Category'}</span>
                                    </div>
                                    <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                                </div>
                                {validationErrors.serviceCategory && <p className="text-xs mt-1" style={brandTextStyle}>{validationErrors.serviceCategory}</p>}
                            </div>

                            {/* Short Description */}
                            <Input type="text" name="shortDescription" placeholder="Short description"
                                value={formData.shortDescription} onChange={handleChange}
                                className="h-[60px] rounded-[15px] border border-gray-300"
                                error={validationErrors.shortDescription} />

                            {/* Full Description */}
                            <textarea name="fullDescription" placeholder="Add Full Description"
                                value={formData.fullDescription} onChange={handleChange}
                                rows="4" className="w-full p-3 rounded-[15px] border border-gray-300" />

                            {/* Sub-services */}
                            <div className="w-full mt-4">
                                {formData.subServices.map((sub, index) => (
                                    <div key={index} className="flex gap-2 mb-2">
                                        <Input type="text" value={sub.name} readOnly className="flex-1 rounded-[15px] border border-gray-300" />
                                        <button onClick={() => handleRemoveSubService(index)} className="p-2 text-red-500">
                                            <XMarkIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                ))}
                                <div className="flex gap-2">
                                    <Input type="text" placeholder="Subservice name" value={newSubServiceName}
                                        onChange={(e) => setNewSubServiceName(e.target.value)}
                                        className="flex-1 rounded-[15px] border border-gray-300" />
                                    <button onClick={handleAddSubService} className="p-2 text-green-500">
                                        <PlusCircleIcon className="h-6 w-6" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Submit button */}
                        <Button onClick={handlePostService} className="w-full max-w-md py-3 px-4 rounded-lg font-semibold mt-8"
                            style={brandBgStyle}>
                            <span style={contrastTextStyle}>Post Service</span>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Category modal */}
            <Modal isOpen={showServiceCategorySelectModal} onClose={() => setShowServiceCategorySelectModal(false)} title="Select Service Category">
                <div className="space-y-2">
                    {dummyServiceCategories.map((cat) => (
                        <div key={cat} className="p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50"
                            onClick={() => handleServiceCategorySelect(cat)}>
                            {cat}
                        </div>
                    ))}
                </div>
            </Modal>
        </div>
    );
}

export default AddServicePage;
