// src/components/announcements/PushAnnouncementsTab.jsx
import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import PencilIcon from '../../assets/icons/Pencil.png';
import TrashIcon from '../../assets/icons/delete.png';
import EditAnnouncementModal from './models/EditAnnouncementModal';

const PushAnnouncementsTab = ({
  announcements,
  brandColor,
  contrastTextColor,
  onOpenNewAnnouncementModal,
  onSaveEditedAnnouncement,
  onDeleteAnnouncement,
}) => {
  const [showEditAnnouncementModal, setShowEditAnnouncementModal] = useState(false);
  const [announcementToEdit, setAnnouncementToEdit] = useState(null);

  const handleEditAnnouncement = (id) => {
    const announcement = announcements.find((ann) => ann.id === id);
    if (announcement) {
      setAnnouncementToEdit(announcement);
      setShowEditAnnouncementModal(true);
    }
  };

  const handleCloseEditAnnouncementModal = () => {
    setShowEditAnnouncementModal(false);
    setAnnouncementToEdit(null);
  };

  const handleSaveEditedAnnouncement = async (updatedAnnouncement) => {
    await onSaveEditedAnnouncement?.(updatedAnnouncement);
    setShowEditAnnouncementModal(false);
  };

  const handleDeleteAnnouncement = async (id) => {
    if (window.confirm(`Are you sure you want to delete announcement ${id}?`)) {
      await onDeleteAnnouncement?.(id);
    }
  };

  return (
    <div>
      <div className="space-y-4 mb-8">
        {(!announcements || announcements.length === 0) ? (
          <Card className="p-6 text-center text-gray-600">No announcements created yet.</Card>
        ) : (
          announcements.map((announcement) => (
            <Card key={announcement.id} className="p-4 rounded-xl shadow-sm flex flex-col">
              <div className="w-full text-center border p-2 rounded-2xl border-gray-200 mb-4">
                <p className="text-lg font-medium text-gray-800">{announcement.text}</p>
              </div>

              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex justify-between">
                  <span>Date Created</span>
                  <span className="font-medium text-gray-800">{announcement.dateCreated || ''}</span>
                </div>
                <div className="flex justify-between">
                  <span>Impressions</span>
                  <span className="font-medium text-gray-800">{announcement.impressions || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Active</span>
                  <span className="font-medium text-gray-800">{announcement.active ? 'Yes' : 'No'}</span>
                </div>
              </div>

              <div className="flex space-x-2 mt-auto">
                <Button
                  onClick={() => handleEditAnnouncement(announcement.id)}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
                  aria-label="Edit Announcement"
                >
                  <img src={PencilIcon} alt="Edit" className="h-5 w-5" />
                </Button>
                <Button
                  onClick={() => handleDeleteAnnouncement(announcement.id)}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-red-600"
                  aria-label="Delete Announcement"
                >
                  <img src={TrashIcon} alt="Delete" className="h-5 w-5" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      <Button
        onClick={onOpenNewAnnouncementModal}
        style={{ backgroundColor: brandColor, color: contrastTextColor }}
        className="w-full py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-shadow"
      >
        Create New
      </Button>

      {showEditAnnouncementModal && announcementToEdit && (
        <div className="fixed inset-0 backdrop-blur-2xl bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="relative bg-white rounded-xl shadow-xl max-h-[90vh] overflow-y-auto w-full max-w-md">
            <EditAnnouncementModal
              announcementToEdit={announcementToEdit}
              onClose={handleCloseEditAnnouncementModal}
              onSave={handleSaveEditedAnnouncement}
              brandColor={brandColor}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PushAnnouncementsTab;