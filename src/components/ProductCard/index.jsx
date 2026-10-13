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
  const name = product.productName || product.name || 'Sản phẩm';
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
              <Tag color="success">Mới</Tag>
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
      {/* 1. Loại sản phẩm */}
      <span className={styles.categoryName} title={categoryName}>
        {categoryName}
      </span>

      {/* 2. Tên sản phẩm */}
      <h3 className={styles.productTitle} title={name}>
        <Link to={`/product/${productId}`}>{name}</Link>
      </h3>

      {/* 3. Số sao (lượt đánh giá) */}
      <div className={styles.ratingRow}>
        <Rate disabled value={rating} style={{ fontSize: 12 }} />
        <span className={styles.reviewCount}>({reviewsCount})</span>
      </div>

      {/* 4. Giá / đơn vị */}
      <div className={styles.priceRow} title={`${formatVND(price)} / ${displayUnit}`}>
        <span className={styles.amount}>{formatVND(price)}</span>
        <span className={styles.unitText}>/ {displayUnit}</span>
      </div>

      {/* 5. Nút thêm vào giỏ hàng */}
      <Button
        type="primary"
        block
        icon={isAdding ? <CheckOutlined /> : <PlusOutlined />}
        disabled={isOutOfStock}
        loading={isAdding}
        onClick={handleAddClick}
        className={styles.addCartBtn}
      >
        {isOutOfStock ? 'Hết hàng' : (isAdding ? 'Đã thêm vào giỏ' : 'Thêm vào giỏ')}
      </Button>
    </Card>
  );
};

export default ProductCard;
