import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import productService from '../../../../services/productService';
import reviewService from '../../../../services/reviewService';
import useCartStore from '../../../../stores/useCartStore';
import useAuthStore from '../../../../stores/useAuthStore';
import useToastStore from '../../../../stores/useToastStore';
import { formatVND } from '../../../../utils/formatCurrency';
import { formatDate } from '../../../../utils/formatDate';
import { formatQuantity } from '../../../../utils/formatQuantity';
import { PATHS } from '../../../../constants/paths';
import { PRODUCT_UNIT_LABELS } from '../../../../constants/enums';
import { MOCK_PRODUCTS } from '../../../containers/home/constants';
import styles from './ProductDetail.module.scss';

const KG_PRESETS = [
  { label: '0,1 kg', sublabel: '100g', value: 0.1 },
  { label: '0,2 kg', sublabel: '200g', value: 0.2 },
  { label: '0,5 kg', sublabel: '500g', value: 0.5 },
  { label: '1 kg', sublabel: '1000g', value: 1.0 },
];

export const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, openCart } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  const { addToast } = useToastStore();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRating, setSelectedRating] = useState(null);
  const [isReviewsLoading, setIsReviewsLoading] = useState(false);

  const loadReviews = async (starRating = null) => {
    setIsReviewsLoading(true);
    try {
      const params = {};
      if (starRating !== null) {
        params.rating = starRating;
      }
      const revRes = await reviewService.getProductReviews(id, params);
      if (revRes.data) {
        setReviews(revRes.data.reviews || []);
        if (revRes.data.summary) {
          setSummary(revRes.data.summary);
        }
      }
    } catch {
      // Khi không có đánh giá hoặc API lỗi, để reviews rỗng và số lượt đánh giá bằng 0
      setReviews([]);
      setSummary((prev) => prev || {
        averageRating: 0.0,
        totalReviews: 0,
        starCounts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      });
    } finally {
      setIsReviewsLoading(false);
    }
  };

  const handleRatingFilterChange = (star) => {
    setSelectedRating(star);
    loadReviews(star);
  };

  // Load product detail & reviews
  useEffect(() => {
    const fetchDetail = async () => {
      setIsLoading(true);
      try {
        const prodRes = await productService.getProductById(id);
        if (prodRes.data) {
          setProduct(prodRes.data);
          const isKg = (prodRes.data.unit || '').toUpperCase() === 'KG';
          setQuantity(isKg ? 0.5 : 1);
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
        const isKg = (found.unit || '').toUpperCase() === 'KG';
        setQuantity(isKg ? 0.5 : 1);
      } finally {
        setIsLoading(false);
      }

      await loadReviews(null);
    };

    fetchDetail();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    const success = await addToCart(product, quantity);
    if (success) {
      openCart();
    }
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
  const isKg = (unit || '').toUpperCase() === 'KG';
  const displayUnit = PRODUCT_UNIT_LABELS[unit?.toUpperCase()] || unit;
  const stock = product.stock ?? 100;
  const calculatedTotal = Math.round(price * quantity);

  // Lấy dữ liệu rating chuẩn thực tế: ưu tiên summary API (tính tức thì từ DanhGia), sau đó tới product API
  const totalReviews = Number(
    summary?.totalReviews !== undefined
      ? summary.totalReviews
      : (product.totalReviews !== undefined ? product.totalReviews : reviews.length)
  );

  const rawRatingAvg = summary?.averageRating !== undefined
    ? summary.averageRating
    : (product.ratingAverage !== undefined ? product.ratingAverage : 0);
  const ratingAverage = Number(rawRatingAvg) || 0;
  const hasReviews = totalReviews > 0 && ratingAverage > 0;

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

          {/* Rating Summary: Chỉ hiển thị khi có đánh giá thật, ẩn sao và số lượng khi chưa có đánh giá */}
          {hasReviews && (
            <div className={styles.ratingBar}>
              <div className={styles.stars}>
                {'★'.repeat(Math.min(5, Math.max(1, Math.round(ratingAverage))))}
                {'☆'.repeat(Math.max(0, 5 - Math.min(5, Math.max(1, Math.round(ratingAverage)))))}
              </div>
              <span className={styles.ratingScore}>{ratingAverage.toFixed(1).replace(/\.0$/, '')}</span>
              <span className={styles.dot}>•</span>
              <a href="#reviews-section" className={styles.reviewCountLink}>
                {totalReviews} đánh giá từ khách hàng
              </a>
            </div>
          )}

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
              <span className={`${styles.stockBadge} ${stock <= 0 ? styles.outOfStock : stock < 10 ? styles.lowStock : styles.inStock}`}>
                {stock <= 0
                  ? 'Hết hàng'
                  : stock < 10
                  ? `Chỉ còn ${stock} ${displayUnit.toLowerCase()}`
                  : 'Còn hàng'}
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

          {/* Weight / Quantity Selection Box */}
          <div className={styles.weightCalculatorCard}>
            <div className={styles.calcHeader}>
              <span className={styles.calcTitle}>
                {isKg ? '⚖️ Chọn Khối Lượng Mua:' : '📦 Chọn Số Lượng Mua:'}
              </span>
              {isKg && (
                <span className={styles.unitHint}>
                  Giá bán: {formatVND(price)} / kg
                </span>
              )}
            </div>

            {/* Bộ nút chọn nhanh khối lượng cho sản phẩm theo kg */}
            {isKg && (
              <div className={styles.presetGrid}>
                {KG_PRESETS.map((p) => {
                  const isSelected = Math.abs(quantity - p.value) < 0.001;
                  const presetPrice = Math.round(price * p.value);
                  return (
                    <button
                      key={p.value}
                      type="button"
                      className={`${styles.presetBtn} ${isSelected ? styles.presetActive : ''}`}
                      onClick={() => setQuantity(p.value)}
                    >
                      <span className={styles.presetLabel}>{p.label}</span>
                      <span className={styles.presetSub}>({p.sublabel})</span>
                      <span className={styles.presetPrice}>{formatVND(presetPrice)}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Stepper điều chỉnh số lượng & Box thành tiền tự động tính */}
            <div className={styles.calcRow}>
              <div className={styles.quantityPicker}>
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((q) =>
                      isKg ? Math.max(0.1, Math.round((q - 0.1) * 10) / 10) : Math.max(1, q - 1)
                    )
                  }
                  disabled={isKg ? quantity <= 0.1 : quantity <= 1}
                  aria-label="Giảm bớt"
                >
                  −
                </button>
                <span className={styles.qtyDisplay}>
                  {formatQuantity(quantity)} {isKg ? 'kg' : ''}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((q) =>
                      isKg
                        ? Math.min(stock, Math.round((q + 0.1) * 10) / 10)
                        : Math.min(stock, q + 1)
                    )
                  }
                  disabled={quantity >= stock}
                  aria-label="Tăng thêm"
                >
                  +
                </button>
              </div>

              <div className={styles.liveCalculationBox}>
                <span className={styles.calcLabel}>
                  {isKg ? `Tạm tính (${formatQuantity(quantity)} kg):` : `Tạm tính (${quantity} món):`}
                </span>
                <span className={styles.calcAmount}>{formatVND(calculatedTotal)}</span>
              </div>
            </div>
          </div>

          {/* Action Button: Thêm vào giỏ */}
          <div className={styles.actionSection}>
            <button
              type="button"
              className={styles.addToCartBtn}
              onClick={handleAddToCart}
              disabled={stock <= 0}
            >
              🛒 Thêm {isKg ? `${formatQuantity(quantity)} kg` : `${quantity} ${displayUnit.toLowerCase()}`} vào giỏ hàng • {formatVND(calculatedTotal)}
            </button>
          </div>
        </div>
      </div>

      {/* Reviews & Customer Feedback Section */}
      <section id="reviews-section" className={styles.reviewsSection}>
        <div className={styles.reviewHeader}>
          <h2>⭐ Đánh Giá & Nhận Xét Của Khách Hàng</h2>
          {hasReviews ? (
            <div className={styles.ratingBadge}>
              <strong>{ratingAverage.toFixed(1)} / 5.0</strong> ({totalReviews} lượt đánh giá)
            </div>
          ) : (
            <div className={styles.noRatingBadge}>
              Chưa có đánh giá nào
            </div>
          )}
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

        {/* Rating Filter Buttons: Chỉ hiển thị khi sản phẩm có đánh giá */}
        {hasReviews && (
          <div className={styles.ratingFilterBar}>
            <span className={styles.filterTitle}>Lọc theo số sao:</span>
            <div className={styles.filterButtons}>
              <button
                type="button"
                className={`${styles.filterBtn} ${selectedRating === null ? styles.activeFilter : ''}`}
                onClick={() => handleRatingFilterChange(null)}
              >
                Tất cả ({summary?.totalReviews || reviews.length})
              </button>
              {[5, 4, 3, 2, 1].map((star) => {
                const count = summary?.starCounts?.[String(star)] ?? summary?.starCounts?.[star] ?? 0;
                return (
                  <button
                    key={star}
                    type="button"
                    className={`${styles.filterBtn} ${selectedRating === star ? styles.activeFilter : ''}`}
                    onClick={() => handleRatingFilterChange(star)}
                  >
                    {star} Sao ({count})
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Reviews List */}
        <div className={styles.reviewList}>
          {isReviewsLoading ? (
            <div className={styles.reviewLoading}>
              <div className={styles.smallSpinner} />
              <span>Đang tải đánh giá...</span>
            </div>
          ) : reviews.length === 0 ? (
            <p className={styles.noReviews}>
              {selectedRating
                ? `Chưa có bài đánh giá nào ${selectedRating} sao cho sản phẩm này.`
                : 'Chưa có bài đánh giá nào cho sản phẩm này.'}
            </p>
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
