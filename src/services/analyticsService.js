import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export const analyticsService = {
  /**
   * Lấy tổng quan các chỉ số KPI báo cáo tài chính & kho
   * @param {{ period?: 'today' | 'week' | 'month' | 'year' }} params
   * @returns {Promise<any>}
   */
  getOverview: async (params = {}) => {
    return await apiClient.get(API_ENDPOINTS.ANALYTICS.OVERVIEW, { params });
  },

  /**
   * Lấy dữ liệu biểu đồ phân tích theo kỳ (ngày, tháng, năm)
   * @param {{ period?: 'today' | 'week' | 'month' | 'year', days?: number }} params
   * @returns {Promise<any>}
   */
  getChartData: async (params = {}) => {
    return await apiClient.get(API_ENDPOINTS.ANALYTICS.CHART, { params });
  },

  /**
   * Lấy danh sách sản phẩm cảnh báo tồn kho thấp và sắp hết hạn sử dụng
   * @returns {Promise<any>}
   */
  getInventoryAlerts: async () => {
    return await apiClient.get(API_ENDPOINTS.ANALYTICS.INVENTORY_ALERTS);
  },

  /**
   * Lấy danh sách Top sản phẩm bán chạy nhất / đóng góp doanh thu
   * @param {number} limit
   * @param {string} period
   * @returns {Promise<any>}
   */
  getTopProducts: async (limit = 5, period = 'week') => {
    return await apiClient.get(API_ENDPOINTS.ANALYTICS.TOP_PRODUCTS, { params: { limit, period } });
  }
};

export default analyticsService;
