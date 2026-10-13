import React from 'react';
import { Card, Tag, Space, Typography } from 'antd';
import { EnvironmentOutlined, CheckCircleFilled } from '@ant-design/icons';

const { Text } = Typography;

export const AddressSelector = ({ addresses, selectedId, onSelect }) => {
  if (!addresses || addresses.length === 0) return null;

  return (
    <Card
      title={
        <Space>
          <EnvironmentOutlined style={{ color: '#008848' }} />
          <span>Sổ địa chỉ nhận hàng đã lưu</span>
        </Space>
      }
      size="small"
      style={{ marginBottom: 16 }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
        {addresses.map((a) => {
          const id = a.addressId || a.id;
          const isSelected = selectedId === id;
          const fullAddress = `${a.street}, ${a.ward}, ${a.city}`;

          return (
            <div
              key={id}
              onClick={() => onSelect(a)}
              style={{
                border: isSelected ? '2px solid #008848' : '1px solid #e2e8f0',
                backgroundColor: isSelected ? '#f0fdf4' : '#fafafa',
                borderRadius: 8,
                padding: '12px 14px',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.2s ease',
                boxShadow: isSelected ? '0 2px 8px rgba(0, 136, 72, 0.15)' : 'none'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <Text strong style={{ fontSize: 14, color: isSelected ? '#008848' : '#1e293b' }}>
                  {a.receiverName}
                </Text>
                {isSelected ? (
                  <CheckCircleFilled style={{ color: '#008848', fontSize: 16 }} />
                ) : a.isDefault ? (
                  <Tag color="green">Mặc định</Tag>
                ) : null}
              </div>

              <div style={{ fontSize: 13, color: '#475569', marginBottom: 4 }}>
                📞 <strong>{a.phoneNumber}</strong>
              </div>

              <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.4 }}>
                {fullAddress}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default AddressSelector;
