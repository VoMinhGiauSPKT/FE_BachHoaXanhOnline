import React, { useEffect, useState } from 'react';
import { Card, Button, message } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { useReviewStore } from '../../../stores/useReviewStore';
import ReviewTable from './ReviewTable';
import ReviewReplyModal from './ReviewReplyModal';

export const AdminReviewsPage = () => {
  const {
    moderationReviews,
    isLoading,
    fetchModerationReviews,
    deleteReview,
    replyReview,
    refresh
  } = useReviewStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  useEffect(() => {
    fetchModerationReviews();
  }, [fetchModerationReviews]);

  const handleReplyClick = (rev) => {
    setSelectedReview(rev);
    setModalOpen(true);
  };

  const handleReplySubmit = async (id, text) => {
    const res = await replyReview(id, text);
    if (res.success) {
      message.success('Đã gửi phản hồi đánh giá!');
      setModalOpen(false);
    } else {
      message.error(res.error || 'Gửi phản hồi thất bại');
    }
  };

  const handleDelete = async (id) => {
    const res = await deleteReview(id);
    if (res.success) {
      message.success('Đã xóa đánh giá thành công!');
    } else {
      message.error(res.error || 'Xóa thất bại');
    }
  };

  return (
    <Card
      title="Kiểm duyệt & Phản hồi Đánh Giá Khách Hàng"
      variant="borderless"
      extra={
        <Button icon={<ReloadOutlined />} onClick={refresh}>
          Làm mới
        </Button>
      }
    >
      <ReviewTable
        reviews={moderationReviews}
        isLoading={isLoading}
        onReply={handleReplyClick}
        onDelete={handleDelete}
      />

      <ReviewReplyModal
        open={modalOpen}
        review={selectedReview}
        isLoading={isLoading}
        onCancel={() => setModalOpen(false)}
        onSubmit={handleReplySubmit}
      />
    </Card>
  );
};

export default AdminReviewsPage;
