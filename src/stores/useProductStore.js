import { create } from 'zustand';
import productService from '../services/productService';
import { MOCK_PRODUCTS } from '../constants/mockData';

export const useProductStore = create((set, get) => ({
  products: [],
  currentProduct: null,
  total: 0,
  page: 1,
  limit: 12,
  isLoading: false,
  error: null,
  filters: {
    keyword: '',
    categoryId: null,
    sortBy: 'default',
    inStock: false
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      page: 1
    }));
    get().fetchProducts();
  },

  setPage: (page) => {
    set({ page });
    get().fetchProducts();
  },

  fetchProducts: async (customParams = {}) => {
    set({ isLoading: true, error: null });
    const { page, limit, filters } = get();
    const params = {
      page,
      limit,
      keyword: filters.keyword || undefined,
      categoryId: filters.categoryId || undefined,
      sortBy: ['price_asc', 'price_desc', 'newest'].includes(filters.sortBy) ? filters.sortBy : undefined,
      inStock: filters.inStock ? true : undefined,
      ...customParams
    };

    try {
      const res = await productService.getProducts(params);
      const data = res.data;
      if (Array.isArray(data)) {
        set({ products: data, total: data.length, isLoading: false });
      } else if (data && Array.isArray(data.items)) {
        set({ products: data.items, total: data.total || data.items.length, isLoading: false });
      } else if (data && Array.isArray(data.data)) {
        set({ products: data.data, total: data.total || data.data.length, isLoading: false });
      } else {
        set({ products: MOCK_PRODUCTS || [], total: (MOCK_PRODUCTS || []).length, isLoading: false });
      }
    } catch (err) {
      console.warn('API getProducts fallback:', err?.message);
      set({
        products: MOCK_PRODUCTS || [],
        total: (MOCK_PRODUCTS || []).length,
        error: err?.message,
        isLoading: false
      });
    }
  },

  fetchProductById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const res = await productService.getProductById(id);
      const product = res.data?.data || res.data;
      set({ currentProduct: product, isLoading: false });
      return product;
    } catch (err) {
      const fallback = (MOCK_PRODUCTS || []).find((p) => p.productId === id || p.id === id) || null;
      set({ currentProduct: fallback, error: err?.message, isLoading: false });
      return fallback;
    }
  },

  createProduct: async (productData) => {
    set({ isLoading: true });
    try {
      const res = await productService.createProduct(productData);
      await get().fetchProducts();
      return { success: true, data: res.data };
    } catch (err) {
      set({ isLoading: false });
      return { success: false, error: err?.message };
    }
  },

  updateProduct: async (id, productData) => {
    set({ isLoading: true });
    try {
      const res = await productService.updateProduct(id, productData);
      await get().fetchProducts();
      return { success: true, data: res.data };
    } catch (err) {
      set({ isLoading: false });
      return { success: false, error: err?.message };
    }
  },

  deleteProduct: async (id) => {
    set({ isLoading: true });
    try {
      await productService.deleteProduct(id);
      await get().fetchProducts();
      return { success: true };
    } catch (err) {
      set({ isLoading: false });
      return { success: false, error: err?.message };
    }
  },

  refresh: () => get().fetchProducts()
}));

export default useProductStore;
