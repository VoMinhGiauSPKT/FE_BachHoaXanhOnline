import React from 'react';
import { Space, Input, Select, Button } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';

export const ReviewFilterBar = ({
  search,
  rating,
  replyStatus,
  onSearchChange,
  onRatingChange,
  onReplyStatusChange,
  onReset,
  onRefresh
}) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
      <Space wrap>
        <Input
          placeholder="Tìm mã SP, nội dung đánh giá..."
          prefix={<SearchOutlined />}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{ width: 260 }}
          allowClear
        />

        <Select
          placeholder="Tất cả số sao"
          value={rating ?? undefined}
          onChange={onRatingChange}
          style={{ width: 150 }}
          allowClear
        >
          <Select.Option value={5}>5 sao ★★★★★</Select.Option>
          <Select.Option value={4}>4 sao ★★★★☆</Select.Option>
          <Select.Option value={3}>3 sao ★★★☆☆</Select.Option>
          <Select.Option value={2}>2 sao ★★☆☆☆</Select.Option>
          <Select.Option value={1}>1 sao ★☆☆☆☆</Select.Option>
        </Select>

        <Select
          placeholder="Trạng thái phản hồi"
          value={replyStatus || undefined}
          onChange={onReplyStatusChange}
          style={{ width: 170 }}
          allowClear
        >
          <Select.Option value="ALL">Tất cả phản hồi</Select.Option>
          <Select.Option value="UNREPLIED">Chưa phản hồi</Select.Option>
          <Select.Option value="REPLIED">Đã phản hồi</Select.Option>
        </Select>

        <Button onClick={onReset}>Xóa lọc</Button>
      </Space>

      <Button icon={<ReloadOutlined />} onClick={onRefresh}>
        Làm mới
      </Button>
    </div>
  );
};

export default ReviewFilterBar;
