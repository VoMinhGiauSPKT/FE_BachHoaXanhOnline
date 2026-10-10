import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export const categoryService = {
  /**
   * Lấy danh sách toàn bộ danh mục sản phẩm (Public)
   */
  getCategories: async () => {
    return await apiClient.get(API_ENDPOINTS.CATEGORY.BASE);
  },

  /**
   * Xem chi tiết danh mục theo mã
   */
  getCategoryById: async (id) => {
    return await apiClient.get(API_ENDPOINTS.CATEGORY.DETAIL(id));
  },

  /**
   * Tạo danh mục mới (Staff / Admin)
   */
  createCategory: async (categoryData) => {
    return await apiClient.post(API_ENDPOINTS.CATEGORY.BASE, categoryData);
  },

  /**
   * Cập nhật danh mục (Staff / Admin)
   */
  updateCategory: async (id, categoryData) => {
    return await apiClient.put(API_ENDPOINTS.CATEGORY.DETAIL(id), categoryData);
  },

  /**
   * Xóa danh mục (Admin only)
   */
  deleteCategory: async (id) => {
    return await apiClient.delete(API_ENDPOINTS.CATEGORY.DETAIL(id));
  }
};

export default categoryService;
