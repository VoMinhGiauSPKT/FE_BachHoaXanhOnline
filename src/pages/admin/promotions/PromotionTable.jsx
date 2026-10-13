import React from 'react';
import { Table, Tag, Space, Button, Popconfirm, Typography } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { formatVND } from '../../../utils/formatCurrency';
import { formatDate } from '../../../utils/formatDate';

const { Text } = Typography;

export const PromotionTable = ({ promotions, isLoading, onEdit, onDelete }) => {
  const columns = [
    {
      title: 'Mã Voucher',
      dataIndex: 'code',
      key: 'code',
      width: 130,
      render: (code, r) => <Text copyable strong>{code || r.maKhuyenMai}</Text>
    },
    {
      title: 'Tên / Mô tả',
      dataIndex: 'description',
      key: 'description',
      render: (desc, r) => desc || r.moTa || 'Giảm giá đơn hàng'
    },
    {
      title: 'Giảm giá',
      key: 'discount',
      width: 120,
      render: (_, r) => {
        const percent = r.discountPercent || r.phanTramGiam;
        if (percent) return <Tag color="green">-{percent}%</Tag>;
        const amount = r.discountAmount || r.soTienGiam;
        return <Tag color="green">-{formatVND(amount || 0)}</Tag>;
      }
    },
    {
      title: 'Đơn tối thiểu',
      dataIndex: 'minOrderAmount',
      key: 'minOrderAmount',
      width: 130,
      render: (min, r) => formatVND(min || r.giaTriDonToiThieu || 0)
    },
    {
      title: 'Hạn dùng',
      key: 'expiry',
      width: 150,
      render: (_, r) => formatDate(r.endDate || r.ngayKetThuc)
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
          />
          <Popconfirm
            title="Xác nhận xóa voucher này?"
            okButtonProps={{ danger: true }}
            onConfirm={() => onDelete(record.code || record.maKhuyenMai)}
          >
            <Button danger size="small" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <Table
      rowKey={(r) => r.code || r.maKhuyenMai || r.id}
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
