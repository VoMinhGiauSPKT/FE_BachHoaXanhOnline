import React, { useEffect, useState } from 'react';
import { Modal, Descriptions, Rate, Tag, Input, Button, Typography, Space, Divider } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { formatDate } from '../../../utils/formatDate';

const { Text, Paragraph } = Typography;

export const ReviewDetailModal = ({
  open,
  review,
  isLoading,
  onCancel,
  onSubmitReply
}) => {
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    if (review) {
      setReplyText(review.reply || review.replyText || review.phanHoi || '');
    } else {
      setReplyText('');
    }
  }, [review]);

  const handleSendReply = async () => {
    if (!replyText.trim() || !review) return;
    const id = review.reviewId || review.id;
    await onSubmitReply(id, replyText.trim());
  };

  if (!review) return null;

  const hasReplied = Boolean(review.reply || review.replyText || review.phanHoi);

  return (
    <Modal
      title={`Chi tiết Đánh giá #${review.reviewId || review.id}`}
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="close" onClick={onCancel}>
          Đóng
        </Button>
      ]}
      width={680}
      destroyOnClose
    >
      <Descriptions bordered size="small" column={2} style={{ marginBottom: 16 }}>
        <Descriptions.Item label="Mã đánh giá">
          <Text strong copyable>#{review.reviewId || review.id}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="Thời gian">
          {formatDate(review.createdAt || review.ngayDang)}
        </Descriptions.Item>
        <Descriptions.Item label="Tên khách hàng">
          <strong>{review.customer?.fullName || review.userName || 'Khách hàng'}</strong>
        </Descriptions.Item>
        <Descriptions.Item label="Số điện thoại">
          {review.customer?.phoneNumber || '—'}
        </Descriptions.Item>
        <Descriptions.Item label="Mã sản phẩm">
          <Tag color="blue">{review.product?.productId || review.productId || '—'}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Tên sản phẩm">
          <strong>{review.product?.productName || review.productName || 'Sản phẩm'}</strong>
        </Descriptions.Item>
        <Descriptions.Item label="Số sao" span={2}>
          <Space>
            <Rate disabled value={review.rating ?? review.soSao ?? 5} style={{ fontSize: 14 }} />
            <Text type="secondary">({review.rating ?? review.soSao ?? 5}/5 sao)</Text>
          </Space>
        </Descriptions.Item>
      </Descriptions>

      <div style={{ marginBottom: 16 }}>
        <Text strong>Nội dung nhận xét từ khách hàng:</Text>
        <div style={{ marginTop: 6, padding: '10px 14px', background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
          <Paragraph style={{ margin: 0, fontStyle: 'italic', fontSize: 13 }}>
            "{review.comment || review.noiDung || 'Khách hàng không để lại nhận xét bằng lời.'}"
          </Paragraph>
        </div>
      </div>

      <Divider style={{ margin: '14px 0' }} />

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <Text strong>Lời phản hồi từ Bách Hóa Xanh:</Text>
          <Tag color={hasReplied ? 'success' : 'warning'}>
            {hasReplied ? 'Đã phản hồi' : 'Chưa phản hồi'}
          </Tag>
        </div>

        {hasReplied && (review.repliedAt || review.ngayPhanHoi) && (
          <Text type="secondary" style={{ display: 'block', marginBottom: 6, fontSize: 12 }}>
            Lần phản hồi gần nhất: {formatDate(review.repliedAt || review.ngayPhanHoi)}
          </Text>
        )}

        <Input.TextArea
          rows={3}
          placeholder="Nhập nội dung phản hồi giải đáp, cảm ơn hoặc hỗ trợ khách hàng..."
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          style={{ marginBottom: 10 }}
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="primary"
            icon={<SendOutlined />}
            loading={isLoading}
            disabled={!replyText.trim()}
            onClick={handleSendReply}
          >
            {hasReplied ? 'Cập nhật phản hồi' : 'Gửi phản hồi'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ReviewDetailModal;
