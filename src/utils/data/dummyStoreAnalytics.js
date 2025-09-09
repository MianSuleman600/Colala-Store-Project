// src/utils/data/dummyStoreAnalytics.js
export const dummyStoreAnalytics = {
  totalVisitors: 1200,
  totalSales: 340,
  conversionRate: 28.3,
  averageOrderValue: 45.5,
  topProducts: [
    { name: 'Premium Coffee Beans', sales: 120 },
    { name: 'Organic Green Tea', sales: 90 },
    { name: 'Almond Milk', sales: 75 }
  ],
  trafficSources: [
    { source: 'Google', percentage: 50 },
    { source: 'Instagram', percentage: 30 },
    { source: 'Direct', percentage: 20 }
  ],
  lastUpdated: new Date().toISOString()
};
