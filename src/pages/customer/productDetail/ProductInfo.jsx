import React, { useState } from 'react';
import { Image, Tag, Rate, InputNumber, Button, message } from 'antd';
import { ShoppingCartOutlined, CheckOutlined } from '@ant-design/icons';
import { formatVND } from '../../../utils/formatCurrency';
import { PRODUCT_UNIT_LABELS } from '../../../constants/enums';
import useCartStore from '../../../stores/useCartStore';
import styles from './ProductInfo.module.scss';

export const ProductInfo = ({ product }) => {
  const { addToCart } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  if (!product) return null;

  const name = product.productName || product.name;
  const price = product.price || 0;
  const unit = product.unit || 'KG';
  const displayUnit = PRODUCT_UNIT_LABELS[unit?.toUpperCase()] || unit;
  const imageUrl = product.imageUrl || product.image;
  const rating = Number(product.ratingAverage || product.rating || 5);
  const stock = Number(product.stock !== undefined ? product.stock : 10);
  const isOutOfStock = stock <= 0;

  const handleAddToCart = async () => {
    if (isOutOfStock) {
      message.warning('Sản phẩm đã hết hàng!');
      return;
    }
    setIsAdding(true);
    await addToCart(product, quantity);
    message.success(`Đã thêm ${quantity} ${displayUnit.toLowerCase()} ${name} vào giỏ hàng!`);
    setTimeout(() => setIsAdding(false), 500);
  };

  return (
    <div className={styles.infoWrapper}>
      <div className={styles.imageCol}>
        <Image
          src={imageUrl}
          alt={name}
          className={styles.mainImage}
          fallback="https://placehold.co/400x400/e2e8f0/64748b?text=FreshMart"
        />
      </div>

      <div className={styles.detailCol}>
        <div className={styles.categoryBadge}>
          {product.category?.categoryName || product.categoryName || 'Rau củ & Thực phẩm tươi sống'}
        </div>
        <h1 className={styles.productTitle}>{name}</h1>

        <div className={styles.ratingRow}>
          <Rate disabled defaultValue={rating} style={{ fontSize: 14 }} />
          <span className={styles.ratingScore}>{rating.toFixed(1)}/5.0</span>
          {isOutOfStock ? (
            <Tag color="error">Hết hàng</Tag>
          ) : (
            <Tag color="success">Còn hàng ({stock} {displayUnit.toLowerCase()})</Tag>
          )}
        </div>

        <div className={styles.priceBox}>
          <span className={styles.price}>{formatVND(price)}</span>
          <span className={styles.unit}>/ {displayUnit}</span>
        </div>

        <p className={styles.description}>
          {product.description || 'Sản phẩm tươi ngon thượng hạng được tuyển chọn từ các nông trại sạch tiêu chuẩn VietGAP. Bảo quản ở nhiệt độ thích hợp đảm bảo độ tươi mới khi đến tay bạn.'}
        </p>

        <div className={styles.actionRow}>
          <span className={styles.qtyLabel}>Số lượng:</span>
          <InputNumber
            min={unit === 'KG' ? 0.1 : 1}
            max={stock > 0 ? stock : 1}
            step={unit === 'KG' ? 0.1 : 1}
            value={quantity}
            onChange={(val) => setQuantity(val || 1)}
            size="large"
            disabled={isOutOfStock}
          />
          <span className={styles.unitHint}>({displayUnit})</span>

          <Button
            type="primary"
            size="large"
            icon={isAdding ? <CheckOutlined /> : <ShoppingCartOutlined />}
            loading={isAdding}
            disabled={isOutOfStock}
            onClick={handleAddToCart}
            style={{ backgroundColor: isOutOfStock ? undefined : '#008848' }}
          >
            Thêm vào giỏ hàng
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
