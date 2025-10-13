import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import EditAnnouncementModal from './models/EditAnnouncementModal';

const PushAnnouncementsTab = ({
  announcements,
  isLoading,
  brandColor,
  contrastTextColor,
  onOpenNewAnnouncementModal,
  onSaveEditedAnnouncement,
  onDeleteAnnouncement,
}) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [announcementToEdit, setAnnouncementToEdit] = useState(null);

  const handleEdit = (announcement) => {
    setAnnouncementToEdit(announcement);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setAnnouncementToEdit(null);
    setShowEditModal(false);
  };

  const handleSave = (updatedAnnouncement) => {
    onSaveEditedAnnouncement?.(updatedAnnouncement);
    handleCloseEditModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      onDeleteAnnouncement?.(id);
    }
  };

  return (
    <div>
      <div className="space-y-4 mb-8">
        {isLoading ? (
            <Card className="p-6 text-center text-gray-600">Loading announcements...</Card>
        ) : (!announcements || announcements.length === 0) ? (
          <Card className="p-6 text-center text-gray-600">No announcements created yet.</Card>
        ) : (
          announcements.map((announcement) => (
            <Card key={announcement.id} className="p-4 rounded-xl shadow-sm flex flex-col">
              <p className="text-lg font-medium text-gray-800 mb-4">{announcement.text}</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-600 mb-4">
                <span>Date Created:</span>
                <span className="font-medium text-gray-800">{new Date(announcement.createdAt).toLocaleDateString()}</span>
                <span>Impressions:</span>
                <span className="font-medium text-gray-800">{announcement.impressions || 0}</span>
                <span>Active:</span>
                <span className="font-medium text-gray-800">{announcement.active ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex space-x-2 mt-auto">
                <Button onClick={() => handleEdit(announcement)} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                  <PencilIcon className="h-5 w-5 text-gray-600" />
                </Button>
                <Button onClick={() => handleDelete(announcement.id)} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                  <TrashIcon className="h-5 w-5 text-red-500" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      <Button
        onClick={onOpenNewAnnouncementModal}
        style={{ backgroundColor: brandColor, color: contrastTextColor }}
        className="w-full py-3 rounded-lg font-semibold"
      >
        Create New Announcement
      </Button>

      {showEditModal && (
        <EditAnnouncementModal
          isOpen={showEditModal}
          announcementToEdit={announcementToEdit}
          onClose={handleCloseEditModal}
          onSave={handleSave}
          brandColor={brandColor}
        />
      )}
    </div>
  );
};

export default PushAnnouncementsTab;