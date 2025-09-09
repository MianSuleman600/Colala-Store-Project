import React from 'react';

const CustomChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  const dataMap = {
    Impressions: { name: 'Impressions', color: '#FFBF00' },
    Visitors: { name: 'Visitors', color: '#008000' },
    Orders: { name: 'Orders', color: '#FF0000' },
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200 text-gray-800 text-sm">
      {payload.map((entry, index) => (
        <div key={`item-${index}`} className="flex items-center mb-1 last:mb-0">
          <div className="w-4 h-4 rounded-md mr-2 flex-shrink-0" style={{ backgroundColor: dataMap[entry.name]?.color || entry.color }} />
          <span className="font-semibold mr-2">{dataMap[entry.name]?.name || entry.name}</span>
          <span className="font-bold">{entry.value}</span>
        </div>
      ))}
      <p className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-200">{label}</p>
    </div>
  );
};

export default CustomChartTooltip;