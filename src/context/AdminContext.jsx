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
      if (!saved) return initialProducts;
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed) || parsed.length === 0) return initialProducts;
      return parsed;
    } catch { return initialProducts; }
  });

  const [status, setStatus] = useState(null); // 'loading' | 'success' | 'error'
  const [statusMsg, setStatusMsg] = useState('');

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
    setStatus('success');
    setStatusMsg('Product created successfully.');
  }, []);

  const updateProduct = useCallback((id, updated) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updated } : p)));
    setStatus('success');
    setStatusMsg('Product saved successfully.');
  }, []);

  const deleteProduct = useCallback((id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setStatus('success');
    setStatusMsg('Product deleted.');
  }, []);

  const toggleProductActive = useCallback((id) => {
    setProducts((prev) => prev.map((p) =>
      p.id === id ? { ...p, active: p.active !== false } : p
    ));
    setStatus('success');
    setStatusMsg('Product status updated.');
  }, []);

  const clearStatus = useCallback(() => {
    setStatus(null);
    setStatusMsg('');
  }, []);

  const value = {
    isLoggedIn,
    login,
    logout,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductActive,
    status,
    statusMsg,
    clearStatus,
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