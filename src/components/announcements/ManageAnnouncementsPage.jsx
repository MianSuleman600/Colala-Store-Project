// src/pages/ManageAnnouncementsPage.jsx
import React, { useState } from 'react';
import PushAnnouncementsTab from './PushAnnouncementsTab';
import BannersTab from './BannersTab';
import CreateNewAnnouncementModal from './models/CreateNewAnnouncementModal';
import CreateNewBannerModal from './models/CreateNewBannerModal';
import ScrollToTop from '../ui/ScrollToTop';

// Hooks
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

const ManageAnnouncementsPage = ({ brandColor, contrastTextColor }) => {
  const [activeTab, setActiveTab] = useState('push');
  const [showNewAnnouncementModal, setShowNewAnnouncementModal] = useState(false);
  const [showNewBannerModal, setShowNewBannerModal] = useState(false);

  // Data
  const { data: announcements = [] } = useAnnouncementsQuery();
  const { data: banners = [] } = useBannersQuery({}); // all placements

  // Mutations
  const createAnnouncement = useCreateAnnouncementMutation();
  const updateAnnouncement = useUpdateAnnouncementMutation();
  const deleteAnnouncement = useDeleteAnnouncementMutation();

  const createBanner = useCreateBannerMutation({});
  const updateBanner = useUpdateBannerMutation({});
  const deleteBanner = useDeleteBannerMutation({});

  // Handlers
  const handleSaveNewAnnouncement = async (text) => {
    await createAnnouncement.mutateAsync({ text, active: true, pinned: false, priority: 0 });
    setShowNewAnnouncementModal(false);
  };

  const handleSaveNewBanner = async (newBannerData) => {
    const payload = {
      imageUrl: newBannerData.imageUrl,
      link: newBannerData.link || '',
      active: true,
      placement: newBannerData.placement || 'home', // allow modal to set placement; default 'home'
      alt: newBannerData.alt || 'Promotional',
    };
    await createBanner.mutateAsync(payload);
    setShowNewBannerModal(false);
  };

  // Editing/updating
  const handleUpdateAnnouncement = async (updated) => {
    await updateAnnouncement.mutateAsync({ id: updated.id, payload: updated });
  };
  const handleDeleteAnnouncement = async (id) => {
    await deleteAnnouncement.mutateAsync(id);
  };

  const handleUpdateBanner = async (updated) => {
    await updateBanner.mutateAsync({ id: updated.id, payload: updated });
  };
  const handleDeleteBanner = async (id) => {
    await deleteBanner.mutateAsync(id);
  };

  return (
    <div className="p-4 md:p-8">
      <ScrollToTop />
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Manage Announcements</h2>

      <div className="flex bg-gray-100 rounded-xl p-1 mb-8">
        <button
          className={`flex-1 py-2 px-4 rounded-lg text-lg font-semibold transition-all duration-200 ${
            activeTab === 'push' ? 'bg-white shadow text-gray-800' : 'text-gray-600 hover:bg-gray-200'
          }`}
          style={activeTab === 'push' ? { backgroundColor: brandColor, color: contrastTextColor } : {}}
          onClick={() => setActiveTab('push')}
        >
          Push Announcements
        </button>
        <button
          className={`flex-1 py-2 px-4 rounded-lg text-lg font-semibold transition-all duration-200 ${
            activeTab === 'banners' ? 'bg-white shadow text-gray-800' : 'text-gray-600 hover:bg-gray-200'
          }`}
          style={activeTab === 'banners' ? { backgroundColor: brandColor, color: contrastTextColor } : {}}
          onClick={() => setActiveTab('banners')}
        >
          Banners
        </button>
      </div>

      {activeTab === 'push' && (
        <PushAnnouncementsTab
          announcements={announcements}
          onOpenNewAnnouncementModal={() => setShowNewAnnouncementModal(true)}
          onSaveEditedAnnouncement={handleUpdateAnnouncement}
          onDeleteAnnouncement={handleDeleteAnnouncement}
          brandColor={brandColor}
          contrastTextColor={contrastTextColor}
        />
      )}

      {activeTab === 'banners' && (
        <BannersTab
          banners={banners}
          onOpenNewBannerModal={() => setShowNewBannerModal(true)}
          onSaveEditedBanner={handleUpdateBanner}
          onDeleteBanner={handleDeleteBanner}
          brandColor={brandColor}
          contrastTextColor={contrastTextColor}
        />
      )}

      {showNewAnnouncementModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="relative bg-white rounded-xl shadow-xl max-h-[90vh] overflow-y-auto w-full max-w-md">
            <CreateNewAnnouncementModal
              onClose={() => setShowNewAnnouncementModal(false)}
              onSave={handleSaveNewAnnouncement}
              brandColor={brandColor}
            />
          </div>
        </div>
      )}

      {showNewBannerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="relative bg-white rounded-xl shadow-xl max-h-[90vh] overflow-y-auto w-full max-w-md">
            <CreateNewBannerModal
              onClose={() => setShowNewBannerModal(false)}
              onSave={handleSaveNewBanner}
              brandColor={brandColor}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAnnouncementsPage;