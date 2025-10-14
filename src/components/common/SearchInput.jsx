import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Camera } from "lucide-react";
import { useCameraOrBarcodeSearchMutation } from "../../services/mutations/useCameraOrBarcodeSearchMutation";
import { useDebounce } from "../../hooks/useDebounce"; // ✅ IMPORT: The new debounce hook
import { useToast } from "../ui/ToastProvider"; // ✅ IMPORT: Toast for notifications

const SearchInput = () => {
  const navigate = useNavigate();
  const { push: toast, dismiss: dismissToast } = useToast(); // ✅ Get toast functions

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // ✅ DEBOUNCE: Wait 500ms after user stops typing

  const { mutate: searchByImage, isLoading: isImageSearching } = useCameraOrBarcodeSearchMutation();

  // ✅ FIX: This effect now triggers the search automatically and only ONCE after the user stops typing.
  // This is the core fix for the 1000+ request loop for text search.
  useEffect(() => {
    if (debouncedSearchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(debouncedSearchTerm.trim())}&type=product`);
    }
  }, [debouncedSearchTerm, navigate]);

  // ✅ FIX: Complete image search logic is now handled here, including timeout and notifications.
  const handleCameraClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file || isImageSearching) return;

      const toastId = toast('Searching with your image...', { type: 'info', duration: 0 }); // Show indefinite toast

      // Create a promise that rejects after 5 seconds
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Search timed out')), 5000)
      );

      // Race the mutation against the timeout
      Promise.race([
        searchByImage({ type: "product", image: file }),
        timeoutPromise
      ])
      .then((data) => {
        dismissToast(toastId); // Remove "searching" toast
        toast('Image search complete!', { type: 'success' });
        // Navigate with results in state to avoid a second API call on the results page
        navigate(`/search?q=${encodeURIComponent(data.extracted_text || 'image_search')}&type=camera`, {
          state: { results: data.search_results?.data || [] },
        });
      })
      .catch((err) => {
        dismissToast(toastId); // Remove "searching" toast
        if (err.message === 'Search timed out') {
          toast('Image search took too long. Please try again.', { type: 'warning' });
        } else {
          toast('Image search failed. Please try again.', { type: 'error' });
          console.error("Camera search failed", err);
        }
      });
    };
    input.click();
  };

  return (
    <div className="relative flex items-center w-full mx-2">
      <div className="absolute left-3 text-gray-500">
        <Search size={20} />
      </div>
      <input
        type="text"
        placeholder="Search products, shop or category"
        className="w-full py-2.5 pl-10 pr-10 rounded-lg bg-white text-gray-800"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        // onKeyDown and onSubmit are no longer needed due to debouncing
      />
      <button
        className="absolute right-3 text-gray-500 cursor-pointer"
        onClick={handleCameraClick}
        disabled={isImageSearching} // Disable button while searching
      >
        <Camera size={24} />
      </button>
    </div>
  );
};

export default SearchInput;