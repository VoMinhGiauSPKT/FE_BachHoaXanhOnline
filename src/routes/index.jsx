import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomeContainer from '../modules/containers/home';
import LoginContainer from '../modules/containers/login';
import ProtectedRoute from './ProtectedRoute';
import { PATHS } from '../constants/paths';

// Code Splitting (Lazy Loading) các trang con và module Admin dung lượng lớn
const ProductDetailContainer = React.lazy(() => import('../modules/containers/productDetail'));
const CheckoutContainer = React.lazy(() => import('../modules/containers/checkout'));
const OrdersContainer = React.lazy(() => import('../modules/containers/orders'));
const ProfileContainer = React.lazy(() => import('../modules/containers/profile'));
const AdminContainer = React.lazy(() => import('../modules/containers/admin'));

// Loading Fallback mượt mà trong khi tải chunk route
const RouteLoadingFallback = () => (
  <div style={{
    minHeight: '65vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '14px',
    color: '#059669',
    fontFamily: 'Inter, system-ui, sans-serif'
  }}>
    <div style={{
      width: '42px',
      height: '42px',
      border: '3.5px solid #d1fae5',
      borderTopColor: '#059669',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite'
    }} />
    <span style={{ fontSize: '14px', fontWeight: 600, color: '#475569' }}>
      Đang tải trang...
    </span>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

export const AppRoutes = () => {
  return (
    <Suspense fallback={<RouteLoadingFallback />}>
      <Routes>
      {/* 1. Tuyến đường công khai & Khách hàng mua sắm */}
      <Route path={PATHS.HOME} element={<HomeContainer />} />
      <Route path={PATHS.LOGIN} element={<LoginContainer />} />
      <Route path={PATHS.REGISTER} element={<LoginContainer />} />
      <Route path={PATHS.PRODUCT_DETAIL} element={<ProductDetailContainer />} />

      {/* 2. Tuyến đường Khách hàng yêu cầu đăng nhập */}
      <Route
        path={PATHS.CHECKOUT}
        element={
          <ProtectedRoute>
            <CheckoutContainer />
          </ProtectedRoute>
        }
      />
      <Route
        path={PATHS.ORDERS}
        element={
          <ProtectedRoute>
            <OrdersContainer />
          </ProtectedRoute>
        }
      />
      <Route
        path={PATHS.PROFILE}
        element={
          <ProtectedRoute>
            <ProfileContainer />
          </ProtectedRoute>
        }
      />
      <Route
        path={PATHS.ADDRESSES}
        element={
          <ProtectedRoute>
            <ProfileContainer />
          </ProtectedRoute>
        }
      />
      <Route
        path={PATHS.REVIEWS}
        element={
          <ProtectedRoute>
            <ProfileContainer />
          </ProtectedRoute>
        }
      />

      {/* 3. Tuyến đường Quản trị (Dành riêng cho Nhân viên & Admin - EMPLOYEE) */}
      <Route
        path={PATHS.ADMIN.DASHBOARD}
        element={
          <ProtectedRoute requiredUserType="EMPLOYEE">
            <AdminContainer />
          </ProtectedRoute>
        }
      />
      <Route
        path={PATHS.ADMIN.PRODUCTS}
        element={
          <ProtectedRoute requiredUserType="EMPLOYEE">
            <AdminContainer />
          </ProtectedRoute>
        }
      />
      <Route
        path={PATHS.ADMIN.CATEGORIES}
        element={
          <ProtectedRoute requiredUserType="EMPLOYEE">
            <AdminContainer />
          </ProtectedRoute>
        }
      />
      <Route
        path={PATHS.ADMIN.SUPPLIERS}
        element={
          <ProtectedRoute requiredUserType="EMPLOYEE">
            <AdminContainer />
          </ProtectedRoute>
        }
      />
      <Route
        path={PATHS.ADMIN.ORDERS}
        element={
          <ProtectedRoute requiredUserType="EMPLOYEE">
            <AdminContainer />
          </ProtectedRoute>
        }
      />
      <Route
        path={PATHS.ADMIN.PROMOTIONS}
        element={
          <ProtectedRoute requiredUserType="EMPLOYEE" requiredPosition="ADMIN">
            <AdminContainer />
          </ProtectedRoute>
        }
      />
      <Route
        path={PATHS.ADMIN.EMPLOYEES}
        element={
          <ProtectedRoute requiredUserType="EMPLOYEE" requiredPosition="ADMIN">
            <AdminContainer />
          </ProtectedRoute>
        }
      />
      <Route
        path={PATHS.ADMIN.REVIEWS}
        element={
          <ProtectedRoute requiredUserType="EMPLOYEE">
            <AdminContainer />
          </ProtectedRoute>
        }
      />

      {/* Điều hướng mặc định nếu route không tồn tại */}
      <Route path="*" element={<Navigate to={PATHS.HOME} replace />} />
    </Routes>
  </Suspense>
  );
};

export default AppRoutes;
