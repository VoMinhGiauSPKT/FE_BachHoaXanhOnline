import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatVND } from '../../utils/formatCurrency';
import useCartStore from '../../stores/useCartStore';
import { PATHS } from '../../constants/paths';
import { PRODUCT_UNIT_LABELS } from '../../constants/enums';
import styles from './ProductCard.module.scss';

export const ProductCard = ({
  product,
  onAddToCart,
  variant = 'desktop'
}) => {
  const { addToCart } = useCartStore();
  const [isAdding, setIsAdding] = useState(false);

  const productId = product.productId || product.id;
  const name = product.productName || product.name;
  const price = product.price || 0;
  const unit = product.unit || 'KG';
  const displayUnit = PRODUCT_UNIT_LABELS[unit?.toUpperCase()] || unit;
  const categoryName = product.category?.categoryName || product.categoryName || 'Fresh Food';
  const imageUrl = product.imageUrl || product.image;
  const rating = product.ratingAverage || product.rating || 5.0;
  const reviewCount = product.totalReviews || 0;

  const specs = product.specs || `Tươi mới mỗi ngày • Bảo quản 4-8°C`;

  const handleAddClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    if (onAddToCart) {
      await onAddToCart(product);
    } else {
      await addToCart(product, 1);
    }
    setTimeout(() => setIsAdding(false), 500);
  };

  return (
    <article className={`${styles.card} ${styles[variant]}`}>

      {/* Product Image Link */}
      <Link to={`/product/${productId}`} className={styles.imageWrap}>
        {imageUrl && imageUrl.startsWith('http') ? (
          <img src={imageUrl} alt={name} loading="lazy" className={styles.productImg} />
        ) : (
          <div className={styles.fallbackGraphic}>
            <span>{product.icon || '🥦'}</span>
          </div>
        )}
      </Link>

      {/* Meta & Rating */}
      <div className={styles.cardContent}>
        <div className={styles.metaRow}>
          <span className={styles.departmentBadge}>{categoryName}</span>
          <div className={styles.ratingStars} title={`${rating} sao`}>
            ★ <span>{rating} ({reviewCount})</span>
          </div>
        </div>

        {/* Title */}
        <h3 className={styles.title} title={name}>
          <Link to={`/product/${productId}`}>{name}</Link>
        </h3>

        {/* Nutritional / Specs snippet */}
        <p className={styles.specsSnippet}>{specs}</p>

        {/* Bottom Pricing & Circular + Button */}
        <div className={styles.cardFooter}>
          <div className={styles.priceWrap}>
            <div className={styles.currentPrice}>
              <span className={styles.amount}>{formatVND(price)}</span>
              <span className={styles.unitText}>/ {displayUnit}</span>
            </div>
          </div>

          <button
            type="button"
            className={`${styles.addCircleBtn} ${isAdding ? styles.added : ''}`}
            onClick={handleAddClick}
            aria-label={`Thêm ${name} vào giỏ`}
            title="Thêm vào giỏ hàng"
          >
            {isAdding ? '✓' : '+'}
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
