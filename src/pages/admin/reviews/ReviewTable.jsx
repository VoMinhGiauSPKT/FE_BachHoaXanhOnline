import React from 'react';
import { Table, Rate, Tag, Space, Button, Popconfirm, Typography, Tooltip } from 'antd';
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { formatDate } from '../../../utils/formatDate';

const { Text } = Typography;

export const ReviewTable = ({ reviews, isLoading, onViewDetail, onDelete }) => {
  const columns = [
    {
      title: 'Mã',
      key: 'code',
      width: 100,
      render: (_, r) => (
        <Text copyable strong>
          #{r.reviewId || r.id}
        </Text>
      )
    },
    {
      title: 'Mã sản phẩm',
      key: 'productId',
      width: 130,
      render: (_, r) => {
        const pId = r.product?.productId || r.productId;
        return pId ? <Tag color="blue">{pId}</Tag> : <Text type="secondary">—</Text>;
      }
    },
    {
      title: 'Số sao',
      dataIndex: 'rating',
      key: 'rating',
      width: 140,
      render: (stars, r) => (
        <Rate disabled value={stars ?? r.soSao ?? 5} style={{ fontSize: 13 }} />
      )
    },
    {
      title: 'Thời gian',
      key: 'createdAt',
      width: 140,
      render: (_, r) => formatDate(r.createdAt || r.ngayDang)
    },
    {
      title: 'Phản hồi',
      key: 'replyStatus',
      width: 140,
      align: 'center',
      render: (_, r) => {
        const isReplied = Boolean(r.reply || r.replyText || r.phanHoi);
        return (
          <Tag color={isReplied ? 'success' : 'warning'}>
            {isReplied ? 'Đã phản hồi' : 'Chưa phản hồi'}
          </Tag>
        );
      }
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 100,
      align: 'center',
      render: (_, record) => {
        const id = record.reviewId || record.id;
        return (
          <Space size="small">
            <Tooltip title="Xem chi tiết & Phản hồi">
              <Button
                type="primary"
                size="small"
                icon={<EyeOutlined />}
                onClick={() => onViewDetail(record)}
              />
            </Tooltip>
            <Popconfirm
              title="Xóa đánh giá này khỏi hệ thống?"
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
              onConfirm={() => onDelete(id)}
            >
              <Tooltip title="Xóa đánh giá">
                <Button danger size="small" icon={<DeleteOutlined />} />
              </Tooltip>
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
