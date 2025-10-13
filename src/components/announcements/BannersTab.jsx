import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import EditBannerModal from './models/EditBannerModal';

const BannersTab = ({
  banners,
  isLoading,
  brandColor,
  contrastTextColor,
  onOpenNewBannerModal,
  onSaveEditedBanner,
  onDeleteBanner,
}) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [bannerToEdit, setBannerToEdit] = useState(null);

  const handleEdit = (banner) => {
    setBannerToEdit(banner);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setBannerToEdit(null);
  };

  // This function is now just for passing the data to the parent (ManageAnnouncementsPage)
  const handleSave = (id, payload) => {
    onSaveEditedBanner?.({ id, payload });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      onDeleteBanner?.(id);
    }
  };

  return (
    <div>
      <div className="space-y-4 mb-8">
        {isLoading ? (
            <Card className="p-6 text-center text-gray-600">Loading banners...</Card>
        ) : (!banners || banners.length === 0) ? (
          <Card className="p-6 text-center text-gray-600">No banners created yet.</Card>
        ) : (
          banners.map((banner) => (
            <Card key={banner.id} className="p-4 rounded-xl shadow-sm flex flex-col">
              <div className="w-full h-32 md:h-48 rounded-lg overflow-hidden mb-4 bg-gray-100">
                <img src={banner.imageUrl} alt={banner.alt || 'Banner'} className="w-full h-full object-cover" />
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-600 mb-4">
                <span>Date Created:</span>
                <span className="font-medium text-gray-800">{new Date(banner.createdAt).toLocaleDateString()}</span>
                <span>Placement:</span>
                <span className="font-medium text-gray-800 capitalize">{banner.placement || 'home'}</span>
                <span>Active:</span>
                <span className="font-medium text-gray-800">{banner.active ? 'Yes' : 'No'}</span>
                <span>Link:</span>
                {banner.link ? <a href={banner.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline truncate">{banner.link}</a> : <span className="text-gray-500">None</span>}
              </div>
              <div className="flex space-x-2 mt-auto">
                <Button onClick={() => handleEdit(banner)} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                  <PencilIcon className="h-5 w-5 text-gray-600" />
                </Button>
                <Button onClick={() => handleDelete(banner.id)} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                  <TrashIcon className="h-5 w-5 text-red-500" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      <Button
        onClick={onOpenNewBannerModal}
        style={{ backgroundColor: brandColor, color: contrastTextColor }}
        className="w-full py-3 rounded-lg font-semibold"
      >
        Create New Banner
      </Button>

      {/* This wrapper provides the correct overlay structure for the Edit modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="relative bg-white rounded-xl shadow-xl max-h-[90vh] overflow-y-auto w-full max-w-md">
            <EditBannerModal
              bannerToEdit={bannerToEdit}
              onClose={handleCloseEditModal}
              onSave={handleSave}
              brandColor={brandColor}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BannersTab;