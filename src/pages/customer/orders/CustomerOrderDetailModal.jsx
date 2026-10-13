import React, { useState } from 'react';
import { Modal, Descriptions, Table, Tag, Button, Space, Popconfirm } from 'antd';
import { StarOutlined, QrcodeOutlined, DollarOutlined } from '@ant-design/icons';
import { formatVND } from '../../../utils/formatCurrency';
import { formatDate } from '../../../utils/formatDate';
import { formatPaymentMethod } from '../../../utils/formatPayment';
import { ORDER_STATUS_LABELS } from '../../../constants/enums';
import CreateReviewModal from './CreateReviewModal';

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

export const CustomerOrderDetailModal = ({
  open,
  order,
  onCancel,
  onPayAgain,
  onChangePaymentMethod
}) => {
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewProduct, setReviewProduct] = useState(null);

  if (!order) return null;
  const items = order.items || order.orderDetails || order.chiTietDonHang || [];
  const st = String(order.status || order.trangThai || '').toUpperCase();
  const isPaid = ['DATHANHTOAN', 'COMPLETED', 'DA_GIAO'].includes(st);
  const isCancelled = ['DAHUY', 'CANCELLED', 'DA_HUY'].includes(st);
  const isUnpaid = !isPaid && !isCancelled;
  const method = String(order.paymentMethod || order.hinhThucThanhToan || order.phuongThucTT || 'COD').toUpperCase();

  const columns = [
    {
      title: 'Tên món',
      dataIndex: 'productName',
      key: 'productName',
      render: (name, r) => name || r.tenSanPham || 'Sản phẩm'
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 90,
      render: (q, r) => Math.floor(Number(q || r.soLuong || 1))
    },
    {
      title: 'Đơn giá',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      width: 120,
      render: (val, r) => formatVND(val || r.price || r.donGia)
    },
    {
      title: 'Thành tiền',
      key: 'subtotal',
      width: 130,
      render: (_, r) => {
        const p = r.unitPrice || r.price || r.donGia || 0;
        const q = r.quantity || r.soLuong || 1;
        const total = r.itemTotal !== undefined ? r.itemTotal : p * q;
        return <strong style={{ color: '#008848' }}>{formatVND(total)}</strong>;
      }
    },
    ...(isPaid
      ? [
        {
          title: 'Đánh giá',
          key: 'review',
          width: 110,
          align: 'center',
          render: (_, r) => (
            <Button
              size="small"
              type="primary"
              icon={<StarOutlined />}
              style={{ backgroundColor: '#faad14', borderColor: '#faad14' }}
              onClick={() => {
                setReviewProduct(r);
                setReviewModalOpen(true);
              }}
            >
              Đánh giá
            </Button>
          )
        }
      ]
      : [])
  ];

  return (
    <>
      <Modal
        title={`Chi tiết đơn hàng: ${order.orderId || order.maDonHang || order.id}`}
        open={open}
        onCancel={onCancel}
        width={720}
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button onClick={onCancel}>Đóng</Button>
            {isUnpaid && (
              <Space>
                {method === 'VIETQR' ? (
                  <>
                    <Popconfirm
                      title="Đổi phương thức thanh toán?"
                      description="Bạn muốn chuyển sang thanh toán tiền mặt khi nhận hàng (COD)?"
                      onConfirm={() => onChangePaymentMethod && onChangePaymentMethod(order, 'COD')}
                      okText="Đồng ý"
                      cancelText="Hủy"
                    >
                      <Button icon={<DollarOutlined />}>Đổi sang COD</Button>
                    </Popconfirm>
                    <Button
                      type="primary"
                      icon={<QrcodeOutlined />}
                      style={{ backgroundColor: '#0284c7', borderColor: '#0284c7' }}
                      onClick={() => onPayAgain && onPayAgain(order)}
                    >
                      Thanh toán VietQR lại
                    </Button>
                  </>
                ) : (
                  <Popconfirm
                    title="Đổi phương thức thanh toán?"
                    description="Bạn muốn chuyển sang thanh toán chuyển khoản VietQR?"
                    onConfirm={() => onChangePaymentMethod && onChangePaymentMethod(order, 'VIETQR')}
                    okText="Đồng ý"
                    cancelText="Hủy"
                  >
                    <Button type="primary" icon={<QrcodeOutlined />}>Đổi sang VietQR</Button>
                  </Popconfirm>
                )}
              </Space>
            )}
          </div>
        }
      >
        <Descriptions bordered size="small" column={1} style={{ marginBottom: 16 }}>
          <Descriptions.Item label="Người nhận">{order.receiverName || order.tenNguoiNhan || '—'}</Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">{order.phoneNumber || order.soDienThoaiNhan || '—'}</Descriptions.Item>
          <Descriptions.Item label="Địa chỉ">{order.shippingAddress || order.diaChiGiaoHang || '—'}</Descriptions.Item>
          <Descriptions.Item label="Ngày đặt">{formatDate(order.createdAt || order.ngayLap)}</Descriptions.Item>
          <Descriptions.Item label="Thanh toán">
            <Space>
              <span>{formatPaymentMethod(method)}</span>
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <Tag color={getStatusColor(st)}>{ORDER_STATUS_LABELS[st] || st || 'Chưa rõ'}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Tổng thanh toán">
            <strong style={{ color: '#008848', fontSize: 16 }}>
              {formatVND(order.totalAmount || order.tongTienSauGiamGia || order.tongTien)}
            </strong>
          </Descriptions.Item>
        </Descriptions>

        <Table
          rowKey={(r, i) => r.lineItemId || r.productId || r.id || i}
          dataSource={items}
          columns={columns}
          pagination={false}
          size="small"
        />
      </Modal>

      {reviewProduct && (
        <CreateReviewModal
          open={reviewModalOpen}
          product={reviewProduct}
          onCancel={() => {
            setReviewModalOpen(false);
            setReviewProduct(null);
          }}
        />
      )}
    </>
  );
};

export default CustomerOrderDetailModal;
