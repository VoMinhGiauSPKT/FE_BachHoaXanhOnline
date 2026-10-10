/**
 * Mock data nội bộ cho phân hệ Quản trị (Admin / Employee)
 * Đồng bộ với PostgreSQL enum_donvitinh:
 * 'LON', 'CHAI', 'LOC4', 'LOC6', 'THUNG24', 'THUNG30', 'THUNG48', 'GOI', 'CAI', 'BAO', 'KG'
 */

export const INITIAL_ADMIN_PRODUCTS = [
  {
    productId: 'SP000001',
    productName: 'Sữa tươi tiệt trùng Vinamilk Có đường 1L',
    categoryName: 'Đồ uống & Sữa',
    price: 37500,
    unit: 'LON',
    stock: 120,
    status: 'ACTIVE'
  },
  {
    productId: 'SP000002',
    productName: 'Gạo ST25 Ông Cua Túi 5kg',
    categoryName: 'Lương thực & Gạo',
    price: 210000,
    unit: 'BAO',
    stock: 45,
    status: 'ACTIVE'
  },
  {
    productId: 'SP000003',
    productName: 'Thịt ba rọi heo tươi CP (Khay 500g)',
    categoryName: 'Thịt, Cá, Hải sản',
    price: 85000,
    unit: 'KG',
    stock: 18,
    status: 'ACTIVE'
  },
  {
    productId: 'SP000004',
    productName: 'Trứng gà tươi Ba Huân Hộp 10 quả',
    categoryName: 'Trứng & Bơ sữa',
    price: 32000,
    unit: 'CAI',
    stock: 5,
    status: 'LOW_STOCK'
  },
  {
    productId: 'SP000005',
    productName: 'Cà chua VietGAP Đạt chuẩn (Túi 1kg)',
    categoryName: 'Rau củ & Trái cây',
    price: 28000,
    unit: 'KG',
    stock: 0,
    status: 'OUT_OF_STOCK'
  }
];

export const ADMIN_METRICS = [
  { label: 'Tổng mặt hàng', value: '35', icon: '📦', color: '#008848' },
  { label: 'Đơn hàng mới', value: '12', icon: '🛒', color: '#0066cc' },
  { label: 'Cảnh báo sắp hết hàng', value: '3', icon: '⚠️', color: '#f28900' },
  { label: 'Mặt hàng hết kho', value: '1', icon: '❌', color: '#d0021b' }
];

export default {
  INITIAL_ADMIN_PRODUCTS,
  ADMIN_METRICS
};
