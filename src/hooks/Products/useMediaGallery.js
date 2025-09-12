// src/hooks/useMediaGallery.js
import { useEffect, useMemo, useRef, useState } from 'react';
import { FALLBACK_IMAGE, isVideoUrl, dedupe } from '../../utils/mediaUtils';
import { useToast } from '../../components/ui/ToastProvider';

export const useMediaGallery = (product) => {
  const { push } = useToast?.() || { push: () => {} };

  const thumbs = product?.detailsPageInfo?.thumbnailUrls || [];
  const main = product?.detailsPageInfo?.mainImageUrl || '';
  const fallback = product?.imageUrl || '';

  const mediaRawList = useMemo(() => dedupe([...(Array.isArray(thumbs) ? thumbs : []), main, fallback]), [thumbs, main, fallback]);

  const [failedSrc, setFailedSrc] = useState({});
  const markFailed = (src) => src && setFailedSrc((prev) => (prev[src] ? prev : { ...prev, [src]: true }));

  const [selectedRaw, setSelectedRaw] = useState('');
  const [selectedIsVideo, setSelectedIsVideo] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const productId = product?.id || product?._id || '';
  const initializedIdRef = useRef(null);

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

  useEffect(() => {
    if (!isVideoDisplay && videoRef.current) {
      try {
        videoRef.current.pause();
      } catch {}
      setIsPlaying(false);
    }
  }, [isVideoDisplay]);

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
    markFailed(selectedRaw);
    setSelectedIsVideo(false);
    setIsPlaying(false);
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