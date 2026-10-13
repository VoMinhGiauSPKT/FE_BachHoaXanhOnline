import React from 'react';
import { Table, Tag, Space, Button, Popconfirm, Typography } from 'antd';
import { EyeOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { formatVND } from '../../../utils/formatCurrency';
import { formatDate } from '../../../utils/formatDate';
import { formatPaymentMethod } from '../../../utils/formatPayment';
import { ORDER_STATUS_LABELS } from '../../../constants/enums';

const { Text } = Typography;

const getStatusColor = (status) => {
  switch (status) {
    case 'DA_GIAO': return 'success';
    case 'DANG_GIAO': return 'processing';
    case 'DA_XAC_NHAN': return 'blue';
    case 'CHO_XU_LY': return 'warning';
    case 'DA_HUY': return 'error';
    default: return 'default';
  }
};

export const OrderTable = ({
  orders,
  isLoading,
  page,
  limit,
  total,
  onPageChange,
  onViewDetail,
  onConfirmCod,
  onCancelOrder
}) => {
  const columns = [
    {
      title: 'Mã đơn',
      dataIndex: 'orderId',
      key: 'orderId',
      width: 120,
      render: (id, record) => <Text copyable strong>{id || record.id}</Text>
    },
    {
      title: 'Người nhận & SĐT',
      key: 'receiver',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 600 }}>{record.receiverName || record.tenNguoiNhan}</div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.phoneNumber || record.soDienThoaiNhan}
          </Text>
        </div>
      )
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (date) => formatDate(date)
    },
    {
      title: 'Thanh toán',
      key: 'payment',
      width: 130,
      render: (_, record) => formatPaymentMethod(record.paymentMethod || record.hinhThucThanhToan)
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 130,
      render: (amount, record) => (
        <span style={{ color: '#008848', fontWeight: 700 }}>
          {formatVND(amount || record.tongTien)}
        </span>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 140,
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {ORDER_STATUS_LABELS[status] || status}
        </Tag>
      )
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => onViewDetail(record)}
          />
          {record.status === 'CHO_XU_LY' && (
            <>
              <Popconfirm
                title="Xác nhận đã thu tiền đơn COD này?"
                onConfirm={() => onConfirmCod(record.orderId || record.id)}
              >
                <Button size="small" type="dashed" icon={<CheckCircleOutlined />} />
              </Popconfirm>
              <Popconfirm
                title="Xác nhận hủy hóa đơn này?"
                okButtonProps={{ danger: true }}
                onConfirm={() => onCancelOrder(record.orderId || record.id)}
              >
                <Button size="small" danger icon={<CloseCircleOutlined />} />
              </Popconfirm>
            </>
          )}
        </Space>
      )
    }
  ];

  return (
    <Table
      rowKey={(r) => r.orderId || r.id}
      dataSource={orders}
      columns={columns}
      loading={isLoading}
      pagination={{
        current: page,
        pageSize: limit,
        total: total,
        onChange: onPageChange,
        showTotal: (tot) => `Tổng ${tot} đơn hàng`
      }}
      bordered
      size="middle"
    />
  );
};

export default OrderTable;
