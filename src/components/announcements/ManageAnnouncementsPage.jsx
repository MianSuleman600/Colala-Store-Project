import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import ScrollToTop from '../../components/ui/ScrollToTop';
import { getContrastTextColor } from '../../utils/colorUtils';

// Import hooks
import { useAnnouncementsQuery } from '../../services/queries/useAnnouncementQuery.js';
import { useBannersQuery } from '../../services/queries/useBannerQuery.js';
import {
  useCreateAnnouncementMutation,
  useUpdateAnnouncementMutation,
  useDeleteAnnouncementMutation,
} from '../../services/mutations/useAnnouncementMutation.js';
import {
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
} from '../../services/mutations/useBannerMutation.js';

// Import sub-components
import PushAnnouncementsTab from '../../components/announcements/PushAnnouncementsTab.jsx';
import BannersTab from '../../components/announcements/BannersTab.jsx';
import CreateNewAnnouncementModal from '../../components/announcements/models/CreateNewAnnouncementModal.jsx';
import CreateNewBannerModal from '../../components/announcements/models/CreateNewBannerModal.jsx';

const ManageAnnouncementsPage = () => {
  const [activeTab, setActiveTab] = useState('push');
  const [showNewAnnouncementModal, setShowNewAnnouncementModal] = useState(false);
  const [showNewBannerModal, setShowNewBannerModal] = useState(false);

  // Get user and brand color from Redux
  const { user } = useSelector((state) => state.auth);
  const brandColor = useMemo(() => user?.store?.brandColor || user?.store?.theme_color || '#EF4444', [user]);
  const contrastTextColor = useMemo(() => getContrastTextColor(brandColor), [brandColor]);

  // Data fetching
  const { data: announcements = [], isLoading: announcementsLoading } = useAnnouncementsQuery();
  const { data: banners = [], isLoading: bannersLoading } = useBannersQuery();

  // Mutations
  const createAnnouncement = useCreateAnnouncementMutation();
  const updateAnnouncement = useUpdateAnnouncementMutation();
  const deleteAnnouncement = useDeleteAnnouncementMutation();
  const createBanner = useCreateBannerMutation();
  const updateBanner = useUpdateBannerMutation();
  const deleteBanner = useDeleteBannerMutation();

  // Handlers for announcements
  const handleSaveNewAnnouncement = (payload) => createAnnouncement.mutate(payload, { onSuccess: () => setShowNewAnnouncementModal(false) });
  const handleUpdateAnnouncement = (updated) => updateAnnouncement.mutate({ id: updated.id, payload: updated });
  const handleDeleteAnnouncement = (id) => deleteAnnouncement.mutate(id);

  // Handlers for banners
  const handleSaveNewBanner = (payload) => createBanner.mutate(payload, { onSuccess: () => setShowNewBannerModal(false) });
  const handleUpdateBanner = (updated) => updateBanner.mutate({ id: updated.id, payload: updated });
  const handleDeleteBanner = (id) => deleteBanner.mutate(id);

  return (
    <div className="p-4 md:p-8">
      <ScrollToTop />
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Manage Announcements</h2>

      <div className="flex bg-gray-100 rounded-xl p-1 mb-8">
        <button
          className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${activeTab === 'push' ? 'shadow text-white' : 'text-gray-600'}`}
          style={activeTab === 'push' ? { backgroundColor: brandColor } : {}}
          onClick={() => setActiveTab('push')}
        >Push Announcements</button>
        <button
          className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${activeTab === 'banners' ? 'shadow text-white' : 'text-gray-600'}`}
          style={activeTab === 'banners' ? { backgroundColor: brandColor } : {}}
          onClick={() => setActiveTab('banners')}
        >Banners</button>
      </div>

      {activeTab === 'push' && (
        <PushAnnouncementsTab
          announcements={announcements} isLoading={announcementsLoading}
          onOpenNewAnnouncementModal={() => setShowNewAnnouncementModal(true)}
          onSaveEditedAnnouncement={handleUpdateAnnouncement}
          onDeleteAnnouncement={handleDeleteAnnouncement}
          brandColor={brandColor} contrastTextColor={contrastTextColor}
        />
      )}
      {activeTab === 'banners' && (
        <BannersTab
          banners={banners} isLoading={bannersLoading}
          onOpenNewBannerModal={() => setShowNewBannerModal(true)}
          onSaveEditedBanner={handleUpdateBanner}
          onDeleteBanner={handleDeleteBanner}
          brandColor={brandColor} contrastTextColor={contrastTextColor}
        />
      )}

      {showNewAnnouncementModal && (
        <CreateNewAnnouncementModal
          isOpen={showNewAnnouncementModal}
          onClose={() => setShowNewAnnouncementModal(false)}
          onSave={handleSaveNewAnnouncement}
          isSubmitting={createAnnouncement.isLoading}
          brandColor={brandColor}
        />
      )}
      {showNewBannerModal && (
        <CreateNewBannerModal
          isOpen={showNewBannerModal}
          onClose={() => setShowNewBannerModal(false)}
          onSave={handleSaveNewBanner}
          isSubmitting={createBanner.isLoading}
          brandColor={brandColor}
        />
      )}
    </div>
  );
};

export default ManageAnnouncementsPage;