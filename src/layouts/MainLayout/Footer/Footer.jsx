import React from 'react';
import { Link } from 'react-router-dom';
import { PATHS } from '../../../constants/paths';
import styles from './Footer.module.scss';

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.col}>
          <div className={styles.brand}>🥬 BÁCH HÓA XANH ONLINE</div>
          <p className={styles.desc}>
            Chuỗi cửa hàng thực phẩm tươi sống, rau củ quả Đà Lạt chuẩn VietGAP, thịt cá tươi mới mỗi ngày.
            Giao hàng tận nơi siêu tốc trong 30 phút.
          </p>
        </div>

        <div className={styles.col}>
          <h4 className={styles.title}>Về chúng tôi</h4>
          <ul className={styles.linkList}>
            <li><Link to={PATHS.HOME}>Trang chủ</Link></li>
            <li><a href="#about">Giới thiệu công ty</a></li>
            <li><a href="#stores">Hệ thống siêu thị</a></li>
            <li><a href="#policy">Chính sách bảo mật</a></li>
          </ul>
        </div>

        <div className={styles.col}>
          <h4 className={styles.title}>Hỗ trợ khách hàng</h4>
          <ul className={styles.linkList}>
            <li><Link to={PATHS.ORDERS}>Tra cứu đơn hàng</Link></li>
            <li><a href="#delivery">Quy chế giao hàng</a></li>
            <li><a href="#return">Chính sách đổi trả</a></li>
            <li><a href="#contact">Liên hệ khiếu nại</a></li>
          </ul>
        </div>

        <div className={styles.col}>
          <h4 className={styles.title}>Tổng đài tư vấn (Miễn phí)</h4>
          <div className={styles.hotline}>1900 1908</div>
          <p className={styles.desc}>Từ 7:00 - 21:30 các ngày trong tuần</p>
        </div>
      </div>

      <div className={styles.bottomBar}>
        © 2026 Bách Hóa Xanh Online. Bản quyền thuộc Công ty Cổ phần Thương mại Bách Hóa Xanh.
      </div>
    </footer>
  );
};

export default Footer;
