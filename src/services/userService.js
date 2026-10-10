import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export const userService = {
  /**
   * Lấy thông tin cá nhân của người dùng đang đăng nhập
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

export default userService;
