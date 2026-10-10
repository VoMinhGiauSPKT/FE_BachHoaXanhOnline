import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export const promotionService = {
  /**
   * Lấy danh sách mã khuyến mãi khả dụng theo giá trị đơn hàng
   * @param {number} totalAmount
   */
  getAvailablePromotions: async (totalAmount) => {
    return await apiClient.get(API_ENDPOINTS.PROMOTION.AVAILABLE, {
      params: { totalAmount }
    });
  },

  /**
   * Lấy danh sách khuyến mãi (Admin quản lý)
   * @param {{ keyword?: string, type?: string, page?: number, limit?: number }} params
   */
  getPromotions: async (params = {}) => {
    return await apiClient.get(API_ENDPOINTS.PROMOTION.BASE, { params });
  },

  /**
   * Tạo voucher khuyến mãi mới (Admin)
   */
  createPromotion: async (promoData) => {
    return await apiClient.post(API_ENDPOINTS.PROMOTION.BASE, promoData);
  },

  /**
   * Cập nhật voucher khuyến mãi (Admin)
   */
  updatePromotion: async (code, promoData) => {
    return await apiClient.put(API_ENDPOINTS.PROMOTION.DETAIL(code), promoData);
  },

  /**
   * Xóa voucher khuyến mãi (Admin)
   */
  deletePromotion: async (code) => {
    return await apiClient.delete(API_ENDPOINTS.PROMOTION.DETAIL(code));
  }
};

export default promotionService;
