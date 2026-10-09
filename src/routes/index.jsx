import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomeContainer from '../modules/containers/home';
import LoginContainer from '../modules/containers/login';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomeContainer />} />
      <Route path="/login" element={<LoginContainer />} />
      <Route path="/register" element={<LoginContainer />} />
      {/* Mặc định điều hướng về trang chủ nếu gõ sai route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
