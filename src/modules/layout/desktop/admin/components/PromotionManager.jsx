import React, { useState } from 'react';
import {
  Table,
  Button,
  Tag,
  Space,
  Modal,
  Card,
  Popconfirm,
  Tooltip,
  Typography,
  Input,
  Select,
  Form,
  InputNumber,
  DatePicker
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  SearchOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { formatVND } from '../../../../../utils/formatCurrency';
import { formatDate } from '../../../../../utils/formatDate';

const { Text } = Typography;
const { RangePicker } = DatePicker;

export const PromotionManager = ({
  promotions = [],
  isLoading = false,
  page = 1,
  limit = 20,
  total = 0,
  keyword = '',
  discountTypeFilter = '',
  onKeywordChange,
  onDiscountTypeFilterChange,
  onPageChange,
  onSavePromotion,
  onUpdatePromotion,
  onDeletePromotion,
  onRefresh
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form] = Form.useForm();
  const selectedType = Form.useWatch('discountType', form);

  const handleOpenAdd = () => {
    setEditingPromo(null);
    form.resetFields();
    form.setFieldsValue({
      discountType: 'TIENMAT',
      discountValue: 20000,
      minOrderAmount: 200000,
      maxDiscount: 20000,
      usageLimit: 100,
      dates: [dayjs(), dayjs().add(30, 'day')]
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (record) => {
    setEditingPromo(record);
    form.resetFields();
    let dType = record.discountType || 'TIENMAT';
    if (dType === 'FIXED') dType = 'TIENMAT';
    if (dType === 'PERCENT' || dType === 'PERCENTAGE') dType = 'PHANTRAM';

    form.setFieldsValue({
      promotionCode: record.promotionCode,
      promotionName: record.promotionName,
      description: record.description || '',
      discountType: dType,
      discountValue: record.discountValue || 0,
      minOrderAmount: record.minOrderAmount || 0,
      maxDiscount: record.maxDiscount || (dType === 'TIENMAT' ? record.discountValue : 0),
      usageLimit: record.remainingUsage ?? record.usageLimit ?? 100,
      dates: record.startDate && record.endDate ? [dayjs(record.startDate), dayjs(record.endDate)] : null
    });
    setIsModalOpen(true);
  };

  const handleModalSubmit = async () => {
    try {
      const values = await form.validateFields();
      setIsSubmitting(true);

      let dType = values.discountType || 'TIENMAT';
      if (dType === 'FIXED') dType = 'TIENMAT';
      if (dType === 'PERCENT' || dType === 'PERCENTAGE') dType = 'PHANTRAM';

      const payload = {
        promotionCode: editingPromo ? editingPromo.promotionCode : undefined,
        promotionName: values.promotionName?.trim(),
        description: values.description?.trim() || '',
        discountType: dType,
        discountValue: Number(values.discountValue || 0),
        minOrderAmount: Number(values.minOrderAmount || 0),
        maxDiscount: Number(values.maxDiscount || (dType === 'TIENMAT' ? values.discountValue : 0)),
        usageLimit: Number(values.usageLimit || 100),
        remainingUsage: Number(values.usageLimit || 100),
        startDate: values.dates ? values.dates[0].format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
        endDate: values.dates ? values.dates[1].format('YYYY-MM-DD') : dayjs().add(30, 'day').format('YYYY-MM-DD')
      };

      let res;
      if (editingPromo) {
        res = await onUpdatePromotion(editingPromo.promotionCode, payload);
      } else {
        res = await onSavePromotion(payload);
      }

      if (res?.success) {
        setIsModalOpen(false);
        form.resetFields();
      }
    } catch (err) {
      console.error('Validation error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    {
      title: 'Mã Voucher',
      dataIndex: 'promotionCode',
      key: 'promotionCode',
      width: 140,
      render: (code) => (
        <Tag color="magenta" style={{ fontWeight: 700, fontSize: 13, letterSpacing: 1 }}>
          {code}
        </Tag>
      )
    },
    {
      title: 'Tên Chương Trình',
      dataIndex: 'promotionName',
      key: 'promotionName',
      ellipsis: true,
      render: (name, r) => (
        <div>
          <Text strong style={{ fontSize: 14 }}>{name}</Text>
          {r.description && (
            <div style={{ fontSize: 12, color: '#8c8c8c' }}>{r.description}</div>
          )}
        </div>
      )
    },
    {
      title: 'Loại Giảm',
      dataIndex: 'discountType',
      key: 'discountType',
      width: 140,
      align: 'center',
      render: (type) => {
        const isPercent = type === 'PHANTRAM' || type === 'PERCENT';
        return <Tag color={isPercent ? 'volcano' : 'green'}>{isPercent ? 'Phần trăm (%)' : 'Tiền mặt (VND)'}</Tag>;
      }
    },
    {
      title: 'Mức Giảm',
      key: 'discountVal',
      width: 140,
      align: 'right',
      render: (_, r) => {
        const isPercent = r.discountType === 'PHANTRAM' || r.discountType === 'PERCENT';
        return (
          <Text strong style={{ color: '#059669', fontSize: 14 }}>
            {isPercent ? `${r.discountValue}%` : formatVND(r.discountValue)}
          </Text>
        );
      }
    },
    {
      title: 'Đơn Tối Thiểu',
      dataIndex: 'minOrderAmount',
      key: 'minOrderAmount',
      width: 130,
      align: 'right',
      render: (amount) => formatVND(amount || 0)
    },
    {
      title: 'Lượt Dùng',
      dataIndex: 'remainingUsage',
      key: 'remainingUsage',
      width: 100,
      align: 'center',
      render: (qty) => (
        <Tag color={qty > 0 ? 'blue' : 'default'} style={{ fontWeight: 600 }}>
          {qty ?? 'Không giới hạn'}
        </Tag>
      )
    },
    {
      title: 'Thời Gian Áp Dụng',
      key: 'dates',
      width: 190,
      render: (_, r) => (
        <span style={{ fontSize: 12 }}>
          {formatDate(r.startDate)} - {formatDate(r.endDate)}
        </span>
      )
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      align: 'center',
      render: (st, r) => {
        const now = dayjs();
        const end = r.endDate ? dayjs(r.endDate) : null;
        const isExpired = end && end.isBefore(now, 'day');
        if (isExpired || st === 'EXPIRED') return <Tag color="error">Hết hạn</Tag>;
        if (r.remainingUsage <= 0) return <Tag color="warning">Hết lượt</Tag>;
        return <Tag color="success">Đang diễn ra</Tag>;
      }
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Chỉnh sửa voucher">
            <Button
              type="primary"
              ghost
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleOpenEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Xóa khuyến mãi"
            description={`Bạn có chắc muốn xóa voucher "${record.promotionCode}"?`}
            onConfirm={() => onDeletePromotion(record.promotionCode)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Xóa voucher">
              <Button danger size="small" icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <Card
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 18, fontWeight: 700 }}>🎁 Quản Lý Mã Khuyến Mãi & Voucher</span>
          <Tag color="magenta" style={{ fontSize: 13, padding: '2px 8px' }}>
            Tổng: {total} mã
          </Tag>
        </div>
      }
      extra={
        <Space wrap>
          <Button icon={<ReloadOutlined />} onClick={onRefresh}>
            Làm mới
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenAdd} style={{ background: '#10b981' }}>
            Tạo mã khuyến mãi mới
          </Button>
        </Space>
      }
      style={{ borderRadius: 12, boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}
    >
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
        <Input
          placeholder="Tìm theo mã voucher hoặc tên khuyến mãi..."
          prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          allowClear
          style={{ width: 320 }}
        />

        <Select
          placeholder="Loại giảm giá"
          value={discountTypeFilter}
          onChange={onDiscountTypeFilterChange}
          style={{ width: 180 }}
          options={[
            { value: '', label: 'Tất cả loại giảm' },
            { value: 'TIENMAT', label: 'Tiền mặt (VND)' },
            { value: 'PHANTRAM', label: 'Phần trăm (%)' }
          ]}
        />
      </div>

      <Table
        rowKey="promotionCode"
        columns={columns}
        dataSource={promotions}
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
              Hiển thị <strong>{range[0]}-{range[1]}</strong> trên <strong>{totalCount}</strong> voucher
            </span>
          ),
          onChange: (newPage, newPageSize) => {
            onPageChange(newPage, newPageSize);
          }
        }}
      />

      {/* Modal Thêm / Sửa Voucher */}
      <Modal
        title={editingPromo ? `✏️ Chỉnh Sửa Voucher [${editingPromo.promotionCode}]` : '✨ Tạo Mã Khuyến Mãi Mới'}
        open={isModalOpen}
        onOk={handleModalSubmit}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={isSubmitting}
        okText={editingPromo ? 'Lưu cập nhật' : 'Tạo voucher'}
        cancelText="Đóng"
        width={680}
        destroyOnClose
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          {editingPromo ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16 }}>
              <Form.Item name="promotionCode" label="Mã Voucher">
                <Input disabled />
              </Form.Item>
              <Form.Item
                name="promotionName"
                label="Tên chương trình khuyến mãi"
                rules={[{ required: true, message: 'Nhập tên chương trình' }]}
              >
                <Input placeholder="Giảm 20.000đ cho đơn hàng từ 200k" />
              </Form.Item>
            </div>
          ) : (
            <Form.Item
              name="promotionName"
              label="Tên chương trình khuyến mãi"
              rules={[{ required: true, message: 'Nhập tên chương trình' }]}
            >
              <Input placeholder="Giảm 20.000đ cho đơn hàng từ 200k" />
            </Form.Item>
          )}

          <Form.Item name="description" label="Mô tả chi tiết">
            <Input.TextArea rows={2} placeholder="Áp dụng cho toàn bộ khách hàng đặt hàng trực tuyến" />
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item
              name="discountType"
              label="Hình thức giảm giá"
              rules={[{ required: true, message: 'Vui lòng chọn hình thức giảm giá' }]}
            >
              <Select
                options={[
                  { value: 'TIENMAT', label: 'Tiền mặt trực tiếp (VND)' },
                  { value: 'PHANTRAM', label: 'Tỷ lệ phần trăm (%)' }
                ]}
              />
            </Form.Item>

            <Form.Item
              name="discountValue"
              label={selectedType === 'PHANTRAM' ? 'Tỷ lệ giảm (%)' : 'Số tiền giảm (VND)'}
              dependencies={['discountType', 'minOrderAmount']}
              rules={[
                { required: true, message: 'Nhập mức giảm' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (value === undefined || value === null) return Promise.resolve();
                    const type = getFieldValue('discountType');
                    if (type === 'PHANTRAM') {
                      if (value < 1 || value > 100) {
                        return Promise.reject(new Error('Tỷ lệ giảm phần trăm phải từ 1% đến 100%!'));
                      }
                    } else {
                      const minOrder = getFieldValue('minOrderAmount') || 0;
                      if (minOrder > 0 && value > minOrder) {
                        return Promise.reject(new Error('Số tiền giảm không được lớn hơn Đơn hàng tối thiểu!'));
                      }
                    }
                    return Promise.resolve();
                  }
                })
              ]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={1}
                max={selectedType === 'PHANTRAM' ? 100 : 10000000}
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <Form.Item
              name="minOrderAmount"
              label="Đơn tối thiểu (VND)"
              dependencies={['discountType', 'discountValue']}
              rules={[
                { required: true, message: 'Nhập đơn tối thiểu' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (value === undefined || value === null) return Promise.resolve();
                    const type = getFieldValue('discountType');
                    const discountVal = getFieldValue('discountValue') || 0;
                    if (type === 'TIENMAT' && discountVal > 0 && value < discountVal) {
                      return Promise.reject(new Error('Đơn tối thiểu phải lớn hơn hoặc bằng mức giảm!'));
                    }
                    return Promise.resolve();
                  }
                })
              ]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                step={10000}
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>

            <Form.Item
              name="maxDiscount"
              label="Giảm tối đa (VND)"
              rules={[
                { required: true, message: 'Nhập giảm tối đa' },
                { type: 'number', min: 0, message: 'Không được âm' }
              ]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                step={5000}
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>

            <Form.Item
              name="usageLimit"
              label="Số lượt dùng"
              rules={[
                { required: true, message: 'Nhập số lượt' },
                { type: 'number', min: 1, message: 'Số lượt phải lớn hơn 0' }
              ]}
            >
              <InputNumber style={{ width: '100%' }} min={1} />
            </Form.Item>
          </div>

          <Form.Item
            name="dates"
            label="Thời gian áp dụng (Bắt đầu - Kết thúc)"
            rules={[{ required: true, message: 'Chọn thời gian áp dụng' }]}
          >
            <RangePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default PromotionManager;
