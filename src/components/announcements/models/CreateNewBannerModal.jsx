// src/components/announcements/models/CreateNewBannerModal.jsx
import React, { useState } from 'react';
import Button from '../../ui/Button'; // Adjusted path for Button
import { XMarkIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline'; // Close and Upload icon

/**
 * CreateNewBannerModal Component
 * A modal form for creating a new banner, including image upload and a link.
 * Matches the design in 'image_f24925.png'.
 *
 * @param {object} props
 * @param {function} props.onClose - Callback to close the modal.
 * @param {function} props.onSave - Callback to save the new banner data.
 * @param {string} props.brandColor - The primary brand color for styling the save button.
 */
const CreateNewBannerModal = ({ onClose, onSave, brandColor }) => {
    const [bannerImage, setBannerImage] = useState(null); // Stores File object
    const [bannerImageUrl, setBannerImageUrl] = useState(''); // Stores URL for preview
    const [bannerLink, setBannerLink] = useState('');

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setBannerImage(file);
            setBannerImageUrl(URL.createObjectURL(file)); // Create URL for immediate preview
        } else {
            setBannerImage(null);
            setBannerImageUrl('');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!bannerImage || !bannerLink.trim()) {
            alert('Please upload a banner image and provide a link.'); // Replace with custom modal/toast
            return;
        }

        // In a real application, you would upload `bannerImage` to a storage service
        // (e.g., Firebase Storage, AWS S3) and get a permanent URL.
        // For this dummy implementation, we'll use the temporary object URL or a placeholder.
        onSave({
            imageUrl: bannerImageUrl, // In real app, this would be the uploaded URL
            link: bannerLink,
        });
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800 font-serif">New Banner</h2> {/* Font style from image */}
                <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-800"
                    aria-label="Close"
                >
                    <XMarkIcon className="h-6 w-6" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Image Upload Section */}
                <div className="border border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-red-500 transition-colors duration-200">
                    <label htmlFor="banner-upload" className="flex flex-col items-center cursor-pointer text-gray-600">
                        {bannerImageUrl ? (
                            <img src={bannerImageUrl} alt="Banner Preview" className="max-h-48 w-auto object-contain rounded-md mb-2" />
                        ) : (
                            <ArrowUpTrayIcon className="h-10 w-10 text-gray-400 mb-2" />
                        )}
                        <span className="text-sm font-medium">Upload new Banner</span>
                        <input
                            id="banner-upload"
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={handleImageChange}
                        />
                    </label>
                </div>

                {/* Banner Link Input */}
                <div>
                    <input
                        type="url"
                        placeholder="Banner Link"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        value={bannerLink}
                        onChange={(e) => setBannerLink(e.target.value)}
                    />
                </div>

                <Button
                    type="submit"
                    style={{ backgroundColor: brandColor }}
                    className="w-full py-3 rounded-lg font-semibold text-white shadow-md hover:shadow-lg transition-shadow"
                >
                    Save
                </Button>
            </form>
        </div>
    );
};

export default CreateNewBannerModal; // Ensure this line exists and is correct
