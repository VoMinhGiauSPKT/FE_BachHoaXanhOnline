import React from 'react';
import { Card, Descriptions, Tag, Avatar, Space } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import useAuthStore from '../../../stores/useAuthStore';

export const ProfileInfoTab = () => {
  const { user, userType } = useAuthStore();

  return (
    <Card variant="borderless">
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Avatar size={64} style={{ backgroundColor: '#008848' }} icon={<UserOutlined />}>
            {(user?.fullName || user?.username || 'U').charAt(0).toUpperCase()}
          </Avatar>
          <div>
            <h2 style={{ margin: 0, fontSize: 20 }}>{user?.fullName || user?.username}</h2>
            <Tag color="green" style={{ marginTop: 4 }}>{userType === 'EMPLOYEE' ? user?.position : 'Khách hàng thân thiết'}</Tag>
          </div>
        </div>

        <Descriptions bordered column={1}>
          <Descriptions.Item label="Tên tài khoản">{user?.username}</Descriptions.Item>
          <Descriptions.Item label="Họ và tên">{user?.fullName || 'Chưa cập nhật'}</Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">{user?.phoneNumber || 'Chưa cập nhật'}</Descriptions.Item>
          <Descriptions.Item label="Email">{user?.email || 'Chưa cập nhật'}</Descriptions.Item>
        </Descriptions>
      </Space>
    </Card>
  );
};

export default ProfileInfoTab;
