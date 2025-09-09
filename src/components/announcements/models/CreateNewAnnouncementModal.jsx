// src/components/announcements/models/CreateNewAnnouncementModal.jsx
import React, { useMemo, useState } from 'react';
import Button from '../../ui/Button';
import { XMarkIcon } from '@heroicons/react/24/outline';

const toast = (type, message) => {
  try {
    window.dispatchEvent(new CustomEvent('SHOW_ALERT', { detail: { type, message } }));
  } catch {}
};

const CreateNewAnnouncementModal = ({ onClose, onSave, brandColor }) => {
  const [text, setText] = useState('');
  const [active, setActive] = useState(true);
  const [pinned, setPinned] = useState(false);
  const [priority, setPriority] = useState(0);
  const [schedule, setSchedule] = useState(false);
  const [startAt, setStartAt] = useState('');
  const [endAt, setEndAt] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const MAX_CHARS = 200;

  const isInvalidDates = useMemo(() => {
    if (!schedule) return false;
    if (!startAt || !endAt) return false;
    const s = new Date(startAt);
    const e = new Date(endAt);
    return Number.isFinite(s.getTime()) && Number.isFinite(e.getTime()) && s > e;
  }, [schedule, startAt, endAt]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      toast('error', 'Announcement text cannot be empty.');
      return;
    }
    if (text.length > MAX_CHARS) {
      toast('error', `Announcement must be at most ${MAX_CHARS} characters.`);
      return;
    }
    if (isInvalidDates) {
      toast('error', 'Start date must be before end date.');
      return;
    }

    const payload = {
      text: text.trim(),
      active,
      pinned,
      priority: Number(priority) || 0,
      startAt: schedule && startAt ? new Date(startAt).toISOString() : null,
      endAt: schedule && endAt ? new Date(endAt).toISOString() : null,
    };

    try {
      setSubmitting(true);
      await onSave?.(payload);
      toast('success', 'Announcement created successfully');
    } catch (err) {
      toast('error', err?.message || 'Failed to create announcement');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 font-serif">New Announcement</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-800" aria-label="Close">
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <textarea
            placeholder="Type Announcement"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
            rows={5}
            maxLength={MAX_CHARS}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="text-right text-sm text-gray-500 mt-1">
            {text.length}/{MAX_CHARS} Characters
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
            />
            Active
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={pinned}
              onChange={(e) => setPinned(e.target.checked)}
            />
            Pinned
          </label>
        </div>

        <div>
          <label className="text-sm text-gray-700 mb-1 block">Priority (0 = lowest)</label>
          <input
            type="number"
            min={0}
            step={1}
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div className="border rounded-lg p-3">
          <label className="flex items-center gap-2 text-sm mb-2">
            <input
              type="checkbox"
              checked={schedule}
              onChange={(e) => setSchedule(e.target.checked)}
            />
            Schedule
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-600">Start At</label>
              <input
                type="datetime-local"
                value={startAt}
                onChange={(e) => setStartAt(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                disabled={!schedule}
              />
            </div>
            <div>
              <label className="text-xs text-gray-600">End At</label>
              <input
                type="datetime-local"
                value={endAt}
                onChange={(e) => setEndAt(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                disabled={!schedule}
              />
            </div>
          </div>
          {isInvalidDates && (
            <div className="text-xs text-red-600 mt-2">Start date must be before end date.</div>
          )}
        </div>

        <Button
          type="submit"
          disabled={submitting}
          style={{ backgroundColor: brandColor, opacity: submitting ? 0.8 : 1 }}
          className="w-full py-3 rounded-lg font-semibold text-white shadow-md hover:shadow-lg transition-shadow disabled:cursor-not-allowed"
        >
          {submitting ? 'Saving...' : 'Save'}
        </Button>
      </form>
    </div>
  );
};

export default CreateNewAnnouncementModal;