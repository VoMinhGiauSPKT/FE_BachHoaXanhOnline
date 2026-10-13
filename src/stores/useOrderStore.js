import { create } from 'zustand';
import orderService from '../services/orderService';

export const useOrderStore = create((set, get) => ({
  orders: [],
  selectedOrder: null,
  total: 0,
  page: 1,
  limit: 10,
  isLoading: false,
  error: null,
  filters: {
    status: '',
    keyword: ''
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      page: 1
    }));
    get().fetchOrders();
  },

  setPage: (page) => {
    set({ page });
    get().fetchOrders();
  },

  setSelectedOrder: (order) => set({ selectedOrder: order }),

  fetchOrders: async (customParams = {}) => {
    set({ isLoading: true, error: null });
    const { page, limit, filters } = get();
    const params = {
      page,
      limit,
      status: filters.status || undefined,
      keyword: filters.keyword || undefined,
      ...customParams
    };

    try {
      const res = await orderService.getOrders(params);
      const data = res.data;
      if (Array.isArray(data)) {
        set({ orders: data, total: data.length, isLoading: false });
      } else if (data?.items && Array.isArray(data.items)) {
        set({ orders: data.items, total: data.total || data.items.length, isLoading: false });
      } else if (data?.data && Array.isArray(data.data)) {
        set({ orders: data.data, total: data.total || data.data.length, isLoading: false });
      } else {
        set({ orders: [], total: 0, isLoading: false });
      }
    } catch (err) {
      set({ error: err?.message, isLoading: false });
    }
  },

  fetchOrderById: async (id) => {
    try {
      const res = await orderService.getOrderById(id);
      const order = res?.data?.data || res?.data || res;
      set({ selectedOrder: order });
      return order;
    } catch (err) {
      console.error('Lỗi khi tải chi tiết đơn hàng:', err);
      return null;
    }
  },

  createOrder: async (orderData) => {
    set({ isLoading: true });
    try {
      const res = await orderService.createOrder(orderData);
      set({ isLoading: false });
      return { success: true, data: res.data };
    } catch (err) {
      set({ isLoading: false });
      return { success: false, error: err?.response?.data?.message || err?.message };
    }
  },

  confirmCod: async (id) => {
    set({ isLoading: true });
    try {
      const res = await orderService.confirmCod(id);
      await get().fetchOrders();
      return { success: true, data: res.data };
    } catch (err) {
      set({ isLoading: false });
      return { success: false, error: err?.message };
    }
  },

  cancelOrder: async (id) => {
    set({ isLoading: true });
    try {
      const res = await orderService.cancelOrder(id);
      await get().fetchOrders();
      return { success: true, data: res.data };
    } catch (err) {
      set({ isLoading: false });
      return { success: false, error: err?.message };
    }
  },

  changePaymentMethod: async (id, paymentMethod) => {
    set({ isLoading: true });
    try {
      const res = await orderService.changePaymentMethod(id, paymentMethod);
      await get().fetchOrders();
      return { success: true, data: res.data };
    } catch (err) {
      set({ isLoading: false });
      return { success: false, error: err?.message };
    }
  },

  createPayment: async (orderId) => {
    try {
      const res = await orderService.createPayment(orderId);
      return { success: true, data: res.data };
    } catch (err) {
      return { success: false, error: err?.message };
    }
  },

  refresh: () => get().fetchOrders()
}));

export default useOrderStore;
