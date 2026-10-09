import React, { useState } from 'react';
import useAuthStore from '../../../stores/useAuthStore';
import AdminLayout from '../../layout/common/AdminLayout';
import DesktopAdmin from '../../layout/desktop/admin';
import { INITIAL_ADMIN_PRODUCTS, ADMIN_METRICS } from './constants';

export const AdminContainer = () => {
  const { user } = useAuthStore();
  const [products, setProducts] = useState(INITIAL_ADMIN_PRODUCTS);
  const [searchTerm, setSearchTerm] = useState('');

  // Lọc sản phẩm theo từ khóa
  const filteredProducts = products.filter((p) =>
    p.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.productId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Thêm sản phẩm mới
  const handleAddProduct = () => {
    const name = window.prompt('Nhập tên sản phẩm mới:');
    if (!name) return;

    const price = window.prompt('Nhập giá bán (VND):', '50000');
    const stock = window.prompt('Nhập số lượng tồn kho ban đầu:', '50');

    const newProd = {
      productId: `SP00000${products.length + 1}`,
      productName: name,
      categoryName: 'Hàng mới nhập',
      price: Number(price) || 50000,
      unit: 'Gói/Hộp',
      stock: Number(stock) || 50,
      status: 'ACTIVE'
    };

    setProducts([newProd, ...products]);
    alert(`✅ Đã thêm sản phẩm "${name}" thành công vào hệ thống!`);
  };

  // Xóa sản phẩm
  const handleDeleteProduct = (productId, productName) => {
    const confirmDelete = window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${productName}" (${productId}) không?`);
    if (confirmDelete) {
      setProducts(products.filter((p) => p.productId !== productId));
      alert(`🗑️ Đã xóa sản phẩm ${productId} thành công!`);
    }
  };

  return (
    <AdminLayout>
      <DesktopAdmin
        metrics={ADMIN_METRICS}
        products={filteredProducts}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onAddProduct={handleAddProduct}
        onDeleteProduct={handleDeleteProduct}
        userPosition={user?.position || 'STAFF'}
      />
    </AdminLayout>
  );
};

export default AdminContainer;
