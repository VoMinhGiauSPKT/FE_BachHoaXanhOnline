import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import AppRoutes from './routes';
import ToastContainer from './components/Toast';
import CartDrawer from './components/CartDrawer';
import ErrorBoundary from './components/ErrorBoundary';

const antdTheme = {
  token: {
    colorPrimary: '#008848',
    colorSuccess: '#10b981',
    colorWarning: '#f59e0b',
    colorError: '#ef4444',
    colorInfo: '#0284c7',
    borderRadius: 8,
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
  }
};

function App() {
  return (
    <ConfigProvider theme={antdTheme}>
      <ErrorBoundary>
        <BrowserRouter>
          <AppRoutes />
          <CartDrawer />
          <ToastContainer />
        </BrowserRouter>
      </ErrorBoundary>
    </ConfigProvider>
  );
}

export default App;
