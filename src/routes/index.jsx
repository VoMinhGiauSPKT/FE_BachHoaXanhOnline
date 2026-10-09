import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomeContainer from '../modules/containers/home';
import LoginContainer from '../modules/containers/login';
import { ROUTES } from '../constants/routes';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<HomeContainer />} />
      <Route path={ROUTES.LOGIN} element={<LoginContainer />} />
      <Route path={ROUTES.REGISTER} element={<LoginContainer />} />
      {/* Mặc định điều hướng về trang chủ nếu gõ sai route */}
      <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
    </Routes>
  );
};

export default AppRoutes;
