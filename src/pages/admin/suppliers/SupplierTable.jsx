import React from 'react';
import { Table, Space, Button, Popconfirm, Typography } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Text } = Typography;

export const SupplierTable = ({ suppliers, isLoading, onEdit, onDelete }) => {
  const columns = [
    {
      title: 'Mã NCC',
      dataIndex: 'supplierId',
      key: 'supplierId',
      width: 130,
      render: (id, record) => <Text copyable strong>{id || record.id}</Text>
    },
    {
      title: 'Tên nhà cung cấp',
      dataIndex: 'supplierName',
      key: 'supplierName',
      render: (name, record) => <strong>{name || record.name}</strong>
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      width: 140,
      render: (phone) => phone || '—'
    },
    {
      title: 'Email liên hệ',
      dataIndex: 'email',
      key: 'email',
      render: (email) => email || '—'
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 130,
      render: (_, record) => (
        <Space size="small">
          <Button type="primary" size="small" icon={<EditOutlined />} onClick={() => onEdit(record)} />
          <Popconfirm
            title="Xác nhận xóa nhà cung cấp này?"
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
            onConfirm={() => onDelete(record.supplierId || record.id)}
          >
            <Button danger size="small" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <Table
      rowKey={(r) => r.supplierId || r.id}
      dataSource={suppliers}
      columns={columns}
      loading={isLoading}
      pagination={{ pageSize: 10 }}
      bordered
      size="middle"
    />
  );
};

export default SupplierTable;
