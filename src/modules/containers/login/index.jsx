import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useDeviceDetect from '../../../hooks/useDeviceDetect';
import useAuthStore from '../../../stores/useAuthStore';
import DefaultLayout from '../../layout/common/DefaultLayout';
import DefaultMobileLayout from '../../layout/common/DefaultMobileLayout';
import DesktopLogin from '../../layout/desktop/login';
import MobileLogin from '../../layout/mobile/login';

export const LoginContainer = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/';

  const { isMobile } = useDeviceDetect();
  const { login, register, isLoading, error, clearError } = useAuthStore();

  const [isRegister, setIsRegister] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullName: '',
    email: '',
    phoneNumber: '',
    birthDate: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) clearError();
  };

  const handleToggleTab = (registerTab) => {
    setIsRegister(registerTab);
    clearError();
    setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');

    if (isRegister) {
      // Thực hiện đăng ký
      const result = await register({
        username: formData.username,
        password: formData.password,
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        birthDate: formData.birthDate || undefined
      });

      if (result.success) {
        setSuccessMessage('Đăng ký tài khoản thành công! Bạn có thể đăng nhập ngay bây giờ.');
        setIsRegister(false); // Chuyển sang tab đăng nhập
      }
    } else {
      // Thực hiện đăng nhập
      const result = await login({
        username: formData.username,
        password: formData.password
      });

      if (result.success) {
        const displayName = result.data?.customer?.fullName || result.data?.employee?.fullName || formData.username;
        alert(`🎉 Đăng nhập thành công! Xin chào ${displayName}`);
        navigate(redirectPath, { replace: true });
      }
    }
  };

  const sharedProps = {
    isRegister,
    setIsRegister: handleToggleTab,
    formData,
    handleChange,
    handleSubmit,
    isLoading,
    error,
    successMessage
  };

  if (isMobile) {
    return (
      <DefaultMobileLayout>
        <MobileLogin {...sharedProps} />
      </DefaultMobileLayout>
    );
  }

  return (
    <DefaultLayout>
      <DesktopLogin {...sharedProps} />
    </DefaultLayout>
  );
};

export default LoginContainer;
