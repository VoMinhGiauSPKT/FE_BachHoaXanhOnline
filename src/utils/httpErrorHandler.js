/**
 * Trích xuất thông điệp lỗi thân thiện với người dùng từ Axios / HTTP Response
 */
export const extractErrorMessage = (error, fallback = 'Đã có lỗi xảy ra. Vui lòng thử lại!') => {
  if (!error) return fallback;

  if (typeof error === 'string') return error;

  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.data?.message) {
    return error.data.message;
  }

  if (error.message) {
    return error.message;
  }

  return fallback;
};

export default extractErrorMessage;
