/**
 * Tiện ích định dạng số lượng và khối lượng trong hệ thống FreshMart
 */

/**
 * Định dạng số lượng số thập phân (VD: 0.1 -> "0,1", 0.5 -> "0,5", 1 -> "1")
 * @param {number|string} qty Số lượng
 * @param {boolean} [useComma=true] Thay dấu chấm bằng dấu phẩy theo chuẩn Việt Nam
 * @returns {string}
 */
export const formatQuantity = (qty, useComma = true) => {
  if (qty === undefined || qty === null || isNaN(Number(qty))) return '0';
  const num = Math.round(Number(qty) * 100) / 100;
  const str = num % 1 === 0 ? num.toFixed(0) : num.toString();
  return useComma ? str.replace('.', ',') : str;
};

/**
 * Định dạng số lượng kết hợp với đơn vị tính
 * Ví dụ: 
 *   - Với KG: 0.1 -> "0,1 kg (100g)", 0.5 -> "0,5 kg (500g)", 1 -> "1 kg"
 *   - Với Đơn vị khác: 2 -> "2 chai"
 * @param {number|string} qty 
 * @param {string} unit 
 * @returns {string}
 */
export const formatQuantityWithUnit = (qty, unit = '') => {
  const isKg = (unit || '').toUpperCase() === 'KG';
  const formatted = formatQuantity(qty);
  if (!isKg) {
    return `${formatted} ${unit || ''}`.trim();
  }

  const num = Number(qty);
  if (num < 1 && num > 0) {
    const grams = Math.round(num * 1000);
    return `${formatted} kg (${grams}g)`;
  }
  return `${formatted} kg`;
};

export default formatQuantity;
