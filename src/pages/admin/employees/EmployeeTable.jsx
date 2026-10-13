import React from 'react';
import { Table, Tag, Space, Button, Popconfirm, Typography } from 'antd';
import { EditOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons';
import { POSITION_LABELS } from '../../../constants/enums';

const { Text } = Typography;

export const EmployeeTable = ({
  employees,
  isLoading,
  page,
  limit,
  total,
  onPageChange,
  onEdit,
  onToggleStatus
}) => {
  const columns = [
    {
      title: 'Họ và tên',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (name, r) => (
        <div>
          <div style={{ fontWeight: 600 }}>{name || r.hoTen}</div>
          <Text type="secondary" style={{ fontSize: 12 }}>@{r.username}</Text>
        </div>
      )
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      width: 140,
      render: (phone, r) => phone || r.soDienThoai || '—'
    },
    {
      title: 'Chức vụ',
      dataIndex: 'position',
      key: 'position',
      width: 130,
      render: (pos, r) => {
        const p = pos || r.chucVu || 'STAFF';
        return <Tag color={p === 'ADMIN' ? 'gold' : 'blue'}>{POSITION_LABELS[p] || p}</Tag>;
      }
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      render: (status, r) => {
        const active = status !== false && r.trangThai !== false;
        return <Tag color={active ? 'success' : 'error'}>{active ? 'Đang hoạt động' : 'Đã khóa'}</Tag>;
      }
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 120,
      render: (_, record) => {
        const id = record.employeeId || record.id;
        const active = record.status !== false && record.trangThai !== false;
        return (
          <Space size="small">
            <Button
              type="primary"
              size="small"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
            />
            <Popconfirm
              title={active ? 'Khóa tài khoản này?' : 'Mở khóa tài khoản này?'}
              onConfirm={() => onToggleStatus(id, !active)}
            >
              <Button
                size="small"
                danger={active}
                icon={active ? <LockOutlined /> : <UnlockOutlined />}
              />
            </Popconfirm>
          </Space>
        );
      }
    }
  ];

  return (
    <Table
      rowKey={(r) => r.employeeId || r.id || r.username}
      dataSource={employees}
      columns={columns}
      loading={isLoading}
      pagination={{
        current: page,
        pageSize: limit,
        total: total,
        onChange: onPageChange
      }}
      bordered
      size="middle"
    />
  );
};

export default EmployeeTable;
