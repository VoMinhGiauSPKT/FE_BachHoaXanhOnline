import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../../stores/useAuthStore';
import { PATHS } from '../../../constants/paths';
import styles from './AdminLayout.module.scss';

export const AdminLayout = ({ children, activeTab = 'products', onTabChange }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const isAdmin = user?.position === 'ADMIN';

  const handleLogout = async () => {
    await logout();
    navigate(PATHS.LOGIN);
  };

  return (
    <div className={styles.adminWrapper}>
      {/* Header Admin */}
      <header className={styles.adminHeader}>
        <div className={styles.brandLogo}>
          <span className={styles.logoName}>FRESHMART</span>
          <span className={styles.tag}>HỆ THỐNG QUẢN TRỊ NỘI BỘ</span>
        </div>

        <div className={styles.userInfo}>
          <span className={styles.roleBadge}>
            {user?.position || 'STAFF'}
          </span>
          <span>Xin chào, <strong>{user?.fullName || user?.username}</strong></span>

          <Link to={PATHS.HOME} className={styles.shopLink}>
            🛒 Về trang mua hàng
          </Link>

          <button
            type="button"
            className={styles.logoutBtn}
            onClick={handleLogout}
          >
            Đăng xuất
          </button>
        </div>
      </header>

      {/* Thân giao diện: Sidebar + Main Content */}
      <div className={styles.bodyLayout}>
        <aside className={styles.sidebar}>
          <div className={styles.menuSection}>Danh mục nghiệp vụ</div>

          <button
            type="button"
            className={`${styles.navItem} ${activeTab === 'products' ? styles.active : ''}`}
            onClick={() => onTabChange && onTabChange('products')}
          >
            <span className={styles.icon}>📦</span>
            <span>Tổng quan & Sản phẩm</span>
          </button>

          <button
            type="button"
            className={`${styles.navItem} ${activeTab === 'categories' ? styles.active : ''}`}
            onClick={() => onTabChange && onTabChange('categories')}
          >
            <span className={styles.icon}>🏷️</span>
            <span>Quản lý Danh mục</span>
          </button>

          <button
            type="button"
            className={`${styles.navItem} ${activeTab === 'orders' ? styles.active : ''}`}
            onClick={() => onTabChange && onTabChange('orders')}
          >
            <span className={styles.icon}>📑</span>
            <span>Đơn hàng & Thu tiền COD</span>
          </button>

          <button
            type="button"
            className={`${styles.navItem} ${activeTab === 'reviews' ? styles.active : ''}`}
            onClick={() => onTabChange && onTabChange('reviews')}
          >
            <span className={styles.icon}>⭐</span>
            <span>Kiểm duyệt Đánh giá</span>
          </button>

          {/* Phân quyền đặc quyền: Chỉ ADMIN mới thấy menu Quản lý khuyến mãi & nhân viên */}
          {isAdmin && (
            <>
              <div className={styles.menuSection} style={{ marginTop: '16px' }}>Đặc quyền Quản trị</div>

              <button
                type="button"
                className={`${styles.navItem} ${activeTab === 'promotions' ? styles.active : ''}`}
                onClick={() => onTabChange && onTabChange('promotions')}
              >
                <span className={styles.icon}>🎁</span>
                <span>Quản lý Khuyến mãi</span>
              </button>

              <button
                type="button"
                className={`${styles.navItem} ${activeTab === 'employees' ? styles.active : ''}`}
                onClick={() => onTabChange && onTabChange('employees')}
              >
                <span className={styles.icon}>👥</span>
                <span>Quản lý Nhân viên</span>
              </button>
            </>
          )}
        </aside>

        <main className={styles.mainContent}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
