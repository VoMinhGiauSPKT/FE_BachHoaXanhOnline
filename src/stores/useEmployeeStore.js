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
      const data = res?.data || res;
      let employeeList = [];
      let totalCount = 0;

      if (data?.employees && Array.isArray(data.employees)) {
        employeeList = data.employees;
        totalCount = data.total ?? data.employees.length;
      } else if (data?.items && Array.isArray(data.items)) {
        employeeList = data.items;
        totalCount = data.total ?? data.items.length;
      } else if (Array.isArray(data)) {
        employeeList = data;
        totalCount = data.length;
      } else if (data?.data && Array.isArray(data.data)) {
        employeeList = data.data;
        totalCount = data.total ?? data.data.length;
      }

      set({
        employees: employeeList,
        total: totalCount,
        isLoading: false
      });
    } catch (err) {
      set({ employees: [], total: 0, error: err?.message, isLoading: false });
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
