import React, { useEffect, useState, useRef, useMemo } from 'react';
import Modal from '../ui/Modal.jsx';
import ProductStatCard from './ProductStatCard.jsx';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import CustomChartTooltip from '../Dashboard/CustomChartTooltip.jsx';

const ProductStatModal = ({ isOpen, onClose, productStats = null, brandColor = '#EF4444' }) => {
  const [chartReady, setChartReady] = useState(false);
  const chartContainerRef = useRef(null);

  useEffect(() => {
    let timer;
    if (isOpen) {
      timer = setTimeout(() => setChartReady(true), 100);
    } else {
      setChartReady(false);
    }
    return () => clearTimeout(timer);
  }, [isOpen]);

  const safeMetrics = useMemo(() => {
    if (!productStats) return {};
    if (productStats.metrics) return productStats.metrics;
    return {
      productViews: productStats.productViews ?? productStats.views ?? 0,
      inCart: productStats.inCart ?? 0,
      completedOrders: productStats.completedOrders ?? 0,
      impressions: productStats.impressions ?? 0,
      profileClicks: productStats.profileClicks ?? 0,
      chats: productStats.chats ?? 0,
      noClicks: productStats.noClicks ?? 0,
    };
  }, [productStats]);

  const chartData = useMemo(() => {
    if (!productStats?.chartData || !Array.isArray(productStats.chartData)) return [];
    return productStats.chartData.map((item) => ({
      date: item?.date ?? 'N/A',
      Impressions: item?.Impressions ?? 0,
      Visitors: item?.Visitors ?? 0,
      Orders: item?.Orders ?? 0,
    }));
  }, [productStats?.chartData]);

  const stats = useMemo(
    () => [
      { title: 'Views', value: safeMetrics.productViews ?? 0 },
      { title: 'In Cart', value: safeMetrics.inCart ?? 0 },
      { title: 'Completed Orders', value: safeMetrics.completedOrders ?? 0 },
      { title: 'Impressions', value: safeMetrics.impressions ?? 0 },
      { title: 'Profile Clicks', value: safeMetrics.profileClicks ?? 0 },
      { title: 'Chats', value: safeMetrics.chats ?? 0 },
      { title: 'No Clicks', value: safeMetrics.noClicks ?? 0, fullWidth: true },
    ],
    [safeMetrics]
  );

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={productStats?.name || productStats?.productName || 'Product Stats'}
      className="max-w-2xl"
    >
      <div className="p-4 sm:p-6 space-y-6">
        <div ref={chartContainerRef} className="bg-white rounded-3xl p-4 h-64 flex flex-col relative border border-gray-200 shadow-2xl">
          {chartReady ? (
            chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} />
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
            )
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">Loading chart...</div>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {stats.map((stat, idx) => (
            <div key={`${stat.title}-${idx}`} className={stat.fullWidth ? 'col-span-2 sm:col-span-3' : ''}>
              <ProductStatCard title={stat.title} value={stat.value} brandColor={brandColor} />
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default ProductStatModal;