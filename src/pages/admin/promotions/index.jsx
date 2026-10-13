import React, { useEffect, useState } from 'react';
import { Card, Button, Space, message } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { usePromotionStore } from '../../../stores/usePromotionStore';
import PromotionTable from './PromotionTable';
import PromotionFormModal from './PromotionFormModal';

export const AdminPromotionsPage = () => {
  const {
    promotions,
    isLoading,
    fetchPromotions,
    fetchPromotionByCode,
    createPromotion,
    updatePromotion,
    deletePromotion,
    refresh
  } = usePromotionStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);

  useEffect(() => {
    fetchPromotions();
  }, [fetchPromotions]);

  const handleEdit = async (promo) => {
    const code = promo.promotionCode || promo.code || promo.maKhuyenMai;
    const hide = message.loading('Đang tải dữ liệu chi tiết...', 0);
    try {
      const detail = await fetchPromotionByCode(code);
      hide();
      setEditingPromotion(detail || promo);
      setModalOpen(true);
    } catch {
      hide();
      setEditingPromotion(promo);
      setModalOpen(true);
    }
  };

  const handleAddNew = () => {
    setEditingPromotion(null);
    setModalOpen(true);
  };

  const handleModalSubmit = async (values) => {
    if (editingPromotion) {
      const code = editingPromotion.code || editingPromotion.maKhuyenMai;
      const res = await updatePromotion(code, values);
      if (res.success) {
        message.success('Cập nhật khuyến mãi thành công!');
        setModalOpen(false);
      } else {
        message.error(res.error || 'Cập nhật thất bại');
      }
    } else {
      const res = await createPromotion(values);
      if (res.success) {
        message.success('Tạo voucher khuyến mãi thành công!');
        setModalOpen(false);
      } else {
        message.error(res.error || 'Tạo mới thất bại');
      }
    }
  };

  const handleDelete = async (code) => {
    const res = await deletePromotion(code);
    if (res.success) {
      message.success('Xóa voucher thành công!');
    } else {
      message.error(res.error || 'Xóa thất bại');
    }
  };

  return (
    <Card
      title="Quản lý Chương trình Khuyến Mãi & Voucher"
      variant="borderless"
      extra={
        <Space>
          <Button icon={<ReloadOutlined />} onClick={refresh}>
            Làm mới
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>
            Tạo voucher mới
          </Button>
        </Space>
      }
    >
      <PromotionTable
        promotions={promotions}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <PromotionFormModal
        open={modalOpen}
        editingPromotion={editingPromotion}
        isLoading={isLoading}
        onCancel={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
      />
    </Card>
  );
};

export default AdminPromotionsPage;
