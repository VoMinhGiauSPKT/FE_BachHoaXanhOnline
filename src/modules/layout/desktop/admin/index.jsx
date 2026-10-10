import React, { useState } from 'react';
import { formatVND } from '../../../../utils/formatCurrency';
import { formatDate } from '../../../../utils/formatDate';
import { formatPaymentMethod } from '../../../../utils/formatPayment';
import {
  DISCOUNT_TYPES,
  PRODUCT_UNITS,
  PRODUCT_UNIT_OPTIONS,
  ORDER_STATUS,
  ORDER_STATUS_LABELS
} from '../../../../constants/enums';
import employeeService from '../../../../services/employeeService';
import styles from './AdminDashboard.module.scss';

const SUPPLIERS = [
  { supplierId: 'NCC02', supplierName: 'Công ty C.P Việt Nam (NCC02)' },
  { supplierId: 'NCC020', supplierName: 'Công ty Cổ phần Sữa Vinamilk (NCC020)' }
];

export const DesktopAdmin = ({
  activeTab = 'products',
  metrics = [],
  userPosition = 'STAFF',
  // Product props
  products = [],
  productSearch = '',
  setProductSearch,
  isProductsLoading = false,
  onSaveProduct,
  onDeleteProduct,
  // Category props
  categories = [],
  onSaveCategory,
  onDeleteCategory,
  // Order props
  orders = [],
  selectedOrderDetail = null,
  isOrderLoading = false,
  onViewOrderDetail,
  onCloseOrderDetail,
  onConfirmCod,
  // Promotion props
  promotions = [],
  onSavePromotion,
  onUpdatePromotion,
  onDeletePromotion,
  // Employee props
  employees = [],
  empSearch = '',
  setEmpSearch,
  empStatusFilter = '',
  setEmpStatusFilter,
  empPositionFilter = '',
  setEmpPositionFilter,
  empPage = 1,
  setEmpPage,
  empTotalPages = 1,
  empTotalItems = 0,
  isEmpLoading = false,
  onSaveEmployee,
  onUpdateEmployee,
  onToggleEmployeeStatus,
  // Reviews Moderation props
  reviews = [],
  reviewKeyword = '',
  setReviewKeyword,
  reviewRatingFilter = '',
  setReviewRatingFilter,
  reviewStatusFilter = '',
  setReviewStatusFilter,
  reviewPage = 1,
  setReviewPage,
  reviewTotalPages = 1,
  reviewTotalItems = 0,
  isReviewsLoading = false,
  onDeleteReview,
  onReplyReview
}) => {
  const isAdmin = userPosition === 'ADMIN';

  // 1. Product Modal State
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    productId: '',
    productName: '',
    categoryId: 'DM01',
    supplierId: 'NCC02',
    price: '',
    stock: '',
    unit: PRODUCT_UNITS.KG,
    imageUrl: '',
    expiryDate: ''
  });
  const [productErrors, setProductErrors] = useState({});
  const [productGeneralError, setProductGeneralError] = useState('');
  const [isProductSubmitting, setIsProductSubmitting] = useState(false);

  // 2. Category Modal State
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryForm, setCategoryForm] = useState({
    categoryId: '',
    categoryName: '',
    profitMargin: 15
  });
  const [categoryErrors, setCategoryErrors] = useState({});
  const [categoryGeneralError, setCategoryGeneralError] = useState('');
  const [isCategorySubmitting, setIsCategorySubmitting] = useState(false);

  const getTodayDateStr = () => new Date().toISOString().slice(0, 10);
  const getDefaultEndDateStr = () => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().slice(0, 10);
  };

  // 3. Promotion Modal State (Tạo mới)
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [promoForm, setPromoForm] = useState({
    promotionCode: '',
    promotionName: '',
    discountType: DISCOUNT_TYPES.TIENMAT,
    discountValue: '',
    minOrderAmount: '',
    maxDiscount: '',
    usageLimit: 100,
    startDate: getTodayDateStr(),
    endDate: getDefaultEndDateStr()
  });
  const [promoErrors, setPromoErrors] = useState({});
  const [promoGeneralError, setPromoGeneralError] = useState('');
  const [isPromoSubmitting, setIsPromoSubmitting] = useState(false);

  // 3b. Promotion Edit Modal State (Cập nhật - PUT /promotion/:code)
  const [showEditPromoModal, setShowEditPromoModal] = useState(false);
  const [editingPromoCode, setEditingPromoCode] = useState('');
  const [editPromoForm, setEditPromoForm] = useState({
    promotionName: '',
    discountType: DISCOUNT_TYPES.TIENMAT,
    discountValue: '',
    minOrderAmount: '',
    maxDiscount: '',
    remainingUsage: 100,
    startDate: '',
    endDate: ''
  });
  const [editPromoErrors, setEditPromoErrors] = useState({});
  const [editPromoGeneralError, setEditPromoGeneralError] = useState('');
  const [isEditPromoSubmitting, setIsEditPromoSubmitting] = useState(false);

  // 4. Employee Modal (Tạo mới)
  const [showEmpModal, setShowEmpModal] = useState(false);
  const [empForm, setEmpForm] = useState({
    fullName: '',
    username: '',
    password: '',
    phoneNumber: '',
    position: 'STAFF'
  });
  const [empErrors, setEmpErrors] = useState({});
  const [empGeneralError, setEmpGeneralError] = useState('');
  const [isEmpSubmitting, setIsEmpSubmitting] = useState(false);

  // 5. Employee Detail & Edit Modal
  const [showDetailEmpModal, setShowDetailEmpModal] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [editEmpForm, setEditEmpForm] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    birthDate: '',
    position: 'STAFF',
    newPassword: ''
  });
  const [editEmpErrors, setEditEmpErrors] = useState({});
  const [editEmpGeneralError, setEditEmpGeneralError] = useState('');
  const [isEditEmpSubmitting, setIsEditEmpSubmitting] = useState(false);

  // 6. Review Detail & Reply Modal State
  const [selectedReviewDetail, setSelectedReviewDetail] = useState(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyingReview, setReplyingReview] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replyError, setReplyError] = useState('');
  const [isReplySubmitting, setIsReplySubmitting] = useState(false);


  // --- Handlers: Product Modal ---
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductErrors({});
    setProductGeneralError('');
    const catList = Array.isArray(categories) ? categories : (categories?.categories || []);
    setProductForm({
      productId: `SP0000${Date.now().toString().slice(-4)}`,
      productName: '',
      categoryId: catList[0]?.categoryId || 'DM01',
      supplierId: 'NCC02',
      price: '',
      stock: '',
      unit: PRODUCT_UNITS.KG,
      imageUrl: '',
      expiryDate: '2026-12-31'
    });
    setShowProductModal(true);
  };

  const handleOpenEditProduct = (prod) => {
    setEditingProduct(prod);
    setProductErrors({});
    setProductGeneralError('');
    const catList = Array.isArray(categories) ? categories : (categories?.categories || []);
    setProductForm({
      productId: prod.productId,
      productName: prod.productName,
      categoryId: prod.category?.categoryId || prod.categoryId || (catList[0]?.categoryId || 'DM01'),
      supplierId: prod.supplier?.supplierId || prod.supplierId || 'NCC02',
      price: prod.price ?? '',
      stock: prod.stock ?? '',
      unit: prod.unit ? prod.unit.toUpperCase() : PRODUCT_UNITS.KG,
      imageUrl: prod.imageUrl || '',
      expiryDate: prod.expiryDate || ''
    });
    setShowProductModal(true);
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!productForm.productId?.trim()) errors.productId = 'Mã sản phẩm không được để trống';
    if (!productForm.productName?.trim()) errors.productName = 'Tên sản phẩm không được để trống';
    if (!productForm.price || Number(productForm.price) <= 0) errors.price = 'Giá bán phải lớn hơn 0';
    if (productForm.stock === '' || Number(productForm.stock) < 0) errors.stock = 'Tồn kho không được nhỏ hơn 0';

    if (Object.keys(errors).length > 0) {
      setProductErrors(errors);
      return;
    }

    setIsProductSubmitting(true);
    setProductGeneralError('');
    try {
      const res = await onSaveProduct(
        {
          ...productForm,
          price: Number(productForm.price),
          stock: Number(productForm.stock)
        },
        editingProduct?.productId
      );
      if (res?.success) {
        setShowProductModal(false);
      } else if (res?.error) {
        setProductGeneralError(res.error);
      }
    } finally {
      setIsProductSubmitting(false);
    }
  };

  // --- Handlers: Category Modal ---
  const handleSubmitCategory = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!categoryForm.categoryId?.trim()) errors.categoryId = 'Mã danh mục không được để trống';
    if (!categoryForm.categoryName?.trim()) errors.categoryName = 'Tên danh mục không được để trống';

    if (Object.keys(errors).length > 0) {
      setCategoryErrors(errors);
      return;
    }

    setIsCategorySubmitting(true);
    setCategoryGeneralError('');
    try {
      const res = await onSaveCategory(categoryForm);
      if (res?.success) {
        setShowCategoryModal(false);
      } else if (res?.error) {
        setCategoryGeneralError(res.error);
      }
    } finally {
      setIsCategorySubmitting(false);
    }
  };

  // --- Handlers: Promotion Modal ---
  const handleSubmitPromotion = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!promoForm.promotionCode?.trim()) errors.promotionCode = 'Mã khuyến mãi không được để trống';
    if (!promoForm.promotionName?.trim()) errors.promotionName = 'Tên chương trình không được để trống';
    if (!promoForm.discountValue || Number(promoForm.discountValue) <= 0) errors.discountValue = 'Giá trị giảm phải lớn hơn 0';
    if (!promoForm.minOrderAmount || Number(promoForm.minOrderAmount) < 0) errors.minOrderAmount = 'Đơn tối thiểu không hợp lệ';

    const startDateStr = promoForm.startDate || getTodayDateStr();
    const endDateStr = promoForm.endDate || getDefaultEndDateStr();
    if (new Date(endDateStr) < new Date(startDateStr)) {
      errors.endDate = 'Ngày kết thúc phải bằng hoặc sau ngày bắt đầu';
    }

    if (Object.keys(errors).length > 0) {
      setPromoErrors(errors);
      return;
    }

    setIsPromoSubmitting(true);
    setPromoGeneralError('');
    try {
      const res = await onSavePromotion({
        ...promoForm,
        startDate: startDateStr,
        endDate: endDateStr,
        discountValue: Number(promoForm.discountValue),
        minOrderAmount: Number(promoForm.minOrderAmount),
        maxDiscount: promoForm.discountType === DISCOUNT_TYPES.PHANTRAM && promoForm.maxDiscount
          ? Number(promoForm.maxDiscount)
          : null
      });
      if (res?.success) {
        setShowPromoModal(false);
      } else if (res?.error) {
        setPromoGeneralError(res.error);
      }
    } finally {
      setIsPromoSubmitting(false);
    }
  };

  // --- Handlers: Edit Promotion Modal (PUT /promotion/:code) ---
  const handleOpenEditPromo = (promo) => {
    setEditingPromoCode(promo.promotionCode);
    setEditPromoForm({
      promotionName: promo.promotionName || '',
      discountType: promo.discountType || DISCOUNT_TYPES.TIENMAT,
      discountValue: promo.discountValue ?? '',
      minOrderAmount: promo.minOrderAmount ?? '',
      maxDiscount: promo.maxDiscount ?? promo.discountValue ?? '',
      remainingUsage: promo.remainingUsage ?? promo.usageLimit ?? 100,
      startDate: promo.startDate ? promo.startDate.slice(0, 10) : '',
      endDate: promo.endDate ? promo.endDate.slice(0, 10) : ''
    });
    setEditPromoErrors({});
    setEditPromoGeneralError('');
    setShowEditPromoModal(true);
  };

  const handleSubmitEditPromotion = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!editPromoForm.promotionName?.trim()) errors.promotionName = 'Tên chương trình không được để trống';
    if (!editPromoForm.endDate) errors.endDate = 'Ngày kết thúc không được để trống';

    if (Object.keys(errors).length > 0) {
      setEditPromoErrors(errors);
      return;
    }

    setIsEditPromoSubmitting(true);
    setEditPromoGeneralError('');
    try {
      const res = await onUpdatePromotion(editingPromoCode, {
        promotionName: editPromoForm.promotionName,
        maxDiscount: editPromoForm.maxDiscount ? Number(editPromoForm.maxDiscount) : null,
        remainingUsage: Number(editPromoForm.remainingUsage || 100),
        endDate: editPromoForm.endDate
      });
      if (res?.success) {
        setShowEditPromoModal(false);
      } else if (res?.error) {
        setEditPromoGeneralError(res.error);
      }
    } finally {
      setIsEditPromoSubmitting(false);
    }
  };

  // --- Handlers: Reply Review Modal (POST /review/:id/reply) ---
  const handleOpenReplyModal = (rev) => {
    setReplyingReview(rev);
    setReplyText(rev.phanHoi || rev.reply || '');
    setReplyError('');
    setShowReplyModal(true);
  };

  const handleSubmitReply = async (e) => {
    e.preventDefault();
    if (!replyText?.trim()) {
      setReplyError('Vui lòng nhập nội dung phản hồi');
      return;
    }
    setIsReplySubmitting(true);
    setReplyError('');
    try {
      const revId = replyingReview?.id || replyingReview?.maDanhGia || replyingReview?.reviewId;
      await onReplyReview(revId, replyText.trim());
      setShowReplyModal(false);
    } catch (err) {
      setReplyError(err?.message || 'Lỗi gửi phản hồi');
    } finally {
      setIsReplySubmitting(false);
    }
  };

  // --- Handlers: Employee Modal (Create) ---
  const handleOpenAddEmployee = () => {
    setEmpForm({
      fullName: '',
      username: '',
      password: '',
      phoneNumber: '',
      position: 'STAFF'
    });
    setEmpErrors({});
    setEmpGeneralError('');
    setShowEmpModal(true);
  };

  const handleSubmitEmployee = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!empForm.fullName?.trim()) errors.fullName = 'Họ và tên không được để trống';
    if (!empForm.username?.trim()) {
      errors.username = 'Tên đăng nhập không được để trống';
    } else if (empForm.username.trim().length < 3) {
      errors.username = 'Tên đăng nhập phải có ít nhất 3 ký tự';
    }
    if (!empForm.password?.trim()) {
      errors.password = 'Mật khẩu khởi tạo không được để trống';
    } else if (empForm.password.length < 6) {
      errors.password = 'Mật khẩu phải từ 6 ký tự trở lên';
    }
    const phoneRegex = /^(0|\+84)[0-9]{9}$/;
    if (!empForm.phoneNumber?.trim()) {
      errors.phoneNumber = 'Số điện thoại không được để trống';
    } else if (!phoneRegex.test(empForm.phoneNumber.trim())) {
      errors.phoneNumber = 'Số điện thoại không đúng định dạng (VD: 0987654321)';
    }

    if (Object.keys(errors).length > 0) {
      setEmpErrors(errors);
      return;
    }

    setIsEmpSubmitting(true);
    setEmpGeneralError('');
    try {
      const res = await onSaveEmployee(empForm);
      if (res?.success) {
        setShowEmpModal(false);
      } else if (res?.error) {
        const msg = res.error;
        if (msg.includes('đăng nhập') || msg.toLowerCase().includes('username')) {
          setEmpErrors({ username: msg });
        } else if (msg.includes('thoại') || msg.toLowerCase().includes('phone')) {
          setEmpErrors({ phoneNumber: msg });
        } else {
          setEmpGeneralError(msg);
        }
      }
    } finally {
      setIsEmpSubmitting(false);
    }
  };

  // --- Handlers: Employee Detail & Edit Modal ---
  const handleOpenDetailEmp = async (emp) => {
    setSelectedEmp(emp);
    setEditEmpErrors({});
    setEditEmpGeneralError('');
    setEditEmpForm({
      fullName: emp.fullName || '',
      email: emp.email || '',
      phoneNumber: emp.phoneNumber || '',
      birthDate: emp.birthDate || '',
      position: emp.position || 'STAFF',
      newPassword: ''
    });
    setShowDetailEmpModal(true);

    // Fetch full details if needed
    try {
      const res = await employeeService.getEmployeeById(emp.employeeId);
      if (res.data) {
        setSelectedEmp((prev) => ({ ...prev, ...res.data }));
        setEditEmpForm({
          fullName: res.data.fullName || emp.fullName || '',
          email: res.data.email || emp.email || '',
          phoneNumber: res.data.phoneNumber || emp.phoneNumber || '',
          birthDate: res.data.birthDate || '',
          position: res.data.position || emp.position || 'STAFF',
          newPassword: ''
        });
      }
    } catch {}
  };

  const handleSubmitEditEmp = async (e) => {
    e.preventDefault();
    if (!selectedEmp) return;

    const errors = {};
    if (!editEmpForm.fullName?.trim()) errors.fullName = 'Họ và tên không được để trống';

    if (editEmpForm.phoneNumber?.trim()) {
      const phoneRegex = /^(0|\+84)[0-9]{9}$/;
      if (!phoneRegex.test(editEmpForm.phoneNumber.trim())) {
        errors.phoneNumber = 'Số điện thoại không đúng định dạng (VD: 0987654321)';
      }
    }
    if (editEmpForm.email?.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(editEmpForm.email.trim())) {
        errors.email = 'Email không đúng định dạng';
      }
    }
    if (editEmpForm.newPassword?.trim() && editEmpForm.newPassword.length < 6) {
      errors.newPassword = 'Mật khẩu mới phải từ 6 ký tự trở lên';
    }

    if (Object.keys(errors).length > 0) {
      setEditEmpErrors(errors);
      return;
    }

    setIsEditEmpSubmitting(true);
    setEditEmpGeneralError('');
    try {
      const payload = {
        fullName: editEmpForm.fullName.trim(),
        email: editEmpForm.email?.trim() || null,
        phoneNumber: editEmpForm.phoneNumber?.trim() || null,
        birthDate: editEmpForm.birthDate || null,
        position: editEmpForm.position
      };
      if (editEmpForm.newPassword?.trim()) {
        payload.newPassword = editEmpForm.newPassword.trim();
      }

      const res = await onUpdateEmployee(selectedEmp.employeeId, payload);
      if (res?.success) {
        setShowDetailEmpModal(false);
      } else if (res?.error) {
        setEditEmpGeneralError(res.error);
      }
    } finally {
      setIsEditEmpSubmitting(false);
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* 1. TAB: SẢN PHẨM & TỔNG QUAN */}
      {activeTab === 'products' && (
        <>
          {/* Thẻ chỉ số tổng quan */}
          <section className={styles.metricsGrid}>
            {metrics.map((m, idx) => (
              <div key={idx} className={styles.metricCard}>
                <div className={styles.info}>
                  <div className={styles.value} style={{ color: m.color }}>
                    {m.value}
                  </div>
                  <div className={styles.label}>{m.label}</div>
                </div>
                <div className={styles.iconCircle}>
                  <span>{m.icon}</span>
                </div>
              </div>
            ))}
          </section>

          {/* Bảng Quản lý Sản phẩm */}
          <section className={styles.tableCard}>
            <div className={styles.cardHeader}>
              <div className={styles.titleArea}>
                <h2>📦 Quản Lý Kho & Sản Phẩm FreshMart</h2>
                <p>Quyền hạn hiện tại: <strong>{userPosition}</strong> (Hỗ trợ Thêm, Sửa, Xóa)</p>
              </div>

              <div className={styles.actionArea}>
                <input
                  type="text"
                  className={styles.searchBar}
                  placeholder="Tìm theo mã hoặc tên SP..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                />
                <button
                  type="button"
                  className={styles.addBtn}
                  onClick={handleOpenAddProduct}
                >
                  + Thêm sản phẩm mới
                </button>
              </div>
            </div>

            <div className={styles.tableWrapper}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>Mã SP</th>
                    <th>Tên sản phẩm</th>
                    <th>Danh mục</th>
                    <th>Đơn giá</th>
                    <th>Đơn vị</th>
                    <th>Tồn kho</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {isProductsLoading ? (
                    <tr>
                      <td colSpan="8" style={{ textAlign: 'center', padding: '32px' }}>
                        Đang tìm kiếm sản phẩm trong cơ sở dữ liệu...
                      </td>
                    </tr>
                  ) : products.length === 0 ? (
                    <tr>
                      <td colSpan="8" style={{ textAlign: 'center', padding: '32px' }}>
                        Không tìm thấy sản phẩm nào!
                      </td>
                    </tr>
                  ) : (
                    products.map((p) => {
                      const stockVal = p.stock ?? 0;
                      return (
                        <tr key={p.productId}>
                          <td><strong>{p.productId}</strong></td>
                          <td>{p.productName}</td>
                          <td>{p.category?.categoryName || p.categoryName || 'Nông sản'}</td>
                          <td><strong>{formatVND(p.price)}</strong></td>
                          <td>{p.unit}</td>
                          <td><strong>{stockVal}</strong></td>
                          <td>
                            {stockVal > 15 ? (
                              <span className={`${styles.badge} ${styles.active}`}>Đang kinh doanh</span>
                            ) : stockVal > 0 ? (
                              <span className={`${styles.badge} ${styles.lowStock}`}>Sắp hết hàng</span>
                            ) : (
                              <span className={`${styles.badge} ${styles.outOfStock}`}>Hết hàng</span>
                            )}
                          </td>
                          <td>
                            <div className={styles.actionBtns}>
                              <button
                                type="button"
                                className={styles.editBtn}
                                onClick={() => handleOpenEditProduct(p)}
                              >
                                Sửa
                              </button>
                              <button
                                type="button"
                                className={styles.deleteBtn}
                                onClick={() => onDeleteProduct(p.productId, p.productName)}
                              >
                                Xóa
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      {/* 2. TAB: QUẢN LÝ DANH MỤC */}
      {activeTab === 'categories' && (
        <section className={styles.tableCard}>
          <div className={styles.cardHeader}>
            <div className={styles.titleArea}>
              <h2>🏷️ Quản Lý Danh Mục Ngành Hàng</h2>
              <p>Phân loại ngành hàng nông sản, thực phẩm tươi sống, sữa và nhu yếu phẩm</p>
            </div>
            <button
              type="button"
              className={styles.addBtn}
              onClick={() => {
                setCategoryForm({
                  categoryId: `DM0${categories.length + 1}`,
                  categoryName: '',
                  profitMargin: 15
                });
                setCategoryErrors({});
                setCategoryGeneralError('');
                setShowCategoryModal(true);
              }}
            >
              + Thêm danh mục mới
            </button>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Mã Danh Mục</th>
                  <th>Tên Danh Mục</th>
                  <th>Tỷ Suất Lợi Nhuận</th>
                  <th>Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '32px' }}>
                      Chưa có danh mục nào.
                    </td>
                  </tr>
                ) : (
                  categories.map((c) => (
                    <tr key={c.categoryId}>
                      <td><strong>{c.categoryId}</strong></td>
                      <td>{c.categoryName}</td>
                      <td>{c.profitMargin || 15}%</td>
                      <td>
                        <div className={styles.actionBtns}>
                          {isAdmin && (
                            <button
                              type="button"
                              className={styles.deleteBtn}
                              onClick={() => onDeleteCategory(c.categoryId, c.categoryName)}
                            >
                              Xóa (Admin)
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* 3. TAB: QUẢN LÝ ĐƠN HÀNG & THU COD */}
      {activeTab === 'orders' && (
        <section className={styles.tableCard}>
          <div className={styles.cardHeader}>
            <div className={styles.titleArea}>
              <h2>📑 Quản Lý Đơn Hàng & Thu Tiền COD</h2>
              <p>Xác nhận thu tiền khi giao hàng thành công (chuyển trạng thái sang DATHANHTOAN)</p>
            </div>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Mã Đơn Hàng</th>
                  <th>Ngày Đặt</th>
                  <th>Tổng Tiền</th>
                  <th>Phương Thức</th>
                  <th>Trạng Thái</th>
                  <th>Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '32px' }}>
                      Hiện tại không có đơn hàng nào trong hệ thống!
                    </td>
                  </tr>
                ) : (
                  orders.map((o) => {
                    const isPaid = o.trangThai === ORDER_STATUS.DATHANHTOAN;
                    return (
                      <tr key={o.maDonHang}>
                        <td><strong>{o.maDonHang}</strong></td>
                        <td>{formatDate(o.ngayLap, true)}</td>
                        <td><strong>{formatVND(o.tongTien)}</strong></td>
                        <td>{formatPaymentMethod(o.phuongThucTT)}</td>
                        <td>
                          {isPaid ? (
                            <span className={`${styles.badge} ${styles.paid}`}>
                              {ORDER_STATUS_LABELS.DATHANHTOAN}
                            </span>
                          ) : (
                            <span className={`${styles.badge} ${styles.pending}`}>
                              {ORDER_STATUS_LABELS.CHUATHANHTOAN}
                            </span>
                          )}
                        </td>
                        <td>
                          <div className={styles.actionBtns}>
                            <button
                              type="button"
                              className={styles.viewDetailBtn}
                              onClick={() => onViewOrderDetail(o.maDonHang)}
                            >
                              👁️ Chi tiết
                            </button>
                            {!isPaid ? (
                              <button
                                type="button"
                                className={styles.confirmCodBtn}
                                onClick={() => onConfirmCod(o.maDonHang)}
                              >
                                ✓ Thu COD
                              </button>
                            ) : (
                              <span style={{ fontSize: '13px', color: '#10b981', fontWeight: 600 }}>
                                ✓ Đã thanh toán
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* 4. TAB: KHUYẾN MÃI (ADMIN ONLY) */}
      {activeTab === 'promotions' && isAdmin && (
        <section className={styles.tableCard}>
          <div className={styles.cardHeader}>
            <div className={styles.titleArea}>
              <h2>🎁 Quản Lý Chương Trình Khuyến Mãi (Admin)</h2>
              <p>Tạo và quản lý các mã giảm giá cho khách hàng</p>
            </div>
            <button
              type="button"
              className={styles.addBtn}
              onClick={() => {
                setPromoForm({
                  promotionCode: '',
                  promotionName: '',
                  discountType: DISCOUNT_TYPES.TIENMAT,
                  discountValue: '',
                  minOrderAmount: '',
                  maxDiscount: '',
                  usageLimit: 100,
                  startDate: getTodayDateStr(),
                  endDate: getDefaultEndDateStr()
                });
                setPromoErrors({});
                setPromoGeneralError('');
                setShowPromoModal(true);
              }}
            >
              + Tạo voucher mới
            </button>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Mã Voucher</th>
                  <th>Tên Chương Trình</th>
                  <th>Loại</th>
                  <th>Giá Trị</th>
                  <th>Giảm Tối Đa</th>
                  <th>Đơn Tối Thiểu</th>
                  <th>Lượt Còn Lại</th>
                  <th>Hạn Dùng</th>
                  <th>Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {promotions.length === 0 ? (
                  <tr>
                    <td colSpan="9" style={{ textAlign: 'center', padding: '32px' }}>
                      Chưa có khuyến mãi nào.
                    </td>
                  </tr>
                ) : (
                  promotions.map((p) => (
                    <tr key={p.promotionCode}>
                      <td><strong className={styles.promoCodeText}>{p.promotionCode}</strong></td>
                      <td>{p.promotionName}</td>
                      <td>{p.discountType === DISCOUNT_TYPES.PHANTRAM ? 'Phần trăm (%)' : 'Tiền mặt (VND)'}</td>
                      <td>{p.discountType === DISCOUNT_TYPES.PHANTRAM ? `${p.discountValue}%` : formatVND(p.discountValue)}</td>
                      <td>{p.discountType === DISCOUNT_TYPES.PHANTRAM && p.maxDiscount ? formatVND(p.maxDiscount) : '-'}</td>
                      <td>{formatVND(p.minOrderAmount)}</td>
                      <td><strong>{p.remainingUsage ?? p.usageLimit ?? 100}</strong></td>
                      <td>{formatDate(p.endDate)}</td>
                      <td>
                        <div className={styles.actionBtns}>
                          <button
                            type="button"
                            className={styles.editBtn}
                            onClick={() => handleOpenEditPromo(p)}
                          >
                            ✏️ Sửa
                          </button>
                          <button
                            type="button"
                            className={styles.deleteBtn}
                            onClick={() => onDeletePromotion(p.promotionCode)}
                          >
                            🗑️ Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* 5. TAB: NHÂN VIÊN (ADMIN ONLY) */}
      {activeTab === 'employees' && isAdmin && (
        <section className={styles.tableCard}>
          <div className={styles.cardHeader}>
            <div className={styles.titleArea}>
              <h2>👥 Quản Lý Tài Khoản Nhân Viên (Admin)</h2>
              <p>Quản lý danh sách nhân sự, phân quyền STAFF / ADMIN, khóa / mở khóa tài khoản</p>
            </div>
            <button
              type="button"
              className={styles.addBtn}
              onClick={handleOpenAddEmployee}
            >
              + Tạo tài khoản nhân viên
            </button>
          </div>

          {/* Thanh tìm kiếm và bộ lọc trạng thái / chức vụ */}
          <div className={styles.filterBar}>
            <div className={styles.filterLeft}>
              <div className={styles.searchBox}>
                <span className={styles.searchIcon}>🔍</span>
                <input
                  type="text"
                  placeholder="Tìm theo tên, username, số điện thoại..."
                  value={empSearch}
                  onChange={(e) => {
                    setEmpSearch(e.target.value);
                    setEmpPage(1);
                  }}
                />
              </div>

              <select
                className={styles.filterSelect}
                value={empStatusFilter}
                onChange={(e) => {
                  setEmpStatusFilter(e.target.value);
                  setEmpPage(1);
                }}
              >
                <option value="">Tất cả trạng thái</option>
                <option value="true">Đang hoạt động</option>
                <option value="false">Đã khóa</option>
              </select>

              <select
                className={styles.filterSelect}
                value={empPositionFilter}
                onChange={(e) => {
                  setEmpPositionFilter(e.target.value);
                  setEmpPage(1);
                }}
              >
                <option value="">Tất cả chức vụ</option>
                <option value="STAFF">STAFF (Nhân viên)</option>
                <option value="ADMIN">ADMIN (Quản trị)</option>
              </select>
            </div>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Mã NV</th>
                  <th>Họ và Tên</th>
                  <th>Username</th>
                  <th>Số Điện Thoại</th>
                  <th>Chức Vụ</th>
                  <th>Trạng Thái</th>
                  <th>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {isEmpLoading ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '32px' }}>
                      Đang tải danh sách nhân viên từ hệ thống...
                    </td>
                  </tr>
                ) : employees.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '32px' }}>
                      Không tìm thấy tài khoản nhân viên nào phù hợp!
                    </td>
                  </tr>
                ) : (
                  employees.map((e) => {
                    const isActive = e.status !== false;
                    return (
                      <tr key={e.employeeId}>
                        <td><strong>{e.employeeId}</strong></td>
                        <td>{e.fullName}</td>
                        <td>{e.username}</td>
                        <td>{e.phoneNumber || '---'}</td>
                        <td>
                          <span className={e.position === 'ADMIN' ? styles.adminBadge : styles.staffBadge}>
                            {e.position}
                          </span>
                        </td>
                        <td>
                          {isActive ? (
                            <span className={`${styles.badge} ${styles.active}`}>Đang hoạt động</span>
                          ) : (
                            <span className={`${styles.badge} ${styles.outOfStock}`}>Đã khóa</span>
                          )}
                        </td>
                        <td>
                          <div className={styles.actionBtns}>
                            <button
                              type="button"
                              className={styles.viewDetailBtn}
                              onClick={() => handleOpenDetailEmp(e)}
                              title="Xem chi tiết và cập nhật thông tin"
                            >
                              ✏️ Chi tiết / Sửa
                            </button>
                            {isActive ? (
                              <button
                                type="button"
                                className={styles.lockBtn}
                                onClick={() => onToggleEmployeeStatus(e.employeeId, false)}
                                title="Khóa tài khoản nhân viên"
                              >
                                🔒 Khóa tài khoản
                              </button>
                            ) : (
                              <button
                                type="button"
                                className={styles.unlockBtn}
                                onClick={() => onToggleEmployeeStatus(e.employeeId, true)}
                                title="Mở khóa tài khoản nhân viên"
                              >
                                🔓 Mở khóa
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Thanh phân trang nhân viên */}
          <div className={styles.paginationBar}>
            <span>
              Hiển thị <strong>{employees.length}</strong> / <strong>{empTotalItems}</strong> nhân viên (Trang {empPage}/{empTotalPages})
            </span>
            <div className={styles.pageBtns}>
              <button
                type="button"
                disabled={empPage <= 1}
                onClick={() => setEmpPage((p) => Math.max(1, p - 1))}
              >
                ◀ Trước
              </button>
              {Array.from({ length: empTotalPages }, (_, i) => i + 1).map((pNum) => (
                <button
                  key={pNum}
                  type="button"
                  className={empPage === pNum ? styles.activePage : ''}
                  onClick={() => setEmpPage(pNum)}
                >
                  {pNum}
                </button>
              ))}
              <button
                type="button"
                disabled={empPage >= empTotalPages}
                onClick={() => setEmpPage((p) => Math.min(empTotalPages, p + 1))}
              >
                Sau ▶
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 6. TAB: QUẢN LÝ ĐÁNH GIÁ (NV & ADMIN) */}
      {activeTab === 'reviews' && (
        <section className={styles.tableCard}>
          <div className={styles.cardHeader}>
            <div className={styles.titleArea}>
              <h2>⭐ Kiểm Duyệt & Phản Hồi Đánh Giá</h2>
              <p>Xem toàn bộ đánh giá của khách hàng trong hệ thống, tìm kiếm, lọc theo sao/trạng thái và gửi phản hồi</p>
            </div>
          </div>

          {/* Thanh tìm kiếm và bộ lọc */}
          <div className={styles.filterBar}>
            <div className={styles.filterLeft}>
              <div className={styles.searchBox}>
                <span className={styles.searchIcon}>🔍</span>
                <input
                  type="text"
                  placeholder="Tìm theo nội dung đánh giá, khách hàng, sản phẩm..."
                  value={reviewKeyword}
                  onChange={(e) => {
                    setReviewKeyword(e.target.value);
                    setReviewPage(1);
                  }}
                />
              </div>

              <select
                className={styles.filterSelect}
                value={reviewRatingFilter}
                onChange={(e) => {
                  setReviewRatingFilter(e.target.value);
                  setReviewPage(1);
                }}
              >
                <option value="">Tất cả số sao</option>
                <option value="5">⭐⭐⭐⭐⭐ 5 sao</option>
                <option value="4">⭐⭐⭐⭐ 4 sao</option>
                <option value="3">⭐⭐⭐ 3 sao</option>
                <option value="2">⭐⭐ 2 sao</option>
                <option value="1">⭐ 1 sao</option>
              </select>

              <select
                className={styles.filterSelect}
                value={reviewStatusFilter}
                onChange={(e) => {
                  setReviewStatusFilter(e.target.value);
                  setReviewPage(1);
                }}
              >
                <option value="">Tất cả trạng thái</option>
                <option value="false">Hiển thị công khai</option>
                <option value="true">Đã ẩn / Đã xóa</option>
              </select>
            </div>

            <div className={styles.filterRight}>
              <span className={styles.recordCount}>
                Tổng cộng: <strong>{reviewTotalItems}</strong> đánh giá
              </span>
            </div>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Mã / Ngày</th>
                  <th>Sản Phẩm</th>
                  <th>Khách Hàng</th>
                  <th>Đánh Giá</th>
                  <th>Nội Dung</th>
                  <th>Phản Hồi Cửa Hàng</th>
                  <th>Trạng Thái</th>
                  <th>Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {isReviewsLoading ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '32px' }}>
                      Đang tải danh sách đánh giá...
                    </td>
                  </tr>
                ) : reviews.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '32px' }}>
                      Không tìm thấy đánh giá nào phù hợp!
                    </td>
                  </tr>
                ) : (
                  reviews.map((rev) => {
                    const revId = rev.id || rev.maDanhGia || rev.reviewId;
                    const custName = rev.customer?.fullName || rev.customerName || rev.tenKhachHang || 'Khách hàng';
                    const custId = rev.customer?.customerId || rev.customerId;
                    const prodName = rev.product?.productName || rev.productName || rev.tenSanPham || rev.productId;
                    const prodId = rev.product?.productId || rev.productId;
                    const hasReply = Boolean(rev.reply || rev.phanHoi);
                    return (
                      <tr key={revId}>
                        <td>
                          <div><strong>#{revId}</strong></div>
                          <small style={{ color: '#64748b' }}>{formatDate(rev.createdAt || rev.ngayTao, true)}</small>
                        </td>
                        <td>
                          <strong>{prodName}</strong>
                          {prodId && <div style={{ fontSize: '11px', color: '#64748b' }}>Mã: {prodId}</div>}
                        </td>
                        <td>
                          <strong>{custName}</strong>
                          {custId && <div style={{ fontSize: '11px', color: '#64748b' }}>ID: {custId}</div>}
                        </td>
                        <td>
                          <span style={{ color: '#f59e0b', fontWeight: 600 }}>
                            {'★'.repeat(rev.rating || rev.soSao || 5)}{'☆'.repeat(5 - (rev.rating || rev.soSao || 5))}
                          </span>
                          <span style={{ marginLeft: '4px', fontSize: '12px' }}>({rev.rating || rev.soSao}/5)</span>
                        </td>
                        <td style={{ maxWidth: '240px' }}>
                          <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: '13px' }}>
                            {rev.comment || rev.noiDung}
                          </div>
                        </td>
                        <td style={{ maxWidth: '240px' }}>
                          {hasReply ? (
                            <div className={styles.replyPreviewBox}>
                              <div style={{ fontWeight: 600, fontSize: '12px', color: '#007042' }}>🏪 Bách Hóa Xanh:</div>
                              <div style={{ fontSize: '12px', color: '#334155', marginTop: '2px' }}>
                                {rev.reply || rev.phanHoi}
                              </div>
                              {(rev.repliedAt || rev.ngayPhanHoi) && (
                                <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px' }}>
                                  {formatDate(rev.repliedAt || rev.ngayPhanHoi, true)}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span style={{ color: '#94a3b8', fontSize: '12px', fontStyle: 'italic' }}>Chưa phản hồi</span>
                          )}
                        </td>
                        <td>
                          {rev.isDeleted ? (
                            <span className={`${styles.badge} ${styles.inactive}`}>Đã ẩn</span>
                          ) : (
                            <span className={`${styles.badge} ${styles.active}`}>Hiển thị</span>
                          )}
                        </td>
                        <td>
                          <div className={styles.actionBtns}>
                            <button
                              type="button"
                              className={styles.viewDetailBtn}
                              onClick={() => setSelectedReviewDetail(rev)}
                              title="Xem chi tiết khách hàng và sản phẩm được đánh giá"
                            >
                              👁️ Chi tiết
                            </button>
                            <button
                              type="button"
                              className={styles.replyBtn}
                              onClick={() => handleOpenReplyModal(rev)}
                            >
                              💬 {hasReply ? 'Sửa PH' : 'Phản hồi'}
                            </button>
                            {!rev.isDeleted && (
                              <button
                                type="button"
                                className={styles.deleteBtn}
                                onClick={() => onDeleteReview(revId)}
                              >
                                🗑️ Ẩn
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Thanh phân trang đánh giá */}
          {reviewTotalPages > 1 && (
            <div className={styles.paginationBar}>
              <span>
                Hiển thị <strong>{reviews.length}</strong> / <strong>{reviewTotalItems}</strong> đánh giá (Trang {reviewPage}/{reviewTotalPages})
              </span>
              <div className={styles.pageBtns}>
                <button
                  type="button"
                  disabled={reviewPage <= 1}
                  onClick={() => setReviewPage((p) => Math.max(1, p - 1))}
                >
                  ◀ Trước
                </button>
                {Array.from({ length: reviewTotalPages }, (_, i) => i + 1).map((pNum) => (
                  <button
                    key={pNum}
                    type="button"
                    className={reviewPage === pNum ? styles.activePage : ''}
                    onClick={() => setReviewPage(pNum)}
                  >
                    {pNum}
                  </button>
                ))}
                <button
                  type="button"
                  disabled={reviewPage >= reviewTotalPages}
                  onClick={() => setReviewPage((p) => Math.min(reviewTotalPages, p + 1))}
                >
                  Sau ▶
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      {/* MODAL: THÊM / SỬA SẢN PHẨM */}
      {showProductModal && (
        <div className={styles.modalOverlay} onClick={() => setShowProductModal(false)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>{editingProduct ? 'Cập Nhật Sản Phẩm' : 'Thêm Sản Phẩm Mới'}</h3>
              <button type="button" onClick={() => setShowProductModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmitProduct} noValidate className={styles.modalBody}>
              {productGeneralError && (
                <div className={styles.formAlertError}>
                  ⚠️ {productGeneralError}
                </div>
              )}

              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label>Mã sản phẩm *</label>
                  {productErrors.productId && (
                    <span className={styles.inputErrorMessage}>⚠️ {productErrors.productId}</span>
                  )}
                  <input
                    type="text"
                    disabled={Boolean(editingProduct)}
                    className={productErrors.productId ? styles.inputInvalid : ''}
                    value={productForm.productId}
                    onChange={(e) => {
                      setProductForm({ ...productForm, productId: e.target.value });
                      if (productErrors.productId) setProductErrors({ ...productErrors, productId: '' });
                    }}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Danh mục *</label>
                  <select
                    value={productForm.categoryId}
                    onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                  >
                    {(Array.isArray(categories) ? categories : (categories?.categories || [])).map((c) => (
                      <option key={c.categoryId} value={c.categoryId}>
                        {c.categoryName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label>Nhà cung cấp (Hệ thống) *</label>
                  <select
                    value={productForm.supplierId}
                    onChange={(e) => setProductForm({ ...productForm, supplierId: e.target.value })}
                  >
                    {SUPPLIERS.map((s) => (
                      <option key={s.supplierId} value={s.supplierId}>
                        {s.supplierName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.inputGroup}>
                  <label>Đơn vị tính *</label>
                  <select
                    value={productForm.unit}
                    onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}
                  >
                    {PRODUCT_UNIT_OPTIONS.map((u) => (
                      <option key={u.value} value={u.value}>
                        {u.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label>Tên sản phẩm *</label>
                {productErrors.productName && (
                  <span className={styles.inputErrorMessage}>⚠️ {productErrors.productName}</span>
                )}
                <input
                  type="text"
                  placeholder="VD: Cà chua bi VietGAP"
                  className={productErrors.productName ? styles.inputInvalid : ''}
                  value={productForm.productName}
                  onChange={(e) => {
                    setProductForm({ ...productForm, productName: e.target.value });
                    if (productErrors.productName) setProductErrors({ ...productErrors, productName: '' });
                  }}
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label>
                    Giá bán (VND) * {editingProduct && <small style={{ color: '#64748b', fontWeight: 'normal' }}>(Cố định, không thể sửa)</small>}
                  </label>
                  {productErrors.price && (
                    <span className={styles.inputErrorMessage}>⚠️ {productErrors.price}</span>
                  )}
                  <input
                    type="number"
                    min="1000"
                    step="1000"
                    readOnly={Boolean(editingProduct)}
                    disabled={Boolean(editingProduct)}
                    style={editingProduct ? { backgroundColor: '#f1f5f9', cursor: 'not-allowed' } : {}}
                    className={productErrors.price ? styles.inputInvalid : ''}
                    value={productForm.price}
                    onChange={(e) => {
                      setProductForm({ ...productForm, price: e.target.value });
                      if (productErrors.price) setProductErrors({ ...productErrors, price: '' });
                    }}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Tồn kho *</label>
                  {productErrors.stock && (
                    <span className={styles.inputErrorMessage}>⚠️ {productErrors.stock}</span>
                  )}
                  <input
                    type="number"
                    min="0"
                    className={productErrors.stock ? styles.inputInvalid : ''}
                    value={productForm.stock}
                    onChange={(e) => {
                      setProductForm({ ...productForm, stock: e.target.value });
                      if (productErrors.stock) setProductErrors({ ...productErrors, stock: '' });
                    }}
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label>Hạn sử dụng</label>
                  <input
                    type="date"
                    value={productForm.expiryDate}
                    onChange={(e) => setProductForm({ ...productForm, expiryDate: e.target.value })}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Link ảnh sản phẩm (URL)</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={productForm.imageUrl}
                    onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isProductSubmitting}
                className={styles.modalSubmitBtn}
              >
                {isProductSubmitting ? 'Đang lưu...' : 'Lưu Thông Tin Sản Phẩm'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: THÊM DANH MỤC */}
      {showCategoryModal && (
        <div className={styles.modalOverlay} onClick={() => setShowCategoryModal(false)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Thêm Danh Mục Ngành Hàng Mới</h3>
              <button type="button" onClick={() => setShowCategoryModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmitCategory} noValidate className={styles.modalBody}>
              {categoryGeneralError && (
                <div className={styles.formAlertError}>
                  ⚠️ {categoryGeneralError}
                </div>
              )}

              <div className={styles.inputGroup}>
                <label>Mã Danh Mục *</label>
                {categoryErrors.categoryId && (
                  <span className={styles.inputErrorMessage}>⚠️ {categoryErrors.categoryId}</span>
                )}
                <input
                  type="text"
                  className={categoryErrors.categoryId ? styles.inputInvalid : ''}
                  value={categoryForm.categoryId}
                  onChange={(e) => {
                    setCategoryForm({ ...categoryForm, categoryId: e.target.value });
                    if (categoryErrors.categoryId) setCategoryErrors({ ...categoryErrors, categoryId: '' });
                  }}
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Tên Danh Mục *</label>
                {categoryErrors.categoryName && (
                  <span className={styles.inputErrorMessage}>⚠️ {categoryErrors.categoryName}</span>
                )}
                <input
                  type="text"
                  placeholder="VD: Hải Sản Tươi Sống"
                  className={categoryErrors.categoryName ? styles.inputInvalid : ''}
                  value={categoryForm.categoryName}
                  onChange={(e) => {
                    setCategoryForm({ ...categoryForm, categoryName: e.target.value });
                    if (categoryErrors.categoryName) setCategoryErrors({ ...categoryErrors, categoryName: '' });
                  }}
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Tỷ suất lợi nhuận (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={categoryForm.profitMargin}
                  onChange={(e) => setCategoryForm({ ...categoryForm, profitMargin: Number(e.target.value) })}
                />
              </div>
              <button
                type="submit"
                disabled={isCategorySubmitting}
                className={styles.modalSubmitBtn}
              >
                {isCategorySubmitting ? 'Đang tạo...' : 'Tạo Danh Mục'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: TẠO VOUCHER */}
      {showPromoModal && (
        <div className={styles.modalOverlay} onClick={() => setShowPromoModal(false)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Tạo Chương Trình Khuyến Mãi Mới</h3>
              <button type="button" onClick={() => setShowPromoModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmitPromotion} noValidate className={styles.modalBody}>
              {promoGeneralError && (
                <div className={styles.formAlertError}>
                  ⚠️ {promoGeneralError}
                </div>
              )}

              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label>Mã Voucher *</label>
                  {promoErrors.promotionCode && (
                    <span className={styles.inputErrorMessage}>⚠️ {promoErrors.promotionCode}</span>
                  )}
                  <input
                    type="text"
                    placeholder="GIAM30K"
                    className={promoErrors.promotionCode ? styles.inputInvalid : ''}
                    value={promoForm.promotionCode}
                    onChange={(e) => {
                      setPromoForm({ ...promoForm, promotionCode: e.target.value.toUpperCase() });
                      if (promoErrors.promotionCode) setPromoErrors({ ...promoErrors, promotionCode: '' });
                    }}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Loại giảm giá *</label>
                  <select
                    value={promoForm.discountType}
                    onChange={(e) => setPromoForm({ ...promoForm, discountType: e.target.value })}
                  >
                    <option value={DISCOUNT_TYPES.TIENMAT}>Tiền mặt trực tiếp (VND)</option>
                    <option value={DISCOUNT_TYPES.PHANTRAM}>Phần trăm đơn hàng (%)</option>
                  </select>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label>Tên chương trình *</label>
                {promoErrors.promotionName && (
                  <span className={styles.inputErrorMessage}>⚠️ {promoErrors.promotionName}</span>
                )}
                <input
                  type="text"
                  placeholder="Giảm 30.000đ cho đơn từ 250k"
                  className={promoErrors.promotionName ? styles.inputInvalid : ''}
                  value={promoForm.promotionName}
                  onChange={(e) => {
                    setPromoForm({ ...promoForm, promotionName: e.target.value });
                    if (promoErrors.promotionName) setPromoErrors({ ...promoErrors, promotionName: '' });
                  }}
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label>Giá trị giảm * {promoForm.discountType === DISCOUNT_TYPES.PHANTRAM ? '(%)' : '(VND)'}</label>
                  {promoErrors.discountValue && (
                    <span className={styles.inputErrorMessage}>⚠️ {promoErrors.discountValue}</span>
                  )}
                  <input
                    type="number"
                    className={promoErrors.discountValue ? styles.inputInvalid : ''}
                    value={promoForm.discountValue}
                    onChange={(e) => {
                      setPromoForm({ ...promoForm, discountValue: e.target.value });
                      if (promoErrors.discountValue) setPromoErrors({ ...promoErrors, discountValue: '' });
                    }}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Đơn tối thiểu * (VND)</label>
                  {promoErrors.minOrderAmount && (
                    <span className={styles.inputErrorMessage}>⚠️ {promoErrors.minOrderAmount}</span>
                  )}
                  <input
                    type="number"
                    className={promoErrors.minOrderAmount ? styles.inputInvalid : ''}
                    value={promoForm.minOrderAmount}
                    onChange={(e) => {
                      setPromoForm({ ...promoForm, minOrderAmount: e.target.value });
                      if (promoErrors.minOrderAmount) setPromoErrors({ ...promoErrors, minOrderAmount: '' });
                    }}
                  />
                </div>
              </div>

              {promoForm.discountType === DISCOUNT_TYPES.PHANTRAM && (
                <div className={styles.inputGroup}>
                  <label>Số tiền giảm tối đa (VND)</label>
                  <input
                    type="number"
                    placeholder="VD: 50000"
                    value={promoForm.maxDiscount}
                    onChange={(e) => setPromoForm({ ...promoForm, maxDiscount: e.target.value })}
                  />
                </div>
              )}

              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label>Ngày bắt đầu</label>
                  <input
                    type="date"
                    value={promoForm.startDate}
                    onChange={(e) => setPromoForm({ ...promoForm, startDate: e.target.value })}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Ngày kết thúc</label>
                  <input
                    type="date"
                    value={promoForm.endDate}
                    onChange={(e) => setPromoForm({ ...promoForm, endDate: e.target.value })}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isPromoSubmitting}
                className={styles.modalSubmitBtn}
              >
                {isPromoSubmitting ? 'Đang tạo...' : 'Tạo Voucher'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: TẠO NHÂN VIÊN MỚI */}
      {showEmpModal && (
        <div className={styles.modalOverlay} onClick={() => setShowEmpModal(false)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Tạo Tài Khoản Nhân Viên Mới</h3>
              <button type="button" onClick={() => setShowEmpModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmitEmployee} noValidate className={styles.modalBody}>
              {empGeneralError && (
                <div className={styles.formAlertError}>
                  ⚠️ {empGeneralError}
                </div>
              )}

              <div className={styles.inputGroup}>
                <label>Họ và tên *</label>
                {empErrors.fullName && (
                  <span className={styles.inputErrorMessage}>⚠️ {empErrors.fullName}</span>
                )}
                <input
                  type="text"
                  placeholder="Lê Văn Kho"
                  className={empErrors.fullName ? styles.inputInvalid : ''}
                  value={empForm.fullName}
                  onChange={(e) => {
                    setEmpForm({ ...empForm, fullName: e.target.value });
                    if (empErrors.fullName) setEmpErrors({ ...empErrors, fullName: '' });
                  }}
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label>Tên đăng nhập *</label>
                  {empErrors.username && (
                    <span className={styles.inputErrorMessage}>⚠️ {empErrors.username}</span>
                  )}
                  <input
                    type="text"
                    placeholder="staff_kho"
                    className={empErrors.username ? styles.inputInvalid : ''}
                    value={empForm.username}
                    onChange={(e) => {
                      setEmpForm({ ...empForm, username: e.target.value });
                      if (empErrors.username) setEmpErrors({ ...empErrors, username: '' });
                    }}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Mật khẩu khởi tạo (tối thiểu 6 ký tự) *</label>
                  {empErrors.password && (
                    <span className={styles.inputErrorMessage}>⚠️ {empErrors.password}</span>
                  )}
                  <input
                    type="password"
                    placeholder="Password123"
                    className={empErrors.password ? styles.inputInvalid : ''}
                    value={empForm.password}
                    onChange={(e) => {
                      setEmpForm({ ...empForm, password: e.target.value });
                      if (empErrors.password) setEmpErrors({ ...empErrors, password: '' });
                    }}
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label>Số điện thoại *</label>
                  {empErrors.phoneNumber && (
                    <span className={styles.inputErrorMessage}>⚠️ {empErrors.phoneNumber}</span>
                  )}
                  <input
                    type="tel"
                    placeholder="0987654321"
                    className={empErrors.phoneNumber ? styles.inputInvalid : ''}
                    value={empForm.phoneNumber}
                    onChange={(e) => {
                      setEmpForm({ ...empForm, phoneNumber: e.target.value });
                      if (empErrors.phoneNumber) setEmpErrors({ ...empErrors, phoneNumber: '' });
                    }}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Chức vụ *</label>
                  <select
                    value={empForm.position}
                    onChange={(e) => setEmpForm({ ...empForm, position: e.target.value })}
                  >
                    <option value="STAFF">STAFF (Nhân viên)</option>
                    <option value="ADMIN">ADMIN (Quản trị viên)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isEmpSubmitting}
                className={styles.modalSubmitBtn}
              >
                {isEmpSubmitting ? 'Đang tạo...' : 'Tạo Nhân Viên'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: XEM CHI TIẾT & CẬP NHẬT NHÂN VIÊN */}
      {showDetailEmpModal && selectedEmp && (
        <div className={styles.modalOverlay} onClick={() => setShowDetailEmpModal(false)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Chi Tiết & Cập Nhật Nhân Viên</h3>
              <button type="button" onClick={() => setShowDetailEmpModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmitEditEmp} noValidate className={styles.modalBody}>
              {editEmpGeneralError && (
                <div className={styles.formAlertError}>
                  ⚠️ {editEmpGeneralError}
                </div>
              )}

              {/* Thông tin hồ sơ cố định */}
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Mã Nhân Viên</span>
                  <span className={styles.infoValue}><strong>{selectedEmp.employeeId}</strong></span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Tên Đăng Nhập</span>
                  <span className={styles.infoValue}>{selectedEmp.username}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Ngày Vào Làm</span>
                  <span className={styles.infoValue}>{selectedEmp.hireDate ? formatDate(selectedEmp.hireDate) : 'Chưa cập nhật'}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Trạng Thái Hiện Tại</span>
                  <span className={styles.infoValue}>
                    {selectedEmp.status !== false ? (
                      <span style={{ color: '#047857', fontWeight: 700 }}>● Đang hoạt động</span>
                    ) : (
                      <span style={{ color: '#b91c1c', fontWeight: 700 }}>● Đã khóa</span>
                    )}
                  </span>
                </div>
              </div>

              {/* Các trường có thể cập nhật */}
              <div className={styles.inputGroup}>
                <label>Họ và tên *</label>
                {editEmpErrors.fullName && (
                  <span className={styles.inputErrorMessage}>⚠️ {editEmpErrors.fullName}</span>
                )}
                <input
                  type="text"
                  className={editEmpErrors.fullName ? styles.inputInvalid : ''}
                  value={editEmpForm.fullName}
                  onChange={(e) => {
                    setEditEmpForm({ ...editEmpForm, fullName: e.target.value });
                    if (editEmpErrors.fullName) setEditEmpErrors({ ...editEmpErrors, fullName: '' });
                  }}
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label>Số điện thoại</label>
                  {editEmpErrors.phoneNumber && (
                    <span className={styles.inputErrorMessage}>⚠️ {editEmpErrors.phoneNumber}</span>
                  )}
                  <input
                    type="tel"
                    placeholder="0987654321"
                    className={editEmpErrors.phoneNumber ? styles.inputInvalid : ''}
                    value={editEmpForm.phoneNumber}
                    onChange={(e) => {
                      setEditEmpForm({ ...editEmpForm, phoneNumber: e.target.value });
                      if (editEmpErrors.phoneNumber) setEditEmpErrors({ ...editEmpErrors, phoneNumber: '' });
                    }}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Email liên hệ</label>
                  {editEmpErrors.email && (
                    <span className={styles.inputErrorMessage}>⚠️ {editEmpErrors.email}</span>
                  )}
                  <input
                    type="email"
                    placeholder="nhanvien@freshmart.vn"
                    className={editEmpErrors.email ? styles.inputInvalid : ''}
                    value={editEmpForm.email}
                    onChange={(e) => {
                      setEditEmpForm({ ...editEmpForm, email: e.target.value });
                      if (editEmpErrors.email) setEditEmpErrors({ ...editEmpErrors, email: '' });
                    }}
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label>Ngày sinh</label>
                  <input
                    type="date"
                    value={editEmpForm.birthDate}
                    onChange={(e) => setEditEmpForm({ ...editEmpForm, birthDate: e.target.value })}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Chức vụ (Phân quyền)</label>
                  <select
                    value={editEmpForm.position}
                    onChange={(e) => setEditEmpForm({ ...editEmpForm, position: e.target.value })}
                  >
                    <option value="STAFF">STAFF (Nhân viên)</option>
                    <option value="ADMIN">ADMIN (Quản trị viên)</option>
                  </select>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label>Đặt lại mật khẩu mới (Bỏ trống nếu không đổi)</label>
                {editEmpErrors.newPassword && (
                  <span className={styles.inputErrorMessage}>⚠️ {editEmpErrors.newPassword}</span>
                )}
                <input
                  type="password"
                  placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                  className={editEmpErrors.newPassword ? styles.inputInvalid : ''}
                  value={editEmpForm.newPassword}
                  onChange={(e) => {
                    setEditEmpForm({ ...editEmpForm, newPassword: e.target.value });
                    if (editEmpErrors.newPassword) setEditEmpErrors({ ...editEmpErrors, newPassword: '' });
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={isEditEmpSubmitting}
                className={styles.modalSubmitBtn}
              >
                {isEditEmpSubmitting ? 'Đang cập nhật...' : 'Cập Nhật Thông Tin Nhân Viên'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: XEM CHI TIẾT ĐƠN HÀNG (ADMIN) */}
      {selectedOrderDetail && (
        <div className={styles.modalOverlay} onClick={onCloseOrderDetail}>
          <div className={`${styles.modalCard} ${styles.orderDetailCard}`} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h3 style={{ margin: 0 }}>Chi Tiết Đơn Hàng #{selectedOrderDetail.maDonHang}</h3>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  Đặt lúc: {formatDate(selectedOrderDetail.ngayLap, true)}
                </span>
              </div>
              <button type="button" onClick={onCloseOrderDetail}>✕</button>
            </div>
            <div className={styles.modalBody}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', background: '#f8fafc', padding: '16px', borderRadius: '8px', marginBottom: '16px', border: '1px solid #e2e8f0' }}>
                <div>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#1e293b' }}>Thông tin người nhận</h4>
                  <div style={{ fontSize: '13px', lineHeight: '1.6', color: '#475569' }}>
                    <div><strong>Người nhận:</strong> {selectedOrderDetail.tenNguoiNhan || 'Không có'}</div>
                    <div><strong>SĐT:</strong> {selectedOrderDetail.soDienThoaiNhan || 'Không có'}</div>
                    <div><strong>Địa chỉ:</strong> {selectedOrderDetail.diaChiGiaoHang || 'Không có'}</div>
                  </div>
                </div>
                <div>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#1e293b' }}>Thông tin thanh toán</h4>
                  <div style={{ fontSize: '13px', lineHeight: '1.6', color: '#475569' }}>
                    <div><strong>Phương thức:</strong> {formatPaymentMethod(selectedOrderDetail.phuongThucTT)}</div>
                    <div>
                      <strong>Trạng thái: </strong>
                      {selectedOrderDetail.trangThai === ORDER_STATUS.DATHANHTOAN ? (
                        <span className={`${styles.badge} ${styles.paid}`}>{ORDER_STATUS_LABELS.DATHANHTOAN}</span>
                      ) : (
                        <span className={`${styles.badge} ${styles.pending}`}>{ORDER_STATUS_LABELS.CHUATHANHTOAN}</span>
                      )}
                    </div>
                    <div><strong>Tổng thanh toán: </strong><span style={{ color: '#007042', fontSize: '16px', fontWeight: 700 }}>{formatVND(selectedOrderDetail.tongTien)}</span></div>
                  </div>
                </div>
              </div>

              <h4 style={{ margin: '0 0 12px 0', fontSize: '15px', color: '#1e293b' }}>Danh sách sản phẩm ({selectedOrderDetail.items?.length || 0})</h4>
              <div style={{ maxHeight: '240px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px', marginBottom: '16px' }}>
                <table className={styles.dataTable} style={{ margin: 0 }}>
                  <thead>
                    <tr>
                      <th>Sản phẩm</th>
                      <th>Đơn vị</th>
                      <th>Đơn giá</th>
                      <th>Số lượng</th>
                      <th>Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(!selectedOrderDetail.items || selectedOrderDetail.items.length === 0) ? (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center', padding: '16px' }}>Không có chi tiết sản phẩm</td>
                      </tr>
                    ) : (
                      selectedOrderDetail.items.map((it, idx) => (
                        <tr key={it.productId || idx}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              {it.imageUrl && (
                                <img
                                  src={it.imageUrl}
                                  alt={it.productName}
                                  style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: '4px' }}
                                />
                              )}
                              <strong>{it.productName}</strong>
                            </div>
                          </td>
                          <td>{it.unit || 'Kg'}</td>
                          <td>{formatVND(it.price)}</td>
                          <td>x{it.quantity}</td>
                          <td><strong>{formatVND(it.subTotal || (it.price * it.quantity))}</strong></td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid #e2e8f0' }}>
                <div>
                  {selectedOrderDetail.trangThai !== ORDER_STATUS.DATHANHTOAN && (
                    <button
                      type="button"
                      className={styles.confirmCodBtn}
                      style={{ padding: '8px 16px', fontSize: '13.5px' }}
                      onClick={() => {
                        onConfirmCod(selectedOrderDetail.maDonHang);
                        onCloseOrderDetail();
                      }}
                    >
                      ✓ Xác nhận đã thu tiền COD
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  className={styles.viewDetailBtn}
                  onClick={onCloseOrderDetail}
                  style={{ padding: '8px 20px', background: '#e2e8f0' }}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CHỈNH SỬA VOUCHER (PUT /promotion/:code) */}
      {showEditPromoModal && (
        <div className={styles.modalOverlay} onClick={() => setShowEditPromoModal(false)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Chỉnh Sửa Mã Khuyến Mãi {editingPromoCode}</h3>
              <button type="button" onClick={() => setShowEditPromoModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmitEditPromotion} noValidate className={styles.modalBody}>
              {editPromoGeneralError && (
                <div className={styles.formAlertError}>
                  ⚠️ {editPromoGeneralError}
                </div>
              )}

              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label>Mã Voucher (Cố định)</label>
                  <input
                    type="text"
                    disabled
                    readOnly
                    value={editingPromoCode}
                    style={{ backgroundColor: '#f1f5f9', cursor: 'not-allowed' }}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Loại giảm giá</label>
                  <input
                    type="text"
                    disabled
                    readOnly
                    value={editPromoForm.discountType === DISCOUNT_TYPES.PHANTRAM ? 'Phần trăm (%)' : 'Tiền mặt (VND)'}
                    style={{ backgroundColor: '#f1f5f9', cursor: 'not-allowed' }}
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label>Tên chương trình *</label>
                {editPromoErrors.promotionName && (
                  <span className={styles.inputErrorMessage}>⚠️ {editPromoErrors.promotionName}</span>
                )}
                <input
                  type="text"
                  className={editPromoErrors.promotionName ? styles.inputInvalid : ''}
                  value={editPromoForm.promotionName}
                  onChange={(e) => {
                    setEditPromoForm({ ...editPromoForm, promotionName: e.target.value });
                    if (editPromoErrors.promotionName) setEditPromoErrors({ ...editPromoErrors, promotionName: '' });
                  }}
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label>Số lượt sử dụng còn lại *</label>
                  <input
                    type="number"
                    min="0"
                    value={editPromoForm.remainingUsage}
                    onChange={(e) => setEditPromoForm({ ...editPromoForm, remainingUsage: e.target.value })}
                  />
                </div>
                {editPromoForm.discountType === DISCOUNT_TYPES.PHANTRAM && (
                  <div className={styles.inputGroup}>
                    <label>Giảm tối đa (VND)</label>
                    <input
                      type="number"
                      value={editPromoForm.maxDiscount}
                      onChange={(e) => setEditPromoForm({ ...editPromoForm, maxDiscount: e.target.value })}
                    />
                  </div>
                )}
              </div>

              <div className={styles.inputGroup}>
                <label>Ngày hết hạn *</label>
                {editPromoErrors.endDate && (
                  <span className={styles.inputErrorMessage}>⚠️ {editPromoErrors.endDate}</span>
                )}
                <input
                  type="date"
                  className={editPromoErrors.endDate ? styles.inputInvalid : ''}
                  value={editPromoForm.endDate}
                  onChange={(e) => {
                    setEditPromoForm({ ...editPromoForm, endDate: e.target.value });
                    if (editPromoErrors.endDate) setEditPromoErrors({ ...editPromoErrors, endDate: '' });
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={isEditPromoSubmitting}
                className={styles.modalSubmitBtn}
              >
                {isEditPromoSubmitting ? 'Đang lưu...' : 'Lưu Thay Đổi Khuyến Mãi'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: XEM CHI TIẾT ĐÁNH GIÁ (KHÁCH HÀNG & SẢN PHẨM) */}
      {selectedReviewDetail && (
        <div className={styles.modalOverlay} onClick={() => setSelectedReviewDetail(null)}>
          <div className={`${styles.modalCard} ${styles.reviewDetailCard}`} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h3>⭐ Chi Tiết Đánh Giá #{selectedReviewDetail.id || selectedReviewDetail.maDanhGia || selectedReviewDetail.reviewId}</h3>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  Thời gian gửi: {formatDate(selectedReviewDetail.createdAt || selectedReviewDetail.ngayTao, true)}
                </span>
              </div>
              <button type="button" onClick={() => setSelectedReviewDetail(null)}>✕</button>
            </div>

            <div className={styles.modalBody}>
              {/* Lưới 2 cột: Thông tin Khách hàng & Sản phẩm */}
              <div className={styles.reviewGridTwo}>
                {/* 1. Khách Hàng */}
                <div className={styles.reviewCustomerCard}>
                  <div className={styles.cardTitle}>👤 Khách Hàng Đánh Giá</div>
                  <div className={styles.reviewEntityContent}>
                    <div className={styles.avatarPlaceholder}>
                      {(selectedReviewDetail.customer?.fullName || selectedReviewDetail.customerName || selectedReviewDetail.tenKhachHang || 'K').charAt(0).toUpperCase()}
                    </div>
                    <div className={styles.entityMeta}>
                      <span className={styles.primaryText}>
                        {selectedReviewDetail.customer?.fullName || selectedReviewDetail.customerName || selectedReviewDetail.tenKhachHang || 'Khách hàng'}
                      </span>
                      <span className={styles.secondaryText}>
                        Mã KH: <strong>{selectedReviewDetail.customer?.customerId || selectedReviewDetail.customerId || 'N/A'}</strong>
                      </span>
                      {selectedReviewDetail.customer?.phoneNumber && (
                        <span className={styles.secondaryText}>
                          SĐT: {selectedReviewDetail.customer.phoneNumber}
                        </span>
                      )}
                      {selectedReviewDetail.customer?.username && (
                        <span className={styles.secondaryText}>
                          Tài khoản: @{selectedReviewDetail.customer.username}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* 2. Sản Phẩm */}
                <div className={styles.reviewProductCard}>
                  <div className={styles.cardTitle}>📦 Sản Phẩm Được Đánh Giá</div>
                  <div className={styles.reviewEntityContent}>
                    {selectedReviewDetail.product?.imageUrl ? (
                      <img
                        src={selectedReviewDetail.product.imageUrl}
                        alt="Product"
                        className={styles.productThumb}
                      />
                    ) : (
                      <div className={styles.avatarPlaceholder} style={{ background: '#ecfdf5', color: '#059669' }}>
                        🛒
                      </div>
                    )}
                    <div className={styles.entityMeta}>
                      <span className={styles.primaryText} title={selectedReviewDetail.product?.productName || selectedReviewDetail.productName || selectedReviewDetail.tenSanPham}>
                        {selectedReviewDetail.product?.productName || selectedReviewDetail.productName || selectedReviewDetail.tenSanPham || 'Sản phẩm'}
                      </span>
                      <span className={styles.secondaryText}>
                        Mã SP: <strong>{selectedReviewDetail.product?.productId || selectedReviewDetail.productId || 'N/A'}</strong>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Nội dung Nhận Xét */}
              <div className={styles.reviewDetailSection}>
                <h4>
                  <span>💬 Nội Dung Nhận Xét Của Khách Hàng</span>
                  <span style={{ marginLeft: 'auto', color: '#f59e0b', fontSize: '15px' }}>
                    {'★'.repeat(selectedReviewDetail.rating || selectedReviewDetail.soSao || 5)}{'☆'.repeat(5 - (selectedReviewDetail.rating || selectedReviewDetail.soSao || 5))} ({selectedReviewDetail.rating || selectedReviewDetail.soSao || 5}/5)
                  </span>
                </h4>
                <div className={styles.reviewCommentBox}>
                  {selectedReviewDetail.comment || selectedReviewDetail.noiDung || '(Khách hàng không để lại nhận xét chi tiết)'}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', fontSize: '12.5px' }}>
                  <span>
                    Trạng thái hiển thị:{' '}
                    {selectedReviewDetail.isDeleted ? (
                      <span className={`${styles.badge} ${styles.inactive}`}>Đã ẩn / Bị khóa</span>
                    ) : (
                      <span className={`${styles.badge} ${styles.active}`}>Đang hiển thị công khai</span>
                    )}
                  </span>
                </div>
              </div>

              {/* 4. Phản Hồi Từ Cửa Hàng */}
              <div className={styles.reviewDetailSection} style={{ background: (selectedReviewDetail.reply || selectedReviewDetail.phanHoi) ? '#f0fdf4' : '#f8fafc', borderColor: (selectedReviewDetail.reply || selectedReviewDetail.phanHoi) ? '#bbf7d0' : '#e2e8f0' }}>
                <h4 style={{ color: (selectedReviewDetail.reply || selectedReviewDetail.phanHoi) ? '#166534' : '#475569' }}>
                  🏪 Phản Hồi Từ Cửa Hàng
                  {(selectedReviewDetail.repliedAt || selectedReviewDetail.ngayPhanHoi) && (
                    <span style={{ marginLeft: 'auto', fontSize: '12px', color: '#64748b', fontWeight: 500 }}>
                      {formatDate(selectedReviewDetail.repliedAt || selectedReviewDetail.ngayPhanHoi, true)}
                    </span>
                  )}
                </h4>
                {(selectedReviewDetail.reply || selectedReviewDetail.phanHoi) ? (
                  <div className={styles.reviewCommentBox} style={{ background: '#ffffff', border: '1px solid #86efac', color: '#166534' }}>
                    {selectedReviewDetail.reply || selectedReviewDetail.phanHoi}
                  </div>
                ) : (
                  <div style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '13px', padding: '6px 0' }}>
                    Chưa có phản hồi nào từ nhân viên cho bài đánh giá này.
                  </div>
                )}
              </div>

              {/* Footer nút hành động */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', gap: '10px', flexWrap: 'wrap' }}>
                <div>
                  {!selectedReviewDetail.isDeleted && (
                    <button
                      type="button"
                      className={styles.deleteBtn}
                      onClick={() => {
                        const rId = selectedReviewDetail.id || selectedReviewDetail.maDanhGia || selectedReviewDetail.reviewId;
                        setSelectedReviewDetail(null);
                        onDeleteReview(rId);
                      }}
                    >
                      🗑️ Ẩn bài đánh giá này
                    </button>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    className={styles.viewDetailBtn}
                    onClick={() => setSelectedReviewDetail(null)}
                  >
                    Đóng
                  </button>
                  <button
                    type="button"
                    className={styles.replyBtn}
                    onClick={() => {
                      const rev = selectedReviewDetail;
                      setSelectedReviewDetail(null);
                      handleOpenReplyModal(rev);
                    }}
                  >
                    💬 {(selectedReviewDetail.reply || selectedReviewDetail.phanHoi) ? 'Chỉnh sửa phản hồi' : 'Gửi phản hồi ngay'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: PHẢN HỒI ĐÁNH GIÁ (POST /review/:id/reply) */}
      {showReplyModal && replyingReview && (
        <div className={styles.modalOverlay} onClick={() => setShowReplyModal(false)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Phản Hồi Đánh Giá #{replyingReview.id || replyingReview.maDanhGia}</h3>
              <button type="button" onClick={() => setShowReplyModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmitReply} noValidate className={styles.modalBody}>
              {replyError && (
                <div className={styles.formAlertError}>
                  ⚠️ {replyError}
                </div>
              )}

              <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>
                  Khách hàng <strong>{replyingReview.customerName || replyingReview.tenKhachHang || 'Khách hàng'}</strong> đánh giá cho sản phẩm <strong>{replyingReview.productName || replyingReview.tenSanPham}</strong>:
                </div>
                <div style={{ color: '#f59e0b', fontSize: '14px', marginBottom: '4px' }}>
                  {'★'.repeat(replyingReview.rating || replyingReview.soSao || 5)}
                </div>
                <div style={{ fontSize: '14px', color: '#1e293b', fontStyle: 'italic' }}>
                  "{replyingReview.comment || replyingReview.noiDung}"
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label>Nội dung phản hồi từ Cửa hàng Bách Hóa Xanh *</label>
                <textarea
                  rows="4"
                  placeholder="Cảm ơn quý khách đã tin tưởng và mua sắm tại Bách Hóa Xanh..."
                  value={replyText}
                  onChange={(e) => {
                    setReplyText(e.target.value);
                    if (replyError) setReplyError('');
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
                <button
                  type="button"
                  className={styles.viewDetailBtn}
                  onClick={() => setShowReplyModal(false)}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isReplySubmitting}
                  className={styles.modalSubmitBtn}
                  style={{ width: 'auto', padding: '10px 24px', marginTop: 0 }}
                >
                  {isReplySubmitting ? 'Đang gửi...' : 'Gửi Phản Hồi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DesktopAdmin;
