import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Filter, Search, X } from 'lucide-react';
import debounce from 'lodash/debounce';
import PropTypes from 'prop-types';

// UI-only. Parent owns products and filtering.
// Props contract:
// - value: { search, sort, isSponsored, ... } current filters
// - onChange: (partial) => void  updates filter state in parent
// Optional props: filters, onFilterChange, onFiltersChange for backward-compat

const ProductFilterControls = ({
  value,
  onChange,
  // Backward-compat prop names
  filters,
  onFilterChange,
  onFiltersChange,
  className = '',
  placeholder = 'Search store products',
  showSponsored = true,
  showSort = true,
}) => {
  const current = value || filters || {};
  const emitChange = onChange || onFilterChange || onFiltersChange || (() => {});

  // Local state for search input; debounced updates to parent
  const [localSearch, setLocalSearch] = useState(current.search || '');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Keep local input synced with parent changes
  useEffect(() => {
    if ((current.search || '') !== localSearch) {
      setLocalSearch(current.search || '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current.search]);

  // Debounced emitter (memoized)
  const debouncedEmitSearch = useMemo(
    () =>
      debounce((next) => {
        emitChange({ search: next });
      }, 300),
    [emitChange]
  );

  useEffect(() => {
    return () => debouncedEmitSearch.cancel();
  }, [debouncedEmitSearch]);

  const onSearchChange = (e) => {
    const next = e.target.value;
    setLocalSearch(next);
    debouncedEmitSearch(next);
  };

  // Dropdown: close on outside click / Escape
  const wrapperRef = useRef(null);
  useEffect(() => {
    if (!isFilterModalOpen) return;
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsFilterModalOpen(false);
      }
    };
    const handleEsc = (e) => {
      if (e.key === 'Escape') setIsFilterModalOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isFilterModalOpen]);

  const setSort = (sort) => emitChange({ sort });
  const setSponsored = (flag) => emitChange({ isSponsored: flag });

  const clearFilters = () => {
    setLocalSearch('');
    emitChange({
      search: '',
      sort: 'none', // keep API order
      isSponsored: false,
    });
    setIsFilterModalOpen(false);
  };

  const isSponsoredActive = Boolean(current.isSponsored);
  const sort = current.sort || 'none';

  return (
    <div className={`relative ${className}`} ref={wrapperRef}>
      <div className="flex items-center space-x-4 mb-6">
        <div className="flex w-full border border-gray-300 rounded-lg focus-within:ring-1 focus-within:ring-purple-500 bg-white">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={placeholder}
              className="w-full p-3 pl-10 pr-9 rounded-l-lg focus:outline-none"
              value={localSearch}
              onChange={onSearchChange}
            />
            {localSearch ? (
              <button
                type="button"
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                onClick={clearFilters}
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </div>
          <button
            type="button"
            className="p-3 bg-white border-l border-gray-300 rounded-r-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsFilterModalOpen((prev) => !prev)}
            aria-expanded={isFilterModalOpen}
            aria-haspopup="menu"
            aria-label="Open filters"
          >
            <Filter className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>

      {isFilterModalOpen && (
        <div
          role="menu"
          className="absolute top-14 right-0 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-20"
        >
          <div className="py-2 text-sm">
            {showSponsored && (
              <>
                <div className="px-4 py-2 font-semibold text-gray-500">Quick Filters</div>
                <button
                  type="button"
                  className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                    isSponsoredActive ? 'text-green-700 font-semibold' : 'text-gray-700'
                  }`}
                  onClick={() => {
                    setSponsored(!isSponsoredActive);
                    setIsFilterModalOpen(false);
                  }}
                >
                  {isSponsoredActive ? 'Sponsored: On' : 'Sponsored: Off'}
                </button>
                <div className="h-px bg-gray-200 my-2" />
              </>
            )}

            {showSort && (
              <>
                <div className="px-4 py-2 font-semibold text-gray-500">Sort By</div>
                <button
                  type="button"
                  className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                    sort === 'priceAsc' ? 'font-semibold text-gray-900' : 'text-gray-700'
                  }`}
                  onClick={() => {
                    setSort('priceAsc');
                    setIsFilterModalOpen(false);
                  }}
                >
                  Price: Low to High
                </button>
                <button
                  type="button"
                  className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                    sort === 'priceDesc' ? 'font-semibold text-gray-900' : 'text-gray-700'
                  }`}
                  onClick={() => {
                    setSort('priceDesc');
                    setIsFilterModalOpen(false);
                  }}
                >
                  Price: High to Low
                </button>
                <button
                  type="button"
                  className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                    sort === 'rating' ? 'font-semibold text-gray-900' : 'text-gray-700'
                  }`}
                  onClick={() => {
                    setSort('rating');
                    setIsFilterModalOpen(false);
                  }}
                >
                  Rating
                </button>
                <button
                  type="button"
                  className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                    sort === 'none' ? 'font-semibold text-gray-900' : 'text-gray-700'
                  }`}
                  onClick={() => {
                    setSort('none'); // keep API order
                    setIsFilterModalOpen(false);
                  }}
                >
                  Default (No Sort)
                </button>
                <div className="h-px bg-gray-200 my-2" />
              </>
            )}

            <button
              type="button"
              className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
              onClick={clearFilters}
            >
              Clear All
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

ProductFilterControls.propTypes = {
  value: PropTypes.shape({
    search: PropTypes.string,
    isSponsored: PropTypes.bool,
    sort: PropTypes.oneOf(['none', 'priceAsc', 'priceDesc', 'rating', 'recent']),
  }),
  onChange: PropTypes.func,
  filters: PropTypes.object,
  onFilterChange: PropTypes.func,
  onFiltersChange: PropTypes.func,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  showSponsored: PropTypes.bool,
  showSort: PropTypes.bool,
};

export default ProductFilterControls;