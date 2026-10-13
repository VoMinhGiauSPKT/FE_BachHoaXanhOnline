import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '../pages/customer/home';
import AuthPage from '../pages/customer/auth';
import ProtectedRoute from './ProtectedRoute';
import RouteLoader from '../components/RouteLoader';
import { PATHS } from '../constants/paths';

// Code Splitting (Lazy Loading) các trang con và module Admin
const ProductDetailPage = React.lazy(() => import('../pages/customer/productDetail'));
const CheckoutPage = React.lazy(() => import('../pages/customer/checkout'));
const CustomerOrdersPage = React.lazy(() => import('../pages/customer/orders'));
const CustomerProfilePage = React.lazy(() => import('../pages/customer/profile'));
const AdminPage = React.lazy(() => import('../pages/admin'));

export const AppRoutes = () => {
  return (
    <Suspense fallback={<RouteLoader />}>
      <Routes>
        {/* 1. Tuyến đường công khai & Khách hàng mua sắm */}
        <Route path={PATHS.HOME} element={<HomePage />} />
        <Route path={PATHS.LOGIN} element={<AuthPage />} />
        <Route path={PATHS.REGISTER} element={<AuthPage />} />
        <Route path={PATHS.PRODUCT_DETAIL} element={<ProductDetailPage />} />

        {/* 2. Tuyến đường Khách hàng yêu cầu đăng nhập */}
        <Route
          path={PATHS.CHECKOUT}
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={PATHS.ORDERS}
          element={
            <ProtectedRoute>
              <CustomerOrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={PATHS.PROFILE}
          element={
            <ProtectedRoute>
              <CustomerProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path={PATHS.ADDRESSES}
          element={
            <ProtectedRoute>
              <CustomerProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path={PATHS.REVIEWS}
          element={
            <ProtectedRoute>
              <CustomerProfilePage />
            </ProtectedRoute>
          }
        />

        {/* 3. Tuyến đường Quản trị (Dành riêng cho Nhân viên & Admin - EMPLOYEE) */}
        <Route
          path={PATHS.ADMIN.DASHBOARD}
          element={
            <ProtectedRoute requiredUserType="EMPLOYEE">
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={PATHS.ADMIN.PRODUCTS}
          element={
            <ProtectedRoute requiredUserType="EMPLOYEE">
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={PATHS.ADMIN.CATEGORIES}
          element={
            <ProtectedRoute requiredUserType="EMPLOYEE">
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={PATHS.ADMIN.SUPPLIERS}
          element={
            <ProtectedRoute requiredUserType="EMPLOYEE">
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={PATHS.ADMIN.ORDERS}
          element={
            <ProtectedRoute requiredUserType="EMPLOYEE">
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={PATHS.ADMIN.PROMOTIONS}
          element={
            <ProtectedRoute requiredUserType="EMPLOYEE" requiredPosition="ADMIN">
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={PATHS.ADMIN.EMPLOYEES}
          element={
            <ProtectedRoute requiredUserType="EMPLOYEE" requiredPosition="ADMIN">
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={PATHS.ADMIN.REVIEWS}
          element={
            <ProtectedRoute requiredUserType="EMPLOYEE">
              <AdminPage />
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
