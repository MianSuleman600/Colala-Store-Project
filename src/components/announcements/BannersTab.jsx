// src/components/announcements/BannersTab.jsx
import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import PencilIcon from '../../assets/icons/Pencil.png'; // Assuming this path is correct
import TrashIcon from '../../assets/icons/delete.png'; // Assuming this path is correct
import EditBannerModal from '../announcements/models/EditAnnouncementModal'; // Import the new EditBannerModal

/**
 * BannersTab Component
 * Displays a list of banner images with their details, link, and actions.
 * Includes a button to create a new banner.
 * Matches the design in 'image_f2490c.png'.
 *
 * @param {object} props
 * @param {Array<object>} props.banners - An array of banner objects.
 * @param {function} props.setBanners - Function to update the parent's banners state.
 * @param {string} props.brandColor - The primary brand color for styling.
 * @param {string} props.contrastTextColor - The text color that contrasts well with brandColor.
 * @param {function} props.onOpenNewBannerModal - Callback to open the create new banner modal.
 */
const BannersTab = ({ banners, setBanners, brandColor, contrastTextColor, onOpenNewBannerModal }) => {
    // State for managing the Edit Banner Modal
    const [showEditBannerModal, setShowEditBannerModal] = useState(false);
    const [bannerToEdit, setBannerToEdit] = useState(null);

    const handleEditBanner = (bannerId) => {
        console.log(`Editing banner: ${bannerId}`);
        const banner = banners.find(ban => ban.id === bannerId);
        if (banner) {
            setBannerToEdit(banner);
            setShowEditBannerModal(true);
        }
    };

    const handleCloseEditBannerModal = () => {
        setShowEditBannerModal(false);
        setBannerToEdit(null); // Clear the banner to edit
    };

    const handleSaveEditedBanner = (updatedBanner) => {
        console.log('Saving edited banner:', updatedBanner);
        setBanners(prevBanners =>
            prevBanners.map(ban =>
                ban.id === updatedBanner.id ? updatedBanner : ban
            )
        );
        setShowEditBannerModal(false);
    };

    const handleDeleteBanner = (bannerId) => {
        console.log(`Deleting banner: ${bannerId}`);
        if (window.confirm(`Are you sure you want to delete banner ${bannerId}?`)) {
            setBanners(prev => prev.filter(ban => ban.id !== bannerId));
            alert(`Banner ${bannerId} deleted!`); // Replace with custom modal
        }
    };

    return (
        <div>
            {/* Banners List */}
            <div className="space-y-4 mb-8">
                {banners.length === 0 ? (
                    <Card className="p-6 text-center text-gray-600">No banners created yet.</Card>
                ) : (
                    banners.map(banner => (
                        <Card key={banner.id} className="p-4 rounded-xl shadow-sm flex flex-col">
                            {/* Banner Image */}
                            <div className="w-full h-32 md:h-48 rounded-lg overflow-hidden mb-4">
                                <img
                                    src={banner.imageUrl}
                                    alt="Banner"
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x200/e0e0e0/000000?text=No+Banner+Image"; }}
                                />
                            </div>

                            {/* Banner Details */}
                            <div className="space-y-2 text-sm text-gray-600 mb-4">
                                <div className="flex justify-between">
                                    <span>Date Created</span>
                                    <span className="font-medium text-gray-800">{banner.dateCreated}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Impressions</span>
                                    <span className="font-medium text-gray-800">{banner.impressions}</span>
                                </div>
                                {banner.link && (
                                    <div className="flex justify-between items-center">
                                        <span>Link</span>
                                        <a href={banner.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline truncate max-w-[60%]">
                                            {banner.link.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0]}...
                                        </a>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex space-x-2 mt-auto">
                                <Button
                                    onClick={() => handleEditBanner(banner.id)}
                                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
                                    aria-label="Edit Banner"
                                >
                                    <img src={PencilIcon} alt="Edit" className="h-5 w-5" />
                                </Button>
                                <Button
                                    onClick={() => handleDeleteBanner(banner.id)}
                                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-red-600"
                                    aria-label="Delete Banner"
                                >
                                    <img src={TrashIcon} alt="Delete" className="h-5 w-5" />
                                </Button>
                            </div>
                        </Card>
                    ))
                )}
            </div>

            {/* Create New Button */}
            <Button
                onClick={onOpenNewBannerModal}
                style={{ backgroundColor: brandColor, color: contrastTextColor }}
                className="w-full py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-shadow"
            >
                Create New
            </Button>

            {/* Edit Banner Modal */}
            {showEditBannerModal && bannerToEdit && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="relative bg-white rounded-xl shadow-xl max-h-[90vh] overflow-y-auto w-full max-w-md">
                        <EditBannerModal
                            bannerToEdit={bannerToEdit}
                            onClose={handleCloseEditBannerModal}
                            onSave={handleSaveEditedBanner}
                            brandColor={brandColor}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default BannersTab;
