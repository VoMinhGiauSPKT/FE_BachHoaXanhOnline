import React from 'react';
import Header from './header';
import Footer from './footer';

export const DefaultLayout = ({ children, onSearchChange, searchValue }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f8fafc' }}>
      <Header onSearchChange={onSearchChange} searchValue={searchValue} />
      <main style={{ flex: 1, width: '100%', maxWidth: '1400px', margin: '0 auto', padding: '24px 24px 48px' }}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default DefaultLayout;
