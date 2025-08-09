// src/components/coupons_points/ManagePointsTab.jsx
import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';

/**
 * ManagePointsTab Component
 * Displays the total points balance and a list of customers with their accumulated points.
 * Includes a button to open points settings.
 * Matches the design in 'image_e58e85.png' and the gradient card in 'image_f13e22.png'.
 *
 * @param {object} props
 * @param {number} props.totalPointsBalance - The total available points.
 * @param {Array<object>} props.customerPoints - An array of customer point objects.
 * @param {string} props.brandColor - The primary brand color for styling.
 * @param {string} props.contrastTextColor - The text color that contrasts well with brandColor.
 * @param {function} props.onOpenPointsSettingsModal - Callback to open the points settings modal.
 */
const ManagePointsTab = ({ totalPointsBalance, customerPoints, brandColor, contrastTextColor, onOpenPointsSettingsModal }) => {
    // Determine a secondary color for the gradient, often a darker or complementary shade of the brandColor
    // For a red brandColor (#EF4444), a deep pink/purple or darker red works well for a gradient.
    const gradientEndColor = '#8B008B'; // Example: DarkMagenta for a red-to-purple gradient

   
    return (
        <div>
            {/* Total Points Balance Card */}
            <Card
                className="p-6 rounded-xl shadow-md mb-8"
                // Apply a linear gradient background
                style={{
                    background: `linear-gradient(to right, ${brandColor}, ${gradientEndColor})`
                }}
            >
                <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                        <span className="text-sm font-medium" style={{ color: contrastTextColor }}>Total Points Balance</span>
                        <span className="text-3xl font-bold" style={{ color: contrastTextColor }}>{totalPointsBalance.toLocaleString()}</span>
                    </div>
                    <Button
                        onClick={onOpenPointsSettingsModal}
                        className="py-2 px-4 rounded-lg font-semibold text-sm"
                        // Settings button background is white, text color is brandColor
                        style={{ backgroundColor: 'white', color: brandColor }}
                    >
                        Settings
                    </Button>
                </div>
            </Card>

            {/* Customers Points List */}
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Customers Points</h3>
            <div className="space-y-3">
                {customerPoints.length === 0 ? (
                    <Card className="p-6 text-center text-gray-600">No customer points data available.</Card>
                ) : (
                    customerPoints.map(customer => (
                        <Card key={customer.id} className="p-3 rounded-xl shadow-sm flex items-center justify-between">
                            <div className="flex items-center">
                                <img
                                    src={customer.avatar}
                                    alt={customer.name}
                                    className="h-10 w-10 rounded-full object-cover mr-3"
                                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/40x40/e0e0e0/000000?text=User"; }}
                                />
                                <span className="text-gray-800 font-medium">{customer.name}</span>
                            </div>
                            <span className="font-semibold" style={{ color: brandColor }}>{customer.points}</span>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default ManagePointsTab;
