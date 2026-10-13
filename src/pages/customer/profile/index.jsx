import React, { useEffect, useState } from 'react';
import { Card, Tabs } from 'antd';
import { UserOutlined, EnvironmentOutlined, LockOutlined } from '@ant-design/icons';
import MainLayout from '../../../layouts/MainLayout';
import { useAddressStore } from '../../../stores/useAddressStore';
import { useAuthStore } from '../../../stores/useAuthStore';
import ProfileInfoTab from './ProfileInfoTab';
import AddressBookTab from './AddressBookTab';
import ChangePasswordTab from './ChangePasswordTab';
import styles from './Profile.module.scss';

export const CustomerProfilePage = () => {
  const [activeTab, setActiveTab] = useState('info');
  const { fetchAddresses } = useAddressStore();
  const { fetchProfile } = useAuthStore();

  useEffect(() => {
    fetchProfile();
    fetchAddresses();
  }, [fetchProfile, fetchAddresses]);

  const items = [
    {
      key: 'info',
      icon: <UserOutlined />,
      label: 'Hồ sơ cá nhân',
      children: <ProfileInfoTab onNavigatePassword={() => setActiveTab('password')} />
    },
    {
      key: 'addresses',
      icon: <EnvironmentOutlined />,
      label: 'Sổ địa chỉ nhận hàng',
      children: <AddressBookTab />
    },
    {
      key: 'password',
      icon: <LockOutlined />,
      label: 'Đổi mật khẩu',
      children: <ChangePasswordTab />
    }
  ];

  return (
    <MainLayout>
      <div className={styles.profileContainer}>
        <Card title="Quản lý Tài Khoản">
          <Tabs activeKey={activeTab} onChange={setActiveTab} items={items} />
        </Card>
      </div>
    </MainLayout>
  );
};

export default CustomerProfilePage;
