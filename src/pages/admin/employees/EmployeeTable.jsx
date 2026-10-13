import React from 'react';
import { Table, Tag, Space, Button, Popconfirm, Typography, Tooltip } from 'antd';
import { EditOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons';

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
      title: 'Mã',
      key: 'code',
      width: 120,
      render: (_, r) => (
        <Text copyable strong>
          {r.employeeId || r.maNhanVien || r.id}
        </Text>
      )
    },
    {
      title: 'Họ và tên',
      key: 'fullName',
      render: (_, r) => (
        <div>
          <div style={{ fontWeight: 600 }}>{r.fullName || r.tenND || r.hoTen}</div>
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
        const p = (pos || r.chucVu || 'STAFF').toUpperCase();
        return (
          <Tag color={p === 'ADMIN' ? 'gold' : 'blue'}>
            {p === 'ADMIN' ? 'Quản trị viên' : 'Nhân viên'}
          </Tag>
        );
      }
    },
    {
      title: 'Trạng thái',
      key: 'status',
      width: 130,
      render: (_, r) => {
        const active = r.status !== false && r.isActive !== false && r.trangThai !== false;
        return (
          <Tag color={active ? 'success' : 'error'}>
            {active ? 'Đang hoạt động' : 'Đã khóa'}
          </Tag>
        );
      }
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 110,
      align: 'center',
      render: (_, record) => {
        const id = record.employeeId || record.maNhanVien || record.id;
        const active = record.status !== false && record.isActive !== false && record.trangThai !== false;
        return (
          <Space size="small">
            <Tooltip title="Chỉnh sửa & Cấp lại mật khẩu">
              <Button
                type="primary"
                size="small"
                icon={<EditOutlined />}
                onClick={() => onEdit(record)}
              />
            </Tooltip>
            <Popconfirm
              title={active ? 'Khóa tài khoản này?' : 'Mở khóa tài khoản này?'}
              okText={active ? 'Khóa' : 'Mở khóa'}
              cancelText="Hủy"
              okButtonProps={{ danger: active }}
              onConfirm={() => onToggleStatus(id, !active)}
            >
              <Tooltip title={active ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}>
                <Button
                  size="small"
                  danger={active}
                  icon={active ? <LockOutlined /> : <UnlockOutlined />}
                />
              </Tooltip>
            </Popconfirm>
          </Space>
        );
      }
    }
  ];

  return (
    <Table
      rowKey={(r) => r.employeeId || r.maNhanVien || r.id || r.username}
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
