import React, { useEffect, useState } from 'react';
import { Card, message } from 'antd';
import { useProductStore } from '../../../stores/useProductStore';
import { useCategoryStore } from '../../../stores/useCategoryStore';
import { useSupplierStore } from '../../../stores/useSupplierStore';
import ProductFilterBar from './ProductFilterBar';
import ProductTable from './ProductTable';
import ProductFormModal from './ProductFormModal';

export const AdminProductsPage = () => {
  const {
    products,
    total,
    page,
    limit,
    isLoading,
    filters,
    fetchProducts,
    fetchProductById,
    setFilters,
    setPage,
    createProduct,
    updateProduct,
    deleteProduct,
    refresh
  } = useProductStore();

  const { categories, fetchCategories } = useCategoryStore();
  const { suppliers, fetchSuppliers } = useSupplierStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchSuppliers();
  }, [fetchProducts, fetchCategories, fetchSuppliers]);

  const handleEdit = async (prod) => {
    const id = prod.productId || prod.id;
    const hide = message.loading('Đang tải dữ liệu chi tiết...', 0);
    try {
      const detail = await fetchProductById(id);
      hide();
      setEditingProduct(detail || prod);
      setModalOpen(true);
    } catch {
      hide();
      setEditingProduct(prod);
      setModalOpen(true);
    }
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const handleModalSubmit = async (values) => {
    if (editingProduct) {
      const id = editingProduct.productId || editingProduct.id;
      const res = await updateProduct(id, values);
      if (res.success) {
        message.success('Cập nhật sản phẩm thành công!');
        setModalOpen(false);
      } else {
        message.error(res.error || 'Cập nhật thất bại');
      }
    } else {
      const res = await createProduct(values);
      if (res.success) {
        message.success('Thêm mới sản phẩm thành công!');
        setModalOpen(false);
      } else {
        message.error(res.error || 'Thêm mới thất bại');
      }
    }
  };

  const handleDelete = async (id) => {
    const res = await deleteProduct(id);
    if (res.success) {
      message.success('Xóa sản phẩm thành công!');
    } else {
      message.error(res.error || 'Xóa thất bại');
    }
  };

  return (
    <Card title="Quản lý Danh mục Sản phẩm" variant="borderless">
      <ProductFilterBar
        search={filters.keyword}
        categoryFilter={filters.categoryId}
        inStockFilter={
          filters.inStock === true || filters.inStock === 'in_stock'
            ? 'in_stock'
            : filters.inStock === false || filters.inStock === 'out_of_stock'
            ? 'out_of_stock'
            : undefined
        }
        categories={categories}
        onSearchChange={(kw) => setFilters({ keyword: kw })}
        onCategoryChange={(catId) => setFilters({ categoryId: catId })}
        onInStockChange={(val) => setFilters({ inStock: val || null })}
        onReset={() => setFilters({ keyword: '', categoryId: null, inStock: null })}
        onRefresh={refresh}
        onAddNew={handleAddNew}
      />

      <ProductTable
        products={products}
        isLoading={isLoading}
        page={page}
        limit={limit}
        total={total}
        onPageChange={(p) => {
          setPage(p);
        }}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ProductFormModal
        open={modalOpen}
        editingProduct={editingProduct}
        categories={categories}
        suppliers={suppliers}
        isLoading={isLoading}
        onCancel={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
      />
    </Card>
  );
};

export default AdminProductsPage;
