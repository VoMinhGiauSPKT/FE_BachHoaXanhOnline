import React, { useState } from 'react';
import {
  Table,
  Button,
  Tag,
  Space,
  Modal,
  Card,
  Popconfirm,
  Tooltip,
  Typography,
  Input,
  Select,
  Rate,
  Image
} from 'antd';
import {
  DeleteOutlined,
  CommentOutlined,
  ReloadOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { formatDate } from '../../../../../utils/formatDate';

const { Text } = Typography;

export const ReviewManager = ({
  reviews = [],
  isLoading = false,
  page = 1,
  limit = 20,
  total = 0,
  keyword = '',
  ratingFilter = '',
  statusFilter = '',
  onSearchSubmit,
  onResetFilters,
  onKeywordChange,
  onRatingFilterChange,
  onStatusFilterChange,
  onPageChange,
  onDeleteReview,
  onReplyReview,
  onRefresh
}) => {
  const [tempKeyword, setTempKeyword] = useState(keyword);
  const [tempRating, setTempRating] = useState(ratingFilter);
  const [tempStatus, setTempStatus] = useState(statusFilter);

  React.useEffect(() => {
    setTempKeyword(keyword);
  }, [keyword]);
  React.useEffect(() => {
    setTempRating(ratingFilter);
  }, [ratingFilter]);
  React.useEffect(() => {
    setTempStatus(statusFilter);
  }, [statusFilter]);

  const handleSearchClick = () => {
    if (onSearchSubmit) {
      onSearchSubmit({
        keyword: tempKeyword,
        ratingFilter: tempRating,
        statusFilter: tempStatus
      });
    } else {
      onKeywordChange?.(tempKeyword);
      onRatingFilterChange?.(tempRating);
      onStatusFilterChange?.(tempStatus);
    }
  };

  const handleRatingChange = (val) => {
    setTempRating(val);
    if (onSearchSubmit) {
      onSearchSubmit({
        keyword: tempKeyword,
        ratingFilter: val,
        statusFilter: tempStatus
      });
    } else {
      onRatingFilterChange?.(val);
    }
  };

  const handleStatusChange = (val) => {
    setTempStatus(val);
    if (onSearchSubmit) {
      onSearchSubmit({
        keyword: tempKeyword,
        ratingFilter: tempRating,
        statusFilter: val
      });
    } else {
      onStatusFilterChange?.(val);
    }
  };

  const handleResetClick = () => {
    setTempKeyword('');
    setTempRating('');
    setTempStatus('');
    if (onResetFilters) {
      onResetFilters();
    } else {
      onKeywordChange?.('');
      onRatingFilterChange?.('');
      onStatusFilterChange?.('');
    }
  };

  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [activeReview, setActiveReview] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenReply = (record) => {
    setActiveReview(record);
    setReplyText(record.reply || '');
    setReplyModalOpen(true);
  };

  const handleSendReply = async () => {
    if (!replyText.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await onReplyReview(activeReview.reviewId || activeReview.id, replyText.trim());
      if (res?.success) {
        setReplyModalOpen(false);
        setReplyText('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    {
      title: 'Mã ĐG',
      dataIndex: 'reviewId',
      key: 'reviewId',
      width: 90,
      render: (id, r) => (
        <Tag color="cyan">#{id || r.id}</Tag>
      )
    },
    {
      title: 'Sản Phẩm',
      key: 'product',
      width: 220,
      render: (_, r) => {
        const prod = r.product || {};
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Image
              src={prod.imageUrl || prod.icon}
              width={40}
              height={40}
              style={{ objectFit: 'cover', borderRadius: 6 }}
              fallback="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40'><rect width='40' height='40' fill='%23f1f5f9'/></svg>"
            />
            <div style={{ overflow: 'hidden' }}>
              <Text strong ellipsis style={{ fontSize: 13, maxWidth: 150, display: 'block' }}>
                {prod.productName || r.productName || 'Sản phẩm'}
              </Text>
              <span style={{ fontSize: 11, color: '#94a3b8' }}>
                {prod.productId || r.productId}
              </span>
            </div>
          </div>
        );
      }
    },
    {
      title: 'Khách Hàng',
      key: 'customer',
      width: 170,
      render: (_, r) => {
        const cust = r.customer || {};
        return (
          <div>
            <Text strong style={{ fontSize: 13 }}>{cust.fullName || r.customerName || 'Khách hàng'}</Text>
            {cust.phoneNumber && (
              <div style={{ fontSize: 12, color: '#64748b' }}>📞 {cust.phoneNumber}</div>
            )}
          </div>
        );
      }
    },
    {
      title: 'Đánh Giá',
      dataIndex: 'rating',
      key: 'rating',
      width: 140,
      render: (rate) => <Rate disabled value={rate || 5} style={{ fontSize: 13 }} />
    },
    {
      title: 'Nội Dung Nhận Xét',
      dataIndex: 'comment',
      key: 'comment',
      render: (comment, r) => (
        <div>
          <div style={{ fontSize: 13 }}>{comment || '(Không có lời bình)'}</div>
          {r.reply && (
            <div style={{ marginTop: 6, background: '#f8fafc', padding: '4px 8px', borderRadius: 6, borderLeft: '3px solid #10b981', fontSize: 12 }}>
              <span style={{ fontWeight: 600, color: '#059669' }}>Phản hồi từ FreshMart: </span>
              {r.reply}
            </div>
          )}
        </div>
      )
    },
    {
      title: 'Thời Gian',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (date) => (
        <span style={{ fontSize: 12, color: '#64748b' }}>
          {formatDate(date, true)}
        </span>
      )
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'isDeleted',
      key: 'isDeleted',
      width: 120,
      align: 'center',
      render: (deleted) => (
        <Tag color={deleted ? 'error' : 'success'}>
          {deleted ? 'Đã ẩn/xóa' : 'Hiển thị'}
        </Tag>
      )
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 120,
      align: 'center',
      render: (_, record) => {
        const revId = record.reviewId || record.id;
        const isDel = Boolean(record.isDeleted);
        return (
          <Space size="small">
            <Tooltip title="Phản hồi khách hàng">
              <Button
                type="primary"
                ghost
                size="small"
                icon={<CommentOutlined />}
                onClick={() => handleOpenReply(record)}
              />
            </Tooltip>
            {!isDel && (
              <Popconfirm
                title="Ẩn / Xóa bài đánh giá này?"
                description={`Xác nhận ẩn đánh giá #${revId}?`}
                onConfirm={() => onDeleteReview(revId)}
                okText="Ẩn đánh giá"
                cancelText="Hủy"
                okButtonProps={{ danger: true }}
              >
                <Tooltip title="Ẩn/Xóa đánh giá">
                  <Button danger size="small" icon={<DeleteOutlined />} />
                </Tooltip>
              </Popconfirm>
            )}
          </Space>
        );
      }
    }
  ];

  return (
    <Card
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 18, fontWeight: 700 }}>⭐ Kiểm Duyệt Đánh Giá Sản Phẩm</span>
          <Tag color="gold" style={{ fontSize: 13, padding: '2px 8px' }}>
            Tổng: {total} lượt đánh giá
          </Tag>
        </div>
      }
      extra={
        <Button icon={<ReloadOutlined />} onClick={onRefresh}>
          Làm mới
        </Button>
      }
      style={{ borderRadius: 12, boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}
    >
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', marginBottom: 20 }}>
        <Input
          placeholder="Tìm theo nội dung, tên/mã SP, khách hàng, SĐT..."
          prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
          value={tempKeyword}
          onChange={(e) => setTempKeyword(e.target.value)}
          onPressEnter={handleSearchClick}
          allowClear
          style={{ width: 360 }}
        />

        <Select
          placeholder="Số sao đánh giá"
          value={tempRating}
          onChange={handleRatingChange}
          style={{ width: 170 }}
          options={[
            { value: '', label: 'Tất cả mức sao' },
            { value: '5', label: '5 sao (Rất tốt)' },
            { value: '4', label: '4 sao (Tốt)' },
            { value: '3', label: '3 sao (Trung bình)' },
            { value: '2', label: '2 sao (Kém)' },
            { value: '1', label: '1 sao (Rất tệ)' }
          ]}
        />

        <Select
          placeholder="Trạng thái hiển thị"
          value={tempStatus}
          onChange={handleStatusChange}
          style={{ width: 170 }}
          options={[
            { value: '', label: 'Tất cả trạng thái' },
            { value: 'false', label: 'Đang hiển thị' },
            { value: 'true', label: 'Đã ẩn/xóa' }
          ]}
        />

        <Button
          type="primary"
          icon={<SearchOutlined />}
          onClick={handleSearchClick}
          style={{ background: '#10b981', borderColor: '#10b981', fontWeight: 600 }}
        >
          Tìm kiếm
        </Button>

        <Button
          icon={<ReloadOutlined />}
          onClick={handleResetClick}
        >
          Đặt lại
        </Button>
      </div>

      <Table
        rowKey={(r) => r.reviewId || r.id}
        columns={columns}
        dataSource={reviews}
        loading={isLoading}
        bordered
        pagination={{
          current: page,
          pageSize: limit,
          total: total,
          showSizeChanger: true,
          pageSizeOptions: ['20', '50', '100'],
          showQuickJumper: true,
          showTotal: (totalCount, range) => (
            <span style={{ color: '#64748b' }}>
              Hiển thị <strong>{range[0]}-{range[1]}</strong> trên <strong>{totalCount}</strong> đánh giá
            </span>
          ),
          onChange: (newPage, newPageSize) => {
            onPageChange(newPage, newPageSize);
          }
        }}
      />

      {/* Modal Phản Hồi Đánh Giá */}
      <Modal
        title={`💬 Phản Hồi Bài Đánh Giá #${activeReview?.reviewId || activeReview?.id}`}
        open={replyModalOpen}
        onOk={handleSendReply}
        onCancel={() => setReplyModalOpen(false)}
        confirmLoading={isSubmitting}
        okText="Gửi phản hồi"
        cancelText="Đóng"
        destroyOnClose
      >
        {activeReview && (
          <div style={{ marginTop: 12 }}>
            <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8, marginBottom: 16 }}>
              <div style={{ fontSize: 13, marginBottom: 4 }}>
                <strong>Khách hàng:</strong> {activeReview.customer?.fullName || activeReview.customerName || 'Ẩn danh'}
              </div>
              <div style={{ fontSize: 13, marginBottom: 4 }}>
                <strong>Sản phẩm:</strong> {activeReview.product?.productName || activeReview.productName}
              </div>
              <div style={{ fontSize: 13, color: '#475569' }}>
                <strong>Nhận xét:</strong> "{activeReview.comment}"
              </div>
            </div>

            <Text strong>Nội dung phản hồi từ ban quản trị FreshMart:</Text>
            <Input.TextArea
              rows={4}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Cảm ơn quý khách đã đóng góp ý kiến..."
              style={{ marginTop: 8 }}
            />
          </div>
        )}
      </Modal>
    </Card>
  );
};

export default ReviewManager;
