// src/pages/products/ProductDetailsPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getContrastTextColor } from '../../../utils/colorUtils';
import Button from '../../../components/ui/Button';
import { useStoreProfile } from '../../../services/queries/storeProfileQuery';
import { useProductDetailsQuery } from '../../../services/queries/useproductsQuery';
import { useDeleteProduct } from '../../../services/mutations/useProductMutation';
import { useToast } from '../../../components/ui/ToastProvider';
import {
  HeartIcon,
  ShareIcon,
  EllipsisVerticalIcon,
  TrashIcon,
  PencilIcon,
  ChartBarIcon,
  ShoppingCartIcon, // Icon for information tags
} from '@heroicons/react/24/outline';


// Custom Delete Confirmation Modal Component for better reusability
const DeleteConfirmationModal = ({ show, onClose, onConfirm, productName, brandColor, contrastTextColor }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Deletion</h3>
        <p className="text-gray-700 mb-6">
          Are you sure you want to delete <span className="font-bold">{productName}</span>? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-3">
          <Button
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md text-white font-semibold transition-colors"
            style={{ backgroundColor: brandColor, color: contrastTextColor }}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

const ProductDetailsPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { userId } = useSelector((s) => s.user);
  const pushToast = useToast();

  const { data: storeProfileData, isLoading: profileLoading } = useStoreProfile(userId, { enabled: !!userId });
  const brandColor = storeProfileData?.brandColor || '#EF4444';
  const contrastTextColor = getContrastTextColor(brandColor);

  const { data: product, isLoading, isError, error } = useProductDetailsQuery(productId, { enabled: !!productId });
  const deleteProductMutation = useDeleteProduct();

  const [selectedImage, setSelectedImage] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedImage(product.detailsPageInfo?.mainImageUrl || product.detailsPageInfo?.thumbnailUrls?.[0] || '');
      setSelectedColor(product.detailsPageInfo?.colors?.[0]?.hex || '');
      setSelectedSize(product.detailsPageInfo?.sizes?.[0] || '');
    }
  }, [product]);

  const handleQuantityChange = (type) => {
    setQuantity(prev => {
      const max = product?.detailsPageInfo?.quantityLeft || 99;
      if (type === 'increase' && prev < max) return prev + 1;
      if (type === 'decrease' && prev > 1) return prev - 1;
      return prev;
    });
  };

  const handleDelete = () => {
    deleteProductMutation.mutate(productId, {
      onSuccess: () => {
        pushToast('Product deleted successfully!', { type: 'success' });
        navigate('/my-products');
      },
      onError: (err) => {
        pushToast(`Failed to delete product: ${err.message}`, { type: 'error' });
        setShowDeleteConfirm(false);
      },
    });
  };

  if (isLoading || profileLoading) {
    return <div className="flex justify-center items-center h-screen">Loading product details...</div>;
  }
  if (isError || !product) {
    return <div className="flex justify-center items-center h-screen text-red-500">
      Failed to load product: {error?.message || 'Unknown error'}
    </div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-8 bg-gray-50 min-h-screen font-sans">
      <DeleteConfirmationModal
        show={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        productName={product.name}
        brandColor={brandColor}
        contrastTextColor={contrastTextColor}
      />
      
      {/* --- Header --- */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800" style={{ fontFamily: 'Manrope' }}>
          <Link to="/my-products" className="hover:underline text-black/50">My product</Link> /
          <span className='text-black'> Product Details</span>
        </h1>
        <div className="flex space-x-3">
          <button className="p-2 rounded-full hover:bg-gray-200 transition-colors">
            <EllipsisVerticalIcon className="h-6 w-6 text-gray-600" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-200 transition-colors">
            <HeartIcon className="h-6 w-6 text-gray-600" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-200 transition-colors">
            <ShareIcon className="h-6 w-6 text-gray-600" />
          </button>
        </div>
      </div>
      
      {/* --- Product Content Area --- */}
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 border border-gray-200">
        {/* Left: Image Gallery */}
        <div className="flex flex-col lg:flex-row-reverse gap-4 lg:h-[400px]">
          {/* Main Image */}
          <div className="flex-1 relative rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center p-2 border border-gray-200 aspect-w-16 aspect-h-9">
            <img src={selectedImage || '/placeholder.png'} alt={product.name} className="w-full h-full object-contain rounded-lg" />
            {/* Play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black opacity-30 rounded-lg cursor-pointer">
              <svg className="h-16 w-16 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          {/* Thumbnails */}
          {product.detailsPageInfo?.thumbnailUrls?.length > 0 && (
            <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto pb-2 lg:pb-0 lg:h-full">
              {product.detailsPageInfo.thumbnailUrls.map((thumb, index) => (
                <img
                  key={index}
                  src={thumb}
                  alt={`Thumbnail ${index + 1}`}
                  className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 ${
                    selectedImage === thumb ? 'border-blue-500' : 'border-gray-300'
                  }`}
                  style={selectedImage === thumb ? { borderColor: brandColor } : {}}
                  onClick={() => setSelectedImage(thumb)}
                />
              ))}
            </div>
          )}
        </div>
        {/* Right: Product Details and Options */}
        <div className="flex flex-col space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
          <p className="text-gray-600">{product.detailsPageInfo?.description}</p>

          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold" style={{ color: brandColor }}>
              ₦{product.currentPrice?.toLocaleString() ?? 'N/A'}
            </span>
            {product.originalPrice && (
              <span className="text-lg text-gray-500 line-through">₦{product.originalPrice.toLocaleString()}</span>
            )}
            <span className="text-yellow-500 text-sm font-semibold ml-auto">★ {product.rating} </span>
          </div>

          {/* Information Tags */}
          <div className="flex flex-col space-y-2">
            <div className="bg-orange-500 text-white p-2 h-2.5 rounded-md flex items-center">
              <span className="flex items-center w-7 h-full justify-center pr-1" style={{ backgroundColor: brandColor }}>
                <ShoppingCartIcon className="h-auto w-3 text-white" />
              </span>
              <span className="text-[12px]">Information tag 1</span>
            </div>
            <div className="bg-blue-600 text-white p-2 h-2.5 rounded-md flex items-center">
              <span className="flex items-center w-7 h-full justify-center pr-1" style={{ backgroundColor: brandColor }}>
                <ShoppingCartIcon className="h-auto w-3 text-white" />
              </span>
              <span className="text-[12px]">Information tag 2</span>
            </div>
            <div className="bg-purple-600 text-white p-2 h-2.5 rounded-md flex items-center">
              <span className="flex items-center w-7 h-full justify-center pr-1" style={{ backgroundColor: brandColor }}>
                <ShoppingCartIcon className="h-auto w-3 text-white" />
              </span>
              <span className="text-[12px]">Information tag 3</span>
            </div>
          </div>
          <hr className="my-4 border-t border-gray-300 opacity-60" />

          {/* Color Options */}
          {product.detailsPageInfo?.colors?.length > 0 && (
            <div>
              <h3 className="text-md font-semibold text-gray-700 mb-2">Color</h3>
              <div className="flex space-x-2 items-center">
                {product.detailsPageInfo.colors.map((color, index) => (
                  <button
                    key={index}
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                      selectedColor === color.hex ? '' : 'border-gray-300'
                    }`}
                    style={{
                      backgroundColor: color.hex,
                      color: getContrastTextColor(color.hex),
                      borderColor: selectedColor === color.hex ? brandColor : '',
                    }}
                    onClick={() => setSelectedColor(color.hex)}
                  ></button>
                ))}
              </div>
            </div>
          )}
          <hr className="my-4 border-t border-gray-300 opacity-60" />
          {/* Size Options */}
          {product.detailsPageInfo?.sizes?.length > 0 && (
            <div>
              <h3 className="text-md font-semibold text-gray-700 mb-2">Size</h3>
              <div className="flex space-x-2">
                {product.detailsPageInfo.sizes.map((size, index) => {
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={index}
                      className={`px-4 py-2 rounded-xl border ${
                        isSelected ? 'text-white' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                      style={isSelected ? { backgroundColor: brandColor, borderColor: brandColor } : {}}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bulk Prices Table */}
          {product.detailsPageInfo?.bulkPrices?.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <h3 className="p-3 text-md font-semibold" style={{ backgroundColor: brandColor, color: contrastTextColor }}>
                Bulk Prices
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm whitespace-nowrap">
                  <thead>
                    <tr>
                      <th className="px-3 py-2">Quantity</th>
                      <th className="px-3 py-2">Amount</th>
                      <th className="px-3 py-2">You Save</th>
                      <th className="px-3 py-2">%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.detailsPageInfo.bulkPrices.map((row, index) => (
                      <tr key={index} className={`border-b border-gray-100 last:border-b-0 hover:bg-gray-50`}>
                        <td className="px-3 py-2 text-gray-800">{row.quantity}</td>
                        <td className="px-3 py-2 text-gray-800">{row.amount}</td>
                        <td className="px-3 py-2 text-gray-800">{row.save}</td>
                        <td className="px-3 py-2 text-red-500 font-semibold">{row.percent}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="flex items-center justify-between py-4 mb-4 mt-4">
            <span className="text-gray-700 text-sm">Quantity left</span>
            <span className="font-semibold" style={{ color: brandColor }}>
              {product.detailsPageInfo?.quantityLeft ?? 0}
            </span>
            <div className="flex items-center rounded-md overflow-hidden">
              <button
                onClick={() => handleQuantityChange('decrease')}
                className="px-3 py-1 text-lg rounded-xl hover:opacity-80 transition-colors"
                style={{ backgroundColor: brandColor, color: contrastTextColor }}
              >
                -
              </button>
              <input
                type="text"
                value={quantity}
                readOnly
                className="w-12 text-center outline-none focus:outline-none bg-white text-gray-900 py-1"
              />
              <button
                onClick={() => handleQuantityChange('increase')}
                className="px-3 py-1 text-lg rounded-xl hover:opacity-80 transition-colors"
                style={{ backgroundColor: brandColor, color: contrastTextColor }}
              >
                +
              </button>
            </div>
          </div>
          {/* Action Buttons */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <Button onClick={() => setShowDeleteConfirm(true)} className="flex items-center justify-center p-3 rounded-md shadow-sm hover:shadow-md transition-shadow bg-white text-gray-700">
              <TrashIcon className="h-5 w-5 text-red-500" />
            </Button>
            <Button className="flex items-center justify-center p-3 rounded-md shadow-sm hover:shadow-md transition-shadow bg-white text-gray-700">
              <ChartBarIcon className="h-5 w-5 text-gray-700" />
            </Button>
            <Button
              className="col-span-2 flex items-center justify-center p-3 rounded-md shadow-sm hover:shadow-md transition-shadow"
              style={{ backgroundColor: brandColor, color: contrastTextColor }}
            >
              <PencilIcon className="h-5 w-5 mr-2" style={{ color: contrastTextColor }} /> Edit Product
            </Button>
          </div>
          <Button className="w-full py-3 rounded-md shadow-sm hover:shadow-md transition-shadow text-white mt-4" style={{ backgroundColor: 'black' }}>
            Boost Post
          </Button>
        </div>
      </div>
      ---
      {/* --- Description, Specs & Reviews --- */}
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mt-6 border border-gray-200">
        <div className="flex border-b rounded-2xl border-gray-200 mb-4">
          <button
            onClick={() => setActiveTab('description')}
            className={`py-2 px-4 text-lg rounded-xl ${activeTab === 'description' ? 'border-b-2' : 'text-gray-600 hover:text-gray-800'}`}
            style={activeTab === 'description' ? { backgroundColor: brandColor, color: contrastTextColor } : {}}
          >
            Description
          </button>
          
          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-2 px-4 rounded-xl text-lg ${activeTab === 'reviews' ? 'border-b-2' : 'text-gray-600 hover:text-gray-800'}`}
            style={activeTab === 'reviews' ? { backgroundColor: brandColor, color: contrastTextColor } : {}}
          >
            Reviews
          </button>
        </div>
        <div>
          {activeTab === 'description' && (
            <p className="text-gray-700 leading-relaxed">{product.detailsPageInfo?.description || 'No description available.'}</p>
          )}
          {activeTab === 'specifications' && (
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              {product.detailsPageInfo?.specifications?.map((spec, i) => (
                <li key={i}>{spec}</li>
              )) || <p className="text-gray-600">No specifications provided.</p>}
            </ul>
          )}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              {product.detailsPageInfo?.reviews?.length > 0 ? (
                product.detailsPageInfo.reviews.map((review) => (
                  <div key={review.id} className="border-b pb-3 last:border-b-0 border-gray-100">
                    <p className="font-semibold text-gray-800">
                      {review.author} <span className="text-yellow-500 ml-2">{review.rating} ★</span>
                    </p>
                    <p className="text-gray-600 text-sm italic">{review.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">No reviews yet for this product.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;