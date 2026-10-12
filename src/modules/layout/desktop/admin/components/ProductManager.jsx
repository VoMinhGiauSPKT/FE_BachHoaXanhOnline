import React, { useState } from 'react';
import {
  Table,
  Button,
  Input,
  Select,
  Space,
  Tag,
  Image,
  Modal,
  Form,
  InputNumber,
  DatePicker,
  Popconfirm,
  Card,
  Tooltip,
  Typography
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { formatVND } from '../../../../../utils/formatCurrency';
import { formatDate } from '../../../../../utils/formatDate';
import { PRODUCT_UNIT_OPTIONS, PRODUCT_UNITS } from '../../../../../constants/enums';

const { Text } = Typography;

const SUPPLIERS = [
  { value: 'NCC02', label: 'Công ty C.P Việt Nam (NCC02)' },
  { value: 'NCC020', label: 'Công ty Cổ phần Sữa Vinamilk (NCC020)' }
];

export const ProductManager = ({
  products = [],
  categories = [],
  isLoading = false,
  page = 1,
  limit = 20,
  total = 0,
  search = '',
  categoryFilter = '',
  inStockFilter = '',
  onSearchChange,
  onCategoryFilterChange,
  onInStockFilterChange,
  onPageChange,
  onSaveProduct,
  onDeleteProduct,
  onRefresh
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form] = Form.useForm();

  const handleOpenAdd = () => {
    setEditingProduct(null);
    form.resetFields();
    form.setFieldsValue({
      categoryId: categories[0]?.categoryId || 'DM01',
      supplierId: 'NCC02',
      unit: PRODUCT_UNITS.KG,
      stock: 50,
      vat: 0.08,
      sellingPrice: 50000,
      importPrice: 40000
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (record) => {
    setEditingProduct(record);
    form.resetFields();
    form.setFieldsValue({
      productId: record.productId || record.id,
      productName: record.productName || record.name,
      categoryId: record.category?.categoryId || record.categoryId || categories[0]?.categoryId || 'DM01',
      supplierId: record.supplierId || 'NCC02',
      sellingPrice: record.price || record.sellingPrice || 0,
      importPrice: record.importPrice || Math.round((record.price || 0) * 0.8),
      vat: record.vat ?? 0.08,
      unit: record.unit || PRODUCT_UNITS.KG,
      stock: record.stock ?? record.quantity ?? 0,
      imageUrl: record.imageUrl || '',
      expiryDate: record.expiryDate ? dayjs(record.expiryDate) : null
    });
    setIsModalOpen(true);
  };

  const handleModalSubmit = async () => {
    try {
      const values = await form.validateFields();
      setIsSubmitting(true);
      const payload = {
        ...values,
        productId: editingProduct ? (editingProduct.productId || editingProduct.id) : undefined,
        expiryDate: values.expiryDate ? values.expiryDate.format('YYYY-MM-DD') : null,
        stock: Number(values.stock || 0),
        quantity: Number(values.stock || 0),
        sellingPrice: Number(values.sellingPrice || 0),
        price: Number(values.sellingPrice || 0),
        importPrice: Number(values.importPrice || 0),
        vat: Number(values.vat || 0.08)
      };

      const res = await onSaveProduct(payload, editingProduct ? (editingProduct.productId || editingProduct.id) : null);
      if (res?.success) {
        setIsModalOpen(false);
        form.resetFields();
      }
    } catch (err) {
      console.error('Validation or submit error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    {
      title: 'Mã SP',
      dataIndex: 'productId',
      key: 'productId',
      width: 100,
      render: (id, record) => (
        <Tag color="cyan" style={{ fontWeight: 600 }}>
          {id || record.id || 'N/A'}
        </Tag>
      )
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      width: 80,
      align: 'center',
      render: (url, record) => (
        <Image
          src={url || record.icon}
          alt={record.productName}
          width={50}
          height={50}
          style={{ objectFit: 'cover', borderRadius: 8, border: '1px solid #f0f0f0' }}
          fallback="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='50' height='50'><rect width='50' height='50' fill='%23f1f5f9'/><text x='50%' y='50%' font-size='11' text-anchor='middle' fill='%2394a3b8' dy='.3em'>BHX</text></svg>"
        />
      )
    },
    {
      title: 'Tên Sản Phẩm',
      dataIndex: 'productName',
      key: 'productName',
      ellipsis: true,
      render: (name, record) => (
        <div>
          <Text strong style={{ fontSize: 14 }}>{name || record.name}</Text>
          {record.expiryDate && (
            <div style={{ fontSize: 12, color: '#8c8c8c' }}>
              HSD: {formatDate(record.expiryDate)}
            </div>
          )}
        </div>
      )
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      width: 160,
      render: (cat, record) => {
        const catName = cat?.categoryName ||
          categories.find(c => c.categoryId === record.categoryId)?.categoryName ||
          'Chưa phân loại';
        return <Tag color="blue">{catName}</Tag>;
      }
    },
    {
      title: 'Giá bán',
      dataIndex: 'price',
      key: 'price',
      width: 130,
      align: 'right',
      render: (price, record) => (
        <Text strong style={{ color: '#059669', fontSize: 14 }}>
          {formatVND(price || record.sellingPrice || 0)}
        </Text>
      )
    },
    {
      title: 'Đơn vị',
      dataIndex: 'unit',
      key: 'unit',
      width: 90,
      align: 'center',
      render: (unit) => <Tag color="geekblue">{unit || 'KG'}</Tag>
    },
    {
      title: 'Tồn kho',
      dataIndex: 'stock',
      key: 'stock',
      width: 110,
      align: 'center',
      render: (stock, record) => {
        const qty = stock ?? record.quantity ?? 0;
        return qty > 0 ? (
          <Tag color="success" style={{ fontWeight: 600 }}>{qty} {record.unit || ''}</Tag>
        ) : (
          <Tag color="error">Hết hàng</Tag>
        );
      }
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 120,
      align: 'center',
      render: (_, record) => {
        const pId = record.productId || record.id;
        const pName = record.productName || record.name;
        return (
          <Space size="small">
            <Tooltip title="Chỉnh sửa sản phẩm">
              <Button
                type="primary"
                ghost
                size="small"
                icon={<EditOutlined />}
                onClick={() => handleOpenEdit(record)}
              />
            </Tooltip>
            <Popconfirm
              title="Xóa sản phẩm"
              description={`Bạn có chắc muốn xóa "${pName}" (${pId})?`}
              onConfirm={() => onDeleteProduct(pId, pName)}
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
            >
              <Tooltip title="Xóa sản phẩm">
                <Button
                  danger
                  size="small"
                  icon={<DeleteOutlined />}
                />
              </Tooltip>
            </Popconfirm>
          </Space>
        );
      }
    }
  ];

  return (
    <Card
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 18, fontWeight: 700 }}>📦 Quản Lý Kho & Sản Phẩm</span>
          <Tag color="green" style={{ fontSize: 13, padding: '2px 8px' }}>
            Tổng: {total} sản phẩm
          </Tag>
        </div>
      }
      extra={
        <Space wrap>
          <Button icon={<ReloadOutlined />} onClick={onRefresh}>
            Làm mới
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenAdd} style={{ background: '#10b981' }}>
            Thêm sản phẩm mới
          </Button>
        </Space>
      }
      style={{ borderRadius: 12, boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}
    >
      {/* Thanh lọc & tìm kiếm */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
        <Input
          placeholder="Tìm tên sản phẩm theo từ khóa..."
          prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          allowClear
          style={{ width: 280 }}
        />

        <Select
          placeholder="Lọc theo Danh mục"
          value={categoryFilter || undefined}
          onChange={onCategoryFilterChange}
          allowClear
          style={{ width: 200 }}
          options={[
            { value: '', label: 'Tất cả danh mục' },
            ...categories.map(c => ({ value: c.categoryId, label: c.categoryName }))
          ]}
        />

        <Select
          placeholder="Trạng thái tồn kho"
          value={inStockFilter}
          onChange={onInStockFilterChange}
          style={{ width: 170 }}
          options={[
            { value: '', label: 'Tất cả tồn kho' },
            { value: 'true', label: 'Còn hàng (>0)' },
            { value: 'false', label: 'Đã hết hàng' }
          ]}
        />
      </div>

      {/* Bảng dữ liệu có phân trang chuẩn (Page & Limit) */}
      <Table
        rowKey={(r) => r.productId || r.id}
        columns={columns}
        dataSource={products}
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
              Hiển thị <strong>{range[0]}-{range[1]}</strong> trên tổng số <strong>{totalCount}</strong> sản phẩm
            </span>
          ),
          onChange: (newPage, newPageSize) => {
            onPageChange(newPage, newPageSize);
          }
        }}
      />

      {/* Modal Thêm / Chỉnh Sửa Sản Phẩm */}
      <Modal
        title={editingProduct ? `✏️ Chỉnh Sửa Sản Phẩm [${editingProduct.productId || editingProduct.id}]` : '✨ Thêm Sản Phẩm Mới'}
        open={isModalOpen}
        onOk={handleModalSubmit}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={isSubmitting}
        okText={editingProduct ? 'Lưu thay đổi' : 'Tạo sản phẩm'}
        cancelText="Đóng"
        width={720}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          style={{ marginTop: 16 }}
        >
          {editingProduct ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16 }}>
              <Form.Item name="productId" label="Mã sản phẩm">
                <Input disabled />
              </Form.Item>
              <Form.Item
                name="productName"
                label="Tên sản phẩm"
                rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
              >
                <Input placeholder="Ví dụ: Táo Envy Mỹ nhập khẩu túi 1kg" />
              </Form.Item>
            </div>
          ) : (
            <Form.Item
              name="productName"
              label="Tên sản phẩm"
              rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
            >
              <Input placeholder="Ví dụ: Táo Envy Mỹ nhập khẩu túi 1kg" />
            </Form.Item>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item
              name="categoryId"
              label="Danh mục sản phẩm"
              rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
            >
              <Select
                options={categories.map(c => ({ value: c.categoryId, label: `${c.categoryName} (${c.categoryId})` }))}
                placeholder="Chọn danh mục"
              />
            </Form.Item>

            <Form.Item
              name="supplierId"
              label="Nhà cung cấp"
              rules={[{ required: true, message: 'Vui lòng chọn nhà cung cấp' }]}
            >
              <Select options={SUPPLIERS} placeholder="Chọn nhà cung cấp" />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <Form.Item
              name="sellingPrice"
              label="Giá bán (VND)"
              rules={[{ required: true, message: 'Nhập giá bán' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={1000}
                step={1000}
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>

            <Form.Item
              name="importPrice"
              label="Giá nhập (VND)"
              rules={[{ required: true, message: 'Nhập giá nhập' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                step={1000}
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>

            <Form.Item
              name="vat"
              label="Thuế VAT"
              rules={[{ required: true, message: 'Nhập thuế VAT' }]}
            >
              <Select
                options={[
                  { value: 0.05, label: '5%' },
                  { value: 0.08, label: '8% (Tiêu chuẩn)' },
                  { value: 0.1, label: '10%' }
                ]}
              />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <Form.Item
              name="unit"
              label="Đơn vị tính"
              rules={[{ required: true, message: 'Chọn đơn vị tính' }]}
            >
              <Select options={PRODUCT_UNIT_OPTIONS} />
            </Form.Item>

            <Form.Item
              name="stock"
              label="Số lượng tồn kho"
              rules={[{ required: true, message: 'Nhập số lượng kho' }]}
            >
              <InputNumber style={{ width: '100%' }} min={0} />
            </Form.Item>

            <Form.Item
              name="expiryDate"
              label="Hạn sử dụng (HSD)"
            >
              <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" placeholder="Chọn ngày" />
            </Form.Item>
          </div>

          <Form.Item
            name="imageUrl"
            label="Hình ảnh sản phẩm (URL hoặc chuỗi Base64)"
            rules={[{ required: true, message: 'Vui lòng nhập link ảnh hoặc dán chuỗi Base64' }]}
          >
            <Input.TextArea
              rows={2}
              placeholder="Nhập link ảnh (https://...) hoặc dán chuỗi Base64 (data:image/...)"
            />
          </Form.Item>

          <Form.Item noStyle shouldUpdate={(prev, curr) => prev.imageUrl !== curr.imageUrl}>
            {({ getFieldValue }) => {
              const imgUrl = getFieldValue('imageUrl');
              return imgUrl ? (
                <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 13, color: '#64748b' }}>Xem trước ảnh:</span>
                  <Image
                    src={imgUrl}
                    alt="Preview"
                    width={60}
                    height={60}
                    style={{ objectFit: 'cover', borderRadius: 8, border: '1px solid #e2e8f0' }}
                    fallback="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='60' height='60'><rect width='60' height='60' fill='%23f1f5f9'/><text x='50%' y='50%' font-size='10' text-anchor='middle' fill='%23ef4444' dy='.3em'>Ảnh lỗi</text></svg>"
                  />
                </div>
              ) : null;
            }}
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default ProductManager;
