import React, { useEffect, useState } from 'react';
import { Card, Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { usePromotionStore } from '../../../stores/usePromotionStore';
import PromotionFilterBar from './PromotionFilterBar';
import PromotionTable from './PromotionTable';
import PromotionFormModal from './PromotionFormModal';

export const AdminPromotionsPage = () => {
  const {
    promotions,
    isLoading,
    filters,
    fetchPromotions,
    fetchPromotionByCode,
    setFilters,
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
      const code = editingPromotion.promotionCode || editingPromotion.code || editingPromotion.maKhuyenMai;
      const updatePayload = {
        promotionName: values.promotionName,
        description: values.description,
        maxDiscount: values.maxDiscount,
        remainingUsage: values.remainingUsage ?? values.usageLimit,
        endDate: values.endDate
      };
      const res = await updatePromotion(code, updatePayload);
      if (res.success) {
        message.success('Cập nhật khuyến mãi thành công!');
        setModalOpen(false);
      } else {
        message.error(res.error || 'Cập nhật thất bại');
      }
    } else {
      const createPayload = { ...values };
      delete createPayload.promotionCode;
      const res = await createPromotion(createPayload);
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
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>
          Tạo voucher mới
        </Button>
      }
    >
      <PromotionFilterBar
        search={filters?.keyword || ''}
        typeFilter={filters?.type || ''}
        onSearchChange={(kw) => setFilters({ keyword: kw })}
        onTypeChange={(tp) => setFilters({ type: tp === 'ALL' ? '' : tp })}
        onReset={() => setFilters({ keyword: '', type: '' })}
        onRefresh={refresh}
      />

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
