import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Button, Avatar, Tag, Space, Dropdown } from 'antd';
import {
  AppstoreOutlined,
  FolderOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  GiftOutlined,
  TeamOutlined,
  CommentOutlined,
  LogoutOutlined,
  HomeOutlined,
  UserOutlined
} from '@ant-design/icons';
import useAuthStore from '../../stores/useAuthStore';
import { PATHS } from '../../constants/paths';
import styles from './AdminLayout.module.scss';

const { Header, Sider, Content } = Layout;

export const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);
  const isAdmin = user?.position === 'ADMIN';

  const menuItems = [
    {
      key: PATHS.ADMIN.PRODUCTS,
      icon: <AppstoreOutlined />,
      label: 'Quản lý Sản phẩm'
    },
    {
      key: PATHS.ADMIN.CATEGORIES,
      icon: <FolderOutlined />,
      label: 'Quản lý Danh mục'
    },
    {
      key: PATHS.ADMIN.SUPPLIERS,
      icon: <ShopOutlined />,
      label: 'Nhà cung cấp'
    },
    {
      key: PATHS.ADMIN.ORDERS,
      icon: <ShoppingCartOutlined />,
      label: 'Quản lý Đơn hàng'
    },
    ...(isAdmin
      ? [
          {
            key: PATHS.ADMIN.PROMOTIONS,
            icon: <GiftOutlined />,
            label: 'Khuyến mãi / Voucher'
          },
          {
            key: PATHS.ADMIN.EMPLOYEES,
            icon: <TeamOutlined />,
            label: 'Quản lý Nhân viên'
          }
        ]
      : []),
    {
      key: PATHS.ADMIN.REVIEWS,
      icon: <CommentOutlined />,
      label: 'Kiểm duyệt Đánh giá'
    }
  ];

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  const handleLogout = async () => {
    await logout();
    navigate(PATHS.LOGIN);
  };

  const userDropdownItems = [
    {
      key: 'shop',
      icon: <HomeOutlined />,
      label: <Link to={PATHS.HOME}>Trang mua hàng</Link>
    },
    {
      type: 'divider'
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      danger: true,
      label: 'Đăng xuất',
      onClick: handleLogout
    }
  ];

  return (
    <Layout className={styles.adminLayout}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        className={styles.sider}
        width={240}
      >
        <div className={styles.siderLogo}>
          <span className={styles.logoIcon}>🥬</span>
          {!collapsed && <span className={styles.logoTitle}>BHX Quản Trị</span>}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>

      <Layout>
        <Header className={styles.adminHeader}>
          <div className={styles.headerTitle}>HỆ THỐNG QUẢN TRỊ NỘI BỘ</div>
          <div className={styles.headerRight}>
            <Link to={PATHS.HOME}>
              <Button type="dashed" icon={<HomeOutlined />}>
                Xem trang Shop
              </Button>
            </Link>

            <Dropdown menu={{ items: userDropdownItems }} placement="bottomRight">
              <Space style={{ cursor: 'pointer' }}>
                <Avatar style={{ backgroundColor: '#008848' }} icon={<UserOutlined />}>
                  {(user?.fullName || user?.username || 'A').charAt(0).toUpperCase()}
                </Avatar>
                <span>{user?.fullName || user?.username}</span>
                <Tag color={isAdmin ? 'gold' : 'blue'}>{user?.position || 'STAFF'}</Tag>
              </Space>
            </Dropdown>
          </div>
        </Header>

        <Content className={styles.adminContent}>{children}</Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
