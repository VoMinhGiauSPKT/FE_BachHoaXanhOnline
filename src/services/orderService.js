import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export const orderService = {
  /**
   * Đặt hàng từ giỏ hàng hiện tại (Checkout)
   * @param {{ tenNguoiNhan: string, soDienThoaiNhan: string, diaChiGiaoHang: string, ghiChu?: string, maKhuyenMai?: string }} orderData
   */
  createOrder: async (orderData) => {
    return await apiClient.post(API_ENDPOINTS.ORDER.BASE, orderData);
  },

  /**
   * Lấy danh sách đơn hàng (Khách: đơn của mình; NV/Admin: tất cả đơn)
   * @param {{ page?: number, limit?: number }} params
   */
  getOrders: async (params = {}) => {
    return await apiClient.get(API_ENDPOINTS.ORDER.BASE, { params });
  },

  /**
   * Xem chi tiết hóa đơn theo mã đơn
   * @param {string} id
   */
  getOrderById: async (id) => {
    return await apiClient.get(API_ENDPOINTS.ORDER.DETAIL(id));
  },

  /**
   * Nhân viên / Admin xác nhận thu tiền COD
   * @param {string} id
   */
  confirmCod: async (id) => {
    return await apiClient.patch(API_ENDPOINTS.ORDER.CONFIRM_COD(id));
  },

  /**
   * Nhân viên / Admin hủy hóa đơn chưa thanh toán (hoàn lại kho và voucher)
   * @param {string} id
   */
  cancelOrder: async (id) => {
    return await apiClient.patch(API_ENDPOINTS.ORDER.CANCEL(id));
  },

  /**
   * Đổi phương thức thanh toán cho đơn hàng chưa thanh toán (COD hoặc VIETQR)
   * @param {string} id
   * @param {string} paymentMethod
   */
  changePaymentMethod: async (id, paymentMethod) => {
    return await apiClient.patch(API_ENDPOINTS.ORDER.CHANGE_PAYMENT(id), { paymentMethod });
  },

  /**
   * Tạo giao dịch thanh toán trực tuyến Dynamic VietQR (PayOS)
   * @param {string} orderId
   */
  createPayment: async (orderId) => {
    return await apiClient.post(API_ENDPOINTS.PAYMENT.CREATE(orderId));
  }
};

export default orderService;
