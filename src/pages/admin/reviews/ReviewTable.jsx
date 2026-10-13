import React from 'react';
import { Table, Rate, Space, Button, Popconfirm, Typography } from 'antd';
import { DeleteOutlined, CommentOutlined } from '@ant-design/icons';
import { formatDate } from '../../../utils/formatDate';

const { Text } = Typography;

export const ReviewTable = ({ reviews, isLoading, onReply, onDelete }) => {
  const columns = [
    {
      title: 'Khách hàng',
      key: 'user',
      width: 140,
      render: (_, r) => <strong>{r.user?.fullName || r.userName || 'Khách hàng'}</strong>
    },
    {
      title: 'Sản phẩm',
      key: 'product',
      width: 180,
      render: (_, r) => (
        <div>
          <div style={{ fontWeight: 600 }}>{r.product?.productName || r.productName || 'Sản phẩm'}</div>
          <Text type="secondary" style={{ fontSize: 11 }}>Mã: {r.productId}</Text>
        </div>
      )
    },
    {
      title: 'Đánh giá',
      dataIndex: 'rating',
      key: 'rating',
      width: 130,
      render: (stars) => <Rate disabled defaultValue={stars || 5} style={{ fontSize: 13 }} />
    },
    {
      title: 'Nội dung nhận xét & Phản hồi',
      key: 'comment',
      render: (_, r) => (
        <div>
          <div>{r.comment || r.noiDung}</div>
          {r.replyText && (
            <div style={{ marginTop: 6, padding: '4px 8px', background: '#f0fdf4', borderRadius: 4, fontSize: 12, borderLeft: '3px solid #008848' }}>
              <strong>BHX phản hồi:</strong> {r.replyText}
            </div>
          )}
        </div>
      )
    },
    {
      title: 'Thời gian',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 140,
      render: (d) => formatDate(d)
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 110,
      render: (_, record) => {
        const id = record.reviewId || record.id;
        return (
          <Space size="small">
            <Button
              type="primary"
              size="small"
              icon={<CommentOutlined />}
              onClick={() => onReply(record)}
            />
            <Popconfirm
              title="Xóa đánh giá này khỏi hệ thống?"
              okButtonProps={{ danger: true }}
              onConfirm={() => onDelete(id)}
            >
              <Button danger size="small" icon={<DeleteOutlined />} />
            </Popconfirm>
          </Space>
        );
      }
    }
  ];

  return (
    <Table
      rowKey={(r) => r.reviewId || r.id}
      dataSource={reviews}
      columns={columns}
      loading={isLoading}
      pagination={{ pageSize: 10 }}
      bordered
      size="middle"
    />
  );
};

export default ReviewTable;
