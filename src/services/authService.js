import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export const authService = {
  /**
   * Đăng nhập hệ thống (Áp dụng chung cho Khách hàng & Nhân viên)
   * @param {{ username: string, password: string }} credentials
   */
  login: async (credentials) => {
    return await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
  },

  /**
   * Đăng ký tài khoản khách hàng mới
   * @param {{ username: string, fullName: string, email: string, phoneNumber: string, password: string, birthDate?: string }} data
   */
  register: async (data) => {
    return await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, data);
  },

  /**
   * Cấp lại Access Token mới qua cookie refreshToken
   */
  refreshToken: async () => {
    return await apiClient.post(API_ENDPOINTS.AUTH.REFRESH);
  },

  /**
   * Đăng xuất hệ thống (xóa cookie refreshToken trên server)
   */
  logout: async () => {
    return await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
  },

  /**
   * Lấy thông tin cá nhân của tài khoản đang đăng nhập
   */
  getProfile: async () => {
    return await apiClient.get(API_ENDPOINTS.USER.PROFILE);
  },

  /**
   * Đổi mật khẩu tài khoản cá nhân
   * @param {{ currentPassword: string, newPassword: string, confirmPassword: string }} data
   */
  changePassword: async (data) => {
    return await apiClient.put(API_ENDPOINTS.USER.CHANGE_PASSWORD, data);
  }
};

export default authService;
