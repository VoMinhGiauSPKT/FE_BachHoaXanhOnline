import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DefaultLayout from '../../layout/common/DefaultLayout';
import orderService from '../../../services/orderService';
import reviewService from '../../../services/reviewService';
import useAuthStore from '../../../stores/useAuthStore';
import useToastStore from '../../../stores/useToastStore';
import { formatVND } from '../../../utils/formatCurrency';
import { formatDate } from '../../../utils/formatDate';
import { formatPaymentMethod } from '../../../utils/formatPayment';
import { PATHS } from '../../../constants/paths';
import { ORDER_STATUS, ORDER_STATUS_LABELS } from '../../../constants/enums';
import styles from './Orders.module.scss';

export const OrdersContainer = () => {
  const { isAuthenticated, userType } = useAuthStore();
  const { addToast } = useToastStore();

  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Modal chi tiết đơn hàng
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  // Modal đánh giá sản phẩm (dành cho đơn hàng DATHANHTOAN)
  const [reviewModalItem, setReviewModalItem] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isReviewSubmitting, setIsReviewSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const res = await orderService.getOrders({ page: currentPage, limit: 10 });
        if (res.data && res.data.items) {
          setOrders(res.data.items);
          setTotalPages(res.data.totalPages || 1);
        } else {
          setOrders([]);
          setTotalPages(1);
        }
      } catch (err) {
        setOrders([]);
        setTotalPages(1);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, currentPage]);

  const handleViewDetail = async (orderId) => {
    setIsDetailLoading(true);
    try {
      const res = await orderService.getOrderById(orderId);
      if (res.data) {
        setSelectedOrder(res.data);
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
      await reviewService.createReview({
        productId: reviewModalItem.productId,
        rating: reviewRating,
        comment: reviewComment.trim()
      });
      addToast({
        type: 'success',
        message: `Đánh giá sản phẩm "${reviewModalItem.productName}" thành công!`
      });
      setReviewModalItem(null);
    } catch (err) {
      addToast({
        type: 'error',
        message: err?.response?.data?.message || 'Không thể gửi đánh giá cho sản phẩm này!'
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
      case 'CANCELLED':
        return <span className={`${styles.statusBadge} ${styles.cancelled}`}>Đã Hủy</span>;
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
                      <strong className={styles.totalPrice}>{formatVND(o.tongTien)}</strong>
                    </td>
                    <td>{formatPaymentMethod(o.phuongThucTT)}</td>
                    <td>{getStatusBadge(o.trangThai)}</td>
                    <td>
                      <button
                        type="button"
                        className={styles.viewBtn}
                        onClick={() => handleViewDetail(o.maDonHang)}
                      >
                        Chi tiết
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                          <span className={styles.qty}>×{it.quantity}</span>
                          <strong className={styles.subtotal}>
                            {formatVND(it.itemTotal || it.price * it.quantity)}
                          </strong>
                          {selectedOrder.trangThai === ORDER_STATUS.DATHANHTOAN && (
                            <button
                              type="button"
                              className={styles.itemReviewBtn}
                              onClick={() => handleOpenReviewItem(it)}
                            >
                              ⭐ Đánh giá
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tổng thanh toán */}
                <div className={styles.invoiceTotal}>
                  <span>Tổng tiền thanh toán ({formatPaymentMethod(selectedOrder.phuongThucTT)}):</span>
                  <strong className={styles.grandTotal}>{formatVND(selectedOrder.tongTien)}</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Đánh giá sản phẩm */}
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

                <button
                  type="submit"
                  disabled={isReviewSubmitting}
                  className={styles.reviewSubmitBtn}
                >
                  {isReviewSubmitting ? 'Đang gửi...' : 'Gửi Đánh Giá Ngay'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
};

export default OrdersContainer;
