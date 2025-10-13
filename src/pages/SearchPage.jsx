// src/pages/SearchPage.jsx

import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSearchQuery } from '../services/queries/useSearchQuery';
import ProductDisplayCard from '../components/products/ProductDisplayCard'; // Assuming path
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  
  const query = useMemo(() => searchParams.get('q') || '', [searchParams]);
  const type = useMemo(() => searchParams.get('type') || 'product', [searchParams]);

  // Fetch search results using our new hook
  const { data: searchResults, isLoading, isError, error } = useSearchQuery({ q: query, type });
  
  const results = searchResults?.data || [];
  const pagination = searchResults?.meta;

  const renderResults = () => {
    if (isLoading) {
      return <div className="text-center p-8 text-gray-500">Searching...</div>;
    }
    if (isError) {
      return <div className="text-center p-8 text-red-500">Error: {error.message}</div>;
    }
    if (results.length === 0) {
      return <div className="text-center p-8 text-gray-500">No results found for "{query}".</div>;
    }

    if (type === 'product') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {results.map(product => (
            <ProductDisplayCard key={product.id} item={product} />
          ))}
        </div>
      );
    }
    // Add rendering for 'store' and 'service' types here
    return <div className="text-center p-8">Display for "{type}" search results is not implemented yet.</div>;
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Search Results</h1>
      <p className="text-gray-600 mb-6">
        Showing results for <span className="font-semibold">"{query}"</span> in {type}s.
      </p>
      {renderResults()}
      {/* Add pagination controls here using the `pagination` object if needed */}
    </div>
  );
};

export default SearchPage;