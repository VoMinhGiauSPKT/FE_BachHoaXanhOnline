import React, { useEffect } from 'react';
import { Modal, Form, Input } from 'antd';

export const CategoryFormModal = ({
  open,
  editingCategory,
  isLoading,
  onCancel,
  onSubmit
}) => {
  const [form] = Form.useForm();
  const isEdit = Boolean(editingCategory);

  useEffect(() => {
    if (open) {
      if (editingCategory) {
        form.setFieldsValue({
          categoryName: editingCategory.categoryName || editingCategory.name,
          description: editingCategory.description || ''
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, editingCategory, form]);

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
      title={isEdit ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
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
          name="categoryName"
          label="Tên danh mục"
          rules={[{ required: true, message: 'Vui lòng nhập tên danh mục' }]}
        >
          <Input placeholder="Ví dụ: Rau củ & Trái cây" />
        </Form.Item>

        <Form.Item name="description" label="Mô tả">
          <Input.TextArea rows={3} placeholder="Mô tả danh mục hàng..." />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CategoryFormModal;
