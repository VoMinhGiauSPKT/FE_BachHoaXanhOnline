import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from '../../../stores/useAuthStore';
import useToastStore from '../../../stores/useToastStore';
import AdminLayout from '../../layout/common/AdminLayout';
import DesktopAdmin from '../../layout/desktop/admin';
import productService from '../../../services/productService';
import categoryService from '../../../services/categoryService';
import orderService from '../../../services/orderService';
import promotionService from '../../../services/promotionService';
import employeeService from '../../../services/employeeService';
import reviewService from '../../../services/reviewService';
import { PATHS } from '../../../constants/paths';

export const AdminContainer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { addToast } = useToastStore();
  const userPosition = user?.position || 'STAFF';
  const isAdmin = userPosition === 'ADMIN';

  // Xác định activeTab đồng bộ với pathname
  const getTabFromPath = useCallback(() => {
    const path = location.pathname;
    if (path.includes('/admin/categories')) return 'categories';
    if (path.includes('/admin/orders')) return 'orders';
    if (path.includes('/admin/promotions')) return 'promotions';
    if (path.includes('/admin/employees')) return 'employees';
    if (path.includes('/admin/reviews')) return 'reviews';
    return 'products';
  }, [location.pathname]);

  const [activeTab, setActiveTab] = useState(getTabFromPath);

  useEffect(() => {
    setActiveTab(getTabFromPath());
  }, [getTabFromPath]);

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    const pathMap = {
      products: PATHS.ADMIN.PRODUCTS,
      categories: PATHS.ADMIN.CATEGORIES,
      orders: PATHS.ADMIN.ORDERS,
      promotions: PATHS.ADMIN.PROMOTIONS,
      employees: PATHS.ADMIN.EMPLOYEES,
      reviews: PATHS.ADMIN.REVIEWS || '/admin/reviews'
    };
    if (pathMap[newTab]) {
      navigate(pathMap[newTab]);
    }
  };

  // ==========================================
  // 1. PRODUCTS STATE & PAGINATION
  // ==========================================
  const [products, setProducts] = useState([]);
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('');
  const [productInStockFilter, setProductInStockFilter] = useState('');
  const [productPage, setProductPage] = useState(1);
  const [productLimit, setProductLimit] = useState(20);
  const [productTotal, setProductTotal] = useState(0);
  const [isProductsLoading, setIsProductsLoading] = useState(false);

  const loadProducts = useCallback(async () => {
    setIsProductsLoading(true);
    try {
      const params = {
        page: productPage,
        limit: productLimit
      };
      if (productSearch.trim()) params.keyword = productSearch.trim();
      if (productCategoryFilter) params.categoryId = productCategoryFilter;
      if (productInStockFilter !== '') params.inStock = productInStockFilter === 'true';

      const res = await productService.getProducts(params);
      if (res.data?.products) {
        setProducts(res.data.products);
        setProductTotal(res.data.total ?? res.data.products.length);
      } else {
        setProducts([]);
        setProductTotal(0);
      }
    } catch (err) {
      console.warn('Lỗi tải sản phẩm:', err);
      setProducts([]);
      setProductTotal(0);
    } finally {
      setIsProductsLoading(false);
    }
  }, [productPage, productLimit, productSearch, productCategoryFilter, productInStockFilter]);

  // Debounced load for product search / filter
  const isInitialProductMount = useRef(true);
  useEffect(() => {
    if (activeTab !== 'products') return;

    if (isInitialProductMount.current) {
      isInitialProductMount.current = false;
      loadProducts();
      return;
    }

    const timer = setTimeout(() => {
      loadProducts();
    }, 350);

    return () => clearTimeout(timer);
  }, [activeTab, loadProducts]);

  const handleProductPageChange = (newPage, newLimit) => {
    setProductPage(newPage);
    if (newLimit && newLimit !== productLimit) {
      setProductLimit(newLimit);
      setProductPage(1);
    }
  };

  const handleSaveProduct = async (productData, editId) => {
    try {
      if (editId) {
        const updatePayload = {
          productName: productData.productName,
          imageUrl: productData.imageUrl || '',
          categoryId: productData.categoryId,
          supplierId: productData.supplierId || 'NCC02',
          unit: (productData.unit || 'KG').trim().toUpperCase(),
          expiryDate: productData.expiryDate || null,
          quantity: productData.stock !== undefined ? Number(productData.stock) : undefined
        };
        await productService.updateProduct(editId, updatePayload);
        addToast({ type: 'success', message: `Cập nhật sản phẩm "${productData.productName}" thành công!` });
      } else {
        const createPayload = {
          productId: productData.productId ? productData.productId.trim().toUpperCase() : undefined,
          productName: productData.productName,
          imageUrl: productData.imageUrl || '',
          expiryDate: productData.expiryDate || null,
          categoryId: productData.categoryId,
          supplierId: productData.supplierId || 'NCC02',
          importPrice: Number(productData.importPrice || 0),
          vat: Number(productData.vat || 0.08),
          sellingPrice: Number(productData.sellingPrice || productData.price || 0),
          unit: (productData.unit || 'KG').trim().toUpperCase(),
          quantity: Number(productData.stock || productData.quantity || 0)
        };
        await productService.createProduct(createPayload);
        addToast({ type: 'success', message: `Thêm mới sản phẩm "${productData.productName}" thành công!` });
      }
      loadProducts();
      return { success: true };
    } catch (err) {
      const errorMsg = err?.response?.data?.message || err?.message || 'Lỗi thao tác sản phẩm!';
      addToast({ type: 'error', message: errorMsg });
      return { success: false, error: errorMsg };
    }
  };

  const handleDeleteProduct = async (id, name) => {
    try {
      await productService.deleteProduct(id);
      addToast({ type: 'success', message: `Đã xóa sản phẩm "${name}" (${id})!` });
      loadProducts();
    } catch (err) {
      addToast({
        type: 'error',
        message: err?.response?.data?.message || `Lỗi xóa sản phẩm ${id}!`
      });
    }
  };

  // ==========================================
  // 2. CATEGORIES STATE
  // ==========================================
  const [categories, setCategories] = useState([]);
  const [isCategoryLoading, setIsCategoryLoading] = useState(false);

  const loadCategories = useCallback(async () => {
    setIsCategoryLoading(true);
    try {
      const res = await categoryService.getCategories();
      const catList = res.data?.categories || (Array.isArray(res.data) ? res.data : []);
      setCategories(catList);
    } catch (err) {
      console.warn('Lỗi tải danh mục:', err);
      setCategories([]);
    } finally {
      setIsCategoryLoading(false);
    }
  }, []);

  const handleSaveCategory = async (catData, editId) => {
    try {
      if (editId) {
        await categoryService.updateCategory(editId, catData);
        addToast({ type: 'success', message: `Cập nhật danh mục "${catData.categoryName}" thành công!` });
      } else {
        await categoryService.createCategory(catData);
        addToast({ type: 'success', message: `Tạo danh mục "${catData.categoryName}" thành công!` });
      }
      loadCategories();
      return { success: true };
    } catch (err) {
      const errorMsg = err?.response?.data?.message || 'Lỗi lưu danh mục!';
      addToast({ type: 'error', message: errorMsg });
      return { success: false, error: errorMsg };
    }
  };

  const handleDeleteCategory = async (id, name) => {
    if (!isAdmin) {
      addToast({ type: 'error', message: 'Chỉ Admin mới có quyền xóa danh mục!' });
      return;
    }
    try {
      await categoryService.deleteCategory(id);
      addToast({ type: 'success', message: `Đã xóa danh mục "${name}" (${id})!` });
      loadCategories();
    } catch (err) {
      addToast({
        type: 'error',
        message: err?.response?.data?.message || `Lỗi xóa danh mục ${id}!`
      });
    }
  };

  // ==========================================
  // 3. ORDERS STATE & PAGINATION
  // ==========================================
  const [orders, setOrders] = useState([]);
  const [orderPage, setOrderPage] = useState(1);
  const [orderLimit, setOrderLimit] = useState(20);
  const [orderTotal, setOrderTotal] = useState(0);
  const [selectedAdminOrder, setSelectedAdminOrder] = useState(null);
  const [isOrderLoading, setIsOrderLoading] = useState(false);

  const loadOrders = useCallback(async () => {
    setIsOrderLoading(true);
    try {
      const res = await orderService.getOrders({
        page: orderPage,
        limit: orderLimit
      });
      if (res.data?.items) {
        setOrders(res.data.items);
        const calculatedTotal = res.data.total ??
          (res.data.totalPages ? res.data.totalPages * orderLimit : res.data.items.length);
        setOrderTotal(calculatedTotal);
      } else {
        setOrders([]);
        setOrderTotal(0);
      }
    } catch (err) {
      console.warn('Lỗi tải đơn hàng:', err);
      setOrders([]);
      setOrderTotal(0);
    } finally {
      setIsOrderLoading(false);
    }
  }, [orderPage, orderLimit]);

  const handleOrderPageChange = (newPage, newLimit) => {
    setOrderPage(newPage);
    if (newLimit && newLimit !== orderLimit) {
      setOrderLimit(newLimit);
      setOrderPage(1);
    }
  };

  const handleConfirmCod = async (orderId) => {
    try {
      await orderService.confirmCod(orderId);
      addToast({ type: 'success', message: `Đã xác nhận thu tiền COD cho đơn hàng ${orderId}!` });
      loadOrders();
    } catch (err) {
      addToast({
        type: 'error',
        message: err?.response?.data?.message || 'Lỗi xác nhận thu tiền COD!'
      });
    }
  };

  const handleViewOrderDetail = async (orderId) => {
    try {
      const res = await orderService.getOrderById(orderId);
      if (res.data) {
        setSelectedAdminOrder(res.data);
      }
    } catch (err) {
      addToast({
        type: 'error',
        message: err?.response?.data?.message || 'Không thể tải chi tiết đơn hàng!'
      });
    }
  };

  // ==========================================
  // 4. PROMOTIONS STATE & PAGINATION
  // ==========================================
  const [promotions, setPromotions] = useState([]);
  const [promoKeyword, setPromoKeyword] = useState('');
  const [promoTypeFilter, setPromoTypeFilter] = useState('');
  const [promoPage, setPromoPage] = useState(1);
  const [promoLimit, setPromoLimit] = useState(20);
  const [promoTotal, setPromoTotal] = useState(0);
  const [isPromoLoading, setIsPromoLoading] = useState(false);

  const loadPromotions = useCallback(async () => {
    if (!isAdmin) return;
    setIsPromoLoading(true);
    try {
      const params = {
        page: promoPage,
        limit: promoLimit
      };
      if (promoKeyword.trim()) params.keyword = promoKeyword.trim();
      if (promoTypeFilter) params.type = promoTypeFilter;

      const res = await promotionService.getPromotions(params);
      if (res.data?.promotions) {
        setPromotions(res.data.promotions);
        setPromoTotal(res.data.total ?? res.data.promotions.length);
      } else {
        setPromotions([]);
        setPromoTotal(0);
      }
    } catch (err) {
      console.warn('Lỗi tải khuyến mãi:', err);
      setPromotions([]);
      setPromoTotal(0);
    } finally {
      setIsPromoLoading(false);
    }
  }, [isAdmin, promoPage, promoLimit, promoKeyword, promoTypeFilter]);

  const handlePromoPageChange = (newPage, newLimit) => {
    setPromoPage(newPage);
    if (newLimit && newLimit !== promoLimit) {
      setPromoLimit(newLimit);
      setPromoPage(1);
    }
  };

  const handleSavePromotion = async (promoData) => {
    try {
      const res = await promotionService.createPromotion(promoData);
      const code = res?.data?.promotionCode || promoData.promotionCode || '';
      addToast({ type: 'success', message: `Tạo mã khuyến mãi ${code ? code + ' ' : ''}thành công!` });
      loadPromotions();
      return { success: true, data: res?.data };
    } catch (err) {
      const errorMsg = err?.response?.data?.message || 'Lỗi tạo voucher!';
      addToast({ type: 'error', message: errorMsg });
      return { success: false, error: errorMsg };
    }
  };

  const handleUpdatePromotion = async (code, updateData) => {
    try {
      await promotionService.updatePromotion(code, updateData);
      addToast({ type: 'success', message: `Cập nhật mã khuyến mãi ${code} thành công!` });
      loadPromotions();
      return { success: true };
    } catch (err) {
      const errorMsg = err?.response?.data?.message || 'Lỗi cập nhật voucher!';
      addToast({ type: 'error', message: errorMsg });
      return { success: false, error: errorMsg };
    }
  };

  const handleDeletePromotion = async (code) => {
    try {
      await promotionService.deletePromotion(code);
      addToast({ type: 'success', message: `Đã xóa khuyến mãi ${code}!` });
      loadPromotions();
    } catch (err) {
      addToast({
        type: 'error',
        message: err?.response?.data?.message || `Lỗi xóa voucher ${code}!`
      });
    }
  };

  // ==========================================
  // 5. EMPLOYEES STATE & PAGINATION (ADMIN ONLY)
  // ==========================================
  const [employees, setEmployees] = useState([]);
  const [empSearch, setEmpSearch] = useState('');
  const [empPositionFilter, setEmpPositionFilter] = useState('');
  const [empStatusFilter, setEmpStatusFilter] = useState('');
  const [empPage, setEmpPage] = useState(1);
  const [empLimit, setEmpLimit] = useState(20);
  const [empTotal, setEmpTotal] = useState(0);
  const [isEmpLoading, setIsEmpLoading] = useState(false);

  const loadEmployees = useCallback(async () => {
    if (!isAdmin) return;
    setIsEmpLoading(true);
    try {
      const params = {
        page: empPage,
        limit: empLimit
      };
      if (empSearch.trim()) params.keyword = empSearch.trim();
      if (empPositionFilter) params.position = empPositionFilter;
      if (empStatusFilter !== '') params.status = empStatusFilter === 'true';

      const res = await employeeService.getEmployees(params);
      if (res.data?.employees) {
        setEmployees(res.data.employees);
        setEmpTotal(res.data.total ?? res.data.employees.length);
      } else {
        setEmployees([]);
        setEmpTotal(0);
      }
    } catch (err) {
      console.warn('Lỗi tải nhân viên:', err);
      setEmployees([]);
      setEmpTotal(0);
    } finally {
      setIsEmpLoading(false);
    }
  }, [isAdmin, empPage, empLimit, empSearch, empPositionFilter, empStatusFilter]);

  const handleEmpPageChange = (newPage, newLimit) => {
    setEmpPage(newPage);
    if (newLimit && newLimit !== empLimit) {
      setEmpLimit(newLimit);
      setEmpPage(1);
    }
  };

  const handleSaveEmployee = async (empData) => {
    try {
      await employeeService.createEmployee(empData);
      addToast({ type: 'success', message: `Tạo nhân viên "${empData.fullName}" thành công!` });
      loadEmployees();
      return { success: true };
    } catch (err) {
      const errorMsg = err?.response?.data?.message || err?.message || 'Lỗi tạo tài khoản nhân viên!';
      addToast({ type: 'error', message: errorMsg });
      return { success: false, error: errorMsg };
    }
  };

  const handleUpdateEmployee = async (id, updateData) => {
    try {
      await employeeService.updateEmployee(id, updateData);
      addToast({ type: 'success', message: `Cập nhật thông tin nhân viên thành công!` });
      loadEmployees();
      return { success: true };
    } catch (err) {
      const errorMsg = err?.response?.data?.message || err?.message || 'Lỗi cập nhật nhân viên!';
      addToast({ type: 'error', message: errorMsg });
      return { success: false, error: errorMsg };
    }
  };

  const handleToggleEmployeeStatus = async (id, newStatus) => {
    try {
      await employeeService.toggleEmployeeStatus(id, newStatus);
      addToast({
        type: 'success',
        message: newStatus ? `Đã kích hoạt lại tài khoản ${id}!` : `Đã khóa tài khoản ${id}!`
      });
      loadEmployees();
    } catch (err) {
      addToast({
        type: 'error',
        message: err?.response?.data?.message || 'Lỗi cập nhật trạng thái tài khoản!'
      });
    }
  };

  // ==========================================
  // 6. REVIEWS STATE & PAGINATION
  // ==========================================
  const [reviews, setReviews] = useState([]);
  const [reviewKeyword, setReviewKeyword] = useState('');
  const [reviewRatingFilter, setReviewRatingFilter] = useState('');
  const [reviewStatusFilter, setReviewStatusFilter] = useState('');
  const [reviewPage, setReviewPage] = useState(1);
  const [reviewLimit, setReviewLimit] = useState(20);
  const [reviewTotal, setReviewTotal] = useState(0);
  const [isReviewsLoading, setIsReviewsLoading] = useState(false);

  const loadReviews = useCallback(async () => {
    setIsReviewsLoading(true);
    try {
      const params = {
        page: reviewPage,
        limit: reviewLimit
      };
      if (reviewKeyword.trim()) params.keyword = reviewKeyword.trim();
      if (reviewRatingFilter) params.rating = Number(reviewRatingFilter);
      if (reviewStatusFilter !== '') params.isDeleted = reviewStatusFilter === 'true';

      const res = await reviewService.getAllReviewsForModeration(params);
      if (res.data?.reviews) {
        setReviews(res.data.reviews);
        setReviewTotal(res.data.total ?? res.data.reviews.length);
      } else {
        setReviews([]);
        setReviewTotal(0);
      }
    } catch (err) {
      console.warn('Lỗi tải đánh giá:', err);
      setReviews([]);
      setReviewTotal(0);
    } finally {
      setIsReviewsLoading(false);
    }
  }, [reviewPage, reviewLimit, reviewKeyword, reviewRatingFilter, reviewStatusFilter]);

  const handleReviewPageChange = (newPage, newLimit) => {
    setReviewPage(newPage);
    if (newLimit && newLimit !== reviewLimit) {
      setReviewLimit(newLimit);
      setReviewPage(1);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await reviewService.deleteReview(reviewId);
      addToast({ type: 'success', message: `Đã ẩn/xóa bài đánh giá #${reviewId}!` });
      loadReviews();
    } catch (err) {
      addToast({
        type: 'error',
        message: err?.response?.data?.message || `Lỗi xóa đánh giá #${reviewId}!`
      });
    }
  };

  const handleReplyReview = async (reviewId, replyText) => {
    try {
      await reviewService.replyReview(reviewId, replyText);
      addToast({ type: 'success', message: 'Phản hồi đánh giá thành công!' });
      loadReviews();
      return { success: true };
    } catch (err) {
      const errorMsg = err?.response?.data?.message || 'Lỗi gửi phản hồi!';
      addToast({ type: 'error', message: errorMsg });
      return { success: false, error: errorMsg };
    }
  };

  // Đồng bộ nạp dữ liệu khi đổi tab
  useEffect(() => {
    loadCategories(); // Luôn nạp danh mục phục vụ chọn ngành hàng ở các tab
    if (activeTab === 'products') {
      loadProducts();
    } else if (activeTab === 'orders') {
      loadOrders();
    } else if (activeTab === 'promotions' && isAdmin) {
      loadPromotions();
    } else if (activeTab === 'employees' && isAdmin) {
      loadEmployees();
    } else if (activeTab === 'reviews') {
      loadReviews();
    }
  }, [activeTab, isAdmin, loadProducts, loadCategories, loadOrders, loadPromotions, loadEmployees, loadReviews]);

  return (
    <AdminLayout activeTab={activeTab} onTabChange={handleTabChange}>
      <DesktopAdmin
        activeTab={activeTab}
        isAdmin={isAdmin}
        userPosition={userPosition}
        // Products
        products={products}
        productPage={productPage}
        productLimit={productLimit}
        productTotal={productTotal}
        productSearch={productSearch}
        productCategoryFilter={productCategoryFilter}
        productInStockFilter={productInStockFilter}
        isProductsLoading={isProductsLoading}
        onProductSearchChange={(val) => { setProductSearch(val); setProductPage(1); }}
        onProductCategoryFilterChange={(val) => { setProductCategoryFilter(val); setProductPage(1); }}
        onProductInStockFilterChange={(val) => { setProductInStockFilter(val); setProductPage(1); }}
        onProductPageChange={handleProductPageChange}
        onSaveProduct={handleSaveProduct}
        onDeleteProduct={handleDeleteProduct}
        onRefreshProducts={loadProducts}
        // Categories
        categories={categories}
        isCategoryLoading={isCategoryLoading}
        onSaveCategory={handleSaveCategory}
        onDeleteCategory={handleDeleteCategory}
        onRefreshCategories={loadCategories}
        // Orders
        orders={orders}
        orderPage={orderPage}
        orderLimit={orderLimit}
        orderTotal={orderTotal}
        isOrderLoading={isOrderLoading}
        selectedOrderDetail={selectedAdminOrder}
        onOrderPageChange={handleOrderPageChange}
        onViewOrderDetail={handleViewOrderDetail}
        onCloseOrderDetail={() => setSelectedAdminOrder(null)}
        onConfirmCod={handleConfirmCod}
        onRefreshOrders={loadOrders}
        // Promotions
        promotions={promotions}
        promoPage={promoPage}
        promoLimit={promoLimit}
        promoTotal={promoTotal}
        promoKeyword={promoKeyword}
        promoTypeFilter={promoTypeFilter}
        isPromoLoading={isPromoLoading}
        onPromoKeywordChange={(val) => { setPromoKeyword(val); setPromoPage(1); }}
        onPromoTypeFilterChange={(val) => { setPromoTypeFilter(val); setPromoPage(1); }}
        onPromoPageChange={handlePromoPageChange}
        onSavePromotion={handleSavePromotion}
        onUpdatePromotion={handleUpdatePromotion}
        onDeletePromotion={handleDeletePromotion}
        onRefreshPromotions={loadPromotions}
        // Employees
        employees={employees}
        empPage={empPage}
        empLimit={empLimit}
        empTotal={empTotal}
        empSearch={empSearch}
        empPositionFilter={empPositionFilter}
        empStatusFilter={empStatusFilter}
        isEmpLoading={isEmpLoading}
        onEmpSearchChange={(val) => { setEmpSearch(val); setEmpPage(1); }}
        onEmpPositionFilterChange={(val) => { setEmpPositionFilter(val); setEmpPage(1); }}
        onEmpStatusFilterChange={(val) => { setEmpStatusFilter(val); setEmpPage(1); }}
        onEmpPageChange={handleEmpPageChange}
        onSaveEmployee={handleSaveEmployee}
        onUpdateEmployee={handleUpdateEmployee}
        onToggleEmployeeStatus={handleToggleEmployeeStatus}
        onRefreshEmployees={loadEmployees}
        // Reviews
        reviews={reviews}
        reviewPage={reviewPage}
        reviewLimit={reviewLimit}
        reviewTotal={reviewTotal}
        reviewKeyword={reviewKeyword}
        reviewRatingFilter={reviewRatingFilter}
        reviewStatusFilter={reviewStatusFilter}
        isReviewsLoading={isReviewsLoading}
        onReviewKeywordChange={(val) => { setReviewKeyword(val); setReviewPage(1); }}
        onReviewRatingFilterChange={(val) => { setReviewRatingFilter(val); setReviewPage(1); }}
        onReviewStatusFilterChange={(val) => { setReviewStatusFilter(val); setReviewPage(1); }}
        onReviewPageChange={handleReviewPageChange}
        onDeleteReview={handleDeleteReview}
        onReplyReview={handleReplyReview}
        onRefreshReviews={loadReviews}
      />
    </AdminLayout>
  );
};

export default AdminContainer;
