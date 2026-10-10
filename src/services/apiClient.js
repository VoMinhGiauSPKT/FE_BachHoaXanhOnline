import axios from 'axios';
import { STORAGE_KEYS } from '../constants/storageKeys';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/BachHoaXanhOnline';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  },
  withCredentials: true // Cho phép truyền và nhận HttpOnly cookie refreshToken
});

// Biến quản lý trạng thái Refresh Token đồng thời
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Helper lấy accessToken từ localStorage
export const getStoredAccessToken = () => {
  const authStorage = localStorage.getItem(STORAGE_KEYS.AUTH);
  if (!authStorage) return null;
  try {
    const parsed = JSON.parse(authStorage);
    return parsed?.state?.accessToken || null;
  } catch (e) {
    console.error('Lỗi khi đọc token từ storage:', e);
    return null;
  }
};

// Helper cập nhật accessToken mới vào localStorage
export const updateStoredAccessToken = (newAccessToken) => {
  const authStorage = localStorage.getItem(STORAGE_KEYS.AUTH);
  if (!authStorage) return;
  try {
    const parsed = JSON.parse(authStorage);
    if (parsed && parsed.state) {
      parsed.state.accessToken = newAccessToken;
      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(parsed));
    }
  } catch (e) {
    console.error('Lỗi khi cập nhật token vào storage:', e);
  }
};

// Request Interceptor: Tự động gán Bearer Token vào Header
apiClient.interceptors.request.use(
  (config) => {
    const token = getStoredAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Tự động refresh token và replay request khi nhận 401
apiClient.interceptors.response.use(
  (response) => {
    // Trả về trực tiếp response.data ({ status, message, data })
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const errorData = error.response?.data;

    // Không thử refresh nếu lỗi đến từ các endpoint auth cơ bản
    const isAuthEndpoint = originalRequest?.url?.includes('/auth/login') ||
                           originalRequest?.url?.includes('/auth/register') ||
                           originalRequest?.url?.includes('/auth/refresh');

    if (status === 401 && !originalRequest?._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        // Nếu đang refresh, đưa request vào hàng đợi
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Gửi yêu cầu cấp lại access token mới (cookie refreshToken được gửi tự động)
        const refreshResponse = await axios.post(
          `${BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = refreshResponse.data?.data?.accessToken;
        if (!newAccessToken) {
          throw new Error('Không nhận được accessToken mới từ máy chủ');
        }

        // Cập nhật storage và cấu hình mặc định
        updateStoredAccessToken(newAccessToken);
        apiClient.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;

        // Xử lý tất cả request trong hàng đợi
        processQueue(null, newAccessToken);

        // Replay lại request ban đầu với token mới
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        // Khi refresh thất bại, xóa trạng thái đăng nhập
        localStorage.removeItem(STORAGE_KEYS.AUTH);
        window.dispatchEvent(new Event('auth:unauthorized'));
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    const message = errorData?.message || error.message || 'Đã có lỗi xảy ra, vui lòng thử lại';
    const customError = new Error(message);
    customError.status = status;
    customError.data = errorData;
    return Promise.reject(customError);
  }
);

export default apiClient;
