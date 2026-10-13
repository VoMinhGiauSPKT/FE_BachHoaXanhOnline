import React, { useState } from 'react';
import { Modal, Form, Rate, Input, Button, message, Space, Avatar } from 'antd';
import { useReviewStore } from '../../../stores/useReviewStore';

export const CreateReviewModal = ({ open, product, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const { createReview } = useReviewStore();

  if (!product) return null;

  const productId = product.productId || product.id || product.maSanPham;
  const productName = product.productName || product.tenSanPham || 'Sản phẩm';
  const imageUrl = product.imageUrl || product.image;

  const handleSubmit = async (values) => {
    setSubmitting(true);
    const res = await createReview({
      productId,
      rating: values.rating,
      comment: values.comment?.trim() || ''
    });
    setSubmitting(false);

    if (res.success) {
      message.success('Đánh giá sản phẩm thành công! Cảm ơn bạn đã đóng góp ý kiến.');
      form.resetFields();
      if (onSuccess) onSuccess();
      onCancel();
    } else {
      message.error(res.error || 'Gửi đánh giá thất bại');
    }
  };

  return (
    <Modal
      title="Đánh giá sản phẩm đã mua"
      open={open}
      onCancel={onCancel}
      footer={null}
      destroyOnClose
      width={500}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, padding: 12, background: '#f8fafc', borderRadius: 8 }}>
        <Avatar
          src={imageUrl}
          size={48}
          shape="square"
          style={{ background: '#e2e8f0', color: '#008848' }}
        >
          {productName.charAt(0)}
        </Avatar>
        <div>
          <h4 style={{ margin: 0, fontSize: 15 }}>{productName}</h4>
          <span style={{ fontSize: 12, color: '#64748b' }}>Mã SP: {productId}</span>
        </div>
      </div>

      <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={{ rating: 5 }}>
        <Form.Item
          name="rating"
          label="Mức độ hài lòng"
          rules={[{ required: true, message: 'Vui lòng chọn số sao đánh giá' }]}
        >
          <Rate style={{ fontSize: 24, color: '#faad14' }} />
        </Form.Item>

        <Form.Item
          name="comment"
          label="Nhận xét của bạn"
          rules={[{ required: true, message: 'Vui lòng nhập nội dung nhận xét' }]}
        >
          <Input.TextArea
            rows={4}
            placeholder="Chia sẻ cảm nhận chân thực về chất lượng sản phẩm, độ tươi ngon, quy cách đóng gói..."
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
          <Space>
            <Button onClick={onCancel}>Hủy</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={submitting}
              style={{ backgroundColor: '#008848', borderColor: '#008848' }}
            >
              Gửi đánh giá
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateReviewModal;
