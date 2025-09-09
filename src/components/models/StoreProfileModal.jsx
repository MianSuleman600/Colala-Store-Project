import React, { useState, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import PromotionalBanner from '../ui/PromotionBanner';
import { getContrastTextColor } from '../../utils/colorUtils';
import { openModal } from '../../redux/modalSlice';
import StoreHeader from '../store/StoreHeader';
import StoreOwnerInfoSection from '../store/StoreOwnerInfoSection';
import StoreTabs from '../store/StoreTabs';
import ProductFilterControls from '../ui/ProductFilterControls';
import { useStoreProfile } from '../../services/queries/storeProfileQuery';

function StoreProfileModal({ isOpen, onClose, storeId }) {
    const dispatch = useDispatch();
    const { isLoggedIn, userId } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Products');
    const [isFollowing, setIsFollowing] = useState(false);
    const currentStoreId = useMemo(() => storeId || userId, [storeId, userId]);

    const {
        data: storeProfile,
        isLoading: profileLoading,
        error: profileError,
    } = useStoreProfile(currentStoreId, {
        enabled: isOpen && !!currentStoreId,
        staleTime: 5 * 60 * 1000,
    });

    const isStoreOwner = useMemo(
        () => isLoggedIn && (storeProfile?.ownerId === userId),
        [isLoggedIn, storeProfile, userId]
    );

    const brandColor = useMemo(
        () => storeProfile?.brandColor || '#EF4444',
        [storeProfile]
    );

    const contrastTextColor = useMemo(
        () => getContrastTextColor(brandColor),
        [brandColor]
    );

    useEffect(() => {
        if (!isOpen) {
        }
    }, [isOpen]);

    const handleFollowToggle = () => {
        if (!isLoggedIn) {
            dispatch(openModal('login'));
            return;
        }
        setIsFollowing((prev) => !prev);
    };

    if (profileLoading) {
        return (
            <Modal isOpen={isOpen} onClose={onClose} title="Loading Store..." className="w-11/12 max-w-6xl">
                <div className="p-6 space-y-6">
                    <Skeleton height={200} />
                    <Skeleton height={100} />
                    <Skeleton count={3} height={50} />
                </div>
            </Modal>
        );
    }

    if (profileError || !storeProfile) {
        const errorMessage = profileError?.message || 'Failed to load store profile. Please try again.';
        return (
            <Modal isOpen={isOpen} onClose={onClose} title="Store Not Found" className="w-11/12 max-w-2xl">
                <div className="p-6 text-center text-red-500">
                    <p>{errorMessage}</p>
                    <Button onClick={onClose} className="mt-4 px-4 py-2 bg-red-500 text-white rounded">
                        Close
                    </Button>
                </div>
            </Modal>
        );
    }

    const modalContent = (
        <div className="grid grid-cols-1 mt-3 lg:grid-cols-3 px-6 gap-6">
            <div className="lg:col-span-1 space-y-6">
                <StoreHeader
                    bannerImageUrl={storeProfile.bannerImageUrl}
                    profilePictureUrl={storeProfile.profilePictureUrl}
                    isModalOpen={isOpen}
                    handleGoBack={onClose}
                    handleShare={() =>
                        navigator.share?.({
                            title: storeProfile.storeName,
                            url: window.location.href,
                        })
                    }
                />
                <StoreOwnerInfoSection
                    storeData={storeProfile}
                    isLoggedIn={isLoggedIn}
                    isStoreOwner={isStoreOwner} // Pass isStoreOwner here
                    onOpenAuthModal={(mode) => dispatch(openModal(mode || 'login'))}
                    brandColor={brandColor}
                    contrastTextColor={contrastTextColor}
                    isFollowing={isFollowing}
                    handleFollowToggle={handleFollowToggle}
                />
                <PromotionalBanner
                    storeName={storeProfile.storeName}
                    onButtonClick={() => console.log('Shop Now clicked')}
                    imageUrl={storeProfile.promotionalBannerImageUrl}
                />
            </div>

            <div className="lg:col-span-2 space-y-6">
                <StoreTabs
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    brandColor={brandColor}
                    contrastTextColor={contrastTextColor}
                />
                {activeTab === 'Products' && (
                    <ProductFilterControls storeId={currentStoreId} />
                )}
                {activeTab === 'SocialFeed' && (
                    <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-600 min-h-[300px] flex items-center justify-center">
                        Social Feed content will go here.
                    </div>
                )}
                {activeTab === 'Reviews' && (
                    <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-600 min-h-[300px] flex items-center justify-center">
                        Customer Reviews will be displayed here.
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            className="w-11/12 overflow-y-auto scrollbar-custom max-w-6xl"
            title={<h2 className="text-center">{storeProfile.storeName}</h2>}
            titleClassName="text-center"
            headerClassName="bg-gray-50"
            footer={
                isStoreOwner && (
                    <Button
                        onClick={() => {
                            onClose();
                            navigate('/store-management');
                        }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                    >
                        <PlusCircle className="inline-block w-4 h-4 mr-2" />
                        Manage Store
                    </Button>
                )
            }
        >
            {modalContent}
        </Modal>
    );
}

export default StoreProfileModal;