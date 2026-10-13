import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, DatePicker, Row, Col } from 'antd';
import dayjs from 'dayjs';

export const PromotionFormModal = ({
  open,
  editingPromotion,
  isLoading,
  onCancel,
  onSubmit
}) => {
  const [form] = Form.useForm();
  const isEdit = Boolean(editingPromotion);

  useEffect(() => {
    if (open) {
      if (editingPromotion) {
        form.setFieldsValue({
          code: editingPromotion.promotionCode || editingPromotion.code || editingPromotion.maKhuyenMai,
          description: editingPromotion.description || editingPromotion.moTa || editingPromotion.promotionName || '',
          discountPercent: editingPromotion.discountValue ?? editingPromotion.discountPercent ?? editingPromotion.phanTramGiam ?? 10,
          minOrderAmount: editingPromotion.minOrderAmount ?? editingPromotion.giaTriDonToiThieu ?? 100000,
          maxDiscountAmount: editingPromotion.maxDiscount ?? editingPromotion.maxDiscountAmount ?? editingPromotion.giamToiDa ?? 50000,
          endDate: editingPromotion.endDate ? dayjs(editingPromotion.endDate) : dayjs().add(30, 'day')
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, editingPromotion, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        endDate: values.endDate ? values.endDate.toISOString() : undefined
      };
      await onSubmit(payload);
    } catch (err) {
      // Form validate fail
    }
  };

  return (
    <Modal
      title={isEdit ? 'Chỉnh sửa Voucher' : 'Tạo Voucher Khuyến mãi mới'}
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={isLoading}
      okText={isEdit ? 'Cập nhật' : 'Tạo mới'}
      cancelText="Hủy"
      destroyOnClose
    >
      <Form form={form} layout="vertical" initialValues={{ discountPercent: 10, minOrderAmount: 100000 }}>
        <Form.Item
          name="code"
          label="Mã Voucher"
          rules={[{ required: true, message: 'Vui lòng nhập mã voucher' }]}
        >
          <Input placeholder="Ví dụ: HELLO2026, FREESHIP" disabled={isEdit} style={{ textTransform: 'uppercase' }} />
        </Form.Item>

        <Form.Item
          name="description"
          label="Mô tả chương trình"
          rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
        >
          <Input placeholder="Ví dụ: Giảm 10% tối đa 50.000đ cho đơn từ 100.000đ" />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="discountPercent" label="% Giảm giá" rules={[{ required: true }]}>
              <InputNumber min={1} max={100} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="maxDiscountAmount" label="Giảm tối đa (VND)">
              <InputNumber min={0} step={5000} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="minOrderAmount" label="Đơn tối thiểu (VND)" rules={[{ required: true }]}>
              <InputNumber min={0} step={10000} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="endDate" label="Ngày hết hạn" rules={[{ required: true }]}>
              <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default PromotionFormModal;
