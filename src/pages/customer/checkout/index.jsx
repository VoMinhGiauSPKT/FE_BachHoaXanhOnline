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
  const { createOrder } = useOrderStore();
  const { availablePromotions, fetchAvailablePromotions } = usePromotionStore();
  const { addresses, fetchAddresses } = useAddressStore();

  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [selectedPromo, setSelectedPromo] = useState(null);
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

  const discountAmount = selectedPromo
    ? Math.min(
        Math.round((totalAmount * (selectedPromo.discountPercent || 0)) / 100),
        selectedPromo.maxDiscountAmount || 999999999
      )
    : 0;

  const finalAmount = Math.max(0, totalAmount - discountAmount);

  const handleAddressSelect = (addrId) => {
    const addr = addresses.find((a) => (a.addressId || a.id) === addrId);
    if (addr) {
      form.setFieldsValue({
        tenNguoiNhan: addr.receiverName,
        soDienThoaiNhan: addr.phoneNumber,
        diaChiGiaoHang: `${addr.street}, ${addr.ward}, ${addr.city}`
      });
    }
  };

  const handlePromoChange = (code) => {
    const found = availablePromotions.find((p) => (p.code || p.maKhuyenMai) === code);
    setSelectedPromo(found || null);
  };

  const handleSubmitOrder = async () => {
    try {
      const values = await form.validateFields();
      setIsSubmitting(true);

      const orderPayload = {
        tenNguoiNhan: values.tenNguoiNhan,
        soDienThoaiNhan: values.soDienThoaiNhan,
        diaChiGiaoHang: values.diaChiGiaoHang,
        ghiChu: values.ghiChu || '',
        maKhuyenMai: selectedPromo?.code || undefined,
        paymentMethod
      };

      const res = await createOrder(orderPayload);
      if (res.success) {
        const order = res.data?.data || res.data;
        setCreatedOrder(order);
        clearCart();

        if (paymentMethod === 'VIETQR') {
          setVietQrPaymentData({
            orderId: order.orderId || order.id,
            amount: finalAmount,
            qrCodeUrl: order.qrCodeUrl || order.paymentUrl
          });
        } else {
          message.success('Đặt hàng thành công! Đơn hàng đang được chuẩn bị.');
          navigate(PATHS.ORDERS);
        }
      } else {
        message.error(res.error || 'Đặt hàng thất bại');
      }
    } catch (err) {
      // Validate failed
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
            { title: 'Chọn món tươi' },
            { title: 'Thông tin & Thanh toán' },
            { title: 'Giao hàng tận nơi' }
          ]}
        />

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={15}>
            <CheckoutForm
              form={form}
              promotions={availablePromotions}
              selectedPromo={selectedPromo}
              paymentMethod={paymentMethod}
              addresses={addresses}
              onPromoChange={handlePromoChange}
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
            open={Boolean(vietQrPaymentData)}
            paymentData={vietQrPaymentData}
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
