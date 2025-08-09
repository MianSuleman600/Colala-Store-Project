// src/components/Dashboard/CustomChartTooltip.jsx
import React from 'react';

/**
 * CustomChartTooltip Component for Recharts
 * Renders a custom tooltip for the bar chart in AnalyticsPage,
 * matching the design in 'image_ab505c.png'.
 *
 * @param {object} props
 * @param {boolean} props.active - True if the tooltip is active (hovered).
 * @param {array} props.payload - Array of data points for the hovered item.
 * @param {string} props.label - The label for the hovered data point (e.g., date).
 */
const CustomChartTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        // Map data keys to display names and colors
        const dataMap = {
            Impressions: { name: 'Impressions', color: '#FFBF00' }, // Orange
            Visitors: { name: 'Visitors', color: '#008000' },     // Green
            Orders: { name: 'Orders', color: '#FF0000' },         // Red
        };

        return (
            <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200 text-gray-800 text-sm">
                {/* Metrics and Values */}
                {payload.map((entry, index) => (
                    <div key={`item-${index}`} className="flex items-center mb-1 last:mb-0">
                        <div
                            className="w-4 h-4 rounded-md mr-2 flex-shrink-0"
                            style={{ backgroundColor: dataMap[entry.name]?.color || entry.color }} // Use mapped color or default entry.color
                        ></div>
                        <span className="font-semibold mr-2">{dataMap[entry.name]?.name || entry.name}</span>
                        <span className="font-bold">{entry.value}</span>
                    </div>
                ))}
                {/* Date Label at the bottom */}
                <p className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-200">
                    {label}
                </p>
            </div>
        );
    }

    return null;
};

export default CustomChartTooltip;
