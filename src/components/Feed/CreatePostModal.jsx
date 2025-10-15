import React, { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { CameraIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useToast } from "../ui/ToastProvider";

const MAX_CHARS = 500;
const MAX_FILES = 5;

const CreatePostModal = ({
  isOpen,
  onClose,
  onCreatePost,
  isSubmitting,
  brandColor = "#E14E4E",
  contrastColor = "#ffffff",
  userProfilePic,
}) => {
  const { push } = useToast();
  const [postText, setPostText] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setPostText("");
      setSelectedFiles([]);
      setPreviewUrls([]);
      const fileInput = document.getElementById("create-post-file");
      if (fileInput) fileInput.value = null;
    }
  }, [isOpen]);

  // Generate preview URLs for images
  useEffect(() => {
    if (selectedFiles.length === 0) return setPreviewUrls([]);
    const urls = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);

    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [selectedFiles]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (selectedFiles.length + files.length > MAX_FILES) {
      push(`You can upload a maximum of ${MAX_FILES} images.`, { type: "error" });
      return;
    }

    setSelectedFiles((prev) => [...prev, ...files]);
    e.target.value = null; // Reset file input
  };

  const handleRemoveImage = (indexToRemove) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== indexToRemove));
    const fileInput = document.getElementById("create-post-file");
    if (fileInput) fileInput.value = null;
  };

  const handleCreate = () => {
    if (!postText.trim() && selectedFiles.length === 0) {
      push("Please add text or an image to post.", { type: "error" });
      return;
    }

    const formData = new FormData();
    formData.append("body", postText.trim());
    selectedFiles.forEach((file) => formData.append("media[]", file));
    onCreatePost(formData);
  };

  return (
  <Modal
  isOpen={isOpen}
  onClose={onClose}
  title="Create Post"
  className="max-w-lg w-full"
  titleClassName="text-center" // <-- Add this
>

      {/* Post Body */}
      <div className="p-4 space-y-4">
        {/* Textarea with profile picture */}
        <div className="relative bg-white shadow-xl  rounded-xl p-3">
          <img
            src={userProfilePic || "/default-profile.png"}
            alt="You"
            className="w-11 h-11 rounded-full object-cover absolute left-4 top-4 border-2 border-white shadow-sm"
          />
          <textarea
            maxLength={MAX_CHARS}
            rows={4}
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            placeholder="What is on your mind"
            className="w-full resize-none bg-transparent p-3 pl-[76px] pr-3 outline-none text-sm placeholder:text-gray-400"
          />
          <div className="text-xs text-gray-400 text-right mt-1">
            {postText.length}/{MAX_CHARS}
          </div>
        </div>

        {/* Main Preview Image */}
        {previewUrls.length > 0 && (
          <div className="relative w-full rounded-xl overflow-hidden">
            <img
              src={previewUrls[0]}
              alt="Main preview"
              className="w-full h-64 object-cover rounded-xl"
            />
            <button
              onClick={() => handleRemoveImage(0)}
              className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-black/80 transition"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Additional Image Previews */}
        <div className="space-y-3 shadow-xl rounded-2xl">
          <div className="flex items-center gap-3 flex-wrap">
            <label
              htmlFor="create-post-file"
              className="w-[68px] h-[68px] rounded-lg flex items-center justify-center cursor-pointer bg-gray-100 hover:bg-gray-200 transition flex-shrink-0"
              title="Add images"
            >
              <CameraIcon className="h-6 w-6 text-gray-600" />
            </label>

            {previewUrls.slice(1).map((url, index) => (
              <div
                key={url}
                className="relative w-[68px] h-[68px] rounded-lg overflow-hidden flex-shrink-0"
              >
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  onClick={() => handleRemoveImage(index + 1)}
                  className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-black/80 transition"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>

          <input
            id="create-post-file"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Create Post Button */}
        <Button
          onClick={handleCreate}
          className="w-full py-3 rounded-xl text-sm font-semibold"
          style={{ backgroundColor: brandColor, color: contrastColor }}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Posting..." : "Create Post"}
        </Button>
      </div>
    </Modal>
  );
};

export default CreatePostModal;
