import React from 'react';
import { formatVND } from '../../utils/formatCurrency';
import styles from './ProductCard.module.scss';

/**
 * Reusable ProductCard Component
 * Hỗ trợ 2 kiểu giao diện thông qua prop variant: 'desktop' hoặc 'mobile'
 */
export const ProductCard = ({
  product,
  onAddToCart,
  variant = 'desktop',
  buttonLabel
}) => {
  const { name, price, icon } = product;
  const label = buttonLabel || (variant === 'mobile' ? '+ Chọn mua' : '+ Thêm vào giỏ');

  return (
    <div className={`${styles.card} ${styles[variant]}`}>
      <div className={styles.imageBox}>
        <span>{icon}</span>
      </div>
      <h3 className={styles.title} title={name}>
        {name}
      </h3>
      <div className={styles.price}>{formatVND(price)}</div>
      <button
        type="button"
        className={styles.addBtn}
        onClick={() => onAddToCart && onAddToCart(product)}
      >
        {label}
      </button>
    </div>
  );
};

export default ProductCard;
