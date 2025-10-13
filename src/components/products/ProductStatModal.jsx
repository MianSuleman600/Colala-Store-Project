// src/components/products/ProductStatModal.jsx

import React, { useMemo } from 'react';
import Modal from '../ui/Modal.jsx';
import ProductStatCard from './ProductStatCard.jsx';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import CustomChartTooltip from '../Dashboard/CustomChartTooltip.jsx';
import { useProductStatsQuery } from '../../services/queries/useproductsQuery.js';

const ProductStatModal = ({ isOpen, onClose, productId, brandColor = '#EF4444' }) => {
  // This hook now returns { name, chartData, totals }
  const { data: statsData, isLoading, isError } = useProductStatsQuery(productId, {
    enabled: isOpen && !!productId,
  });

  // Map backend totals keys to frontend display titles
  const stats = useMemo(() => {
    const totals = statsData?.totals || {};
    return [
      { title: 'Impressions', value: totals.impression ?? 0 },
      { title: 'Product Views', value: totals.view ?? 0 },
      { title: 'Product Clicks', value: totals.click ?? 0 },
      { title: 'Added to Cart', value: totals.add_to_cart ?? 0 },
      { title: 'Completed Orders', value: totals.order ?? 0 },
      { title: 'Chats Initiated', value: totals.chat ?? 0 },
    ];
  }, [statsData]);

  const chartData = useMemo(() => statsData?.chartData ?? [], [statsData]);

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={statsData?.name || 'Product Stats'} className="max-w-2xl">
      <div className="p-4 sm:p-6 space-y-6">
        {isLoading && <div className="flex items-center justify-center h-80 text-gray-500">Loading stats...</div>}
        {isError && <div className="flex items-center justify-center h-80 text-red-500">Could not load product stats.</div>}
        
        {statsData && !isLoading && (
          <>
            <div className="bg-white rounded-3xl p-4 h-64 flex flex-col relative border border-gray-200 shadow-xl">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomChartTooltip />} cursor={{ fill: 'rgba(0,0,0,0.1)' }} />
                    <Legend align="left" verticalAlign="top" wrapperStyle={{ top: -10, left: 10 }} iconType="circle" />
                    <Bar dataKey="Impressions" fill="#F97316" radius={[5, 5, 0, 0]} />
                    <Bar dataKey="Visitors" fill="#22C55E" radius={[5, 5, 0, 0]} />
                    <Bar dataKey="Orders" fill="#EF4444" radius={[5, 5, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">No chart data available.</div>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {stats.map((stat, idx) => (
                <div key={`${stat.title}-${idx}`}>
                  <ProductStatCard title={stat.title} value={stat.value} brandColor={brandColor} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default ProductStatModal;