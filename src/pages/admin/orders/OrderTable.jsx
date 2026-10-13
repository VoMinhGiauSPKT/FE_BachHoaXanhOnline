import React from 'react';
import { Table, Tag, Space, Button, Popconfirm, Typography } from 'antd';
import { EyeOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { formatVND } from '../../../utils/formatCurrency';
import { formatDate } from '../../../utils/formatDate';
import { formatPaymentMethod } from '../../../utils/formatPayment';
import { ORDER_STATUS_LABELS } from '../../../constants/enums';

const { Text } = Typography;

const isUnpaid = (status) => {
  if (!status) return false;
  const s = String(status).toUpperCase();
  return (
    s === 'CHUATHANHTOAN' ||
    s === 'CHO_XU_LY' ||
    s === 'PENDING' ||
    s === 'CHO_THANH_TOAN' ||
    s === 'DANGXULY'
  );
};

const getStatusColor = (status) => {
  if (!status) return 'default';
  const s = String(status).toUpperCase();
  switch (s) {
    case 'DATHANHTOAN':
    case 'COMPLETED':
    case 'DA_GIAO':
      return 'success';
    case 'CHUATHANHTOAN':
    case 'CHO_XU_LY':
    case 'PENDING':
    case 'DANGXULY':
      return 'warning';
    case 'DAHUY':
    case 'CANCELLED':
    case 'DA_HUY':
      return 'error';
    case 'DANG_GIAO':
      return 'processing';
    case 'DA_XAC_NHAN':
      return 'blue';
    default:
      return 'default';
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
      title: 'Mã',
      dataIndex: 'orderId',
      key: 'orderId',
      width: 110,
      render: (id, record) => <Text copyable strong>{id || record.maDonHang || record.id}</Text>
    },
    {
      title: 'Người nhận',
      dataIndex: 'receiverName',
      key: 'receiverName',
      width: 140,
      render: (name, record) => <strong>{name || record.tenNguoiNhan || '—'}</strong>
    },
    {
      title: 'SĐT',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      width: 110,
      render: (phone, record) => phone || record.soDienThoaiNhan || '—'
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 140,
      render: (date, record) => formatDate(date || record.ngayLap)
    },
    {
      title: 'Thanh toán',
      key: 'payment',
      width: 120,
      render: (_, record) => formatPaymentMethod(record.paymentMethod || record.hinhThucThanhToan || record.phuongThucTT)
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 130,
      render: (amount, record) => (
        <span style={{ color: '#008848', fontWeight: 700 }}>
          {formatVND(amount || record.tongTienSauGiamGia || record.tongTien)}
        </span>
      )
    },
    {
      title: 'Trạng thái',
      key: 'status',
      width: 150,
      render: (_, record) => {
        const st = record.status || record.trangThai;
        return (
          <Tag color={getStatusColor(st)}>
            {ORDER_STATUS_LABELS[st] || st || 'Chưa rõ'}
          </Tag>
        );
      }
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 220,
      render: (_, record) => {
        const id = record.orderId || record.maDonHang || record.id;
        const st = record.status || record.trangThai;
        const unpaid = isUnpaid(st);

        return (
          <Space size="small">
            <Button
              type="primary"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => onViewDetail(record)}
            />
            {unpaid && (
              <>
                <Popconfirm
                  title="Xác nhận thanh toán cho đơn hàng này?"
                  okText="Xác nhận"
                  cancelText="Hủy"
                  onConfirm={() => onConfirmCod(id)}
                >
                  <Button
                    size="small"
                    type="primary"
                    style={{ background: '#008848', borderColor: '#008848' }}
                    icon={<CheckCircleOutlined />}
                  >
                    Xác nhận
                  </Button>
                </Popconfirm>
                <Popconfirm
                  title="Xác nhận hủy đơn hàng này?"
                  okText="Hủy đơn"
                  cancelText="Đóng"
                  okButtonProps={{ danger: true }}
                  onConfirm={() => onCancelOrder(id)}
                >
                  <Button size="small" danger icon={<CloseCircleOutlined />}>
                    Hủy đơn
                  </Button>
                </Popconfirm>
              </>
            )}
          </Space>
        );
      }
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
