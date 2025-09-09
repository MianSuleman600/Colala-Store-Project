import React from 'react';
import { CameraIcon, VideoCameraIcon, XMarkIcon } from '@heroicons/react/24/outline';

const MAX_IMAGES = 3;

const ProductMediaUpload = ({
  productImages,
  productVideo,
  handleFileChange,
  handleRemoveImage,
  handleRemoveVideo,
  validationErrors,
}) => {
  return (
    <div className="bg-white p-6 rounded-2xl space-y-6">
      {/* Video Upload */}
      <div>
        <h3 className="text-base font-medium text-gray-800 mb-2">Upload at least 1 Video of your product</h3>
        <div className="w-25 h-25 flex items-center justify-center rounded-xl overflow-hidden border border-gray-300 relative aspect-video bg-gray-50">
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
        {validationErrors.productVideo && <p className="text-red-500 text-sm mt-2">{validationErrors.productVideo}</p>}
      </div>

      {/* Images Upload */}
      <div>
        <h3 className="text-base font-medium text-gray-800 mb-2">Upload at least 3 clear pictures of your product</h3>
        <div className="flex flex-wrap gap-4">
          {productImages.map((image, index) => (
            <div key={index} className="relative w-25 h-25 rounded-xl overflow-hidden border border-gray-300">
              <img src={image.fileUrl} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
              <button
                onClick={() => handleRemoveImage(index)}
                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md text-red-500 hover:text-red-700 transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          ))}

          {/* Upload new image button */}
          {productImages.length < MAX_IMAGES && (
            <label
              htmlFor="productImages-upload"
              className="w-25 h-25 flex items-center justify-center rounded-xl border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <CameraIcon className="w-7 h-7 text-gray-400" />
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
        {validationErrors.productImages && <p className="text-red-500 text-sm mt-2">{validationErrors.productImages}</p>}
      </div>
    </div>
  );
};

export default ProductMediaUpload;
