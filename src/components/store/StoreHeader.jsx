//D:\Project\frontend\src\components\store\StoreHeader.jsx
import React from 'react';
import ImagePlaceholder from '../ui/ImagePlaceholder';
import shareIcon from '../../assets/icons/Shareee.png';
import leftIcon from '../../assets/icons/CaretLeft.png';

const StoreHeader = ({
    bannerImageUrl,
    profilePictureUrl,
    isModalOpen, // New prop to control button visibility
    handleGoBack,
    handleShare,
}) => {
    return (
        <div className={`w-full h-[200px] bg-gray-200 mb-6 relative rounded-2xl`}>
            {/* Optimized Banner Image */}
            {/* Added width, height, and loading attributes to prevent CLS and improve LCP.
                The width is an estimated value to maintain aspect ratio on different screens,
                but the height is fixed at 200px to match your existing design.
                The loading="eager" is crucial for this LCP-critical image. */}
            <ImagePlaceholder
                src={bannerImageUrl}
                alt="Store Banner"
                className="w-full h-full rounded-2xl object-cover"
                placeholderText="Store Banner"
                width={1200} // Estimated width for a desktop view
                height={200} // Fixed height from your Tailwind class: h-[200px]
                loading="eager" // Load this critical image immediately
            />

            {/* Back Icon - Now controlled by isModalOpen */}
            {isModalOpen && (
                <div className="absolute top-4 left-4">
                    <button
                        onClick={handleGoBack}
                        className="p-2 rounded-full bg-gray-300 bg-opacity-70 text-black hover:bg-opacity-90 transition-colors shadow-md"
                    >
                        <img src={leftIcon} alt="Back" className="w-6 h-6" />
                    </button>
                </div>
            )}

            {/* Share Icon - Now controlled by isModalOpen */}
            {isModalOpen && (
                <div className="absolute top-4 right-4">
                    <button
                        onClick={handleShare}
                        className="p-2 rounded-full bg-gray-300 bg-opacity-60 text-white hover:bg-opacity-90 transition-colors shadow-md"
                    >
                        <img src={shareIcon} alt="Share" className="w-6 h-6" />
                    </button>
                </div>
            )}

            {/* Optimized Profile Picture */}
            {/* Added width, height, and loading attributes.
                Dimensions are based on your Tailwind w-20 and h-20 classes (80px).
                The loading="lazy" defers the loading of this non-critical image. */}
            <ImagePlaceholder
                src={profilePictureUrl}
                alt="Profile Picture"
                className="w-20 h-20 rounded-full object-cover border-4 border-white absolute left-6 -bottom-10 shadow-lg"
                placeholderText="Profile"
                width={80} // Dimensions from your Tailwind classes
                height={80} // Dimensions from your Tailwind classes
                loading="lazy" // Use lazy loading for this image
            />
        </div>
    );
};

export default StoreHeader;
