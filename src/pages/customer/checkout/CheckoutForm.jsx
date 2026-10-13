import React from 'react';
import { Card, Form, Input, Radio, Select, Space } from 'antd';
import { QrcodeOutlined, DollarOutlined } from '@ant-design/icons';

export const CheckoutForm = ({
  form,
  promotions,
  selectedPromo,
  paymentMethod,
  addresses,
  onPromoChange,
  onPaymentChange,
  onAddressSelect
}) => {
  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      {addresses && addresses.length > 0 && (
        <Card title="Sổ địa chỉ đã lưu" size="small">
          <Select
            placeholder="Chọn địa chỉ nhận hàng có sẵn"
            style={{ width: '100%' }}
            onChange={onAddressSelect}
          >
            {addresses.map((a) => (
              <Select.Option key={a.addressId || a.id} value={a.addressId || a.id}>
                {a.receiverName} - {a.phoneNumber} ({a.street}, {a.ward}, {a.city})
              </Select.Option>
            ))}
          </Select>
        </Card>
      )}

      <Card title="Thông tin giao hàng" size="small">
        <Form form={form} layout="vertical">
          <Form.Item
            name="tenNguoiNhan"
            label="Họ tên người nhận"
            rules={[{ required: true, message: 'Vui lòng nhập tên người nhận' }]}
          >
            <Input placeholder="Nguyễn Văn A" />
          </Form.Item>

          <Form.Item
            name="soDienThoaiNhan"
            label="Số điện thoại nhận hàng"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
          >
            <Input placeholder="0901234567" />
          </Form.Item>

          <Form.Item
            name="diaChiGiaoHang"
            label="Địa chỉ chi tiết"
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ giao hàng' }]}
          >
            <Input placeholder="Số nhà, tên đường, phường/xã, quận/huyện, TP" />
          </Form.Item>

          <Form.Item name="ghiChu" label="Ghi chú đơn hàng (Tùy chọn)">
            <Input.TextArea rows={2} placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi giao..." />
          </Form.Item>
        </Form>
      </Card>

      <Card title="Phương thức thanh toán" size="small">
        <Radio.Group value={paymentMethod} onChange={(e) => onPaymentChange(e.target.value)} style={{ width: '100%' }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Radio value="COD">
              <Space>
                <DollarOutlined style={{ color: '#008848', fontSize: 18 }} />
                <span>Thanh toán tiền mặt khi nhận hàng (COD)</span>
              </Space>
            </Radio>
            <Radio value="VIETQR">
              <Space>
                <QrcodeOutlined style={{ color: '#0284c7', fontSize: 18 }} />
                <span>Chuyển khoản trực tuyến quét mã VietQR (Tự động xác nhận)</span>
              </Space>
            </Radio>
          </Space>
        </Radio.Group>
      </Card>

      {promotions && promotions.length > 0 && (
        <Card title="Mã giảm giá / Voucher Bách Hóa Xanh" size="small">
          <Select
            placeholder="Chọn mã ưu đãi khả dụng"
            allowClear
            style={{ width: '100%' }}
            value={selectedPromo?.code || undefined}
            onChange={onPromoChange}
          >
            {promotions.map((p) => (
              <Select.Option key={p.code || p.maKhuyenMai} value={p.code || p.maKhuyenMai}>
                [{p.code || p.maKhuyenMai}] {p.description || `Giảm ${p.discountPercent}%`}
              </Select.Option>
            ))}
          </Select>
        </Card>
      )}
    </Space>
  );
};

export default CheckoutForm;
