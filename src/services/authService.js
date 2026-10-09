import apiClient from './apiClient';

export const authService = {
  /**
   * Đăng nhập hệ thống (Áp dụng chung cho Khách hàng & Nhân viên)
   * @param {{ username: string, password: string }} credentials
   */
  login: async (credentials) => {
    return await apiClient.post('/auth/login', credentials);
  },

  /**
   * Đăng ký tài khoản khách hàng mới
   * @param {{ username: string, fullName: string, email: string, phoneNumber: string, password: string, birthDate?: string }} data
   */
  register: async (data) => {
    return await apiClient.post('/auth/register', data);
  },

  /**
   * Cấp lại Access Token mới qua cookie refreshToken
   */
  refreshToken: async () => {
    return await apiClient.post('/auth/refresh');
  },

  /**
   * Đăng xuất hệ thống (xóa cookie refreshToken trên server)
   */
  logout: async () => {
    return await apiClient.post('/auth/logout');
  },

  /**
   * Lấy thông tin cá nhân của tài khoản đang đăng nhập
   */
  getProfile: async () => {
    return await apiClient.get('/user/profile');
  }
};

export default authService;
