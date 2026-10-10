import React from 'react';
import ProductCard from '../../../../components/ProductCard';
import styles from './MobileHome.module.scss';

export const MobileHome = ({
  products = [],
  onAddToCart,
  totalItems
}) => {
  return (
    <div className={styles.mobileHome}>
      {/* Banner Khuyến Mãi Mobile */}
      <div className={styles.promoBanner}>
        <h2>FRESHMART ONLINE</h2>
        <p>Thực phẩm tươi sạch mỗi ngày - Giao siêu tốc 30 phút</p>
      </div>

      {/* Danh sách sản phẩm */}
      <div className={styles.sectionHeader}>
        🔥 Ưu Đãi Hôm Nay ({totalItems || products.length} món)
      </div>

      <div className={styles.mobileGrid}>
        {products.map((product) => (
          <ProductCard
            key={product.productId || product.id}
            product={product}
            variant="mobile"
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </div>
  );
};

export default MobileHome;
