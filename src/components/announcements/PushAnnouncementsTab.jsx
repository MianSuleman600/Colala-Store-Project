// src/components/announcements/PushAnnouncementsTab.jsx
import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import PencilIcon from '../../assets/icons/Pencil.png'; // Assuming this path is correct
import TrashIcon from '../../assets/icons/delete.png'; // Assuming this path is correct
import EditAnnouncementModal from './models/EditAnnouncementModal'; // Import the new EditAnnouncementModal

/**
 * PushAnnouncementsTab Component
 * Displays a list of text-based announcements with their details and actions.
 * Includes a button to create a new announcement.
 * Matches the design in 'image_f2490a.png'.
 *
 * @param {object} props
 * @param {Array<object>} props.announcements - An array of announcement objects.
 * @param {function} props.setAnnouncements - Function to update the parent's announcements state.
 * @param {string} props.brandColor - The primary brand color for styling.
 * @param {string} props.contrastTextColor - The text color that contrasts well with brandColor.
 * @param {function} props.onOpenNewAnnouncementModal - Callback to open the create new announcement modal.
 */
const PushAnnouncementsTab = ({ announcements, setAnnouncements, brandColor, contrastTextColor, onOpenNewAnnouncementModal }) => {
    // State for managing the Edit Announcement Modal
    const [showEditAnnouncementModal, setShowEditAnnouncementModal] = useState(false);
    const [announcementToEdit, setAnnouncementToEdit] = useState(null);

    const handleEditAnnouncement = (announcementId) => {
        console.log('handleEditAnnouncement called for ID:', announcementId);
        const announcement = announcements.find(ann => ann.id === announcementId);
        if (announcement) {
            console.log('Found announcement to edit:', announcement);
            setAnnouncementToEdit(announcement);
            setShowEditAnnouncementModal(true);
            console.log('showEditAnnouncementModal set to true.');
        } else {
            console.log('Coupon not found for ID:', announcementId);
        }
    };

    const handleCloseEditAnnouncementModal = () => {
        console.log('Closing Edit Announcement Modal');
        setShowEditAnnouncementModal(false);
        setAnnouncementToEdit(null); // Clear the announcement to edit
    };

    const handleSaveEditedAnnouncement = (updatedAnnouncement) => {
        console.log('Saving edited announcement:', updatedAnnouncement);
        setAnnouncements(prevAnnouncements =>
            prevAnnouncements.map(ann =>
                ann.id === updatedAnnouncement.id ? updatedAnnouncement : ann
            )
        );
        setShowEditAnnouncementModal(false);
    };

    const handleDeleteAnnouncement = (announcementId) => {
        console.log(`Deleting announcement: ${announcementId}`);
        if (window.confirm(`Are you sure you want to delete announcement ${announcementId}?`)) {
            setAnnouncements(prev => prev.filter(ann => ann.id !== announcementId));
            alert(`Announcement ${announcementId} deleted!`); // Replace with custom modal
        }
    };

    return (
        <div>
            {/* Announcements List */}
            <div className="space-y-4 mb-8">
                {announcements.length === 0 ? (
                    <Card className="p-6 text-center text-gray-600">No announcements created yet.</Card>
                ) : (
                    announcements.map(announcement => (
                        <Card key={announcement.id} className="p-4 rounded-xl shadow-sm flex flex-col">
                            {/* Announcement Text */}
                            <div className="w-full text-center border p-2 rounded-2xl border-gray-200 mb-4">
                                <p className="text-lg font-medium text-gray-800">{announcement.text}</p>
                            </div>

                            {/* Announcement Details */}
                            <div className="space-y-2 text-sm text-gray-600 mb-4">
                                <div className="flex justify-between">
                                    <span>Date Created</span>
                                    <span className="font-medium text-gray-800">{announcement.dateCreated}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Impressions</span>
                                    <span className="font-medium text-gray-800">{announcement.impressions}</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
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

            {/* Create New Button */}
            <Button
                onClick={onOpenNewAnnouncementModal}
                style={{ backgroundColor: brandColor, color: contrastTextColor }}
                className="w-full py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-shadow"
            >
                Create New
            </Button>

            {/* Edit Announcement Modal */}
            {console.log('Rendering EditAnnouncementModal? showEditModal:', showEditAnnouncementModal, 'announcementToEdit:', announcementToEdit)}
            {showEditAnnouncementModal && announcementToEdit && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
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
