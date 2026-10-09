import React from 'react';
import Header from './header';
import Footer from './footer';

export const DefaultLayout = ({ children }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f5f5f5' }}>
      <Header />
      <main style={{ flex: 1, width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '20px 16px' }}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default DefaultLayout;
