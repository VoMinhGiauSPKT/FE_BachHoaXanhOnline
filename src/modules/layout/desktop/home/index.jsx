import React from 'react';
import ProductCard from '../../../../components/ProductCard';
import styles from './DesktopHome.module.scss';

export const DesktopHome = ({
  products,
  onAddToCart,
  deviceInfo
}) => {
  return (
    <div className={styles.homeContainer}>
      {/* Banner Khuyến Mãi */}
      <section className={styles.heroBanner}>
        <div className={styles.bannerText}>
          <h1>BÁCH HÓA XANH - ĐI CHỢ ONLINE</h1>
          <p>Thực phẩm tươi sạch mỗi ngày • Giảm giá đến 30% hôm nay • Giao siêu tốc 2H</p>
        </div>
        <div className={styles.badge}>MUA NGAY GIÁ TỐT</div>
      </section>

      {/* Thanh thông tin nhận diện thiết bị (Giúp test rõ ràng 3 tiêu chí) */}
      <section className={styles.deviceInfoBar}>
        <div>
          🖥️ Chế độ hiển thị: <span className={styles.highlight}>DESKTOP LAYOUT</span>
        </div>
        <div>
          🔍 Nhận diện: UA: {deviceInfo?.details?.userAgentMatch ? 'Mobile' : 'Desktop'} | 
          ClientHints: {deviceInfo?.details?.clientHintsOrRouting ? 'Mobile' : 'None'} | 
          Touch/Pointer: {deviceInfo?.details?.touchPointerMatch ? 'Coarse/Touch' : 'Fine/Mouse'}
        </div>
      </section>

      {/* Danh sách sản phẩm tái sử dụng ProductCard */}
      <section>
        <h2 className={styles.sectionTitle}>🥩 SẢN PHẨM NỔI BẬT HÔM NAY</h2>
        <div className={styles.productGrid}>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              variant="desktop"
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default DesktopHome;
