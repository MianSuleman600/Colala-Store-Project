import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { CameraIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useToast } from '../ui/ToastProvider';

const MAX_CHARS = 500;

const CreatePostModal = ({ isOpen, onClose, onCreatePost, isSubmitting, brandColor, contrastColor, userProfilePic }) => {
  const { push } = useToast();
  const [postText, setPostText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (!isOpen) {
      setPostText('');
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreviewUrl(null);
  }, [selectedFile]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleCreate = () => {
    if (!postText.trim() && !selectedFile) {
      push('Please add text or an image to post.', { type: 'error' });
      return;
    }
    
    const formData = new FormData();
    formData.append('body', postText.trim());
    if (selectedFile) {
      // ✅ THE FIX: Send the file with the key 'media[]' to be treated as an array by the backend.
      formData.append('media[]', selectedFile);
    }
    onCreatePost(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Post">
      <div className="p-4 flex flex-col space-y-4">
        <div className="flex items-start space-x-3">
          <img src={userProfilePic || '/default-profile.png'} alt="You" className="w-10 h-10 rounded-full object-cover" />
          <textarea maxLength={MAX_CHARS} className="flex-grow p-2 border rounded-lg resize-none" rows="4" placeholder="What's on your mind?" value={postText} onChange={(e) => setPostText(e.target.value)} />
        </div>
        <div className="text-xs text-gray-500 text-right">{postText.length}/{MAX_CHARS}</div>
        
        {previewUrl && (
          <div className="relative w-full h-48 rounded-lg overflow-hidden border">
            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
            <button onClick={() => { setSelectedFile(null); if (document.getElementById('create-post-file')) document.getElementById('create-post-file').value = null; }} className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white"><XMarkIcon className="h-4 w-4" /></button>
          </div>
        )}

        <label htmlFor="create-post-file" className="flex items-center gap-2 cursor-pointer text-blue-600 hover:text-blue-800 w-fit">
            <CameraIcon className="h-6 w-6" /> Add Image
        </label>
        <input id="create-post-file" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

        <Button onClick={handleCreate} className="w-full" style={{ backgroundColor: brandColor, color: contrastColor }} disabled={isSubmitting}>
          {isSubmitting ? 'Posting...' : 'Create Post'}
        </Button>
      </div>
    </Modal>
  );
};

export default CreatePostModal;