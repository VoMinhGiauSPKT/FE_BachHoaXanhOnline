import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes';
import ToastContainer from './components/Toast';
import CartDrawer from './components/CartDrawer';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppRoutes />
        <CartDrawer />
        <ToastContainer />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
