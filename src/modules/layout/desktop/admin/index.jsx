import React from 'react';
import { ConfigProvider, Row, Col, Card, Statistic } from 'antd';
import {
  InboxOutlined,
  ShoppingOutlined,
  GiftOutlined,
  StarOutlined,
  TeamOutlined,
  AppstoreOutlined
} from '@ant-design/icons';
import ProductManager from './components/ProductManager';
import CategoryManager from './components/CategoryManager';
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
  onRefreshOrders,
  // Promotions
  promotions = [],
  promoPage = 1,
  promoLimit = 20,
  promoTotal = 0,
  promoKeyword = '',
  promoTypeFilter = '',
  isPromoLoading = false,
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
        {/* KPI / Thống Kê Nhanh Tổng Quan */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8} lg={4}>
            <Card
              bordered={false}
              style={{
                borderRadius: 12,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                borderLeft: '4px solid #10b981',
                background: '#ffffff'
              }}
              styles={{ body: { padding: '16px 20px' } }}
            >
              <Statistic
                title={<span style={{ fontSize: 13, color: '#64748b' }}>Sản phẩm trong kho</span>}
                value={productTotal}
                prefix={<InboxOutlined style={{ color: '#10b981', marginRight: 6 }} />}
                valueStyle={{ color: '#0f172a', fontWeight: 700, fontSize: 22 }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} md={8} lg={4}>
            <Card
              bordered={false}
              style={{
                borderRadius: 12,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                borderLeft: '4px solid #3b82f6',
                background: '#ffffff'
              }}
              styles={{ body: { padding: '16px 20px' } }}
            >
              <Statistic
                title={<span style={{ fontSize: 13, color: '#64748b' }}>Ngành hàng / DM</span>}
                value={categories.length}
                prefix={<AppstoreOutlined style={{ color: '#3b82f6', marginRight: 6 }} />}
                valueStyle={{ color: '#0f172a', fontWeight: 700, fontSize: 22 }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} md={8} lg={4}>
            <Card
              bordered={false}
              style={{
                borderRadius: 12,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                borderLeft: '4px solid #8b5cf6',
                background: '#ffffff'
              }}
              styles={{ body: { padding: '16px 20px' } }}
            >
              <Statistic
                title={<span style={{ fontSize: 13, color: '#64748b' }}>Đơn hàng hệ thống</span>}
                value={orderTotal}
                prefix={<ShoppingOutlined style={{ color: '#8b5cf6', marginRight: 6 }} />}
                valueStyle={{ color: '#0f172a', fontWeight: 700, fontSize: 22 }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} md={8} lg={4}>
            <Card
              bordered={false}
              style={{
                borderRadius: 12,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                borderLeft: '4px solid #f59e0b',
                background: '#ffffff'
              }}
              styles={{ body: { padding: '16px 20px' } }}
            >
              <Statistic
                title={<span style={{ fontSize: 13, color: '#64748b' }}>Đánh giá sản phẩm</span>}
                value={reviewTotal}
                prefix={<StarOutlined style={{ color: '#f59e0b', marginRight: 6 }} />}
                valueStyle={{ color: '#0f172a', fontWeight: 700, fontSize: 22 }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} md={8} lg={4}>
            <Card
              bordered={false}
              style={{
                borderRadius: 12,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                borderLeft: '4px solid #ec4899',
                background: '#ffffff'
              }}
              styles={{ body: { padding: '16px 20px' } }}
            >
              <Statistic
                title={<span style={{ fontSize: 13, color: '#64748b' }}>Mã khuyến mãi</span>}
                value={promoTotal}
                prefix={<GiftOutlined style={{ color: '#ec4899', marginRight: 6 }} />}
                valueStyle={{ color: '#0f172a', fontWeight: 700, fontSize: 22 }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} md={8} lg={4}>
            <Card
              bordered={false}
              style={{
                borderRadius: 12,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                borderLeft: '4px solid #06b6d4',
                background: '#ffffff'
              }}
              styles={{ body: { padding: '16px 20px' } }}
            >
              <Statistic
                title={<span style={{ fontSize: 13, color: '#64748b' }}>Nhân sự nội bộ</span>}
                value={empTotal}
                prefix={<TeamOutlined style={{ color: '#06b6d4', marginRight: 6 }} />}
                valueStyle={{ color: '#0f172a', fontWeight: 700, fontSize: 22 }}
              />
            </Card>
          </Col>
        </Row>

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
              onSearchChange={onProductSearchChange}
              onCategoryFilterChange={onProductCategoryFilterChange}
              onInStockFilterChange={onProductInStockFilterChange}
              onPageChange={onProductPageChange}
              onSaveProduct={onSaveProduct}
              onDeleteProduct={onDeleteProduct}
              onRefresh={onRefreshProducts}
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
