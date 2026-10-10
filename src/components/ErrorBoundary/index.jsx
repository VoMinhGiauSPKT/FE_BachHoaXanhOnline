import React from 'react';
import styles from './ErrorBoundary.module.scss';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.errorContainer}>
          <div className={styles.errorCard}>
            <div className={styles.errorIcon}>⚠️</div>
            <h2>Đã Có Lỗi Bất Ngờ Xảy Ra</h2>
            <p>
              Hệ thống đã ghi nhận sự cố. Vui lòng thử tải lại trang hoặc quay về trang chủ.
            </p>
            <div className={styles.actions}>
              <button
                type="button"
                className={styles.reloadBtn}
                onClick={this.handleReload}
              >
                Tải lại trang
              </button>
              <a href="/" className={styles.homeBtn}>
                Về trang chủ FreshMart
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
