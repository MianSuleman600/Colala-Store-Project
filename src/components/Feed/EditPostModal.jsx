import React, { useEffect, useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { CameraIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useToast } from '../ui/ToastProvider';

const MAX_CHARS = 500;

const EditPostModal = ({ isOpen, onClose, onEditPost, isSubmitting, post, brandColor, contrastColor, userProfilePic }) => {
  const { push } = useToast();
  const [postText, setPostText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isRemovingExistingImage, setIsRemovingExistingImage] = useState(false);

  useEffect(() => {
    if (isOpen && post) {
      setPostText(post.text || '');
      setPreviewUrl(post.imageUrl || null);
      setSelectedFile(null);
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

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setIsRemovingExistingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsRemovingExistingImage(true);
    if (document.getElementById('edit-post-file')) {
      document.getElementById('edit-post-file').value = null;
    }
  };

  const handleSave = () => {
    const formData = new FormData();
    formData.append('body', postText.trim());
    
    if (selectedFile) {
      // ✅ THE FIX: Send the file with the key 'media[]' to match the backend validation.
      formData.append('media[]', selectedFile);
    } else if (isRemovingExistingImage) {
      // Send an explicit empty array for media to signal removal
      formData.append('media', '');
    }
    
    onEditPost(post.id, formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Post">
      <div className="p-4 flex flex-col space-y-4">
        <div className="flex items-start space-x-3">
          <img src={userProfilePic || '/default-profile.png'} alt="You" className="w-10 h-10 rounded-full object-cover" />
          <textarea maxLength={MAX_CHARS} className="flex-grow p-2 border rounded-lg resize-none" rows="4" value={postText} onChange={(e) => setPostText(e.target.value)} />
        </div>
        <div className="text-xs text-gray-500 text-right">{postText.length}/{MAX_CHARS}</div>

        {previewUrl && (
          <div className="relative w-full h-48 rounded-lg overflow-hidden border">
            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
            <button onClick={handleRemoveImage} className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white"><XMarkIcon className="h-4 w-4" /></button>
          </div>
        )}

        <label htmlFor="edit-post-file" className="flex items-center gap-2 cursor-pointer text-blue-600 hover:text-blue-800 w-fit">
          <CameraIcon className="h-6 w-6" /> {previewUrl ? 'Change Image' : 'Add Image'}
        </label>
        <input id="edit-post-file" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

        <Button onClick={handleSave} className="w-full" style={{ backgroundColor: brandColor, color: contrastColor }} disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </Modal>
  );
};

export default EditPostModal;