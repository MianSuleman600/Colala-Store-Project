// src/components/products/ProductMediaUpload.jsx

import React from 'react';
import { CameraIcon, VideoCameraIcon, XMarkIcon } from '@heroicons/react/24/outline';

const MAX_IMAGES = 3;

const ProductMediaUpload = ({
  productImages, // This might be undefined initially
  productVideo,
  handleFileChange,
  handleRemoveImage,
  handleRemoveVideo,
  validationErrors,
}) => {
  // --- FIX: Ensure productImages is always an array before mapping ---
  const images = productImages ?? [];

  return (
    <div className="bg-white p-6 rounded-2xl space-y-6">
      {/* Video Upload */}
      <div>
        <h3 className="text-base font-medium text-gray-800 mb-2">Upload at least 1 Video of your product</h3>
        <div className="w-full sm:w-1/2 md:w-1/3 h-auto flex items-center justify-center rounded-xl overflow-hidden border border-gray-300 relative aspect-video bg-gray-50">
          {productVideo ? (
            <>
              <video src={productVideo.fileUrl} controls className="w-full h-full object-cover" />
              <button
                onClick={handleRemoveVideo}
                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md text-red-500 hover:text-red-700 transition-colors z-10"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </>
          ) : (
            <label
              htmlFor="productVideo-upload"
              className="w-full h-full flex flex-col items-center justify-center cursor-pointer text-gray-400"
            >
              <VideoCameraIcon className="w-7 h-7" />
              <span className="mt-2 text-[10px]">Upload Video</span>
              <input
                id="productVideo-upload"
                name="productVideo"
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="sr-only"
              />
            </label>
          )}
        </div>
        {validationErrors?.productVideo && <p className="text-red-500 text-sm mt-2">{validationErrors.productVideo}</p>}
      </div>

      {/* Images Upload */}
      <div>
        <h3 className="text-base font-medium text-gray-800 mb-2">Upload at least 3 clear pictures of your product</h3>
        <div className="flex flex-wrap gap-4">
          {/* Use the safe 'images' array */}
          {images.map((image, index) => (
            <div key={index} className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden border border-gray-300">
              <img src={image.fileUrl} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
              <button
                onClick={() => handleRemoveImage(index)}
                className="absolute top-1 right-1 bg-white rounded-full p-0.5 shadow-md text-red-500 hover:text-red-700 transition-colors"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          ))}

          {/* Upload new image button */}
          {images.length < MAX_IMAGES && (
            <label
              htmlFor="productImages-upload"
              className="w-24 h-24 sm:w-28 sm:h-28 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-100 transition-colors text-gray-400"
            >
              <CameraIcon className="w-7 h-7" />
              <span className="text-xs mt-1">Add Image</span>
              <input
                id="productImages-upload"
                name="productImages"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="sr-only"
              />
            </label>
          )}
        </div>
        {validationErrors?.productImages && <p className="text-red-500 text-sm mt-2">{validationErrors.productImages}</p>}
      </div>
    </div>
  );
};

export default ProductMediaUpload;