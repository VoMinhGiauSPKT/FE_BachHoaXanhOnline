import React from 'react';
import { ConfigProvider } from 'antd';
import ProductManager from './components/ProductManager';
import CategoryManager from './components/CategoryManager';
import SupplierManager from './components/SupplierManager';
import OrderManager from './components/OrderManager';
import PromotionManager from './components/PromotionManager';
import EmployeeManager from './components/EmployeeManager';
import ReviewManager from './components/ReviewManager';

export const DesktopAdmin = ({
  activeTab = 'products',
  isAdmin = false,
  userPosition = 'STAFF',
  // Products
  products = [],
  productPage = 1,
  productLimit = 20,
  productTotal = 0,
  productSearch = '',
  productCategoryFilter = '',
  productInStockFilter = '',
  isProductsLoading = false,
  onProductSearchSubmit,
  onProductResetFilters,
  onProductSearchChange,
  onProductCategoryFilterChange,
  onProductInStockFilterChange,
  onProductPageChange,
  onSaveProduct,
  onDeleteProduct,
  onRefreshProducts,
  // Categories
  categories = [],
  isCategoryLoading = false,
  onSaveCategory,
  onDeleteCategory,
  onRefreshCategories,
  // Suppliers
  suppliers = [],
  isSupplierLoading = false,
  onSaveSupplier,
  onDeleteSupplier,
  onRefreshSuppliers,
  // Orders
  orders = [],
  orderPage = 1,
  orderLimit = 20,
  orderTotal = 0,
  isOrderLoading = false,
  selectedOrderDetail = null,
  onOrderPageChange,
  onViewOrderDetail,
  onCloseOrderDetail,
  onConfirmCod,
  onCancelOrder,
  onRefreshOrders,
  // Promotions
  promotions = [],
  promoPage = 1,
  promoLimit = 20,
  promoTotal = 0,
  promoKeyword = '',
  promoTypeFilter = '',
  isPromoLoading = false,
  onPromoSearchSubmit,
  onPromoResetFilters,
  onPromoKeywordChange,
  onPromoTypeFilterChange,
  onPromoPageChange,
  onSavePromotion,
  onUpdatePromotion,
  onDeletePromotion,
  onRefreshPromotions,
  // Employees
  employees = [],
  empPage = 1,
  empLimit = 20,
  empTotal = 0,
  empSearch = '',
  empPositionFilter = '',
  empStatusFilter = '',
  isEmpLoading = false,
  onEmpSearchSubmit,
  onEmpResetFilters,
  onEmpSearchChange,
  onEmpPositionFilterChange,
  onEmpStatusFilterChange,
  onEmpPageChange,
  onSaveEmployee,
  onUpdateEmployee,
  onToggleEmployeeStatus,
  onRefreshEmployees,
  // Reviews
  reviews = [],
  reviewPage = 1,
  reviewLimit = 20,
  reviewTotal = 0,
  reviewKeyword = '',
  reviewRatingFilter = '',
  reviewStatusFilter = '',
  isReviewsLoading = false,
  onReviewSearchSubmit,
  onReviewResetFilters,
  onReviewKeywordChange,
  onReviewRatingFilterChange,
  onReviewStatusFilterChange,
  onReviewPageChange,
  onDeleteReview,
  onReplyReview,
  onRefreshReviews
}) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#10b981',
          colorSuccess: '#10b981',
          colorWarning: '#f59e0b',
          colorError: '#ef4444',
          colorInfo: '#3b82f6',
          borderRadius: 8,
          fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        }
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Nội dung nghiệp vụ theo Tab */}
        <div>
          {activeTab === 'products' && (
            <ProductManager
              products={products}
              categories={categories}
              isLoading={isProductsLoading}
              page={productPage}
              limit={productLimit}
              total={productTotal}
              search={productSearch}
              categoryFilter={productCategoryFilter}
              inStockFilter={productInStockFilter}
              onSearchSubmit={onProductSearchSubmit}
              onResetFilters={onProductResetFilters}
              onSearchChange={onProductSearchChange}
              onCategoryFilterChange={onProductCategoryFilterChange}
              onInStockFilterChange={onProductInStockFilterChange}
              onPageChange={onProductPageChange}
              onSaveProduct={onSaveProduct}
              onDeleteProduct={onDeleteProduct}
              onRefresh={onRefreshProducts}
              suppliers={suppliers}
            />
          )}

          {activeTab === 'categories' && (
            <CategoryManager
              categories={categories}
              isLoading={isCategoryLoading}
              isAdmin={isAdmin}
              onSaveCategory={onSaveCategory}
              onDeleteCategory={onDeleteCategory}
              onRefresh={onRefreshCategories}
            />
          )}

          {activeTab === 'suppliers' && (
            <SupplierManager
              suppliers={suppliers}
              isLoading={isSupplierLoading}
              isAdmin={isAdmin}
              onSaveSupplier={onSaveSupplier}
              onDeleteSupplier={onDeleteSupplier}
              onRefresh={onRefreshSuppliers}
            />
          )}

          {activeTab === 'orders' && (
            <OrderManager
              orders={orders}
              isLoading={isOrderLoading}
              page={orderPage}
              limit={orderLimit}
              total={orderTotal}
              selectedOrderDetail={selectedOrderDetail}
              onPageChange={onOrderPageChange}
              onViewOrderDetail={onViewOrderDetail}
              onCloseOrderDetail={onCloseOrderDetail}
              onConfirmCod={onConfirmCod}
              onCancelOrder={onCancelOrder}
              onRefresh={onRefreshOrders}
            />
          )}

          {activeTab === 'promotions' && isAdmin && (
            <PromotionManager
              promotions={promotions}
              isLoading={isPromoLoading}
              page={promoPage}
              limit={promoLimit}
              total={promoTotal}
              keyword={promoKeyword}
              discountTypeFilter={promoTypeFilter}
              onSearchSubmit={onPromoSearchSubmit}
              onResetFilters={onPromoResetFilters}
              onKeywordChange={onPromoKeywordChange}
              onDiscountTypeFilterChange={onPromoTypeFilterChange}
              onPageChange={onPromoPageChange}
              onSavePromotion={onSavePromotion}
              onUpdatePromotion={onUpdatePromotion}
              onDeletePromotion={onDeletePromotion}
              onRefresh={onRefreshPromotions}
            />
          )}

          {activeTab === 'employees' && isAdmin && (
            <EmployeeManager
              employees={employees}
              isLoading={isEmpLoading}
              page={empPage}
              limit={empLimit}
              total={empTotal}
              search={empSearch}
              positionFilter={empPositionFilter}
              statusFilter={empStatusFilter}
              onSearchSubmit={onEmpSearchSubmit}
              onResetFilters={onEmpResetFilters}
              onSearchChange={onEmpSearchChange}
              onPositionFilterChange={onEmpPositionFilterChange}
              onStatusFilterChange={onEmpStatusFilterChange}
              onPageChange={onEmpPageChange}
              onSaveEmployee={onSaveEmployee}
              onUpdateEmployee={onUpdateEmployee}
              onToggleEmployeeStatus={onToggleEmployeeStatus}
              onRefresh={onRefreshEmployees}
            />
          )}

          {activeTab === 'reviews' && (
            <ReviewManager
              reviews={reviews}
              isLoading={isReviewsLoading}
              page={reviewPage}
              limit={reviewLimit}
              total={reviewTotal}
              keyword={reviewKeyword}
              ratingFilter={reviewRatingFilter}
              statusFilter={reviewStatusFilter}
              onSearchSubmit={onReviewSearchSubmit}
              onResetFilters={onReviewResetFilters}
              onKeywordChange={onReviewKeywordChange}
              onRatingFilterChange={onReviewRatingFilterChange}
              onStatusFilterChange={onReviewStatusFilterChange}
              onPageChange={onReviewPageChange}
              onDeleteReview={onDeleteReview}
              onReplyReview={onReplyReview}
              onRefresh={onRefreshReviews}
            />
          )}
        </div>
      </div>
    </ConfigProvider>
  );
};

export default DesktopAdmin;
