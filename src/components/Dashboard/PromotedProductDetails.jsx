// src/pages/products/PromotedProductDetails.jsx
import React from 'react';
// Removed useParams and useNavigate as it receives product directly and doesn't handle its own navigation
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

// Icons
import {
    ShoppingCartIcon,
    FireIcon,
    PaperClipIcon, // For attachment
    EyeSlashIcon,   // For hide/unpublish
    TrashIcon,      // For delete
    PencilSquareIcon // For edit (though not explicitly in this view, good to have)
} from '@heroicons/react/24/outline';

/**
 * PromotedProductDetails Component
 * Displays the detailed view of a promoted product, including its core information
 * and specific promotion statistics. It matches the 'image_c619cf.png' design.
 * This component is intended to be rendered conditionally (e.g., within a modal)
 * and receives the product data directly as a prop.
 *
 * @param {object} props
 * @param {object} props.product - The full product object to display details for.
 * @param {string} [props.brandColor='#EF4444'] - Primary brand color for styling.
 * @param {string} [props.contrastTextColor='#FFFFFF'] - Text color for contrast.
 * @param {string} [props.lightBrandColor='#FEE2E2'] - Lighter shade of brand color for backgrounds.
 */
const PromotedProductDetails = ({
    product, // Receive product directly as a prop
    brandColor = '#EF4444', // Default red
    contrastTextColor = '#FFFFFF', // Default white
    lightBrandColor = '#FEE2E2', // Default light red
}) => {
    // Removed useParams and useNavigate as they are no longer needed here

    if (!product) {
        // This case should ideally not be hit if the parent correctly passes product
        return <div className="text-center py-12 text-gray-600">Product details not found.</div>;
    }

    const displayPrice = product.discountPrice ? product.discountPrice : product.price;
    const originalPrice = product.discountPrice ? product.price : null;

    // Handler for "Extend Promotion" button
    const handleExtendPromotion = () => {
        console.log(`Extending promotion for product: ${product.id}`);
        // In a real app, you would dispatch an action or open another modal for extension
        alert(`Extending promotion for ${product.name}!`); // Replace with custom modal
    };

    // Handlers for the small action buttons (attachment, hide, delete)
    const handleAttachmentClick = () => {
        console.log('Attachment icon clicked!');
        // Implement attachment-related logic
    };

    const handleHideClick = () => {
        console.log('Hide/Unpublish icon clicked!');
        // Implement hide/unpublish logic
    };

    const handleDeleteClick = () => {
        console.log('Delete icon clicked!');
        // Implement delete logic (e.g., show confirmation modal, then delete)
        if (window.confirm(`Are you sure you want to delete the promotion for ${product.name}?`)) {
            alert('Promotion deleted!'); // Replace with a custom modal
            // You might want to call a prop function here to close the modal and refresh the parent list
        }
    };

    return (
        <div className="p-4 md:p-8"> {/* Removed container mx-auto as it's now inside a modal */}
            

            <Card className="p-4 md:p-6 rounded-xl shadow-lg w-full mx-auto mb-8"> {/* Removed max-w-2xl as it's handled by modal wrapper */}
                {/* Product Image and Sponsored Tag */}
                <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden mb-4">
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x400/e0e0e0/000000?text=No+Image"; }}
                    />
                    {product.isSponsored && (
                        <div className="absolute top-3 left-3 bg-black bg-opacity-70 text-white text-sm font-semibold px-3 py-1.5 rounded-md flex items-center">
                            <FireIcon className="h-5 w-5 mr-1 text-orange-400" /> Sponsored
                        </div>
                    )}
                </div>

                {/* Product Name and Price */}
                <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2">{product.name}</h2>
                <div className="flex items-baseline mb-3">
                    <span className="text-2xl md:text-3xl font-bold" style={{ color: brandColor }}>
                        N{displayPrice.toLocaleString()}
                    </span>
                    {originalPrice && (
                        <span className="text-base md:text-lg text-gray-500 line-through ml-2">
                            N{originalPrice.toLocaleString()}
                        </span>
                    )}
                </div>

                {/* Delivery/Discount Tags and Location */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                    {product.hasFreeDelivery && (
                        <span className="flex items-center rounded-full overflow-hidden shadow-sm">
                            <span className="p-1 flex items-center justify-center bg-red-500">
                                <ShoppingCartIcon className="h-4 w-3 text-white" />
                            </span>
                            <span className="bg-orange-500 text-white text-xs font-medium px-2 py-1">
                                Free delivery
                            </span>
                        </span>
                    )}
                    {product.hasBulkDiscount && (
                        <span className="flex items-center rounded-full overflow-hidden shadow-sm">
                            <span className="p-1 flex items-center justify-center bg-red-500">
                                <ShoppingCartIcon className="h-4 w-3 text-white" />
                            </span>
                            <span className="bg-orange-500 text-white text-xs font-medium px-2 py-1">
                                20% Off in bulk
                            </span>
                        </span>
                    )}
                    {product.location && (
                        <span className="text-sm text-gray-600 ml-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0L6.343 16.657a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {product.location}
                        </span>
                    )}
                </div>
            </Card>

            {/* Promotion Details Section */}
            <Card className="p-4 md:p-6 rounded-xl shadow-lg w-full mx-auto mb-8"> {/* Removed max-w-2xl */}
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Promotion Details</h3>
                <div className="space-y-3">
                    {product.promotionDetails && Object.entries(product.promotionDetails).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center rounded-2xl p-4 bg-[#ededed] border-gray-100 last:border-b-0">
                            <span className="text-gray-700 font-medium capitalize">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                            <span className={`font-semibold ${key === 'status' && value === 'Active' ? 'text-green-600' : 'text-gray-900'}`}>
                                {key === 'costPerClick' || key === 'amountSpent' ? `N${value.toLocaleString()}` : value}
                            </span>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Action Buttons Section */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 w-full mx-auto"> {/* Removed max-w-2xl */}
                <Button
                    onClick={handleAttachmentClick}
                    className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 shadow-md"
                    aria-label="Attachment"
                >
                    <PaperClipIcon className="h-6 w-6" />
                </Button>
                <Button
                    onClick={handleHideClick}
                    className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 shadow-md"
                    aria-label="Hide Promotion"
                >
                    <EyeSlashIcon className="h-6 w-6" />
                </Button>
                <Button
                    onClick={handleDeleteClick}
                    className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 shadow-md"
                    aria-label="Delete Promotion"
                >
                    <TrashIcon className="h-6 w-6" />
                </Button>
                <Button
                    onClick={handleExtendPromotion}
                    style={{ backgroundColor: brandColor, color: contrastTextColor }}
                    className="flex-1 py-3 px-6 rounded-lg font-semibold shadow-md hover:shadow-lg transition-shadow"
                >
                    Extend Promotion
                </Button>
            </div>
        </div>
    );
};

export default PromotedProductDetails;
