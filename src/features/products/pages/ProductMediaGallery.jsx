import React from 'react';
import { VideoCameraIcon } from '@heroicons/react/24/outline';
import { FALLBACK_IMAGE, isVideoUrl } from '../../../utils/mediaUtils';

const ProductMediaGallery = ({
  brandColor = '#EF4444',
  mediaRawList = [],
  selectedRaw,
  selectedDisplay,
  isVideoDisplay,
  videoRef,
  isPlaying,
  onThumbClick,
  onPlayClick,
  onVideoError,
  onImageError, // (src) => (e) => void
  overlayBottom = null,
}) => {
  const selectedBorder = { borderColor: brandColor };

  return (
    <div className="flex flex-col lg:flex-row-reverse gap-4 lg:h-[400px]">
      {/* Main viewer */}
      <div className="flex-1 relative rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center p-2 border border-gray-200 aspect-w-16 aspect-h-9">
        {!isVideoDisplay ? (
          <img
            src={selectedDisplay || FALLBACK_IMAGE}
            alt="Selected"
            className="w-full h-full object-contain rounded-lg"
            // Attach error handler only if it's not the fallback itself
            onError={
              selectedDisplay && selectedDisplay !== FALLBACK_IMAGE
                ? onImageError(selectedDisplay)
                : undefined
            }
          />
        ) : (
          <>
            <video
              key={selectedDisplay || 'video'}         // Force remount on src change
              ref={videoRef}
              src={selectedDisplay}
              className="w-full h-full object-contain bg-black rounded-lg"
              controls
              playsInline
              preload="metadata"
              crossOrigin="anonymous"
              onError={onVideoError}
            />
            {!isPlaying && (
              <button
                type="button"
                onClick={onPlayClick}
                className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg"
                aria-label="Play video"
                title="Play video"
              >
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-black/60">
                  <VideoCameraIcon className="w-9 h-9 text-white" />
                </div>
              </button>
            )}
          </>
        )}

        {overlayBottom ? (
          <div className="absolute bottom-0 left-0 right-0">
            {overlayBottom}
          </div>
        ) : null}
      </div>

      {/* Thumbnails */}
      {mediaRawList.length > 0 && (
        <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto pb-2 lg:pb-0 lg:h-full">
          {mediaRawList.map((rawSrc, index) => {
            const isVid = isVideoUrl(rawSrc);
            const isSelected = selectedRaw === rawSrc;

            return (
              <button
                key={`${rawSrc}-${index}`}
                type="button"
                className={`relative w-20 h-20 rounded-lg border-2 flex items-center justify-center overflow-hidden ${
                  isSelected ? 'border-blue-500' : 'border-gray-300'
                }`}
                style={isSelected ? selectedBorder : {}}
                onClick={() => onThumbClick(rawSrc)}
                title={isVid ? 'Video' : 'Image'}
              >
                {isVid ? (
                  <div className="w-full h-full bg-black/70 flex items-center justify-center">
                    <VideoCameraIcon className="w-7 h-7 text-white" />
                  </div>
                ) : (
                  <img
                    src={rawSrc || FALLBACK_IMAGE}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={
                      rawSrc && rawSrc !== FALLBACK_IMAGE
                        ? onImageError(rawSrc)
                        : undefined
                    }
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductMediaGallery;