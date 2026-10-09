import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../stores/useAuthStore';
import { PATHS } from './paths';

/**
 * Component bảo vệ các Route yêu cầu xác thực hoặc phân quyền vai trò
 * @param {Object} props
 * @param {'CUSTOMER'|'EMPLOYEE'} [props.requiredUserType] Yêu cầu loại người dùng (Khách hàng hoặc Nhân viên)
 * @param {'ADMIN'|'STAFF'} [props.requiredPosition] Yêu cầu chức vụ cụ thể đối với nhân viên (ADMIN hoặc STAFF)
 * @param {React.ReactNode} props.children
 */
export const ProtectedRoute = ({
  requiredUserType,
  requiredPosition,
  children
}) => {
  const location = useLocation();
  const { isAuthenticated, userType, user } = useAuthStore();

  // 1. Chưa đăng nhập -> Chuyển về trang Login kèm url trước đó
  if (!isAuthenticated) {
    const redirectUrl = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`${PATHS.LOGIN}?redirect=${redirectUrl}`} state={{ from: location }} replace />;
  }

  // 2. Kiểm tra loại tài khoản (CUSTOMER vs EMPLOYEE)
  if (requiredUserType && userType !== requiredUserType) {
    alert('⚠️ Bạn không có quyền truy cập vào khu vực này!');
    // Nếu là CUSTOMER cố vào /admin thì về trang chủ HOME
    return <Navigate to={PATHS.HOME} replace />;
  }

  // 3. Kiểm tra chức vụ của nhân viên (ADMIN vs STAFF) nếu có yêu cầu
  if (requiredPosition && user?.position !== requiredPosition) {
    alert(`⚠️ Chỉ tài khoản chức vụ ${requiredPosition} mới được thực hiện thao tác này!`);
    return <Navigate to={PATHS.ADMIN.DASHBOARD} replace />;
  }

  return children;
};

export default ProtectedRoute;
