import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input, Badge, Dropdown, Avatar, Button } from 'antd';
import {
  ShoppingCartOutlined,
  UserOutlined,
  DashboardOutlined,
  ShoppingOutlined,
  LogoutOutlined,
  DownOutlined
} from '@ant-design/icons';
import useAuthStore from '../../../stores/useAuthStore';
import useCartStore from '../../../stores/useCartStore';
import { formatVND } from '../../../utils/formatCurrency';
import { PATHS } from '../../../constants/paths';
import styles from './Header.module.scss';

export const Header = ({ onSearchChange, searchValue = '' }) => {
  const navigate = useNavigate();
  const { user, userType, isAuthenticated, logout } = useAuthStore();
  const { totalItems, totalAmount, openCart } = useCartStore();
  const [keyword, setKeyword] = useState(searchValue);

  const handleSearch = (value) => {
    if (onSearchChange) {
      onSearchChange(value);
    } else {
      navigate(`${PATHS.HOME}?keyword=${encodeURIComponent(value)}`);
    }
  };

  const userMenuItems = [
    ...(userType === 'EMPLOYEE'
      ? [
          {
            key: 'admin',
            icon: <DashboardOutlined />,
            label: <Link to={PATHS.ADMIN.DASHBOARD}>Quản trị ({user?.position || 'STAFF'})</Link>
          }
        ]
      : []),
    {
      key: 'orders',
      icon: <ShoppingOutlined />,
      label: <Link to={PATHS.ORDERS}>Đơn hàng của tôi</Link>
    },
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: <Link to={PATHS.PROFILE}>Thông tin cá nhân</Link>
    },
    {
      type: 'divider'
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      danger: true,
      label: 'Đăng xuất',
      onClick: () => logout()
    }
  ];

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to={PATHS.HOME} className={styles.brand}>
          <div className={styles.brandLogo}>🥬</div>
          <div className={styles.brandInfo}>
            <span className={styles.brandName}>BÁCH HÓA XANH</span>
            <span className={styles.brandTagline}>THỰC PHẨM TƯƠI SẠCH MỖI NGÀY</span>
          </div>
        </Link>

        <div className={styles.searchWrapper}>
          <Input.Search
            placeholder="Tìm thịt, cá, rau củ quả, sữa tươi, nhu yếu phẩm..."
            allowClear
            enterButton="Tìm kiếm"
            size="large"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onSearch={handleSearch}
          />
        </div>

        <div className={styles.actionsGroup}>
          {isAuthenticated ? (
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
              <div className={styles.userBtn}>
                <Avatar style={{ backgroundColor: '#008848' }} icon={<UserOutlined />}>
                  {(user?.fullName || user?.username || 'U').charAt(0).toUpperCase()}
                </Avatar>
                <div className={styles.userMeta}>
                  <span className={styles.userHello}>Xin chào,</span>
                  <span className={styles.userName}>{user?.fullName || user?.username}</span>
                </div>
                <DownOutlined style={{ fontSize: 10, color: '#94a3b8' }} />
              </div>
            </Dropdown>
          ) : (
            <Link to={PATHS.LOGIN}>
              <Button type="default" icon={<UserOutlined />} shape="round" size="large">
                Đăng nhập
              </Button>
            </Link>
          )}

          {userType !== 'EMPLOYEE' && (
            <button type="button" className={styles.cartBtn} onClick={openCart}>
              <Badge count={totalItems} overflowCount={99} offset={[4, -4]} color="#f59e0b">
                <ShoppingCartOutlined style={{ fontSize: 20, color: '#fff' }} />
              </Badge>
              <span className={styles.cartTotal}>{formatVND(totalAmount)}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
