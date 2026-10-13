import { create } from 'zustand';
import productService from '../services/productService';

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
    inStock: null
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

    let inStockParam = undefined;
    if (filters.inStock === true || filters.inStock === 'in_stock') {
      inStockParam = true;
    } else if (filters.inStock === false || filters.inStock === 'out_of_stock') {
      inStockParam = false;
    }

    const params = {
      page,
      limit,
      keyword: filters.keyword || undefined,
      categoryId: filters.categoryId || undefined,
      sortBy: ['price_asc', 'price_desc', 'newest'].includes(filters.sortBy) ? filters.sortBy : undefined,
      inStock: inStockParam,
      ...customParams
    };

    try {
      const res = await productService.getProducts(params);
      const data = res?.data || res;
      let productList = [];
      let totalCount = 0;

      if (data?.products && Array.isArray(data.products)) {
        productList = data.products;
        totalCount = data.total ?? data.products.length;
      } else if (data?.items && Array.isArray(data.items)) {
        productList = data.items;
        totalCount = data.total ?? data.items.length;
      } else if (Array.isArray(data)) {
        productList = data;
        totalCount = data.length;
      } else if (data?.data && Array.isArray(data.data)) {
        productList = data.data;
        totalCount = data.total ?? data.data.length;
      }

      set({
        products: productList,
        total: totalCount,
        isLoading: false
      });
    } catch (err) {
      console.error('Lỗi khi tải danh sách sản phẩm từ API:', err);
      set({
        products: [],
        total: 0,
        error: err?.message || 'Không thể tải danh sách sản phẩm',
        isLoading: false
      });
    }
  },

  fetchProductById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const res = await productService.getProductById(id);
      const product = res?.data?.data || res?.data || res;
      set({ currentProduct: product, isLoading: false });
      return product;
    } catch (err) {
      console.error('Lỗi khi tải chi tiết sản phẩm từ API:', err);
      set({ currentProduct: null, error: err?.message, isLoading: false });
      return null;
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
