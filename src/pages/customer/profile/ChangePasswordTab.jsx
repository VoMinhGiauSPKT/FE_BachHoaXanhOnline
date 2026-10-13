import React, { useState } from 'react';
import { Card, Form, Input, Button, message, Alert } from 'antd';
import { LockOutlined, KeyOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../../stores/useAuthStore';
import { PATHS } from '../../../constants/paths';

export const ChangePasswordTab = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { changePassword, logout } = useAuthStore();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    const res = await changePassword({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
      confirmPassword: values.confirmPassword
    });
    setLoading(false);

    if (res.success) {
      message.success(res.message || 'Đổi mật khẩu thành công! Vui lòng đăng nhập lại.');
      form.resetFields();
      setTimeout(async () => {
        await logout();
        navigate(PATHS.LOGIN);
      }, 1500);
    } else {
      message.error(res.message || 'Đổi mật khẩu thất bại!');
    }
  };

  return (
    <Card variant="borderless" style={{ maxWidth: 520, margin: '0 auto' }}>
      <Alert
        message="Bảo mật tài khoản"
        description="Mật khẩu mới phải từ 6 ký tự trở lên. Sau khi đổi mật khẩu thành công, bạn sẽ cần đăng nhập lại với mật khẩu mới."
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />

      <Form form={form} layout="vertical" onFinish={onFinish} autoComplete="off">
        <Form.Item
          name="currentPassword"
          label="Mật khẩu hiện tại"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại' }]}
        >
          <Input.Password
            prefix={<KeyOutlined />}
            placeholder="Nhập mật khẩu đang sử dụng"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="newPassword"
          label="Mật khẩu mới"
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu mới' },
            { min: 6, message: 'Mật khẩu mới phải từ 6 ký tự trở lên' }
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="Xác nhận mật khẩu mới"
          dependencies={['newPassword']}
          rules={[
            { required: true, message: 'Vui lòng xác nhận mật khẩu mới' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Mật khẩu xác nhận không trùng khớp!'));
              }
            })
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Nhập lại mật khẩu mới"
            size="large"
          />
        </Form.Item>

        <Form.Item style={{ marginTop: 24 }}>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            size="large"
            block
            style={{ backgroundColor: '#008848', borderColor: '#008848' }}
          >
            Đổi mật khẩu
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ChangePasswordTab;
