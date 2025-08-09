import React from 'react';

/**
 * ImagePlaceholder Component (Optimized)
 * Renders an image with a fallback placeholder. Now includes `width`, `height`, and `loading`
 * attributes to prevent layout shift and improve page performance.
 *
 * @param {object} props
 * @param {string} props.src - The source URL of the image.
 * @param {string} props.alt - Alt text for the image.
 * @param {string} [props.className=''] - Additional Tailwind CSS classes for the image.
 * @param {string} [props.placeholderText='Image'] - Text to display in the placeholder.
 * @param {boolean} [props.isGuestView=false] - If true, applies styling for a guest/disabled view.
 * @param {number|string} [props.width] - The explicit width of the image. Crucial for preventing CLS.
 * @param {number|string} [props.height] - The explicit height of the image. Crucial for preventing CLS.
 * @param {string} [props.loading='eager'] - Defines when the browser should load the image. 'eager' or 'lazy'.
 */
const ImagePlaceholder = ({
    src,
    alt,
    className = '',
    placeholderText = 'Image',
    isGuestView = false,
    width,
    height,
    loading = 'eager'
}) => {
    const [imageError, setImageError] = React.useState(false);

    // Reset error state if src changes
    React.useEffect(() => {
        setImageError(false);
    }, [src]);

    const handleImageError = () => {
        setImageError(true);
    };

    // Combine the passed className with the guest view opacity
    const combinedClasses = `${className} object-cover ${isGuestView ? 'opacity-50' : ''}`;

    // Create an object for dimension props to avoid adding undefined attributes
    const dimensions = {};
    if (width) dimensions.width = width;
    if (height) dimensions.height = height;

    if (imageError || !src) {
        // Render a basic placeholder div if image fails or src is not provided
        // The width and height attributes are applied to the placeholder div as well,
        // which prevents the layout from shifting while the image is missing.
        return (
            <div
                className={`flex items-center justify-center bg-gray-200 text-gray-500 ${combinedClasses}`}
                {...dimensions}
            >
                <span className="text-xs">{placeholderText}</span>
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            className={combinedClasses} // Apply combinedClasses to the img tag
            onError={handleImageError}
            {...dimensions} // Apply the width and height attributes
            loading={loading} // Apply the loading attribute
        />
    );
};

export default ImagePlaceholder;
