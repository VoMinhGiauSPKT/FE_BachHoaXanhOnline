import React, { useState } from 'react';
import {
  Table,
  Button,
  Tag,
  Space,
  Modal,
  Card,
  Popconfirm,
  Tooltip,
  Typography,
  Input,
  Select,
  Form,
  Switch
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  LockOutlined,
  UnlockOutlined,
  ReloadOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { POSITIONS, POSITION_LABELS } from '../../../../../constants/enums';

const { Text } = Typography;

export const EmployeeManager = ({
  employees = [],
  isLoading = false,
  page = 1,
  limit = 20,
  total = 0,
  search = '',
  positionFilter = '',
  statusFilter = '',
  onSearchChange,
  onPositionFilterChange,
  onStatusFilterChange,
  onPageChange,
  onSaveEmployee,
  onUpdateEmployee,
  onToggleEmployeeStatus,
  onRefresh
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form] = Form.useForm();

  const handleOpenAdd = () => {
    setEditingEmployee(null);
    form.resetFields();
    form.setFieldsValue({
      position: 'STAFF'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (record) => {
    setEditingEmployee(record);
    form.resetFields();
    form.setFieldsValue({
      employeeId: record.employeeId || record.id,
      username: record.username,
      fullName: record.fullName,
      email: record.email || '',
      phoneNumber: record.phoneNumber || '',
      position: record.position || 'STAFF'
    });
    setIsModalOpen(true);
  };

  const handleModalSubmit = async () => {
    try {
      const values = await form.validateFields();
      setIsSubmitting(true);

      const payload = {
        fullName: values.fullName.trim(),
        username: values.username.trim(),
        email: values.email?.trim() || undefined,
        phoneNumber: values.phoneNumber?.trim(),
        position: values.position
      };

      if (values.password) {
        payload.password = values.password;
      }

      let res;
      if (editingEmployee) {
        res = await onUpdateEmployee(editingEmployee.employeeId || editingEmployee.id, payload);
      } else {
        res = await onSaveEmployee(payload);
      }

      if (res?.success) {
        setIsModalOpen(false);
        form.resetFields();
      }
    } catch (err) {
      console.error('Validation error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    {
      title: 'Mã NV',
      dataIndex: 'employeeId',
      key: 'employeeId',
      width: 110,
      render: (id, r) => (
        <Tag color="cyan" style={{ fontWeight: 600 }}>
          {id || r.id || 'N/A'}
        </Tag>
      )
    },
    {
      title: 'Họ và Tên Nhân Viên',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (name, r) => (
        <div>
          <Text strong style={{ fontSize: 14 }}>{name}</Text>
          <div style={{ fontSize: 12, color: '#64748b' }}>
            👤 @{r.username}
          </div>
        </div>
      )
    },
    {
      title: 'Liên Hệ',
      key: 'contact',
      width: 200,
      render: (_, r) => (
        <div style={{ fontSize: 13 }}>
          <div>📞 {r.phoneNumber || 'Chưa cập nhật'}</div>
          {r.email && <div style={{ color: '#64748b', fontSize: 12 }}>✉️ {r.email}</div>}
        </div>
      )
    },
    {
      title: 'Chức Vụ',
      dataIndex: 'position',
      key: 'position',
      width: 180,
      align: 'center',
      render: (pos) => (
        <Tag color={pos === 'ADMIN' ? 'red' : 'blue'} style={{ fontWeight: 600, padding: '3px 10px' }}>
          {pos === 'ADMIN' ? 'Quản Trị Viên (ADMIN)' : 'Nhân Viên (STAFF)'}
        </Tag>
      )
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'status',
      key: 'status',
      width: 140,
      align: 'center',
      render: (st, r) => {
        const isActive = st !== false && st !== 'false';
        return (
          <Tag color={isActive ? 'success' : 'error'} style={{ fontWeight: 600 }}>
            {isActive ? 'Đang hoạt động' : 'Đã khóa'}
          </Tag>
        );
      }
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 160,
      align: 'center',
      render: (_, record) => {
        const empId = record.employeeId || record.id;
        const isActive = record.status !== false && record.status !== 'false';
        return (
          <Space size="small">
            <Tooltip title="Chỉnh sửa thông tin">
              <Button
                type="primary"
                ghost
                size="small"
                icon={<EditOutlined />}
                onClick={() => handleOpenEdit(record)}
              />
            </Tooltip>

            <Popconfirm
              title={isActive ? 'Khóa tài khoản này?' : 'Mở khóa tài khoản?'}
              description={`Bạn có chắc muốn ${isActive ? 'khóa' : 'kích hoạt lại'} nhân viên ${record.fullName}?`}
              onConfirm={() => onToggleEmployeeStatus(empId, !isActive)}
              okText="Đồng ý"
              cancelText="Hủy"
              okButtonProps={isActive ? { danger: true } : {}}
            >
              <Tooltip title={isActive ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}>
                <Button
                  danger={isActive}
                  size="small"
                  icon={isActive ? <LockOutlined /> : <UnlockOutlined />}
                />
              </Tooltip>
            </Popconfirm>
          </Space>
        );
      }
    }
  ];

  return (
    <Card
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 18, fontWeight: 700 }}>👥 Quản Lý Đội Ngũ Nhân Sự (Chỉ Admin)</span>
          <Tag color="cyan" style={{ fontSize: 13, padding: '2px 8px' }}>
            Tổng: {total} nhân viên
          </Tag>
        </div>
      }
      extra={
        <Space wrap>
          <Button icon={<ReloadOutlined />} onClick={onRefresh}>
            Làm mới
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenAdd} style={{ background: '#10b981' }}>
            Thêm nhân viên mới
          </Button>
        </Space>
      }
      style={{ borderRadius: 12, boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}
    >
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
        <Input
          placeholder="Tìm theo họ tên, username hoặc số điện thoại..."
          prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          allowClear
          style={{ width: 340 }}
        />

        <Select
          placeholder="Chức vụ"
          value={positionFilter}
          onChange={onPositionFilterChange}
          style={{ width: 180 }}
          options={[
            { value: '', label: 'Tất cả chức vụ' },
            { value: 'STAFF', label: 'Nhân viên (STAFF)' },
            { value: 'ADMIN', label: 'Quản trị viên (ADMIN)' }
          ]}
        />

        <Select
          placeholder="Trạng thái"
          value={statusFilter}
          onChange={onStatusFilterChange}
          style={{ width: 170 }}
          options={[
            { value: '', label: 'Tất cả trạng thái' },
            { value: 'true', label: 'Đang hoạt động' },
            { value: 'false', label: 'Đã khóa' }
          ]}
        />
      </div>

      <Table
        rowKey={(r) => r.employeeId || r.id || r.username}
        columns={columns}
        dataSource={employees}
        loading={isLoading}
        bordered
        pagination={{
          current: page,
          pageSize: limit,
          total: total,
          showSizeChanger: true,
          pageSizeOptions: ['20', '50', '100'],
          showQuickJumper: true,
          showTotal: (totalCount, range) => (
            <span style={{ color: '#64748b' }}>
              Hiển thị <strong>{range[0]}-{range[1]}</strong> trên <strong>{totalCount}</strong> nhân viên
            </span>
          ),
          onChange: (newPage, newPageSize) => {
            onPageChange(newPage, newPageSize);
          }
        }}
      />

      {/* Modal Thêm / Sửa Nhân Viên */}
      <Modal
        title={editingEmployee ? `✏️ Cập Nhật Nhân Viên [@${editingEmployee.username}]` : '✨ Tạo Tài Khoản Nhân Viên Mới'}
        open={isModalOpen}
        onOk={handleModalSubmit}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={isSubmitting}
        okText={editingEmployee ? 'Lưu thay đổi' : 'Tạo tài khoản'}
        cancelText="Đóng"
        width={600}
        destroyOnClose
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="fullName"
            label="Họ và tên nhân viên"
            rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
          >
            <Input placeholder="Nguyễn Văn A" />
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item
              name="username"
              label="Tên đăng nhập (Username)"
              rules={[
                { required: true, message: 'Nhập tên đăng nhập' },
                { pattern: /^[a-zA-Z0-9_-]{4,20}$/, message: '4-20 ký tự, không dấu' }
              ]}
            >
              <Input placeholder="staff_01" disabled={Boolean(editingEmployee)} />
            </Form.Item>

            <Form.Item
              name="password"
              label={editingEmployee ? 'Mật khẩu mới (Bỏ trống nếu giữ nguyên)' : 'Mật khẩu'}
              rules={editingEmployee ? [] : [
                { required: true, message: 'Vui lòng nhập mật khẩu' },
                { min: 6, message: 'Tối thiểu 6 ký tự' }
              ]}
            >
              <Input.Password placeholder="••••••••" />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item
              name="phoneNumber"
              label="Số điện thoại"
              rules={[
                { required: true, message: 'Nhập số điện thoại' },
                { pattern: /^[0-9]{10}$/, message: '10 chữ số hợp lệ' }
              ]}
            >
              <Input placeholder="0912345678" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[{ type: 'email', message: 'Email không hợp lệ' }]}
            >
              <Input placeholder="nhanvien@bachhoaxanh.com" />
            </Form.Item>
          </div>

          <Form.Item
            name="position"
            label="Chức vụ phân quyền"
            rules={[{ required: true }]}
          >
            <Select
              options={[
                { value: 'STAFF', label: 'Nhân viên bán hàng / vận kho (STAFF)' },
                { value: 'ADMIN', label: 'Quản trị viên tối cao (ADMIN)' }
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default EmployeeManager;
