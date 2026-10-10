import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import productService from '../../../../services/productService';
import reviewService from '../../../../services/reviewService';
import useCartStore from '../../../../stores/useCartStore';
import useAuthStore from '../../../../stores/useAuthStore';
import useToastStore from '../../../../stores/useToastStore';
import { formatVND } from '../../../../utils/formatCurrency';
import { formatDate } from '../../../../utils/formatDate';
import { PATHS } from '../../../../constants/paths';
import { PRODUCT_UNIT_LABELS } from '../../../../constants/enums';
import { MOCK_PRODUCTS } from '../../../containers/home/constants';
import styles from './ProductDetail.module.scss';

export const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  const { addToast } = useToastStore();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Load product detail & reviews
  useEffect(() => {
    const fetchDetail = async () => {
      setIsLoading(true);
      try {
        const prodRes = await productService.getProductById(id);
        if (prodRes.data) {
          setProduct(prodRes.data);
        } else {
          throw new Error('No product');
        }
      } catch {
        // Fallback to mock product matching id
        const found = MOCK_PRODUCTS.find((p) => p.productId === id || p.id === id) || {
          ...MOCK_PRODUCTS[0],
          productId: id,
          productName: `Sản phẩm ${id}`,
          supplier: { supplierName: 'FreshMart Farms & Hợp Tác Xã VietGAP' },
          vat: 10,
          stock: 45,
          expiryDate: '2026-12-31'
        };
        setProduct(found);
      }

      // Fetch reviews
      try {
        const revRes = await reviewService.getProductReviews(id);
        if (revRes.data) {
          setReviews(revRes.data.reviews || []);
          setSummary(revRes.data.summary || null);
        }
      } catch {
        setReviews([
          {
            reviewId: 1,
            rating: 5,
            comment: 'Sản phẩm rất tươi ngon, đóng gói cẩn thận, giao nhanh đúng hẹn!',
            createdAt: '2026-10-09 10:30:00',
            customer: { fullName: 'Trần Thị Thu Hà' }
          },
          {
            reviewId: 2,
            rating: 5,
            comment: 'Chất lượng tuyệt vời, rau củ mọng nước, sẽ tiếp tục ủng hộ FreshMart.',
            createdAt: '2026-10-08 16:45:00',
            customer: { fullName: 'Nguyễn Văn Minh' }
          }
        ]);
        setSummary({
          averageRating: 5.0,
          totalReviews: 2,
          starCounts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 2 }
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    await addToCart(product, quantity);
  };

  if (isLoading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.spinner}></div>
        <p>Đang tải thông tin sản phẩm...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={styles.notFound}>
        <h2>Không tìm thấy sản phẩm</h2>
        <Link to={PATHS.HOME} className={styles.backBtn}>
          ← Về trang chủ
        </Link>
      </div>
    );
  }

  const categoryName = product.category?.categoryName || product.categoryName || 'Nông sản sạch';
  const supplierName = product.supplier?.supplierName || 'FreshMart Farms VietGAP';
  const price = product.price || 0;
  const unit = product.unit || 'KG';
  const displayUnit = PRODUCT_UNIT_LABELS[unit?.toUpperCase()] || unit;
  const stock = product.stock ?? 100;
  const ratingAverage = product.ratingAverage || summary?.averageRating || 5.0;
  const totalReviews = product.totalReviews || reviews.length;

  return (
    <div className={styles.detailContainer}>
      {/* Breadcrumb */}
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <Link to={PATHS.HOME}>Trang chủ</Link>
        <span>/</span>
        <span>{categoryName}</span>
        <span>/</span>
        <span className={styles.current}>{product.productName || product.name}</span>
      </nav>

      {/* Main Showcase Grid */}
      <div className={styles.showcaseGrid}>
        {/* Left Column: Image */}
        <div className={styles.imageColumn}>
          <div className={styles.imageCard}>
            {product.imageUrl && product.imageUrl.startsWith('http') ? (
              <img
                src={product.imageUrl}
                alt={product.productName || product.name}
                className={styles.mainImage}
              />
            ) : (
              <div className={styles.fallbackGraphic}>
                <span>{product.icon || '🥦'}</span>
              </div>
            )}
            <span className={styles.freshBadge}>★ 100% ORGANIC & FRESH</span>
          </div>
        </div>

        {/* Right Column: Information & Actions */}
        <div className={styles.infoColumn}>
          <div className={styles.categoryPill}>{categoryName}</div>
          <h1 className={styles.productTitle}>{product.productName || product.name}</h1>

          {/* Rating Summary */}
          <div className={styles.ratingBar}>
            <div className={styles.stars}>
              {'★'.repeat(Math.round(ratingAverage))}
              {'☆'.repeat(5 - Math.round(ratingAverage))}
            </div>
            <span className={styles.ratingScore}>{ratingAverage}</span>
            <span className={styles.dot}>•</span>
            <a href="#reviews-section" className={styles.reviewCountLink}>
              {totalReviews} đánh giá từ khách hàng
            </a>
          </div>

          {/* Pricing Box */}
          <div className={styles.priceBox}>
            <div className={styles.currentPrice}>
              <span className={styles.amount}>{formatVND(price)}</span>
              <span className={styles.unitText}>/ {displayUnit}</span>
            </div>
            {product.vat !== undefined && (
              <span className={styles.vatText}>(Đã bao gồm VAT {product.vat}%)</span>
            )}
          </div>

          {/* Specs List */}
          <div className={styles.specsList}>
            <div className={styles.specRow}>
              <span className={styles.specLabel}>Nhà cung cấp:</span>
              <strong className={styles.specValue}>{supplierName}</strong>
            </div>
            <div className={styles.specRow}>
              <span className={styles.specLabel}>Tình trạng tồn kho:</span>
              <span className={`${styles.stockBadge} ${stock > 0 ? styles.inStock : styles.outOfStock}`}>
                {stock > 0 ? `Còn hàng (${stock} ${displayUnit})` : 'Tạm hết hàng'}
              </span>
            </div>
            {product.expiryDate && (
              <div className={styles.specRow}>
                <span className={styles.specLabel}>Hạn sử dụng:</span>
                <span className={styles.specValue}>{formatDate(product.expiryDate)}</span>
              </div>
            )}
            <div className={styles.specRow}>
              <span className={styles.specLabel}>Cam kết FreshMart:</span>
              <span className={styles.specValue}>⚡ Giao hỏa tốc 30 phút • Đổi trả miễn phí trong ngày</span>
            </div>
          </div>

          {/* Quantity & Add to Cart */}
          <div className={styles.actionSection}>
            <div className={styles.quantityPicker}>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
              >
                −
              </button>
              <span>{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                disabled={quantity >= stock}
              >
                +
              </button>
            </div>

            <button
              type="button"
              className={styles.addToCartBtn}
              onClick={handleAddToCart}
              disabled={stock <= 0}
            >
              🛒 Thêm {quantity} vào giỏ hàng • {formatVND(price * quantity)}
            </button>
          </div>
        </div>
      </div>

      {/* Reviews & Customer Feedback Section */}
      <section id="reviews-section" className={styles.reviewsSection}>
        <div className={styles.reviewHeader}>
          <h2>⭐ Đánh Giá & Nhận Xét Của Khách Hàng</h2>
          <div className={styles.ratingBadge}>
            <strong>{ratingAverage} / 5.0</strong> ({totalReviews} lượt đánh giá)
          </div>
        </div>

        {/* Notice for Review Policy */}
        <div style={{
          margin: '16px 0 24px',
          padding: '14px 18px',
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '13.5px',
          color: '#475569'
        }}>
          <span style={{ fontSize: '20px' }}>🛡️</span>
          <span>
            Để đảm bảo tính khách quan và tin cậy, tính năng đánh giá sản phẩm chỉ dành cho khách hàng đã mua và thanh toán đơn hàng thành công trong mục <strong>Đơn hàng của bạn</strong>.
          </span>
        </div>

        {/* Reviews List */}
        <div className={styles.reviewList}>
          {reviews.length === 0 ? (
            <p className={styles.noReviews}>Chưa có bài đánh giá nào cho sản phẩm này.</p>
          ) : (
            reviews.map((rev) => (
              <div key={rev.reviewId} className={styles.reviewCard}>
                <div className={styles.revHeader}>
                  <div className={styles.reviewerAvatar}>
                    {(rev.customer?.fullName || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div className={styles.reviewerMeta}>
                    <strong>{rev.customer?.fullName || rev.customer?.username || 'Khách hàng ẩn danh'}</strong>
                    <span className={styles.revDate}>{formatDate(rev.createdAt, true)}</span>
                  </div>
                  <div className={styles.revRating}>
                    {'★'.repeat(rev.rating)}
                    <span className={styles.emptyStars}>{'☆'.repeat(5 - rev.rating)}</span>
                  </div>
                </div>
                <p className={styles.revContent}>{rev.comment}</p>

                {rev.reply && (
                  <div style={{
                    marginTop: '12px',
                    padding: '12px 14px',
                    background: '#f0fdf4',
                    borderLeft: '3px solid #10b981',
                    borderRadius: '0 8px 8px 0'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <strong style={{ fontSize: '13px', color: '#047857' }}>💬 Phản hồi từ FreshMart:</strong>
                      {rev.repliedAt && (
                        <span style={{ fontSize: '12px', color: '#64748b' }}>
                          {formatDate(rev.repliedAt, true)}
                        </span>
                      )}
                    </div>
                    <p style={{ margin: 0, fontSize: '13.5px', color: '#1e293b' }}>{rev.reply}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;
