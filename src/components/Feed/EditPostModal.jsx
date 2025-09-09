import React, { useEffect, useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { CameraIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useToast } from '../ui/ToastProvider';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_CHARS = 500;

const EditPostModal = ({
  isOpen,
  onClose,
  onEditPost, // function(postId, payload) -> may return promise
  post,
  brandColor = '#EF4444',
  contrastColor = '#FFFFFF',
  userProfilePic,
  selectableImages = [],
}) => {
  const { push } = useToast();

  const [postText, setPostText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isRemovingExistingImage, setIsRemovingExistingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Load post data when modal opens or post changes
  useEffect(() => {
    if (isOpen && post) {
      setPostText(post.text || '');
      setSelectedFile(null);
      setPreviewUrl(post.imageUrl || null);
      setIsRemovingExistingImage(false);
    }
  }, [isOpen, post]);

  useEffect(() => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [selectedFile]);

  if (!isOpen) return null;

  const validateFile = (file) => {
    if (!file) return true;
    if (!ACCEPTED_TYPES.includes(file.type)) {
      push('Unsupported file type. Please upload PNG/JPEG/WebP images.', { type: 'error' });
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      push('File is too large. Maximum size is 5 MB.', { type: 'error' });
      return false;
    }
    return true;
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file || !validateFile(file)) return;
    setSelectedFile(file);
    setIsRemovingExistingImage(false);
  };

  const handlePickSelectable = (imgUrl) => {
    setSelectedFile(null);
    setPreviewUrl(imgUrl);
    setIsRemovingExistingImage(false);
  };

  const isChanged = () => {
    return (
      (postText || '').trim() !== (post?.text || '').trim() ||
      Boolean(selectedFile) ||
      isRemovingExistingImage ||
      previewUrl !== post?.imageUrl
    );
  };

  const handleSave = async () => {
    if (!isChanged()) {
      onClose?.();
      return;
    }
    if (!postText.trim() && !selectedFile && !previewUrl) {
      push('Please add some text or select an image to save.', { type: 'error' });
      return;
    }

    setSubmitting(true);

    // Build payload for API
    let payload;
    if (selectedFile) {
      payload = new FormData();
      payload.append('text', postText.trim());
      payload.append('image', selectedFile);
    } else if (isRemovingExistingImage) {
      payload = { text: postText.trim(), removeImage: true };
    } else {
      payload = { text: postText.trim(), imageUrl: previewUrl || null };
    }

    try {
      const res = onEditPost ? onEditPost(post.id, payload) : null;
      if (res && typeof res.then === 'function') {
        await res;
      }
      push('Post updated successfully.', { type: 'success' });
      onClose?.();
    } catch (err) {
      push(err?.message || 'Failed to update post.', { type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Post" className="max-w-md" aria-label="Edit post">
      <div className="p-4 flex flex-col rounded-2xl space-y-4">
        {/* User Avatar & Text */}
        <div className="relative flex items-start space-x-3 p-2 border border-gray-200 rounded-2xl bg-gray-100 min-h-[120px]">
          <img
            src={userProfilePic || '/default-profile.png'}
            alt="Your Profile"
            className="w-10 h-10 rounded-full object-cover flex-shrink-0 mt-1 ml-1"
            onError={(e) => (e.currentTarget.src = '/default-profile.png')}
          />
          <textarea
            aria-label="Edit post text"
            maxLength={MAX_CHARS}
            className="flex-grow p-2 pl-0 bg-transparent rounded-lg focus:outline-none resize-none text-gray-800"
            rows="4"
            placeholder="Edit your post..."
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            style={{ minHeight: '80px' }}
          />
        </div>

        {/* Character count */}
        <div className="flex justify-between items-center text-xs text-gray-500 px-1">
          <div>{postText.length}/{MAX_CHARS}</div>
          <div className="text-right text-xs">{previewUrl ? 'Image selected' : 'No image'}</div>
        </div>

        {/* Image Preview */}
        {previewUrl && (
          <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200">
            <img src={previewUrl} alt="Edit preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => {
                setSelectedFile(null);
                setPreviewUrl(null);
                setIsRemovingExistingImage(true);
              }}
              className="absolute top-2 right-2 p-1 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75 transition-colors"
              aria-label="Remove image"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* File Upload & Selectable Images */}
        <input id="edit-file-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        <div className="flex space-x-2 overflow-x-auto p-2 border border-gray-200 rounded-lg bg-gray-50 items-center">
          <label
            htmlFor="edit-file-upload"
            className="flex-shrink-0 w-16 h-16 flex items-center justify-center rounded-md border-2 border-dashed border-gray-300 text-gray-400 hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Upload replacement image"
            title="Upload image"
          >
            <CameraIcon className="h-6 w-6" />
          </label>

          {selectableImages.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`Selectable ${i + 1}`}
              className={`flex-shrink-0 w-16 h-16 object-cover rounded-md cursor-pointer border-2 ${
                previewUrl === img ? 'border-blue-500' : 'border-transparent'
              } hover:border-gray-300 transition-colors`}
              onClick={() => handlePickSelectable(img)}
            />
          ))}
        </div>

        {/* Save Button */}
        <Button
          type="button"
          onClick={handleSave}
          className="w-full py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-shadow text-white"
          style={{ backgroundColor: brandColor, color: contrastColor, cursor: submitting ? 'not-allowed' : 'pointer' }}
          disabled={submitting || !isChanged()}
          aria-disabled={submitting || !isChanged()}
        >
          {submitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </Modal>
  );
};

export default EditPostModal;