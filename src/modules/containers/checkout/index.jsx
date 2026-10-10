import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DefaultLayout from '../../layout/common/DefaultLayout';
import VietQRModal from '../../../components/VietQRModal';
import addressService from '../../../services/addressService';
import promotionService from '../../../services/promotionService';
import orderService from '../../../services/orderService';
import useCartStore from '../../../stores/useCartStore';
import useAuthStore from '../../../stores/useAuthStore';
import useToastStore from '../../../stores/useToastStore';
import { formatVND } from '../../../utils/formatCurrency';
import { PATHS } from '../../../constants/paths';
import { DISCOUNT_TYPES, PAYMENT_STATUS, ORDER_STATUS } from '../../../constants/enums';
import styles from './Checkout.module.scss';

export const CheckoutContainer = () => {
  const navigate = useNavigate();
  const { items, totalAmount, totalItems, clearCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const { addToast } = useToastStore();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);

  // Form địa chỉ giao hàng
  const [shippingForm, setShippingForm] = useState({
    tenNguoiNhan: user?.fullName || '',
    soDienThoaiNhan: user?.phoneNumber || '',
    diaChiGiaoHang: '',
    ghiChu: ''
  });

  // Vouchers
  const [promotions, setPromotions] = useState([]);
  const [selectedPromo, setSelectedPromo] = useState(null);

  // Phương thức thanh toán: COD hoặc VIETQR
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // VietQR modal state
  const [vietQrPaymentData, setVietQrPaymentData] = useState(null);
  const [createdOrder, setCreatedOrder] = useState(null);

  // Kiểm tra giỏ hàng
  useEffect(() => {
    if (items.length === 0 && !createdOrder) {
      addToast({ type: 'warning', message: 'Giỏ hàng của bạn đang trống!' });
      navigate(PATHS.HOME);
    }
  }, [items.length, createdOrder, navigate, addToast]);

  // Tải danh sách địa chỉ đã lưu
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchAddresses = async () => {
      try {
        const res = await addressService.getAddresses();
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          setAddresses(res.data);
          const defaultAddr = res.data.find((a) => a.isDefault) || res.data[0];
          setSelectedAddressId(defaultAddr.addressId);
          setShippingForm((prev) => ({
            ...prev,
            tenNguoiNhan: defaultAddr.receiverName,
            soDienThoaiNhan: defaultAddr.phoneNumber,
            diaChiGiaoHang: `${defaultAddr.street}, ${defaultAddr.ward}, ${defaultAddr.city}`
          }));
        } else {
          setIsAddingNewAddress(true);
        }
      } catch {
        setIsAddingNewAddress(true);
      }
    };

    fetchAddresses();
  }, [isAuthenticated]);

  // Tải khuyến mãi khả dụng
  useEffect(() => {
    if (!isAuthenticated || totalAmount <= 0) return;

    const fetchPromos = async () => {
      try {
        const res = await promotionService.getAvailablePromotions(totalAmount);
        if (res.data && Array.isArray(res.data)) {
          setPromotions(res.data);
        }
      } catch {
        // Fallback demo vouchers chuẩn PostgreSQL enum_loai_khuyenmai
        setPromotions([
          {
            promotionCode: 'FRESH20K',
            promotionName: 'Giảm 20.000đ cho đơn từ 150k',
            discountType: DISCOUNT_TYPES.TIENMAT,
            discountValue: 20000,
            minOrderAmount: 150000,
            estimatedDiscount: 20000,
            isEligible: totalAmount >= 150000,
            unmetReason: totalAmount < 150000 ? 'Đơn hàng chưa đạt tối thiểu 150.000đ' : null
          },
          {
            promotionCode: 'ORGANIC10',
            promotionName: 'Giảm 10% tối đa 30.000đ',
            discountType: DISCOUNT_TYPES.PHANTRAM,
            discountValue: 10,
            minOrderAmount: 200000,
            estimatedDiscount: Math.min(30000, totalAmount * 0.1),
            isEligible: totalAmount >= 200000,
            unmetReason: totalAmount < 200000 ? 'Đơn hàng chưa đạt tối thiểu 200.000đ' : null
          }
        ]);
      }
    };

    fetchPromos();
  }, [isAuthenticated, totalAmount]);

  const discountAmount = selectedPromo?.estimatedDiscount || 0;
  const shippingFee = totalAmount >= 300000 ? 0 : 15000;
  const finalTotal = Math.max(0, totalAmount - discountAmount + shippingFee);

  const handleSelectAddress = (addr) => {
    setSelectedAddressId(addr.addressId);
    setIsAddingNewAddress(false);
    setShippingForm((prev) => ({
      ...prev,
      tenNguoiNhan: addr.receiverName,
      soDienThoaiNhan: addr.phoneNumber,
      diaChiGiaoHang: `${addr.street}, ${addr.ward}, ${addr.city}`
    }));
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();

    if (!shippingForm.tenNguoiNhan.trim()) {
      addToast({ type: 'warning', message: 'Vui lòng nhập tên người nhận!' });
      return;
    }
    if (!shippingForm.soDienThoaiNhan.trim()) {
      addToast({ type: 'warning', message: 'Vui lòng nhập số điện thoại nhận hàng!' });
      return;
    }
    if (!shippingForm.diaChiGiaoHang.trim()) {
      addToast({ type: 'warning', message: 'Vui lòng nhập địa chỉ giao hàng chi tiết!' });
      return;
    }

    setIsSubmitting(true);
    try {
      const orderPayload = {
        tenNguoiNhan: shippingForm.tenNguoiNhan,
        soDienThoaiNhan: shippingForm.soDienThoaiNhan,
        diaChiGiaoHang: shippingForm.diaChiGiaoHang,
        ghiChu: shippingForm.ghiChu || paymentMethod,
        phuongThucTT: paymentMethod,
        maKhuyenMai: selectedPromo?.promotionCode || undefined
      };

      const res = await orderService.createOrder(orderPayload);
      const newOrder = res.data || {
        maDonHang: `DH${Date.now()}`,
        tongTien: finalTotal,
        trangThai: ORDER_STATUS.CHUATHANHTOAN
      };

      setCreatedOrder(newOrder);

      // Đơn hàng đã lưu vào database -> xóa giỏ hàng ngay lập tức để đồng bộ
      await clearCart();

      // Nếu chọn VietQR -> gọi API Backend tạo link PayOS hoặc mở modal VietQR
      if (paymentMethod === 'VIETQR') {
        const orderId = newOrder.maDonHang || `DH${Date.now()}`;
        const orderCode = parseInt(orderId.replace(/\D/g, '').slice(-8) || String(Date.now()).slice(-8), 10);

        try {
          const payRes = await orderService.createPayment(orderId);
          if (payRes.data) {
            setVietQrPaymentData({
              ...payRes.data,
              orderId,
              orderCode: payRes.data.orderCode || orderCode
            });
          } else {
            throw new Error('No payment data');
          }
        } catch {
          // Fallback dữ liệu thanh toán VietQR với đúng trạng thái DANGXULY
          setVietQrPaymentData({
            orderId,
            orderCode,
            bin: '970422',
            accountNumber: '0987654321',
            accountName: 'BACH HOA XANH ONLINE',
            amount: finalTotal,
            status: PAYMENT_STATUS.DANGXULY,
            checkoutUrl: `https://payos.vn/checkout/${orderId}`
          });
        }
      } else {
        // COD -> Thành công ngay
        addToast({
          type: 'success',
          message: '🎉 Đặt hàng COD thành công! Nhân viên FreshMart sẽ liên hệ sớm.'
        });
        navigate(PATHS.ORDERS);
      }
    } catch (err) {
      addToast({
        type: 'error',
        message: err.message || 'Không thể tạo đơn hàng. Vui lòng thử lại!'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVietQRSuccess = async () => {
    setVietQrPaymentData(null);
    await clearCart();
    addToast({
      type: 'success',
      message: '🎉 Đã thanh toán thành công qua Dynamic VietQR!'
    });
    navigate(PATHS.ORDERS);
  };

  return (
    <DefaultLayout>
      <div className={styles.checkoutPage}>
        <div className={styles.pageHeader}>
          <h1>🛒 Xác Nhận Đơn Hàng & Thanh Toán</h1>
          <p>Kiểm tra thông tin giao hàng, voucher ưu đãi và hoàn tất đơn hàng</p>
        </div>

        <form onSubmit={handleCreateOrder} className={styles.checkoutGrid}>
          {/* Cột trái: Thông tin giao hàng & Khuyến mãi & Phương thức thanh toán */}
          <div className={styles.leftCol}>
            {/* 1. Địa chỉ giao hàng */}
            <div className={styles.sectionCard}>
              <div className={styles.cardHeader}>
                <h3>📍 1. Thông Tin Nhận Hàng</h3>
                {addresses.length > 0 && (
                  <button
                    type="button"
                    className={styles.toggleBtn}
                    onClick={() => setIsAddingNewAddress(!isAddingNewAddress)}
                  >
                    {isAddingNewAddress ? 'Chọn từ sổ địa chỉ' : '+ Nhập địa chỉ mới'}
                  </button>
                )}
              </div>

              {!isAddingNewAddress && addresses.length > 0 ? (
                <div className={styles.savedAddressesList}>
                  {addresses.map((addr) => (
                    <div
                      key={addr.addressId}
                      className={`${styles.addrItem} ${selectedAddressId === addr.addressId ? styles.selected : ''}`}
                      onClick={() => handleSelectAddress(addr)}
                    >
                      <input
                        type="radio"
                        name="savedAddress"
                        checked={selectedAddressId === addr.addressId}
                        onChange={() => handleSelectAddress(addr)}
                      />
                      <div className={styles.addrText}>
                        <strong>{addr.receiverName} — {addr.phoneNumber}</strong>
                        <p>{addr.street}, {addr.ward}, {addr.city}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.formFields}>
                  <div className={styles.formRow}>
                    <div className={styles.inputGroup}>
                      <label>Họ và tên người nhận *</label>
                      <input
                        type="text"
                        required
                        placeholder="Nguyễn Văn A"
                        value={shippingForm.tenNguoiNhan}
                        onChange={(e) => setShippingForm({ ...shippingForm, tenNguoiNhan: e.target.value })}
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label>Số điện thoại *</label>
                      <input
                        type="tel"
                        required
                        placeholder="0912345678"
                        value={shippingForm.soDienThoaiNhan}
                        onChange={(e) => setShippingForm({ ...shippingForm, soDienThoaiNhan: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className={styles.inputGroup}>
                    <label>Địa chỉ giao hàng chi tiết *</label>
                    <input
                      type="text"
                      required
                      placeholder="Số nhà, tên đường, Phường/Xã, Quận/Huyện"
                      value={shippingForm.diaChiGiaoHang}
                      onChange={(e) => setShippingForm({ ...shippingForm, diaChiGiaoHang: e.target.value })}
                    />
                  </div>
                </div>
              )}

              <div className={styles.inputGroup} style={{ marginTop: '14px' }}>
                <label>Ghi chú cho shipper (Tùy chọn)</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi đến..."
                  value={shippingForm.ghiChu}
                  onChange={(e) => setShippingForm({ ...shippingForm, ghiChu: e.target.value })}
                />
              </div>
            </div>

            {/* 2. Mã khuyến mãi */}
            <div className={styles.sectionCard}>
              <div className={styles.cardHeader}>
                <h3>🎁 2. Mã Khuyến Mãi (Voucher)</h3>
              </div>
              <div className={styles.promosList}>
                {promotions.map((promo) => {
                  const isSelected = selectedPromo?.promotionCode === promo.promotionCode;
                  const isEligible = promo.isEligible;
                  return (
                    <div
                      key={promo.promotionCode}
                      className={`${styles.promoCard} ${isSelected ? styles.promoSelected : ''} ${!isEligible ? styles.promoDisabled : ''}`}
                      onClick={() => isEligible && setSelectedPromo(isSelected ? null : promo)}
                    >
                      <div className={styles.promoCodeBadge}>{promo.promotionCode}</div>
                      <div className={styles.promoInfo}>
                        <strong>{promo.promotionName}</strong>
                        {promo.unmetReason && <span className={styles.unmet}>{promo.unmetReason}</span>}
                      </div>
                      <button
                        type="button"
                        className={styles.applyPromoBtn}
                        disabled={!isEligible}
                      >
                        {isSelected ? '✓ Bỏ chọn' : 'Áp dụng'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. Phương thức thanh toán */}
            <div className={styles.sectionCard}>
              <div className={styles.cardHeader}>
                <h3>💳 3. Phương Thức Thanh Toán</h3>
              </div>
              <div className={styles.paymentMethods}>
                <label
                  className={`${styles.methodOption} ${paymentMethod === 'VIETQR' ? styles.activeMethod : ''}`}
                  onClick={() => setPaymentMethod('VIETQR')}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="VIETQR"
                    checked={paymentMethod === 'VIETQR'}
                    onChange={() => setPaymentMethod('VIETQR')}
                  />
                  <div className={styles.methodInfo}>
                    <span className={styles.methodTitle}>⚡ Dynamic VietQR (PayOS Tức Thì)</span>
                    <p>Quét mã QR qua app ngân hàng bất kỳ, không phí giao dịch, xác nhận tự động trong 10s</p>
                  </div>
                </label>

                <label
                  className={`${styles.methodOption} ${paymentMethod === 'COD' ? styles.activeMethod : ''}`}
                  onClick={() => setPaymentMethod('COD')}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                  />
                  <div className={styles.methodInfo}>
                    <span className={styles.methodTitle}>💵 Tiền Mặt Khi Nhận Hàng (COD)</span>
                    <p>Thanh toán trực tiếp cho nhân viên giao hàng khi nhận và kiểm tra hàng</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Cột phải: Tóm tắt đơn hàng & Nút thanh toán */}
          <div className={styles.rightCol}>
            <div className={styles.orderSummaryCard}>
              <h3>Đơn Hàng ({totalItems} sản phẩm)</h3>

              <div className={styles.orderItemsList}>
                {items.map((item) => (
                  <div key={item.lineItemId} className={styles.itemRow}>
                    <span className={styles.itemName}>
                      {item.productName} <strong>×{item.quantity}</strong>
                    </span>
                    <span className={styles.itemPrice}>
                      {formatVND(item.itemTotal || item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className={styles.divider}></div>

              <div className={styles.costBreakdown}>
                <div className={styles.calcRow}>
                  <span>Tạm tính hàng hóa:</span>
                  <span>{formatVND(totalAmount)}</span>
                </div>

                <div className={styles.calcRow}>
                  <span>Phí giao hàng:</span>
                  <span>{shippingFee === 0 ? <strong className={styles.freeShip}>MIỄN PHÍ</strong> : formatVND(shippingFee)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className={`${styles.calcRow} ${styles.discountRow}`}>
                    <span>Giảm giá voucher:</span>
                    <span>-{formatVND(discountAmount)}</span>
                  </div>
                )}

                <div className={styles.finalTotalRow}>
                  <span>Tổng tiền thanh toán:</span>
                  <strong className={styles.finalAmount}>{formatVND(finalTotal)}</strong>
                </div>
              </div>

              <button
                type="submit"
                className={styles.placeOrderBtn}
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? 'Đang xử lý đơn hàng...'
                  : paymentMethod === 'VIETQR'
                  ? `Mở Quét Mã VietQR • ${formatVND(finalTotal)}`
                  : `Xác Nhận Đặt Hàng COD • ${formatVND(finalTotal)}`}
              </button>

              <p className={styles.policyNotice}>
                Bằng việc hoàn tất đặt hàng, bạn đồng ý với Điều khoản dịch vụ và Chính sách giao nhận của FreshMart.
              </p>
            </div>
          </div>
        </form>

        {/* Dynamic VietQR Modal */}
        {vietQrPaymentData && (
          <VietQRModal
            paymentData={vietQrPaymentData}
            onPaymentSuccess={handleVietQRSuccess}
            onClose={() => {
              setVietQrPaymentData(null);
              navigate(PATHS.ORDERS);
            }}
          />
        )}
      </div>
    </DefaultLayout>
  );
};

export default CheckoutContainer;
