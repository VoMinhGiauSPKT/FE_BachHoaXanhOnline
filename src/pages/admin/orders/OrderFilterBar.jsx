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
          <Select.Option value="CHUATHANHTOAN">Chưa Thanh Toán</Select.Option>
          <Select.Option value="DATHANHTOAN">Đã Thanh Toán</Select.Option>
          <Select.Option value="DAHUY">Đã Hủy</Select.Option>
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
