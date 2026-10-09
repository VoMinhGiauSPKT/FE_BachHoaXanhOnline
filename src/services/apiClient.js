import axios from 'axios';
import { STORAGE_KEYS } from '../constants/storageKeys';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  },
  withCredentials: true // Cho phép truyền và nhận cookie refreshToken
});

// Request Interceptor: Tự động gán Access Token vào Header
apiClient.interceptors.request.use(
  (config) => {
    // Đọc token từ localStorage (được đồng bộ bởi Zustand Auth Store)
    const authStorage = localStorage.getItem(STORAGE_KEYS.AUTH);
    if (authStorage) {
      try {
        const parsed = JSON.parse(authStorage);
        const token = parsed?.state?.accessToken;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (e) {
        console.error('Lỗi phân tích auth storage:', e);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Xử lý dữ liệu trả về và lỗi tập trung
apiClient.interceptors.response.use(
  (response) => {
    // Trả về trực tiếp response.data ({ status, message, data })
    return response.data;
  },
  async (error) => {
    const errorData = error.response?.data;
    const status = error.response?.status;

    // Nếu gặp lỗi 401 (Unauthorized)
    if (status === 401) {
      // Có thể kích hoạt refresh token hoặc clear auth khi token hết hạn
      console.warn('Phiên đăng nhập không hợp lệ hoặc đã hết hạn.');
    }

    const message = errorData?.message || error.message || 'Đã có lỗi xảy ra, vui lòng thử lại';
    return Promise.reject(new Error(message));
  }
);

export default apiClient;
