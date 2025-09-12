// src/components/products/ProductDeleteModal.jsx
import React from 'react';
import Button from '..//ui/Button';

const ProductDeleteModal = ({ open, onClose, onConfirm, productName, brandColor, contrastTextColor }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Deletion</h3>
        <p className="text-gray-700 mb-6">
          Are you sure you want to delete <span className="font-bold">{productName}</span>? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-3">
          <Button onClick={onClose} className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50">
            Cancel
          </Button>
          <Button onClick={onConfirm} className="px-4 py-2 rounded-md text-white font-semibold" style={{ backgroundColor: brandColor, color: contrastTextColor }}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDeleteModal;