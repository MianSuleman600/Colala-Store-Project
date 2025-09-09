// src/services/leaderboardService.js
import { apiRequest } from '../../api/apiClient.js';
import { ENDPOINTS } from '../../api/apiConfig.js';
import { USE_DUMMY_DATA } from '../../utils/config.js';
import { DUMMY_LEADERBOARD_SELLERS, DUMMY_LEADERBOARD_FAQS } from '../../utils/data/dummyLeaderboard.js';
import { normalizeLeaderboardSellers, normalizeLeaderboardFaqs } from '../../utils/dataNormalizer.js';

/* ---------------- Helpers ---------------- */
const takeList = (res) => (Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : []);
const toPeriod = (label) => {
  const l = String(label || '').toLowerCase();
  if (l.includes('today')) return 'today';
  if (l.includes('week')) return 'week';
  if (l.includes('month')) return 'month';
  return 'all';
};

/* ---------------- Dummy ---------------- */
const dummyLeaderboard = {
  getSellers: async ({ period = 'all' } = {}) => {
    // For realism, you might shuffle or slice by period
    const sellers = normalizeLeaderboardSellers(DUMMY_LEADERBOARD_SELLERS);
    // Sort desc by score
    sellers.sort((a, b) => b.score - a.score);
    return { success: true, sellers };
  },
  getFaqs: async () => {
    const faqs = normalizeLeaderboardFaqs(DUMMY_LEADERBOARD_FAQS);
    return { success: true, faqs };
  },
};

/* ---------------- API ---------------- */
const apiLeaderboard = {
  getSellers: async ({ period = 'all' } = {}) => {
    const params = { period: toPeriod(period) };
    const res = await apiRequest({ url: ENDPOINTS.LEADERBOARD.SELLERS(params), method: 'GET' });
    const sellers = normalizeLeaderboardSellers(takeList(res));
    sellers.sort((a, b) => b.score - a.score);
    return { success: true, sellers };
  },
  getFaqs: async () => {
    const res = await apiRequest({ url: ENDPOINTS.LEADERBOARD.FAQS, method: 'GET' });
    const faqs = normalizeLeaderboardFaqs(Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : []);
    return { success: true, faqs };
  },
};

export const leaderboardService = USE_DUMMY_DATA ? dummyLeaderboard : apiLeaderboard;