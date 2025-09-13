import React, { useMemo, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ChevronDown, TrendingUp, TrendingDown } from 'lucide-react';
import BackButton from '../../components/ui/BackButton'

import { useStoreAnalytics } from '../../services/queries/useStoreAnalyticsQuery';
import { useStoreProfile } from '../../services/queries/storeProfileQuery';
import CustomChartTooltip from '../../components/Dashboard/CustomChartTooltip';
import ScrollToTop from '../../components/ui/ScrollToTop';
import { getContrastTextColor } from '../../utils/colorUtils';
import { useToast } from '../../components/ui/ToastProvider';

const StatCard = ({ title = 'N/A', value = '--', percentage, trend }) => {
  const trendColor =
    trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-400';
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : null;

  return (
    <div className="bg-white p-4 rounded-xl shadow-md flex flex-col items-start justify-between">
      
      <h4 className="text-sm font-medium text-gray-600 mb-2">{title}</h4>
      <div className="flex items-center w-full justify-between">
        <span className="text-2xl font-bold text-gray-800">{value ?? '--'}</span>
        {percentage !== undefined && percentage !== null && (
          <div className="flex items-center text-sm font-semibold">
            {TrendIcon && <TrendIcon size={16} className={`mr-1 ${trendColor}`} />}
            <span className={trendColor}>{percentage}</span>
          </div>
        )}
      </div>
    </div>
  );
};

const makeFallbackArray = (len, factory) => Array.from({ length: len }, (_, i) => factory(i));

const AnalyticsPage = ({ storeId: propStoreId }) => {
  const { push } = useToast();

  // Fallback to logged-in user's storeId if not provided via props
  const userId = useSelector((s) => s.user?.userId);
  const storeId = propStoreId || userId;

  const [selectedDateRange, setSelectedDateRange] = useState('7_days');

  // Profile for colors (safe even if storeId is missing)
  const { data: storeProfile } = useStoreProfile(storeId, { enabled: !!storeId });
  const brandColor = useMemo(() => storeProfile?.brandColor || '#EF4444', [storeProfile]);
  const contrastTextColor = useMemo(() => getContrastTextColor(brandColor), [brandColor]);

  // Analytics query
  const {
    data: analyticsData,
    isLoading,
    isError,
    error,
  } = useStoreAnalytics({ storeId, range: selectedDateRange }, { enabled: !!storeId });

  // Toast errors (non-blocking)
  useEffect(() => {
    if (isError) {
      push(error?.message || 'Failed to load analytics data.', { type: 'error' });
    }
  }, [isError, error, push]);

  const safeData = analyticsData?.data ?? {};

  const chartData = useMemo(() => {
    const src = safeData.chartData;
    if (Array.isArray(src) && src.length) return src;
    return makeFallbackArray(7, (i) => ({
      name: `Day ${i + 1}`,
      Impressions: 0,
      Visitors: 0,
      Orders: 0,
    }));
  }, [safeData.chartData]);

  const makeStats = (arr, fallbackLen = 4) => {
    if (Array.isArray(arr) && arr.length) {
      return arr.map((s) => ({
        title: s.title ?? 'N/A',
        value: s.value ?? 0,
        percentage: s.percentage,
        trend: s.trend, // 'up' | 'down' | undefined
      }));
    }
    return makeFallbackArray(fallbackLen, () => ({ title: 'N/A', value: 0 }));
  };

  const salesOrdersStats = useMemo(
    () => makeStats(safeData.salesOrders, 4),
    [safeData.salesOrders]
  );
  const customerInsightsStats = useMemo(
    () => makeStats(safeData.customerInsights, 4),
    [safeData.customerInsights]
  );
  const productPerformanceStats = useMemo(
    () => makeStats(safeData.productPerformance, 4),
    [safeData.productPerformance]
  );
  const financialMetricsStats = useMemo(
    () => makeStats(safeData.financialMetrics, 4),
    [safeData.financialMetrics]
  );

  // If storeId is missing entirely
  if (!storeId) {
    return (
      <div className="p-6 text-center text-gray-600">
        No store selected. Please sign in or provide a storeId.
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <ScrollToTop />
 <BackButton className="md:hidden mb-2" fallback="/" />
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Analytics</h2>

        {/* Date Range */}
        <div className="relative inline-block text-left">
          <select
            value={selectedDateRange}
            onChange={(e) => setSelectedDateRange(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md appearance-none"
            aria-label="Select date range"
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

      {/* Loading & Error (non-blocking) */}
      {isLoading && <div className="p-4 text-gray-600">Loading analytics...</div>}
      {isError && <div className="p-4 text-red-500">Failed to load analytics data. Showing fallback data.</div>}

      {/* Bar Chart */}
      <div className="bg-white rounded-2xl shadow-md mb-8 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 3, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip content={<CustomChartTooltip />} cursor={{ fill: 'rgba(0,0,0,0.1)' }} />
            <Legend
              wrapperStyle={{ paddingTop: '10px' }}
              align="left"
              verticalAlign="top"
              iconType="circle"
              layout="horizontal"
            />
            <Bar dataKey="Impressions" fill="#FFBF00" radius={[5, 5, 0, 0]} />
            <Bar dataKey="Visitors" fill="#008000" radius={[5, 5, 0, 0]} />
            <Bar dataKey="Orders" fill={brandColor} radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Sections */}
      {[
        { title: 'Sales & Orders', data: salesOrdersStats },
        { title: 'Customer Insights', data: customerInsightsStats },
        { title: 'Product Performance', data: productPerformanceStats },
        { title: 'Financial Metrics', data: financialMetricsStats },
      ].map((section, idx) => (
        <div key={section.title || idx} className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700">{section.title}</h3>
            <div className="w-16 h-1 rounded-full" style={{ backgroundColor: brandColor }} aria-hidden />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {section.data.map((stat, i) => (
              <StatCard key={`${section.title}-${i}`} {...stat} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnalyticsPage;