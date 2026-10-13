import React, { useEffect } from 'react';
import { Modal, Form, Input } from 'antd';
import { getPhoneRules, getEmailRules } from '../../../utils/validators';

export const SupplierFormModal = ({
  open,
  editingSupplier,
  isLoading,
  onCancel,
  onSubmit
}) => {
  const [form] = Form.useForm();
  const isEdit = Boolean(editingSupplier);

  useEffect(() => {
    if (open) {
      if (editingSupplier) {
        form.setFieldsValue({
          supplierName: editingSupplier.supplierName || editingSupplier.name,
          phoneNumber: editingSupplier.phoneNumber || editingSupplier.phone || '',
          email: editingSupplier.email || ''
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, editingSupplier, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await onSubmit(values);
    } catch (err) {
      // Validate error
    }
  };

  return (
    <Modal
      title={isEdit ? 'Chỉnh sửa nhà cung cấp' : 'Thêm nhà cung cấp mới'}
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={isLoading}
      okText={isEdit ? 'Cập nhật' : 'Tạo mới'}
      cancelText="Hủy"
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="supplierName"
          label="Tên nhà cung cấp"
          rules={[{ required: true, message: 'Vui lòng nhập tên nhà cung cấp' }]}
        >
          <Input placeholder="Ví dụ: Công ty Cổ phần Sữa Vinamilk" />
        </Form.Item>

        <Form.Item
          name="phoneNumber"
          label="Số điện thoại liên hệ"
          rules={getPhoneRules(true, 'Vui lòng nhập số điện thoại')}
        >
          <Input placeholder="Ví dụ: 0901234567" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email đối tác"
          rules={getEmailRules(false)}
        >
          <Input placeholder="contact@supplier.vn" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SupplierFormModal;
