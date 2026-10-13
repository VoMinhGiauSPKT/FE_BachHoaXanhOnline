import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Tag, Rate, Button, message } from 'antd';
import { PlusOutlined, CheckOutlined } from '@ant-design/icons';
import { formatVND } from '../../utils/formatCurrency';
import useCartStore from '../../stores/useCartStore';
import { PRODUCT_UNIT_LABELS } from '../../constants/enums';
import styles from './ProductCard.module.scss';

export const ProductCard = ({ product }) => {
  const { addToCart } = useCartStore();
  const [isAdding, setIsAdding] = useState(false);

  const productId = product.productId || product.id;
  const name = product.productName || product.name;
  const price = product.price || 0;
  const unit = product.unit || 'KG';
  const displayUnit = PRODUCT_UNIT_LABELS[unit?.toUpperCase()] || unit;
  const categoryName = product.category?.categoryName || product.categoryName || 'Bách Hóa';
  const imageUrl = product.imageUrl || product.image;
  const rating = Number(product.ratingAverage || product.rating || 5);
  const reviewsCount = Number(product.totalReviews || product.reviewCount || 0);

  const rawStock = product.stock !== undefined ? product.stock : (product.quantity || product.soLuong);
  const stock = rawStock !== undefined && rawStock !== null ? Number(rawStock) : 10;
  const isOutOfStock = stock <= 0;
  const isLowStock = stock > 0 && stock < 10;

  const handleAddClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) {
      message.warning(`Sản phẩm "${name}" hiện đã hết hàng!`);
      return;
    }
    setIsAdding(true);
    await addToCart(product, 1);
    message.success(`Đã thêm 1 ${displayUnit.toLowerCase()} ${name} vào giỏ!`);
    setTimeout(() => setIsAdding(false), 500);
  };

  return (
    <Card
      hoverable
      className={`${styles.card} ${isOutOfStock ? styles.outOfStockCard : ''}`}
      cover={
        <Link to={`/product/${productId}`} className={styles.imageWrap}>
          <div className={styles.badgesOverlay}>
            {isOutOfStock ? (
              <Tag color="error">Hết hàng</Tag>
            ) : isLowStock ? (
              <Tag color="warning">Chỉ còn {stock} {displayUnit.toLowerCase()}</Tag>
            ) : (
              <Tag color="success">Tươi sạch</Tag>
            )}
          </div>
          {imageUrl && imageUrl.startsWith('http') ? (
            <img src={imageUrl} alt={name} loading="lazy" className={styles.productImg} />
          ) : (
            <div className={styles.fallbackGraphic}>
              <span>{product.icon || '🥦'}</span>
            </div>
          )}
        </Link>
      }
    >
      <div className={styles.metaRow}>
        <span className={styles.categoryTag}>{categoryName}</span>
        {reviewsCount > 0 && (
          <div className={styles.ratingWrap}>
            <Rate disabled defaultValue={rating} style={{ fontSize: 11 }} />
            <span className={styles.reviewCount}>({reviewsCount})</span>
          </div>
        )}
      </div>

      <h3 className={styles.title} title={name}>
        <Link to={`/product/${productId}`}>{name}</Link>
      </h3>

      <div className={styles.cardFooter}>
        <div className={styles.priceWrap}>
          <span className={styles.amount}>{formatVND(price)}</span>
          <span className={styles.unitText}>/ {displayUnit}</span>
        </div>

        <Button
          type="primary"
          shape="circle"
          icon={isAdding ? <CheckOutlined /> : <PlusOutlined />}
          disabled={isOutOfStock}
          loading={isAdding}
          onClick={handleAddClick}
          style={{ backgroundColor: isOutOfStock ? undefined : '#008848' }}
        />
      </div>
    </Card>
  );
};

export default ProductCard;
