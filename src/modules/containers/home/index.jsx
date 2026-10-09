import React from 'react';
import { useNavigate } from 'react-router-dom';
import useDeviceDetect from '../../../hooks/useDeviceDetect';
import useAuthStore from '../../../stores/useAuthStore';
import DefaultLayout from '../../layout/common/DefaultLayout';
import DefaultMobileLayout from '../../layout/common/DefaultMobileLayout';
import DesktopHome from '../../layout/desktop/home';
import MobileHome from '../../layout/mobile/home';

const MOCK_PRODUCTS = [
  {
    id: 'SP000001',
    name: 'Sữa tươi tiệt trùng Vinamilk Có đường 1L',
    price: 37500,
    icon: '🥛'
  },
  {
    id: 'SP000002',
    name: 'Gạo ST25 Ông Cua Túi 5kg',
    price: 210000,
    icon: '🌾'
  },
  {
    id: 'SP000003',
    name: 'Thịt ba rọi heo tươi CP (Khay 500g)',
    price: 85000,
    icon: '🥩'
  },
  {
    id: 'SP000004',
    name: 'Trứng gà tươi Ba Huân Hộp 10 quả',
    price: 32000,
    icon: '🥚'
  },
  {
    id: 'SP000005',
    name: 'Cà chua VietGAP Đạt chuẩn (Túi 1kg)',
    price: 28000,
    icon: '🍅'
  },
  {
    id: 'SP000006',
    name: 'Dầu ăn Neptune Gold Chai 1L',
    price: 52000,
    icon: '🍳'
  },
  {
    id: 'SP000007',
    name: 'Nước mắm Nam Ngư Đệ Nhị Chai 900ml',
    price: 33000,
    icon: '🍶'
  },
  {
    id: 'SP000008',
    name: 'Táo Envy New Zealand Tươi Giòn (1kg)',
    price: 119000,
    icon: '🍎'
  }
];

export const HomeContainer = () => {
  const navigate = useNavigate();
  const deviceInfo = useDeviceDetect();
  const { isMobile } = deviceInfo;
  const { isAuthenticated } = useAuthStore();

  const handleAddToCart = (product) => {
    // Nghiệp vụ cốt lõi: Xem sản phẩm bình thường, nhưng mua hàng / bỏ giỏ hàng cần xác thực
    if (!isAuthenticated) {
      alert(`⚠️ Bạn cần đăng nhập để thêm "${product.name}" vào giỏ hàng hoặc tiến hành mua hàng!`);
      navigate('/login?redirect=/');
      return;
    }

    alert(`✅ Đã thêm "${product.name}" vào giỏ hàng thành công!`);
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
