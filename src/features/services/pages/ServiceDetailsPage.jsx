// src/features/services/pages/ServiceDetailsPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Button from '../../../components/ui/Button';
import { getContrastTextColor } from '../../../utils/colorUtils';

// Icons for the details page
import {
    StarIcon,
    TrashIcon, // For delete
    ChartBarIcon, // For statistics
    PencilSquareIcon, // For edit
    PlayCircleIcon, // For video play icon overlay
    HeartIcon, // For the heart icon in the header
    EllipsisHorizontalIcon // For the ellipsis icon in the header
} from '@heroicons/react/24/outline'; // Using outline for consistency, can be solid if needed

// Dummy images for demonstration
import serviceImage1 from '../../../assets/images/productImages/1.png'; // Main service image
import serviceImageThumb1 from '../../../assets/images/productImages/2.jpeg'; // Thumbnail 1
import serviceImageThumb2 from '../../../assets/images/productImages/3.jpeg'; // Thumbnail 2
import userProfilePic from '../../../assets/images/profileImage.png';

const ServiceDetailsPage = () => {
    const { serviceId } = useParams();
    const navigate = useNavigate();
    const brandColor = useSelector(state => state.ui?.brandColor) || '#EF4444';
    const contrastTextColor = getContrastTextColor(brandColor);

    // Dummy service data (in a real app, you'd fetch this using serviceId)
    const service = {
        id: serviceId,
        images: [
            serviceImage1,
            serviceImageThumb1,
            serviceImageThumb2,
        ],
        // Assuming the first image might have a video overlay for demonstration
        hasVideo: true, // Set to true if there's a video on the main image
        name: 'Sasha Fashion Designing',
        minPrice: 5000,
        maxPrice: 100000,
        userName: 'Sasha Stores', // This will only be used for the image overlay
        profilePic: userProfilePic, // This will only be used for the image overlay
        rating: 4.5,
        description: 'We sew all kinds of dresses, we are your one stop shop for any form of dresses',
        priceBreakdown: [
            { type: 'General', min: 5000, max: 10000 },
            { type: 'Male Wear', min: 5000, max: 10000 }, // Corrected case as per image
            { type: 'Female Wear', min: 5000, max: 10000 }, // Corrected case as per image
            { type: 'Kids Wear', min: 5000, max: 10000 }, // Corrected case as per image
            { type: 'Wedding Wears', min: 5000, max: 10000 }, // Corrected case as per image
            { type: 'Tents', min: 5000, max: 10000 },
        ],
    };

    const [mainImage, setMainImage] = useState(service.images[0]);

    const handleDeleteService = () => {
        // IMPORTANT: Replace window.confirm with a custom modal UI in a real application
        if (window.confirm(`Are you sure you want to delete service ${service.name} (ID: ${service.id})?`)) {
            // Implement actual delete logic here
            console.log(`Deleting service: ${service.id}`);
            navigate('/my-services'); // Go back to services list after delete
        }
    };

    const handleViewStatistics = () => {
        alert(`Viewing statistics for service: ${service.name}`);
        // Navigate to a statistics page or open a modal
    };

    const handleEditService = () => {
        navigate(`/my-services/${service.id}/edit`);
    };

    return (
        <div className="container mx-auto p-4 md:p-8 bg-gray-50 min-h-screen font-inter">
            {/* Header / Breadcrumb */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800" style={{ fontFamily: 'Manrope' }}>
                    My Service / <span style={{ color: brandColor }}>Service Details</span>
                </h1>
                {/* Icons for like/share (as seen in 3.png, top right) */}
                <div className="flex space-x-4">
                    {/* Heart Icon (Like) - Using Heroicon now */}
                    <HeartIcon className="w-6 h-6 text-gray-600 cursor-pointer hover:text-red-500 transition-colors" />
                    {/* Ellipsis Icon (More Options) - Using Heroicon now */}
                    <EllipsisHorizontalIcon className="w-6 h-6 text-gray-600 cursor-pointer hover:text-gray-800 transition-colors" />
                </div>
            </div>

            {/* Main Content Area */}
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-8 border border-gray-200">
                {/* Left Column: Image Gallery */}
                {/* This div now acts as the container for the vertical thumbnails and the main image */}
                <div className="flex flex-col lg:flex-row items-center lg:items-start lg:col-span-1 space-y-4 lg:space-y-0 lg:space-x-4">
                    {/* Thumbnails on the left (vertical stack) */}
                    <div className="flex flex-row lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2 flex-shrink-0">
                        {service.images.map((img, index) => (
                            <img
                                key={index}
                                src={img}
                                alt={`Thumbnail ${index + 1}`}
                                className={`w-16 h-16 object-cover rounded-md cursor-pointer transition-all duration-200
                                    ${mainImage === img ? 'border-2 border-blue-500 shadow-md' : 'border-2 border-transparent hover:border-gray-300'}`}
                                onClick={() => setMainImage(img)}
                            />
                        ))}
                    </div>
                    {/* Main Image Display */}
                    <div className="relative w-full h-80 rounded-2xl overflow-hidden shadow-md flex-grow">
                        <img src={mainImage} alt={service.name} className="w-full h-full object-cover" />
                        {/* Play Icon Overlay (if hasVideo is true) */}
                        {service.hasVideo && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black opacity-40">
                                <PlayCircleIcon className="h-20 w-20 text-white cursor-pointer opacity-80 hover:opacity-100 transition-opacity" />
                            </div>
                        )}
                        {/* User Info Overlay (Sasha Stores + Rating) */}
                        {(service.userName || service.profilePic || service.rating) && (
                            <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-3 bg-black opacity-80 ">
                                <div className="flex items-center">
                                    {service.profilePic && (
                                        <img src={service.profilePic} alt="Profile" className="w-6 h-6 rounded-full mr-2 object-cover" />
                                    )}
                                    {service.userName && (
                                        <span className="text-sm font-medium text-white">{service.userName}</span>
                                    )}
                                </div>
                                {service.rating && (
                                    <div className="flex items-center text-sm text-white">
                                        <StarIcon className="h-4 w-4 text-yellow-500 mr-1 fill-yellow-500" />
                                        <span>{service.rating}</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Service Details, Description, Price Breakdown */}
                <div className="flex flex-col lg:col-span-2">
                    {/* Service Name and Rating */}
                    <div className="flex justify-between items-center mb-2"> {/* Changed items-start to items-center */}
                        <h2 className="text-2xl font-bold text-gray-900">{service.name}</h2>
                        {service.rating && (
                            <div className="flex items-center text-lg text-gray-600 flex-shrink-0"> {/* Added flex-shrink-0 */}
                                <StarIcon className="h-5 w-5 text-yellow-500 mr-1 fill-yellow-500" />
                                <span className="text-md font-medium">{service.rating}</span> {/* Adjusted font size */}
                            </div>
                        )}
                    </div>

                    {/* Price Range */}
                    <div className="flex items-baseline mb-4">
                        <span className="text-2xl font-bold" style={{ color: brandColor }}>
                            ₦{service.minPrice.toLocaleString()} - ₦{service.maxPrice.toLocaleString()}
                        </span>
                    </div>

                    {/* Horizontal Line after Price Range */}
                    <hr className="my-4 border-gray-300" /> {/* Added hr here */}

                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3> {/* Removed mt-4 */}
                    <p className="text-gray-700 mb-6 leading-relaxed">{service.description}</p>

                    {/* Horizontal Line after Description */}
                    <hr className="my-4 border-gray-300" /> {/* Added hr here */}


                    <h3 className="text-lg  text-gray-800 mb-3">Price Breakdown</h3>
                    <div className="space-y-3 mb-8">
                        {service.priceBreakdown.map((item, index) => (
                            <div key={index} className="flex justify-between items-center bg-[#ededed] p-3 rounded-lg border border-gray-200">
                                <span className="font-medium text-gray-700">{item.type}</span>
                                <span className="font-semibold text-lg" style={{ color: brandColor }}>
                                    ₦{item.min.toLocaleString()} - ₦{item.max.toLocaleString()}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Action Buttons at the bottom */}
                    {/* Horizontal Line before Action Buttons */}
                    <hr className="my-4 border-gray-300" /> {/* Added hr here */}

                    <div className="flex justify-between items-center w-full mt-auto pt-6"> {/* Removed border-t border-gray-100 as hr is now used */}
                        <div className="flex space-x-3 ">
                            <Button
                                onClick={handleDeleteService}
                                className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors shadow-sm"
                                aria-label="Delete Service"
                            >
                                <TrashIcon className="h-6 w-6" />
                            </Button>
                            <Button
                                onClick={handleViewStatistics}
                                className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors shadow-sm"
                                aria-label="View Statistics"
                            >
                                <ChartBarIcon className="h-6 w-6" />
                            </Button>
                        </div>
                        <Button
                            onClick={handleEditService}
                            className="px-6 py-3 rounded-lg font-semibold w-full shadow-md hover:shadow-lg transition-shadow flex items-center"
                            style={{ backgroundColor: brandColor, color: contrastTextColor }}
                        >
                            <PencilSquareIcon className="h-5 w-5 mr-2" /> Edit Service
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceDetailsPage;
