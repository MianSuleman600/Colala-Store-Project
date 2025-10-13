// src/components/announcements/models/EditAnnouncementModal.jsx

import React, { useEffect, useMemo, useState } from 'react';
import Button from '../../ui/Button';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useToast } from '../../ui/ToastProvider';

const EditAnnouncementModal = ({ isOpen, announcementToEdit, onClose, onSave, brandColor }) => {
  const { push } = useToast();
  const MAX_CHARS = 200;
  // The state variable can still be called 'text'
  const [text, setText] = useState(announcementToEdit?.text || '');
  const [active, setActive] = useState(Boolean(announcementToEdit?.active));
  
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) {
      push('Announcement text cannot be empty.', { type: 'error' });
      return;
    }

    // --- THIS IS THE FIX ---
    // The payload sent to the backend must use 'message', not 'text'.
    const payload = {
      ...announcementToEdit,
      message: text.trim(),
      active,
    };
    // --- END OF FIX ---

    onSave?.(payload);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="p-6 flex justify-between items-center border-b">
          <h2 className="text-xl font-semibold">Edit Announcement</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800" aria-label="Close">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <textarea
              placeholder="Type Announcement"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 resize-none"
              style={{'--tw-ring-color': brandColor}}
              rows={5}
              maxLength={MAX_CHARS}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="text-right text-sm text-gray-500 mt-1">
              {text.length}/{MAX_CHARS} Characters
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
            Active
          </label>
          <Button
            type="submit"
            style={{ backgroundColor: brandColor }}
            className="w-full py-3 rounded-lg font-semibold text-white"
          >
            Save Changes
          </Button>
        </form>
      </div>
    </div>
  );
};

export default EditAnnouncementModal;