import React from 'react';
import { Space, Input, Select, Button } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { ORDER_STATUS_LABELS } from '../../../constants/enums';

export const OrderFilterBar = ({
  search,
  statusFilter,
  onSearchChange,
  onStatusChange,
  onReset,
  onRefresh
}) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
      <Space wrap>
        <Input
          placeholder="Tìm mã đơn hàng, khách hàng..."
          prefix={<SearchOutlined />}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{ width: 280 }}
          allowClear
        />

        <Select
          placeholder="Tất cả trạng thái"
          value={statusFilter || undefined}
          onChange={onStatusChange}
          style={{ width: 190 }}
          allowClear
        >
          {Object.entries(ORDER_STATUS_LABELS).map(([key, label]) => (
            <Select.Option key={key} value={key}>
              {label}
            </Select.Option>
          ))}
        </Select>

        <Button onClick={onReset}>Xóa lọc</Button>
      </Space>

      <Button icon={<ReloadOutlined />} onClick={onRefresh}>
        Làm mới
      </Button>
    </div>
  );
};

export default OrderFilterBar;
