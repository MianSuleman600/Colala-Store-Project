// src/components/announcements/models/EditBannerModal.jsx
import React, { useEffect, useMemo, useState } from 'react';
import Button from '../../ui/Button';
import { XMarkIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';

const toast = (type, message) => {
  try {
    window.dispatchEvent(new CustomEvent('SHOW_ALERT', { detail: { type, message } }));
  } catch {}
};

const isValidUrl = (url) => {
  if (!url) return false;
  try {
    const u = new URL(url.startsWith('http') ? url : `https://${url}`);
    return !!u.hostname;
  } catch {
    return false;
  }
};

const EditBannerModal = ({ bannerToEdit, onClose, onSave, brandColor }) => {
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [imageUrl, setImageUrl] = useState(bannerToEdit?.imageUrl || '');
  const [link, setLink] = useState(bannerToEdit?.link || '');
  const [placement, setPlacement] = useState(bannerToEdit?.placement || 'home');
  const [alt, setAlt] = useState(bannerToEdit?.alt || 'Promotional Banner');
  const [active, setActive] = useState(Boolean(bannerToEdit?.active));
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const canPreview = useMemo(() => {
    return Boolean(previewUrl || imageUrl);
  }, [previewUrl, imageUrl]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setImageFile(null);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl('');
      return;
    }
    if (!file.type.startsWith('image/')) {
      toast('error', 'Please select a valid image file.');
      return;
    }
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    const url = URL.createObjectURL(file);
    setImageFile(file);
    setPreviewUrl(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile && !isValidUrl(imageUrl)) {
      toast('error', 'Please upload an image or provide a valid image URL.');
      return;
    }
    if (link && !isValidUrl(link)) {
      toast('error', 'Please provide a valid link URL.');
      return;
    }

    const payload = {
      ...bannerToEdit,
      imageUrl: imageUrl || previewUrl || bannerToEdit.imageUrl,
      link: link ? (link.startsWith('http') ? link : `https://${link}`) : '',
      placement,
      alt: alt || 'Promotional Banner',
      active,
      imageFile: imageFile || null, // optional for backend that supports multipart
    };

    try {
      setSubmitting(true);
      await onSave?.(payload);
      toast('success', 'Banner updated');
    } catch (err) {
      toast('error', err?.message || 'Failed to update banner');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 font-serif">Edit Banner</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-800" aria-label="Close">
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Upload or URL */}
        <div className="border border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center hover:border-red-500 transition-colors duration-200">
          <label htmlFor="banner-edit-upload" className="flex flex-col items-center cursor-pointer text-gray-600">
            {canPreview ? (
              <img
                src={previewUrl || imageUrl}
                alt="Banner Preview"
                className="max-h-48 w-auto object-contain rounded-md mb-2"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = 'https://placehold.co/600x200/e0e0e0/000000?text=No+Preview';
                }}
              />
            ) : (
              <ArrowUpTrayIcon className="h-10 w-10 text-gray-400 mb-2" />
            )}
            <span className="text-sm font-medium">Change Banner Image</span>
            <input id="banner-edit-upload" type="file" accept="image/*" className="sr-only" onChange={handleImageChange} />
          </label>
          <div className="mt-3 w-full">
            <label className="text-xs text-gray-600">Or paste image URL</label>
            <input
              type="url"
              placeholder="https://example.com/banner.jpg"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>
        </div>

        {/* Link */}
        <div>
          <input
            type="url"
            placeholder="Banner Link (e.g., https://yourstore.com/promo)"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
        </div>

        {/* Placement and Active */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-gray-700 mb-1 block">Placement</label>
            <select
              value={placement}
              onChange={(e) => setPlacement(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="home">Home</option>
              <option value="profile">Profile</option>
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm mt-6 md:mt-0">
            <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
            Active
          </label>
        </div>

        {/* Alt */}
        <div>
          <label className="text-sm text-gray-700 mb-1 block">Alt text</label>
          <input
            type="text"
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Describe the banner"
          />
        </div>

        <Button
          type="submit"
          disabled={submitting}
          style={{ backgroundColor: brandColor, opacity: submitting ? 0.8 : 1 }}
          className="w-full py-3 rounded-lg font-semibold text-white shadow-md hover:shadow-lg transition-shadow disabled:cursor-not-allowed"
        >
          {submitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </div>
  );
};

export default EditBannerModal;