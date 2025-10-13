import React, {  useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useActiveAnnouncementsQuery } from '../../services/queries/useAnnouncementQuery.js';
import { getContrastTextColor } from '../../utils/colorUtils';

const DISMISS_KEY = 'DISMISSED_ANNOUNCEMENT_IDS_SESSION';

// Helper to check if an announcement was dismissed in the current session
const wasDismissedInSession = (id) => {
  try {
    const raw = sessionStorage.getItem(DISMISS_KEY);
    const dismissedIds = raw ? new Set(JSON.parse(raw)) : new Set();
    return dismissedIds.has(id);
  } catch {
    return false;
  }
};

// Helper to mark an announcement as dismissed for the current session
const markDismissedInSession = (id) => {
  try {
    const raw = sessionStorage.getItem(DISMISS_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    if (!arr.includes(id)) {
      arr.push(id);
      sessionStorage.setItem(DISMISS_KEY, JSON.stringify(arr));
    }
  } catch {}
};

const AnnouncementBanner = ({ className = '' }) => {
  // --- DYNAMIC BRAND COLOR INTEGRATION ---
  const { user } = useSelector((state) => state.auth);
  const brandColor = useMemo(() => user?.store?.brandColor || user?.store?.theme_color || '#111827', [user]);
  const contrastTextColor = useMemo(() => getContrastTextColor(brandColor), [brandColor]);
  // --- END BRAND COLOR INTEGRATION ---

  // State to force a re-render when an item is dismissed
  const [dismissed, setDismissed] = useState(false);

  // Fetch only active announcements
  const { data: activeAnnouncements = [] } = useActiveAnnouncementsQuery();

  // Find the single announcement to display (highest priority or the first one)
  const announcement = useMemo(() => {
    if (!activeAnnouncements.length) return null;
    
    // Sort by priority (higher number is higher priority) and then by creation date (newer first)
    const sorted = [...activeAnnouncements].sort((a, b) => {
      const priorityDiff = (b.priority || 0) - (a.priority || 0);
      if (priorityDiff !== 0) return priorityDiff;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    
    // Find the first one that has not been dismissed in this session
    return sorted.find(a => !wasDismissedInSession(a.id)) || null;
  }, [activeAnnouncements, dismissed]);

  // Handler for the dismiss button
  const handleDismiss = () => {
    if (announcement) {
      markDismissedInSession(announcement.id);
      setDismissed(true); // Trigger a re-render to hide the banner
    }
  };

  // If there's no announcement to show (either none exist, or all have been dismissed), render nothing.
  if (!announcement) {
    return null;
  }

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
          onClick={handleDismiss}
          className="ml-2 text-xs underline opacity-80 hover:opacity-100 flex-shrink-0"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};

export default AnnouncementBanner;