import React from 'react';
import { Card, Tag, Button, Empty, Space, Typography } from 'antd';
import { GiftOutlined, CheckCircleFilled, CloseCircleOutlined } from '@ant-design/icons';
import { formatVND } from '../../../utils/formatCurrency';

const { Text } = Typography;

export const PromotionSelector = ({
  promotions,
  selectedCode,
  totalAmount,
  onSelectPromo,
  onRemovePromo
}) => {
  return (
    <Card
      title={
        <Space>
          <GiftOutlined style={{ color: '#e11d48' }} />
          <span>Mã Khuyến Mãi / Voucher Bách Hóa Xanh</span>
        </Space>
      }
      size="small"
      style={{ marginBottom: 16 }}
    >
      {!promotions || promotions.length === 0 ? (
        <Empty description="Hiện chưa có chương trình ưu đãi nào khả dụng" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 12 }}>
          {promotions.map((p) => {
            const code = p.promotionCode || p.code || p.maKhuyenMai;
            const name = p.promotionName || p.name || p.tenKhuyenMai || 'Ưu đãi mua sắm';
            const isPercent = (p.discountType || p.loaiKhuyenMai) === 'PHANTRAM';
            const discountVal = Number(p.discountValue || p.giaTriGiam || p.discountPercent || 0);
            const minOrder = Number(p.minOrderAmount || p.donHangToiThieu || 0);
            const maxDisc = p.maxDiscount || p.giamToiDa;

            const isEligible = totalAmount >= minOrder;
            const isSelected = selectedCode === code;

            return (
              <div
                key={code}
                style={{
                  border: isSelected ? '2px solid #008848' : isEligible ? '1px solid #cbd5e1' : '1px dashed #cbd5e1',
                  backgroundColor: isSelected ? '#f0fdf4' : isEligible ? '#ffffff' : '#f8fafc',
                  borderRadius: 8,
                  padding: '12px 14px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  opacity: isEligible ? 1 : 0.65,
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <Tag color="magenta" style={{ fontWeight: 700, fontSize: 13, padding: '2px 8px' }}>
                      {code}
                    </Tag>
                    {isPercent ? (
                      <Tag color="orange">Giảm {discountVal}%</Tag>
                    ) : (
                      <Tag color="cyan">Giảm {formatVND(discountVal)}</Tag>
                    )}
                  </div>

                  <Text strong style={{ fontSize: 14, display: 'block', color: '#1e293b', marginBottom: 4 }}>
                    {name}
                  </Text>

                  <div style={{ fontSize: 12, color: '#475569', marginBottom: 4 }}>
                    Loại: <strong>{isPercent ? 'Giảm theo phần trăm (%)' : 'Giảm tiền mặt (VND)'}</strong>
                  </div>

                  <div style={{ fontSize: 12, color: '#64748b' }}>
                    • Đơn tối thiểu: <strong style={{ color: isEligible ? '#008848' : '#e11d48' }}>{formatVND(minOrder)}</strong>
                  </div>

                  <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>
                    • Giảm tối đa: <strong>{maxDisc ? formatVND(maxDisc) : 'Không giới hạn'}</strong>
                  </div>
                </div>

                <div style={{ marginTop: 8, borderTop: '1px solid #f1f5f9', paddingTop: 8 }}>
                  {!isEligible ? (
                    <Text type="danger" style={{ fontSize: 12, display: 'block' }}>
                      ⚠️ Chưa đủ điều kiện: cần mua thêm {formatVND(minOrder - totalAmount)}
                    </Text>
                  ) : isSelected ? (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Space style={{ color: '#008848', fontWeight: 600, fontSize: 12 }}>
                        <CheckCircleFilled /> Đang áp dụng
                      </Space>
                      <Button
                        size="small"
                        danger
                        icon={<CloseCircleOutlined />}
                        onClick={() => onRemovePromo()}
                      >
                        Bỏ chọn
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="small"
                      type="primary"
                      block
                      style={{ backgroundColor: '#008848', borderColor: '#008848' }}
                      onClick={() => onSelectPromo(p)}
                    >
                      Áp dụng mã
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};

export default PromotionSelector;
