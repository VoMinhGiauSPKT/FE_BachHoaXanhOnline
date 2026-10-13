import React from 'react';
import { Table, Tag, Space, Button, Popconfirm, Typography, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { formatVND } from '../../../utils/formatCurrency';
import { formatDate } from '../../../utils/formatDate';

const { Text } = Typography;

export const PromotionTable = ({ promotions, isLoading, onEdit, onDelete }) => {
  const columns = [
    {
      title: 'Mã',
      key: 'code',
      width: 120,
      render: (_, r) => (
        <Text copyable strong>
          {r.promotionCode || r.code || r.maKhuyenMai}
        </Text>
      )
    },
    {
      title: 'Mô tả',
      key: 'description',
      render: (_, r) => (
        <div>
          <div style={{ fontWeight: 500 }}>
            {r.promotionName || r.tenKhuyenMai || 'Khuyến mãi'}
          </div>
          {(r.description || r.moTa) && (
            <Text type="secondary" style={{ fontSize: 12 }}>
              {r.description || r.moTa}
            </Text>
          )}
        </div>
      )
    },
    {
      title: 'Giảm giá',
      key: 'discount',
      width: 120,
      render: (_, r) => {
        const type = (r.discountType || r.loaiKhuyenMai || '').toUpperCase();
        const val = r.discountValue ?? r.giaTriGiam ?? r.discountPercent ?? r.discountAmount ?? 0;
        if (type === 'PHANTRAM' || type === 'PERCENT' || (val <= 100 && type !== 'TIENMAT')) {
          return <Tag color="green">-{val}%</Tag>;
        }
        return <Tag color="blue">-{formatVND(val)}</Tag>;
      }
    },
    {
      title: 'Đơn tối thiểu',
      key: 'minOrderAmount',
      width: 130,
      render: (_, r) => formatVND(r.minOrderAmount ?? r.donHangToiThieu ?? r.giaTriDonToiThieu ?? 0)
    },
    {
      title: 'Giảm tối đa',
      key: 'maxDiscount',
      width: 130,
      render: (_, r) => {
        const max = r.maxDiscount ?? r.giamToiDa ?? r.maxDiscountAmount;
        return max ? formatVND(max) : <Text type="secondary">-</Text>;
      }
    },
    {
      title: 'Số lượt dùng',
      key: 'remainingUsage',
      width: 110,
      align: 'center',
      render: (_, r) => {
        const usage = r.remainingUsage ?? r.soLuongDung ?? 0;
        return (
          <Tag color={usage > 10 ? 'cyan' : usage > 0 ? 'orange' : 'default'}>
            {usage}
          </Tag>
        );
      }
    },
    {
      title: 'Hạn dùng',
      key: 'endDate',
      width: 130,
      render: (_, r) => formatDate(r.endDate || r.ngayKetThuc)
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 100,
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Chỉnh sửa voucher">
            <Button
              type="primary"
              size="small"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Xác nhận xóa voucher này?"
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
            onConfirm={() => onDelete(record.promotionCode || record.code || record.maKhuyenMai)}
          >
            <Tooltip title="Xóa voucher">
              <Button danger size="small" icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <Table
      rowKey={(r) => r.promotionCode || r.code || r.maKhuyenMai || r.id}
      dataSource={promotions}
      columns={columns}
      loading={isLoading}
      pagination={{ pageSize: 10 }}
      bordered
      size="middle"
    />
  );
};

export default PromotionTable;
