import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import StoreSocialLinks from './StoreSocialLinks';
import { useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';

// Icons
import {
    MapPinIcon,
    PhoneIcon,
    EnvelopeIcon,
    TagIcon,
} from '@heroicons/react/24/outline';
import VerifiedIcon from '../../assets/icons/varified.png';
import MegaphoneIcon from '../../assets/icons/Megaphone.png';
import ShoppingBagIcon from '../../assets/icons/shop.png';
import UsersIcon from '../../assets/icons/profile.png';
import StarIcon from '../../assets/icons/star.png';


const StoreOwnerInfoSection = ({
    storeData = {},
    isLoggedIn = false,
    isStoreOwner = false, // New prop to determine if the user is the owner
    onOpenAuthModal = () => { },
    brandColor = '#EF4444',
    contrastTextColor = '#FFFFFF',
    lightBrandColor = '#FCA5A5',
    isFollowing, // New prop
    handleFollowToggle, // New prop
}) => {
    const navigate = useNavigate();

    const handleAddProduct = () => navigate('/add-product');
    const handleAddService = () => navigate('/add-service');

    const storeName = storeData?.storeName || storeData?.name || 'Guest Store';
    const email = storeData?.email || '';
    const phoneNumber = storeData?.phoneNumber || '';
    const location = storeData?.location || '';
    const categories = storeData?.categories || [];
    const productsSold = storeData?.productsSold || 0;
    const followers = storeData?.followers || 0;
    const ratings = storeData?.ratings || 0;
    const salesMessage = storeData?.salesMessage || 'No promotional message.';

    // Logic for follow button
    const handleFollowClick = () => {
        if (!isLoggedIn) {
            onOpenAuthModal('login');
        } else {
            handleFollowToggle?.();
        }
    };

    return (
        <Card className={`p-6 ${!isLoggedIn ? 'opacity-100' : ''}`}>
            <div className="rounded-lg space-y-4">
                {isStoreOwner ? (
                    // OWNER VIEW
                    <>
                        <div className="flex flex-col mb-4">
                            <h3 className="text-xl font-bold text-gray-800 flex items-center mb-2">
                                {storeName}
                                <img src={VerifiedIcon} alt="Verified" className="h-5 w-5 ml-2" />
                            </h3>
                            <p className="flex items-center text-sm text-gray-600">
                                <EnvelopeIcon className="h-4 w-4 mr-2 text-gray-500" /> {email}
                            </p>
                            {phoneNumber && (
                                <p className="flex items-center text-sm text-gray-600">
                                    <PhoneIcon className="h-4 w-4 mr-2 text-gray-500" /> {phoneNumber}
                                </p>
                            )}
                            {location && (
                                <p className="flex items-center text-sm text-gray-600">
                                    <MapPinIcon className="h-4 w-4 mr-2 text-gray-500" /> {location}
                                </p>
                            )}
                        </div>

                        {/* Stats Section */}
                        <div className="grid grid-cols-3 text-center bg-white rounded-2xl pt-4 shadow-lg overflow-hidden">
                            <div className="flex flex-col items-center border-r border-gray-300">
                                <img src={ShoppingBagIcon} className="h-6 w-6 mb-1" alt="Products Sold" />
                                <span className="font-semibold text-gray-800">{productsSold}</span>
                                <span className="text-xs text-gray-500">Qty Sold</span>
                            </div>
                            <div className="flex flex-col items-center border-r border-gray-300">
                                <img src={UsersIcon} className="h-6 w-6 mb-1" alt="Followers" />
                                <span className="font-semibold text-gray-800">{followers}</span>
                                <span className="text-xs text-gray-500">Followers</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <img src={StarIcon} className="h-6 w-6 mb-1" alt="Ratings" />
                                <span className="font-semibold text-gray-800">{ratings}</span>
                                <span className="text-xs text-gray-500">Ratings</span>
                            </div>
                            <div
                                className="col-span-3 flex items-center justify-center gap-2 w-full p-2 rounded-b-2xl text-sm sm:text-base flex-wrap sm:flex-nowrap text-center"
                                style={{ backgroundColor: brandColor, color: contrastTextColor }}
                            >
                                <img src={MegaphoneIcon} alt="Megaphone" className="h-4 w-4 flex-shrink-0" />
                                <span className="break-words">{salesMessage}</span>
                            </div>
                        </div>

                        {/* Social Links */}
                        <StoreSocialLinks isLoggedIn={isLoggedIn} storeData={storeData} />

                        {/* Actions */}
                        <div className="flex space-x-4 mt-4">
                            <Button
                                onClick={handleAddProduct}
                                className="flex-1 py-2 px-4 rounded-2xl"
                                style={{ backgroundColor: brandColor, color: contrastTextColor }}
                            >
                                Add Product
                            </Button>
                            <Button
                                onClick={handleAddService}
                                className="flex-1 py-2 px-4 rounded-2xl bg-black text-white hover:bg-gray-700"
                            >
                                Add Service
                            </Button>
                        </div>
                    </>
                ) : (
                    // PUBLIC VISITOR VIEW
                    <>
                        {/* Store Status and Follow Button */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                            <div className="flex flex-col sm:flex-row sm:items-center mb-2 sm:mb-0">
                                <p className="flex items-center text-[10px] text-green-600 mt-1 sm:mt-0">
                                    <span
                                        className={`w-2.5 h-2.5 rounded-full mr-2 ${storeData.isOpen ? 'bg-green-500' : 'bg-red-500'}`}
                                    />
                                    {storeData.isOpen
                                        ? `Open Now - ${storeData.openTime} - ${storeData.closeTime}`
                                        : 'Closed'}
                                </p>
                            </div>
                            <Button
                                onClick={handleFollowClick}
                                className={`py-1 px-3 rounded-xl flex text-[10px] items-center justify-center transition-colors text-white ${isFollowing ? 'bg-gray-500 hover:bg-gray-600' : 'hover:opacity-90'
                                    }`}
                                style={!isFollowing ? { backgroundColor: brandColor } : {}}
                                aria-pressed={isFollowing ? 'true' : 'false'}
                                title={isFollowing ? 'Unfollow store' : 'Follow store'}
                                data-auth-required={!isLoggedIn}
                            >
                                <UserPlus size={16} className="mr-2 text-white" />
                                {isFollowing ? 'Following' : 'Follow'}
                            </Button>
                        </div>

                        {/* Contact Details */}
                        <div className="space-y-2 mb-4">
                            <h3 className="text-xl font-bold text-gray-800 flex items-center">
                                {storeName}
                                <img src={VerifiedIcon} alt="Verified" className="w-5 h-5 ml-2" />
                            </h3>
                            <p className="flex items-center text-sm text-gray-600">
                                <EnvelopeIcon className="h-4 w-4 mr-2 text-gray-500" /> {email}
                            </p>
                            {storeData.showPhoneOnProfile && (
                                <p className="flex items-center text-sm text-gray-600">
                                    <PhoneIcon className="h-4 w-4 mr-2 text-gray-500" /> {phoneNumber}
                                </p>
                            )}
                            <p className="flex items-center text-sm text-gray-600">
                                <MapPinIcon className="h-4 w-4 mr-2 text-gray-500" /> {location}
                                <Button
                                    className="ml-2 text-sm font-medium hover:underline"
                                    style={{ color: brandColor }}
                                    onClick={() => console.log('View Store Addresses clicked (Public View)')}
                                >
                                    View Store Addresses
                                </Button>
                            </p>
                            <p className="flex items-center text-sm text-gray-600 flex-wrap">
                                <TagIcon className="h-4 w-4 mr-2 text-gray-500" />
                                Category:
                                {Array.isArray(categories) && categories.length > 0 ? (
                                    <div className="flex flex-wrap gap-2 ml-1">
                                        {categories.map((cat, index) => (
                                            <span
                                                key={index}
                                                className={`px-3 py-1 rounded-full text-xs flex items-center border ${cat === 'Electronics'
                                                    ? 'bg-blue-100 text-blue-700 border-blue-300'
                                                    : cat === 'Phones'
                                                        ? 'bg-red-100 text-red-700 border-red-300'
                                                        : 'bg-gray-100 text-gray-700 border-gray-300'
                                                    }`}
                                            >
                                                {cat}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <span className="ml-1">N/A</span>
                                )}
                            </p>
                        </div>
                        
                        {/* Stats Section */}
                        <div className="flex flex-col relative items-center border-t border-b border-gray-200 py-4 mb-4 text-center ">
                            <div className="flex justify-around w-full divide-x divide-gray-300 mb-4">
                                <div className="flex flex-col items-center px-4">
                                    <img src={ShoppingBagIcon} className="h-6 w-6 mb-1" alt="Products Sold" />
                                    <span className="font-semibold text-gray-800">{productsSold}</span>
                                    <span className="text-xs text-gray-500">Qty Sold</span>
                                </div>
                                <div className="flex flex-col items-center px-4">
                                    <img src={UsersIcon} className="h-6 w-6 mb-1" alt="Followers" />
                                    <span className="font-semibold text-gray-800">{followers}</span>
                                    <span className="text-xs text-gray-500">Followers</span>
                                </div>
                                <div className="flex flex-col items-center px-4">
                                    <img src={StarIcon} className="h-6 w-6 mb-1" alt="Ratings" />
                                    <span className="font-semibold text-gray-800">{ratings}</span>
                                    <span className="text-xs text-gray-500">Ratings</span>
                                </div>
                            </div>
                            {salesMessage && (
                                <div
                                    className="flex items-center justify-center gap-2 w-full p-2 rounded-b-2xl text-sm sm:text-base flex-wrap sm:flex-nowrap text-center"
                                    style={{ backgroundColor: brandColor, color: contrastTextColor }}
                                >
                                    <img src={MegaphoneIcon} alt="Megaphone" className="h-4 w-4 flex-shrink-0" />
                                    <span className="break-words">{salesMessage}</span>
                                </div>
                            )}
                        </div>
                        
                        <StoreSocialLinks
                            storeData={storeData}
                            brandColor={brandColor}
                            contrastTextColor={contrastTextColor}
                        />
                        
                        <div className="flex space-x-4 mt-4">
                            <Button
                                onClick={() => onOpenAuthModal('register')}
                                className="flex-1 py-2 px-4 rounded-2xl text-white"
                                style={{ backgroundColor: brandColor }}
                            >
                                Add Product
                            </Button>
                            <Button
                                onClick={() => onOpenAuthModal('register')}
                                className="flex-1 py-2 px-4 rounded-2xl bg-black text-white hover:bg-gray-700"
                            >
                                Add Service
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </Card>
    );
};

export default StoreOwnerInfoSection;