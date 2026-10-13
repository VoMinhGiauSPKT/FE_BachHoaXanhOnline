import React, { useEffect, useState } from 'react';
import { Card, Button, Space, message } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { useSupplierStore } from '../../../stores/useSupplierStore';
import SupplierTable from './SupplierTable';
import SupplierFormModal from './SupplierFormModal';

export const AdminSuppliersPage = () => {
  const {
    suppliers,
    isLoading,
    fetchSuppliers,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    refresh
  } = useSupplierStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  const handleEdit = (sup) => {
    setEditingSupplier(sup);
    setModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingSupplier(null);
    setModalOpen(true);
  };

  const handleModalSubmit = async (values) => {
    if (editingSupplier) {
      const id = editingSupplier.supplierId || editingSupplier.id;
      const res = await updateSupplier(id, values);
      if (res.success) {
        message.success('Cập nhật nhà cung cấp thành công!');
        setModalOpen(false);
      } else {
        message.error(res.error || 'Cập nhật thất bại');
      }
    } else {
      const res = await createSupplier(values);
      if (res.success) {
        message.success('Thêm nhà cung cấp thành công!');
        setModalOpen(false);
      } else {
        message.error(res.error || 'Thêm thất bại');
      }
    }
  };

  const handleDelete = async (id) => {
    const res = await deleteSupplier(id);
    if (res.success) {
      message.success('Xóa nhà cung cấp thành công!');
    } else {
      message.error(res.error || 'Xóa thất bại');
    }
  };

  return (
    <Card
      title="Quản lý Đối tác Nhà Cung Cấp"
      variant="borderless"
      extra={
        <Space>
          <Button icon={<ReloadOutlined />} onClick={refresh}>
            Làm mới
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>
            Thêm nhà cung cấp
          </Button>
        </Space>
      }
    >
      <SupplierTable
        suppliers={suppliers}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <SupplierFormModal
        open={modalOpen}
        editingSupplier={editingSupplier}
        isLoading={isLoading}
        onCancel={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
      />
    </Card>
  );
};

export default AdminSuppliersPage;
