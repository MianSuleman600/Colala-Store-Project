// src/components/Dashboard/PromotedSection/ExtendPromotionModal.jsx
import React, { useMemo, useState } from 'react';
import Modal from '../../ui/Modal';
import Button from '../../ui/Button';

const ExtendPromotionModal = ({ isOpen, onClose, onConfirm, product, brandColor, contrastTextColor }) => {
  const [dailyBudget, setDailyBudget] = useState('');
  const [durationDays, setDurationDays] = useState('');

  const totalCost = useMemo(() => {
    const d = Number(dailyBudget || 0);
    const n = Number(durationDays || 0);
    return d > 0 && n > 0 ? d * n : 0;
  }, [dailyBudget, durationDays]);

  const canSubmit = Number(dailyBudget) > 0 && Number(durationDays) > 0;

  const submit = () => {
    if (!canSubmit) return;
    onConfirm({ dailyBudget: Number(dailyBudget), durationDays: Number(durationDays) });
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Extend ${product?.name || 'Promotion'}`} className="max-w-md">
      <div className="p-4 space-y-4">
        <div>
          <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">Daily Budget (₦)</label>
          <input
            id="budget"
            type="number"
            min="0"
            value={dailyBudget}
            onChange={(e) => setDailyBudget(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="e.g. 1000"
          />
        </div>

        <div>
          <label htmlFor="days" className="block text-sm font-medium text-gray-700 mb-1">Duration (Days)</label>
          <input
            id="days"
            type="number"
            min="1"
            value={durationDays}
            onChange={(e) => setDurationDays(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="e.g. 7"
          />
        </div>

        <div className="text-sm text-gray-700">
          Estimated additional cost:{' '}
          <span className="font-semibold">{totalCost ? `₦${totalCost.toLocaleString()}` : '--'}</span>
        </div>

        <div className="flex gap-3 pt-2">
          <Button onClick={onClose} className="flex-1 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300">Cancel</Button>
          <Button
            onClick={submit}
            disabled={!canSubmit}
            className="flex-1 py-2 rounded-lg font-semibold"
            style={{ backgroundColor: brandColor, color: contrastTextColor, opacity: canSubmit ? 1 : 0.7 }}
          >
            Extend
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ExtendPromotionModal;