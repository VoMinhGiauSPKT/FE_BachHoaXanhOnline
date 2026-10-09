import React from 'react';
import useDeviceDetect from '../../../hooks/useDeviceDetect';
import useRequireAuth from '../../../hooks/useRequireAuth';
import DefaultLayout from '../../layout/common/DefaultLayout';
import DefaultMobileLayout from '../../layout/common/DefaultMobileLayout';
import DesktopHome from '../../layout/desktop/home';
import MobileHome from '../../layout/mobile/home';
import { MOCK_PRODUCTS } from './constants';

export const HomeContainer = () => {
  const deviceInfo = useDeviceDetect();
  const { isMobile } = deviceInfo;
  const { requireAuth } = useRequireAuth();

  const handleAddToCart = (product) => {
    // Tái sử dụng hook requireAuth: nếu chưa đăng nhập -> alert + chuyển hướng sang login
    requireAuth(() => {
      alert(`✅ Đã thêm "${product.name}" vào giỏ hàng thành công!`);
    }, `Bạn cần đăng nhập để thêm "${product.name}" vào giỏ hàng hoặc tiến hành mua hàng!`);
  };

  const sharedProps = {
    products: MOCK_PRODUCTS,
    onAddToCart: handleAddToCart,
    deviceInfo
  };

  if (isMobile) {
    return (
      <DefaultMobileLayout>
        <MobileHome {...sharedProps} />
      </DefaultMobileLayout>
    );
  }

  return (
    <DefaultLayout>
      <DesktopHome {...sharedProps} />
    </DefaultLayout>
  );
};

export default HomeContainer;
