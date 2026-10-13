import { create } from 'zustand';
import categoryService from '../services/categoryService';

export const useCategoryStore = create((set, get) => ({
  categories: [],
  currentCategory: null,
  isLoading: false,
  error: null,

  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await categoryService.getCategories();
      const data = res?.data || res;
      let categoryList = [];

      if (Array.isArray(data)) {
        categoryList = data;
      } else if (data?.categories && Array.isArray(data.categories)) {
        categoryList = data.categories;
      } else if (data?.data && Array.isArray(data.data)) {
        categoryList = data.data;
      }

      set({ categories: categoryList, isLoading: false });
    } catch (err) {
      console.error('Lỗi khi tải danh mục sản phẩm từ API:', err);
      set({ categories: [], error: err?.message, isLoading: false });
    }
  },

  fetchCategoryById: async (id) => {
    try {
      const res = await categoryService.getCategoryById(id);
      const cat = res?.data?.data || res?.data || res;
      set({ currentCategory: cat });
      return cat;
    } catch (err) {
      console.error('Lỗi khi tải chi tiết danh mục:', err);
      return null;
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
