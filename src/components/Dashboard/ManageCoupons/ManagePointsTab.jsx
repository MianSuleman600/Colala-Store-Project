// src/components/coupons_points/ManagePointsTab.jsx
import React from 'react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';

const ManagePointsTab = ({ totalPointsBalance, customerPoints, brandColor, contrastTextColor, onOpenPointsSettingsModal, loading = false }) => {
  const gradientEndColor = '#8B008B';

  return (
    <div>
      <Card
        className="p-6 rounded-xl shadow-md mb-8"
        style={{ background: `linear-gradient(to right, ${brandColor}, ${gradientEndColor})` }}
      >
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-sm font-medium" style={{ color: contrastTextColor }}>
              Total Points Balance
            </span>
            <span className="text-3xl font-bold" style={{ color: contrastTextColor }}>
              {Number(totalPointsBalance || 0).toLocaleString()}
            </span>
          </div>
          <Button
            onClick={onOpenPointsSettingsModal}
            className="py-2 px-4 rounded-lg font-semibold text-sm"
            style={{ backgroundColor: 'white', color: brandColor }}
          >
            Settings
          </Button>
        </div>
      </Card>

      {loading && <div className="mb-4 text-sm text-gray-500">Loading points data...</div>}

      <h3 className="text-xl font-semibold text-gray-800 mb-4">Customers Points</h3>
      <div className="space-y-3">
        {customerPoints.length === 0 ? (
          <Card className="p-6 text-center text-gray-600">No customer points data available.</Card>
        ) : (
          customerPoints.map((customer) => (
            <Card key={customer.id} className="p-3 rounded-xl shadow-sm flex items-center justify-between">
              <div className="flex items-center">
                <img
                  src={customer.avatar}
                  alt={customer.name}
                  className="h-10 w-10 rounded-full object-cover mr-3"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://placehold.co/40x40/e0e0e0/000000?text=User';
                  }}
                />
                <span className="text-gray-800 font-medium">{customer.name}</span>
              </div>
              <span className="font-semibold" style={{ color: brandColor }}>
                {customer.points}
              </span>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ManagePointsTab;