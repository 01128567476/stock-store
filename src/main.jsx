import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { AdminProvider } from './context/AdminContext';
import { ThemeProvider } from './context/ThemeContext';
import { LangProvider } from './context/LangContext';
import { ToastProvider } from './context/ToastContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AdminProvider>
        <LangProvider>
        <ThemeProvider>
          <ToastProvider>
            <WishlistProvider>
              <CartProvider>
                <App />
              </CartProvider>
            </WishlistProvider>
          </ToastProvider>
        </ThemeProvider>
        </LangProvider>
      </AdminProvider>
    </HashRouter>
  </StrictMode>
);
