import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export const reviewService = {
  /**
   * Lấy danh sách đánh giá của sản phẩm (Public)
   * @param {string} productId
   * @param {{ page?: number, limit?: number, rating?: number }} params
   */
  getProductReviews: async (productId, params = {}) => {
    return await apiClient.get(API_ENDPOINTS.REVIEW.BY_PRODUCT(productId), { params });
  },

  /**
   * Gửi đánh giá cho sản phẩm đã mua (Customer)
   * @param {{ productId: string, rating: number, comment: string }} reviewData
   */
  createReview: async (reviewData) => {
    return await apiClient.post(API_ENDPOINTS.REVIEW.BASE, reviewData);
  },

  /**
   * Cập nhật bài đánh giá chính chủ
   * @param {number|string} id
   * @param {{ rating: number, comment: string }} updateData
   */
  updateReview: async (id, updateData) => {
    return await apiClient.put(API_ENDPOINTS.REVIEW.DETAIL(id), updateData);
  },

  /**
   * Xóa bài đánh giá (Khách chính chủ hoặc Nhân viên kiểm duyệt)
   * @param {number|string} id
   */
  deleteReview: async (id) => {
    return await apiClient.delete(API_ENDPOINTS.REVIEW.DETAIL(id));
  },

  /**
   * Lấy lịch sử đánh giá của chính khách hàng đăng nhập
   * @param {{ page?: number, limit?: number, rating?: number }} params
   */
  getMyReviews: async (params = {}) => {
    return await apiClient.get(API_ENDPOINTS.REVIEW.MY_REVIEWS, { params });
  },

  /**
   * Lấy danh sách kiểm duyệt đánh giá (Staff & Admin)
   * @param {object} params
   */
  getAllReviewsForModeration: async (params = {}) => {
    return await apiClient.get(API_ENDPOINTS.REVIEW.BASE, { params });
  },

  /**
   * Phản hồi đánh giá của khách hàng (Staff & Admin)
   * @param {number|string} id
   * @param {string} replyText
   */
  replyReview: async (id, replyText) => {
    return await apiClient.post(`${API_ENDPOINTS.REVIEW.DETAIL(id)}/reply`, { reply: replyText });
  }
};

export default reviewService;
