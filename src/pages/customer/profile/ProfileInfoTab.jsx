import React, { useEffect } from 'react';
import { Card, Descriptions, Tag, Avatar, Space, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import useAuthStore from '../../../stores/useAuthStore';
import { formatDate } from '../../../utils/formatDate';

export const ProfileInfoTab = ({ onNavigatePassword }) => {
  const { user, userType, fetchProfile } = useAuthStore();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const fullName = user?.fullName || user?.tenND || user?.username || user?.tenDangNhap;
  const username = user?.username || user?.tenDangNhap;
  const phone = user?.phoneNumber || user?.soDienThoai;
  const email = user?.email;
  const birthDate = user?.birthDate || user?.ngaySinh;

  return (
    <Card variant="borderless">
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Avatar size={64} style={{ backgroundColor: '#008848' }} icon={<UserOutlined />}>
              {(fullName || 'U').charAt(0).toUpperCase()}
            </Avatar>
            <div>
              <h2 style={{ margin: 0, fontSize: 20 }}>{fullName}</h2>
              <Tag color="green" style={{ marginTop: 4 }}>
                {userType === 'EMPLOYEE' ? (user?.position || 'Nhân viên') : 'Khách hàng thân thiết'}
              </Tag>
            </div>
          </div>
          {onNavigatePassword && (
            <Button icon={<LockOutlined />} onClick={onNavigatePassword}>
              Đổi mật khẩu
            </Button>
          )}
        </div>

        <Descriptions bordered column={1}>
          <Descriptions.Item label="Tên tài khoản">{username || '—'}</Descriptions.Item>
          <Descriptions.Item label="Họ và tên">{fullName || 'Chưa cập nhật'}</Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">{phone || 'Chưa cập nhật'}</Descriptions.Item>
          <Descriptions.Item label="Email">{email || 'Chưa cập nhật'}</Descriptions.Item>
          {birthDate && (
            <Descriptions.Item label="Ngày sinh">{formatDate(birthDate)}</Descriptions.Item>
          )}
        </Descriptions>
      </Space>
    </Card>
  );
};

export default ProfileInfoTab;
