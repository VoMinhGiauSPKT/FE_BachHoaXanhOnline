import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, Tabs, Form, Input, Button, Alert, message } from 'antd';
import { UserOutlined, LockOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';
import MainLayout from '../../../layouts/MainLayout';
import useAuthStore from '../../../stores/useAuthStore';
import useCartStore from '../../../stores/useCartStore';
import { PATHS } from '../../../constants/paths';
import styles from './Auth.module.scss';

export const AuthPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect') || PATHS.HOME;

  const { login, register, isLoading, error, clearError } = useAuthStore();
  const { fetchCart } = useCartStore();
  const [activeTab, setActiveTab] = useState('login');
  const [loginForm] = Form.useForm();
  const [registerForm] = Form.useForm();

  const handleLoginSubmit = async (values) => {
    clearError();
    const res = await login({ username: values.username, password: values.password });
    if (res.success) {
      message.success('Đăng nhập thành công!');
      await fetchCart();
      if (res.userType === 'EMPLOYEE' || res.position === 'ADMIN' || res.position === 'STAFF') {
        navigate(PATHS.ADMIN.DASHBOARD);
      } else {
        navigate(redirectPath);
      }
    } else {
      message.error(res.message || 'Đăng nhập không thành công');
    }
  };

  const handleRegisterSubmit = async (values) => {
    clearError();
    const res = await register(values);
    if (res.success) {
      message.success('Đăng ký tài khoản thành công! Vui lòng đăng nhập.');
      setActiveTab('login');
      loginForm.setFieldsValue({ username: values.username });
    } else {
      message.error(res.message || 'Đăng ký không thành công');
    }
  };

  const items = [
    {
      key: 'login',
      label: 'Đăng nhập',
      children: (
        <Form form={loginForm} layout="vertical" onFinish={handleLoginSubmit}>
          <Form.Item
            name="username"
            label="Tên đăng nhập"
            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" size="large" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" size="large" />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={isLoading}
            style={{ marginTop: 12, height: 44, backgroundColor: '#008848', fontWeight: 700 }}
          >
            ĐĂNG NHẬP
          </Button>
        </Form>
      )
    },
    {
      key: 'register',
      label: 'Đăng ký tài khoản',
      children: (
        <Form form={registerForm} layout="vertical" onFinish={handleRegisterSubmit}>
          <Form.Item
            name="fullName"
            label="Họ và tên"
            rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
          >
            <Input placeholder="Nguyễn Văn A" size="large" />
          </Form.Item>

          <Form.Item
            name="username"
            label="Tên đăng nhập"
            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Tên đăng nhập mới" size="large" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: true, min: 6, message: 'Mật khẩu tối thiểu 6 ký tự' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" size="large" />
          </Form.Item>

          <Form.Item
            name="phoneNumber"
            label="Số điện thoại"
            rules={[{ required: true, message: 'Vui lòng nhập SĐT' }]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="0901234567" size="large" />
          </Form.Item>

          <Form.Item name="email" label="Email (Tùy chọn)">
            <Input prefix={<MailOutlined />} placeholder="email@domain.com" size="large" />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={isLoading}
            style={{ marginTop: 12, height: 44, backgroundColor: '#008848', fontWeight: 700 }}
          >
            TẠO TÀI KHOẢN
          </Button>
        </Form>
      )
    }
  ];

  return (
    <MainLayout>
      <div className={styles.authContainer}>
        <Card className={styles.authCard}>
          <div className={styles.brandHeader}>
            <div className={styles.logo}>🥬</div>
            <h2>BÁCH HÓA XANH ONLINE</h2>
            <p>Mua sắm thực phẩm tươi sạch mỗi ngày</p>
          </div>

          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              closable
              onClose={clearError}
              style={{ marginBottom: 16 }}
            />
          )}

          <Tabs activeKey={activeTab} onChange={setActiveTab} items={items} centered />
        </Card>
      </div>
    </MainLayout>
  );
};

export default AuthPage;
