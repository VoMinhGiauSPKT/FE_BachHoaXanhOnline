import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export const productService = {
  /**
   * Lấy danh sách sản phẩm có phân trang, tìm kiếm, lọc
   * @param {{ page?: number, limit?: number, keyword?: string, categoryId?: string, sortBy?: string, inStock?: boolean }} params
   */
  getProducts: async (params = {}) => {
    return await apiClient.get(API_ENDPOINTS.PRODUCT.BASE, { params });
  },

  /**
   * Chi tiết sản phẩm theo mã SP
   * @param {string} id
   */
  getProductById: async (id) => {
    return await apiClient.get(API_ENDPOINTS.PRODUCT.DETAIL(id));
  },

  /**
   * Thêm sản phẩm mới (Staff / Admin)
   */
  createProduct: async (productData) => {
    return await apiClient.post(API_ENDPOINTS.PRODUCT.BASE, productData);
  },

  /**
   * Cập nhật thông tin sản phẩm (Staff / Admin)
   */
  updateProduct: async (id, productData) => {
    return await apiClient.put(API_ENDPOINTS.PRODUCT.DETAIL(id), productData);
  },

  /**
   * Xóa sản phẩm (Soft delete) (Staff / Admin)
   */
  deleteProduct: async (id) => {
    return await apiClient.delete(API_ENDPOINTS.PRODUCT.DETAIL(id));
  }
};

export default productService;
