import React, { useEffect } from 'react';
import { Modal, Form, Input, Select } from 'antd';
import { POSITION_LABELS } from '../../../constants/enums';

export const EmployeeFormModal = ({
  open,
  editingEmployee,
  isLoading,
  onCancel,
  onSubmit
}) => {
  const [form] = Form.useForm();
  const isEdit = Boolean(editingEmployee);

  useEffect(() => {
    if (open) {
      if (editingEmployee) {
        form.setFieldsValue({
          fullName: editingEmployee.fullName || editingEmployee.hoTen || editingEmployee.tenND,
          username: editingEmployee.username || editingEmployee.tenDangNhap,
          phoneNumber: editingEmployee.phoneNumber || editingEmployee.soDienThoai,
          email: editingEmployee.email || '',
          position: editingEmployee.position || editingEmployee.chucVu || 'STAFF',
          newPassword: ''
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, editingEmployee, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        fullName: values.fullName?.trim(),
        phoneNumber: values.phoneNumber?.trim(),
        email: values.email?.trim() || undefined,
        position: values.position
      };
      if (isEdit) {
        if (values.newPassword && values.newPassword.trim()) {
          payload.newPassword = values.newPassword.trim();
        }
      } else {
        payload.username = values.username?.trim();
        payload.password = values.password;
      }
      await onSubmit(payload);
    } catch {
      // Form validation failed
    }
  };

  return (
    <Modal
      title={isEdit ? 'Cập nhật nhân viên & Cấp lại mật khẩu' : 'Tạo tài khoản nhân viên mới'}
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={isLoading}
      okText={isEdit ? 'Cập nhật' : 'Tạo mới'}
      cancelText="Hủy"
      destroyOnClose
    >
      <Form form={form} layout="vertical" initialValues={{ position: 'STAFF' }}>
        <Form.Item
          name="fullName"
          label="Họ và tên"
          rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
        >
          <Input placeholder="Ví dụ: Nguyễn Văn A" />
        </Form.Item>

        <Form.Item
          name="username"
          label="Tên đăng nhập"
          rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập' }]}
        >
          <Input placeholder="nguyenvana" disabled={isEdit} />
        </Form.Item>

        {isEdit ? (
          <Form.Item
            name="newPassword"
            label="Cấp lại mật khẩu mới"
            rules={[{ min: 6, message: 'Mật khẩu phải từ 6 ký tự trở lên' }]}
            extra="Để trống nếu không muốn đổi mật khẩu nhân viên"
          >
            <Input.Password placeholder="Nhập mật khẩu mới nếu muốn cấp lại (tối thiểu 6 ký tự)" />
          </Form.Item>
        ) : (
          <Form.Item
            name="password"
            label="Mật khẩu khởi tạo"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu' },
              { min: 6, message: 'Mật khẩu phải từ 6 ký tự trở lên' }
            ]}
          >
            <Input.Password placeholder="Tối thiểu 6 ký tự" />
          </Form.Item>
        )}

        <Form.Item
          name="phoneNumber"
          label="Số điện thoại"
          rules={[
            { required: true, message: 'Vui lòng nhập SĐT' },
            { pattern: /^(0|\+84)[0-9]{9}$/, message: 'Số điện thoại không đúng định dạng' }
          ]}
        >
          <Input placeholder="0901234567" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email liên hệ"
          rules={[{ type: 'email', message: 'Email không đúng định dạng' }]}
        >
          <Input placeholder="nguyenvana@gmail.com" />
        </Form.Item>

        <Form.Item name="position" label="Chức vụ" rules={[{ required: true }]}>
          <Select>
            <Select.Option value="STAFF">Nhân viên ({POSITION_LABELS.STAFF})</Select.Option>
            <Select.Option value="ADMIN">Quản trị viên ({POSITION_LABELS.ADMIN})</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EmployeeFormModal;
