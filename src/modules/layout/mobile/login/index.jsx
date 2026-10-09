import React from 'react';
import styles from './MobileLogin.module.scss';

export const MobileLogin = ({
  isRegister,
  setIsRegister,
  formData,
  handleChange,
  handleSubmit,
  isLoading,
  error,
  successMessage
}) => {
  return (
    <div className={styles.mobileLoginWrapper}>
      <div className={styles.brandHeader}>
        <h3>BÁCH HÓA XANH</h3>
        <p>Đăng nhập để nhận ưu đãi và mua sắm tiện lợi</p>
      </div>

      <div className={styles.tabs}>
        <button
          type="button"
          className={`${styles.tabItem} ${!isRegister ? styles.active : ''}`}
          onClick={() => setIsRegister(false)}
        >
          Đăng nhập
        </button>
        <button
          type="button"
          className={`${styles.tabItem} ${isRegister ? styles.active : ''}`}
          onClick={() => setIsRegister(true)}
        >
          Đăng ký
        </button>
      </div>

      {error && <div className={styles.alertError}>⚠️ {error}</div>}
      {successMessage && <div className={styles.alertSuccess}>🎉 {successMessage}</div>}

      <form onSubmit={handleSubmit}>
        {isRegister && (
          <>
            <div className={styles.formGroup}>
              <label htmlFor="m-fullName">Họ và tên *</label>
              <input
                id="m-fullName"
                name="fullName"
                type="text"
                required
                placeholder="Nguyễn Văn A"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="m-phoneNumber">Số điện thoại *</label>
              <input
                id="m-phoneNumber"
                name="phoneNumber"
                type="tel"
                required
                placeholder="0912345678"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="m-email">Email *</label>
              <input
                id="m-email"
                name="email"
                type="email"
                required
                placeholder="email@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="m-birthDate">Ngày sinh</label>
              <input
                id="m-birthDate"
                name="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={handleChange}
              />
            </div>
          </>
        )}

        <div className={styles.formGroup}>
          <label htmlFor="m-username">Tên đăng nhập *</label>
          <input
            id="m-username"
            name="username"
            type="text"
            required
            placeholder="Tên đăng nhập"
            value={formData.username}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="m-password">Mật khẩu *</label>
          <input
            id="m-password"
            name="password"
            type="password"
            required
            placeholder="Mật khẩu"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          className={styles.submitBtn}
          disabled={isLoading}
        >
          {isLoading
            ? 'Đang xử lý...'
            : isRegister
            ? 'Đăng ký ngay'
            : 'Đăng nhập'}
        </button>
      </form>
    </div>
  );
};

export default MobileLogin;
