import React, { useState } from 'react';
import { List, Rate, Form, Input, Button, Card, Empty, message } from 'antd';
import { formatDate } from '../../../utils/formatDate';
import useAuthStore from '../../../stores/useAuthStore';
import styles from './ProductReviews.module.scss';

export const ProductReviews = ({ reviews, productId, onAddReview }) => {
  const { isAuthenticated } = useAuthStore();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      await onAddReview({ productId, rating: values.rating, comment: values.comment });
      form.resetFields();
      message.success('Cảm ơn bạn đã gửi đánh giá!');
    } catch (err) {
      message.error('Gửi đánh giá thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.reviewsWrapper}>
      {isAuthenticated && (
        <Card title="Gửi đánh giá của bạn" size="small" className={styles.reviewFormCard}>
          <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={{ rating: 5 }}>
            <Form.Item name="rating" label="Mức độ hài lòng" rules={[{ required: true }]}>
              <Rate />
            </Form.Item>
            <Form.Item
              name="comment"
              label="Nhận xét"
              rules={[{ required: true, message: 'Vui lòng nhập nhận xét của bạn' }]}
            >
              <Input.TextArea rows={3} placeholder="Chia sẻ cảm nhận về độ tươi, đóng gói, giao hàng..." />
            </Form.Item>
            <Button type="primary" htmlType="submit" loading={submitting}>
              Gửi đánh giá
            </Button>
          </Form>
        </Card>
      )}

      <h3 className={styles.sectionTitle}>
        Đánh giá từ khách hàng ({reviews?.length || 0})
      </h3>

      {!reviews || reviews.length === 0 ? (
        <Empty description="Chưa có đánh giá nào cho sản phẩm này." />
      ) : (
        <List
          itemLayout="vertical"
          dataSource={reviews}
          renderItem={(item) => (
            <List.Item className={styles.reviewItem}>
              <div className={styles.reviewHeader}>
                <strong>{item.user?.fullName || item.userName || 'Khách hàng'}</strong>
                <span className={styles.reviewDate}>{formatDate(item.createdAt)}</span>
              </div>
              <Rate disabled defaultValue={item.rating || 5} style={{ fontSize: 12, margin: '4px 0' }} />
              <p className={styles.reviewComment}>{item.comment || item.noiDung}</p>
              {item.replyText && (
                <div className={styles.replyBox}>
                  <strong>Bách Hóa Xanh phản hồi:</strong> {item.replyText}
                </div>
              )}
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default ProductReviews;
