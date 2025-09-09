import React, { useEffect, useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { CameraIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useToast } from '../ui/ToastProvider';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_CHARS = 500;

const CreatePostModal = ({
  isOpen,
  onClose,
  onCreatePost,
  brandColor = '#EF4444',
  contrastColor = '#FFFFFF',
  userProfilePic,
  defaultUserName = 'You',
  defaultLocation = '—',
  selectableImages = [],
}) => {
  const { push } = useToast();
  const [postText, setPostText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setPostText('');
      setSelectedFile(null);
      setPreviewUrl(null);
      setSubmitting(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [selectedFile]);

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
    if (!file) return;
    if (!validateFile(file)) return;
    setSelectedFile(file);
  };

  const handlePickSelectable = (imgUrl) => {
    setSelectedFile(null);
    setPreviewUrl(imgUrl);
  };

  const isValidSubmission = () => {
    return postText.trim().length > 0 || selectedFile || previewUrl;
  };

  const handleCreate = async () => {
    if (!isValidSubmission()) {
      push('Please type something or select an image to create a post.', { type: 'error' });
      return;
    }

    setSubmitting(true);

    let payload = null;
    if (selectedFile) {
      const form = new FormData();
      form.append('text', postText.trim());
      form.append('image', selectedFile);
      payload = form;
    } else if (previewUrl && selectableImages.includes(previewUrl)) {
      payload = { text: postText.trim(), imageUrl: previewUrl };
    } else {
      payload = { text: postText.trim() };
    }

    try {
      const res = onCreatePost ? onCreatePost(payload) : null;
      if (res && typeof res.then === 'function') {
        await res;
      }
      push('Post created', { type: 'success' });
      onClose?.();
    } catch (err) {
      push(err?.message || 'Failed to create post', { type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Post" className="max-w-md">
      <div className="p-4 flex flex-col space-y-4">
        <div className="relative flex items-start space-x-3 p-2 border border-gray-200 rounded-2xl bg-gray-100 min-h-[120px]">
          <img
            src={userProfilePic || '/default-profile.png'}
            alt="Your profile"
            className="w-10 h-10 rounded-full object-cover flex-shrink-0 mt-1 ml-1"
            onError={(e) => (e.currentTarget.src = '/default-profile.png')}
          />
          <textarea
            maxLength={MAX_CHARS}
            className="flex-grow p-2 pl-0 bg-transparent rounded-lg focus:outline-none resize-none text-gray-800"
            rows="4"
            placeholder="What is on your mind?"
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
          />
        </div>

        <div className="flex justify-between items-center text-xs text-gray-500 px-1">
          <div>{postText.length}/{MAX_CHARS}</div>
          <div className="text-right">{previewUrl ? 'Image selected' : 'No image'}</div>
        </div>

        {previewUrl && (
          <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200">
            <img src={previewUrl} alt="Selected preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => {
                setSelectedFile(null);
                setPreviewUrl(null);
              }}
              className="absolute top-2 right-2 p-1 bg-black bg-opacity-50 rounded-full text-white"
              aria-label="Remove image"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        )}

        <input id="create-file-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        <div className="flex space-x-2 overflow-x-auto p-2 border border-gray-200 rounded-lg bg-gray-50 items-center">
          <label
            htmlFor="create-file-upload"
            className="flex-shrink-0 w-16 h-16 flex items-center justify-center rounded-md border-2 border-dashed border-gray-300 text-gray-400 hover:bg-gray-100 cursor-pointer"
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
              } hover:border-gray-300`}
              onClick={() => handlePickSelectable(img)}
            />
          ))}
        </div>

        <Button
          type="button"
          onClick={handleCreate}
          className="w-full py-3 rounded-lg font-semibold shadow-md text-white"
          style={{ backgroundColor: brandColor, color: contrastColor }}
          disabled={submitting}
          aria-disabled={submitting}
        >
          {submitting ? 'Posting...' : 'Create Post'}
        </Button>
      </div>
    </Modal>
  );
};

export default CreatePostModal;