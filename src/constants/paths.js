/**
 * Hằng số định tuyến URL (Routing Paths) cho hệ thống Bách Hóa Xanh Online (FreshMart)
 */
export const PATHS = {
  // 1. Phân hệ Khách hàng mua sắm (Customer Web)
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PRODUCT_DETAIL: '/product/:id',
  CART: '/cart',
  CHECKOUT: '/checkout',
  PAYMENT_SUCCESS: '/payment-success',
  ORDERS: '/orders',
  ORDER_DETAIL: '/orders/:id',
  PROFILE: '/profile',
  ADDRESSES: '/profile/addresses',
  REVIEWS: '/profile/reviews',

  // 2. Phân hệ Quản trị (Admin & Employee Dashboard)
  ADMIN: {
    DASHBOARD: '/admin',
    PRODUCTS: '/admin/products',
    CATEGORIES: '/admin/categories',
    ORDERS: '/admin/orders',
    PROMOTIONS: '/admin/promotions',
    EMPLOYEES: '/admin/employees',
    REVIEWS: '/admin/reviews'
  }
};

export default PATHS;
