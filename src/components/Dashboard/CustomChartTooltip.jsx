// src/components/Dashboard/CustomChartTooltip.jsx

import React from 'react';

const CustomChartTooltip = ({ active, payload, label, brandColor = '#FF0000' }) => {
  if (!active || !payload || !payload.length) return null;

  // Use a map for easy lookup and dynamic color for Orders
  const dataMap = {
    Impressions: { name: 'Impressions', color: '#FFC107' },
    Visitors: { name: 'Visitors', color: '#4CAF50' },
    Orders: { name: 'Orders', color: brandColor }, // Use the passed brandColor
  };

  return (
    <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200 text-sm">
      <p className="text-xs text-gray-500 mb-2 font-semibold">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center mb-1 last:mb-0">
          <div className="w-3 h-3 rounded-sm mr-2 flex-shrink-0" style={{ backgroundColor: dataMap[entry.name]?.color || entry.color }} />
          <span className="text-gray-600 mr-2">{dataMap[entry.name]?.name || entry.name}:</span>
          <span className="font-bold text-gray-800">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export default CustomChartTooltip;