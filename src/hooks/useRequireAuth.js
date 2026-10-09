import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../stores/useAuthStore';

/**
 * Custom Hook bảo vệ các hành động cần đăng nhập (Thêm giỏ hàng, xem giỏ hàng, đặt hàng)
 * Giúp tái sử dụng logic xác thực trên toàn bộ ứng dụng mà không cần lặp lại if-else
 */
export const useRequireAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuthStore();

  const requireAuth = (callback, customMessage = 'Bạn cần đăng nhập để tiếp tục thao tác này!') => {
    if (!isAuthenticated) {
      if (customMessage) {
        alert(`⚠️ ${customMessage}`);
      }
      const currentUrl = location.pathname + location.search;
      navigate(`/login?redirect=${encodeURIComponent(currentUrl)}`);
      return false;
    }

    if (typeof callback === 'function') {
      callback();
    }
    return true;
  };

  return {
    requireAuth,
    isAuthenticated,
    user
  };
};

export default useRequireAuth;
