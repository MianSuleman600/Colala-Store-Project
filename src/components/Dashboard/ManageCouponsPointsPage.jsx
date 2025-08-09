// src/pages/ManageCouponsPointsPage.jsx
import React, { useState } from 'react';
// Corrected import paths for all components
import ManageCouponsTab from '../Dashboard/ManageCouponsTab';
import ManagePointsTab from '../Dashboard/ManagePointsTab';
import CreateNewCouponModal from '../models/CreateNewCouponModal';
import PointsSettingsModal from '../models/PointsSettingsModal';
import EditCouponModal from '../models/EditCouponModal'; // Import the new EditCouponModal
import ScrollToTop from '../ui/ScrollToTop';

// Dummy images for customer points avatars
import img1 from '../../assets/images/productImages/2.jpeg';
import img2 from '../../assets/images/productImages/3.jpeg';
import img3 from '../../assets/images/productImages/4.jpeg';
import img4 from '../../assets/images/productImages/1.png';


/**
 * ManageCouponsPointsPage Component
 * This component acts as the main container for managing coupons and points.
 * It features two tabs: "Manage Coupons" and "Manage Points", and controls
 * the display of modals for creating new coupons and adjusting points settings.
 * It matches the design in 'image_e58e84.png' and 'image_e58e85.png'.
 *
 * @param {object} props
 * @param {string} props.brandColor - The primary brand color for styling.
 * @param {string} props.contrastTextColor - The text color that contrasts well with brandColor.
 * @param {string} props.lightBrandColor - A lighter shade of the brand color.
 */
const ManageCouponsPointsPage = ({ brandColor, contrastTextColor, lightBrandColor }) => {
    // State to manage the active tab: 'coupons' or 'points'
    const [activeTab, setActiveTab] = useState('coupons');

    // State to manage the visibility of the "Create New Code" modal
    const [showCreateCouponModal, setShowCreateCouponModal] = useState(false);

    // State to manage the visibility of the "Points Settings" modal
    const [showPointsSettingsModal, setShowPointsSettingsModal] = useState(false);

    // Dummy data for coupons (example structure)
    const [coupons, setCoupons] = useState([
        { id: 'c1', code: 'NEW123', dateCreated: '07-16-25/05:33AM', timesUsed: 25, maxUsage: 50, percentageOff: 10, usagePerUser: 1, expiryDate: '2025-12-31' },
        { id: 'c2', code: 'SAVEBIG', dateCreated: '07-15-25/11:00AM', timesUsed: 10, maxUsage: 20, percentageOff: 20, usagePerUser: 5, expiryDate: '2025-11-15' },
        { id: 'c3', code: 'WELCOME50', dateCreated: '07-14-25/09:00AM', timesUsed: 5, maxUsage: 100, percentageOff: 50, usagePerUser: 1, expiryDate: '2025-10-01' },
    ]);

    // Dummy data for customer points (example structure)
    const [customerPoints, setCustomerPoints] = useState([
        { id: 'cust1', name: 'Adewale Faizah', avatar: img1, points: 200 },
        { id: 'cust2', name: 'Liam Chen', avatar: img2, points: 150 },
        { id: 'cust3', name: 'Sophia Martinez', avatar: img3, points: 220 },
        { id: 'cust4', name: 'Omar Patel', avatar: img4, points: 180 },
        { id: 'cust5', name: 'Isabella Johnson', avatar: img1, points: 170 },
        { id: 'cust6', name: 'Mia Robinson', avatar: img2, points: 210 },
    ]);

    // Dummy total points balance
    const [totalPointsBalance, setTotalPointsBalance] = useState(5000);

    // Handlers for Create New Coupon Modal
    const handleOpenCreateCouponModal = () => setShowCreateCouponModal(true);
    const handleCloseCreateCouponModal = () => setShowCreateCouponModal(false);
    const handleSaveNewCoupon = (newCoupon) => {
        // In a real app, you'd send this to a backend
        console.log('Saving new coupon:', newCoupon);
        setCoupons(prev => [...prev, {
            id: `c${prev.length + 1}`,
            code: newCoupon.couponCodeName,
            dateCreated: new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' }) + '/' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
            timesUsed: 0, // New coupons start with 0 usage
            maxUsage: newCoupon.maximumUsage,
            percentageOff: newCoupon.percentageOff, // Store percentage
            usagePerUser: newCoupon.noOfUsagePerUser, // Store usage per user
            expiryDate: newCoupon.expiryDate, // Store expiry date
        }]);
        setShowCreateCouponModal(false);
    };

    // Handlers for Points Settings Modal
    const handleOpenPointsSettingsModal = () => setShowPointsSettingsModal(true);
    const handleClosePointsSettingsModal = () => setShowPointsSettingsModal(false);
    const handleSavePointsSettings = (settings) => {
        // In a real app, you'd send this to a backend
        console.log('Saving points settings:', settings);
        // You would update a global state or context here based on settings
        setShowPointsSettingsModal(false);
    };

    return (
        <div className="p-4 md:p-8">
              <ScrollToTop/>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Manage Coupons</h2> {/* Title from image */}

            {/* Tab Navigation */}
            <div className="flex bg-gray-100 rounded-xl p-1 mb-8">
                <button
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
                        activeTab === 'coupons' ? 'bg-white shadow text-gray-800' : 'text-gray-600 hover:bg-gray-200'
                    }`}
                    style={activeTab === 'coupons' ? { backgroundColor: brandColor, color: contrastTextColor } : {}}
                    onClick={() => setActiveTab('coupons')}
                >
                    Manage Coupons
                </button>
                <button
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
                        activeTab === 'points' ? 'bg-white shadow text-gray-800' : 'text-gray-600 hover:bg-gray-200'
                    }`}
                    style={activeTab === 'points' ? { backgroundColor: brandColor, color: contrastTextColor } : {}}
                    onClick={() => setActiveTab('points')}
                >
                    Manage Points
                </button>
            </div>

            {/* Conditional Tab Content */}
            {activeTab === 'coupons' && (
                <ManageCouponsTab
                    coupons={coupons}
                    setCoupons={setCoupons} // Pass setCoupons to ManageCouponsTab
                    brandColor={brandColor}
                    contrastTextColor={contrastTextColor}
                    onOpenCreateCouponModal={handleOpenCreateCouponModal}
                />
            )}
            {activeTab === 'points' && (
                <ManagePointsTab
                    totalPointsBalance={totalPointsBalance}
                    customerPoints={customerPoints}
                    brandColor={brandColor}
                    contrastTextColor={contrastTextColor}
                    onOpenPointsSettingsModal={handleOpenPointsSettingsModal}
                />
            )}

            {/* Modals */}
            {showCreateCouponModal && (
                <div className="fixed inset-0  flex items-center justify-center z-50 p-4">
                    <div className="relative bg-white rounded-xl shadow-xl max-h-[90vh] overflow-y-auto w-full max-w-md">
                        <CreateNewCouponModal
                            onClose={handleCloseCreateCouponModal}
                            onSave={handleSaveNewCoupon}
                            brandColor={brandColor}
                        />
                    </div>
                </div>
            )}

            {/* Points Settings Modal */}
            {showPointsSettingsModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="relative bg-white rounded-xl shadow-xl max-h-[90vh] overflow-y-auto w-full max-w-md">
                        <PointsSettingsModal
                            onClose={handleClosePointsSettingsModal}
                            onSave={handleSavePointsSettings}
                            brandColor={brandColor}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageCouponsPointsPage;
