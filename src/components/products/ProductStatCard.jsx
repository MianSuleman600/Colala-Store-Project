import React from 'react';
import { BarChart2 } from 'lucide-react';

const ProductStatCard = ({ title = 'Statistic', value = 0, brandColor = '#EF4444' }) => {
  const displayValue = typeof value === 'number' ? value.toLocaleString() : value || 0;

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between h-24 w-full">
      <div className="flex items-center justify-between w-full mb-2">
        <div className="w-1 h-4 rounded-full mr-2 flex-shrink-0" style={{ backgroundColor: brandColor }} />
        <h4 className="text-sm font-medium text-gray-600 flex-1">{title}</h4>
        <BarChart2 size={16} className="text-gray-400 flex-shrink-0" />
      </div>
      <span className="text-xl font-bold text-gray-800">{displayValue}</span>
    </div>
  );
};

export default ProductStatCard;