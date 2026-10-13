import React from 'react';
import { Card, Radio, Switch, Select, Button, Space, Divider } from 'antd';
import { FilterOutlined, ReloadOutlined } from '@ant-design/icons';
import styles from './HomeSidebarFilter.module.scss';

export const HomeSidebarFilter = ({
  categories,
  selectedCategoryId,
  inStockOnly,
  sortBy,
  onCategoryChange,
  onInStockChange,
  onSortChange,
  onReset
}) => {
  return (
    <Card
      title={
        <Space>
          <FilterOutlined style={{ color: '#008848' }} />
          <span>Bộ lọc sản phẩm</span>
        </Space>
      }
      size="small"
      className={styles.filterCard}
    >
      <div className={styles.filterSection}>
        <h4 className={styles.filterTitle}>Danh mục ngành hàng</h4>
        <Radio.Group
          value={selectedCategoryId || ''}
          onChange={(e) => onCategoryChange(e.target.value || null)}
          className={styles.radioGroup}
        >
          <Radio value="" className={styles.radioItem}>
            Tất cả sản phẩm
          </Radio>
          {categories.map((c) => (
            <Radio key={c.categoryId || c.id} value={c.categoryId || c.id} className={styles.radioItem}>
              {c.categoryName || c.name}
            </Radio>
          ))}
        </Radio.Group>
      </div>

      <Divider style={{ margin: '14px 0' }} />

      <div className={styles.filterSection}>
        <h4 className={styles.filterTitle}>Sắp xếp theo giá</h4>
        <Select
          value={sortBy || 'default'}
          onChange={onSortChange}
          style={{ width: '100%' }}
          options={[
            { value: 'default', label: 'Mặc định (Nổi bật nhất)' },
            { value: 'price_asc', label: 'Giá tăng dần (Thấp -> Cao)' },
            { value: 'price_desc', label: 'Giá giảm dần (Cao -> Thấp)' },
            { value: 'newest', label: 'Mới nhất hôm nay' }
          ]}
        />
      </div>

      <Divider style={{ margin: '14px 0' }} />

      <div className={styles.stockToggle}>
        <span>Chỉ xem sản phẩm còn hàng</span>
        <Switch checked={Boolean(inStockOnly)} onChange={onInStockChange} />
      </div>

      <Button
        block
        icon={<ReloadOutlined />}
        onClick={onReset}
        style={{ marginTop: 16 }}
      >
        Xóa tất cả bộ lọc
      </Button>
    </Card>
  );
};

export default HomeSidebarFilter;
