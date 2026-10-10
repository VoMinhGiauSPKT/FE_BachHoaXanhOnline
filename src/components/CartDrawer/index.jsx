import React from 'react';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../../stores/useCartStore';
import useAuthStore from '../../stores/useAuthStore';
import { formatVND } from '../../utils/formatCurrency';
import { PATHS } from '../../constants/paths';
import styles from './CartDrawer.module.scss';

export const CartDrawer = () => {
  const navigate = useNavigate();
  const { items, totalItems, totalAmount, isOpen, closeCart, updateQuantity, removeItem, clearCart } =
    useCartStore();
  const { isAuthenticated } = useAuthStore();
  const [showClearConfirm, setShowClearConfirm] = React.useState(false);

  if (!isOpen) return null;

  const handleCheckoutClick = () => {
    closeCart();
    if (!isAuthenticated) {
      navigate(`${PATHS.LOGIN}?redirect=${encodeURIComponent(PATHS.CHECKOUT)}`);
    } else {
      navigate(PATHS.CHECKOUT);
    }
  };

  const handleClearCart = async () => {
    await clearCart();
    setShowClearConfirm(false);
  };

  return (
    <div className={styles.overlay} onClick={closeCart}>
      <aside className={styles.drawer} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.titleWrap}>
            <h3>Giỏ Hàng Của Bạn</h3>
            <span className={styles.countBadge}>{totalItems} món</span>
          </div>
          <div className={styles.headerActions}>
            {items.length > 0 && (
              <button
                type="button"
                className={styles.clearCartBtn}
                onClick={() => setShowClearConfirm(true)}
                title="Xóa toàn bộ sản phẩm trong giỏ"
              >
                🗑️ Xóa tất cả
              </button>
            )}
            <button type="button" className={styles.closeBtn} onClick={closeCart} aria-label="Đóng">
              ✕
            </button>
          </div>
        </div>

        {/* Xác nhận xóa giỏ hàng */}
        {showClearConfirm && (
          <div className={styles.confirmClearBanner}>
            <span>Bạn muốn xóa tất cả sản phẩm khỏi giỏ hàng?</span>
            <div className={styles.confirmBtns}>
              <button type="button" className={styles.confirmYes} onClick={handleClearCart}>
                Đồng ý
              </button>
              <button type="button" className={styles.confirmNo} onClick={() => setShowClearConfirm(false)}>
                Hủy
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        <div className={styles.body}>
          {items.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🛒</div>
              <p className={styles.emptyTitle}>Giỏ hàng đang trống</p>
              <p className={styles.emptySubtitle}>Hãy chọn các loại rau củ, thịt cá tươi ngon vào giỏ nhé!</p>
              <button type="button" className={styles.shopNowBtn} onClick={closeCart}>
                Mua sắm ngay
              </button>
            </div>
          ) : (
            <div className={styles.itemList}>
              {items.map((item) => {
                const lineId = item.lineItemId;
                return (
                  <div key={lineId} className={styles.itemCard}>
                    <div className={styles.imageBox}>
                      {item.imageUrl && item.imageUrl.startsWith('http') ? (
                        <img src={item.imageUrl} alt={item.productName} />
                      ) : (
                        <span className={styles.fallbackIcon}>{item.imageUrl || '🥗'}</span>
                      )}
                    </div>

                    <div className={styles.itemInfo}>
                      <h4 className={styles.itemName}>{item.productName}</h4>
                      <div className={styles.itemMeta}>
                        <span className={styles.unit}>{item.unit || 'Phần'}</span>
                        <span className={styles.price}>{formatVND(item.price)}</span>
                      </div>

                      <div className={styles.actionRow}>
                        <div className={styles.counter}>
                          <button
                            type="button"
                            onClick={() => updateQuantity(lineId, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            aria-label="Giảm"
                          >
                            −
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(lineId, item.quantity + 1)}
                            aria-label="Tăng"
                          >
                            +
                          </button>
                        </div>

                        <div className={styles.itemSubtotal}>
                          {formatVND(item.itemTotal || item.price * item.quantity)}
                        </div>

                        <button
                          type="button"
                          className={styles.deleteBtn}
                          onClick={() => removeItem(lineId)}
                          aria-label="Xóa món"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.summaryRow}>
              <span>Tạm tính ({totalItems} sản phẩm):</span>
              <strong className={styles.totalValue}>{formatVND(totalAmount)}</strong>
            </div>
            <button
              type="button"
              className={styles.checkoutBtn}
              onClick={handleCheckoutClick}
            >
              Tiến hành Đặt Hàng →
            </button>
          </div>
        )}
      </aside>
    </div>
  );
};

export default CartDrawer;
