import React, { useState, useEffect, useCallback, useRef } from 'react';
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
import { INITIAL_ADMIN_PRODUCTS, ADMIN_METRICS } from './constants';
import { DISCOUNT_TYPES, ORDER_STATUS, PRODUCT_UNITS } from '../../../constants/enums';

export const AdminContainer = () => {
  const { user } = useAuthStore();
  const { addToast } = useToastStore();
  const userPosition = user?.position || 'STAFF';
  const isAdmin = userPosition === 'ADMIN';

  const [activeTab, setActiveTab] = useState('products');

  // 1. Products state
  const [products, setProducts] = useState([]);
  const [productSearch, setProductSearch] = useState('');
  const [isProductsLoading, setIsProductsLoading] = useState(false);

  // 2. Categories state
  const [categories, setCategories] = useState([]);

  // 3. Orders state (chuẩn PostgreSQL enum_donhang_trangthai)
  const [orders, setOrders] = useState([]);
  const [selectedAdminOrder, setSelectedAdminOrder] = useState(null);
  const [isOrderLoading, setIsOrderLoading] = useState(false);

  // 4. Promotions state
  const [promotions, setPromotions] = useState([]);

  // 5. Employees state & filter/pagination
  const [employees, setEmployees] = useState([]);
  const [empSearch, setEmpSearch] = useState('');
  const [empStatusFilter, setEmpStatusFilter] = useState(''); // '' | 'true' | 'false'
  const [empPositionFilter, setEmpPositionFilter] = useState(''); // '' | 'STAFF' | 'ADMIN'
  const [empPage, setEmpPage] = useState(1);
  const [empTotalPages, setEmpTotalPages] = useState(1);
  const [empTotalItems, setEmpTotalItems] = useState(0);
  const [isEmpLoading, setIsEmpLoading] = useState(false);

  // 6. Reviews state & filters
  const [reviews, setReviews] = useState([]);
  const [reviewKeyword, setReviewKeyword] = useState('');
  const [reviewRatingFilter, setReviewRatingFilter] = useState('');
  const [reviewStatusFilter, setReviewStatusFilter] = useState(''); // '' | 'false' (active) | 'true' (deleted)
  const [reviewPage, setReviewPage] = useState(1);
  const [reviewTotalPages, setReviewTotalPages] = useState(1);
  const [reviewTotalItems, setReviewTotalItems] = useState(0);
  const [isReviewsLoading, setIsReviewsLoading] = useState(false);

  // Fetch Products with keyword (Live Search from Database)
  const loadProducts = useCallback(async (keyword = '') => {
    setIsProductsLoading(true);
    try {
      const params = { limit: 50 };
      if (keyword.trim()) params.keyword = keyword.trim();
      const res = await productService.getProducts(params);
      if (res.data?.products) {
        setProducts(res.data.products);
      } else {
        setProducts([]);
      }
    } catch (err) {
      setProducts([]);
    } finally {
      setIsProductsLoading(false);
    }
  }, []);

  // Debounced product search
  const isInitialProductMount = useRef(true);
  useEffect(() => {
    if (activeTab !== 'products') return;

    if (isInitialProductMount.current) {
      isInitialProductMount.current = false;
      loadProducts(productSearch);
      return;
    }

    const timer = setTimeout(() => {
      loadProducts(productSearch);
    }, 350);

    return () => clearTimeout(timer);
  }, [productSearch, activeTab, loadProducts]);

  // Fetch Employees with filters & pagination
  const loadEmployees = useCallback(async () => {
    if (!isAdmin) return;
    setIsEmpLoading(true);
    try {
      const params = {
        page: empPage,
        limit: 10
      };
      if (empSearch.trim()) params.keyword = empSearch.trim();
      if (empPositionFilter) params.position = empPositionFilter;
      if (empStatusFilter !== '') params.status = empStatusFilter === 'true';

      const res = await employeeService.getEmployees(params);
      if (res.data?.employees) {
        setEmployees(res.data.employees);
        const total = res.data.total ?? res.data.employees.length;
        setEmpTotalItems(total);
        setEmpTotalPages(Math.ceil(total / 10) || 1);
      } else {
        setEmployees([]);
        setEmpTotalItems(0);
        setEmpTotalPages(1);
      }
    } catch (err) {
      addToast({
        type: 'error',
        message: err?.response?.data?.message || 'Không thể tải danh sách nhân viên từ máy chủ!'
      });
      setEmployees([]);
    } finally {
      setIsEmpLoading(false);
    }
  }, [isAdmin, empPage, empSearch, empPositionFilter, empStatusFilter, addToast]);

  // Debounced employee search/filter
  useEffect(() => {
    if (activeTab === 'employees' && isAdmin) {
      const timer = setTimeout(() => {
        loadEmployees();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [activeTab, isAdmin, empPage, empSearch, empPositionFilter, empStatusFilter, loadEmployees]);

  // Fetch Reviews with filters & pagination (Staff & Admin)
  const loadReviews = useCallback(async () => {
    setIsReviewsLoading(true);
    try {
      const params = {
        page: reviewPage,
        limit: 15
      };
      if (reviewKeyword.trim()) params.keyword = reviewKeyword.trim();
      if (reviewRatingFilter) params.rating = Number(reviewRatingFilter);
      if (reviewStatusFilter !== '') params.isDeleted = reviewStatusFilter === 'true';

      const res = await reviewService.getAllReviewsForModeration(params);
      if (res.data?.reviews) {
        setReviews(res.data.reviews);
        const total = res.data.total ?? res.data.reviews.length;
        setReviewTotalItems(total);
        setReviewTotalPages(Math.ceil(total / 15) || 1);
      } else {
        setReviews([]);
        setReviewTotalItems(0);
        setReviewTotalPages(1);
      }
    } catch (err) {
      addToast({
        type: 'error',
        message: err?.response?.data?.message || 'Không thể tải danh sách đánh giá!'
      });
      setReviews([]);
    } finally {
      setIsReviewsLoading(false);
    }
  }, [reviewPage, reviewKeyword, reviewRatingFilter, reviewStatusFilter, addToast]);

  // Debounced review search/filter
  useEffect(() => {
    if (activeTab === 'reviews') {
      const timer = setTimeout(() => {
        loadReviews();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [activeTab, reviewPage, reviewKeyword, reviewRatingFilter, reviewStatusFilter, loadReviews]);

  // Fetch Data according to active tab
  const loadData = useCallback(async () => {
    if (activeTab === 'products') {
      loadProducts(productSearch);
      try {
        const catRes = await categoryService.getCategories();
        const catList = catRes.data?.categories || (Array.isArray(catRes.data) ? catRes.data : []);
        setCategories(catList);
      } catch {}
    } else if (activeTab === 'categories') {
      try {
        const res = await categoryService.getCategories();
        const catList = res.data?.categories || (Array.isArray(res.data) ? res.data : []);
        setCategories(catList);
      } catch {}
    } else if (activeTab === 'orders') {
      try {
        const res = await orderService.getOrders({ limit: 50 });
        if (res.data?.items) setOrders(res.data.items);
        else setOrders([]);
      } catch (err) {
        setOrders([]);
      }
    } else if (activeTab === 'promotions' && isAdmin) {
      try {
        const res = await promotionService.getPromotions({ limit: 50 });
        if (res.data?.promotions) setPromotions(res.data.promotions);
      } catch {}
    } else if (activeTab === 'employees' && isAdmin) {
      loadEmployees();
    } else if (activeTab === 'reviews') {
      loadReviews();
    }
  }, [activeTab, isAdmin, productSearch, loadProducts, loadEmployees, loadReviews]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // --- Handlers: Products ---
  const handleSaveProduct = async (productData, editId) => {
    const formattedUnit = (productData.unit || 'KG').trim().toUpperCase();
    const sellingPrice = Number(productData.sellingPrice || productData.price || 0);
    const importPrice = Number(productData.importPrice || Math.round(sellingPrice * 0.8));
    // NCC02 exists in PostgreSQL database
    const supplierId = productData.supplierId || 'NCC02';

    try {
      if (editId) {
        const updatePayload = {
          productName: productData.productName,
          imageUrl: productData.imageUrl || '',
          categoryId: productData.categoryId,
          supplierId,
          unit: formattedUnit,
          expiryDate: productData.expiryDate || null,
          quantity: productData.stock !== '' && productData.stock !== undefined ? Number(productData.stock) : undefined
        };
        await productService.updateProduct(editId, updatePayload);
        addToast({ type: 'success', message: `Cập nhật sản phẩm "${productData.productName}" thành công!` });
      } else {
        const createPayload = {
          productId: productData.productId,
          productName: productData.productName,
          imageUrl: productData.imageUrl || '',
          expiryDate: productData.expiryDate || null,
          categoryId: productData.categoryId,
          supplierId,
          importPrice,
          vat: productData.vat || 0.08,
          sellingPrice,
          unit: formattedUnit,
          quantity: Number(productData.quantity || productData.stock || 0)
        };
        await productService.createProduct(createPayload);
        addToast({ type: 'success', message: `Thêm mới sản phẩm "${productData.productName}" thành công!` });
      }
      loadProducts(productSearch);
      return { success: true };
    } catch (err) {
      const errorMsg = err?.response?.data?.message || err?.message || 'Lỗi thao tác sản phẩm!';
      addToast({ type: 'error', message: errorMsg });
      return { success: false, error: errorMsg };
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${name}" (${id})?`)) return;
    try {
      await productService.deleteProduct(id);
      addToast({ type: 'info', message: `Đã xóa sản phẩm ${id} thành công!` });
      loadProducts(productSearch);
    } catch (err) {
      addToast({
        type: 'error',
        message: err?.response?.data?.message || `Lỗi xóa sản phẩm ${id}!`
      });
    }
  };

  // --- Handlers: Categories ---
  const handleSaveCategory = async (catData) => {
    try {
      await categoryService.createCategory(catData);
      addToast({ type: 'success', message: `Tạo danh mục "${catData.categoryName}" thành công!` });
      loadData();
      return { success: true };
    } catch (err) {
      const errorMsg = err?.response?.data?.message || 'Lỗi tạo danh mục!';
      addToast({ type: 'error', message: errorMsg });
      return { success: false, error: errorMsg };
    }
  };

  const handleDeleteCategory = async (id, name) => {
    if (!isAdmin) {
      addToast({ type: 'error', message: 'Chỉ Admin mới có quyền xóa danh mục!' });
      return;
    }
    if (!window.confirm(`Bạn có chắc chắn muốn xóa danh mục "${name}" (${id})?`)) return;
    try {
      await categoryService.deleteCategory(id);
      addToast({ type: 'info', message: `Đã xóa danh mục ${id} thành công!` });
      loadData();
    } catch (err) {
      addToast({
        type: 'error',
        message: err?.response?.data?.message || `Lỗi xóa danh mục ${id}!`
      });
    }
  };

  // --- Handlers: Orders & Detail ---
  const handleConfirmCod = async (orderId) => {
    try {
      await orderService.confirmCod(orderId);
      addToast({ type: 'success', message: `Đã xác nhận thu tiền COD cho đơn hàng ${orderId}!` });
      loadData();
    } catch (err) {
      addToast({
        type: 'error',
        message: err?.response?.data?.message || 'Lỗi xác nhận thu tiền COD!'
      });
    }
  };

  const handleViewOrderDetail = async (orderId) => {
    setIsOrderLoading(true);
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
    } finally {
      setIsOrderLoading(false);
    }
  };

  // --- Handlers: Promotions ---
  const handleSavePromotion = async (promoData) => {
    try {
      await promotionService.createPromotion(promoData);
      addToast({ type: 'success', message: `Tạo mã khuyến mãi ${promoData.promotionCode} thành công!` });
      loadData();
      return { success: true };
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
      loadData();
      return { success: true };
    } catch (err) {
      const errorMsg = err?.response?.data?.message || 'Lỗi cập nhật voucher!';
      addToast({ type: 'error', message: errorMsg });
      return { success: false, error: errorMsg };
    }
  };

  const handleDeletePromotion = async (code) => {
    if (!window.confirm(`Bạn có chắc muốn xóa khuyến mãi ${code}?`)) return;
    try {
      await promotionService.deletePromotion(code);
      addToast({ type: 'info', message: `Đã xóa khuyến mãi ${code}!` });
      loadData();
    } catch (err) {
      addToast({
        type: 'error',
        message: err?.response?.data?.message || `Lỗi xóa voucher ${code}!`
      });
    }
  };

  // --- Handlers: Reviews Moderation ---
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm(`Bạn có chắc muốn ẩn/xóa bài đánh giá #${reviewId}?`)) return;
    try {
      await reviewService.deleteReview(reviewId);
      addToast({ type: 'info', message: `Đã ẩn/xóa bài đánh giá #${reviewId}!` });
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

  // --- Handlers: Employees ---
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
      addToast({ type: 'success', message: `Cập nhật thông tin nhân viên ${id} thành công!` });
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

  return (
    <AdminLayout activeTab={activeTab} onTabChange={setActiveTab}>
      <DesktopAdmin
        activeTab={activeTab}
        metrics={ADMIN_METRICS}
        userPosition={userPosition}
        // Products
        products={products}
        productSearch={productSearch}
        setProductSearch={setProductSearch}
        isProductsLoading={isProductsLoading}
        onSaveProduct={handleSaveProduct}
        onDeleteProduct={handleDeleteProduct}
        // Categories
        categories={categories}
        onSaveCategory={handleSaveCategory}
        onDeleteCategory={handleDeleteCategory}
        // Orders
        orders={orders}
        selectedOrderDetail={selectedAdminOrder}
        isOrderLoading={isOrderLoading}
        onViewOrderDetail={handleViewOrderDetail}
        onCloseOrderDetail={() => setSelectedAdminOrder(null)}
        onConfirmCod={handleConfirmCod}
        // Promotions
        promotions={promotions}
        onSavePromotion={handleSavePromotion}
        onUpdatePromotion={handleUpdatePromotion}
        onDeletePromotion={handleDeletePromotion}
        // Employees
        employees={employees}
        empSearch={empSearch}
        setEmpSearch={setEmpSearch}
        empStatusFilter={empStatusFilter}
        setEmpStatusFilter={setEmpStatusFilter}
        empPositionFilter={empPositionFilter}
        setEmpPositionFilter={setEmpPositionFilter}
        empPage={empPage}
        setEmpPage={setEmpPage}
        empTotalPages={empTotalPages}
        empTotalItems={empTotalItems}
        isEmpLoading={isEmpLoading}
        onSaveEmployee={handleSaveEmployee}
        onUpdateEmployee={handleUpdateEmployee}
        onToggleEmployeeStatus={handleToggleEmployeeStatus}
        // Reviews Moderation
        reviews={reviews}
        reviewKeyword={reviewKeyword}
        setReviewKeyword={setReviewKeyword}
        reviewRatingFilter={reviewRatingFilter}
        setReviewRatingFilter={setReviewRatingFilter}
        reviewStatusFilter={reviewStatusFilter}
        setReviewStatusFilter={setReviewStatusFilter}
        reviewPage={reviewPage}
        setReviewPage={setReviewPage}
        reviewTotalPages={reviewTotalPages}
        reviewTotalItems={reviewTotalItems}
        isReviewsLoading={isReviewsLoading}
        onDeleteReview={handleDeleteReview}
        onReplyReview={handleReplyReview}
      />
    </AdminLayout>
  );
};

export default AdminContainer;

