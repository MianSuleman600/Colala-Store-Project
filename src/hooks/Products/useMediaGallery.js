import { useEffect, useMemo, useRef, useState } from 'react';
import { FALLBACK_IMAGE, isVideoUrl, dedupe } from '../../utils/mediaUtils';
import { useToast } from '../../components/ui/ToastProvider';

export const useMediaGallery = (product) => {
  const { push } = useToast?.() || { push: () => {} };

  const thumbs = product?.detailsPageInfo?.thumbnailUrls || [];
  const main = product?.detailsPageInfo?.mainImageUrl || '';
  const fallback = product?.imageUrl || '';

  const mediaRawList = useMemo(
    () => dedupe([...(Array.isArray(thumbs) ? thumbs : []), main, fallback]),
    [thumbs, main, fallback]
  );

  const [failedSrc, setFailedSrc] = useState({});
  const markFailed = (src) =>
    src && setFailedSrc((prev) => (prev[src] ? prev : { ...prev, [src]: true }));

  const [selectedRaw, setSelectedRaw] = useState('');
  const [selectedIsVideo, setSelectedIsVideo] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const productId = product?.id || product?._id || '';
  const initializedIdRef = useRef(null);

  // Initialize once per productId
  useEffect(() => {
    if (!productId) return;
    if (initializedIdRef.current === productId) return;
    const initialRaw = main || mediaRawList[0] || fallback || FALLBACK_IMAGE;
    setSelectedRaw(initialRaw);
    setSelectedIsVideo(isVideoUrl(initialRaw) && !failedSrc[initialRaw]);
    setIsPlaying(false);
    initializedIdRef.current = productId;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, mediaRawList, main, fallback, failedSrc]);

  const selectedDisplay = failedSrc[selectedRaw] ? FALLBACK_IMAGE : selectedRaw;
  const isVideoDisplay = selectedIsVideo && !failedSrc[selectedRaw];

  // Pause if leaving video
  useEffect(() => {
    if (!isVideoDisplay && videoRef.current) {
      try {
        videoRef.current.pause();
      } catch {}
      setIsPlaying(false);
    }
  }, [isVideoDisplay]);

  // Force the video element to reinitialize when switching to a video
  useEffect(() => {
    if (isVideoDisplay && videoRef.current) {
      try {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
        videoRef.current.load(); // Important for first-visit reliability
        setIsPlaying(false);
      } catch {}
    }
  }, [isVideoDisplay, selectedDisplay]);

  const handleThumbClick = (rawSrc) => {
    if (!rawSrc) return;
    setSelectedRaw(rawSrc);
    setSelectedIsVideo(isVideoUrl(rawSrc) && !failedSrc[rawSrc]);
    setIsPlaying(false);
    if (videoRef.current) {
      try {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      } catch {}
    }
  };

  const handlePlayClick = () => {
    if (!isVideoDisplay || !videoRef.current) return;
    try {
      videoRef.current.play();
      setIsPlaying(true);
    } catch {}
  };

  const handleVideoError = () => {
    // Mark this src as failed and pick the first available image if possible
    markFailed(selectedRaw);
    setIsPlaying(false);

    const firstImage = mediaRawList.find((u) => !isVideoUrl(u) && !failedSrc[u]);
    if (firstImage) {
      setSelectedRaw(firstImage);
      setSelectedIsVideo(false);
    } else {
      setSelectedIsVideo(false);
    }

    push?.('Unable to load video. Showing image instead.', { type: 'info' });
  };

  const handleImageError = (src) => (e) => {
    e.currentTarget.onerror = null;
    markFailed(src);
    e.currentTarget.src = FALLBACK_IMAGE;
  };

  return {
    mediaRawList,
    selectedRaw,
    selectedDisplay,
    isVideoDisplay,
    isPlaying,
    videoRef,
    handleThumbClick,
    handlePlayClick,
    handleVideoError,
    handleImageError,
  };
};