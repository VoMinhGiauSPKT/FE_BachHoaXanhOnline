import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../../stores/useAuthStore';
import { PATHS } from '../../../routes/paths';
import styles from './AdminLayout.module.scss';

export const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
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
          <span>BÁCH HÓA XANH</span>
          <span className={styles.tag}>HỆ THỐNG QUẢN TRỊ</span>
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
          <div className={styles.menuSection}>Phân hệ tác vụ</div>

          <Link
            to={PATHS.ADMIN.DASHBOARD}
            className={`${styles.navItem} ${location.pathname === PATHS.ADMIN.DASHBOARD ? styles.active : ''}`}
          >
            <span className={styles.icon}>📊</span>
            <span>Tổng quan & Sản phẩm</span>
          </Link>

          <div
            className={styles.navItem}
            onClick={() => alert('Chức năng Quản lý Danh mục đang sẵn sàng mở rộng!')}
          >
            <span className={styles.icon}>🏷️</span>
            <span>Quản lý Danh mục</span>
          </div>

          <div
            className={styles.navItem}
            onClick={() => alert('Chức năng Quản lý Đơn hàng đang sẵn sàng mở rộng!')}
          >
            <span className={styles.icon}>📑</span>
            <span>Quản lý Đơn hàng</span>
          </div>

          {/* Phân quyền đặc quyền: Chỉ ADMIN mới thấy menu Quản lý nhân viên */}
          {isAdmin && (
            <>
              <div className={styles.menuSection} style={{ marginTop: '16px' }}>Đặc quyền Quản trị</div>
              <div
                className={styles.navItem}
                onClick={() => alert('Chức năng Quản lý Tài khoản Nhân viên (Dành riêng cho ADMIN)!')}
              >
                <span className={styles.icon}>👥</span>
                <span>Quản lý Nhân viên</span>
              </div>
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
