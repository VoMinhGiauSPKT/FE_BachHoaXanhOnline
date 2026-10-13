import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, Row, Col, DatePicker, Tag } from 'antd';
import dayjs from 'dayjs';
import { PRODUCT_UNIT_OPTIONS } from '../../../constants/enums';
import { formatVND } from '../../../utils/formatCurrency';
import styles from './ProductFormModal.module.scss';

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

  const selectedCategoryId = Form.useWatch('categoryId', form);
  const importPrice = Form.useWatch('importPrice', form);
  const vat = Form.useWatch('vat', form);

  const selectedCategory = categories.find((c) => (c.categoryId || c.id) === selectedCategoryId);
  const profitMargin = Number(selectedCategory?.profitMargin || 0);

  useEffect(() => {
    if (importPrice !== undefined && importPrice !== null && importPrice >= 0) {
      const vatRate = (Number(vat) || 0) / 100;
      const marginRate = profitMargin / 100;
      const calculatedSellingPrice = Math.round(Number(importPrice) * (1 + marginRate) * (1 + vatRate));
      form.setFieldValue('sellingPrice', calculatedSellingPrice);
    } else {
      form.setFieldValue('sellingPrice', 0);
    }
  }, [importPrice, vat, profitMargin, form]);

  useEffect(() => {
    if (open) {
      if (editingProduct) {
        form.setFieldsValue({
          productName: editingProduct.productName || editingProduct.name,
          categoryId: editingProduct.category?.categoryId || editingProduct.categoryId,
          supplierId: editingProduct.supplier?.supplierId || editingProduct.supplierId,
          importPrice: editingProduct.importPrice || 0,
          vat: editingProduct.vat !== undefined ? Math.round(editingProduct.vat * 100) : 8,
          sellingPrice: editingProduct.price,
          unit: editingProduct.unit || 'KG',
          quantity: editingProduct.stock !== undefined ? editingProduct.stock : (editingProduct.quantity || 0),
          imageUrl: editingProduct.imageUrl || editingProduct.image,
          expiryDate: editingProduct.expiryDate ? dayjs(editingProduct.expiryDate) : null
        });
      } else {
        form.resetFields();
        form.setFieldsValue({ unit: 'KG', quantity: 10, vat: 8, importPrice: undefined, sellingPrice: 0 });
      }
    }
  }, [open, editingProduct, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        productName: values.productName?.trim(),
        categoryId: values.categoryId,
        supplierId: values.supplierId,
        unit: values.unit,
        quantity: Number(values.quantity || 0),
        importPrice: Number(values.importPrice || 0),
        vat: Number(values.vat || 0) / 100,
        sellingPrice: Number(values.sellingPrice || 0),
        imageUrl: values.imageUrl?.trim() || null,
        expiryDate: values.expiryDate ? dayjs(values.expiryDate).format('YYYY-MM-DD') : null
      };
      await onSubmit(payload);
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
      width={720}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col span={14}>
            <Form.Item
              name="productName"
              label="Tên sản phẩm"
              rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
            >
              <Input placeholder="Ví dụ: Táo Envy New Zealand" />
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item
              name="categoryId"
              label="Danh mục ngành hàng"
              rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
            >
              <Select placeholder="Chọn danh mục">
                {categories.map((c) => (
                  <Select.Option key={c.categoryId || c.id} value={c.categoryId || c.id}>
                    {c.categoryName || c.name} ({c.profitMargin || 0}%)
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <div className={styles.calculationCard}>
          <div className={styles.calculationHeader}>
            <span>📊 Công thức tính giá bán theo CSDL Neon:</span>
            <Tag color="cyan">% Lợi nhuận danh mục: {profitMargin}%</Tag>
          </div>
          <div className={styles.formulaDesc}>
            Giá bán = Giá nhập × (1 + {profitMargin}%) × (1 + {vat || 0}%)
          </div>
          <div className={styles.calculationBreakdown}>
            <div className={styles.breakdownItem}>
              Giá nhập: <span>{formatVND(importPrice || 0)}</span>
            </div>
            <div className={styles.breakdownItem}>
              Thuế VAT: <span>{vat || 0}%</span>
            </div>
            <div className={styles.breakdownItem}>
              Giá bán tính tự động:{' '}
              <span className={styles.sellingPriceHighlight}>
                {formatVND(form.getFieldValue('sellingPrice') || 0)}
              </span>
            </div>
          </div>
        </div>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="importPrice"
              label="Giá nhập vào (VND)"
              rules={[{ required: true, message: 'Vui lòng nhập giá nhập' }]}
            >
              <InputNumber
                className="w-100"
                style={{ width: '100%' }}
                min={0}
                step={1000}
                placeholder="Nhập giá nhập..."
                formatter={(val) => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              name="vat"
              label="Thuế VAT (%)"
              rules={[{ required: true, message: 'Chọn mức thuế VAT' }]}
            >
              <Select
                options={[
                  { value: 0, label: '0% (Miễn thuế)' },
                  { value: 5, label: '5% (Ưu đãi)' },
                  { value: 8, label: '8% (Giảm 2026)' },
                  { value: 10, label: '10% (Chuẩn)' }
                ]}
              />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              name="sellingPrice"
              label={
                <span>
                  Giá bán (VND) <Tag color="blue">Tự tính</Tag>
                </span>
              }
            >
              <InputNumber
                className="w-100"
                style={{ width: '100%' }}
                disabled
                formatter={(val) => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="unit" label="Đơn vị tính" rules={[{ required: true }]}>
              <Select options={PRODUCT_UNIT_OPTIONS} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="quantity"
              label="Số lượng tồn kho"
              rules={[{ required: true, message: 'Vui lòng nhập số lượng tồn' }]}
            >
              <InputNumber style={{ width: '100%' }} min={0} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="expiryDate" label="Hạn sử dụng">
              <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" placeholder="Chọn ngày" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="supplierId"
              label="Nhà cung cấp"
              rules={[{ required: true, message: 'Vui lòng chọn nhà cung cấp' }]}
            >
              <Select placeholder="Chọn nhà cung cấp">
                {suppliers.map((s) => (
                  <Select.Option key={s.supplierId || s.id} value={s.supplierId || s.id}>
                    {s.supplierName || s.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="imageUrl" label="Đường dẫn ảnh sản phẩm (URL)">
              <Input placeholder="https://..." />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default ProductFormModal;
