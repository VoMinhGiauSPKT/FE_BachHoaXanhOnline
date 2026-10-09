import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../../stores/useAuthStore';
import useRequireAuth from '../../../hooks/useRequireAuth';
import styles from './DefaultMobileLayout.module.scss';

export const DefaultMobileLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuthStore();
  const { requireAuth } = useRequireAuth();

  const handleAuthAction = (targetUrl, message) => {
    requireAuth(() => navigate(targetUrl), message);
  };

  return (
    <div className={styles.mobileLayout}>
      {/* Mobile Top Header */}
      <header className={styles.mobileHeader}>
        <div className={styles.topRow}>
          <Link to="/" className={styles.brand}>BÁCH HÓA XANH</Link>
          <div className={styles.userShortcut}>
            {isAuthenticated ? (
              <span>👋 {user?.fullName || user?.username}</span>
            ) : (
              <Link to="/login" style={{ color: '#fed100', fontWeight: 'bold' }}>
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
        <div className={styles.searchBar}>
          <input type="text" placeholder="Tìm sản phẩm tươi ngon..." />
          <span className={styles.icon}>🔍</span>
        </div>
      </header>

      {/* Main Body */}
      <main className={styles.mobileContent}>
        {children}
      </main>

      {/* Bottom App Navigation Bar */}
      <nav className={styles.bottomNav}>
        <button
          type="button"
          className={`${styles.navItem} ${location.pathname === '/' ? styles.active : ''}`}
          onClick={() => navigate('/')}
        >
          <span className={styles.icon}>🏠</span>
          <span>Trang chủ</span>
        </button>

        <button
          type="button"
          className={styles.navItem}
          onClick={() => handleAuthAction('/cart', 'Vui lòng đăng nhập để xem giỏ hàng!')}
        >
          <span className={styles.icon}>🛒</span>
          <span>Giỏ hàng</span>
        </button>

        <button
          type="button"
          className={styles.navItem}
          onClick={() => handleAuthAction('/orders', 'Vui lòng đăng nhập để xem đơn hàng!')}
        >
          <span className={styles.icon}>📦</span>
          <span>Đơn hàng</span>
        </button>

        <button
          type="button"
          className={`${styles.navItem} ${location.pathname === '/login' ? styles.active : ''}`}
          onClick={() => navigate(isAuthenticated ? '/' : '/login')}
        >
          <span className={styles.icon}>👤</span>
          <span>{isAuthenticated ? 'Tài khoản' : 'Đăng nhập'}</span>
        </button>
      </nav>
    </div>
  );
};

export default DefaultMobileLayout;
