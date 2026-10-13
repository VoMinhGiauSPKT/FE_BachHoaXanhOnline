import React from 'react';
import { useLocation } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';
import AdminProductsPage from './products';
import AdminCategoriesPage from './categories';
import AdminSuppliersPage from './suppliers';
import AdminOrdersPage from './orders';
import AdminPromotionsPage from './promotions';
import AdminEmployeesPage from './employees';
import AdminReviewsPage from './reviews';

export const AdminPage = () => {
  const location = useLocation();
  const path = location.pathname;

  const renderContent = () => {
    if (path.includes('/admin/products')) return <AdminProductsPage />;
    if (path.includes('/admin/categories')) return <AdminCategoriesPage />;
    if (path.includes('/admin/suppliers')) return <AdminSuppliersPage />;
    if (path.includes('/admin/orders')) return <AdminOrdersPage />;
    if (path.includes('/admin/promotions')) return <AdminPromotionsPage />;
    if (path.includes('/admin/employees')) return <AdminEmployeesPage />;
    if (path.includes('/admin/reviews')) return <AdminReviewsPage />;
    return <AdminProductsPage />;
  };

  return <AdminLayout>{renderContent()}</AdminLayout>;
};

export default AdminPage;
