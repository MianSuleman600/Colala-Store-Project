// src/components/announcements/BannersTab.jsx
import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import PencilIcon from '../../assets/icons/Pencil.png';
import TrashIcon from '../../assets/icons/delete.png';
import EditBannerModal from './models/EditAnnouncementModal';

const BannersTab = ({
  banners,
  brandColor,
  contrastTextColor,
  onOpenNewBannerModal,
  onSaveEditedBanner,
  onDeleteBanner,
}) => {
  const [showEditBannerModal, setShowEditBannerModal] = useState(false);
  const [bannerToEdit, setBannerToEdit] = useState(null);

  const handleEditBanner = (id) => {
    const banner = banners.find((b) => b.id === id);
    if (banner) {
      setBannerToEdit(banner);
      setShowEditBannerModal(true);
    }
  };

  const handleCloseEditBannerModal = () => {
    setShowEditBannerModal(false);
    setBannerToEdit(null);
  };

  const handleSaveEditedBanner = async (updatedBanner) => {
    await onSaveEditedBanner?.(updatedBanner);
    setShowEditBannerModal(false);
  };

  const handleDeleteBanner = async (id) => {
    if (window.confirm(`Are you sure you want to delete banner ${id}?`)) {
      await onDeleteBanner?.(id);
    }
  };

  return (
    <div>
      <div className="space-y-4 mb-8">
        {(!banners || banners.length === 0) ? (
          <Card className="p-6 text-center text-gray-600">No banners created yet.</Card>
        ) : (
          banners.map((banner) => (
            <Card key={banner.id} className="p-4 rounded-xl shadow-sm flex flex-col">
              <div className="w-full h-32 md:h-48 rounded-lg overflow-hidden mb-4">
                <img
                  src={banner.imageUrl}
                  alt={banner.alt || 'Banner'}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src =
                      'https://placehold.co/600x200/e0e0e0/000000?text=No+Banner+Image';
                  }}
                />
              </div>

              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex justify-between">
                  <span>Date Created</span>
                  <span className="font-medium text-gray-800">{banner.dateCreated || ''}</span>
                </div>
                <div className="flex justify-between">
                  <span>Impressions</span>
                  <span className="font-medium text-gray-800">{banner.impressions || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Placement</span>
                  <span className="font-medium text-gray-800">{banner.placement || 'home'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Active</span>
                  <span className="font-medium text-gray-800">{banner.active ? 'Yes' : 'No'}</span>
                </div>
                {banner.link && (
                  <div className="flex justify-between items-center">
                    <span>Link</span>
                    <a
                      href={banner.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline truncate max-w-[60%]"
                    >
                      {banner.link}
                    </a>
                  </div>
                )}
              </div>

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

      <Button
        onClick={onOpenNewBannerModal}
        style={{ backgroundColor: brandColor, color: contrastTextColor }}
        className="w-full py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-shadow"
      >
        Create New
      </Button>

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