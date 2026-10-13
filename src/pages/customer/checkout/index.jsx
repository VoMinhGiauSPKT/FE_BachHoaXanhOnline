import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Row, Col, Steps, message } from 'antd';
import MainLayout from '../../../layouts/MainLayout';
import VietQRModal from '../../../components/VietQRModal';
import useCartStore from '../../../stores/useCartStore';
import useAuthStore from '../../../stores/useAuthStore';
import { useOrderStore } from '../../../stores/useOrderStore';
import { usePromotionStore } from '../../../stores/usePromotionStore';
import { useAddressStore } from '../../../stores/useAddressStore';
import { PATHS } from '../../../constants/paths';
import CheckoutForm from './CheckoutForm';
import OrderSummary from './OrderSummary';
import styles from './Checkout.module.scss';

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { user } = useAuthStore();
  const { items, totalAmount, clearCart } = useCartStore();
  const { createOrder, createPayment } = useOrderStore();
  const { availablePromotions, fetchAvailablePromotions } = usePromotionStore();
  const { addresses, fetchAddresses } = useAddressStore();

  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [selectedPromo, setSelectedPromo] = useState(null);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [vietQrPaymentData, setVietQrPaymentData] = useState(null);
  const [createdOrder, setCreatedOrder] = useState(null);

  useEffect(() => {
    if (items.length === 0 && !createdOrder) {
      message.warning('Giỏ hàng trống!');
      navigate(PATHS.HOME);
    }
  }, [items.length, createdOrder, navigate]);

  useEffect(() => {
    fetchAddresses();
    fetchAvailablePromotions(totalAmount);
    form.setFieldsValue({
      tenNguoiNhan: user?.fullName || '',
      soDienThoaiNhan: user?.phoneNumber || ''
    });
  }, [totalAmount, user, form, fetchAddresses, fetchAvailablePromotions]);

  // Tự động gán địa chỉ mặc định nếu có
  useEffect(() => {
    if (addresses && addresses.length > 0 && !selectedAddressId) {
      const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];
      if (defaultAddr) {
        const id = defaultAddr.addressId || defaultAddr.id;
        setSelectedAddressId(id);
        form.setFieldsValue({
          tenNguoiNhan: defaultAddr.receiverName,
          soDienThoaiNhan: defaultAddr.phoneNumber,
          diaChiGiaoHang: `${defaultAddr.street}, ${defaultAddr.ward}, ${defaultAddr.city}`
        });
      }
    }
  }, [addresses, selectedAddressId, form]);

  // Tính toán số tiền giảm giá chính xác theo loại % hoặc Tiền mặt & mốc tối thiểu
  let discountAmount = 0;
  if (selectedPromo) {
    const minOrder = Number(selectedPromo.minOrderAmount || selectedPromo.donHangToiThieu || 0);
    if (totalAmount >= minOrder) {
      const isPercent = (selectedPromo.discountType || selectedPromo.loaiKhuyenMai) === 'PHANTRAM';
      const val = Number(selectedPromo.discountValue || selectedPromo.giaTriGiam || selectedPromo.discountPercent || 0);
      const maxDisc = Number(selectedPromo.maxDiscount || selectedPromo.giamToiDa || 0);

      if (isPercent) {
        discountAmount = Math.round((totalAmount * val) / 100);
        if (maxDisc > 0 && discountAmount > maxDisc) {
          discountAmount = maxDisc;
        }
      } else {
        discountAmount = val;
      }
      if (discountAmount > totalAmount) {
        discountAmount = totalAmount;
      }
    }
  }

  const finalAmount = Math.max(0, totalAmount - discountAmount);

  const handleAddressSelect = (addr) => {
    const id = addr.addressId || addr.id;
    setSelectedAddressId(id);
    form.setFieldsValue({
      tenNguoiNhan: addr.receiverName,
      soDienThoaiNhan: addr.phoneNumber,
      diaChiGiaoHang: `${addr.street}, ${addr.ward}, ${addr.city}`
    });
  };

  const handleSubmitOrder = async () => {
    try {
      const values = await form.validateFields();
      setIsSubmitting(true);

      const promoCode = selectedPromo?.promotionCode || selectedPromo?.code || selectedPromo?.maKhuyenMai;
      const orderPayload = {
        tenNguoiNhan: values.tenNguoiNhan,
        soDienThoaiNhan: values.soDienThoaiNhan,
        diaChiGiaoHang: values.diaChiGiaoHang,
        ghiChu: values.ghiChu || '',
        maKhuyenMai: promoCode || undefined,
        phuongThucTT: paymentMethod
      };

      const res = await createOrder(orderPayload);
      if (res.success) {
        const order = res.data?.data || res.data;
        const orderId = order.maDonHang || order.orderId || order.id;
        setCreatedOrder(order);
        clearCart();

        if (paymentMethod === 'VIETQR') {
          try {
            const payRes = await createPayment(orderId);
            if (payRes.success) {
              const payData = payRes.data?.data || payRes.data;
              setVietQrPaymentData(payData);
            } else {
              message.warning('Chưa tạo được liên kết VietQR. Quý khách có thể thanh toán tại Đơn hàng của tôi.');
              navigate(PATHS.ORDERS);
            }
          } catch {
            message.warning('Vui lòng truy cập Đơn hàng của tôi để thanh toán lại.');
            navigate(PATHS.ORDERS);
          }
        } else {
          message.success('Đặt hàng thành công! Cảm ơn bạn đã mua sắm tại FreshMart.');
          navigate(PATHS.ORDERS);
        }
      } else {
        message.error(res.error || 'Đặt hàng không thành công');
      }
    } catch {
      // Form validation error
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className={styles.checkoutContainer}>
        <Steps
          current={1}
          style={{ marginBottom: 28 }}
          items={[
            { title: 'Giỏ hàng tươi sạch' },
            { title: 'Địa chỉ & Thanh toán' },
            { title: 'Hoàn tất đơn hàng' }
          ]}
        />

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={15}>
            <CheckoutForm
              form={form}
              promotions={availablePromotions}
              selectedPromo={selectedPromo}
              totalAmount={totalAmount}
              paymentMethod={paymentMethod}
              addresses={addresses}
              selectedAddressId={selectedAddressId}
              onPromoSelect={setSelectedPromo}
              onPromoRemove={() => setSelectedPromo(null)}
              onPaymentChange={setPaymentMethod}
              onAddressSelect={handleAddressSelect}
            />
          </Col>

          <Col xs={24} lg={9}>
            <OrderSummary
              items={items}
              totalAmount={totalAmount}
              discountAmount={discountAmount}
              finalAmount={finalAmount}
              isSubmitting={isSubmitting}
              onSubmit={handleSubmitOrder}
            />
          </Col>
        </Row>

        {vietQrPaymentData && (
          <VietQRModal
            paymentData={vietQrPaymentData}
            onPaymentSuccess={() => {
              setVietQrPaymentData(null);
              navigate(PATHS.ORDERS);
            }}
            onClose={() => {
              setVietQrPaymentData(null);
              navigate(PATHS.ORDERS);
            }}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default CheckoutPage;
