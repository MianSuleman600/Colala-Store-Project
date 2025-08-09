// src/components/announcements/models/EditAnnouncementModal.jsx
import React, { useState, useEffect } from 'react';
import Button from '../../ui/Button'; // Adjusted path for Button
import { XMarkIcon } from '@heroicons/react/24/outline'; // Close icon

/**
 * EditAnnouncementModal Component
 * A modal form for editing an existing text announcement.
 * Pre-fills the form with the provided announcement data.
 *
 * @param {object} props
 * @param {object} props.announcementToEdit - The announcement object to be edited.
 * @param {function} props.onClose - Callback to close the modal.
 * @param {function} props.onSave - Callback to save the edited announcement data.
 * @param {string} props.brandColor - The primary brand color for styling the save button.
 */
const EditAnnouncementModal = ({ announcementToEdit, onClose, onSave, brandColor }) => {
    const [announcementText, setAnnouncementText] = useState(announcementToEdit?.text || '');
    const MAX_CHARS = 200;

    // Use useEffect to update form fields if announcementToEdit changes while modal is open
    useEffect(() => {
        if (announcementToEdit) {
            setAnnouncementText(announcementToEdit.text || '');
        }
    }, [announcementToEdit]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!announcementText.trim()) {
            alert('Announcement text cannot be empty.'); // Replace with custom modal/toast
            return;
        }

        // Pass the updated announcement data, including its original ID
        onSave({
            ...announcementToEdit, // Keep existing properties
            text: announcementText,
        });
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800 font-serif">Edit Announcement</h2>
                <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-800"
                    aria-label="Close"
                >
                    <XMarkIcon className="h-6 w-6" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <textarea
                        placeholder="Type Announcement"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                        rows="5"
                        maxLength={MAX_CHARS}
                        value={announcementText}
                        onChange={(e) => setAnnouncementText(e.target.value)}
                    ></textarea>
                    <div className="text-right text-sm text-gray-500 mt-1">
                        {announcementText.length}/{MAX_CHARS} Characters
                    </div>
                </div>

                <Button
                    type="submit"
                    style={{ backgroundColor: brandColor }}
                    className="w-full py-3 rounded-lg font-semibold text-white shadow-md hover:shadow-lg transition-shadow"
                >
                    Save Changes
                </Button>
            </form>
        </div>
    );
};

export default EditAnnouncementModal;
