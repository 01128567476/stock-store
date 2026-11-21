import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { PRODUCTS, REMOVED_CATEGORY_IDS, TEST_PRODUCTS, normalizeSeason } from '../data/products';

const ADMIN_KEY = 'mv_admin';
const PRODUCTS_KEY = 'mv_products_admin';
const SWEATER_MIGRATION_KEY = 'mv_sweater_seeded_v4';
const TEST_PRODUCTS_MIGRATION_KEY = 'mv_test_products_seed_v1';
const SEASON_VISIBILITY_KEY = 'mv_hidden_seasons';

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
      if (!saved) {
        localStorage.setItem(SWEATER_MIGRATION_KEY, '1');
        localStorage.setItem(TEST_PRODUCTS_MIGRATION_KEY, '1');
        return initialProducts;
      }
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return initialProducts;
      const currentProducts = parsed.filter((product) => !REMOVED_CATEGORY_IDS.includes(product.category));
      if (localStorage.getItem(SWEATER_MIGRATION_KEY) !== '1') {
        const starterSweater = initialProducts.find((product) => product.category === 'sweaters');
        if (starterSweater) {
          if (!currentProducts.some((product) => product.id === starterSweater.id)) {
            currentProducts.push(starterSweater);
          }
          localStorage.setItem(SWEATER_MIGRATION_KEY, '1');
        }
      }
      if (localStorage.getItem(TEST_PRODUCTS_MIGRATION_KEY) !== '1') {
        const existingIds = new Set(currentProducts.map((product) => product.id));
        currentProducts.push(...TEST_PRODUCTS.filter((product) => !existingIds.has(product.id)));
        localStorage.setItem(TEST_PRODUCTS_MIGRATION_KEY, '1');
      }
      return currentProducts;
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
      p.id === id ? { ...p, active: p.active === false ? true : false } : p
    ));
    setStatus('success');
    setStatusMsg('Product status updated.');
  }, []);

  const [hiddenSeasons, setHiddenSeasons] = useState(() => {
    try {
      const saved = localStorage.getItem(SEASON_VISIBILITY_KEY);
      if (!saved) return {};
      const parsed = JSON.parse(saved);
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        throw new Error('Stored seasonal visibility settings must be an object.');
      }
      return {
        winter: parsed.winter === true,
        summer: parsed.summer === true,
      };
    } catch (error) {
      console.error('Unable to load seasonal visibility settings.', error);
      return {};
    }
  });

  const toggleSeasonVisibility = useCallback((season) => {
    const hidden = !hiddenSeasons[season];
    const next = { ...hiddenSeasons, [season]: hidden };
    try {
      localStorage.setItem(SEASON_VISIBILITY_KEY, JSON.stringify(next));
    } catch (error) {
      console.error('Unable to save seasonal visibility settings.', error);
      setStatus('error');
      setStatusMsg('Unable to save seasonal visibility settings. Please try again.');
      return;
    }
    setHiddenSeasons(next);
    setStatus('success');
    const label = season === 'winter' ? 'Winter' : 'Summer';
    setStatusMsg(hidden
      ? `${label} products are hidden from the store.`
      : `${label} products are visible in the store.`);
  }, [hiddenSeasons]);

  const isSeasonHidden = useCallback(
    (season) => !!hiddenSeasons[normalizeSeason(season)],
    [hiddenSeasons]
  );

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
    toggleSeasonVisibility,
    isSeasonHidden,
    hiddenSeasons,
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