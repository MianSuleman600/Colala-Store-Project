// src/hooks/useLike.js
import { useEffect, useState } from 'react';

export const useLike = (productId, userId) => {
  const key = `LIKE_${productId}_${userId || 'guest'}`;
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    try {
      const v = localStorage.getItem(key);
      setLiked(v === '1');
    } catch {}
  }, [key]);

  const toggle = () => {
    try {
      const v = liked ? '0' : '1';
      localStorage.setItem(key, v);
      setLiked(!liked);
    } catch {}
  };

  return { liked, toggle };
};