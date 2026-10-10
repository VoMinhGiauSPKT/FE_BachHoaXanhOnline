import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PATHS } from '../../../constants/paths';
import useDeviceDetect from '../../../hooks/useDeviceDetect';
import useAuthStore from '../../../stores/useAuthStore';
import useCartStore from '../../../stores/useCartStore';
import useToastStore from '../../../stores/useToastStore';
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
  const { fetchCart } = useCartStore();
  const { addToast } = useToastStore();

  const [isRegister, setIsRegister] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

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
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleToggleTab = (registerTab) => {
    setIsRegister(registerTab);
    clearError();
    setSuccessMessage('');
    setValidationErrors({});
  };

  const validate = () => {
    const errors = {};
    if (!formData.username.trim()) {
      errors.username = 'Vui lòng nhập tên đăng nhập';
    }
    if (!formData.password) {
      errors.password = 'Vui lòng nhập mật khẩu';
    } else if (formData.password.length < 6) {
      errors.password = 'Mật khẩu phải có tối thiểu 6 ký tự';
    }

    if (isRegister) {
      if (!formData.fullName.trim()) {
        errors.fullName = 'Vui lòng nhập họ và tên';
      }
      if (!formData.email.trim()) {
        errors.email = 'Vui lòng nhập địa chỉ email';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = 'Email không đúng định dạng';
      }

      const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
      if (!formData.phoneNumber.trim()) {
        errors.phoneNumber = 'Vui lòng nhập số điện thoại';
      } else if (!phoneRegex.test(formData.phoneNumber)) {
        errors.phoneNumber = 'Số điện thoại không hợp lệ (10 chữ số, VD: 0912345678)';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');

    if (!validate()) {
      addToast({ type: 'warning', message: 'Vui lòng kiểm tra lại các trường thông tin!' });
      return;
    }

    if (isRegister) {
      const result = await register({
        username: formData.username,
        password: formData.password,
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        birthDate: formData.birthDate || undefined
      });

      if (result.success) {
        addToast({
          type: 'success',
          message: 'Đăng ký tài khoản thành công! Bạn có thể đăng nhập ngay.'
        });
        setSuccessMessage('Đăng ký tài khoản thành công! Bạn có thể đăng nhập ngay bây giờ.');
        setIsRegister(false);
      } else {
        addToast({
          type: 'error',
          message: result.message || 'Đăng ký không thành công'
        });
      }
    } else {
      const result = await login({
        username: formData.username,
        password: formData.password
      });

      if (result.success) {
        const userType = result.data?.userType;
        const displayName =
          result.data?.customer?.fullName || result.data?.employee?.fullName || formData.username;

        addToast({
          type: 'success',
          message: `Chào mừng ${displayName} đã đăng nhập thành công!`
        });

        if (userType === 'EMPLOYEE') {
          navigate(PATHS.ADMIN.DASHBOARD, { replace: true });
        } else {
          // Đồng bộ giỏ hàng từ server cho khách hàng
          await fetchCart();
          navigate(redirectPath || PATHS.HOME, { replace: true });
        }
      } else {
        addToast({
          type: 'error',
          message: result.message || 'Tên đăng nhập hoặc mật khẩu không chính xác'
        });
      }
    }
  };

  const sharedProps = {
    isRegister,
    setIsRegister: handleToggleTab,
    formData,
    validationErrors,
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
