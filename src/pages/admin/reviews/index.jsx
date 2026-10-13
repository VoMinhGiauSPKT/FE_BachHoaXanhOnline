import React, { useEffect, useMemo, useState } from 'react';
import { Card, message } from 'antd';
import { useReviewStore } from '../../../stores/useReviewStore';
import ReviewFilterBar from './ReviewFilterBar';
import ReviewTable from './ReviewTable';
import ReviewDetailModal from './ReviewDetailModal';

export const AdminReviewsPage = () => {
  const {
    moderationReviews,
    isLoading,
    fetchModerationReviews,
    deleteReview,
    replyReview,
    refresh
  } = useReviewStore();

  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [search, setSearch] = useState('');
  const [ratingFilter, setRatingFilter] = useState(null);
  const [replyStatusFilter, setReplyStatusFilter] = useState('ALL');

  useEffect(() => {
    fetchModerationReviews();
  }, [fetchModerationReviews]);

  const filteredReviews = useMemo(() => {
    return (moderationReviews || []).filter((r) => {
      if (ratingFilter && r.rating !== ratingFilter) return false;
      const isReplied = Boolean(r.reply || r.replyText || r.phanHoi);
      if (replyStatusFilter === 'REPLIED' && !isReplied) return false;
      if (replyStatusFilter === 'UNREPLIED' && isReplied) return false;
      if (search.trim()) {
        const kw = search.trim().toLowerCase();
        const pId = (r.product?.productId || r.productId || '').toLowerCase();
        const pName = (r.product?.productName || r.productName || '').toLowerCase();
        const comment = (r.comment || r.noiDung || '').toLowerCase();
        const customer = (r.customer?.fullName || r.userName || '').toLowerCase();
        if (!pId.includes(kw) && !pName.includes(kw) && !comment.includes(kw) && !customer.includes(kw)) {
          return false;
        }
      }
      return true;
    });
  }, [moderationReviews, search, ratingFilter, replyStatusFilter]);

  const handleViewDetail = (rev) => {
    setSelectedReview(rev);
    setDetailOpen(true);
  };

  const handleReplySubmit = async (id, text) => {
    const res = await replyReview(id, text);
    if (res.success) {
      message.success('Đã lưu phản hồi đánh giá thành công!');
      setSelectedReview((prev) => prev ? { ...prev, reply: text, phanHoi: text, repliedAt: new Date().toISOString() } : null);
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
    <Card title="Kiểm duyệt & Phản hồi Đánh Giá Khách Hàng" variant="borderless">
      <ReviewFilterBar
        search={search}
        rating={ratingFilter}
        replyStatus={replyStatusFilter}
        onSearchChange={setSearch}
        onRatingChange={setRatingFilter}
        onReplyStatusChange={(val) => setReplyStatusFilter(val || 'ALL')}
        onReset={() => {
          setSearch('');
          setRatingFilter(null);
          setReplyStatusFilter('ALL');
        }}
        onRefresh={refresh}
      />

      <ReviewTable
        reviews={filteredReviews}
        isLoading={isLoading}
        onViewDetail={handleViewDetail}
        onDelete={handleDelete}
      />

      <ReviewDetailModal
        open={detailOpen}
        review={selectedReview}
        isLoading={isLoading}
        onCancel={() => setDetailOpen(false)}
        onSubmitReply={handleReplySubmit}
      />
    </Card>
  );
};

export default AdminReviewsPage;
