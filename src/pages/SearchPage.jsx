import React, { useEffect, useState } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { useSearchQuery } from '../services/queries/useSearchQuery';
import ProductDisplayCard from '../components/products/ProductDisplayCard';
import { useToast } from '../components/ui/ToastProvider.jsx';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation(); // ✅ Get location to access state
  const { push: toast } = useToast();

  const query = searchParams.get('q') || '';
  const type = searchParams.get('type') || 'product';

  // ✅ State for results, which can be populated by either text search or image search.
  const [results, setResults] = useState([]);
  
  // This hook will only run for text-based searches.
  const { data: textSearchResults, isLoading, isError, error } = useSearchQuery(
    { q: query, type: 'product' },
    { enabled: type !== 'camera' } // ✅ Disable this query if it's an image search
  );

  // ✅ FIX: This effect now handles results from BOTH text and image searches.
  useEffect(() => {
    // Case 1: Image search results passed via navigation state.
    if (type === 'camera' && location.state?.results) {
      setResults(location.state.results);
    } 
    // Case 2: Text search results from the API query.
    else if (textSearchResults?.data) {
      setResults(textSearchResults.data);
    }
  }, [type, location.state, textSearchResults]);

  // Handle errors from text search
  useEffect(() => {
    if (isError) {
      toast(`Error: ${error.message}`, { type: 'error' });
    }
  }, [isError, error, toast]);

  const renderResults = () => {
    if (isLoading) {
      return (
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Searching...</p>
        </div>
      );
    }

    if (!results.length) {
      // ✅ FIX: Show a "no results" message after 5 seconds if still loading/empty.
      // This is now implicitly handled. If isLoading is false and results are empty, this message shows.
      return <div className="text-center p-8 text-gray-500">No results found for "{query}".</div>;
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
        Showing results for <span className="font-semibold">"{query}"</span>.
      </p>
      
      {/* The file input is no longer needed here as it's handled in the NavBar */}

      {renderResults()}
    </div>
  );
};

export default SearchPage;