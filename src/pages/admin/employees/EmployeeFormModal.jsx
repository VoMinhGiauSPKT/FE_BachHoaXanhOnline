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
          fullName: editingEmployee.fullName || editingEmployee.hoTen,
          username: editingEmployee.username,
          phoneNumber: editingEmployee.phoneNumber || editingEmployee.soDienThoai,
          email: editingEmployee.email || '',
          position: editingEmployee.position || editingEmployee.chucVu || 'STAFF'
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, editingEmployee, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await onSubmit(values);
    } catch (err) {
      // Form fail
    }
  };

  return (
    <Modal
      title={isEdit ? 'Cập nhật nhân viên' : 'Tạo tài khoản nhân viên mới'}
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

        {!isEdit && (
          <Form.Item
            name="password"
            label="Mật khẩu khởi tạo"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
          >
            <Input.Password placeholder="Tối thiểu 6 ký tự" />
          </Form.Item>
        )}

        <Form.Item
          name="phoneNumber"
          label="Số điện thoại"
          rules={[{ required: true, message: 'Vui lòng nhập SĐT' }]}
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
