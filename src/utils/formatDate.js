/**
 * Tiện ích định dạng ngày tháng hiển thị chuẩn Việt Nam
 * Hỗ trợ đa dạng format: ISO string, epoch ms, mảng Jackson [YYYY, MM, DD, HH, mm, ss],
 * và chuỗi số nguyên YYYYMMDDHHmmss...
 */
export const formatDate = (dateValue, includeTime = false) => {
  if (!dateValue) return '';

  try {
    let date;

    // 1. Trường hợp Jackson serialize thành mảng: [year, month, day, hour, minute, second, nano]
    if (Array.isArray(dateValue)) {
      const year = dateValue[0];
      const month = (dateValue[1] || 1) - 1;
      const day = dateValue[2] || 1;
      const hours = dateValue[3] || 0;
      const minutes = dateValue[4] || 0;
      const seconds = dateValue[5] || 0;
      date = new Date(year, month, day, hours, minutes, seconds);
    }
    // 2. Trường hợp chuỗi hoặc số liên tục không dấu phân cách: "20261010114522..." hoặc 20261010114522660548000
    else {
      const strVal = String(dateValue).trim();
      if (/^\d{14,}$/.test(strVal)) {
        const year = parseInt(strVal.substring(0, 4), 10);
        const month = parseInt(strVal.substring(4, 6), 10) - 1;
        const day = parseInt(strVal.substring(6, 8), 10);
        const hours = parseInt(strVal.substring(8, 10), 10);
        const minutes = parseInt(strVal.substring(10, 12), 10);
        const seconds = parseInt(strVal.substring(12, 14), 10);
        date = new Date(year, month, day, hours, minutes, seconds);
      } else if (typeof dateValue === 'number' && dateValue < 10000000000000) {
        date = new Date(dateValue);
      } else {
        date = new Date(dateValue);
      }
    }

    if (!date || isNaN(date.getTime())) {
      return String(dateValue);
    }

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    if (includeTime) {
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${hours}:${minutes} ${day}/${month}/${year}`;
    }

    return `${day}/${month}/${year}`;
  } catch {
    return String(dateValue);
  }
};

export default formatDate;
