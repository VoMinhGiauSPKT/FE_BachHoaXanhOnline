import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, DatePicker, Row, Col } from 'antd';
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
  const discountType = Form.useWatch('discountType', form) || 'PHANTRAM';

  useEffect(() => {
    if (open) {
      if (editingPromotion) {
        form.setFieldsValue({
          promotionCode: editingPromotion.promotionCode || editingPromotion.code || editingPromotion.maKhuyenMai,
          promotionName: editingPromotion.promotionName || editingPromotion.tenKhuyenMai || '',
          description: editingPromotion.description || editingPromotion.moTa || '',
          discountType: editingPromotion.discountType || editingPromotion.loaiKhuyenMai || 'PHANTRAM',
          discountValue: editingPromotion.discountValue ?? editingPromotion.giaTriGiam ?? 10,
          minOrderAmount: editingPromotion.minOrderAmount ?? editingPromotion.donHangToiThieu ?? 0,
          maxDiscount: editingPromotion.maxDiscount ?? editingPromotion.giamToiDa ?? null,
          usageLimit: editingPromotion.remainingUsage ?? editingPromotion.soLuongDung ?? 100,
          startDate: editingPromotion.startDate ? dayjs(editingPromotion.startDate) : dayjs(),
          endDate: editingPromotion.endDate ? dayjs(editingPromotion.endDate) : dayjs().add(30, 'day')
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          promotionCode: 'Hệ thống tự động sinh mã (VD: KM0001)',
          discountType: 'PHANTRAM',
          discountValue: 10,
          minOrderAmount: 0,
          maxDiscount: 50000,
          usageLimit: 100,
          startDate: dayjs(),
          endDate: dayjs().add(30, 'day')
        });
      }
    }
  }, [open, editingPromotion, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const isPercent = values.discountType === 'PHANTRAM';
      const payload = {
        ...values,
        promotionName: values.promotionName?.trim(),
        description: values.description?.trim() || '',
        discountValue: Number(values.discountValue),
        minOrderAmount: Number(values.minOrderAmount || 0),
        maxDiscount: isPercent && values.maxDiscount ? Number(values.maxDiscount) : null,
        usageLimit: Number(values.usageLimit ?? 100),
        remainingUsage: Number(values.usageLimit ?? 100),
        startDate: values.startDate ? values.startDate.toISOString() : undefined,
        endDate: values.endDate ? values.endDate.toISOString() : undefined
      };
      await onSubmit(payload);
    } catch {
      // Validate form failed
    }
  };

  return (
    <Modal
      title={isEdit ? 'Chỉnh sửa Voucher Khuyến Mãi' : 'Tạo Voucher Khuyến Mãi Mới'}
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={isLoading}
      okText={isEdit ? 'Cập nhật' : 'Tạo mới'}
      cancelText="Hủy"
      width={650}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="promotionCode" label="Mã Voucher">
              <Input disabled placeholder="Tự sinh bởi hệ thống" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="promotionName"
              label="Tên chương trình"
              rules={[{ required: true, message: 'Vui lòng nhập tên chương trình' }]}
            >
              <Input placeholder="Ví dụ: Giảm giá mùa hè, Tri ân KH..." />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="description" label="Mô tả chi tiết">
          <Input.TextArea rows={2} placeholder="Chi tiết điều kiện hoặc lưu ý áp dụng..." />
        </Form.Item>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="discountType" label="Loại giảm giá" rules={[{ required: true }]}>
              <Select disabled={isEdit}>
                <Select.Option value="PHANTRAM">Phần trăm (%)</Select.Option>
                <Select.Option value="TIENMAT">Tiền mặt (VNĐ)</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="discountValue" label="Giá trị giảm" rules={[{ required: true }]}>
              <InputNumber
                disabled={isEdit}
                min={1}
                max={discountType === 'PHANTRAM' ? 100 : undefined}
                step={discountType === 'PHANTRAM' ? 1 : 5000}
                addonAfter={discountType === 'PHANTRAM' ? '%' : 'đ'}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="maxDiscount" label="Giảm tối đa">
              <InputNumber
                disabled={discountType === 'TIENMAT'}
                placeholder={discountType === 'TIENMAT' ? 'Không áp dụng' : 'Không giới hạn'}
                min={0}
                step={5000}
                addonAfter="đ"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="minOrderAmount" label="Đơn tối thiểu" rules={[{ required: true }]}>
              <InputNumber disabled={isEdit} min={0} step={10000} addonAfter="đ" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="usageLimit" label="Số lượt dùng" rules={[{ required: true, message: 'Nhập số lượt' }]}>
              <InputNumber min={1} step={10} style={{ width: '100%' }} placeholder="Số lượt áp dụng" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="startDate" label="Ngày bắt đầu" rules={[{ required: true }]}>
              <DatePicker disabled={isEdit} format="DD/MM/YYYY" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="endDate" label="Ngày kết thúc (Hạn dùng)" rules={[{ required: true }]}>
              <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default PromotionFormModal;
