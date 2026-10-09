/**
 * Danh sách hằng số các Endpoint API của hệ thống Bách Hóa Xanh Online
 * (Tham chiếu theo tài liệu API_DOCUMENTATION.md)
 */

export const API_ENDPOINTS = {
  // 1. Xác thực (Authentication)
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout'
  },

  // 2. Người dùng & Cá nhân (User Profile)
  USER: {
    PROFILE: '/user/profile',
    CHANGE_PASSWORD: '/user/change-password'
  },

  // 3. Sổ địa chỉ giao hàng (Address)
  ADDRESS: {
    BASE: '/address',
    DETAIL: (id) => `/address/${id}`,
    SET_DEFAULT: (id) => `/address/${id}/default`
  },

  // 4. Danh mục sản phẩm (Category)
  CATEGORY: {
    BASE: '/category',
    DETAIL: (id) => `/category/${id}`
  },

  // 5. Sản phẩm (Product)
  PRODUCT: {
    BASE: '/product',
    DETAIL: (id) => `/product/${id}`
  },

  // 6. Giỏ hàng (Cart)
  CART: {
    BASE: '/cart',
    ITEMS: '/cart/items',
    UPDATE_ITEM: (lineItemId) => `/cart/items/${lineItemId}`,
    DELETE_ITEM: (lineItemId) => `/cart/items/${lineItemId}`,
    CLEAR: '/cart/clear'
  },

  // 7. Đơn hàng (Order)
  ORDER: {
    BASE: '/order',
    DETAIL: (id) => `/order/${id}`,
    CONFIRM_COD: (id) => `/order/${id}/confirm-cod`
  },

  // 8. Khuyến mãi (Promotion)
  PROMOTION: {
    BASE: '/promotion',
    AVAILABLE: '/promotion/available',
    DETAIL: (code) => `/promotion/${code}`
  },

  // 9. Đánh giá sản phẩm (Review)
  REVIEW: {
    BASE: '/review',
    BY_PRODUCT: (productId) => `/review/product/${productId}`,
    MY_REVIEWS: '/review/me',
    DETAIL: (id) => `/review/${id}`
  },

  // 10. Quản lý nhân viên - Admin (Employee)
  EMPLOYEE: {
    BASE: '/employee',
    DETAIL: (id) => `/employee/${id}`
  }
};

export default API_ENDPOINTS;
