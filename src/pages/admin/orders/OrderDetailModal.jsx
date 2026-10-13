import React from 'react';
import { Modal, Descriptions, Table, Tag, Divider } from 'antd';
import { formatVND } from '../../../utils/formatCurrency';
import { formatDate } from '../../../utils/formatDate';
import { formatPaymentMethod } from '../../../utils/formatPayment';
import { ORDER_STATUS_LABELS } from '../../../constants/enums';

export const OrderDetailModal = ({ open, order, onCancel }) => {
  if (!order) return null;

  const items = order.items || order.orderDetails || order.chiTietDonHang || [];

  const columns = [
    {
      title: 'Tên món',
      dataIndex: 'productName',
      key: 'productName',
      render: (name, r) => name || r.tenSanPham || 'Sản phẩm'
    },
    {
      title: 'Đơn giá',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      width: 120,
      render: (val, r) => formatVND(val || r.price || r.donGia)
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 90,
      render: (q, r) => q || r.soLuong || 1
    },
    {
      title: 'Thành tiền',
      key: 'subtotal',
      width: 140,
      render: (_, r) => {
        const p = r.unitPrice || r.price || r.donGia || 0;
        const q = r.quantity || r.soLuong || 1;
        return <strong style={{ color: '#008848' }}>{formatVND(p * q)}</strong>;
      }
    }
  ];

  return (
    <Modal
      title={`Chi tiết đơn hàng: ${order.orderId || order.id}`}
      open={open}
      onCancel={onCancel}
      footer={null}
      width={720}
    >
      <Descriptions bordered size="small" column={{ xs: 1, sm: 2 }}>
        <Descriptions.Item label="Người nhận">{order.receiverName || order.tenNguoiNhan}</Descriptions.Item>
        <Descriptions.Item label="Số điện thoại">{order.phoneNumber || order.soDienThoaiNhan}</Descriptions.Item>
        <Descriptions.Item label="Địa chỉ" span={2}>
          {order.shippingAddress || order.diaChiGiaoHang}
        </Descriptions.Item>
        <Descriptions.Item label="Ngày đặt">{formatDate(order.createdAt)}</Descriptions.Item>
        <Descriptions.Item label="Thanh toán">
          {formatPaymentMethod(order.paymentMethod || order.hinhThucThanhToan)}
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          <Tag color="blue">{ORDER_STATUS_LABELS[order.status] || order.status}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Tổng tiền">
          <strong style={{ color: '#008848', fontSize: 16 }}>
            {formatVND(order.totalAmount || order.tongTien)}
          </strong>
        </Descriptions.Item>
      </Descriptions>

      <Divider orientation="left" style={{ margin: '16px 0 12px' }}>
        Danh sách món hàng
      </Divider>

      <Table
        rowKey={(r, i) => r.productId || r.id || i}
        dataSource={items}
        columns={columns}
        pagination={false}
        size="small"
      />
    </Modal>
  );
};

export default OrderDetailModal;
