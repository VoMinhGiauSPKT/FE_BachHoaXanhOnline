import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import authService from '../services/authService';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      userType: null, // 'CUSTOMER' | 'EMPLOYEE'
      isAuthenticated: false,
      isLoading: false,
      error: null,

      clearError: () => set({ error: null }),

      /**
       * Đăng nhập người dùng
       */
      login: async ({ username, password }) => {
        set({ isLoading: true, error: null });
        try {
          const res = await authService.login({ username, password });
          const { accessToken, userType, customer, employee } = res.data;
          
          const userInfo = customer || employee || { username, userType };

          set({
            accessToken,
            userType,
            user: userInfo,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });

          return { success: true, message: res.message, data: res.data };
        } catch (err) {
          const message = err.message || 'Đăng nhập không thành công';
          set({ isLoading: false, error: message });
          return { success: false, message };
        }
      },

      /**
       * Đăng ký tài khoản khách hàng
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
            isAuthenticated: false,
            error: null
          });
          localStorage.removeItem('bhx-auth-storage');
        }
      }
    }),
    {
      name: 'bhx-auth-storage', // Lưu vào localStorage
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        userType: state.userType,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);

export default useAuthStore;
