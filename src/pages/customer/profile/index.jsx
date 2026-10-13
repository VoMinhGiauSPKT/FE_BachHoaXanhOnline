import React, { useEffect } from 'react';
import { Card, Tabs } from 'antd';
import { UserOutlined, EnvironmentOutlined } from '@ant-design/icons';
import MainLayout from '../../../layouts/MainLayout';
import { useAddressStore } from '../../../stores/useAddressStore';
import ProfileInfoTab from './ProfileInfoTab';
import AddressBookTab from './AddressBookTab';
import styles from './Profile.module.scss';

export const CustomerProfilePage = () => {
  const { fetchAddresses } = useAddressStore();

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const items = [
    {
      key: 'info',
      icon: <UserOutlined />,
      label: 'Hồ sơ cá nhân',
      children: <ProfileInfoTab />
    },
    {
      key: 'addresses',
      icon: <EnvironmentOutlined />,
      label: 'Sổ địa chỉ nhận hàng',
      children: <AddressBookTab />
    }
  ];

  return (
    <MainLayout>
      <div className={styles.profileContainer}>
        <Card title="Quản lý Tài Khoản">
          <Tabs defaultActiveKey="info" items={items} />
        </Card>
      </div>
    </MainLayout>
  );
};

export default CustomerProfilePage;
