import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import authService from '../services/authService';
import { STORAGE_KEYS } from '../constants/storageKeys';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      userType: null, // 'CUSTOMER' | 'EMPLOYEE'
      position: null, // 'ADMIN' | 'STAFF' | null
      isAuthenticated: false,
      isLoading: false,
      error: null,

      clearError: () => set({ error: null }),

      /**
       * Thiết lập thủ công auth data
       */
      setAuth: ({ accessToken, userType, user, position }) => {
        set({
          accessToken,
          userType,
          user,
          position: position || user?.position || null,
          isAuthenticated: Boolean(accessToken)
        });
      },

      /**
       * Đăng nhập người dùng (Khách hàng hoặc Nhân viên/Admin)
       */
      login: async ({ username, password }) => {
        set({ isLoading: true, error: null });
        try {
          const res = await authService.login({ username, password });
          const { accessToken, userType, customer, employee } = res.data;

          const userInfo = customer || employee || { username, userType };
          const position = employee?.position || userInfo?.position || null;

          set({
            accessToken,
            userType,
            position,
            user: userInfo,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });

          // Nếu đăng nhập quyền Nhân viên / Admin, xóa sạch giỏ hàng mua sắm khách hàng
          if (userType === 'EMPLOYEE' && typeof window !== 'undefined') {
            localStorage.removeItem('bhx-guest-cart');
            window.dispatchEvent(new CustomEvent('auth:cart-reset'));
          }

          return { success: true, message: res.message, data: res.data };
        } catch (err) {
          const message = err.message || 'Đăng nhập không thành công';
          set({ isLoading: false, error: message });
          return { success: false, message };
        }
      },

      /**
       * Đăng ký tài khoản khách hàng mới
       */
      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const res = await authService.register(userData);
          set({ isLoading: false, error: null });
          return { success: true, message: res.message, data: res.data };
        } catch (err) {
          const message = err.message || 'Đăng ký không thành công';
          set({ isLoading: false, error: message });
          return { success: false, message };
        }
      },

      /**
       * Tự động làm mới phiên làm việc
       */
      refreshSession: async () => {
        try {
          const res = await authService.refreshToken();
          const newAccessToken = res.data?.accessToken;
          if (newAccessToken) {
            set((state) => ({
              ...state,
              accessToken: newAccessToken,
              isAuthenticated: true
            }));
            return newAccessToken;
          }
        } catch (err) {
          get().logout();
          throw err;
        }
      },

      /**
       * Lấy thông tin tài khoản hiện tại từ API Profile
       */
      fetchProfile: async () => {
        if (!get().isAuthenticated) return null;
        try {
          const res = await authService.getProfile();
          if (res.data) {
            set((state) => ({
              user: { ...state.user, ...res.data },
              userType: res.data.userType || state.userType,
              position: res.data.position || state.position
            }));
            return res.data;
          }
        } catch (err) {
          console.warn('Lỗi khi fetch profile:', err);
        }
        return null;
      },

      /**
       * Đăng xuất
       */
      logout: async () => {
        try {
          await authService.logout();
        } catch (e) {
          console.warn('Lỗi khi gọi logout API:', e);
        } finally {
          set({
            user: null,
            accessToken: null,
            userType: null,
            position: null,
            isAuthenticated: false,
            error: null
          });
          localStorage.removeItem(STORAGE_KEYS.AUTH);
          if (typeof window !== 'undefined') {
            localStorage.removeItem('bhx-guest-cart');
            window.dispatchEvent(new CustomEvent('auth:cart-reset'));
          }
        }
      }
    }),
    {
      name: STORAGE_KEYS.AUTH,
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        userType: state.userType,
        position: state.position,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);

// Lắng nghe sự kiện mất quyền đăng nhập từ apiClient interceptor
if (typeof window !== 'undefined') {
  window.addEventListener('auth:unauthorized', () => {
    useAuthStore.getState().logout();
  });
}

export default useAuthStore;
