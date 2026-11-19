import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { PRODUCTS, CATEGORIES } from '../data/products';

const ADMIN_KEY = 'mv_admin';
const PRODUCTS_KEY = 'mv_products_admin';

const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123',
};

const initialProducts = JSON.parse(JSON.stringify(PRODUCTS));

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    try {
      return sessionStorage.getItem(ADMIN_KEY) === '1';
    } catch { return false; }
  });

  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem(PRODUCTS_KEY);
      return saved ? JSON.parse(saved) : initialProducts;
    } catch { return initialProducts; }
  });

  useEffect(() => {
    try { localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products)); } catch {}
  }, [products]);

  const login = useCallback((username, password) => {
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      setIsLoggedIn(true);
      try { sessionStorage.setItem(ADMIN_KEY, '1'); } catch {}
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    try { sessionStorage.removeItem(ADMIN_KEY); } catch {}
  }, []);

  const addProduct = useCallback((product) => {
    setProducts((prev) => [...prev, product]);
  }, []);

  const updateProduct = useCallback((id, updated) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updated } : p)));
  }, []);

  const deleteProduct = useCallback((id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const value = {
    isLoggedIn,
    login,
    logout,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
};