import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {getContrastTextColor} from '../../../utils/colorUtils'
// Assuming Button component is correctly imported from '../../../components/ui/Button'
// Assuming getContrastTextColor is correctly imported from '../../../utils/colorUtils'
import { HeartIcon, ShareIcon, EllipsisVerticalIcon, TrashIcon, PencilIcon, ChartBarIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';

// Dummy images for demonstration
import thumb1 from '../../../assets/images/productImages/2.jpeg'; // Adjust path as per your project structure
import thumb2 from '../../../assets/images/productImages/3.jpeg'; // Adjust path as per your project structure
import thumb3 from '../../../assets/images/productImages/4.jpeg'; // Adjust path as per your project structure
import thumb4 from '../../../assets/images/productImages/1.png'; // Adjust path as per your project structure

// Placeholder for Button component if not available
const Button = ({ onClick, className, children, style }) => (
    <button onClick={onClick} className={className} style={style}>
        {children}
    </button>
);



const dummyProductDetails = {
    'prod1': {
        name: 'iPhone 12 Pro Max',
        currentPrice: 2500000,
        originalPrice: 3000000,
        rating: 4.5,
        mainImageUrl: thumb2,
        thumbnailUrls: [thumb1, thumb2, thumb3, thumb4],
        colors: [
            { name: 'Black', hex: '#000000' },
            { name: 'Red', hex: '#FF0000' },
            { name: 'Blue', hex: '#0000FF' },
            { name: 'Yellow', hex: '#FFFF00' },
            { name: 'Cyan', hex: '#00FFFF' },
            { name: 'Orange', hex: '#FFA500' },
            { name: 'Purple', hex: '#800080' },
        ],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        bulkPrices: [
            { quantity: '12 Pieces', amount: '₦500,000', save: '₦20,000', percent: '10%' },
            { quantity: '24 Pieces', amount: '₦500,000', save: '₦20,000', percent: '10%' },
            { quantity: '36 Pieces', amount: '₦500,000', save: '₦20,000', percent: '10%' },
            { quantity: '48 Pieces', amount: '₦500,000', save: '₦20,000', percent: '10%' },
        ],
        quantityLeft: 2500000,
        description: "This is a detailed description of the iPhone 12 Pro Max. It's a fantastic phone with advanced features, a powerful camera system, and a stunning display. Ideal for users who demand high performance and premium design. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        reviews: [
            { id: 1, author: "John Doe", rating: 5, comment: "Amazing phone, totally worth it!" },
            { id: 2, author: "Jane Smith", rating: 4, comment: "Great camera, battery life could be better." },
        ]
    },
};

