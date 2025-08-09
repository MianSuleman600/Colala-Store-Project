// src/pages/AnalyticsPage.jsx
import React, { useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { ChevronDown, TrendingUp, TrendingDown } from 'lucide-react'; // Icons for dropdown and trends

import CustomChartTooltip from '../../components/Dashboard/CustomChartTooltip'; // Import the new custom tooltip component
import ScrollToTop from '../ui/ScrollToTop';
// Reusable StatCard component
const StatCard = ({ title, value, percentage, trend, brandColor }) => {
    const trendColor = trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-500';
    const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : null;

    return (
        <div className="bg-white p-4 rounded-xl shadow-md flex flex-col items-start justify-between">
            <h4 className="text-sm font-medium text-gray-600 mb-2">{title}</h4>
            <div className="flex items-center w-full justify-between">
                <span className="text-2xl font-bold text-gray-800">{value}</span>
                {percentage && (
                    <div className="flex items-center text-sm font-semibold">
                        {TrendIcon && <TrendIcon size={16} className={`mr-1 ${trendColor}`} />}
                        <span className={trendColor}>{percentage}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

// Main Analytics Page Component
const AnalyticsPage = ({ brandColor }) => {
    const [selectedDateRange, setSelectedDateRange] = useState('7_days'); // Default to 7 days

    // Dummy data for the chart (matching 1.png)
    const chartData = [
        { name: '1 Jul', Impressions: 65, Visitors: 40, Orders: 25 },
        { name: '2 Jul', Impressions: 45, Visitors: 28, Orders: 15 },
        { name: '3 Jul', Impressions: 70, Visitors: 45, Orders: 30 },
        { name: '4 Jul', Impressions: 35, Visitors: 18, Orders: 8 },
        { name: '5 Jul', Impressions: 68, Visitors: 42, Orders: 28 },
        { name: '6 Jul', Impressions: 68, Visitors: 40, Orders: 28 },
        { name: '7 Jul', Impressions: 68, Visitors: 40, Orders: 28 },
        // Added more dummy data points to make the chart scrollable if needed
        { name: '8 Jul', Impressions: 55, Visitors: 35, Orders: 18 },
        { name: '9 Jul', Impressions: 72, Visitors: 50, Orders: 22 },
        { name: '10 Jul', Impressions: 48, Visitors: 25, Orders: 10 },
        { name: '11 Jul', Impressions: 60, Visitors: 38, Orders: 15 },
        { name: '12 Jul', Impressions: 80, Visitors: 55, Orders: 30 },
        { name: '13 Jul', Impressions: 65, Visitors: 40, Orders: 20 },
        { name: '14 Jul', Impressions: 75, Visitors: 48, Orders: 25 },
        { name: '15 Jul', Impressions: 50, Visitors: 30, Orders: 12 },
        { name: '16 Jul', Impressions: 62, Visitors: 40, Orders: 18 },
        { name: '17 Jul', Impressions: 78, Visitors: 52, Orders: 28 },
        { name: '18 Jul', Impressions: 40, Visitors: 22, Orders: 9 },
        { name: '19 Jul', Impressions: 68, Visitors: 45, Orders: 20 },
        { name: '20 Jul', Impressions: 85, Visitors: 58, Orders: 35 },
        { name: '21 Jul', Impressions: 70, Visitors: 44, Orders: 22 },
        { name: '22 Jul', Impressions: 92, Visitors: 65, Orders: 40 },
        { name: '23 Jul', Impressions: 58, Visitors: 38, Orders: 16 },
        { name: '24 Jul', Impressions: 75, Visitors: 50, Orders: 28 },
        { name: '25 Jul', Impressions: 42, Visitors: 28, Orders: 11 },
        { name: '26 Jul', Impressions: 60, Visitors: 35, Orders: 14 },
        { name: '27 Jul', Impressions: 88, Visitors: 60, Orders: 32 },
        { name: '28 Jul', Impressions: 72, Visitors: 48, Orders: 25 },
        { name: '29 Jul', Impressions: 95, Visitors: 70, Orders: 45 },
        { name: '30 Jul', Impressions: 63, Visitors: 40, Orders: 19 },
        { name: '31 Jul', Impressions: 80, Visitors: 55, Orders: 30 },
    ];


    // Dummy data for stat cards (matching 2.png)
    const salesOrdersStats = [
        { title: 'Total Sales', value: 'N200', percentage: '10%', trend: 'up' },
        { title: 'No of Orders', value: '200', percentage: '10%', trend: 'up' },
        { title: 'Fulfillment rate', value: '15%', percentage: '5%', trend: 'up' },
        { title: 'Refunded orders', value: '200', percentage: '2%', trend: 'down' },
        { title: 'Refunded orders', value: '200', percentage: '2%', trend: 'down' }, // Duplicate as per screenshot
        { title: 'Repeat purchase rate', value: '10%', percentage: '1%', trend: 'up' },
    ];

    const customerInsightsStats = [
        { title: 'New Customers', value: '200', percentage: '8%', trend: 'up' },
        { title: 'Returning Customers', value: '10%', percentage: '2%', trend: 'up' },
        { title: 'Customer Reviews', value: '200', percentage: '15%', trend: 'up' },
        { title: 'Product Reviews', value: '200', percentage: '12%', trend: 'up' },
        { title: 'Product Reviews', value: '200', percentage: '12%', trend: 'up' }, // Duplicate as per screenshot
        { title: 'Store Reviews', value: '10%', percentage: '3%', trend: 'up' },
        { title: 'Av Product Rating', value: '10%', percentage: '1%', trend: 'up' },
        { title: 'Av Store Rating', value: '200', percentage: '0%', trend: null },
    ];

    const productPerformanceStats = [
        { title: 'Total Impression', value: '200', percentage: '7%', trend: 'up' },
        { title: 'Total Clicks', value: '10%', percentage: '5%', trend: 'up' },
        { title: 'Orders Placed', value: '10%', percentage: '3%', trend: 'up' },
    ];

    const financialMetricsStats = [
        { title: 'Total Revenue', value: '200', percentage: '10%', trend: 'up' },
        { title: 'Loss from promo', value: '10%', percentage: '1%', trend: 'down' },
        { title: 'Profit Margin', value: '10%', percentage: '2%', trend: 'up' },
    ];

    return (
        <div className="p-4 md:p-0">
              <ScrollToTop/>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Analytics</h2>

            {/* Date Range Dropdown */}
            <div className="mb-6 flex justify-end">
                <div className="relative inline-block text-left">
                    <select
                        value={selectedDateRange}
                        onChange={(e) => setSelectedDateRange(e.target.value)}
                        className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md appearance-none"
                    >
                        <option value="7_days">Last 7 Days</option>
                        <option value="30_days">Last 30 Days</option>
                        <option value="90_days">Last 90 Days</option>
                        <option value="custom">Custom Range</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <ChevronDown size={16} />
                    </div>
                </div>
            </div>

            {/* Bar Chart Section */}
            <div className="bg-white p-4 rounded-2xl shadow-md mb-8 h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
                        {/* Use the custom tooltip component */}
                        <Tooltip content={<CustomChartTooltip />} cursor={{ fill: 'rgba(0,0,0,0.1)' }} />
                        <Legend
                            wrapperStyle={{ paddingTop: '20px' }}
                            align="left"
                            verticalAlign="top"
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
                        <Bar dataKey="Impressions" fill="#FFBF00" radius={[5, 5, 0, 0]} /> {/* Orange */}
                        <Bar dataKey="Visitors" fill="#008000" radius={[5, 5, 0, 0]} /> {/* Green */}
                        <Bar dataKey="Orders" fill="#FF0000" radius={[5, 5, 0, 0]} /> {/* Red */}
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Full Detailed Analytics (2.png) */}
            <h2 className="text-xl font-bold text-gray-800 mb-6">Full Detailed Analytics</h2>

            {/* Sales & Orders */}
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Sales & Orders</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
                {salesOrdersStats.map((stat, index) => (
                    <StatCard key={index} {...stat} brandColor={brandColor} />
                ))}
            </div>

            {/* Customer Insights */}
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Customer Insights</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
                {customerInsightsStats.map((stat, index) => (
                    <StatCard key={index} {...stat} brandColor={brandColor} />
                ))}
            </div>

            {/* Product Performance */}
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Product Performance</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
                {productPerformanceStats.map((stat, index) => (
                    <StatCard key={index} {...stat} brandColor={brandColor} />
                ))}
            </div>

            {/* Financial Metrics */}
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Financial Metrics</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
                {financialMetricsStats.map((stat, index) => (
                    <StatCard key={index} {...stat} brandColor={brandColor} />
                ))}
            </div>
        </div>
    );
};

export default AnalyticsPage;
