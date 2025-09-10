export const dummyStoreAnalytics = {
  overview: {
    totalVisitors: 1200,
    totalSales: 340,
    conversionRate: 28.3,
    averageOrderValue: 45.5,
    lastUpdated: new Date().toISOString(),
  },
  topProducts: [
    { id: 'p1', name: 'Premium Coffee Beans', sales: 120, revenue: 180000 },
    { id: 'p2', name: 'Organic Green Tea', sales: 90, revenue: 90000 },
    { id: 'p3', name: 'Almond Milk', sales: 75, revenue: 60000 },
    { id: 'p4', name: 'Hot Chocolate', sales: 55, revenue: 38500 },
  ],
  trafficSources: [
    { source: 'Google', percentage: 50 },
    { source: 'Instagram', percentage: 30 },
    { source: 'Direct', percentage: 20 },
  ],
  devices: [
    { type: 'Mobile', percentage: 62 },
    { type: 'Desktop', percentage: 31 },
    { type: 'Tablet', percentage: 7 },
  ],
  geoDistribution: [
    { region: 'Lagos', visitors: 520 },
    { region: 'Abuja', visitors: 320 },
    { region: 'Port Harcourt', visitors: 210 },
    { region: 'Ibadan', visitors: 150 },
  ],
  timeseries: {
    dailyVisitors: [],
    dailySales: [],
    dailyRevenue: [],
  },
};

const genDays = (n = 30) => {
  const out = [];
  const today = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    out.push(d.toISOString().slice(0, 10)); // YYYY-MM-DD
  }
  return out;
};

const randomAround = (base, variance = 0.2) => {
  const min = base * (1 - variance);
  const max = base * (1 + variance);
  return Math.round(min + Math.random() * (max - min));
};

const buildSeries = (days, baseValue) =>
  days.map((dateStr) => ({
    date: dateStr,
    value: randomAround(baseValue, 0.35),
  }));

export const buildDummyAnalytics = (seed = dummyStoreAnalytics, { storeId, days = 30 } = {}) => {
  const ds = genDays(days);
  const baseVisitors = seed.overview?.totalVisitors || 1200;
  const baseSales = seed.overview?.totalSales || 340;

  // Slight per-store variation so charts differ
  const storeHash = storeId ? storeId.toString().split('').reduce((a, c) => a + c.charCodeAt(0), 0) : 0;
  const visitorsAdj = 1 + ((storeHash % 7) - 3) / 25; // +/- ~12%
  const salesAdj = 1 + ((storeHash % 5) - 2) / 25; // +/- 8%

  const dailyVisitors = buildSeries(ds, Math.max(10, Math.round((baseVisitors / days) * visitorsAdj)));
  const dailySales = buildSeries(ds, Math.max(1, Math.round((baseSales / days) * salesAdj)));
  const dailyRevenue = ds.map((date, idx) => {
    const sales = dailySales[idx].value;
    const aov = randomAround(seed.overview?.averageOrderValue || 45, 0.15);
    return { date, value: sales * aov };
  });

  const totals = {
    totalVisitors: dailyVisitors.reduce((s, d) => s + d.value, 0),
    totalSales: dailySales.reduce((s, d) => s + d.value, 0),
    averageOrderValue:
      Math.round(
        (dailyRevenue.reduce((s, d) => s + d.value, 0) / Math.max(1, dailySales.reduce((s, d) => s + d.value, 0))) * 100
      ) / 100,
  };
  const conversionRate = totals.totalVisitors ? Math.round((totals.totalSales / totals.totalVisitors) * 1000) / 10 : 0;

  return {
    storeId: storeId || null,
    overview: {
      totalVisitors: totals.totalVisitors,
      totalSales: totals.totalSales,
      conversionRate,
      averageOrderValue: totals.averageOrderValue,
      lastUpdated: new Date().toISOString(),
    },
    topProducts: seed.topProducts,
    trafficSources: seed.trafficSources,
    devices: seed.devices,
    geoDistribution: seed.geoDistribution,
    timeseries: {
      dailyVisitors,
      dailySales,
      dailyRevenue,
    },
  };
};