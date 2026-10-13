import { create } from 'zustand';
import supplierService from '../services/supplierService';

export const useSupplierStore = create((set, get) => ({
  suppliers: [],
  currentSupplier: null,
  isLoading: false,
  error: null,

  fetchSuppliers: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const res = await supplierService.getSuppliers(params);
      const data = res.data;
      const list = Array.isArray(data) ? data : (data?.data || data?.items || []);
      set({ suppliers: list, isLoading: false });
    } catch (err) {
      set({ error: err?.message, isLoading: false });
    }
  },

  createSupplier: async (data) => {
    set({ isLoading: true });
    try {
      const res = await supplierService.createSupplier(data);
      await get().fetchSuppliers();
      return { success: true, data: res.data };
    } catch (err) {
      set({ isLoading: false });
      return { success: false, error: err?.message };
    }
  },

  updateSupplier: async (id, data) => {
    set({ isLoading: true });
    try {
      const res = await supplierService.updateSupplier(id, data);
      await get().fetchSuppliers();
      return { success: true, data: res.data };
    } catch (err) {
      set({ isLoading: false });
      return { success: false, error: err?.message };
    }
  },

  deleteSupplier: async (id) => {
    set({ isLoading: true });
    try {
      await supplierService.deleteSupplier(id);
      await get().fetchSuppliers();
      return { success: true };
    } catch (err) {
      set({ isLoading: false });
      return { success: false, error: err?.message };
    }
  },

  refresh: () => get().fetchSuppliers()
}));

export default useSupplierStore;
