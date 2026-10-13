/**
 * Tiện ích định dạng số lượng và khối lượng trong hệ thống FreshMart
 * Quy chuẩn: Chỉ sử dụng số nguyên (integer) cho toàn bộ hệ thống
 */

/**
 * Định dạng số lượng thành số nguyên
 * @param {number|string} qty Số lượng
 * @returns {string}
 */
export const formatQuantity = (qty) => {
  if (qty === undefined || qty === null || isNaN(Number(qty))) return '0';
  const num = Math.round(Number(qty));
  return num.toString();
};

/**
 * Định dạng số lượng kết hợp với đơn vị tính
 * @param {number|string} qty 
 * @param {string} unit 
 * @returns {string}
 */
export const formatQuantityWithUnit = (qty, unit = '') => {
  const formatted = formatQuantity(qty);
  return `${formatted} ${unit || ''}`.trim();
};

export default formatQuantity;
