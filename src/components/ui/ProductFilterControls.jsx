import React, { useState, useCallback } from 'react';
import { Filter, Search } from 'lucide-react';
import { debounce } from 'lodash';
import PropTypes from 'prop-types';

// Import the new TanStack Query hook
import  {useGetMyProductsQuery}  from '../../services/queries/useproductsQuery';

// Assuming you have these components imported correctly
import StoreProductsGrid from '../store/StoreProductsGrid';
import { getContrastTextColor } from '../../utils/colorUtils'; // You might need this for styling

const ProductFilterControls = () => {
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState(null);

    // TanStack Query hook to fetch products based on search and filter parameters
    const { data: products = [], isLoading } = useGetMyProductsQuery({
        search: searchTerm,
        filterType: filterType,
    });

    const handleSearchChange = useCallback(
        debounce((value) => {
            setSearchTerm(value);
        }, 500),
        []
    );

    const handleFilterChange = (newFilterType) => {
        setFilterType(newFilterType);
        setIsFilterModalOpen(false);
    };

    // The component now renders both the controls and the product grid
    return (
        <>
            <div className="flex items-center space-x-4 mb-6 relative">
                <div className="flex w-full border border-gray-300 rounded-lg focus-within:ring-1 focus-within:ring-purple-500">
                    <div className="relative flex-grow">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search store products"
                            className="w-full p-3 pl-10 pr-2 border-r-0 border-none rounded-l-lg focus:outline-none"
                            onChange={(e) => handleSearchChange(e.target.value)}
                        />
                    </div>
                    <button
                        className="p-3 bg-white border-l border-gray-300 rounded-r-lg hover:bg-gray-100 transition-colors"
                        onClick={() => setIsFilterModalOpen(prev => !prev)}
                    >
                        <Filter className="w-5 h-5 text-gray-700" />
                    </button>
                </div>

                {isFilterModalOpen && (
                    <div className="absolute top-12 right-0 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                        <ul className="py-2">
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm" onClick={() => handleFilterChange('sponsored')}>Sponsored</li>
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm" onClick={() => handleFilterChange('price-low-high')}>Price: Low to High</li>
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm" onClick={() => handleFilterChange('price-high-low')}>Price: High to Low</li>
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm" onClick={() => handleFilterChange(null)}>Clear Filter</li>
                        </ul>
                    </div>
                )}
            </div>

            {/* Render loading state or products grid */}
            {isLoading ? (
                <div className="flex items-center justify-center p-4">
                    <p className="text-gray-500">Loading products...</p>
                </div>
            ) : (
                <StoreProductsGrid
                    products={products}
                />
            )}
        </>
    );
};

export default ProductFilterControls;
