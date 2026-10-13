import React from 'react';
import { Space, Input, Select, Button } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';

export const PromotionFilterBar = ({
  search,
  typeFilter,
  onSearchChange,
  onTypeChange,
  onReset,
  onRefresh
}) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
      <Space wrap>
        <Input
          placeholder="Tìm theo mã voucher, tên chương trình..."
          prefix={<SearchOutlined />}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{ width: 300 }}
          allowClear
        />

        <Select
          placeholder="Tất cả loại giảm giá"
          value={typeFilter || undefined}
          onChange={onTypeChange}
          style={{ width: 180 }}
          allowClear
        >
          <Select.Option value="ALL">Tất cả loại</Select.Option>
          <Select.Option value="PHANTRAM">Phần trăm (%)</Select.Option>
          <Select.Option value="TIENMAT">Tiền mặt (VNĐ)</Select.Option>
        </Select>

        <Button onClick={onReset}>Xóa lọc</Button>
      </Space>

      <Button icon={<ReloadOutlined />} onClick={onRefresh}>
        Làm mới
      </Button>
    </div>
  );
};

export default PromotionFilterBar;
