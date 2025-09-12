// src/features/products/pages/BoostProductSetupPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Button from '../../../components/ui/Button';
import { ChevronDownIcon, AdjustmentsHorizontalIcon, StarIcon, TruckIcon, TagIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { getContrastTextColor } from '../../../utils/colorUtils';
import { useProductDetailsQuery } from '../../../services/queries/useproductsQuery';
import BackButton from '../../../components/ui/BackButton';

const BoostProductSetupPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation() || {};
  const brandColor = useSelector((s) => s.ui?.brandColor) || '#EF4444';
  const contrastTextColor = getContrastTextColor(brandColor);

  const { data: product, isLoading, isError } = useProductDetailsQuery(productId, { enabled: !!productId });

  const [dailyBudget, setDailyBudget] = useState(state?.dailyBudget ?? 2000);
  const [duration, setDuration] = useState(state?.duration ?? 7);
  const [location, setLocation] = useState(state?.selectedLocation ?? 'Location');
  const [audienceSliderValue, setAudienceSliderValue] = useState(state?.audienceSliderValue ?? 50);

  useEffect(() => {
    if (!productId) navigate('/my-products');
  }, [productId, navigate]);

  if (isLoading) return <div className="flex justify-center items-center h-screen">Loading boost setup...</div>;
  if (isError || !product) {
    return <div className="flex justify-center items-center h-screen text-red-500">Failed to load product.</div>;
  }

  const displayImage = product.detailsPageInfo?.mainImageUrl || product.imageUrl || '/placeholder.png';
  const productName = product.name || 'Product';
  const currentPrice = product.currentPrice || 0;
  const originalPrice = product.originalPrice || null;
  const discountText = product.discountText || '';

  const handleProceed = () => {
    navigate(`/my-products/${productId}/boost-preview`, {
      state: {
        dailyBudget,
        duration,
        selectedLocation: location,
        audienceSliderValue,
      },
    });
  };

  return (
    <div className="container mx-auto p-4 md:p-8 bg-gray-50 min-h-screen">
      {/* Mobile back button */}
      <div className="md:hidden mb-3">
        <BackButton fallback={`/my-products/${productId}/details`} />
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800" style={{ fontFamily: 'Manrope' }}>
          My product / Product details / <span style={{ color: brandColor }}>Boost Product</span>
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 border border-gray-200">
        {/* Left: Product card */}
        <div className="flex flex-col rounded-lg relative">
          <img src={displayImage} alt={productName} className="w-full max-h-80 object-cover rounded-lg mb-4" />
          {product.isSponsored && (
            <div className="absolute top-4 left-4 bg-yellow-400 text-gray-800 text-xs font-bold px-2 py-1 rounded-full flex items-center shadow-md">
              <span className="w-2 h-2 bg-black rounded-full mr-1"></span> Sponsored
            </div>
          )}
          <div className="bg-white w-full p-4 rounded-lg shadow-md flex flex-col items-start">
            <h2 className="text-xl font-bold text-gray-900 mt-2">{productName}</h2>
            <div className="flex items-baseline space-x-2 mt-2">
              <span className="text-2xl font-bold" style={{ color: brandColor }}>
                ₦{Number(currentPrice).toLocaleString()}
              </span>
              {originalPrice && (
                <span className="text-lg text-gray-500 line-through">₦{Number(originalPrice).toLocaleString()}</span>
              )}
            </div>
            {discountText && (
              <span className="mt-2 bg-yellow-400 text-gray-800 text-sm font-semibold px-3 py-1 rounded-full">
                {discountText}
              </span>
            )}
          </div>
        </div>

        {/* Right: Controls */}
        <div className="flex flex-col space-y-6 p-2">
          {/* Reach slider */}
          <div>
            <input
              type="range"
              min="0"
              max="100"
              value={audienceSliderValue}
              onChange={(e) => setAudienceSliderValue(Number(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, ${brandColor} ${audienceSliderValue}%, #e0e0e0 ${audienceSliderValue}%)`,
              }}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Get your post across several audiences</h3>
            <div className="relative">
              <select
                id="location"
                name="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="block w-full pl-3 pt-4 pb-4 pr-10 py-4 text-base border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm appearance-none shadow-sm"
              >
                <option>Location</option>
                <option>All Locations</option>
                <option>Lagos, Nigeria</option>
                <option>Abuja, Nigeria</option>
                <option>Port Harcourt, Nigeria</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
              </div>
            </div>
          </div>

          {/* Budget */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="daily-budget" className="block text-md font-medium text-gray-700">
                Set your daily spending limit
              </label>
              <AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-500" />
            </div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Daily Budget</h4>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="0"
                max="10000"
                value={dailyBudget}
                onChange={(e) => setDailyBudget(parseInt(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, ${brandColor} ${(dailyBudget / 10000) * 100}%, #e0e0e0 ${(dailyBudget / 10000) * 100}%)`,
                }}
              />
              <span className="text-lg font-bold text-gray-900 whitespace-nowrap">₦{Number(dailyBudget).toLocaleString()}</span>
            </div>
          </div>

          {/* Duration */}
          <div>
            <h4 className="text-md font-medium text-gray-700 mb-1">Duration</h4>
            <input
              type="range"
              min="1"
              max="30"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, ${brandColor} ${(duration / 30) * 100}%, #e0e0e0 ${(duration / 30) * 100}%)`,
              }}
            />
            <div className="text-sm text-gray-600 text-center mt-2">{duration} Days</div>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <Button
          onClick={handleProceed}
          className="w-full max-w-sm py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-shadow"
          style={{ backgroundColor: brandColor, color: contrastTextColor }}
        >
          Proceed
        </Button>
      </div>
    </div>
  );
};

export default BoostProductSetupPage;