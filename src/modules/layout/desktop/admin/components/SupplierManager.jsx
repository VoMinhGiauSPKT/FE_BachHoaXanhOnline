import React, { useState } from 'react';
import {
  Table,
  Button,
  Input,
  Select,
  Space,
  Tag,
  Modal,
  Form,
  Popconfirm,
  Card,
  Tooltip,
  Typography,
  Spin,
  Switch
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  PhoneOutlined,
  MailOutlined,
  CheckCircleOutlined,
  StopOutlined
} from '@ant-design/icons';
import supplierService from '../../../../../services/supplierService';

const { Text } = Typography;

export const SupplierManager = ({
  suppliers = [],
  isLoading = false,
  isAdmin = false,
  onSaveSupplier,
  onDeleteSupplier,
  onRefresh
}) => {
  const [tempSearch, setTempSearch] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const handleSearchClick = () => {
    setAppliedSearch(tempSearch.trim());
  };

  const handleResetClick = () => {
    setTempSearch('');
    setAppliedSearch('');
    setStatusFilter('');
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetchingDetail, setIsFetchingDetail] = useState(false);
  const [form] = Form.useForm();

  const handleOpenAdd = () => {
    setEditingSupplier(null);
    form.resetFields();
    form.setFieldsValue({
      active: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = async (record) => {
    setEditingSupplier(record);
    setIsModalOpen(true);
    setIsFetchingDetail(true);
    form.resetFields();
    form.setFieldsValue({
      supplierId: record.supplierId || record.maNhaCungCap,
      supplierName: record.supplierName || record.tenNhaCungCap,
      email: record.email || '',
      phoneNumber: record.phoneNumber || record.soDienThoai || '',
      active: record.active !== undefined ? record.active : (record.dangHopTac !== undefined ? record.dangHopTac : true)
    });

    try {
      const res = await supplierService.getSupplierById(record.supplierId || record.maNhaCungCap);
      const detail = res?.data || record;
      form.setFieldsValue({
        supplierId: detail.supplierId || detail.maNhaCungCap || record.supplierId,
        supplierName: detail.supplierName || detail.tenNhaCungCap || record.supplierName,
        email: detail.email || '',
        phoneNumber: detail.phoneNumber || detail.soDienThoai || '',
        active: detail.active !== undefined ? detail.active : (detail.dangHopTac !== undefined ? detail.dangHopTac : true)
      });
    } catch (err) {
      console.error('Lỗi khi lấy chi tiết nhà cung cấp:', err);
    } finally {
      setIsFetchingDetail(false);
    }
  };

  const handleModalSubmit = async () => {
    try {
      const values = await form.validateFields();
      setIsSubmitting(true);
      const payload = {
        supplierId: editingSupplier ? (editingSupplier.supplierId || editingSupplier.maNhaCungCap) : (values.supplierId ? values.supplierId.trim() : undefined),
        supplierName: values.supplierName.trim(),
        email: values.email ? values.email.trim() : '',
        phoneNumber: values.phoneNumber ? values.phoneNumber.trim() : '',
        active: Boolean(values.active)
      };

      const res = await onSaveSupplier(payload, editingSupplier ? (editingSupplier.supplierId || editingSupplier.maNhaCungCap) : null);
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

  const filteredSuppliers = suppliers.filter((s) => {
    const sId = (s.supplierId || s.maNhaCungCap || '').toLowerCase();
    const sName = (s.supplierName || s.tenNhaCungCap || '').toLowerCase();
    const sEmail = (s.email || '').toLowerCase();
    const sPhone = (s.phoneNumber || s.soDienThoai || '').toLowerCase();
    const sActive = s.active !== undefined ? s.active : (s.dangHopTac !== undefined ? s.dangHopTac : true);

    if (statusFilter !== '') {
      const wantActive = statusFilter === 'true';
      if (sActive !== wantActive) return false;
    }

    if (!appliedSearch) return true;
    const term = appliedSearch.toLowerCase();
    return sId.includes(term) || sName.includes(term) || sEmail.includes(term) || sPhone.includes(term);
  });

  const columns = [
    {
      title: 'Mã NCC',
      dataIndex: 'supplierId',
      key: 'supplierId',
      width: 110,
      render: (id, record) => (
        <Tag color="cyan" style={{ fontWeight: 600, fontSize: 13 }}>
          {id || record.maNhaCungCap}
        </Tag>
      )
    },
    {
      title: 'Tên Nhà Cung Cấp',
      dataIndex: 'supplierName',
      key: 'supplierName',
      render: (name, record) => (
        <Text strong style={{ fontSize: 14 }}>
          {name || record.tenNhaCungCap}
        </Text>
      )
    },
    {
      title: 'Email Liên Hệ',
      dataIndex: 'email',
      key: 'email',
      width: 200,
      render: (email) =>
        email ? (
          <Space>
            <MailOutlined style={{ color: '#10b981' }} />
            <span>{email}</span>
          </Space>
        ) : (
          <Text type="secondary">Chưa cập nhật</Text>
        )
    },
    {
      title: 'Số Điện Thoại',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      width: 160,
      render: (phone, record) => {
        const p = phone || record.soDienThoai;
        return p ? (
          <Space>
            <PhoneOutlined style={{ color: '#0284c7' }} />
            <span>{p}</span>
          </Space>
        ) : (
          <Text type="secondary">Chưa cập nhật</Text>
        );
      }
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'active',
      key: 'active',
      width: 150,
      align: 'center',
      render: (active, record) => {
        const isAct = active !== undefined ? active : (record.dangHopTac !== undefined ? record.dangHopTac : true);
        return isAct ? (
          <Tag color="success" icon={<CheckCircleOutlined />} style={{ fontWeight: 600, padding: '2px 8px' }}>
            Đang hợp tác
          </Tag>
        ) : (
          <Tag color="default" icon={<StopOutlined />} style={{ fontWeight: 600, padding: '2px 8px' }}>
            Ngừng hợp tác
          </Tag>
        );
      }
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 120,
      align: 'center',
      render: (_, record) => {
        const sId = record.supplierId || record.maNhaCungCap;
        const sName = record.supplierName || record.tenNhaCungCap;
        return (
          <Space size="small">
            <Tooltip title="Chỉnh sửa nhà cung cấp">
              <Button
                type="primary"
                ghost
                size="small"
                icon={<EditOutlined />}
                onClick={() => handleOpenEdit(record)}
              />
            </Tooltip>
            {isAdmin && (
              <Popconfirm
                title="Xóa nhà cung cấp"
                description={`Bạn có chắc muốn xóa "${sName}" (${sId})?`}
                onConfirm={() => onDeleteSupplier(sId, sName)}
                okText="Xóa"
                cancelText="Hủy"
                okButtonProps={{ danger: true }}
              >
                <Tooltip title="Xóa nhà cung cấp">
                  <Button danger size="small" icon={<DeleteOutlined />} />
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
          <span style={{ fontSize: 18, fontWeight: 700 }}>🏭 Quản Lý Nhà Cung Cấp</span>
          <Tag color="green" style={{ fontSize: 13, padding: '2px 8px' }}>
            Tổng: {suppliers.length} nhà cung cấp
          </Tag>
        </div>
      }
      extra={
        <Space wrap>
          <Button icon={<ReloadOutlined />} onClick={onRefresh}>
            Làm mới
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleOpenAdd}
            style={{ background: '#10b981', borderColor: '#10b981', fontWeight: 600 }}
          >
            Thêm Nhà Cung Cấp
          </Button>
        </Space>
      }
    >
      {/* Bộ lọc & Tìm kiếm */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', marginBottom: 20 }}>
        <Input
          placeholder="Tìm theo mã, tên, email, SĐT nhà cung cấp..."
          prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
          value={tempSearch}
          onChange={(e) => setTempSearch(e.target.value)}
          onPressEnter={handleSearchClick}
          allowClear
          style={{ width: 340 }}
        />

        <Select
          placeholder="Lọc trạng thái hợp tác"
          value={statusFilter !== '' ? statusFilter : undefined}
          onChange={(val) => setStatusFilter(val !== undefined ? val : '')}
          allowClear
          style={{ width: 190 }}
          options={[
            { value: '', label: 'Tất cả trạng thái' },
            { value: 'true', label: 'Đang hợp tác' },
            { value: 'false', label: 'Ngừng hợp tác' }
          ]}
        />

        <Button
          type="primary"
          icon={<SearchOutlined />}
          onClick={handleSearchClick}
          style={{ background: '#10b981', borderColor: '#10b981', fontWeight: 600 }}
        >
          Tìm kiếm
        </Button>

        <Button icon={<ReloadOutlined />} onClick={handleResetClick}>
          Đặt lại
        </Button>
      </div>

      {/* Bảng danh sách nhà cung cấp */}
      <Table
        rowKey={(r) => r.supplierId || r.maNhaCungCap}
        columns={columns}
        dataSource={filteredSuppliers}
        loading={isLoading}
        bordered
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50'],
          showTotal: (total, range) => (
            <span style={{ color: '#64748b' }}>
              Hiển thị <strong>{range[0]}-{range[1]}</strong> trên tổng số <strong>{total}</strong> nhà cung cấp
            </span>
          )
        }}
      />

      {/* Modal Thêm / Sửa Nhà Cung Cấp */}
      <Modal
        title={
          editingSupplier
            ? `✏️ Chỉnh Sửa Nhà Cung Cấp [${editingSupplier.supplierId || editingSupplier.maNhaCungCap}]`
            : '✨ Thêm Nhà Cung Cấp Mới'
        }
        open={isModalOpen}
        onOk={handleModalSubmit}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={isSubmitting}
        okText={editingSupplier ? 'Lưu thay đổi' : 'Tạo mới'}
        cancelText="Đóng"
        width={560}
        destroyOnClose
      >
        <Spin spinning={isFetchingDetail} tip="Đang tải dữ liệu...">
          <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
            {editingSupplier ? (
              <Form.Item name="supplierId" label="Mã nhà cung cấp">
                <Input disabled style={{ fontWeight: 600 }} />
              </Form.Item>
            ) : (
              <Form.Item
                name="supplierId"
                label="Mã nhà cung cấp (Tùy chọn)"
                tooltip="Để trống để hệ thống tự động sinh mã theo quy tắc NCC01, NCC02..."
              >
                <Input placeholder="Ví dụ: NCC03 (để trống tự sinh)" />
              </Form.Item>
            )}

            <Form.Item
              name="supplierName"
              label="Tên nhà cung cấp"
              rules={[{ required: true, message: 'Vui lòng nhập tên nhà cung cấp' }]}
            >
              <Input placeholder="Ví dụ: Công ty Cổ phần Sữa TH True Milk" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email liên hệ"
              rules={[
                { type: 'email', message: 'Địa chỉ email không đúng định dạng' }
              ]}
            >
              <Input placeholder="Ví dụ: contact@thtruemilk.vn" />
            </Form.Item>

            <Form.Item
              name="phoneNumber"
              label="Số điện thoại liên hệ"
            >
              <Input placeholder="Ví dụ: 02838123456 hoặc 0901234567" />
            </Form.Item>

            <Form.Item
              name="active"
              label="Trạng thái hợp tác"
              valuePropName="checked"
            >
              <Switch checkedChildren="Đang hợp tác" unCheckedChildren="Ngừng hợp tác" />
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </Card>
  );
};

export default SupplierManager;
