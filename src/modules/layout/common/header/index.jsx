import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../../../stores/useAuthStore';
import useRequireAuth from '../../../../hooks/useRequireAuth';
import styles from './Header.module.scss';

export const Header = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { requireAuth } = useRequireAuth();

  const handleCartClick = () => {
    requireAuth(() => navigate('/cart'), 'Vui lòng đăng nhập để xem giỏ hàng!');
  };

  return (
    <header className={styles.header}>
      <div className={styles.topBar}>
        {/* Logo */}
        <Link to="/" className={styles.logoArea}>
          <div className={styles.logo}>
            <span className={styles.brandName}>BÁCH HÓA XANH</span>
            <span className={styles.brandSub}>Thực phẩm tươi sống & Nhu yếu phẩm</span>
          </div>
        </Link>

        {/* Thanh tìm kiếm */}
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Bạn tìm thịt, cá, sữa tươi, rau củ hôm nay?..."
          />
          <button type="button" className={styles.searchBtn} aria-label="Tìm kiếm">
            🔍
          </button>
        </div>

        {/* Khu vực tài khoản & Giỏ hàng */}
        <div className={styles.userActions}>
          <button
            type="button"
            className={styles.actionBtn}
            onClick={handleCartClick}
          >
            🛒 <span>Giỏ hàng</span>
          </button>

          {isAuthenticated ? (
            <div className={styles.userProfile}>
              <span>Xin chào, </span>
              <span className={styles.userName}>
                {user?.fullName || user?.username || 'Khách hàng'}
              </span>
              <button
                type="button"
                className={styles.logoutBtn}
                onClick={logout}
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <Link to="/login" className={`${styles.actionBtn} ${styles.loginBtn}`}>
              👤 Đăng nhập
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
