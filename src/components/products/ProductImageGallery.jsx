import React, { useState, useRef } from 'react';
import { Play, Pause } from 'lucide-react';

const ProductImageGallery = ({ images, video }) => {
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoError, setVideoError] = useState(null);
  const videoRef = useRef(null);

  // Combine images and video into a single media array
  const mediaItems = [];
  
  // Add video first if it exists
  if (video) {
    mediaItems.push({
      id: 'video',
      type: 'video',
      path: video,
      is_main: false
    });
  }
  
  // Add images
  if (images && images.length > 0) {
    mediaItems.push(...images.map(img => ({ ...img, type: 'image' })));
  }

  if (mediaItems.length === 0) {
    return (
      <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
        <span className="text-gray-500">No media available</span>
      </div>
    );
  }

  const selectedMedia = mediaItems[selectedMediaIndex];
  const isVideo = selectedMedia.type === 'video';
  const mediaUrl = `${import.meta.env.VITE_API_URL || 'https://colala.hmstech.xyz'}/storage/${selectedMedia.path}`;

  // Debug info for video
  if (isVideo) {
    console.log('Video URL:', mediaUrl);
    console.log('Video path:', selectedMedia.path);
  }

  const handlePlayPause = async () => {
    if (isVideo && videoRef.current) {
      try {
        if (isVideoPlaying) {
          videoRef.current.pause();
          setIsVideoPlaying(false);
        } else {
          setVideoError(null);
          await videoRef.current.play();
          setIsVideoPlaying(true);
        }
      } catch (error) {
        console.error('Video playback error:', error);
        setVideoError(error.message || 'Failed to play video');
        setIsVideoPlaying(false);
      }
    }
  };

  const handleVideoEnded = () => {
    setIsVideoPlaying(false);
  };

  return (
    <div className="flex gap-4">
      {/* Main Media Display */}
      <div className="flex-1">
        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative">
          {isVideo ? (
            <div className="relative w-full h-full">
              <video
                ref={videoRef}
                src={mediaUrl}
                className="w-full h-full object-cover"
                onEnded={handleVideoEnded}
                onError={(e) => {
                  console.error('Video failed to load:', e);
                  setVideoError('Failed to load video');
                }}
                onLoadStart={() => {
                  console.log('Video loading started:', mediaUrl);
                }}
                onCanPlay={() => {
                  console.log('Video can play:', mediaUrl);
                }}
                preload="metadata"
                controls={false}
                playsInline
                webkit-playsinline="true"
              />
              {/* Video Play/Pause Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                {videoError ? (
                  <div className="text-center text-white p-4">
                    <p className="text-sm mb-2">Video Error</p>
                    <p className="text-xs opacity-75">{videoError}</p>
                    <button
                      onClick={() => {
                        setVideoError(null);
                        if (videoRef.current) {
                          videoRef.current.load();
                        }
                      }}
                      className="mt-2 px-3 py-1 bg-white bg-opacity-20 rounded text-xs hover:bg-opacity-30"
                    >
                      Retry
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handlePlayPause}
                    className="p-4 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
                  >
                    {isVideoPlaying ? (
                      <Pause className="h-8 w-8 text-gray-800" />
                    ) : (
                      <Play className="h-8 w-8 text-gray-800 ml-1" />
                    )}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <img
              src={mediaUrl}
              alt="Product"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = '/placeholder-image.png';
              }}
            />
          )}
        </div>
      </div>

      {/* Media Thumbnails Sidebar */}
      {mediaItems.length > 1 && (
        <div className="w-20 space-y-2">
          {mediaItems.map((media, index) => (
            <button
              key={media.id}
              onClick={() => {
                setSelectedMediaIndex(index);
                setIsVideoPlaying(false);
              }}
              className={`w-full aspect-square rounded-lg overflow-hidden border-2 transition-all relative ${
                selectedMediaIndex === index
                  ? 'border-red-500 ring-2 ring-red-200'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {media.type === 'video' ? (
                <div className="relative w-full h-full">
                  <video
                    src={`${import.meta.env.VITE_API_URL || 'https://colala.hmstech.xyz'}/storage/${media.path}`}
                    className="w-full h-full object-cover"
                    muted
                    preload="metadata"
                    playsInline
                    webkit-playsinline="true"
                    onError={(e) => {
                      console.error('Video thumbnail failed to load:', e);
                    }}
                  />
                  {/* Video Play Icon Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                    <Play className="h-4 w-4 text-white" />
                  </div>
                </div>
              ) : (
                <img
                  src={`${import.meta.env.VITE_API_URL || 'https://colala.hmstech.xyz'}/storage/${media.path}`}
                  alt={`Product ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = '/placeholder-image.png';
                  }}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
