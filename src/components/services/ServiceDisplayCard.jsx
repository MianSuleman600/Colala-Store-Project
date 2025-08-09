    // src/components/services/ServiceDisplayCard.jsx
    import React from 'react';
    // IMPORTANT: Ensure 'Link' is NOT imported if the Details button should only open a modal
    // import { Link } from 'react-router-dom';
    import Button from '../ui/Button';
    import Card from '../ui/Card';

    // Icons
    import {
        StarIcon
    } from '@heroicons/react/24/outline';

    /**
     * ServiceDisplayCard Component
     * Displays a single service with its image, name, price range,
     * and statistics (service views, product clicks, messages).
     * The "Details" button now triggers a callback to open the statistics modal.
     *
     * @param {object} props
     * @param {object} props.service - The service object to display.
     * @param {string} props.service.id - Unique ID of the service.
     * @param {string} props.service.imageUrl - URL of the service image.
     * @param {string} props.service.name - Name of the service (e.g., "Sasha Fashion Designer").
     * @param {number} props.service.minPrice - Minimum price of the service.
     * @param {number} props.service.maxPrice - Maximum price of the service.
     * @param {number} [props.service.serviceViews=0] - Number of service views.
     * @param {number} [props.service.productClicks=0] - Number of product clicks (renamed to Service Clicks conceptually).
     * @param {number} [props.service.messages=0] - Number of messages/chats received.
     * @param {string} [props.service.userName] - Name of the service provider (e.g., "Sasha Stores").
     * @param {string} [props.service.profilePic] - URL of the service provider's profile picture.
     * @param {number} [props.service.rating] - Rating of the service (e.g., 4.5).
     * @param {string} props.brandColor - Primary brand color for styling.
     * @param {function} props.onViewStatsClick - Callback to open the service statistics modal.
     */
    const ServiceDisplayCard = ({
        service,
        brandColor,
        onViewStatsClick, // This prop is crucial for opening the modal
    }) => {
        // Default values for stats if not provided
        // IMPORTANT: Using optional chaining (?. ) here to prevent TypeError if 'service' is undefined
        const serviceViews = service?.serviceViews || 200;
        const productClicks = service?.productClicks || 15;
        const messages = service?.messages || 3;

        return (
            <Card className="relative flex flex-col p-0 rounded-2xl shadow-lg w-full max-w-sm mx-auto overflow-hidden">
                {/* Image Section with User Info Overlay */}
                <div className="relative w-full h-48 overflow-hidden">
                    {service?.imageUrl ? ( // Added optional chaining here
                        <img
                            src={service.imageUrl}
                            alt={service.name}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/300x192/e0e0e0/000000?text=No+Image"; }}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                            No Image Available
                        </div>
                    )}

                    {/* User Info (positioned over the image) - similar to Ad Preview */}
                    {(service?.userName || service?.profilePic || service?.rating) && ( // Added optional chaining here
                        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-3 bg-white bg-opacity-80 backdrop-blur-sm">
                            <div className="flex items-center">
                                {service?.profilePic && ( // Added optional chaining here
                                    <img src={service.profilePic} alt="Profile" className="w-6 h-6 rounded-full mr-2 object-cover" />
                                )}
                                {service?.userName && ( // Added optional chaining here
                                    <span className="text-sm font-medium text-gray-800">{service.userName}</span>
                                )}
                            </div>
                            {service?.rating && ( // Added optional chaining here
                                <div className="flex items-center text-sm text-gray-600">
                                    <StarIcon className="h-4 w-4 text-yellow-500 mr-1 fill-yellow-500" />
                                    <span>{service.rating}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Service Details Section */}
                <div className="p-4 flex flex-col items-start">
                    {/* Service Name */}
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{service?.name}</h3> {/* Added optional chaining here */}

                    {/* Price Range */}
                    <div className="flex items-baseline mb-3">
                        <span className="text-xl font-bold" style={{ color: brandColor }}>
                            ₦{service?.minPrice?.toLocaleString()} - ₦{service?.maxPrice?.toLocaleString()} {/* Added optional chaining here */}
                        </span>
                    </div>

                    <hr className="my-2 border-gray-300 w-full" />

                    {/* Service Statistics */}
                    <div className="flex gap-2 flex-col mb-4 text-sm text-gray-700 w-full">
                        <div className="flex justify-between items-center">
                            <span>Service Views</span>
                            <span className="font-semibold">{serviceViews}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span>Product Clicks</span>
                            <span className="font-semibold">{productClicks}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span>Messages</span>
                            <span className="font-semibold">{messages}</span>
                        </div>
                    </div>

                    {/* DETAILS BUTTON: This is the crucial part. It should NOT be a Link. */}
                    {/* It should directly call the onViewStatsClick prop. */}
                    <Button
                        onClick={() => onViewStatsClick(service.id)} // This line is correct for opening the modal
                        className="w-full py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition-shadow"
                        style={{ backgroundColor: brandColor, color: 'white' }}
                    >
                        Details
                    </Button>
                </div>
            </Card>
        );
    };

    export default ServiceDisplayCard;
    