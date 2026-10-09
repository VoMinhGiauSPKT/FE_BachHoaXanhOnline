import React from 'react';
import styles from './Footer.module.scss';

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.col}>
          <h4>BÁCH HÓA XANH ONLINE</h4>
          <p>Hệ thống siêu thị thực phẩm tươi sống, bách hóa tiện lợi, giao nhanh tận cửa.</p>
          <p>Hotline đặt hàng: 1900.1908 (7:00 - 21:30)</p>
        </div>
        <div className={styles.col}>
          <h4>HỖ TRỢ KHÁCH HÀNG</h4>
          <p>• Chính sách đổi trả & hoàn tiền</p>
          <p>• Hướng dẫn đặt hàng online</p>
          <p>• Chính sách giao hàng tận nơi</p>
        </div>
        <div className={styles.col}>
          <h4>KẾT NỐI VỚI CHÚNG TÔI</h4>
          <p>Backend API: bach-hoa-xanh-online.onrender.com</p>
          <p>Đồ án môn học: Lập Trình Web</p>
        </div>
      </div>
      <div className={styles.bottom}>
        © 2026 Bách Hóa Xanh Online - Đồ án Lập trình Web. Tất cả các quyền được bảo lưu.
      </div>
    </footer>
  );
};

export default Footer;
