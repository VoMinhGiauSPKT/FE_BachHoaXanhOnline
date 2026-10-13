import React from 'react';
import { Card, List, Button, Divider, Typography } from 'antd';
import { ShoppingOutlined } from '@ant-design/icons';
import { formatVND } from '../../../utils/formatCurrency';
import { PRODUCT_UNIT_LABELS } from '../../../constants/enums';

const { Text } = Typography;

export const OrderSummary = ({
  items,
  totalAmount,
  discountAmount = 0,
  finalAmount,
  isSubmitting,
  onSubmit
}) => {
  return (
    <Card title="Tóm tắt đơn hàng" className="orderSummaryCard">
      <List
        dataSource={items}
        renderItem={(item) => {
          const name = item.productName || item.name;
          const price = item.price || 0;
          const qty = Math.floor(Number(item.quantity || 1));
          const unit = PRODUCT_UNIT_LABELS[item.unit?.toUpperCase()] || item.unit || 'Kg';
          return (
            <List.Item style={{ padding: '8px 0' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{name}</div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {qty} {unit.toLowerCase()} x {formatVND(price)}
                </Text>
              </div>
              <strong style={{ color: '#008848' }}>{formatVND(price * qty)}</strong>
            </List.Item>
          );
        }}
      />

      <Divider style={{ margin: '14px 0' }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 }}>
        <span>Tạm tính hàng hóa:</span>
        <span>{formatVND(totalAmount)}</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 }}>
        <span>Phí vận chuyển:</span>
        <span style={{ color: '#008848', fontWeight: 600 }}>Miễn phí (0đ)</span>
      </div>

      {discountAmount > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14, color: '#e11d48' }}>
          <span>Giảm giá Voucher:</span>
          <span>-{formatVND(discountAmount)}</span>
        </div>
      )}

      <Divider style={{ margin: '14px 0' }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20 }}>
        <span style={{ fontWeight: 700, fontSize: 16 }}>Tổng thanh toán:</span>
        <span style={{ color: '#008848', fontWeight: 800, fontSize: 22 }}>
          {formatVND(finalAmount)}
        </span>
      </div>

      <Button
        type="primary"
        size="large"
        block
        icon={<ShoppingOutlined />}
        loading={isSubmitting}
        onClick={onSubmit}
        style={{ height: 48, fontSize: 16, fontWeight: 700, backgroundColor: '#008848' }}
      >
        TIẾN HÀNH ĐẶT HÀNG
      </Button>
    </Card>
  );
};

export default OrderSummary;
