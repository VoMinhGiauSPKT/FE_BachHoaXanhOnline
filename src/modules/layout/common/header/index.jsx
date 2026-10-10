import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../../../stores/useAuthStore';
import useCartStore from '../../../../stores/useCartStore';
import { formatVND } from '../../../../utils/formatCurrency';
import { PATHS } from '../../../../constants/paths';
import styles from './Header.module.scss';

export const Header = ({ onSearchChange, searchValue = '' }) => {
  const navigate = useNavigate();
  const { user, userType, isAuthenticated, logout } = useAuthStore();
  const { totalItems, totalAmount, openCart } = useCartStore();

  const [keyword, setKeyword] = useState(searchValue);
  const [selectedLocation, setSelectedLocation] = useState('Downtown Central');
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const locations = [
    'Downtown Central',
    'Thủ Đức - Võ Văn Ngân',
    'Bình Thạnh - Điện Biên Phủ',
    'Quận 1 - Bến Nghé',
    'Quận 7 - Phú Mỹ Hưng'
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearchChange) {
      onSearchChange(keyword);
    } else {
      navigate(`${PATHS.HOME}?keyword=${encodeURIComponent(keyword)}`);
    }
  };

  const handleInputChange = (e) => {
    setKeyword(e.target.value);
    if (onSearchChange) {
      onSearchChange(e.target.value);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Brand with Leaf Emblem */}
        <Link to={PATHS.HOME} className={styles.brand}>
          <div className={styles.leafEmblem}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" fill="#10b981" />
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" stroke="#ffffff" />
            </svg>
          </div>
          <div className={styles.brandText}>
            <span className={styles.brandMain}>FreshMart</span>
            <span className={styles.brandTag}>ORGANIC & SUPERMARKET</span>
          </div>
        </Link>

        {/* Location Selector Pill */}
        <div className={styles.locationWrap}>
          <button
            type="button"
            className={styles.locationPill}
            onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
            aria-expanded={isLocationDropdownOpen}
          >
            <span className={styles.pinIcon}>📍</span>
            <div className={styles.locText}>
              <span className={styles.locLabel}>DELIVER TO</span>
              <span className={styles.locVal}>{selectedLocation}</span>
            </div>
            <span className={styles.arrowIcon}>▾</span>
          </button>

          {isLocationDropdownOpen && (
            <div className={styles.locationMenu}>
              <div className={styles.menuTitle}>Chọn khu vực nhận hàng</div>
              {locations.map((loc) => (
                <div
                  key={loc}
                  className={`${styles.menuItem} ${loc === selectedLocation ? styles.activeItem : ''}`}
                  onClick={() => {
                    setSelectedLocation(loc);
                    setIsLocationDropdownOpen(false);
                  }}
                >
                  <span>{loc}</span>
                  {loc === selectedLocation && <span className={styles.check}>✓</span>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Live Search Bar */}
        <form className={styles.searchBar} onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search fresh apples, organic milk, ribeye steak, bakery..."
            value={keyword}
            onChange={handleInputChange}
          />
          <button type="submit" className={styles.searchButton} aria-label="Tìm kiếm">
            Search
          </button>
        </form>

        {/* User Pill & Cart */}
        <div className={styles.actionsGroup}>
          {/* User Sign In / Profile */}
          {isAuthenticated ? (
            <div className={styles.userWrapper}>
              <button
                type="button"
                className={styles.userPill}
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <div className={styles.avatar}>
                  {(user?.fullName || user?.username || 'U').charAt(0).toUpperCase()}
                </div>
                <div className={styles.userMeta}>
                  <span className={styles.userHello}>Xin chào</span>
                  <span className={styles.userName}>{user?.fullName || user?.username}</span>
                </div>
                <span className={styles.arrowIcon}>▾</span>
              </button>

              {isUserMenuOpen && (
                <div className={styles.userDropdown}>
                  {userType === 'EMPLOYEE' && (
                    <Link
                      to={PATHS.ADMIN.DASHBOARD}
                      className={styles.dropdownLink}
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      ⚙️ Bảng Quản Trị ({user?.position || 'STAFF'})
                    </Link>
                  )}
                  <Link
                    to={PATHS.ORDERS}
                    className={styles.dropdownLink}
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    📦 Đơn hàng của tôi
                  </Link>
                  <Link
                    to={PATHS.PROFILE}
                    className={styles.dropdownLink}
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    👤 Thông tin cá nhân
                  </Link>
                  <Link
                    to={PATHS.ADDRESSES}
                    className={styles.dropdownLink}
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    📍 Sổ địa chỉ
                  </Link>
                  <button
                    type="button"
                    className={`${styles.dropdownLink} ${styles.logoutOption}`}
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      logout();
                    }}
                  >
                    🚪 Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to={PATHS.LOGIN} className={styles.signInPill}>
              <span className={styles.userIcon}>👤</span>
              <span>Sign In</span>
            </Link>
          )}

          {/* Cart Trigger Pill with $ / VND and Badge count (Ẩn đối với Nhân viên/Admin) */}
          {userType !== 'EMPLOYEE' && (
            <button
              type="button"
              className={styles.cartButton}
              onClick={openCart}
              aria-label="Xem giỏ hàng"
            >
              <span className={styles.cartIcon}>🛒</span>
              <span className={styles.cartPrice}>{formatVND(totalAmount)}</span>
              <span className={styles.cartBadge}>[ {totalItems} ]</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
