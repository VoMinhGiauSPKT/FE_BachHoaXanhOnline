import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export const supplierService = {
  /**
   * Lấy danh sách toàn bộ nhà cung cấp
   * @param {{ activeOnly?: boolean }} params
   */
  getSuppliers: async (params = {}) => {
    return await apiClient.get(API_ENDPOINTS.SUPPLIER.BASE, { params });
  },

  /**
   * Xem chi tiết nhà cung cấp theo mã
   */
  getSupplierById: async (id) => {
    return await apiClient.get(API_ENDPOINTS.SUPPLIER.DETAIL(id));
  },

  /**
   * Tạo nhà cung cấp mới (Staff / Admin)
   * @param {{ supplierId?: string, supplierName: string, email?: string, phoneNumber?: string, active?: boolean }} data
   */
  createSupplier: async (data) => {
    return await apiClient.post(API_ENDPOINTS.SUPPLIER.BASE, data);
  },

  /**
   * Cập nhật nhà cung cấp (Staff / Admin)
   */
  updateSupplier: async (id, data) => {
    return await apiClient.put(API_ENDPOINTS.SUPPLIER.DETAIL(id), data);
  },

  /**
   * Xóa nhà cung cấp (Staff / Admin)
   */
  deleteSupplier: async (id) => {
    return await apiClient.delete(API_ENDPOINTS.SUPPLIER.DETAIL(id));
  }
};

export default supplierService;
