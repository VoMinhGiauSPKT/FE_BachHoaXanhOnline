import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export const cartService = {
  /**
   * Lấy dữ liệu giỏ hàng hiện tại của khách hàng
   */
  getCart: async () => {
    return await apiClient.get(API_ENDPOINTS.CART.BASE);
  },

  /**
   * Thêm món vào giỏ hàng
   * @param {{ productId: string, quantity: number }} itemData
   */
  addItem: async ({ productId, quantity = 1 }) => {
    return await apiClient.post(API_ENDPOINTS.CART.ITEMS, { productId, quantity });
  },

  /**
   * Cập nhật số lượng của dòng sản phẩm trong giỏ
   * @param {number|string} lineItemId
   * @param {number} quantity
   */
  updateItemQuantity: async (lineItemId, quantity) => {
    return await apiClient.put(API_ENDPOINTS.CART.UPDATE_ITEM(lineItemId), { quantity });
  },

  /**
   * Xóa một mặt hàng khỏi giỏ
   * @param {number|string} lineItemId
   */
  removeItem: async (lineItemId) => {
    return await apiClient.delete(API_ENDPOINTS.CART.DELETE_ITEM(lineItemId));
  },

  /**
   * Xóa toàn bộ giỏ hàng
   */
  clearCart: async () => {
    return await apiClient.delete(API_ENDPOINTS.CART.CLEAR);
  }
};

export default cartService;
