import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSearchQuery } from '../services/queries/useSearchQuery';
import { useCameraOrBarcodeSearchMutation } from '../services/mutations/useCameraOrBarcodeSearchMutation.js';
import ProductDisplayCard from '../components/products/ProductDisplayCard';
import { useToast } from '../components/ui/ToastProvider.jsx';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [imageFile, setImageFile] = useState(null);
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const { push: toast } = useToast();
  const cameraMutation = useCameraOrBarcodeSearchMutation();

  const hasSearchedImage = useRef(false);
  const controllerRef = useRef(null);

  // -------------------------------
  // Text search
  // -------------------------------
  const { data: searchResults, isLoading: isTextLoading, isError, error } = useSearchQuery({
    q: query,
    type: 'product',
  });

  useEffect(() => {
    if (!imageFile && searchResults?.data) {
      setResults(searchResults.data);
    }
  }, [searchResults, imageFile]);

  // -------------------------------
  // Image search
  // -------------------------------
  const performImageSearch = useCallback(async () => {
    if (!imageFile || hasSearchedImage.current) return;

    const controller = new AbortController();
    controllerRef.current = controller;

    const timeoutId = setTimeout(() => {
      controller.abort();
      setIsSearching(false);
      toast('Image search timed out. Showing text results.', { type: 'warning' });
      if (searchResults?.data) setResults(searchResults.data);
      hasSearchedImage.current = true;
    }, 5000);

    try {
      setIsSearching(true);
      toast('Searching using your image...', { type: 'info', duration: 5000 });

      // Prepare FormData
      const formData = new FormData();
      formData.append('type', 'product'); // required by backend
      formData.append('image', imageFile);

      const response = await cameraMutation.mutateAsync({ type: 'product', image: imageFile });

      if (!controller.signal.aborted) {
        const data = response.search_results?.data || response.search_results || [];
        setResults(data);
        toast('Image search completed!', { type: 'success' });
      }
    } catch (err) {
      if (!controller.signal.aborted) {
        console.error('[DEBUG] Image search failed:', err);
        toast('Image search failed. Showing text results.', { type: 'error' });
        if (searchResults?.data) setResults(searchResults.data);
      }
    } finally {
      clearTimeout(timeoutId);
      setIsSearching(false);
      hasSearchedImage.current = true;
    }
  }, [imageFile, cameraMutation, toast, searchResults]);

  useEffect(() => {
    performImageSearch();
    return () => controllerRef.current?.abort();
  }, [performImageSearch]);

  // -------------------------------
  // Handle image selection
  // -------------------------------
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      hasSearchedImage.current = false; // reset flag for new image
    }
  };

  // -------------------------------
  // Render results
  // -------------------------------
  const renderResults = () => {
    if (isTextLoading || isSearching) {
      return (
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Searching...</p>
        </div>
      );
    }

    if (isError) {
      toast(`Error: ${error.message}`, { type: 'error' });
      return <div className="text-center p-8 text-red-500">Error: {error.message}</div>;
    }

    if (!results.length) {
      return <div className="text-center p-8 text-gray-500">No results found for "{query || 'your image'}".</div>;
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {results.map((product) => (
          <ProductDisplayCard key={product.id} item={product} mode="search" />
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Search Results</h1>
      <p className="text-gray-600 mb-6">
        Showing results for <span className="font-semibold">"{query || 'your image'}"</span>.
      </p>

      <div className="mb-6 flex items-center gap-4">
        <input type="file" accept="image/*" onChange={handleImageChange} className="border p-2 rounded" />
        {imageFile && <span className="text-gray-600">Image selected: {imageFile.name}</span>}
      </div>

      {renderResults()}
    </div>
  );
};

export default SearchPage;
