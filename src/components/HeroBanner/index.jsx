import React from 'react';
import styles from './HeroBanner.module.scss';

export const HeroBanner = () => {
  return (
    <section className={styles.heroSection}>
      <div className={styles.content}>
        <div className={styles.guaranteeBadge}>
          <span className={styles.starIcon}>★</span> 100% FARM FRESH GUARANTEED
        </div>

        <h1 className={styles.headline}>
          Eat Fresh, Live Healthy <br />
          with Same-Day Delivery
        </h1>

        <p className={styles.subheader}>
          Hàng ngàn loại rau củ VietGAP tươi non, thịt cá tươi sống nhập mới mỗi sáng và nông sản hữu cơ được giao hỏa tốc đến tận bếp nhà bạn trong vòng 30 phút.
        </p>

        <div className={styles.heroActions}>
          <a href="#catalog-section" className={styles.primaryCta}>
            Đi chợ ngay hôm nay ↓
          </a>
          <div className={styles.promoPill}>
            <span>⚡ Freeship đơn đầu tiên từ 150k</span>
          </div>
        </div>
      </div>

      {/* Subtle basket watermark vector silhouette */}
      <div className={styles.watermarkSilhouette} aria-hidden="true">
        <svg viewBox="0 0 100 100" fill="none" stroke="currentColor">
          <path
            d="M20 45 L35 15 M80 45 L65 15 M30 15 L70 15"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M15 45 C15 40 18 38 25 38 L75 38 C82 38 85 40 85 45 L78 85 C77 90 73 93 68 93 L32 93 C27 93 23 90 22 85 Z"
            strokeWidth="4"
          />
          <path
            d="M20 58 L80 58 M23 72 L77 72 M50 38 L50 93"
            strokeWidth="2.5"
            strokeDasharray="4 4"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroBanner;
