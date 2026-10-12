import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import DefaultLayout from '../../layout/common/DefaultLayout';
import orderService from '../../../services/orderService';
import reviewService from '../../../services/reviewService';
import useAuthStore from '../../../stores/useAuthStore';
import useToastStore from '../../../stores/useToastStore';
import { formatVND } from '../../../utils/formatCurrency';
import { formatDate } from '../../../utils/formatDate';
import { formatPaymentMethod } from '../../../utils/formatPayment';
import { formatQuantity } from '../../../utils/formatQuantity';
import { PATHS } from '../../../constants/paths';
import { ORDER_STATUS, ORDER_STATUS_LABELS } from '../../../constants/enums';
import styles from './Orders.module.scss';

export const OrdersContainer = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated, userType, user } = useAuthStore();
  const { addToast } = useToastStore();

  // Bắt kết quả chuyển hướng từ PayOS (Cách 2 - Return URL)
  useEffect(() => {
    const status = searchParams.get('status');
    const code = searchParams.get('code');
    const cancel = searchParams.get('cancel');

    if (status === 'PAID' || code === '00') {
      addToast({
        type: 'success',
        message: '🎉 Thanh toán đơn hàng qua PayOS thành công!'
      });
      setSearchParams({}, { replace: true });
    } else if (cancel === 'true') {
      addToast({
        type: 'warning',
        message: '⚠️ Bạn đã huỷ giao dịch thanh toán.'
      });
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, addToast, setSearchParams]);

  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Modal chi tiết đơn hàng
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  // Modal Thanh toán lại
  const [repayOrder, setRepayOrder] = useState(null);
  const [repayMethod, setRepayMethod] = useState('VIETQR');
  const [isRepaying, setIsRepaying] = useState(false);
  const [repayingOrderId, setRepayingOrderId] = useState(null);

  // Modal đánh giá sản phẩm (dành cho đơn hàng DATHANHTOAN)
  const [reviewModalItem, setReviewModalItem] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isReviewSubmitting, setIsReviewSubmitting] = useState(false);
  const [myReviewsMap, setMyReviewsMap] = useState({});
  const [orderItemsMap, setOrderItemsMap] = useState({});
  const [dismissedProductIds, setDismissedProductIds] = useState([]);
  const [reviewedOrderItems, setReviewedOrderItems] = useState({});

  // Tải danh sách sản phẩm đã từng đánh giá theo từng đơn hàng hoặc bị xóa
  const loadReviewStorage = useCallback(() => {
    try {
      const userKey = `freshmart_dismissed_reviews_${user?.customerId || user?.userId || user?.username || 'customer'}`;
      const revKey = `freshmart_reviewed_order_items_${user?.customerId || user?.userId || user?.username || 'customer'}`;
      const list = JSON.parse(localStorage.getItem(userKey) || '[]');
      const revMap = JSON.parse(localStorage.getItem(revKey) || '{}');
      setDismissedProductIds(list);
      setReviewedOrderItems(revMap);
    } catch {
      setDismissedProductIds([]);
      setReviewedOrderItems({});
    }
  }, [user]);

  useEffect(() => {
    if (isAuthenticated) {
      loadReviewStorage();
    }
  }, [isAuthenticated, loadReviewStorage]);

  const fetchMyReviews = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await reviewService.getMyReviews({ page: 1, limit: 100 });
      if (res.data?.reviews) {
        const map = {};
        res.data.reviews.forEach((r) => {
          const pId = r.product?.productId || r.productId;
          if (pId) {
            map[pId] = r;
          }
        });
        setMyReviewsMap(map);
      }
    } catch {
      // Bỏ qua lỗi nếu chưa có đánh giá nào
    }
  }, [isAuthenticated]);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await orderService.getOrders({ page: currentPage, limit: 10 });
      if (res.data && res.data.items) {
        setOrders(res.data.items);
        setTotalPages(res.data.totalPages || 1);
        setTotalOrders(res.data.total ?? res.data.items.length ?? 0);

        // Pre-fetch chi tiết các đơn đã thanh toán để biết các món bên trong đã đánh giá hết chưa
        const paidOrders = res.data.items.filter(
          (o) => o.trangThai === ORDER_STATUS.DATHANHTOAN || o.trangThai === 'COMPLETED'
        );
        paidOrders.forEach(async (po) => {
          try {
            const detail = await orderService.getOrderById(po.maDonHang);
            if (detail?.data?.items) {
              setOrderItemsMap((prev) => ({
                ...prev,
                [po.maDonHang]: detail.data.items.map((it) => it.productId)
              }));
            }
          } catch {
            // ignore
          }
        });
      } else {
        setOrders([]);
        setTotalPages(1);
        setTotalOrders(0);
      }
    } catch (err) {
      setOrders([]);
      setTotalPages(1);
      setTotalOrders(0);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage]);

  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages = [];
    pages.push(1);
    if (currentPage > 3) pages.push('...');
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push('...');
    pages.push(totalPages);
    return pages;
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
      fetchMyReviews();
    }
  }, [isAuthenticated, fetchOrders, fetchMyReviews]);

  const handleOpenRepayModal = (order) => {
    setRepayOrder(order);
    const initialMethod = order.phuongThucTT === 'COD' ? 'COD' : 'VIETQR';
    setRepayMethod(initialMethod);
  };

  const handlePayOrder = async (order) => {
    // Nếu đơn hàng là hình thức trực tuyến (VIETQR / PAYOS / CHUYENKHOAN) -> chuyển thẳng sang trang PayOS
    if (order.phuongThucTT === 'VIETQR' || order.phuongThucTT === 'PAYOS' || order.phuongThucTT === 'CHUYENKHOAN') {
      setRepayingOrderId(order.maDonHang);
      try {
        const payRes = await orderService.createPayment(order.maDonHang);
        const checkoutUrl = payRes?.data?.checkoutUrl || (typeof payRes?.data === 'string' ? payRes.data : null);
        if (checkoutUrl) {
          window.location.href = checkoutUrl;
          return;
        }
        throw new Error('Không nhận được đường dẫn thanh toán từ PayOS');
      } catch (err) {
        addToast({
          type: 'error',
          message: err?.response?.data?.message || err.message || 'Không thể tạo liên kết thanh toán PayOS. Vui lòng thử lại!'
        });
        setRepayingOrderId(null);
      }
    } else {
      // Đơn hàng COD -> mở modal cho phép chuyển đổi sang thanh toán PayOS
      handleOpenRepayModal(order);
    }
  };

  const handleConfirmRepay = async () => {
    if (!repayOrder) return;
    setIsRepaying(true);
    try {
      if (repayMethod === 'COD') {
        await orderService.changePaymentMethod(repayOrder.maDonHang, 'COD');
        addToast({
          type: 'success',
          message: '🎉 Đã chuyển sang thanh toán khi nhận hàng (COD)! Đơn hàng đang được chuẩn bị.'
        });
        setRepayOrder(null);
        await fetchOrders();
      } else {
        // Cập nhật phương thức thành VIETQR nếu cần
        await orderService.changePaymentMethod(repayOrder.maDonHang, 'VIETQR');
        // Tạo link giao dịch PayOS và chuyển hướng thẳng sang trang thanh toán PayOS
        const payRes = await orderService.createPayment(repayOrder.maDonHang);
        const checkoutUrl = payRes?.data?.checkoutUrl || (typeof payRes?.data === 'string' ? payRes.data : null);
        if (checkoutUrl) {
          window.location.href = checkoutUrl;
          return;
        } else {
          throw new Error('Không nhận được đường dẫn thanh toán từ PayOS');
        }
      }
    } catch (err) {
      addToast({
        type: 'error',
        message: err?.response?.data?.message || err.message || 'Không thể thực hiện thanh toán lại. Vui lòng thử lại!'
      });
    } finally {
      setIsRepaying(false);
    }
  };

  const handleViewDetail = async (orderId) => {
    setIsDetailLoading(true);
    try {
      const res = await orderService.getOrderById(orderId);
      if (res.data) {
        setSelectedOrder(res.data);
        if (res.data.items) {
          setOrderItemsMap((prev) => ({
            ...prev,
            [orderId]: res.data.items.map((it) => it.productId)
          }));
        }
      } else {
        throw new Error('Not found');
      }
    } catch (err) {
      addToast({
        type: 'error',
        message: err?.response?.data?.message || 'Không thể tải chi tiết đơn hàng!'
      });
      setSelectedOrder(null);
    } finally {
      setIsDetailLoading(false);
    }
  };

  const getItemReviewStatus = (orderId, productId) => {
    const itemKey = `${orderId}_${productId}`;

    // 1. Kiểm tra nếu chính đơn hàng này đã được ghi nhận đánh giá
    if (reviewedOrderItems[itemKey]) {
      return {
        isReviewed: true,
        rating: reviewedOrderItems[itemKey].rating || 5,
        isDismissed: false
      };
    }

    // 2. Kiểm tra nếu đã có bài đánh giá trên hệ thống
    const existingReview = myReviewsMap[productId];
    if (existingReview) {
      // Tìm các đơn hàng đã thanh toán có chứa sản phẩm này, sắp xếp theo ngày đặt tăng dần (cũ -> mới)
      const ordersWithProduct = orders
        .filter((o) => {
          const items = orderItemsMap[o.maDonHang];
          return (
            (o.trangThai === ORDER_STATUS.DATHANHTOAN || o.trangThai === 'COMPLETED') &&
            items &&
            items.includes(productId)
          );
        })
        .sort((a, b) => new Date(a.ngayLap) - new Date(b.ngayLap));

      if (ordersWithProduct.length > 1) {
        // Có nhiều lần mua:
        // Đơn hàng mới nhất là lần mua sau -> Nếu đơn hiện tại là đơn mới nhất và chưa được ghi nhận đánh giá ở bước 1 -> cho phép đánh giá lần 2!
        const newestOrder = ordersWithProduct[ordersWithProduct.length - 1];
        if (orderId === newestOrder.maDonHang) {
          return { isReviewed: false, rating: null, isDismissed: false };
        }
      }

      // Đối với đơn hàng cũ tương ứng với bài đánh giá -> hiển thị đã đánh giá
      return {
        isReviewed: true,
        rating: existingReview.rating || 5,
        isDismissed: false
      };
    }

    // 3. Kiểm tra nếu sản phẩm bị xóa đánh giá và không phải lần mua sau
    if (dismissedProductIds.includes(productId)) {
      const ordersWithProduct = orders
        .filter((o) => {
          const items = orderItemsMap[o.maDonHang];
          return (
            (o.trangThai === ORDER_STATUS.DATHANHTOAN || o.trangThai === 'COMPLETED') &&
            items &&
            items.includes(productId)
          );
        })
        .sort((a, b) => new Date(a.ngayLap) - new Date(b.ngayLap));

      if (ordersWithProduct.length > 1) {
        const newestOrder = ordersWithProduct[ordersWithProduct.length - 1];
        if (orderId === newestOrder.maDonHang) {
          // Lần mua mới sau khi đã xóa lần cũ -> cho phép đánh giá cho lần mua mới!
          return { isReviewed: false, rating: null, isDismissed: false };
        }
      }

      return {
        isReviewed: false,
        rating: null,
        isDismissed: true
      };
    }

    return { isReviewed: false, rating: null, isDismissed: false };
  };

  const isOrderFullyReviewed = (orderId) => {
    const pIds = orderItemsMap[orderId];
    if (!pIds || pIds.length === 0) return false;
    return pIds.every((pId) => {
      const st = getItemReviewStatus(orderId, pId);
      return st.isReviewed || st.isDismissed;
    });
  };

  const handleOpenReviewItem = (item) => {
    setReviewModalItem(item);
    setReviewRating(5);
    setReviewComment('');
  };

  const handleSubmitReviewItem = async (e) => {
    e.preventDefault();
    if (!reviewModalItem?.productId) return;
    if (!reviewComment.trim()) {
      addToast({ type: 'warning', message: 'Vui lòng nhập nội dung đánh giá sản phẩm!' });
      return;
    }

    setIsReviewSubmitting(true);
    try {
      const res = await reviewService.createReview({
        productId: reviewModalItem.productId,
        rating: reviewRating,
        comment: reviewComment.trim()
      });
      addToast({
        type: 'success',
        message: `Đánh giá sản phẩm "${reviewModalItem.productName}" thành công!`
      });
      const createdId = res?.data?.reviewId || Date.now();

      // Lưu trạng thái đã đánh giá cho đơn hàng cụ thể này
      if (selectedOrder?.maDonHang) {
        const itemKey = `${selectedOrder.maDonHang}_${reviewModalItem.productId}`;
        const revKey = `freshmart_reviewed_order_items_${user?.customerId || user?.userId || user?.username || 'customer'}`;
        const nextReviewed = {
          ...reviewedOrderItems,
          [itemKey]: { rating: reviewRating, date: new Date().toISOString() }
        };
        setReviewedOrderItems(nextReviewed);
        try {
          localStorage.setItem(revKey, JSON.stringify(nextReviewed));
        } catch {
          // ignore
        }
      }

      setMyReviewsMap((prev) => ({
        ...prev,
        [reviewModalItem.productId]: {
          reviewId: createdId,
          rating: reviewRating,
          comment: reviewComment.trim(),
          createdAt: new Date().toISOString(),
          product: {
            productId: reviewModalItem.productId,
            productName: reviewModalItem.productName
          }
        }
      }));
      setReviewModalItem(null);
      fetchMyReviews(); // Cập nhật lại danh sách bài đánh giá ở background
    } catch (err) {
      addToast({
        type: 'error',
        message: err?.response?.data?.message || err.message || 'Không thể gửi đánh giá cho sản phẩm này!'
      });
    } finally {
      setIsReviewSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case ORDER_STATUS.DATHANHTOAN:
      case 'COMPLETED':
        return <span className={`${styles.statusBadge} ${styles.paid}`}>{ORDER_STATUS_LABELS.DATHANHTOAN}</span>;
      case ORDER_STATUS.CHUATHANHTOAN:
      case 'PENDING':
        return <span className={`${styles.statusBadge} ${styles.pending}`}>{ORDER_STATUS_LABELS.CHUATHANHTOAN}</span>;
      case 'SHIPPING':
      case 'PROCESSING':
        return <span className={`${styles.statusBadge} ${styles.shipping}`}>Đang Giao Hàng</span>;
      case ORDER_STATUS.DAHUY:
      case 'DAHUY':
      case 'CANCELLED':
        return <span className={`${styles.statusBadge} ${styles.cancelled}`}>{ORDER_STATUS_LABELS.DAHUY || 'Đã Hủy'}</span>;
      default:
        return <span className={styles.statusBadge}>{ORDER_STATUS_LABELS[status] || status}</span>;
    }
  };

  return (
    <DefaultLayout>
      <div className={styles.ordersPage}>
        <div className={styles.pageHeader}>
          <h1>📦 Quản Lý Đơn Hàng Của Bạn</h1>
          <p>Xem trạng thái xử lý, mã vận đơn và chi tiết hóa đơn mua hàng tại FreshMart</p>
        </div>

        {isLoading ? (
          <div className={styles.loadingBox}>
            <div className={styles.spinner}></div>
            <p>Đang tải danh sách đơn hàng...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className={styles.emptyOrders}>
            <span className={styles.emptyIcon}>🛍️</span>
            <h3>Bạn chưa có đơn hàng nào</h3>
            <p>Hãy khám phá các loại thực phẩm tươi sạch hôm nay và đặt hàng ngay!</p>
            <Link to={PATHS.HOME} className={styles.shopNowBtn}>
              Mua sắm ngay
            </Link>
          </div>
        ) : (
          <div className={styles.ordersTableCard}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Mã đơn hàng</th>
                  <th>Ngày đặt</th>
                  <th>Số mặt hàng</th>
                  <th>Tổng thanh toán</th>
                  <th>Phương thức</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.maDonHang}>
                    <td>
                      <strong className={styles.orderCode}>{o.maDonHang}</strong>
                    </td>
                    <td>{formatDate(o.ngayLap, true)}</td>
                    <td>{o.soLuongMatHang || o.items?.length || 1} món</td>
                    <td>
                      <strong className={styles.totalPrice}>
                        {formatVND(o.tongTienSauGiamGia || o.tongTien)}
                      </strong>
                      {o.tienGiamGia > 0 && (
                        <div style={{ fontSize: 11, color: '#059669', fontWeight: 500 }}>
                          (Giảm {formatVND(o.tienGiamGia)})
                        </div>
                      )}
                    </td>
                    <td>{formatPaymentMethod(o.phuongThucTT)}</td>
                    <td>{getStatusBadge(o.trangThai)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <button
                          type="button"
                          className={styles.viewBtn}
                          onClick={() => handleViewDetail(o.maDonHang)}
                        >
                          Chi tiết
                        </button>
                        {(o.trangThai === ORDER_STATUS.DATHANHTOAN || o.trangThai === 'COMPLETED') && (
                          isOrderFullyReviewed(o.maDonHang) ? (
                            <button
                              type="button"
                              className={styles.reviewOrderBtnDone}
                              disabled
                              title="Tất cả sản phẩm trong hóa đơn này đã hoàn tất đánh giá"
                            >
                              ✅ Đã đánh giá
                            </button>
                          ) : (
                            <button
                              type="button"
                              className={styles.reviewOrderBtn}
                              onClick={() => handleViewDetail(o.maDonHang)}
                              title="Đánh giá các sản phẩm trong hóa đơn này"
                            >
                              ⭐ Đánh giá
                            </button>
                          )
                        )}
                        {(o.trangThai === ORDER_STATUS.CHUATHANHTOAN || o.trangThai === 'PENDING') && (
                          <button
                            type="button"
                            className={styles.repayBtn}
                            disabled={repayingOrderId === o.maDonHang}
                            onClick={() => handlePayOrder(o)}
                          >
                            {repayingOrderId === o.maDonHang ? '⏳ Đang chuyển tới PayOS...' : '💳 Thanh toán lại'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Thanh điều hướng phân trang (10 hóa đơn / trang) */}
            {totalPages > 1 && (
              <div className={styles.paginationBar}>
                <div className={styles.paginationInfo}>
                  Hiển thị <strong>{(currentPage - 1) * 10 + 1}</strong> -{' '}
                  <strong>{Math.min(currentPage * 10, totalOrders)}</strong> trong tổng số{' '}
                  <strong>{totalOrders}</strong> hóa đơn
                </div>
                <div className={styles.paginationControls}>
                  <button
                    type="button"
                    className={styles.pageBtn}
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  >
                    ← Trước
                  </button>

                  <div className={styles.pageNumbers}>
                    {getPageNumbers().map((p, idx) =>
                      p === '...' ? (
                        <span key={`dots-${idx}`} className={styles.pageDots}>
                          ...
                        </span>
                      ) : (
                        <button
                          key={p}
                          type="button"
                          className={`${styles.numberBtn} ${p === currentPage ? styles.activePage : ''}`}
                          onClick={() => setCurrentPage(p)}
                        >
                          {p}
                        </button>
                      )
                    )}
                  </div>

                  <button
                    type="button"
                    className={styles.pageBtn}
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  >
                    Sau →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modal chi tiết đơn hàng */}
        {selectedOrder && (
          <div className={styles.modalOverlay} onClick={() => setSelectedOrder(null)}>
            <div className={styles.invoiceModal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <div className={styles.invoiceTitle}>
                  <h3>Chi Tiết Hóa Đơn #{selectedOrder.maDonHang}</h3>
                  <span className={styles.orderDate}>{formatDate(selectedOrder.ngayLap, true)}</span>
                </div>
                <button
                  type="button"
                  className={styles.closeBtn}
                  onClick={() => setSelectedOrder(null)}
                >
                  ✕
                </button>
              </div>

              <div className={styles.modalBody}>
                {/* Thông tin người nhận */}
                <div className={styles.receiverInfoBox}>
                  <h4>📍 Thông Tin Giao Nhận</h4>
                  <div className={styles.infoRow}>
                    <span>Người nhận:</span>
                    <strong>{selectedOrder.tenNguoiNhan}</strong>
                  </div>
                  <div className={styles.infoRow}>
                    <span>Số điện thoại:</span>
                    <strong>{selectedOrder.soDienThoaiNhan}</strong>
                  </div>
                  <div className={styles.infoRow}>
                    <span>Địa chỉ:</span>
                    <span>{selectedOrder.diaChiGiaoHang}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span>Trạng thái:</span>
                    {getStatusBadge(selectedOrder.trangThai)}
                  </div>
                </div>

                {/* Danh sách mặt hàng */}
                <div className={styles.invoiceItems}>
                  <h4>🛒 Sản Phẩm Đã Mua</h4>
                  <div className={styles.itemsTable}>
                    {selectedOrder.items?.map((it, idx) => (
                      <div key={idx} className={styles.invoiceItemRow}>
                        <div className={styles.itemDetail}>
                          <strong>{it.productName}</strong>
                          <span className={styles.unitPrice}>
                            {formatVND(it.price)} / {it.unit || 'phần'}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span className={styles.qty}>
                            ×{formatQuantity(it.quantity)}{(it.unit || '').toUpperCase() === 'KG' ? ' kg' : ''}
                          </span>
                          <strong className={styles.subtotal}>
                            {formatVND(it.itemTotal || Math.round(it.price * it.quantity))}
                          </strong>
                          {(selectedOrder.trangThai === ORDER_STATUS.DATHANHTOAN || selectedOrder.trangThai === 'COMPLETED') && (
                            (() => {
                              const st = getItemReviewStatus(selectedOrder.maDonHang, it.productId);
                              if (st.isReviewed) {
                                return (
                                  <button
                                    type="button"
                                    className={styles.itemReviewedDisabledBtn}
                                    disabled
                                    title="Bạn đã đánh giá sản phẩm này trong đơn hàng này. Để chỉnh sửa nhận xét, vui lòng vào Hồ sơ > Đánh giá của tôi"
                                  >
                                    ✅ Đã đánh giá ({st.rating}★)
                                  </button>
                                );
                              }
                              if (st.isDismissed) {
                                return (
                                  <button
                                    type="button"
                                    className={styles.itemDismissedDisabledBtn}
                                    disabled
                                    title="Đánh giá cho sản phẩm này trong đơn hàng này đã hoàn tất và không thể đánh giá lại"
                                  >
                                    🔒 Đã đánh giá
                                  </button>
                                );
                              }
                              return (
                                <button
                                  type="button"
                                  className={styles.itemReviewBtn}
                                  onClick={() => handleOpenReviewItem(it)}
                                  title="Đánh giá chất lượng sản phẩm này cho lần mua này"
                                >
                                  ⭐ Đánh giá
                                </button>
                              );
                            })()
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tổng thanh toán */}
                <div className={styles.invoiceTotal}>
                  {selectedOrder.tienGiamGia > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13, color: '#059669' }}>
                      <span>Voucher giảm giá:</span>
                      <strong>-{formatVND(selectedOrder.tienGiamGia)}</strong>
                    </div>
                  )}
                  <span>Tổng tiền thanh toán ({formatPaymentMethod(selectedOrder.phuongThucTT)}):</span>
                  <strong className={styles.grandTotal}>
                    {formatVND(selectedOrder.tongTienSauGiamGia || selectedOrder.tongTien)}
                  </strong>
                </div>

                {/* Nút thanh toán lại trong modal nếu đơn chưa thanh toán */}
                {(selectedOrder.trangThai === ORDER_STATUS.CHUATHANHTOAN || selectedOrder.trangThai === 'PENDING') && (
                  <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end', gap: 10, flexWrap: 'wrap' }}>
                    {selectedOrder.phuongThucTT === 'VIETQR' || selectedOrder.phuongThucTT === 'PAYOS' || selectedOrder.phuongThucTT === 'CHUYENKHOAN' ? (
                      <>
                        <button
                          type="button"
                          className={styles.cancelModalBtn}
                          style={{ padding: '8px 16px', fontSize: '13.5px' }}
                          onClick={() => {
                            const ord = selectedOrder;
                            setSelectedOrder(null);
                            handleOpenRepayModal(ord);
                          }}
                        >
                          💵 Đổi sang nhận hàng COD
                        </button>
                        <button
                          type="button"
                          className={styles.repayBtn}
                          style={{ padding: '8px 20px', fontSize: '14px' }}
                          disabled={repayingOrderId === selectedOrder.maDonHang}
                          onClick={() => handlePayOrder(selectedOrder)}
                        >
                          {repayingOrderId === selectedOrder.maDonHang ? '⏳ Đang chuyển tới PayOS...' : '💳 Thanh toán lại qua PayOS'}
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        className={styles.repayBtn}
                        style={{ padding: '8px 20px', fontSize: '14px' }}
                        onClick={() => {
                          const ord = selectedOrder;
                          setSelectedOrder(null);
                          handleOpenRepayModal(ord);
                        }}
                      >
                        💳 Chuyển sang thanh toán PayOS
                      </button>
                    )}
                  </div>
                )}

                {/* Thông báo nếu đơn đã bị hủy */}
                {(selectedOrder.trangThai === ORDER_STATUS.DAHUY || selectedOrder.trangThai === 'DAHUY' || selectedOrder.trangThai === 'CANCELLED') && (
                  <div style={{ marginTop: 16, padding: '12px 16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#b91c1c', fontSize: '13.5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>⚠️ Đơn hàng này đã bị hủy và không thể thanh toán được nữa.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modal Đánh giá / Chỉnh sửa đánh giá sản phẩm */}
        {reviewModalItem && (
          <div className={styles.modalOverlay} onClick={() => setReviewModalItem(null)}>
            <div className={styles.reviewModalCard} onClick={(e) => e.stopPropagation()}>
              <div className={styles.reviewModalHeader}>
                <h3>⭐ Đánh Giá Sản Phẩm</h3>
                <button type="button" onClick={() => setReviewModalItem(null)}>✕</button>
              </div>
              <form onSubmit={handleSubmitReviewItem} className={styles.reviewModalBody}>
                <div>
                  <h4 style={{ margin: '0 0 4px', fontSize: '15px', color: '#0f172a' }}>
                    {reviewModalItem.productName}
                  </h4>
                  <span style={{ fontSize: '13px', color: '#64748b' }}>
                    Đơn vị: {reviewModalItem.unit || 'phần'} | Giá: {formatVND(reviewModalItem.price)}
                  </span>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 600, marginBottom: '6px' }}>
                    Mức độ hài lòng của bạn:
                  </label>
                  <div className={styles.starRatingRow}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`${styles.starIcon} ${star <= reviewRating ? styles.filled : ''}`}
                        onClick={() => setReviewRating(star)}
                      >
                        ★
                      </span>
                    ))}
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#d97706', marginLeft: '6px' }}>
                      {reviewRating} sao
                    </span>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 600, marginBottom: '6px' }}>
                    Nội dung nhận xét:
                  </label>
                  <textarea
                    className={styles.reviewTextarea}
                    placeholder="Chia sẻ cảm nhận về độ tươi ngon, chất lượng đóng gói hoặc thời gian giao hàng..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                  />
                </div>

                <div className={styles.reviewModalFooter}>
                  <button
                    type="button"
                    className={styles.reviewCancelBtn}
                    onClick={() => setReviewModalItem(null)}
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    disabled={isReviewSubmitting}
                    className={styles.reviewSubmitBtn}
                  >
                    {isReviewSubmitting ? 'Đang gửi...' : '⭐ Gửi Đánh Giá Ngay'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Chọn phương thức thanh toán lại */}
        {repayOrder && (
          <div className={styles.modalOverlay} onClick={() => !isRepaying && setRepayOrder(null)}>
            <div className={styles.repayModalCard} onClick={(e) => e.stopPropagation()}>
              <div className={styles.repayModalHeader}>
                <h3>💳 Thanh Toán Lại Đơn Hàng #{repayOrder.maDonHang}</h3>
                <button type="button" disabled={isRepaying} onClick={() => setRepayOrder(null)}>✕</button>
              </div>

              <div className={styles.repayModalBody}>
                <div className={styles.repayOrderSummaryBox}>
                  <div className={styles.orderInfo}>
                    <span className={styles.code}>Đơn hàng: #{repayOrder.maDonHang}</span>
                    <span className={styles.date}>{formatDate(repayOrder.ngayLap, true)}</span>
                  </div>
                  <div className={styles.orderAmount}>
                    <div className={styles.label}>Số tiền thanh toán:</div>
                    <div className={styles.amount}>
                      {formatVND(repayOrder.tongTienSauGiamGia || repayOrder.tongTien)}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 style={{ margin: '0 0 10px', fontSize: '14px', color: '#1e293b' }}>
                    Chọn phương thức thanh toán mới:
                  </h4>
                  <div className={styles.paymentOptionsList}>
                    {/* Option Dynamic VietQR */}
                    <div
                      className={`${styles.paymentOptionCard} ${repayMethod === 'VIETQR' ? styles.selected : ''}`}
                      onClick={() => setRepayMethod('VIETQR')}
                    >
                      <div className={styles.radioDot}>
                        {repayMethod === 'VIETQR' && <div className={styles.innerDot} />}
                      </div>
                      <span className={styles.icon}>📱</span>
                      <div className={styles.details}>
                        <span className={styles.title}>Cổng thanh toán PayOS (VietQR / Thẻ ATM)</span>
                        <span className={styles.desc}>Chuyển hướng đến cổng thanh toán PayOS an toàn và bảo mật</span>
                      </div>
                    </div>

                    {/* Option COD */}
                    <div
                      className={`${styles.paymentOptionCard} ${repayMethod === 'COD' ? styles.selected : ''}`}
                      onClick={() => setRepayMethod('COD')}
                    >
                      <div className={styles.radioDot}>
                        {repayMethod === 'COD' && <div className={styles.innerDot} />}
                      </div>
                      <span className={styles.icon}>💵</span>
                      <div className={styles.details}>
                        <span className={styles.title}>Thanh toán tiền mặt khi nhận hàng (COD)</span>
                        <span className={styles.desc}>Nhân viên FreshMart giao tận nơi và thu tiền</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.repayModalActions}>
                  <button
                    type="button"
                    className={styles.cancelModalBtn}
                    disabled={isRepaying}
                    onClick={() => setRepayOrder(null)}
                  >
                    Đóng
                  </button>
                  <button
                    type="button"
                    className={styles.submitRepayBtn}
                    disabled={isRepaying}
                    onClick={handleConfirmRepay}
                  >
                    {isRepaying ? 'Đang chuyển tới PayOS...' : repayMethod === 'VIETQR' ? 'Tiếp tục thanh toán qua PayOS' : 'Xác nhận chuyển sang COD'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
};

export default OrdersContainer;
