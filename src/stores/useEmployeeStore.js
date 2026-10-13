import { create } from 'zustand';
import employeeService from '../services/employeeService';

export const useEmployeeStore = create((set, get) => ({
  employees: [],
  currentEmployee: null,
  total: 0,
  page: 1,
  limit: 10,
  isLoading: false,
  error: null,
  filters: {
    keyword: '',
    position: '',
    status: ''
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      page: 1
    }));
    get().fetchEmployees();
  },

  setPage: (page) => {
    set({ page });
    get().fetchEmployees();
  },

  fetchEmployees: async (customParams = {}) => {
    set({ isLoading: true, error: null });
    const { page, limit, filters } = get();
    const params = {
      page,
      limit,
      keyword: filters.keyword || undefined,
      position: filters.position || undefined,
      status: filters.status !== '' ? filters.status : undefined,
      ...customParams
    };

    try {
      const res = await employeeService.getEmployees(params);
      const data = res.data;
      if (Array.isArray(data)) {
        set({ employees: data, total: data.length, isLoading: false });
      } else if (data?.items && Array.isArray(data.items)) {
        set({ employees: data.items, total: data.total || data.items.length, isLoading: false });
      } else if (data?.data && Array.isArray(data.data)) {
        set({ employees: data.data, total: data.total || data.data.length, isLoading: false });
      } else {
        set({ employees: [], total: 0, isLoading: false });
      }
    } catch (err) {
      set({ error: err?.message, isLoading: false });
    }
  },

  createEmployee: async (data) => {
    set({ isLoading: true });
    try {
      const res = await employeeService.createEmployee(data);
      await get().fetchEmployees();
      return { success: true, data: res.data };
    } catch (err) {
      set({ isLoading: false });
      return { success: false, error: err?.message };
    }
  },

  updateEmployee: async (id, data) => {
    set({ isLoading: true });
    try {
      const res = await employeeService.updateEmployee(id, data);
      await get().fetchEmployees();
      return { success: true, data: res.data };
    } catch (err) {
      set({ isLoading: false });
      return { success: false, error: err?.message };
    }
  },

  toggleStatus: async (id, status) => {
    set({ isLoading: true });
    try {
      await employeeService.toggleEmployeeStatus(id, status);
      await get().fetchEmployees();
      return { success: true };
    } catch (err) {
      set({ isLoading: false });
      return { success: false, error: err?.message };
    }
  },

  refresh: () => get().fetchEmployees()
}));

export default useEmployeeStore;
