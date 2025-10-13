import React, { useMemo, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChevronDown, TrendingUp, TrendingDown } from 'lucide-react';
import BackButton from '../../components/ui/BackButton';
import { useStoreAnalytics } from '../../services/queries/useStoreAnalyticsQuery';
import { useStoreProfile } from '../../services/queries/storeProfileQuery';
import CustomChartTooltip from '../../components/Dashboard/CustomChartTooltip';
import ScrollToTop from '../../components/ui/ScrollToTop';
import { useToast } from '../../components/ui/ToastProvider';

const StatCard = ({ title, value, percentage, trend }) => {
  const trendColor = trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-400';
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : null;
  return (
    <div className="bg-white p-4 rounded-xl shadow-md flex flex-col items-start justify-between">
      <h4 className="text-sm font-medium text-gray-600 mb-2">{title ?? 'N/A'}</h4>
      <div className="flex items-center w-full justify-between">
        <span className="text-2xl font-bold text-gray-800">{value ?? '--'}</span>
        {percentage != null && (
          <div className={`flex items-center text-sm font-semibold ${trendColor}`}>
            {TrendIcon && <TrendIcon size={16} className="mr-1" />}
            <span>{percentage}</span>
          </div>
        )}
      </div>
    </div>
  );
};

const AnalyticsPage = () => {
  const { push } = useToast();
  
  const { user, status: authStatus } = useSelector((state) => state.auth);
  const storeId = user?.store?.id;
  const isAuthLoading = authStatus === 'idle' || authStatus === 'loading';

  const [selectedDateRange, setSelectedDateRange] = useState('7_days');

  const { data: storeProfile } = useStoreProfile(storeId, { enabled: !!storeId });
  const brandColor = useMemo(() => storeProfile?.brandColor || '#EF4444', [storeProfile]);

  // Call the hook with stable, primitive values. This prevents infinite re-renders.
  const { data: analyticsData, isLoading, isError, error } = useStoreAnalytics(
    storeId, 
    selectedDateRange
  );

  useEffect(() => {
    if (isError) {
      push(error?.message || 'Failed to load analytics data.', { type: 'error' });
    }
  }, [isError, error, push]);

  // Memoize the derived data to prevent unnecessary recalculations on re-renders.
  const {
    chartData,
    salesOrdersStats,
    customerInsightsStats,
    productPerformanceStats,
    financialMetricsStats,
  } = useMemo(() => {
    const data = analyticsData?.data ?? {};
    return {
      chartData: data.chartData ?? [],
      salesOrdersStats: data.salesOrders ?? [],
      customerInsightsStats: data.customerInsights ?? [],
      productPerformanceStats: data.productPerformance ?? [],
      financialMetricsStats: data.financialMetrics ?? [],
    };
  }, [analyticsData]);

  // Render guards for a clean user experience
  if (isAuthLoading) {
    return <div className="p-6 text-center text-gray-600">Authenticating...</div>;
  }
  if (!storeId) {
    return <div className="p-6 text-center text-gray-600">Store not found. Please ensure you are logged in as a seller.</div>;
  }
  if (isLoading) {
    return <div className="p-6 text-center text-gray-600">Loading analytics...</div>;
  }
  
  return (
    <div className="p-4 md:p-6">
      <ScrollToTop />
      <BackButton className="md:hidden mb-2" fallback="/" />
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Analytics</h2>
        <div className="relative inline-block text-left">
          <select
            value={selectedDateRange}
            onChange={(e) => setSelectedDateRange(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-0 sm:text-sm rounded-md appearance-none"
            style={{ '--tw-ring-color': brandColor }}
          >
            <option value="7_days">Last 7 Days</option>
            <option value="30_days">Last 30 Days</option>
            <option value="90_days">Last 90 Days</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <ChevronDown size={16} />
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl shadow-md mb-8 h-80 p-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} />
            <YAxis axisLine={false} tickLine={false} fontSize={12} />
            <Tooltip content={<CustomChartTooltip brandColor={brandColor} />} cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
            <Legend wrapperStyle={{ paddingTop: '10px' }} align="right" verticalAlign="top" iconType="circle" />
            <Bar dataKey="Impressions" fill="#FFC107" radius={[5, 5, 0, 0]} barSize={10} />
            <Bar dataKey="Visitors" fill="#4CAF50" radius={[5, 5, 0, 0]} barSize={10} />
            <Bar dataKey="Orders" fill={brandColor} radius={[5, 5, 0, 0]} barSize={10} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {[
        { title: 'Sales & Orders', data: salesOrdersStats },
        { title: 'Customer Insights', data: customerInsightsStats },
        { title: 'Product Performance', data: productPerformanceStats },
        { title: 'Financial Metrics', data: financialMetricsStats },
      ].map((section) => (
        <div key={section.title} className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">{section.title}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {section.data.map((stat) => (
              <StatCard key={stat.title} {...stat} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnalyticsPage;