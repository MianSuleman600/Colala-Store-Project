import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, Camera } from "lucide-react";
import { useCameraOrBarcodeSearchMutation } from "../../services/mutations/useCameraOrBarcodeSearchMutation";

const SearchInput = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location]);

  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const { mutate: searchByImage } = useCameraOrBarcodeSearchMutation();

  useEffect(() => {
    setSearchTerm(searchParams.get("q") || "");
  }, [searchParams]);

  const handleSearchSubmit = () => {
    if (!searchTerm.trim()) return;
    navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}&type=product`);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") handleSearchSubmit();
  };

 const handleCameraClick = () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Call mutation with correct fields
    searchByImage(
  { type: "product", image: file }, // must pass `type` matching backend
  {
    onSuccess: (data) => {
      console.log("Camera search success:", data);
      navigate(`/search?type=camera&q=${encodeURIComponent(data.extracted_text)}`);
    },
    onError: (err) => console.error("Camera search failed", err),
  }
);

  };
  input.click();
};


  return (
    <div className="relative flex items-center w-full mx-2">
      <button onClick={handleSearchSubmit} className="absolute left-3 text-gray-500">
        <Search size={20} />
      </button>
      <input
        type="text"
        placeholder="Search products, shop or category"
        className="w-full py-2.5 pl-10 pr-10 rounded-lg bg-white text-gray-800"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleSearchKeyDown}
      />
      <button
        className="absolute right-3 text-gray-500 cursor-pointer"
        onClick={handleCameraClick}
      >
        <Camera size={24} />
      </button>
    </div>
  );
};

export default SearchInput;
