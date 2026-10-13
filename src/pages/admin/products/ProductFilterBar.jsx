import React from 'react';
import { Space, Input, Select, Button } from 'antd';
import { SearchOutlined, ReloadOutlined, PlusOutlined } from '@ant-design/icons';

export const ProductFilterBar = ({
  search,
  categoryFilter,
  inStockFilter,
  categories,
  onSearchChange,
  onCategoryChange,
  onInStockChange,
  onReset,
  onRefresh,
  onAddNew
}) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
      <Space wrap>
        <Input
          placeholder="Tìm tên sản phẩm hoặc mã SP..."
          prefix={<SearchOutlined />}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{ width: 260 }}
          allowClear
        />

        <Select
          placeholder="Tất cả danh mục"
          value={categoryFilter || undefined}
          onChange={onCategoryChange}
          style={{ width: 180 }}
          allowClear
        >
          {categories.map((c) => (
            <Select.Option key={c.categoryId || c.id} value={c.categoryId || c.id}>
              {c.categoryName || c.name}
            </Select.Option>
          ))}
        </Select>

        <Select
          placeholder="Trạng thái kho"
          value={inStockFilter || undefined}
          onChange={onInStockChange}
          style={{ width: 140 }}
          allowClear
        >
          <Select.Option value="in_stock">Còn hàng</Select.Option>
          <Select.Option value="out_of_stock">Hết hàng</Select.Option>
        </Select>

        <Button onClick={onReset}>Xóa bộ lọc</Button>
        <Button icon={<ReloadOutlined />} onClick={onRefresh}>
          Làm mới
        </Button>
      </Space>

      <Button type="primary" icon={<PlusOutlined />} onClick={onAddNew}>
        Thêm sản phẩm mới
      </Button>
    </div>
  );
};

export default ProductFilterBar;
