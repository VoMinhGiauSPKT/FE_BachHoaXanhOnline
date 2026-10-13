import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, Table, Tag, Button, message, Empty, Space, Popconfirm } from 'antd';
import { EyeOutlined, ReloadOutlined, QrcodeOutlined, DollarOutlined } from '@ant-design/icons';
import MainLayout from '../../../layouts/MainLayout';
import { useOrderStore } from '../../../stores/useOrderStore';
import { formatVND } from '../../../utils/formatCurrency';
import { formatDate } from '../../../utils/formatDate';
import { formatPaymentMethod } from '../../../utils/formatPayment';
import { ORDER_STATUS_LABELS } from '../../../constants/enums';
import OrderDetailModal from './CustomerOrderDetailModal';
import styles from './Orders.module.scss';

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
    default:
      return 'default';
  }
};

export const CustomerOrdersPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { orders, isLoading, fetchOrders, fetchOrderById, createPayment, changePaymentMethod, refresh } = useOrderStore();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Bắt kết quả redirect từ cổng PayOS (sau khi thanh toán thành công hoặc huỷ giao dịch)
  useEffect(() => {
    const status = searchParams.get('status');
    const code = searchParams.get('code');
    const cancel = searchParams.get('cancel');

    if (status === 'PAID' || code === '00') {
      message.success('Thanh toán đơn hàng qua PayOS thành công!');
      fetchOrders();
      setSearchParams({}, { replace: true });
    } else if (cancel === 'true') {
      message.warning('Bạn đã huỷ giao dịch thanh toán PayOS.');
      fetchOrders();
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams, fetchOrders]);

  const handleViewDetail = async (record) => {
    const id = record.orderId || record.maDonHang || record.id;
    const hide = message.loading('Đang tải chi tiết...', 0);
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

  const handlePayAgain = async (record) => {
    const id = record.orderId || record.maDonHang || record.id;
    const hide = message.loading('Đang khởi tạo liên kết thanh toán PayOS...', 0);
    try {
      const res = await createPayment(id);
      hide();
      const payData = res?.data?.data || res?.data;
      const checkoutUrl = payData?.checkoutUrl || (typeof payData === 'string' ? payData : null);

      if (res.success && checkoutUrl) {
        message.loading('Đang chuyển hướng sang cổng thanh toán PayOS...', 1.5);
        window.location.href = checkoutUrl;
      } else {
        message.error(res.error || 'Không thể tạo liên kết thanh toán');
      }
    } catch {
      hide();
      message.error('Lỗi kết nối khi khởi tạo thanh toán');
    }
  };

  const handleChangePayment = async (record, newMethod) => {
    const id = record.orderId || record.maDonHang || record.id;
    const hide = message.loading('Đang cập nhật phương thức...', 0);
    try {
      const res = await changePaymentMethod(id, newMethod);
      hide();
      if (res.success) {
        message.success(`Đã đổi phương thức sang ${newMethod === 'COD' ? 'Tiền mặt (COD)' : 'Chuyển khoản VietQR'}`);
        await refresh();
        if (selectedOrder) {
          const updated = await fetchOrderById(id);
          setSelectedOrder(updated || null);
        }
        if (newMethod === 'VIETQR') {
          handlePayAgain(record);
        }
      } else {
        message.error(res.error || 'Không thể đổi phương thức thanh toán');
      }
    } catch {
      hide();
      message.error('Lỗi khi đổi phương thức thanh toán');
    }
  };

  const columns = [
    {
      title: 'Mã đơn hàng',
      key: 'orderId',
      render: (_, r) => <strong>{r.orderId || r.maDonHang || r.id}</strong>
    },
    {
      title: 'Ngày đặt',
      key: 'createdAt',
      render: (_, r) => formatDate(r.createdAt || r.ngayLap)
    },
    {
      title: 'Thanh toán',
      key: 'payment',
      render: (_, r) => formatPaymentMethod(r.paymentMethod || r.hinhThucThanhToan || r.phuongThucTT)
    },
    {
      title: 'Tổng tiền',
      key: 'totalAmount',
      render: (_, r) => (
        <span style={{ color: '#008848', fontWeight: 700 }}>
          {formatVND(r.totalAmount || r.tongTienSauGiamGia || r.tongTien)}
        </span>
      )
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (_, r) => {
        const s = r.status || r.trangThai;
        return <Tag color={getStatusColor(s)}>{ORDER_STATUS_LABELS[s] || s || 'Chưa rõ'}</Tag>;
      }
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, r) => {
        const st = String(r.status || r.trangThai || '').toUpperCase();
        const isPaid = ['DATHANHTOAN', 'COMPLETED', 'DA_GIAO'].includes(st);
        const isCancelled = ['DAHUY', 'CANCELLED', 'DA_HUY'].includes(st);
        const isUnpaid = !isPaid && !isCancelled;
        const method = String(r.paymentMethod || r.hinhThucThanhToan || r.phuongThucTT || 'COD').toUpperCase();

        return (
          <Space size="small">
            <Button size="small" icon={<EyeOutlined />} onClick={() => handleViewDetail(r)}>
              Chi tiết
            </Button>

            {isUnpaid && method === 'VIETQR' && (
              <Button
                size="small"
                type="primary"
                icon={<QrcodeOutlined />}
                style={{ backgroundColor: '#0284c7', borderColor: '#0284c7' }}
                onClick={() => handlePayAgain(r)}
              >
                Thanh toán
              </Button>
            )}

            {isUnpaid && (
              <Popconfirm
                title="Đổi phương thức thanh toán?"
                description={`Bạn muốn đổi sang ${method === 'VIETQR' ? 'Tiền mặt khi nhận hàng (COD)' : 'Chuyển khoản VietQR'}?`}
                onConfirm={() => handleChangePayment(r, method === 'VIETQR' ? 'COD' : 'VIETQR')}
                okText="Đổi"
                cancelText="Hủy"
              >
                <Button size="small" icon={method === 'VIETQR' ? <DollarOutlined /> : <QrcodeOutlined />}>
                  Đổi sang {method === 'VIETQR' ? 'COD' : 'VietQR'}
                </Button>
              </Popconfirm>
            )}
          </Space>
        );
      }
    }
  ];

  return (
    <MainLayout>
      <div className={styles.ordersContainer}>
        <Card
          title="Lịch sử Đơn Hàng Của Bạn"
          extra={<Button icon={<ReloadOutlined />} onClick={refresh}>Làm mới</Button>}
        >
          <Table
            rowKey={(r) => r.orderId || r.maDonHang || r.id}
            dataSource={orders || []}
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
            onPayAgain={handlePayAgain}
            onChangePaymentMethod={handleChangePayment}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default CustomerOrdersPage;
