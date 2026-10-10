import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export const addressService = {
  /**
   * Lấy danh sách địa chỉ giao hàng của tôi (Customer)
   */
  getAddresses: async () => {
    return await apiClient.get(API_ENDPOINTS.ADDRESS.BASE);
  },

  /**
   * Thêm địa chỉ mới
   * @param {{ receiverName: string, phoneNumber: string, street: string, ward: string, city: string, isDefault?: boolean }} data
   */
  createAddress: async (data) => {
    return await apiClient.post(API_ENDPOINTS.ADDRESS.BASE, data);
  },

  /**
   * Cập nhật địa chỉ
   */
  updateAddress: async (id, data) => {
    return await apiClient.put(API_ENDPOINTS.ADDRESS.DETAIL(id), data);
  },

  /**
   * Đặt địa chỉ làm mặc định
   */
  setDefaultAddress: async (id) => {
    return await apiClient.patch(API_ENDPOINTS.ADDRESS.SET_DEFAULT(id));
  },

  /**
   * Xóa địa chỉ
   */
  deleteAddress: async (id) => {
    return await apiClient.delete(API_ENDPOINTS.ADDRESS.DETAIL(id));
  }
};

export default addressService;
