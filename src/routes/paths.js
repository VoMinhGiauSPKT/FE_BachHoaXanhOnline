/**
 * Danh sách hằng số các đường dẫn URL (Routing Paths) của hệ thống Bách Hóa Xanh Online
 */
export const PATHS = {
  // 1. Phân hệ Khách hàng (Customer Web)
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  CART: '/cart',
  ORDERS: '/orders',
  PROFILE: '/profile',

  // 2. Phân hệ Quản trị (Admin & Employee Dashboard)
  ADMIN: {
    DASHBOARD: '/admin',
    PRODUCTS: '/admin/products',
    CATEGORIES: '/admin/categories',
    ORDERS: '/admin/orders',
    EMPLOYEES: '/admin/employees'
  }
};

export default PATHS;
