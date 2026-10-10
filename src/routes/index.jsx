import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomeContainer from '../modules/containers/home';
import LoginContainer from '../modules/containers/login';
import ProductDetailContainer from '../modules/containers/productDetail';
import CheckoutContainer from '../modules/containers/checkout';
import OrdersContainer from '../modules/containers/orders';
import ProfileContainer from '../modules/containers/profile';
import AdminContainer from '../modules/containers/admin';
import ProtectedRoute from './ProtectedRoute';
import { PATHS } from '../constants/paths';

export const AppRoutes = () => {
  return (
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

      {/* Điều hướng mặc định nếu route không tồn tại */}
      <Route path="*" element={<Navigate to={PATHS.HOME} replace />} />
    </Routes>
  );
};

export default AppRoutes;
