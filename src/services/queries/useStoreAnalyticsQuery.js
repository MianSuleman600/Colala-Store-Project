import { useQuery } from '@tanstack/react-query';
import { getStoreAnalytics } from '../settings/storeAnalyticsService';

// Helper to format YYYY-MM-DD into a short label like "Aug 12"
const shortLabel = (isoDate = '') => {
  try {
    const d = new Date(`${isoDate}T00:00:00`);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return isoDate || '';
  }
};

// Helper to transform a backend stat object into a structured frontend array
const transformStatObject = (obj, keyMap) => {
  if (!obj) return [];
  return Object.entries(keyMap).map(([key, title]) => ({
    title,
    value: obj[key] ?? 0,
  }));
};

// Transforms the raw backend data into the specific format the UI components expect
const shapeAnalytics = (raw) => {
  if (!raw || typeof raw !== 'object') return { data: {} };

  const chartData = (raw.chart_data || []).map(item => ({
    name: shortLabel(item.date),
    Impressions: item.impressions,
    Visitors: item.visitors,
    Orders: item.orders,
  }));

  const analytics = raw.analytics || {};

  const salesOrders = transformStatObject(analytics.sales_orders, {
    total_sales: 'Total Sales',
    no_of_orders: 'Number of Orders',
    fulfillment_rate: 'Fulfillment Rate (%)',
    repeat_purchase_rate: 'Repeat Purchase Rate (%)',
  });

  const customerInsights = transformStatObject(analytics.customer_insights, {
    new_customers: 'New Customers',
    returning_customers: 'Returning Customers Rate (%)',
    product_reviews: 'Product Reviews',
    av_product_rating: 'Avg. Product Rating',
    av_store_rating: 'Avg. Store Rating',
  });

  const productPerformance = transformStatObject(analytics.product_performance, {
    total_impression: 'Total Impressions',
    total_clicks: 'Click-Through Rate (%)',
    orders_placed: 'Conversion Rate (%)',
  });

  const financialMetrics = transformStatObject(analytics.financial_metrics, {
    total_revenue: 'Total Revenue',
    loss_from: 'Refunded Amount',
    profit_margin: 'Profit Margin (%)',
  });

  return {
    data: {
      chartData,
      salesOrders,
      customerInsights,
      productPerformance,
      financialMetrics,
    },
  };
};

/**
 * Optimized hook to fetch and shape store analytics data.
 * @param {string|number} storeId - The ID of the store. The query is disabled if this is falsy.
 * @param {string} range - The date range string (e.g., '7_days').
 * @param {object} options - Additional options for react-query's useQuery.
 * @returns The result object from useQuery.
 */
export const useStoreAnalytics = (storeId, range, options = {}) => {
  return useQuery({
    queryKey: ['storeAnalytics', storeId, range],
    queryFn: async () => {
      const rawResponse = await getStoreAnalytics({ range });
      // The backend nests the actual data inside a 'data' key.
      const payload = rawResponse?.data ?? rawResponse;
      return shapeAnalytics(payload);
    },
    // The query will not run until a valid storeId is provided. This is crucial for stability.
    enabled: !!storeId,
    // Caching settings for performance
    staleTime: 5 * 60 * 1000, // Data is fresh for 5 minutes
    keepPreviousData: true,   // Show old data while new data is fetching for a smoother UX
    ...options,
  });
};