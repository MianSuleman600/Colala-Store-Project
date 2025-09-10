import { useQuery } from '@tanstack/react-query';
import { getStoreAnalytics } from '../settings/storeAnalyticsService';

// Convert YYYY-MM-DD to "Aug 12"
const shortLabel = (iso = '') => {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso || '';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return iso || '';
  }
};

// Shape raw analytics to what the page expects:
// { data: { chartData, salesOrders, customerInsights, productPerformance, financialMetrics } }
const shapeAnalytics = (raw) => {
  if (!raw || typeof raw !== 'object') return { data: {} };

  let chartData = Array.isArray(raw.chartData) ? raw.chartData : null;

  // Derive chartData from timeseries if not provided (dummy mode)
  if (!chartData && raw.timeseries && Array.isArray(raw.timeseries.dailyVisitors)) {
    const dailyVisitors = raw.timeseries.dailyVisitors || [];
    const dailySales = raw.timeseries.dailySales || [];
    const len = Math.max(dailyVisitors.length, dailySales.length);
    chartData = Array.from({ length: len }).map((_, i) => {
      const dv = dailyVisitors[i]?.value ?? 0;
      const ds = dailySales[i]?.value ?? 0;
      const date = dailyVisitors[i]?.date || dailySales[i]?.date || '';
      return {
        name: shortLabel(date) || `Day ${i + 1}`,
        Impressions: dv, // use Visitors as Impressions fallback
        Visitors: dv,
        Orders: ds,
      };
    });
  }

  const ov = raw.overview || {};
  const topProducts = Array.isArray(raw.topProducts) ? raw.topProducts : [];

  const salesOrders = Array.isArray(raw.salesOrders)
    ? raw.salesOrders
    : [
        { title: 'Total Sales', value: ov.totalSales ?? 0 },
        { title: 'Conversion Rate', value: ov.conversionRate != null ? `${ov.conversionRate}%` : '0%' },
      ];

  const customerInsights = Array.isArray(raw.customerInsights)
    ? raw.customerInsights
    : [{ title: 'Total Visitors', value: ov.totalVisitors ?? 0 }];

  const productPerformance = Array.isArray(raw.productPerformance)
    ? raw.productPerformance
    : [
        { title: 'Top Product', value: topProducts[0]?.name || 'N/A' },
        { title: 'Top Product Sales', value: topProducts[0]?.sales ?? 0 },
      ];

  const financialMetrics = Array.isArray(raw.financialMetrics)
    ? raw.financialMetrics
    : [{ title: 'Average Order Value', value: ov.averageOrderValue ?? 0 }];

  return {
    data: {
      chartData: Array.isArray(chartData) ? chartData : [],
      salesOrders,
      customerInsights,
      productPerformance,
      financialMetrics,
    },
  };
};

// Hook usage matches your page: useStoreAnalytics({ storeId, range })
export const useStoreAnalytics = ({ storeId, range } = {}, options = {}) =>
  useQuery({
    queryKey: ['storeAnalytics', storeId, range || 'default'],
    queryFn: async () => {
      if (!storeId) return { data: {} };
      const raw = await getStoreAnalytics(storeId, { range });
      const payload = raw?.data ?? raw; // axios {data} or raw object
      return shapeAnalytics(payload);
    },
    enabled: !!storeId,
    staleTime: 5 * 60 * 1000,
    keepPreviousData: true,
    ...options,
  });

// Backward-compatible alias
export const useStoreAnalyticsQuery = useStoreAnalytics;

export default useStoreAnalytics;