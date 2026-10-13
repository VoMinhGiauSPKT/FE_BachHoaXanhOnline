import React, { useEffect, useState } from 'react';
import { Card, Button, Space, message } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { useCategoryStore } from '../../../stores/useCategoryStore';
import CategoryTable from './CategoryTable';
import CategoryFormModal from './CategoryFormModal';

export const AdminCategoriesPage = () => {
  const {
    categories,
    isLoading,
    fetchCategories,
    fetchCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    refresh
  } = useCategoryStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleEdit = async (cat) => {
    const id = cat.categoryId || cat.id;
    const hide = message.loading('Đang tải dữ liệu chi tiết...', 0);
    try {
      const detail = await fetchCategoryById(id);
      hide();
      setEditingCategory(detail || cat);
      setModalOpen(true);
    } catch {
      hide();
      setEditingCategory(cat);
      setModalOpen(true);
    }
  };

  const handleAddNew = () => {
    setEditingCategory(null);
    setModalOpen(true);
  };

  const handleModalSubmit = async (values) => {
    if (editingCategory) {
      const id = editingCategory.categoryId || editingCategory.id;
      const res = await updateCategory(id, values);
      if (res.success) {
        message.success('Cập nhật danh mục thành công!');
        setModalOpen(false);
      } else {
        message.error(res.error || 'Cập nhật thất bại');
      }
    } else {
      const res = await createCategory(values);
      if (res.success) {
        message.success('Thêm danh mục thành công!');
        setModalOpen(false);
      } else {
        message.error(res.error || 'Thêm thất bại');
      }
    }
  };

  const handleDelete = async (id) => {
    const res = await deleteCategory(id);
    if (res.success) {
      message.success('Xóa danh mục thành công!');
    } else {
      message.error(res.error || 'Xóa thất bại');
    }
  };

  return (
    <Card
      title="Quản lý Danh mục Ngành hàng"
      variant="borderless"
      extra={
        <Space>
          <Button icon={<ReloadOutlined />} onClick={refresh}>
            Làm mới
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>
            Thêm danh mục
          </Button>
        </Space>
      }
    >
      <CategoryTable
        categories={categories}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <CategoryFormModal
        open={modalOpen}
        editingCategory={editingCategory}
        isLoading={isLoading}
        onCancel={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
      />
    </Card>
  );
};

export default AdminCategoriesPage;
