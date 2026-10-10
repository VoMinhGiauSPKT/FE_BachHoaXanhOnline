import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export const employeeService = {
  /**
   * Lấy danh sách nhân viên có phân trang, tìm kiếm, lọc chức vụ (Admin only)
   * @param {{ page?: number, limit?: number, keyword?: string, position?: string, status?: boolean }} params
   */
  getEmployees: async (params = {}) => {
    return await apiClient.get(API_ENDPOINTS.EMPLOYEE.BASE, { params });
  },

  /**
   * Xem chi tiết nhân viên
   * @param {string} id
   */
  getEmployeeById: async (id) => {
    return await apiClient.get(API_ENDPOINTS.EMPLOYEE.DETAIL(id));
  },

  /**
   * Tạo tài khoản nhân viên mới (Admin only)
   * @param {{ fullName: string, username: string, password: string, phoneNumber: string, position: 'STAFF'|'ADMIN' }} data
   */
  createEmployee: async (data) => {
    return await apiClient.post(API_ENDPOINTS.EMPLOYEE.BASE, data);
  },

  /**
   * Cập nhật thông tin nhân viên / Đặt lại mật khẩu (Admin only)
   * @param {string} id
   * @param {object} data
   */
  updateEmployee: async (id, data) => {
    return await apiClient.put(API_ENDPOINTS.EMPLOYEE.DETAIL(id), data);
  },

  /**
   * Khóa hoặc mở khóa tài khoản nhân viên (Admin only)
   * @param {string} id
   * @param {boolean} status true: hoạt động, false: khóa
   */
  toggleEmployeeStatus: async (id, status) => {
    return await apiClient.patch(API_ENDPOINTS.EMPLOYEE.DETAIL(id), { status });
  }
};

export default employeeService;
