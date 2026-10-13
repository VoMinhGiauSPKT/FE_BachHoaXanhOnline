import React, { useEffect, useState } from 'react';
import { Modal, Input, Typography } from 'antd';

const { Text } = Typography;

export const ReviewReplyModal = ({ open, review, isLoading, onCancel, onSubmit }) => {
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    if (review) {
      setReplyText(review.replyText || '');
    }
  }, [review]);

  const handleOk = async () => {
    if (!replyText.trim()) return;
    await onSubmit(review.reviewId || review.id, replyText);
  };

  return (
    <Modal
      title="Phản hồi đánh giá của khách hàng"
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={isLoading}
      okText="Gửi phản hồi"
      cancelText="Hủy"
    >
      <div style={{ marginBottom: 12, padding: 12, background: '#f8fafc', borderRadius: 8 }}>
        <Text type="secondary">Nội dung nhận xét của khách:</Text>
        <p style={{ marginTop: 4, fontWeight: 500 }}>"{review?.comment || review?.noiDung}"</p>
      </div>

      <Input.TextArea
        rows={4}
        placeholder="Nhập nội dung phản hồi từ Bách Hóa Xanh Online..."
        value={replyText}
        onChange={(e) => setReplyText(e.target.value)}
      />
    </Modal>
  );
};

export default ReviewReplyModal;
