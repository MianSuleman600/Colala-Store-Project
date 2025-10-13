// src/components/announcements/models/EditBannerModal.jsx

import React, { useEffect, useState } from 'react';
import Button from '../../ui/Button';
import { XMarkIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import { useToast } from '../../ui/ToastProvider';
import { useUpdateBannerMutation } from '../../../services/mutations/useBannerMutation';

const EditBannerModal = ({ bannerToEdit, onClose, brandColor }) => {
  const { push } = useToast();
  
  const [link, setLink] = useState(bannerToEdit?.link || '');
  const [alt, setAlt] = useState(bannerToEdit?.alt || '');
  const [imageFile, setImageFile] = useState(null);
  const [displayImageUrl, setDisplayImageUrl] = useState(bannerToEdit?.imageUrl || '');

  const { mutateAsync: updateBanner, isLoading: isSaving } = useUpdateBannerMutation();

  useEffect(() => {
    return () => { if (displayImageUrl && displayImageUrl.startsWith('blob:')) URL.revokeObjectURL(displayImageUrl); };
  }, [displayImageUrl]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) { push('Please select a valid image file.', { type: 'error' }); return; }
      if (displayImageUrl && displayImageUrl.startsWith('blob:')) URL.revokeObjectURL(displayImageUrl);
      setImageFile(file);
      setDisplayImageUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = new FormData();
    payload.append('link', link);
    payload.append('alt', alt);
    
    // Only append the image if a new one was selected
    if (imageFile) {
      payload.append('image', imageFile);
    }
    
    try {
      await updateBanner({ id: bannerToEdit.id, payload });
      onClose(); // Close the modal on success
    } catch (err) {
      // Error toast is handled by the mutation hook
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Edit Banner</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-800" aria-label="Close">
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label htmlFor="banner-edit-upload" className="border border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer">
          {displayImageUrl ? (
            <img src={displayImageUrl} alt="Banner Preview" className="max-h-48 w-auto object-contain rounded-md mb-2" />
          ) : (
            <ArrowUpTrayIcon className="h-10 w-10 text-gray-400 mb-2" />
          )}
          <span className="text-sm font-medium">{imageFile ? imageFile.name : 'Change Banner Image'}</span>
          <input id="banner-edit-upload" type="file" accept="image/*" className="sr-only" onChange={handleImageChange} />
        </label>

        <input type="url" placeholder="Banner Link (optional)" value={link} onChange={(e) => setLink(e.target.value)} className="w-full p-3 border rounded-lg" />
        <input type="text" value={alt} onChange={(e) => setAlt(e.target.value)} className="w-full p-3 border rounded-lg" placeholder="Alt text for accessibility" />

        <Button type="submit" disabled={isSaving} style={{ backgroundColor: brandColor }} className="w-full py-3 rounded-lg font-semibold text-white">
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </div>
  );
};

export default EditBannerModal;