// src/components/announcements/CreateNewAnnouncementModal.jsx
import React, { useState } from 'react';
import Button from '../../ui/Button';
import { XMarkIcon } from '@heroicons/react/24/outline'; // Close icon

/**
 * CreateNewAnnouncementModal Component
 * A modal form for creating a new text announcement.
 * Matches the design in 'image_f2490e.png'.
 *
 * @param {object} props
 * @param {function} props.onClose - Callback to close the modal.
 * @param {function} props.onSave - Callback to save the new announcement text.
 * @param {string} props.brandColor - The primary brand color for styling the save button.
 */
const CreateNewAnnouncementModal = ({ onClose, onSave, brandColor }) => {
    const [announcementText, setAnnouncementText] = useState('');
    const MAX_CHARS = 200;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!announcementText.trim()) {
            alert('Announcement text cannot be empty.'); // Replace with custom modal/toast
            return;
        }
        onSave(announcementText);
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800 font-serif">New Announcement</h2> {/* Font style from image */}
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
                    Save
                </Button>
            </form>
        </div>
    );
};

export default CreateNewAnnouncementModal;
