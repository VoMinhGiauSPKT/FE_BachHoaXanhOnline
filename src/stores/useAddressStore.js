import { create } from 'zustand';
import addressService from '../services/addressService';

export const useAddressStore = create((set, get) => ({
  addresses: [],
  isLoading: false,
  error: null,

  fetchAddresses: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await addressService.getAddresses();
      const data = res.data;
      const list = Array.isArray(data) ? data : (data?.data || []);
      set({ addresses: list, isLoading: false });
      return list;
    } catch (err) {
      set({ error: err?.message, isLoading: false });
      return [];
    }
  },

  createAddress: async (data) => {
    set({ isLoading: true });
    try {
      const res = await addressService.createAddress(data);
      await get().fetchAddresses();
      return { success: true, data: res.data };
    } catch (err) {
      set({ isLoading: false });
      return { success: false, error: err?.message };
    }
  },

  updateAddress: async (id, data) => {
    set({ isLoading: true });
    try {
      const res = await addressService.updateAddress(id, data);
      await get().fetchAddresses();
      return { success: true, data: res.data };
    } catch (err) {
      set({ isLoading: false });
      return { success: false, error: err?.message };
    }
  },

  setDefaultAddress: async (id) => {
    set({ isLoading: true });
    try {
      await addressService.setDefaultAddress(id);
      await get().fetchAddresses();
      return { success: true };
    } catch (err) {
      set({ isLoading: false });
      return { success: false, error: err?.message };
    }
  },

  deleteAddress: async (id) => {
    set({ isLoading: true });
    try {
      await addressService.deleteAddress(id);
      await get().fetchAddresses();
      return { success: true };
    } catch (err) {
      set({ isLoading: false });
      return { success: false, error: err?.message };
    }
  },

  refresh: () => get().fetchAddresses()
}));

export default useAddressStore;
