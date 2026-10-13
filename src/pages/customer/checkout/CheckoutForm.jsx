import React from 'react';
import { Card, Form, Input, Radio, Space, Typography } from 'antd';
import { QrcodeOutlined, DollarOutlined } from '@ant-design/icons';
import AddressSelector from './AddressSelector';
import PromotionSelector from './PromotionSelector';
import { getPhoneRules } from '../../../utils/validators';

const { Text } = Typography;

export const CheckoutForm = ({
  form,
  promotions = [],
  selectedPromo,
  totalAmount = 0,
  paymentMethod = 'COD',
  addresses = [],
  selectedAddressId,
  onPromoSelect,
  onPromoRemove,
  onPaymentChange,
  onAddressSelect
}) => {
  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      {/* 1. Chọn địa chỉ từ sổ địa chỉ */}
      <AddressSelector
        addresses={addresses}
        selectedId={selectedAddressId}
        onSelect={onAddressSelect}
      />

      {/* 2. Thông tin giao hàng chi tiết */}
      <Card title="Thông tin nhận hàng" size="small">
        <Form form={form} layout="vertical">
          <Form.Item
            name="tenNguoiNhan"
            label="Họ tên người nhận"
            rules={[{ required: true, message: 'Vui lòng nhập tên người nhận' }]}
          >
            <Input placeholder="Nguyễn Văn A" size="large" />
          </Form.Item>

          <Form.Item
            name="soDienThoaiNhan"
            label="Số điện thoại nhận hàng"
            rules={getPhoneRules(true, 'Vui lòng nhập số điện thoại nhận hàng')}
          >
            <Input placeholder="0901234567" size="large" />
          </Form.Item>

          <Form.Item
            name="diaChiGiaoHang"
            label="Địa chỉ chi tiết nhận hàng"
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ giao hàng' }]}
          >
            <Input placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố" size="large" />
          </Form.Item>

          <Form.Item name="ghiChu" label="Ghi chú đơn hàng (Tùy chọn)">
            <Input.TextArea rows={2} placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi đến..." />
          </Form.Item>
        </Form>
      </Card>

      {/* 3. Phương thức thanh toán */}
      <Card title="Phương thức thanh toán" size="small">
        <Radio.Group
          value={paymentMethod}
          onChange={(e) => onPaymentChange(e.target.value)}
          style={{ width: '100%' }}
        >
          <Space direction="vertical" style={{ width: '100%' }} size={12}>
            <Radio
              value="COD"
              style={{
                border: paymentMethod === 'COD' ? '2px solid #008848' : '1px solid #e2e8f0',
                padding: '12px 16px',
                borderRadius: 8,
                width: '100%',
                backgroundColor: paymentMethod === 'COD' ? '#f0fdf4' : '#ffffff'
              }}
            >
              <Space direction="vertical" size={2}>
                <Space>
                  <DollarOutlined style={{ color: '#008848', fontSize: 18 }} />
                  <Text strong>Thanh toán tiền mặt khi nhận hàng (COD)</Text>
                </Space>
                <Text type="secondary" style={{ fontSize: 12, marginLeft: 26 }}>
                  Kiểm tra hàng tươi ngon và thanh toán trực tiếp cho nhân viên giao hàng
                </Text>
              </Space>
            </Radio>

            <Radio
              value="VIETQR"
              style={{
                border: paymentMethod === 'VIETQR' ? '2px solid #0284c7' : '1px solid #e2e8f0',
                padding: '12px 16px',
                borderRadius: 8,
                width: '100%',
                backgroundColor: paymentMethod === 'VIETQR' ? '#f0f9ff' : '#ffffff'
              }}
            >
              <Space direction="vertical" size={2}>
                <Space>
                  <QrcodeOutlined style={{ color: '#0284c7', fontSize: 18 }} />
                  <Text strong>Chuyển khoản trực tuyến VietQR (PayOS)</Text>
                </Space>
                <Text type="secondary" style={{ fontSize: 12, marginLeft: 26 }}>
                  Quét mã QR từ mọi ứng dụng ngân hàng, hệ thống xác nhận thanh toán tự động
                </Text>
              </Space>
            </Radio>
          </Space>
        </Radio.Group>
      </Card>

      {/* 4. Voucher & Khuyến mãi */}
      <PromotionSelector
        promotions={promotions}
        selectedCode={selectedPromo?.promotionCode || selectedPromo?.code || selectedPromo?.maKhuyenMai}
        totalAmount={totalAmount}
        onSelectPromo={onPromoSelect}
        onRemovePromo={onPromoRemove}
      />
    </Space>
  );
};

export default CheckoutForm;
