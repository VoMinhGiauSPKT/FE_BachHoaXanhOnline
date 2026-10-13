import React from 'react';
import { Carousel } from 'antd';
import styles from './HomeBanner.module.scss';

export const HomeBanner = () => {
  const banners = [
    {
      title: '🥬 RAU CỦ & TRÁI CÂY TƯƠI SẠCH ĐÀ LẠT',
      subtitle: 'Chuẩn tiêu chuẩn VietGAP • Thu hoạch và giao ngay trong ngày',
      bg: 'linear-gradient(135deg, #008848 0%, #059669 100%)'
    },
    {
      title: '🥩 THỊT TƯƠI MỖI NGÀY - GIÁ TỐT BẬC NHẤT',
      subtitle: 'Thịt heo, bò Úc, cá hồi Na Uy tươi ngon chuẩn vị',
      bg: 'linear-gradient(135deg, #047857 0%, #0f766e 100%)'
    },
    {
      title: '⚡ GIAO HÀNG SIÊU TỐC TRONG 30 PHÚT',
      subtitle: 'Miễn phí vận chuyển cho đơn hàng từ 150.000đ',
      bg: 'linear-gradient(135deg, #065f46 0%, #064e3b 100%)'
    }
  ];

  return (
    <div className={styles.bannerWrapper}>
      <Carousel autoplay effect="fade">
        {banners.map((b, i) => (
          <div key={i}>
            <div className={styles.bannerSlide} style={{ background: b.bg }}>
              <div className={styles.content}>
                <h2>{b.title}</h2>
                <p>{b.subtitle}</p>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default HomeBanner;
