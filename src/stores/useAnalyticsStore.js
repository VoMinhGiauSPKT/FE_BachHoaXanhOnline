import { create } from 'zustand';
import analyticsService from '../services/analyticsService';

export const useAnalyticsStore = create((set, get) => ({
  overview: null,
  chartData: [],
  inventoryAlerts: [],
  topProducts: [],
  period: 'week',
  isLoading: false,
  error: null,

  setPeriod: (period) => {
    set({ period });
    get().fetchOverview(period);
    get().fetchChartData({ period });
  },

  fetchOverview: async (period = 'week') => {
    try {
      const res = await analyticsService.getOverview({ period });
      set({ overview: res.data?.data || res.data });
    } catch (err) {
      set({ error: err?.message });
    }
  },

  fetchChartData: async (params = {}) => {
    try {
      const res = await analyticsService.getChartData(params);
      set({ chartData: res.data?.data || res.data || [] });
    } catch (err) {
      set({ error: err?.message });
    }
  },

  fetchInventoryAlerts: async () => {
    try {
      const res = await analyticsService.getInventoryAlerts();
      set({ inventoryAlerts: res.data?.data || res.data || [] });
    } catch (err) {
      set({ error: err?.message });
    }
  },

  fetchTopProducts: async (limit = 5, period = 'week') => {
    try {
      const res = await analyticsService.getTopProducts(limit, period);
      set({ topProducts: res.data?.data || res.data || [] });
    } catch (err) {
      set({ error: err?.message });
    }
  },

  fetchAll: async (period = 'week') => {
    set({ isLoading: true, error: null, period });
    await Promise.allSettled([
      get().fetchOverview(period),
      get().fetchChartData({ period }),
      get().fetchInventoryAlerts(),
      get().fetchTopProducts(5, period)
    ]);
    set({ isLoading: false });
  },

  refresh: () => get().fetchAll(get().period)
}));

export default useAnalyticsStore;
