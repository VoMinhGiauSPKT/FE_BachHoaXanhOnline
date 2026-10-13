import React from 'react';
import styles from './RouteLoader.module.scss';

export const RouteLoader = () => (
  <div className={styles.loaderWrapper}>
    <div className={styles.spinner} />
    <span className={styles.text}>Đang tải trang...</span>
  </div>
);

export default RouteLoader;
