import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, Row, Col } from 'antd';
import { PRODUCT_UNIT_OPTIONS } from '../../../constants/enums';

export const ProductFormModal = ({
  open,
  editingProduct,
  categories,
  suppliers,
  isLoading,
  onCancel,
  onSubmit
}) => {
  const [form] = Form.useForm();
  const isEdit = Boolean(editingProduct);

  useEffect(() => {
    if (open) {
      if (editingProduct) {
        form.setFieldsValue({
          productName: editingProduct.productName || editingProduct.name,
          categoryId: editingProduct.category?.categoryId || editingProduct.categoryId,
          supplierId: editingProduct.supplier?.supplierId || editingProduct.supplierId,
          price: editingProduct.price,
          unit: editingProduct.unit || 'KG',
          stock: editingProduct.stock !== undefined ? editingProduct.stock : editingProduct.quantity,
          imageUrl: editingProduct.imageUrl || editingProduct.image,
          description: editingProduct.description || ''
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, editingProduct, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await onSubmit(values);
    } catch (err) {
      // Form validation failed
    }
  };

  return (
    <Modal
      title={isEdit ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={isLoading}
      okText={isEdit ? 'Cập nhật' : 'Tạo mới'}
      cancelText="Hủy"
      width={680}
      destroyOnClose
    >
      <Form form={form} layout="vertical" initialValues={{ unit: 'KG', stock: 10 }}>
        <Row gutter={16}>
          <Col span={16}>
            <Form.Item
              name="productName"
              label="Tên sản phẩm"
              rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
            >
              <Input placeholder="Ví dụ: Táo Envy New Zealand" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="categoryId"
              label="Danh mục"
              rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
            >
              <Select placeholder="Chọn danh mục">
                {categories.map((c) => (
                  <Select.Option key={c.categoryId || c.id} value={c.categoryId || c.id}>
                    {c.categoryName || c.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="price"
              label="Giá bán (VND)"
              rules={[{ required: true, message: 'Vui lòng nhập giá bán' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                step={1000}
                formatter={(val) => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="unit" label="Đơn vị tính" rules={[{ required: true }]}>
              <Select options={PRODUCT_UNIT_OPTIONS} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="stock" label="Số lượng tồn kho" rules={[{ required: true }]}>
              <InputNumber style={{ width: '100%' }} min={0} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="supplierId" label="Nhà cung cấp">
          <Select placeholder="Chọn nhà cung cấp" allowClear>
            {suppliers.map((s) => (
              <Select.Option key={s.supplierId || s.id} value={s.supplierId || s.id}>
                {s.supplierName || s.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="imageUrl" label="Đường dẫn ảnh sản phẩm (URL)">
          <Input placeholder="https://images.unsplash.com/..." />
        </Form.Item>

        <Form.Item name="description" label="Mô tả sản phẩm">
          <Input.TextArea rows={3} placeholder="Mô tả công dụng, xuất xứ, tiêu chuẩn VietGAP..." />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProductFormModal;
