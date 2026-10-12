import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatVND } from '../../utils/formatCurrency';
import useCartStore from '../../stores/useCartStore';
import useToastStore from '../../stores/useToastStore';
import { PATHS } from '../../constants/paths';
import { PRODUCT_UNIT_LABELS } from '../../constants/enums';
import styles from './ProductCard.module.scss';

export const ProductCard = ({
  product,
  onAddToCart,
  variant = 'desktop'
}) => {
  const { addToCart } = useCartStore();
  const addToast = useToastStore((state) => state.addToast);
  const [isAdding, setIsAdding] = useState(false);

  const productId = product.productId || product.id;
  const name = product.productName || product.name;
  const price = product.price || 0;
  const unit = product.unit || 'KG';
  const displayUnit = PRODUCT_UNIT_LABELS[unit?.toUpperCase()] || unit;
  const categoryName = product.category?.categoryName || product.categoryName || 'Fresh Food';
  const imageUrl = product.imageUrl || product.image;
  const rawRating = product.ratingAverage !== undefined ? product.ratingAverage : product.rating;
  const rating = rawRating !== undefined && rawRating !== null ? Number(rawRating) : 0;
  const rawReviews = product.totalReviews !== undefined ? product.totalReviews : product.reviewCount;
  const reviewCount = rawReviews !== undefined && rawReviews !== null ? Number(rawReviews) : 0;
  const hasReviews = reviewCount > 0 && rating > 0;

  const specs = product.specs || `Tươi mới mỗi ngày • Bảo quản 4-8°C`;

  // Trạng thái tồn kho: >= 10 là còn hàng, < 10 là sắp hết (hiện số lượng còn), <= 0 là hết hàng
  const rawStock = product.stock !== undefined ? product.stock : (product.quantity !== undefined ? product.quantity : product.soLuong);
  const stock = rawStock !== undefined && rawStock !== null ? Number(rawStock) : 0;
  const isOutOfStock = stock <= 0;
  const isLowStock = stock > 0 && stock < 10;

  const handleAddClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) {
      if (addToast) {
        addToast({
          type: 'warning',
          message: `Sản phẩm "${name}" hiện đã hết hàng, vui lòng quay lại sau!`
        });
      }
      return;
    }
    setIsAdding(true);
    if (onAddToCart) {
      await onAddToCart(product);
    } else {
      await addToCart(product, 1);
    }
    setTimeout(() => setIsAdding(false), 500);
  };

  return (
    <article className={`${styles.card} ${styles[variant]} ${isOutOfStock ? styles.outOfStockCard : ''}`}>

      {/* Product Image Link */}
      <Link to={`/product/${productId}`} className={styles.imageWrap}>
        {/* Badges Overlay on top-left of image */}
        <div className={styles.badgesOverlay}>
          {isOutOfStock ? (
            <span className={styles.badgeOutOfStock}>Hết hàng</span>
          ) : isLowStock ? (
            <span className={styles.badgeLowStock}>🔥 Chỉ còn {stock} {displayUnit.toLowerCase()}</span>
          ) : (
            <span className={styles.badgeInStock}>✓ Còn hàng</span>
          )}
        </div>

        {imageUrl && imageUrl.startsWith('http') ? (
          <img
            src={imageUrl}
            alt={name}
            loading="lazy"
            className={`${styles.productImg} ${isOutOfStock ? styles.imgOutOfStock : ''}`}
          />
        ) : (
          <div className={`${styles.fallbackGraphic} ${isOutOfStock ? styles.imgOutOfStock : ''}`}>
            <span>{product.icon || '🥦'}</span>
          </div>
        )}

        {isOutOfStock && (
          <div className={styles.outOfStockMask}>
            <span>HẾT HÀNG</span>
          </div>
        )}
      </Link>

      {/* Meta & Rating */}
      <div className={styles.cardContent}>
        <div className={styles.metaRow}>
          <span className={styles.departmentBadge}>{categoryName}</span>
          {hasReviews && (
            <div className={styles.ratingStars} title={`${rating.toFixed(1)} sao (${reviewCount} đánh giá)`}>
              ★ <span>{rating.toFixed(1).replace(/\.0$/, '')} ({reviewCount})</span>
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className={styles.title} title={name}>
          <Link to={`/product/${productId}`}>{name}</Link>
        </h3>

        {/* Trạng thái tồn kho */}
        <div className={styles.stockStatusRow}>
          {isOutOfStock ? (
            <span className={styles.stockTextOut}>
              <span className={styles.statusDotOut} /> Hết hàng
            </span>
          ) : isLowStock ? (
            <span className={styles.stockTextLow}>
              <span className={styles.statusDotLow} /> Chỉ còn <strong>{stock}</strong> {displayUnit.toLowerCase()}
            </span>
          ) : (
            <span className={styles.stockTextIn}>
              <span className={styles.statusDotIn} /> Còn hàng
            </span>
          )}
        </div>

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
            className={`${styles.addCircleBtn} ${isAdding ? styles.added : ''} ${isOutOfStock ? styles.disabledBtn : ''}`}
            onClick={handleAddClick}
            disabled={isOutOfStock}
            aria-label={isOutOfStock ? `${name} đã hết hàng` : `Thêm ${name} vào giỏ`}
            title={isOutOfStock ? 'Sản phẩm đã hết hàng' : 'Thêm vào giỏ hàng'}
          >
            {isOutOfStock ? '✕' : isAdding ? '✓' : '+'}
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
