import React from 'react';
import { Table, Space, Button, Popconfirm, Typography } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Text } = Typography;

export const CategoryTable = ({ categories, isLoading, onEdit, onDelete }) => {
  const columns = [
    {
      title: 'Mã danh mục',
      dataIndex: 'categoryId',
      key: 'categoryId',
      width: 140,
      render: (id, record) => <Text copyable strong>{id || record.id}</Text>
    },
    {
      title: 'Tên danh mục',
      dataIndex: 'categoryName',
      key: 'categoryName',
      render: (name, record) => <strong>{name || record.name}</strong>
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      render: (text) => text || '—'
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 130,
      render: (_, record) => (
        <Space size="small">
          <Button type="primary" size="small" icon={<EditOutlined />} onClick={() => onEdit(record)} />
          <Popconfirm
            title="Xác nhận xóa danh mục này?"
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
            onConfirm={() => onDelete(record.categoryId || record.id)}
          >
            <Button danger size="small" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <Table
      rowKey={(r) => r.categoryId || r.id}
      dataSource={categories}
      columns={columns}
      loading={isLoading}
      pagination={{ pageSize: 10 }}
      bordered
      size="middle"
    />
  );
};

export default CategoryTable;
