import React from 'react';
import { Table, Tag } from 'antd';
import { WarningOutlined } from '@ant-design/icons';

export const InventoryAlertsTable = ({ data, isLoading }) => {
  const columns = [
    {
      title: 'Tên sản phẩm',
      dataIndex: 'productName',
      key: 'productName',
      render: (name, r) => <strong>{name || r.name}</strong>
    },
    {
      title: 'Tồn kho hiện tại',
      dataIndex: 'currentStock',
      key: 'currentStock',
      width: 140,
      render: (stock, r) => {
        const qty = Number(stock !== undefined ? stock : (r.stock || 0));
        return (
          <Tag color="error" icon={<WarningOutlined />}>
            Còn {qty} đơn vị
          </Tag>
        );
      }
    },
    {
      title: 'Khuyến nghị nhập',
      key: 'recommendation',
      render: () => <span style={{ color: '#b45309' }}>Cần đặt thêm tối thiểu 50 đơn vị</span>
    }
  ];

  return (
    <Table
      rowKey={(r, i) => r.productId || i}
      dataSource={data}
      columns={columns}
      loading={isLoading}
      pagination={false}
      size="small"
      bordered
    />
  );
};

export default InventoryAlertsTable;
