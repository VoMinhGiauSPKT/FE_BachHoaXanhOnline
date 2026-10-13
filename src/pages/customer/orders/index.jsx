import React, { useEffect, useState } from 'react';
import { Card, Table, Tag, Button, message } from 'antd';
import { EyeOutlined, ReloadOutlined } from '@ant-design/icons';
import MainLayout from '../../../layouts/MainLayout';
import { useOrderStore } from '../../../stores/useOrderStore';
import { formatVND } from '../../../utils/formatCurrency';
import { formatDate } from '../../../utils/formatDate';
import { formatPaymentMethod } from '../../../utils/formatPayment';
import { ORDER_STATUS_LABELS } from '../../../constants/enums';
import OrderDetailModal from '../checkout/../orders/CustomerOrderDetailModal';
import styles from './Orders.module.scss';

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

export const CustomerOrdersPage = () => {
  const { orders, isLoading, fetchOrders, fetchOrderById, refresh } = useOrderStore();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleViewDetail = async (record) => {
    const id = record.orderId || record.maDonHang || record.id;
    const hide = message.loading('Đang tải chi tiết đơn hàng...', 0);
    try {
      const detail = await fetchOrderById(id);
      hide();
      setSelectedOrder(detail || record);
      setDetailOpen(true);
    } catch {
      hide();
      setSelectedOrder(record);
      setDetailOpen(true);
    }
  };

  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'orderId',
      key: 'orderId',
      render: (id, r) => <strong>{id || r.id}</strong>
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (d) => formatDate(d)
    },
    {
      title: 'Thanh toán',
      key: 'payment',
      render: (_, r) => formatPaymentMethod(r.paymentMethod || r.hinhThucThanhToan)
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount, r) => (
        <span style={{ color: '#008848', fontWeight: 700 }}>
          {formatVND(amount || r.tongTien)}
        </span>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (st) => <Tag color={getStatusColor(st)}>{ORDER_STATUS_LABELS[st] || st}</Tag>
    },
    {
      title: 'Chi tiết',
      key: 'action',
      render: (_, record) => (
        <Button
          size="small"
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetail(record)}
        >
          Xem
        </Button>
      )
    }
  ];

  return (
    <MainLayout>
      <div className={styles.ordersContainer}>
        <Card
          title="Lịch sử Đơn Hàng Của Bạn"
          extra={
            <Button icon={<ReloadOutlined />} onClick={refresh}>
              Làm mới
            </Button>
          }
        >
          <Table
            rowKey={(r) => r.orderId || r.id}
            dataSource={orders}
            columns={columns}
            loading={isLoading}
            pagination={{ pageSize: 10 }}
            locale={{ emptyText: <Empty description="Bạn chưa có đơn hàng nào." /> }}
          />
        </Card>

        {selectedOrder && (
          <OrderDetailModal
            open={detailOpen}
            order={selectedOrder}
            onCancel={() => setDetailOpen(false)}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default CustomerOrdersPage;
