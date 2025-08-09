// src/pages/ManageAnnouncementsPage.jsx
import React, { useState } from 'react';
import PushAnnouncementsTab from '../announcements/PushAnnouncementsTab';
import BannersTab from '../announcements/BannersTab';
import CreateNewAnnouncementModal from '../announcements/models/CreateNewAnnouncementModal';
import CreateNewBannerModal from '../announcements/models/CreateNewBannerModal';
import EditAnnouncementModal from '../announcements/models/EditAnnouncementModal'; // Import the new EditAnnouncementModal
import ScrollToTop from '../ui/ScrollToTop';
/**
 * ManageAnnouncementsPage Component
 * This component acts as the main container for managing announcements and banners.
 * It features two tabs: "Push Announcements" and "Banners", and controls
 * the display of modals for creating new announcements and banners.
 * It matches the design in 'image_f2490a.png' and 'image_f2490c.png'.
 *
 * @param {object} props
 * @param {string} props.brandColor - The primary brand color for styling.
 * @param {string} props.contrastTextColor - The text color that contrasts well with brandColor.
 */
const ManageAnnouncementsPage = ({ brandColor, contrastTextColor }) => {
    // State to manage the active tab: 'push' or 'banners'
    const [activeTab, setActiveTab] = useState('push');

    // State to manage the visibility of the "New Announcement" modal
    const [showNewAnnouncementModal, setShowNewAnnouncementModal] = useState(false);

    // State to manage the visibility of the "New Banner" modal
    const [showNewBannerModal, setShowNewBannerModal] = useState(false);

    // Dummy data for push announcements
    const [announcements, setAnnouncements] = useState([
        { id: 'ann1', text: 'Get 10% discount when you use the code NEW123', dateCreated: '07-16-25/05:33AM', impressions: 25 },
        { id: 'ann2', text: 'Flash Sale! Up to 50% off on electronics this weekend.', dateCreated: '07-15-25/10:00AM', impressions: 40 },
        { id: 'ann3', text: 'New arrivals in fashion. Check out our latest collection!', dateCreated: '07-14-25/09:00AM', impressions: 30 },
    ]);

    // Dummy data for banners
    const [banners, setBanners] = useState([
        { id: 'ban1', imageUrl: 'https://placehold.co/600x200/FF6347/FFFFFF?text=Sales+Ongoing', dateCreated: '07-16-25/05:33AM', impressions: 25, link: 'https://www.colola.com/sashastores' },
        { id: 'ban2', imageUrl: 'https://placehold.co/600x200/6495ED/FFFFFF?text=New+Collection', dateCreated: '07-15-25/11:00AM', impressions: 35, link: 'https://www.colola.com/newcollection' },
    ]);

    // Handlers for New Announcement Modal
    const handleOpenNewAnnouncementModal = () => setShowNewAnnouncementModal(true);
    const handleCloseNewAnnouncementModal = () => setShowNewAnnouncementModal(false);
    const handleSaveNewAnnouncement = (newAnnouncementText) => {
        console.log('Saving new announcement:', newAnnouncementText);
        setAnnouncements(prev => [...prev, {
            id: `ann${prev.length + 1}`,
            text: newAnnouncementText,
            dateCreated: new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' }) + '/' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
            impressions: 0, // New announcements start with 0 impressions
        }]);
        setShowNewAnnouncementModal(false);
    };

    // Handlers for New Banner Modal
    const handleOpenNewBannerModal = () => setShowNewBannerModal(true);
    const handleCloseNewBannerModal = () => setShowNewBannerModal(false);


    const handleSaveNewBanner = (newBannerData) => {
        console.log('Saving new banner:', newBannerData);
        setBanners(prev => [...prev, {
            id: `ban${prev.length + 1}`,
            imageUrl: newBannerData.imageUrl,
            link: newBannerData.link,
            dateCreated: new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' }) + '/' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
            impressions: 0, // New banners start with 0 impressions
        }]);
        setShowNewBannerModal(false);
    };

    return (
        <div className="p-4 md:p-8">
              <ScrollToTop/>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Manage Announcements</h2>

            {/* Tab Navigation */}
            <div className="flex bg-gray-100 rounded-xl p-1 mb-8">
                <button
                    className={`flex-1 py-2 px-4 rounded-lg text-lg font-semibold transition-all duration-200 ${
                        activeTab === 'push' ? 'bg-white shadow text-gray-800' : 'text-gray-600 hover:bg-gray-200'
                    }`}
                    style={activeTab === 'push' ? { backgroundColor: brandColor, color: contrastTextColor } : {}}
                    onClick={() => setActiveTab('push')}
                >
                    Push Announcements
                </button>
                <button
                    className={`flex-1 py-2 px-4 rounded-lg text-lg font-semibold transition-all duration-200 ${
                        activeTab === 'banners' ? 'bg-white shadow text-gray-800' : 'text-gray-600 hover:bg-gray-200'
                    }`}
                    style={activeTab === 'banners' ? { backgroundColor: brandColor, color: contrastTextColor } : {}}
                    onClick={() => setActiveTab('banners')}
                >
                    Banners
                </button>
            </div>

            {/* Conditional Tab Content */}
            {activeTab === 'push' && (
                <PushAnnouncementsTab
                    announcements={announcements}
                    setAnnouncements={setAnnouncements} // Pass setter for updates
                    brandColor={brandColor}
                    contrastTextColor={contrastTextColor}
                    onOpenNewAnnouncementModal={handleOpenNewAnnouncementModal}
                />
            )}
            {activeTab === 'banners' && (
                <BannersTab
                    banners={banners}
                    setBanners={setBanners} // Pass setter for updates
                    brandColor={brandColor}
                    contrastTextColor={contrastTextColor}
                    onOpenNewBannerModal={handleOpenNewBannerModal}
                />
            )}

            {/* Modals */}
            {showNewAnnouncementModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="relative bg-white rounded-xl shadow-xl max-h-[90vh] overflow-y-auto w-full max-w-md">
                        <CreateNewAnnouncementModal
                            onClose={handleCloseNewAnnouncementModal}
                            onSave={handleSaveNewAnnouncement}
                            brandColor={brandColor}
                        />
                    </div>
                </div>
            )}

            {/* New Banner Modal */}
            {showNewBannerModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="relative bg-white rounded-xl shadow-xl max-h-[90vh] overflow-y-auto w-full max-w-md">
                        <CreateNewBannerModal
                            onClose={handleCloseNewBannerModal}
                            onSave={handleSaveNewBanner}
                            brandColor={brandColor}
                        />
                    </div>
                </div>
            )}
            {/* Edit Announcement Modal is now handled by PushAnnouncementsTab */}
        </div>
    );
};

export default ManageAnnouncementsPage;
