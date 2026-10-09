import React from 'react';
import ProductCard from '../../../../components/ProductCard';
import styles from './MobileHome.module.scss';

export const MobileHome = ({
  products,
  onAddToCart,
  deviceInfo
}) => {
  return (
    <div className={styles.mobileHome}>
      {/* Banner Khuyến Mãi Mobile */}
      <div className={styles.promoBanner}>
        <h2>BÁCH HÓA XANH MOBILE</h2>
        <p>Đi chợ tiện lợi - Giao siêu tốc trong 2H</p>
      </div>

      {/* Thông tin nhận diện */}
      <div className={styles.deviceInfoBadge}>
        📱 Đang hiển thị: <strong>MOBILE LAYOUT</strong><br />
        Nhận diện: UA: {deviceInfo?.details?.userAgentMatch ? 'Có' : 'Không'} | 
        Hints: {deviceInfo?.details?.clientHintsOrRouting ? 'Có' : 'Không'} | 
        Touch: {deviceInfo?.details?.touchPointerMatch ? 'Có' : 'Không'}
      </div>

      {/* Danh sách sản phẩm tái sử dụng ProductCard dạng Mobile */}
      <div className={styles.sectionHeader}>🔥 Ưu Đãi Hôm Nay</div>
      <div className={styles.mobileGrid}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
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
