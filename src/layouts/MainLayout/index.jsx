import React from 'react';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import styles from './MainLayout.module.scss';

export const MainLayout = ({ children, onSearchChange, searchValue }) => {
  return (
    <div className={styles.layoutWrapper}>
      <Header onSearchChange={onSearchChange} searchValue={searchValue} />
      <main className={styles.mainContent}>{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
