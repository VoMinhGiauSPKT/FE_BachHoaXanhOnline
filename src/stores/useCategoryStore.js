import { create } from 'zustand';
import categoryService from '../services/categoryService';
import { MOCK_CATEGORIES } from '../constants/mockData';

export const useCategoryStore = create((set, get) => ({
  categories: [],
  currentCategory: null,
  isLoading: false,
  error: null,

  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await categoryService.getCategories();
      const data = res.data;
      if (Array.isArray(data) && data.length > 0) {
        set({ categories: data, isLoading: false });
      } else if (data?.data && Array.isArray(data.data) && data.data.length > 0) {
        set({ categories: data.data, isLoading: false });
      } else {
        set({ categories: MOCK_CATEGORIES, isLoading: false });
      }
    } catch (err) {
      console.warn('API getCategories fallback:', err?.message);
      set({ categories: MOCK_CATEGORIES, error: err?.message, isLoading: false });
    }
  },

  createCategory: async (categoryData) => {
    set({ isLoading: true });
    try {
      const res = await categoryService.createCategory(categoryData);
      await get().fetchCategories();
      return { success: true, data: res.data };
    } catch (err) {
      set({ isLoading: false });
      return { success: false, error: err?.message };
    }
  },

  updateCategory: async (id, categoryData) => {
    set({ isLoading: true });
    try {
      const res = await categoryService.updateCategory(id, categoryData);
      await get().fetchCategories();
      return { success: true, data: res.data };
    } catch (err) {
      set({ isLoading: false });
      return { success: false, error: err?.message };
    }
  },

  deleteCategory: async (id) => {
    set({ isLoading: true });
    try {
      await categoryService.deleteCategory(id);
      await get().fetchCategories();
      return { success: true };
    } catch (err) {
      set({ isLoading: false });
      return { success: false, error: err?.message };
    }
  },

  refresh: () => get().fetchCategories()
}));

export default useCategoryStore;
