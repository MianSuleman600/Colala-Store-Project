// src/components/announcements/models/CreateNewBannerModal.jsx
import React, { useState } from 'react';
import Button from '../../ui/Button';
import { XMarkIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import { useToast } from '../../ui/ToastProvider';

const CreateNewBannerModal = ({ isOpen, onClose, onSave, isSubmitting, brandColor }) => {
  const { push } = useToast();
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [link, setLink] = useState('');
  
  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        push('Please select a valid image file.', { type: 'error' });
        return;
      }
      setImageFile(file);
      // Create a URL for previewing the selected file
      setPreviewUrl(URL.createObjectURL(file));
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!imageFile) {
      push('Please upload an image for the banner.', { type: 'error' });
      return;
    }
    // The mutation hook will build the FormData
    onSave?.({ imageFile, link, active: true, placement: 'home' });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="p-6 flex justify-between items-center border-b">
          <h2 className="text-xl font-semibold">New Banner</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><XMarkIcon className="h-6 w-6" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <label htmlFor="banner-upload" className="border border-dashed rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer">
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="max-h-32 mb-4 rounded-md object-contain" />
            ) : (
              <ArrowUpTrayIcon className="h-10 w-10 text-gray-400 mb-2" />
            )}
            <span className="text-sm font-medium">{imageFile ? imageFile.name : 'Upload Banner Image'}</span>
            <input id="banner-upload" type="file" accept="image/*" className="sr-only" onChange={handleImageChange} />
          </label>
          <input type="url" placeholder="Banner Link (optional)" className="w-full p-3 border rounded-lg" value={link} onChange={(e) => setLink(e.target.value)} />
          <Button type="submit" disabled={isSubmitting} style={{ backgroundColor: brandColor }} className="w-full py-3 rounded-lg font-semibold text-white">
            {isSubmitting ? 'Saving...' : 'Save Banner'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateNewBannerModal;