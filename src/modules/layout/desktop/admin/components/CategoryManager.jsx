import React, { useState } from 'react';
import {
  Table,
  Button,
  Input,
  Space,
  Tag,
  Modal,
  Form,
  InputNumber,
  Popconfirm,
  Card,
  Tooltip,
  Typography,
  Spin
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import categoryService from '../../../../../services/categoryService';

const { Text } = Typography;

export const CategoryManager = ({
  categories = [],
  isLoading = false,
  isAdmin = false,
  onSaveCategory,
  onDeleteCategory,
  onRefresh
}) => {
  const [tempSearch, setTempSearch] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');

  const handleSearchClick = () => {
    setAppliedSearch(tempSearch.trim());
  };

  const handleResetClick = () => {
    setTempSearch('');
    setAppliedSearch('');
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetchingDetail, setIsFetchingDetail] = useState(false);
  const [form] = Form.useForm();

  const handleOpenAdd = () => {
    setEditingCategory(null);
    form.resetFields();
    form.setFieldsValue({
      profitMargin: 15
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = async (record) => {
    setEditingCategory(record);
    setIsModalOpen(true);
    setIsFetchingDetail(true);
    form.resetFields();
    form.setFieldsValue({
      categoryId: record.categoryId,
      categoryName: record.categoryName,
      profitMargin: record.profitMargin ?? 0
    });

    try {
      const res = await categoryService.getCategoryById(record.categoryId);
      const detail = res?.data || record;
      form.setFieldsValue({
        categoryId: detail.categoryId || record.categoryId,
        categoryName: detail.categoryName || record.categoryName,
        profitMargin: detail.profitMargin !== undefined && detail.profitMargin !== null
          ? detail.profitMargin
          : (record.profitMargin ?? 0)
      });
    } catch (err) {
      console.error('Lỗi khi lấy chi tiết danh mục:', err);
    } finally {
      setIsFetchingDetail(false);
    }
  };

  const handleModalSubmit = async () => {
    try {
      const values = await form.validateFields();
      setIsSubmitting(true);
      const payload = {
        categoryId: editingCategory ? editingCategory.categoryId : undefined,
        categoryName: values.categoryName.trim(),
        profitMargin: Number(values.profitMargin ?? 0)
      };

      const res = await onSaveCategory(payload, editingCategory?.categoryId);
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

  const filteredCategories = categories.filter((c) => {
    if (!appliedSearch) return true;
    const term = appliedSearch.toLowerCase();
    return (
      (c.categoryName && c.categoryName.toLowerCase().includes(term)) ||
      (c.categoryId && c.categoryId.toLowerCase().includes(term))
    );
  });

  const columns = [
    {
      title: 'Mã Danh Mục',
      dataIndex: 'categoryId',
      key: 'categoryId',
      width: 140,
      render: (id) => (
        <Tag color="geekblue" style={{ fontWeight: 600, fontSize: 13 }}>
          {id}
        </Tag>
      )
    },
    {
      title: 'Tên Danh Mục Ngành Hàng',
      dataIndex: 'categoryName',
      key: 'categoryName',
      render: (name) => <Text strong style={{ fontSize: 14 }}>{name}</Text>
    },
    {
      title: 'Tỷ suất lợi nhuận định mức',
      dataIndex: 'profitMargin',
      key: 'profitMargin',
      width: 220,
      align: 'center',
      render: (margin) => (
        <Tag color="cyan" style={{ fontSize: 13, padding: '2px 10px' }}>
          {margin !== undefined && margin !== null ? `+${margin}%` : 'Chưa thiết lập'}
        </Tag>
      )
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 140,
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Chỉnh sửa danh mục">
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
              title="Xóa danh mục"
              description={`Bạn có chắc muốn xóa "${record.categoryName}" (${record.categoryId})?`}
              onConfirm={() => onDeleteCategory(record.categoryId, record.categoryName)}
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
            >
              <Tooltip title="Xóa danh mục (Chỉ Admin)">
                <Button danger size="small" icon={<DeleteOutlined />} />
              </Tooltip>
            </Popconfirm>
          )}
        </Space>
      )
    }
  ];

  return (
    <Card
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 18, fontWeight: 700 }}>🏷️ Quản Lý Danh Mục Ngành Hàng</span>
          <Tag color="blue" style={{ fontSize: 13, padding: '2px 8px' }}>
            {categories.length} danh mục
          </Tag>
        </div>
      }
      extra={
        <Space wrap>
          <Button icon={<ReloadOutlined />} onClick={onRefresh}>
            Làm mới
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenAdd} style={{ background: '#10b981' }}>
            Thêm danh mục mới
          </Button>
        </Space>
      }
      style={{ borderRadius: 12, boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}
    >
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20 }}>
        <Input
          placeholder="Tìm kiếm danh mục theo tên hoặc mã DM..."
          prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
          value={tempSearch}
          onChange={(e) => setTempSearch(e.target.value)}
          onPressEnter={handleSearchClick}
          allowClear
          style={{ width: 320 }}
        />
        <Button
          type="primary"
          icon={<SearchOutlined />}
          onClick={handleSearchClick}
          style={{ background: '#10b981', borderColor: '#10b981', fontWeight: 600 }}
        >
          Tìm kiếm
        </Button>
        <Button
          icon={<ReloadOutlined />}
          onClick={handleResetClick}
        >
          Đặt lại
        </Button>
      </div>

      <Table
        rowKey="categoryId"
        columns={columns}
        dataSource={filteredCategories}
        loading={isLoading}
        bordered
        pagination={{
          defaultPageSize: 20,
          showSizeChanger: true,
          pageSizeOptions: ['20', '50', '100'],
          showTotal: (total, range) => (
            <span style={{ color: '#64748b' }}>
              Hiển thị <strong>{range[0]}-{range[1]}</strong> trên <strong>{total}</strong> danh mục
            </span>
          )
        }}
      />

      <Modal
        title={editingCategory ? `✏️ Chỉnh Sửa Danh Mục [${editingCategory.categoryId}]` : '✨ Thêm Danh Mục Mới'}
        open={isModalOpen}
        onOk={handleModalSubmit}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={isSubmitting}
        okText={editingCategory ? 'Lưu cập nhật' : 'Tạo danh mục'}
        cancelText="Đóng"
        destroyOnClose
      >
        <Spin spinning={isFetchingDetail} tip="Đang tải dữ liệu chi tiết...">
          <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
            {editingCategory && (
              <Form.Item name="categoryId" label="Mã danh mục">
                <Input disabled />
              </Form.Item>
            )}

            <Form.Item
              name="categoryName"
              label="Tên danh mục ngành hàng"
              rules={[{ required: true, message: 'Vui lòng nhập tên danh mục' }]}
            >
              <Input placeholder="Ví dụ: Bánh kẹo & Đồ ăn vặt" />
            </Form.Item>

            <Form.Item
              name="profitMargin"
              label="Tỷ suất lợi nhuận định mức (%)"
              rules={[{ required: true, message: 'Vui lòng nhập tỷ suất lợi nhuận' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                max={100}
                step={0.5}
                addonAfter="%"
              />
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </Card>
  );
};

export default CategoryManager;
