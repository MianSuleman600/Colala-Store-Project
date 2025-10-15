import React, { useState, useRef } from 'react';
import { Play, Pause } from 'lucide-react';

const ProductImageGallery = ({ images, video }) => {
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoError, setVideoError] = useState(null);
  const [videoRetryCount, setVideoRetryCount] = useState(0);
  const [showNativeControls, setShowNativeControls] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
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
  
  // Validate media path and generate URL
  const getMediaUrl = (path) => {
    if (!path) return null;
    
    // Check if the path is a temporary file path (starts with /tmp/)
    if (path.startsWith('/tmp/')) {
      console.warn('Invalid media path detected (temporary file):', path);
      return null;
    }
    
    // Check if the path is already a full URL
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    
    // Check if the path looks like a valid storage path
    // Allow any path that doesn't start with /tmp/ and has a file extension
    if (path.includes('/') && (path.includes('.') || path.includes('products/') || path.includes('services/') || path.includes('videos/'))) {
      return `${import.meta.env.VITE_API_URL || 'https://colala.hmstech.xyz'}/storage/${path}`;
    }
    
    // For any other path that doesn't match the above patterns, still try to construct the URL
    // This handles cases where the path might be valid but doesn't match our strict patterns
    if (path.length > 0 && !path.startsWith('/tmp/')) {
      console.log('Attempting to construct URL for path:', path);
      return `${import.meta.env.VITE_API_URL || 'https://colala.hmstech.xyz'}/storage/${path}`;
    }
    
    console.warn('Invalid media path format:', path);
    return null;
  };
  
  const mediaUrl = getMediaUrl(selectedMedia.path);

  // Debug info for video
  if (isVideo) {
    console.log('=== VIDEO DEBUG INFO ===');
    console.log('Video URL:', mediaUrl);
    console.log('Video path:', selectedMedia.path);
    console.log('Is valid path:', mediaUrl !== null);
    console.log('Video type:', selectedMedia.type);
    console.log('All media items:', mediaItems);
    console.log('Selected media index:', selectedMediaIndex);
    console.log('========================');
  }

  const handlePlayPause = async () => {
    console.log('=== PLAY BUTTON CLICKED ===');
    console.log('isVideo:', isVideo);
    console.log('videoRef.current:', videoRef.current);
    console.log('isVideoPlaying:', isVideoPlaying);
    console.log('mediaUrl:', mediaUrl);
    
    // Mark that user has interacted
    setUserInteracted(true);
    
    if (isVideo && videoRef.current) {
      try {
        if (isVideoPlaying) {
          console.log('Pausing video...');
          videoRef.current.pause();
          setIsVideoPlaying(false);
        } else {
          console.log('Playing video...');
          setVideoError(null);
          
          // Ensure video is loaded before playing
          if (videoRef.current.readyState < 2) {
            console.log('Video not ready, waiting for canplay event...');
            videoRef.current.load();
            // Wait a bit for the video to load
            setTimeout(async () => {
              try {
                await videoRef.current.play();
                setIsVideoPlaying(true);
                console.log('Video started playing after load');
              } catch (playError) {
                console.error('Video play error after load:', playError);
                setVideoError(playError.message || 'Failed to play video after load');
              }
            }, 500);
          } else {
            await videoRef.current.play();
            setIsVideoPlaying(true);
            console.log('Video started playing immediately');
          }
        }
      } catch (error) {
        console.error('Video playback error:', error);
        setVideoError(error.message || 'Failed to play video');
        setIsVideoPlaying(false);
      }
    } else {
      console.error('Cannot play video - missing video element or not a video');
    }
  };

  const handleVideoEnded = () => {
    setIsVideoPlaying(false);
  };

  const retryVideoLoad = () => {
    setVideoError(null);
    setVideoRetryCount(prev => prev + 1);
    if (videoRef.current) {
      // Try different URL constructions on retry
      const path = selectedMedia.path;
      let newUrl = mediaUrl;
      
      if (videoRetryCount === 1) {
        // Try without /storage/ prefix
        newUrl = `${import.meta.env.VITE_API_URL || 'https://colala.hmstech.xyz'}/${path}`;
      } else if (videoRetryCount === 2) {
        // Try with different base URL
        newUrl = `https://colala.hmstech.xyz/storage/${path}`;
      }
      
      console.log('Retrying video with URL:', newUrl);
      videoRef.current.src = newUrl;
      videoRef.current.load();
    }
  };

  return (
    <div className="flex gap-4">
      {/* Main Media Display */}
      <div className="flex-1">
        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative">
          {isVideo ? (
            <div className="relative w-full h-full">
              {mediaUrl ? (
                <>
                  <video
                    ref={videoRef}
                    src={mediaUrl}
                    className="w-full h-full object-cover"
                    onClick={() => setUserInteracted(true)}
                    onEnded={handleVideoEnded}
                    onError={(e) => {
                      console.error('Video failed to load:', e);
                      console.error('Video src:', mediaUrl);
                      console.error('Video path:', selectedMedia.path);
                      setVideoError(`Failed to load video (attempt ${videoRetryCount + 1})`);
                    }}
                    onLoadStart={() => {
                      console.log('Video loading started:', mediaUrl);
                    }}
                    onLoadedData={() => {
                      console.log('Video data loaded:', mediaUrl);
                    }}
                    onCanPlay={() => {
                      console.log('Video can play:', mediaUrl);
                    }}
                    onCanPlayThrough={() => {
                      console.log('Video can play through:', mediaUrl);
                    }}
                    onPlay={() => {
                      console.log('Video play event fired');
                      setIsVideoPlaying(true);
                    }}
                    onPause={() => {
                      console.log('Video pause event fired');
                      setIsVideoPlaying(false);
                    }}
                    onWaiting={() => {
                      console.log('Video waiting for data');
                    }}
                    onStalled={() => {
                      console.log('Video stalled');
                    }}
                    preload="metadata"
                    controls={showNativeControls}
                    playsInline
                    webkit-playsinline="true"
                  />
                  {/* Video Play/Pause Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                    {videoError ? (
                      <div className="text-center text-white p-4">
                        <p className="text-sm mb-2">Video Error</p>
                        <p className="text-xs opacity-75">{videoError}</p>
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={retryVideoLoad}
                            className="px-3 py-1 bg-white bg-opacity-20 rounded text-xs hover:bg-opacity-30"
                          >
                            Retry ({videoRetryCount > 0 ? videoRetryCount : ''})
                          </button>
                          <button
                            onClick={() => setShowNativeControls(true)}
                            className="px-3 py-1 bg-white bg-opacity-20 rounded text-xs hover:bg-opacity-30"
                          >
                            Use Native Controls
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
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
                        {(videoRetryCount > 2 || !userInteracted) && (
                          <button
                            onClick={() => setShowNativeControls(true)}
                            className="mt-2 px-3 py-1 bg-white bg-opacity-20 rounded text-xs hover:bg-opacity-30 text-white"
                          >
                            Use Native Controls
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <div className="text-center text-gray-500 p-4">
                    <p className="text-sm mb-2">Video Not Available</p>
                    <p className="text-xs opacity-75">Invalid video path</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            mediaUrl ? (
              <img
                src={mediaUrl}
                alt="Product"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = '/placeholder-image.png';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <div className="text-center text-gray-500 p-4">
                  <p className="text-sm mb-2">Image Not Available</p>
                  <p className="text-xs opacity-75">Invalid image path</p>
                </div>
              </div>
            )
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
                  {getMediaUrl(media.path) ? (
                    <>
                      <video
                        src={getMediaUrl(media.path)}
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
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <Play className="h-4 w-4 text-gray-400" />
                    </div>
                  )}
                </div>
              ) : (
                getMediaUrl(media.path) ? (
                  <img
                    src={getMediaUrl(media.path)}
                    alt={`Product ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/placeholder-image.png';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <span className="text-xs text-gray-400">N/A</span>
                  </div>
                )
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
