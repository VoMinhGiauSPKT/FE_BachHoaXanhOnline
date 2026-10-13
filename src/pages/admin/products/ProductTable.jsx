import React from 'react';
import { Table, Tag, Image, Space, Button, Popconfirm, Typography } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { formatVND } from '../../../utils/formatCurrency';
import { PRODUCT_UNIT_LABELS } from '../../../constants/enums';

const { Text } = Typography;

export const ProductTable = ({
  products,
  isLoading,
  page,
  limit,
  total,
  onPageChange,
  onEdit,
  onDelete
}) => {
  const columns = [
    {
      title: 'Mã',
      dataIndex: 'productId',
      key: 'productId',
      width: 100,
      render: (id, record) => <Text copyable strong>{id || record.id}</Text>
    },
    {
      title: 'Ảnh',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      width: 70,
      render: (url, record) => (
        <Image
          src={url || record.image}
          alt={record.productName || record.name}
          width={44}
          height={44}
          style={{ objectFit: 'cover', borderRadius: 6 }}
          fallback="https://placehold.co/44x44/e2e8f0/64748b?text=SP"
        />
      )
    },
    {
      title: 'Tên',
      dataIndex: 'productName',
      key: 'productName',
      render: (name, record) => <span style={{ fontWeight: 600 }}>{name || record.name}</span>
    },
    {
      title: 'Danh mục',
      key: 'category',
      width: 140,
      render: (_, record) => (
        <Tag color="cyan">
          {record.category?.categoryName || record.categoryName || 'Chung'}
        </Tag>
      )
    },
    {
      title: 'Giá bán',
      dataIndex: 'price',
      key: 'price',
      width: 120,
      render: (val) => <span style={{ color: '#008848', fontWeight: 700 }}>{formatVND(val)}</span>
    },
    {
      title: 'Đơn vị',
      dataIndex: 'unit',
      key: 'unit',
      width: 90,
      render: (u) => PRODUCT_UNIT_LABELS[u?.toUpperCase()] || u || 'Cái'
    },
    {
      title: 'Tồn kho',
      dataIndex: 'stock',
      key: 'stock',
      width: 110,
      render: (stock, record) => {
        const qty = Number(stock !== undefined ? stock : (record.quantity || 0));
        if (qty <= 0) return <Tag color="error">Hết hàng</Tag>;
        if (qty < 10) return <Tag color="warning">{qty}</Tag>;
        return <Tag color="success">{qty}</Tag>;
      }
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 130,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
          />
          <Popconfirm
            title="Xác nhận xóa sản phẩm này?"
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
            onConfirm={() => onDelete(record.productId || record.id)}
          >
            <Button danger size="small" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <Table
      rowKey={(r) => r.productId || r.id}
      dataSource={products}
      columns={columns}
      loading={isLoading}
      pagination={{
        current: page,
        pageSize: limit,
        total: total,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50'],
        onChange: onPageChange,
        showTotal: (tot) => `Tổng cộng ${tot} sản phẩm`
      }}
      bordered
      size="middle"
    />
  );
};

export default ProductTable;
