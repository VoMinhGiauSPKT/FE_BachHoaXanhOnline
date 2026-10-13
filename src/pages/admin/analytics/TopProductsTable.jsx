import React from 'react';
import { Table, Tag } from 'antd';
import { formatVND } from '../../../utils/formatCurrency';

export const TopProductsTable = ({ data, isLoading }) => {
  const columns = [
    {
      title: 'Top',
      key: 'rank',
      width: 60,
      render: (_, __, index) => <Tag color={index === 0 ? 'gold' : index === 1 ? 'cyan' : 'default'}>#{index + 1}</Tag>
    },
    {
      title: 'Sản phẩm',
      dataIndex: 'productName',
      key: 'productName',
      render: (name, r) => <strong>{name || r.name || 'Sản phẩm'}</strong>
    },
    {
      title: 'Đã bán',
      dataIndex: 'soldQuantity',
      key: 'soldQuantity',
      width: 100,
      render: (qty, r) => `${qty || r.quantity || 0} món`
    },
    {
      title: 'Doanh thu đóng góp',
      dataIndex: 'revenue',
      key: 'revenue',
      width: 150,
      render: (val, r) => <span style={{ color: '#008848', fontWeight: 700 }}>{formatVND(val || r.total || 0)}</span>
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

export default TopProductsTable;
