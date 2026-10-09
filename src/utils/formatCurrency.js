/**
 * Tiện ích định dạng tiền tệ Việt Nam Đồng (VND)
 * @param {number|string} amount Số tiền cần định dạng
 * @returns {string} Chuỗi tiền tệ định dạng (VD: "37.500 đ")
 */
export const formatVND = (amount) => {
  if (amount === undefined || amount === null || isNaN(Number(amount))) {
    return '0 đ';
  }
  return `${Number(amount).toLocaleString('vi-VN')} đ`;
};

export default formatVND;
