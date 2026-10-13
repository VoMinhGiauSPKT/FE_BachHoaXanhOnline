import { create } from 'zustand';
import promotionService from '../services/promotionService';

export const usePromotionStore = create((set, get) => ({
  promotions: [],
  availablePromotions: [],
  isLoading: false,
  error: null,

  fetchPromotions: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const res = await promotionService.getPromotions(params);
      const data = res?.data || res;
      const list = Array.isArray(data) ? data : (data?.promotions || data?.items || data?.data || []);
      set({ promotions: list, isLoading: false });
    } catch (err) {
      set({ error: err?.message, isLoading: false });
    }
  },

  fetchAvailablePromotions: async (totalAmount) => {
    try {
      const res = await promotionService.getAvailablePromotions(totalAmount);
      const data = res.data;
      const list = Array.isArray(data) ? data : (data?.data || []);
      set({ availablePromotions: list });
      return list;
    } catch (err) {
      console.warn('Get available promotions failed:', err?.message);
      return [];
    }
  },

  createPromotion: async (promoData) => {
    set({ isLoading: true });
    try {
      const res = await promotionService.createPromotion(promoData);
      await get().fetchPromotions();
      return { success: true, data: res.data };
    } catch (err) {
      set({ isLoading: false });
      return { success: false, error: err?.message };
    }
  },

  updatePromotion: async (code, promoData) => {
    set({ isLoading: true });
    try {
      const res = await promotionService.updatePromotion(code, promoData);
      await get().fetchPromotions();
      return { success: true, data: res.data };
    } catch (err) {
      set({ isLoading: false });
      return { success: false, error: err?.message };
    }
  },

  deletePromotion: async (code) => {
    set({ isLoading: true });
    try {
      await promotionService.deletePromotion(code);
      await get().fetchPromotions();
      return { success: true };
    } catch (err) {
      set({ isLoading: false });
      return { success: false, error: err?.message };
    }
  },

  refresh: () => get().fetchPromotions()
}));

export default usePromotionStore;
