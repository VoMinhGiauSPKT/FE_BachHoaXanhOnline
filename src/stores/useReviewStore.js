import { create } from 'zustand';
import reviewService from '../services/reviewService';

export const useReviewStore = create((set, get) => ({
  reviews: [],
  myReviews: [],
  moderationReviews: [],
  total: 0,
  isLoading: false,
  error: null,

  fetchProductReviews: async (productId, params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const res = await reviewService.getProductReviews(productId, params);
      const data = res?.data || res;
      const list = Array.isArray(data) ? data : (data?.reviews || data?.data || data?.items || []);
      set({ reviews: list, isLoading: false });
      return list;
    } catch (err) {
      set({ error: err?.message, isLoading: false });
      return [];
    }
  },

  fetchMyReviews: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const res = await reviewService.getMyReviews(params);
      const data = res?.data || res;
      const list = Array.isArray(data) ? data : (data?.reviews || data?.data || data?.items || []);
      set({ myReviews: list, isLoading: false });
      return list;
    } catch (err) {
      set({ error: err?.message, isLoading: false });
      return [];
    }
  },

  fetchModerationReviews: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const res = await reviewService.getAllReviewsForModeration(params);
      const data = res?.data || res;
      const list = Array.isArray(data) ? data : (data?.reviews || data?.data || data?.items || []);
      set({ moderationReviews: list, total: list.length, isLoading: false });
    } catch (err) {
      set({ error: err?.message, isLoading: false });
    }
  },

  createReview: async (reviewData) => {
    set({ isLoading: true });
    try {
      const res = await reviewService.createReview(reviewData);
      set({ isLoading: false });
      return { success: true, data: res.data };
    } catch (err) {
      set({ isLoading: false });
      return { success: false, error: err?.message };
    }
  },

  updateReview: async (id, updateData) => {
    set({ isLoading: true });
    try {
      const res = await reviewService.updateReview(id, updateData);
      set({ isLoading: false });
      return { success: true, data: res.data };
    } catch (err) {
      set({ isLoading: false });
      return { success: false, error: err?.message };
    }
  },

  deleteReview: async (id) => {
    set({ isLoading: true });
    try {
      await reviewService.deleteReview(id);
      await get().fetchModerationReviews();
      return { success: true };
    } catch (err) {
      set({ isLoading: false });
      return { success: false, error: err?.message };
    }
  },

  replyReview: async (id, replyText) => {
    set({ isLoading: true });
    try {
      const res = await reviewService.replyReview(id, replyText);
      await get().fetchModerationReviews();
      return { success: true, data: res.data };
    } catch (err) {
      set({ isLoading: false });
      return { success: false, error: err?.message };
    }
  },

  refresh: () => get().fetchModerationReviews()
}));

export default useReviewStore;
