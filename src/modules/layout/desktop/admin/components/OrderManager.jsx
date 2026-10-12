import React, { useState } from 'react';
import {
  Table,
  Button,
  Tag,
  Space,
  Modal,
  Card,
  Descriptions,
  Divider,
  Popconfirm,
  Tooltip,
  Typography,
  Image,
  Input,
  Select
} from 'antd';
import {
  EyeOutlined,
  CheckCircleOutlined,
  ReloadOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { formatVND } from '../../../../../utils/formatCurrency';
import { formatDate } from '../../../../../utils/formatDate';
import { formatPaymentMethod } from '../../../../../utils/formatPayment';
import { ORDER_STATUS_LABELS } from '../../../../../constants/enums';

const { Text, Title } = Typography;

export const OrderManager = ({
  orders = [],
  isLoading = false,
  page = 1,
  limit = 20,
  total = 0,
  selectedOrderDetail = null,
  isDetailLoading = false,
  onPageChange,
  onViewOrderDetail,
  onCloseOrderDetail,
  onConfirmCod,
  onRefresh
}) => {
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrders = orders.filter((o) => {
    if (statusFilter && o.trangThai !== statusFilter) return false;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const codeMatch = o.maDonHang?.toLowerCase().includes(term);
      const nameMatch = o.tenNguoiNhan?.toLowerCase().includes(term);
      const phoneMatch = o.soDienThoaiNhan?.toLowerCase().includes(term);
      return codeMatch || nameMatch || phoneMatch;
    }
    return true;
  });

  const columns = [
    {
      title: 'Mã Đơn Hàng',
      dataIndex: 'maDonHang',
      key: 'maDonHang',
      width: 150,
      render: (code) => (
        <Tag color="purple" style={{ fontWeight: 600, fontSize: 13 }}>
          {code}
        </Tag>
      )
    },
    {
      title: 'Ngày Lập',
      dataIndex: 'ngayLap',
      key: 'ngayLap',
      width: 170,
      render: (date) => formatDate(date, true)
    },
    {
      title: 'Người Nhận',
      key: 'receiver',
      ellipsis: true,
      render: (_, r) => (
        <div>
          <Text strong>{r.tenNguoiNhan || 'Khách hàng'}</Text>
          <div style={{ fontSize: 12, color: '#64748b' }}>
            📞 {r.soDienThoaiNhan || 'N/A'}
          </div>
        </div>
      )
    },
    {
      title: 'Số món',
      dataIndex: 'soLuongMatHang',
      key: 'soLuongMatHang',
      width: 90,
      align: 'center',
      render: (count, r) => count ?? r.items?.length ?? 1
    },
    {
      title: 'Tổng Tiền',
      dataIndex: 'tongTien',
      key: 'tongTien',
      width: 140,
      align: 'right',
      render: (amount) => (
        <Text strong style={{ color: '#059669', fontSize: 14 }}>
          {formatVND(amount)}
        </Text>
      )
    },
    {
      title: 'Hình Thức TT',
      dataIndex: 'phuongThucTT',
      key: 'phuongThucTT',
      width: 150,
      align: 'center',
      render: (method) => {
        const text = formatPaymentMethod(method);
        const isQR = text.includes('VietQR') || text.includes('Chuyển khoản');
        return <Tag color={isQR ? 'blue' : 'gold'}>{text}</Tag>;
      }
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      width: 160,
      align: 'center',
      render: (st) => {
        const isPaid = st === 'DATHANHTOAN' || st === 'COMPLETED';
        const label = ORDER_STATUS_LABELS[st] || st;
        return (
          <Tag color={isPaid ? 'success' : 'warning'} style={{ fontWeight: 600 }}>
            {label}
          </Tag>
        );
      }
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 160,
      align: 'center',
      render: (_, record) => {
        const isUnpaid = record.trangThai === 'CHUATHANHTOAN' || record.trangThai === 'PENDING';
        return (
          <Space size="small">
            <Tooltip title="Xem chi tiết đơn hàng">
              <Button
                type="primary"
                ghost
                size="small"
                icon={<EyeOutlined />}
                onClick={() => onViewOrderDetail(record.maDonHang)}
              />
            </Tooltip>
            {isUnpaid && (
              <Popconfirm
                title="Xác nhận thu tiền COD?"
                description={`Xác nhận đã nhận đủ tiền COD cho đơn hàng ${record.maDonHang}?`}
                onConfirm={() => onConfirmCod(record.maDonHang)}
                okText="Đã thu tiền"
                cancelText="Hủy"
              >
                <Tooltip title="Xác nhận đã thu tiền COD">
                  <Button
                    type="primary"
                    size="small"
                    style={{ background: '#10b981' }}
                    icon={<CheckCircleOutlined />}
                  >
                    Thu COD
                  </Button>
                </Tooltip>
              </Popconfirm>
            )}
          </Space>
        );
      }
    }
  ];

  return (
    <Card
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 18, fontWeight: 700 }}>📑 Quản Lý Đơn Hàng & Thu Tiền COD</span>
          <Tag color="purple" style={{ fontSize: 13, padding: '2px 8px' }}>
            Tổng: {total} đơn hàng
          </Tag>
        </div>
      }
      extra={
        <Button icon={<ReloadOutlined />} onClick={onRefresh}>
          Làm mới
        </Button>
      }
      style={{ borderRadius: 12, boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}
    >
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
        <Input
          placeholder="Tìm theo mã đơn, tên hoặc SĐT..."
          prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          allowClear
          style={{ width: 300 }}
        />

        <Select
          placeholder="Lọc trạng thái"
          value={statusFilter}
          onChange={setStatusFilter}
          style={{ width: 180 }}
          options={[
            { value: '', label: 'Tất cả trạng thái' },
            { value: 'CHUATHANHTOAN', label: 'Chưa thanh toán' },
            { value: 'DATHANHTOAN', label: 'Đã thanh toán' }
          ]}
        />
      </div>

      <Table
        rowKey="maDonHang"
        columns={columns}
        dataSource={filteredOrders}
        loading={isLoading}
        bordered
        pagination={{
          current: page,
          pageSize: limit,
          total: total,
          showSizeChanger: true,
          pageSizeOptions: ['20', '50', '100'],
          showQuickJumper: true,
          showTotal: (totalCount, range) => (
            <span style={{ color: '#64748b' }}>
              Hiển thị <strong>{range[0]}-{range[1]}</strong> trên <strong>{totalCount}</strong> đơn hàng
            </span>
          ),
          onChange: (newPage, newPageSize) => {
            onPageChange(newPage, newPageSize);
          }
        }}
      />

      {/* Modal Xem Chi Tiết Đơn Hàng */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>📦 Chi Tiết Đơn Hàng</span>
            {selectedOrderDetail && (
              <Tag color="purple">{selectedOrderDetail.maDonHang}</Tag>
            )}
          </div>
        }
        open={Boolean(selectedOrderDetail)}
        onCancel={onCloseOrderDetail}
        footer={[
          selectedOrderDetail && (selectedOrderDetail.trangThai === 'CHUATHANHTOAN' || selectedOrderDetail.trangThai === 'PENDING') && (
            <Popconfirm
              key="confirmCod"
              title="Xác nhận thu tiền COD"
              description="Bạn chắc chắn đã giao hàng và nhận đủ tiền?"
              onConfirm={() => {
                onConfirmCod(selectedOrderDetail.maDonHang);
                onCloseOrderDetail();
              }}
              okText="Đã thu tiền"
              cancelText="Hủy"
            >
              <Button type="primary" style={{ background: '#10b981' }} icon={<CheckCircleOutlined />}>
                Xác nhận thu tiền COD
              </Button>
            </Popconfirm>
          ),
          <Button key="close" onClick={onCloseOrderDetail}>
            Đóng
          </Button>
        ]}
        width={780}
        destroyOnClose
      >
        {selectedOrderDetail && (
          <div style={{ marginTop: 12 }}>
            <Descriptions bordered size="small" column={{ xs: 1, sm: 2 }}>
              <Descriptions.Item label="Mã Đơn Hàng">
                <Text strong>{selectedOrderDetail.maDonHang}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Thời Gian Tạo">
                {formatDate(selectedOrderDetail.ngayLap, true)}
              </Descriptions.Item>
              <Descriptions.Item label="Người Nhận">
                {selectedOrderDetail.tenNguoiNhan}
              </Descriptions.Item>
              <Descriptions.Item label="Số Điện Thoại">
                {selectedOrderDetail.soDienThoaiNhan}
              </Descriptions.Item>
              <Descriptions.Item label="Địa Chỉ Giao" span={2}>
                {selectedOrderDetail.diaChiGiaoHang}
              </Descriptions.Item>
              <Descriptions.Item label="Hình Thức Thanh Toán">
                <Tag color="blue">{formatPaymentMethod(selectedOrderDetail.phuongThucTT)}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Trạng Thái Đơn">
                <Tag
                  color={
                    selectedOrderDetail.trangThai === 'DATHANHTOAN' || selectedOrderDetail.trangThai === 'COMPLETED'
                      ? 'success'
                      : 'warning'
                  }
                  style={{ fontWeight: 600 }}
                >
                  {ORDER_STATUS_LABELS[selectedOrderDetail.trangThai] || selectedOrderDetail.trangThai}
                </Tag>
              </Descriptions.Item>
            </Descriptions>

            <Divider orientation="left" style={{ margin: '16px 0 12px' }}>
              Danh sách sản phẩm trong đơn ({selectedOrderDetail.items?.length || 0} món)
            </Divider>

            <Table
              rowKey={(it) => it.lineItemId || it.productId}
              dataSource={selectedOrderDetail.items || []}
              pagination={false}
              size="small"
              bordered
              columns={[
                {
                  title: 'Ảnh',
                  dataIndex: 'imageUrl',
                  key: 'imageUrl',
                  width: 50,
                  render: (url, r) => (
                    <Image
                      src={url || r.icon}
                      width={36}
                      height={36}
                      style={{ objectFit: 'cover', borderRadius: 4 }}
                      fallback="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='36' height='36'><rect width='36' height='36' fill='%23f1f5f9'/></svg>"
                    />
                  )
                },
                {
                  title: 'Tên Sản Phẩm',
                  dataIndex: 'productName',
                  key: 'productName',
                  render: (name, r) => <Text strong>{name || r.name}</Text>
                },
                {
                  title: 'Đơn Vị',
                  dataIndex: 'unit',
                  key: 'unit',
                  width: 80,
                  align: 'center',
                  render: (u) => <Tag>{u || 'Phần'}</Tag>
                },
                {
                  title: 'Đơn Giá',
                  dataIndex: 'price',
                  key: 'price',
                  width: 110,
                  align: 'right',
                  render: (p) => formatVND(p)
                },
                {
                  title: 'SL',
                  dataIndex: 'quantity',
                  key: 'quantity',
                  width: 60,
                  align: 'center'
                },
                {
                  title: 'Thành Tiền',
                  dataIndex: 'itemTotal',
                  key: 'itemTotal',
                  width: 120,
                  align: 'right',
                  render: (t, r) => (
                    <Text strong style={{ color: '#059669' }}>
                      {formatVND(t ?? (r.price * r.quantity))}
                    </Text>
                  )
                }
              ]}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
              <div style={{ textAlign: 'right' }}>
                <Text style={{ fontSize: 14 }}>Tổng tiền cần thanh toán:</Text>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#059669' }}>
                  {formatVND(selectedOrderDetail.tongTien)}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </Card>
  );
};

export default OrderManager;
