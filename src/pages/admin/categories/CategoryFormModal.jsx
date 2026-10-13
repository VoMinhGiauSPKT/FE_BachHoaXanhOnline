import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber } from 'antd';

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
          profitMargin: editingCategory.profitMargin !== undefined ? Number(editingCategory.profitMargin) : 10
        });
      } else {
        form.resetFields();
        form.setFieldsValue({ profitMargin: 10 });
      }
    }
  }, [open, editingCategory, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await onSubmit({
        categoryName: values.categoryName?.trim(),
        profitMargin: Number(values.profitMargin || 0)
      });
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

        <Form.Item
          name="profitMargin"
          label="Tỷ lệ lợi nhuận định mức (%)"
          rules={[{ required: true, message: 'Vui lòng nhập tỷ lệ lợi nhuận (%)' }]}
          extra="Dùng để tính tự động giá bán lẻ cho các sản phẩm thuộc danh mục này"
        >
          <InputNumber min={0} max={100} style={{ width: '100%' }} placeholder="10" addonAfter="%" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CategoryFormModal;
