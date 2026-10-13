import React, { useEffect, useState } from 'react';
import { Card, message } from 'antd';
import { useOrderStore } from '../../../stores/useOrderStore';
import OrderFilterBar from './OrderFilterBar';
import OrderTable from './OrderTable';
import OrderDetailModal from './OrderDetailModal';

export const AdminOrdersPage = () => {
  const {
    orders,
    total,
    page,
    limit,
    isLoading,
    filters,
    fetchOrders,
    fetchOrderById,
    setFilters,
    setPage,
    confirmCod,
    cancelOrder,
    refresh
  } = useOrderStore();

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleViewDetail = async (order) => {
    const id = order.orderId || order.maDonHang || order.id;
    const hide = message.loading('Đang tải chi tiết đơn hàng...', 0);
    try {
      const detail = await fetchOrderById(id);
      hide();
      setSelectedOrder(detail || order);
      setDetailOpen(true);
    } catch {
      hide();
      setSelectedOrder(order);
      setDetailOpen(true);
    }
  };

  const handleConfirmCod = async (id) => {
    const res = await confirmCod(id);
    if (res.success) {
      message.success('Xác nhận thanh toán đơn hàng thành công!');
    } else {
      message.error(res.error || 'Thao tác thất bại');
    }
  };

  const handleCancelOrder = async (id) => {
    const res = await cancelOrder(id);
    if (res.success) {
      message.success('Đã hủy đơn hàng thành công!');
    } else {
      message.error(res.error || 'Hủy đơn thất bại');
    }
  };

  return (
    <Card title="Quản lý Hóa đơn & Đơn hàng" variant="borderless">
      <OrderFilterBar
        search={filters.keyword}
        statusFilter={filters.status}
        onSearchChange={(kw) => setFilters({ keyword: kw })}
        onStatusChange={(st) => setFilters({ status: st })}
        onReset={() => setFilters({ keyword: '', status: '' })}
        onRefresh={refresh}
      />

      <OrderTable
        orders={orders}
        isLoading={isLoading}
        page={page}
        limit={limit}
        total={total}
        onPageChange={(p) => setPage(p)}
        onViewDetail={handleViewDetail}
        onConfirmCod={handleConfirmCod}
        onCancelOrder={handleCancelOrder}
      />

      <OrderDetailModal
        open={detailOpen}
        order={selectedOrder}
        onCancel={() => setDetailOpen(false)}
      />
    </Card>
  );
};

export default AdminOrdersPage;
