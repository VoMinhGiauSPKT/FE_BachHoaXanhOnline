import React from 'react';
import styles from './ProductSkeleton.module.scss';

export const ProductSkeleton = ({ count = 8 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className={styles.skeletonCard}>
          <div className={`${styles.imagePlaceholder} ${styles.shimmer}`}></div>
          <div className={styles.body}>
            <div className={`${styles.lineShort} ${styles.shimmer}`}></div>
            <div className={`${styles.lineTitle} ${styles.shimmer}`}></div>
            <div className={`${styles.lineSubtitle} ${styles.shimmer}`}></div>
            <div className={styles.footer}>
              <div className={`${styles.linePrice} ${styles.shimmer}`}></div>
              <div className={`${styles.circleBtn} ${styles.shimmer}`}></div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default ProductSkeleton;
