// src/components/products/ProductStatModal.jsx
import React, { useEffect, useState, useRef } from 'react';
import Modal from '../ui/Modal.jsx';
import ProductStatCard from './ProductStatCard.jsx';
import { X } from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

import CustomChartTooltip from '../Dashboard/CustomChartTooltip.jsx'; // Import the custom tooltip component

/**
 * ProductStatModal Component
 * Displays detailed statistics for a product, including a chart and various stat cards.
 * Matches the design in 'image_9e9943.png'.
 *
 * @param {object} props
 * @param {boolean} props.isOpen - Controls the visibility of the modal.
 * @param {function} props.onClose - Callback to close the modal.
 * @param {object} props.productStats - Object containing the statistics data.
 * @param {string} props.productStats.productName - Name of the product.
 * @param {number} props.productStats.views - Number of views.
 * @param {number} props.productStats.inCart - Number of times added to cart.
 * @param {number} props.productStats.completedOrders - Number of completed orders.
 * @param {number} props.productStats.impressions - Number of impressions.
 * @param {number} props.productStats.profileClicks - Number of profileClicks.
 * @param {number} props.productStats.chats - Number of chats.
 * @param {number} props.productStats.noClicks - Number of times no click occurred.
 * @param {object[]} props.productStats.chartData - Array of objects for chart data.
 * @param {string} props.brandColor - Primary brand color for styling.
 * @param {string} props.contrastTextColor - Text color for contrast.
 * @param {string} props.lightBrandColor - Lighter shade of brand color.
 */
const ProductStatModal = ({ isOpen, onClose, productStats, brandColor, contrastTextColor, lightBrandColor }) => {
    const [chartReady, setChartReady] = useState(false);
    const chartContainerRef = useRef(null);

    // Use provided chartData or fallback to dummy data
    const chartData = productStats.chartData && productStats.chartData.length > 0 ? productStats.chartData : [
        { date: '1 Jul', Impressions: 50, Visitors: 30, Orders: 10 },
        { date: '2 Jul', Impressions: 70, Visitors: 45, Orders: 15 },
        { date: '3 Jul', Impressions: 40, Visitors: 20, Orders: 8 },
        { date: '4 Jul', Impressions: 60, Visitors: 35, Orders: 12 },
        { date: '5 Jul', Impressions: 80, Visitors: 50, Orders: 20 },
        { date: '6 Jul', Impressions: 75, Visitors: 48, Orders: 18 },
        { date: '7 Jul', Impressions: 90, Visitors: 60, Orders: 25 },
    ];

    useEffect(() => {
        let timer;
        if (isOpen) {
            console.log("ProductStatModal: Chart data received:", chartData);
            timer = setTimeout(() => {
                setChartReady(true);
                if (chartContainerRef.current) {
                    console.log(
                        "ProductStatModal: Chart container dimensions:",
                        chartContainerRef.current.offsetWidth,
                        "x",
                        chartContainerRef.current.offsetHeight
                    );
                }
            }, 100);
        } else {
            setChartReady(false);
        }
        return () => clearTimeout(timer);
    }, [isOpen, chartData]);

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Product Stat`} className="max-w-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
            <div className="p-4 sm:p-6 space-y-6">
                <div
                    ref={chartContainerRef}
                    className="bg-white rounded-3xl p-4 h-64 flex flex-col relative border border-gray-200 shadow-2xl"
                >
                    {chartReady && chartData && chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%" key={isOpen ? 'chart-open' : 'chart-closed'}>
                            <BarChart
                                data={chartData}
                                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} tick={false} />
                                {/* Use the custom tooltip component here */}
                                <Tooltip content={<CustomChartTooltip />} cursor={{ fill: 'rgba(0,0,0,0.1)' }} />
                                <Legend
                                    align="left"
                                    verticalAlign="top"
                                    wrapperStyle={{ top: -10, left: 10, paddingBottom: 10 }}
                                    iconType="circle"
                                    layout="horizontal"
                                    formatter={(value, entry, index) => {
                                        if (entry && entry.payload) {
                                            if (value === 'Impressions') return 'Impressions';
                                            if (value === 'Visitors') return 'Visitors';
                                            if (value === 'Orders') return 'Orders';
                                        }
                                        return value;
                                    }}
                                />
                                <Bar dataKey="Impressions" fill="#F97316" radius={[5, 5, 0, 0]} />
                                <Bar dataKey="Visitors" fill="#22C55E" radius={[5, 5, 0, 0]} />
                                <Bar dataKey="Orders" fill="#EF4444" radius={[5, 5, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            {!chartReady ? "Loading chart..." : "No chart data available."}
                        </div>
                    )}
                </div>

                {/* Stat Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <ProductStatCard title="Views" value={productStats.views} brandColor={brandColor} />
                    <ProductStatCard title="In Cart" value={productStats.inCart} brandColor={brandColor} />
                    <ProductStatCard title="Completed Order" value={productStats.completedOrders} brandColor={brandColor} />
                    <ProductStatCard title="Impressions" value={productStats.impressions} brandColor={brandColor} />
                    <ProductStatCard title="Profile Clicks" value={productStats.profileClicks} brandColor={brandColor} />
                    <ProductStatCard title="Chats" value={productStats.chats} brandColor={brandColor} />
                    <div className="col-span-2 sm:col-span-3">
                        <ProductStatCard title="No Clicks" value={productStats.noClicks} brandColor={brandColor} />
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ProductStatModal;
