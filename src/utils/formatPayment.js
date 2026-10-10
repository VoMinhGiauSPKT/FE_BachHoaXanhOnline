/**
 * Chuẩn hóa tên phương thức thanh toán thân thiện cho người dùng,
 * tránh hiển thị chuỗi số orderCode (ví dụ 91646512293) từ PayOS/VietQR.
 * @param {string} method
 * @returns {string}
 */
export const formatPaymentMethod = (method) => {
  if (!method) return 'COD (Tiền mặt)';
  const str = String(method).trim().toUpperCase();
  if (str === 'VIETQR' || str === 'PAYOS' || /^\d+$/.test(str)) {
    return 'Chuyển khoản VietQR';
  }
  if (str === 'COD') {
    return 'COD (Tiền mặt)';
  }
  return method;
};

export default formatPaymentMethod;