// Custom Delete Confirmation Modal Component
const DeleteConfirmationModal = ({ show, onClose, onConfirm, productName, brandColor, contrastTextColor }) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Deletion</h3>
                <p className="text-gray-700 mb-6">Are you sure you want to delete <span className="font-bold">{productName}</span>? This action cannot be undone.</p>
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

    // Using a default brandColor if not available from Redux
    const brandColor = useSelector(state => state.ui?.brandColor) || '#EF4444';
    const contrastTextColor = getContrastTextColor(brandColor);

    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // State for delete confirmation modal

    useEffect(() => {
        const fetchedProduct = dummyProductDetails[productId];
        if (fetchedProduct) {
            setProduct(fetchedProduct);
            setSelectedImage(fetchedProduct.mainImageUrl);
            // Initialize selected color and size
            setSelectedColor(fetchedProduct.colors[0]?.hex || '');
            setSelectedSize(fetchedProduct.sizes[0] || '');
        } else {
            navigate('/my-products');
        }
    }, [productId, navigate]);

    if (!product) {
        return <div className="flex justify-center items-center h-screen">Loading product details...</div>;
    }

    const handleQuantityChange = (type) => {
        setQuantity(prev => {
            if (type === 'increase' && prev < product.quantityLeft) {
                return prev + 1;
            }
            if (type === 'decrease' && prev > 1) {
                return prev - 1;
            }
            return prev;
        });
    };

    const handleDeleteProduct = () => {
        setShowDeleteConfirm(true); // Show the confirmation modal
    };

    const confirmDelete = () => {
        console.log(`Deleting product ${productId}`);
        setShowDeleteConfirm(false); // Close the modal
        navigate('/my-products'); // Navigate after deletion
    };

    const handleBoostPost = () => {
        console.log(`Boosting post for ${product.name}`);
        // Here you would typically open a modal or navigate to a boost setup page
    };

    const handleViewStats = () => {
        console.log(`Viewing stats for ${product.name}`);
        // This is where you'd typically open the Product Stat modal as seen in ss.png
        // For now, it just logs, but you would likely use state to control modal visibility here.
    };

    const handleEditProduct = () => {
        console.log(`Editing product ${productId}`);
        // Navigate to an edit page or open an edit modal
    };

    return (
        <div className="container mx-auto p-4 md:p-8 bg-gray-50 min-h-screen font-sans">
            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                show={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={confirmDelete}
                productName={product.name}
                brandColor={brandColor}
                contrastTextColor={contrastTextColor}
            />

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800" style={{ fontFamily: 'Manrope' }}>
                    <Link to="/my-products" className="hover:underline">My product</Link> / <span style={{ color: brandColor }}>Product Details</span>
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

            {/* Product Content Area */}
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 border border-gray-200">
                {/* Image Gallery */}
                <div className="flex flex-col lg:flex-row-reverse gap-4 lg:h-[400px]">
                    {/* Main Image */}
                    <div className="flex-1 relative rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center p-2 border border-gray-200 aspect-w-16 aspect-h-9">
                        <img src={selectedImage} alt={product.name} className="w-full h-full object-contain rounded-lg" />
                        {/* Play button overlay */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black opacity-30 rounded-lg cursor-pointer">
                            <svg className="h-16 w-16 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                    {/* Thumbnails */}
                    <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto pb-2 lg:pb-0 lg:h-full">
                        {product.thumbnailUrls.map((thumb, index) => (
                            <img
                                key={index}
                                src={thumb}
                                alt={`Thumbnail ${index + 1}`}
                                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 ${selectedImage === thumb ? 'border-blue-500' : 'border-gray-300'}`}
                                style={selectedImage === thumb ? { borderColor: brandColor } : {}} // Apply brandColor to selected thumbnail border
                                onClick={() => setSelectedImage(thumb)}
                            />
                        ))}
                    </div>
                </div>

                {/* Product Details and Options */}
                <div className="flex flex-col space-y-4">
                    <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
                    <div className="flex items-baseline space-x-2">
                        <span className="text-3xl font-bold" style={{ color: brandColor }}>₦{product.currentPrice.toLocaleString()}</span>
                        {product.originalPrice && (
                            <span className="text-lg text-gray-500 line-through">₦{product.originalPrice.toLocaleString()}</span>
                        )}
                        <span className="text-yellow-500 text-sm font-semibold ml-auto">{product.rating} ★</span>
                    </div>


                    {/* Information Tags - NEW ADDITION based on images */}
                    <div className="space-y-2">
                        <div className="bg-orange-500 text-white p-2 h-2.5 rounded-md flex items-center">
                            <span className="flex items-center w-7 h-full justify-center pr-1" style={{ backgroundColor: brandColor }}>
                                <ShoppingCartIcon className="h-auto w-3 text-white" />
                            </span>
                            <span className='text-[12px]'>Information tag 1</span>
                        </div>
                        <div className="bg-blue-600 text-white p-2 h-2.5 rounded-md flex items-center">
                            <span className="flex items-center w-7 h-full justify-center pr-1" style={{ backgroundColor: brandColor }}>
                                <ShoppingCartIcon className="h-auto w-3 text-white" />
                            </span>
                            <span className='text-[12px]'>Information tag 2</span>
                        </div>
                        <div className="bg-purple-600 text-white p-2 h-2.5 rounded-md flex items-center">
                            <span className="flex items-center w-7 h-full justify-center pr-1" style={{ backgroundColor: brandColor }}>
                                <ShoppingCartIcon className="h-auto w-3 text-white" />
                            </span>
                            <span className='text-[12px]'>Information tag 3</span>
                        </div>
                    </div>

                    <hr className="my-4 border-t border-gray-300 opacity-60" />

                    {/* Color Options */}
                    <div>
                        <h3 className="text-md font-semibold text-gray-700 mb-2">Color</h3>
                        <div className="flex space-x-2 items-center">
                            {product.colors.map((color, index) => (
                                <button
                                    key={index}
                                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${selectedColor === color.hex ? '' : 'border-gray-300'}`}
                                    style={{
                                        backgroundColor: color.hex,
                                        color: getContrastTextColor(color.hex),
                                        borderColor: selectedColor === color.hex ? brandColor : '', // Apply brandColor to selected color border
                                    }}
                                    onClick={() => setSelectedColor(color.hex)}
                                >
                                    {/* You can add a checkmark icon here if selected */}
                                </button>
                            ))}
                        </div>
                    </div>
                    <hr className="my-4 border-t border-gray-300 opacity-60" />

                    {/* Size Options */}
                    <div>
                        <h3 className="text-md font-semibold text-gray-700 mb-2">Size</h3>
                        <div className="flex space-x-2">
                            {product.sizes.map((size, index) => {
                                const isSelected = selectedSize === size;
                                return (
                                    <button
                                        key={index}
                                        className={`px-4 py-2 rounded-md border ${isSelected ? 'text-white' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                                        style={isSelected ? { backgroundColor: brandColor, borderColor: brandColor } : {}} // Apply brandColor to selected size background and border
                                        onClick={() => setSelectedSize(size)}
                                    >
                                        {size}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Bulk Prices Table */}
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        {/* Header with brandColor background */}
                        <h3 className="p-3 text-md font-semibold" style={{ backgroundColor: brandColor, color: contrastTextColor }}>Bulk Prices</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-left text-sm whitespace-nowrap">
                                <thead  >
                                    <tr>
                                        <th className="px-3 py-2 ">Quantity</th>
                                        <th className="px-3 py-2 ">Amount</th>
                                        <th className="px-3 py-2 ">You Save</th>
                                        <th className="px-3 py-2 ">%</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {product.bulkPrices.map((row, index) => (
                                        <tr
                                            key={index}
                                            className={`border-b border-gray-100 last:border-b-0 hover:bg-red-50 ${index % 2 === 1 ? 'bg-[#f1d1d1]' : ''
                                                }`}
                                        >
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

                    {/* Quantity Selector */}
                    <div className="flex items-center justify-between py-4  mb-4 mt-4">
                        <span className="text-gray-700 text-sm">Quantity left</span>
                        <span className="font-semibold" style={{ color: brandColor }}>₦{product.quantityLeft.toLocaleString()}</span> {/* Quantity left amount uses brandColor */}
                        <div className="flex items-center rounded-md overflow-hidden"> {/* Removed border-gray-300 */}
                            <button
                                onClick={() => handleQuantityChange('decrease')}
                                className="px-3 py-1 text-lg rounded-xl hover:opacity-80 transition-colors" // Red background, white text
                                style={{ backgroundColor: brandColor, color: contrastTextColor }}
                            >
                                -
                            </button>
                            <input
                                type="text"
                                value={quantity}
                                readOnly
                                className="w-12 text-center outline-none focus:outline-none bg-white text-gray-900  py-1" // Added top/bottom border to input
                            />
                            <button
                                onClick={() => handleQuantityChange('increase')}
                                className="px-3 py-1 text-lg rounded-xl hover:opacity-80 transition-colors" // Red background, white text
                                style={{ backgroundColor: brandColor, color: contrastTextColor }}
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-4 gap-4 mt-6">
                        <Button
                            onClick={handleDeleteProduct}
                            className="flex items-center justify-center p-3 rounded-md shadow-sm hover:shadow-md transition-shadow bg-white text-gray-700" // Removed border
                        >
                            <TrashIcon className="h-5 w-5 text-red-500" />
                        </Button>
                        <Button
                            onClick={handleViewStats}
                            className="flex items-center justify-center p-3 rounded-md shadow-sm hover:shadow-md transition-shadow bg-white text-gray-700" // Removed border
                        >
                            <ChartBarIcon className="h-5 w-5 text-gray-700" />
                        </Button>
                        <Button
                            onClick={handleEditProduct}
                            className="col-span-2 flex items-center justify-center p-3 rounded-md shadow-sm hover:shadow-md transition-shadow " // Solid button with brandColor
                            style={{ backgroundColor: brandColor, color: contrastTextColor }}
                        >
                            <PencilIcon className="h-5 w-5 mr-2" style={{ color: contrastTextColor }} /> Edit Product
                        </Button>
                    </div>
                    <Button
                        onClick={handleBoostPost}
                        className="w-full py-3 rounded-md shadow-sm hover:shadow-md transition-shadow text-white  mt-4"
                        style={{ backgroundColor: 'black' }} // Boost Post button remains black as per bost.png
                    >
                        Boost Post
                    </Button>
                </div>
            </div>

            {/* Description and Reviews Tabs */}
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mt-6 border border-gray-200">
                <div className="flex border-b rounded-2xl border-gray-200 mb-4">
                    <button
                        onClick={() => setActiveTab('description')}
                        className={`py-2 px-4 text-lg rounded-xl  ${activeTab === 'description' ? 'border-b-2' : 'text-gray-600 hover:text-gray-800'}`}
                        style={activeTab === 'description' ? {  backgroundColor: brandColor, color: contrastTextColor } : {}}
                    >
                        Description
                    </button>
                    <button
                        onClick={() => setActiveTab('reviews')}
                        className={`py-2 px-4 rounded-xl text-lg  ${activeTab === 'reviews' ? 'border-b-2' : 'text-gray-600 hover:text-gray-800'}`}
                        style={activeTab === 'reviews' ? {  backgroundColor: brandColor, color: contrastTextColor } : {}}
                    >
                        Reviews
                    </button>
                </div>
                <div>
                    {activeTab === 'description' && (
                        <p className="text-gray-700 leading-relaxed">
                            {product.description}
                        </p>
                    )}
                    {activeTab === 'reviews' && (
                        <div className="space-y-4">
                            {product.reviews.length > 0 ? (
                                product.reviews.map(review => (
                                    <div key={review.id} className="border-b pb-3 last:border-b-0 border-gray-100">
                                        <p className="font-semibold text-gray-800">{review.author} <span className="text-yellow-500 ml-2">{review.rating} ★</span></p>
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
