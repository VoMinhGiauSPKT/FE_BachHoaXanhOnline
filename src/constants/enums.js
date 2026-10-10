/**
 * Các enum hằng số nghiệp vụ trong hệ thống Bách Hóa Xanh Online
 * Đồng bộ 100% với PostgreSQL (BachHoaXanhDB.sql) và backend Java Servlet / Jakarta EE
 */

// 1. Phân quyền Người Dùng (NguoiDung / AuthResponse)
export const USER_ROLES = {
  CUSTOMER: 'CUSTOMER',
  EMPLOYEE: 'EMPLOYEE'
};

// 2. Chức vụ Nhân Viên (enum_chucvu_nhanvien trong DB: 'ADMIN', 'STAFF')
export const POSITIONS = {
  ADMIN: 'ADMIN',
  STAFF: 'STAFF'
};

export const POSITION_LABELS = {
  ADMIN: 'Quản trị viên (Admin)',
  STAFF: 'Nhân viên bán hàng / kho (Staff)'
};

// 3. Trạng thái Đơn Hàng (enum_donhang_trangthai trong DB: 'CHUATHANHTOAN', 'DATHANHTOAN')
export const ORDER_STATUS = {
  CHUATHANHTOAN: 'CHUATHANHTOAN', // Chưa thanh toán (mới đặt, COD hoặc chờ quét QR)
  DATHANHTOAN: 'DATHANHTOAN',     // Đã thanh toán (xác nhận COD hoặc PayOS thành công)
  // Alias tương thích dữ liệu cũ
  PENDING: 'CHUATHANHTOAN',
  COMPLETED: 'DATHANHTOAN'
};

export const ORDER_STATUS_LABELS = {
  CHUATHANHTOAN: 'Chưa Thanh Toán',
  DATHANHTOAN: 'Đã Thanh Toán',
  PENDING: 'Chưa Thanh Toán',
  COMPLETED: 'Đã Thanh Toán',
  CANCELLED: 'Đã Hủy'
};

// 4. Trạng thái Thanh Toán (enum_thanhtoan_trangthai trong DB: 'THANHCONG', 'DANGXULY', 'THATBAI')
export const PAYMENT_STATUS = {
  DANGXULY: 'DANGXULY',     // Đang chờ thanh toán
  THANHCONG: 'THANHCONG',   // Thanh toán thành công
  THATBAI: 'THATBAI'        // Thanh toán thất bại
};

export const PAYMENT_STATUS_LABELS = {
  DANGXULY: 'Đang Xử Lý',
  THANHCONG: 'Thành Công',
  THATBAI: 'Thất Bại'
};

// 5. Loại Khuyến Mãi (enum_loai_khuyenmai trong DB: 'TIENMAT', 'PHANTRAM')
export const DISCOUNT_TYPES = {
  TIENMAT: 'TIENMAT',   // Giảm tiền mặt trực tiếp (VND)
  PHANTRAM: 'PHANTRAM', // Giảm theo tỷ lệ phần trăm (%)
  // Alias tương thích
  FIXED: 'TIENMAT',
  PERCENT: 'PHANTRAM'
};

export const DISCOUNT_TYPE_LABELS = {
  TIENMAT: 'Tiền mặt (VND)',
  PHANTRAM: 'Phần trăm (%)',
  FIXED: 'Tiền mặt (VND)',
  PERCENT: 'Phần trăm (%)'
};

// 6. Trạng thái Voucher Khuyến Mãi (Promotion Repository tính toán)
export const PROMOTION_STATUS = {
  ACTIVE: 'ACTIVE',           // Đang diễn ra
  UPCOMING: 'UPCOMING',       // Sắp diễn ra
  EXPIRED: 'EXPIRED',         // Đã hết hạn
  OUT_OF_STOCK: 'OUT_OF_STOCK', // Hết lượt sử dụng
  DELETED: 'DELETED'          // Đã xóa
};

export const PROMOTION_STATUS_LABELS = {
  ACTIVE: 'Đang diễn ra',
  UPCOMING: 'Sắp diễn ra',
  EXPIRED: 'Đã hết hạn',
  OUT_OF_STOCK: 'Hết lượt dùng',
  DELETED: 'Đã xóa'
};

// 7. Đơn Vị Tính Sản Phẩm (enum_donvitinh trong DB)
// 'LON', 'CHAI', 'LOC4', 'LOC6', 'THUNG24', 'THUNG30', 'THUNG48', 'GOI', 'CAI', 'BAO', 'KG'
export const PRODUCT_UNITS = {
  KG: 'KG',
  GOI: 'GOI',
  CAI: 'CAI',
  CHAI: 'CHAI',
  LON: 'LON',
  BAO: 'BAO',
  LOC4: 'LOC4',
  LOC6: 'LOC6',
  THUNG24: 'THUNG24',
  THUNG30: 'THUNG30',
  THUNG48: 'THUNG48'
};

export const PRODUCT_UNIT_OPTIONS = [
  { value: 'KG', label: 'Kg (Kilogram)' },
  { value: 'GOI', label: 'Gói' },
  { value: 'CAI', label: 'Cái / Trái' },
  { value: 'CHAI', label: 'Chai' },
  { value: 'LON', label: 'Lon' },
  { value: 'BAO', label: 'Bao / Túi' },
  { value: 'LOC4', label: 'Lốc 4' },
  { value: 'LOC6', label: 'Lốc 6' },
  { value: 'THUNG24', label: 'Thùng 24' },
  { value: 'THUNG30', label: 'Thùng 30' },
  { value: 'THUNG48', label: 'Thùng 48' }
];

export const PRODUCT_UNIT_LABELS = {
  KG: 'Kg',
  GOI: 'Gói',
  CAI: 'Cái',
  CHAI: 'Chai',
  LON: 'Lon',
  BAO: 'Bao',
  LOC4: 'Lốc 4',
  LOC6: 'Lốc 6',
  THUNG24: 'Thùng 24',
  THUNG30: 'Thùng 30',
  THUNG48: 'Thùng 48'
};

// 8. Tùy chọn Sắp xếp Sản Phẩm (Được Backend ProductService cho phép: price_asc, price_desc, newest)
export const SORT_OPTIONS = [
  { value: 'default', label: 'Mặc định (Nổi bật)' },
  { value: 'price_asc', label: 'Giá: Thấp đến Cao' },
  { value: 'price_desc', label: 'Giá: Cao đến Thấp' },
  { value: 'newest', label: 'Mới nhất' }
];

// 9. Phương thức Thanh Toán
export const PAYMENT_METHODS = {
  COD: 'COD',
  VIETQR: 'VIETQR',
  PAYOS: 'PAYOS'
};

export default {
  USER_ROLES,
  POSITIONS,
  POSITION_LABELS,
  ORDER_STATUS,
  ORDER_STATUS_LABELS,
  PAYMENT_STATUS,
  PAYMENT_STATUS_LABELS,
  DISCOUNT_TYPES,
  DISCOUNT_TYPE_LABELS,
  PROMOTION_STATUS,
  PROMOTION_STATUS_LABELS,
  PRODUCT_UNITS,
  PRODUCT_UNIT_OPTIONS,
  PRODUCT_UNIT_LABELS,
  SORT_OPTIONS,
  PAYMENT_METHODS
};
