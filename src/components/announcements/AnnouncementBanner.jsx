// src/components/announcements/AnnouncementBanner.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useActiveAnnouncementsQuery } from '../../services/queries/useAnnouncementQuery.js';
import { announcementService } from '../../services/settings/announcementService.js';

const STORAGE_KEY = 'ACTIVE_ANNOUNCEMENT_CACHE';
const DISMISS_KEY = 'DISMISS_ANNOUNCEMENT_IDS_SESSION';

const saveCache = (a) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(a)); } catch {}
};
const loadCache = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
};

const wasDismissed = (id) => {
  try {
    const raw = sessionStorage.getItem(DISMISS_KEY);
    const set = raw ? new Set(JSON.parse(raw)) : new Set();
    return set.has(id);
  } catch { return false; }
};
const markDismissed = (id) => {
  try {
    const raw = sessionStorage.getItem(DISMISS_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    if (!arr.includes(id)) arr.push(id);
    sessionStorage.setItem(DISMISS_KEY, JSON.stringify(arr));
  } catch {}
};

const AnnouncementBanner = ({ brandColor = '#111827', contrastTextColor = '#ffffff', className = '' }) => {
  const { data, isError } = useActiveAnnouncementsQuery();
  const [fallback, setFallback] = useState(() => loadCache());

  const announcement = useMemo(() => {
    const list = Array.isArray(data) && data.length ? data : (fallback ? [fallback] : []);
    if (!list.length) return null;
    // pick highest priority, or latest
    const sorted = [...list].sort((a, b) => (b.priority || 0) - (a.priority || 0));
    return sorted.find((a) => a.active) || sorted[0];
  }, [data, fallback]);

  useEffect(() => {
    if (Array.isArray(data) && data.length) {
      // cache first active
      const first = data.find((a) => a.active) || data[0];
      saveCache(first);
    } else if (isError && !fallback) {
      setFallback(loadCache());
    }
  }, [data, isError, fallback]);

  useEffect(() => {
    if (!announcement || wasDismissed(announcement.id)) return;
    // Avoid double counting within a session
    const IMP_KEY = `IMP_ANNOUNCEMENT_${announcement.id}`;
    const already = sessionStorage.getItem(IMP_KEY);
    if (already) return;
    sessionStorage.setItem(IMP_KEY, '1');
    announcementService.trackAnnouncementImpression(announcement.id).catch(() => {});
  }, [announcement]);

  if (!announcement || wasDismissed(announcement.id)) return null;

  return (
    <div
      className={`w-full text-center py-2 px-3 ${className}`}
      style={{ backgroundColor: brandColor, color: contrastTextColor }}
      role="status"
      aria-live="polite"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
        <span className="text-sm md:text-base">{announcement.text}</span>
        <button
          onClick={() => markDismissed(announcement.id)}
          className="ml-2 text-xs underline opacity-80 hover:opacity-100"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};

export default AnnouncementBanner;