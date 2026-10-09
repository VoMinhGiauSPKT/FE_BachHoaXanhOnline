import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomeContainer from '../modules/containers/home';
import LoginContainer from '../modules/containers/login';
import AdminContainer from '../modules/containers/admin';
import ProtectedRoute from './ProtectedRoute';
import { PATHS } from './paths';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* 1. Tuyến đường công khai & Khách hàng mua sắm */}
      <Route path={PATHS.HOME} element={<HomeContainer />} />
      <Route path={PATHS.LOGIN} element={<LoginContainer />} />
      <Route path={PATHS.REGISTER} element={<LoginContainer />} />

      {/* 2. Tuyến đường Quản trị (Dành riêng cho Nhân viên & Admin - EMPLOYEE) */}
      <Route
        path={PATHS.ADMIN.DASHBOARD}
        element={
          <ProtectedRoute requiredUserType="EMPLOYEE">
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
