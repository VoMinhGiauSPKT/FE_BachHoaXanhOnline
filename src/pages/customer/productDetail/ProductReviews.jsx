import React from 'react';
import { List, Rate, Empty } from 'antd';
import { formatDate } from '../../../utils/formatDate';
import styles from './ProductReviews.module.scss';

export const ProductReviews = ({ reviews }) => {
  return (
    <div className={styles.reviewsWrapper}>
      <h3 className={styles.sectionTitle}>
        Đánh giá từ khách hàng ({reviews?.length || 0})
      </h3>

      {!reviews || reviews.length === 0 ? (
        <Empty description="Chưa có đánh giá nào cho sản phẩm này." />
      ) : (
        <List
          itemLayout="vertical"
          dataSource={reviews}
          renderItem={(item) => {
            const customerName =
              item.customer?.fullName ||
              item.customer?.username ||
              item.user?.fullName ||
              item.userName ||
              item.fullName ||
              'Khách hàng';
            const rating = item.rating || 5;
            const content = item.comment || item.noiDung || item.content;
            const reply = item.reply || item.replyText || item.phanHoi;

            return (
              <List.Item className={styles.reviewItem}>
                <div className={styles.reviewHeader}>
                  <strong style={{ fontSize: 14 }}>{customerName}</strong>
                  <span className={styles.reviewDate}>{formatDate(item.createdAt)}</span>
                </div>
                <Rate disabled value={rating} style={{ fontSize: 13, margin: '4px 0' }} />
                <p className={styles.reviewComment}>{content}</p>
                {reply && (
                  <div className={styles.replyBox}>
                    <strong>Bách Hóa Xanh phản hồi:</strong> {reply}
                  </div>
                )}
              </List.Item>
            );
          }}
        />
      )}
    </div>
  );
};

export default ProductReviews;
