import React from 'react';
import styles from './DesktopLogin.module.scss';

export const DesktopLogin = ({
  isRegister,
  setIsRegister,
  formData,
  validationErrors = {},
  handleChange,
  handleSubmit,
  isLoading,
  error,
  successMessage
}) => {
  return (
    <div className={styles.loginWrapper}>
      <div className={styles.loginCard}>
        {/* Cột trái: Banner thương hiệu FreshMart */}
        <div className={styles.bannerSide}>
          <div className={styles.brandHeader}>
            <h2>FRESHMART ONLINE</h2>
            <p>Mua sắm tươi ngon mỗi ngày, giao nhanh tận cửa với hàng ngàn ưu đãi hấp dẫn.</p>
          </div>

          <div className={styles.featuresList}>
            <div className={styles.featureItem}>
              <span className={styles.icon}>🥬</span>
              <span>Rau củ VietGAP, thịt cá tươi sống nhập mới mỗi ngày</span>
            </div>
            <div className={styles.featureItem}>
              <span className={styles.icon}>⚡</span>
              <span>Giao hàng hỏa tốc 30 phút đúng giờ tận cửa nhà</span>
            </div>
            <div className={styles.featureItem}>
              <span className={styles.icon}>💳</span>
              <span>Thanh toán Dynamic VietQR tiện lợi không dùng tiền mặt</span>
            </div>
            <div className={styles.featureItem}>
              <span className={styles.icon}>🎁</span>
              <span>Tích điểm đổi quà & Voucher giảm giá độc quyền</span>
            </div>
          </div>

          <div className={styles.footerNote}>
            Hệ thống siêu thị FreshMart - Bách Hóa Xanh Online
          </div>
        </div>

        {/* Cột phải: Form Đăng nhập / Đăng ký */}
        <div className={styles.formSide}>
          <div className={styles.tabsHeader}>
            <button
              type="button"
              className={`${styles.tabBtn} ${!isRegister ? styles.active : ''}`}
              onClick={() => setIsRegister(false)}
            >
              Đăng nhập
            </button>
            <button
              type="button"
              className={`${styles.tabBtn} ${isRegister ? styles.active : ''}`}
              onClick={() => setIsRegister(true)}
            >
              Đăng ký tài khoản
            </button>
          </div>

          {error && <div className={styles.alertError}>⚠️ {error}</div>}
          {successMessage && <div className={styles.alertSuccess}>🎉 {successMessage}</div>}

          <form onSubmit={handleSubmit} noValidate>
            {/* Form Đăng ký có thêm các trường */}
            {isRegister && (
              <>
                <div className={styles.formGroup}>
                  <label htmlFor="fullName">Họ và tên *</label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    placeholder="Nguyễn Văn A"
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                  {validationErrors.fullName && (
                    <span className={styles.inlineError}>{validationErrors.fullName}</span>
                  )}
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="phoneNumber">Số điện thoại *</label>
                    <input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      required
                      placeholder="0912345678"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                    />
                    {validationErrors.phoneNumber && (
                      <span className={styles.inlineError}>{validationErrors.phoneNumber}</span>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="email">Email *</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="email@example.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                    {validationErrors.email && (
                      <span className={styles.inlineError}>{validationErrors.email}</span>
                    )}
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="birthDate">Ngày sinh</label>
                  <input
                    id="birthDate"
                    name="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}

            {/* Các trường chung */}
            <div className={styles.formGroup}>
              <label htmlFor="username">Tên đăng nhập *</label>
              <input
                id="username"
                name="username"
                type="text"
                required
                placeholder="Nhập tên đăng nhập"
                value={formData.username}
                onChange={handleChange}
              />
              {validationErrors.username && (
                <span className={styles.inlineError}>{validationErrors.username}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password">Mật khẩu *</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
                value={formData.password}
                onChange={handleChange}
              />
              {validationErrors.password && (
                <span className={styles.inlineError}>{validationErrors.password}</span>
              )}
            </div>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isLoading}
            >
              {isLoading
                ? 'Đang xử lý...'
                : isRegister
                ? 'Đăng ký tài khoản'
                : 'Đăng nhập'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DesktopLogin;
