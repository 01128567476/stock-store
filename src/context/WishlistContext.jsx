import { createContext, useCallback, useContext, useEffect, useMemo } from 'react';
import { useAdmin } from '../context/AdminContext';
import { useLocalStorage } from '../hooks/useLocalStorage';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [storedIds, setStoredIds] = useLocalStorage('mv-wishlist', []);
  // Validate against the live catalog so admin-created products can be saved too.
  const { products } = useAdmin();
  const validIds = useMemo(() => new Set(products.map((p) => p.id)), [products]);

  // Ignore (and clean up) ids of products that no longer exist in the catalog.
  const ids = useMemo(
    () => (Array.isArray(storedIds) ? storedIds.filter((id) => validIds.has(id)) : []),
    [storedIds, validIds]
  );

  useEffect(() => {
    if (ids.length !== (Array.isArray(storedIds) ? storedIds.length : 0)) setStoredIds(ids);
  }, [ids, storedIds, setStoredIds]);

  const toggle = useCallback(
    (id) => {
      if (!validIds.has(id)) return;
      setStoredIds((prev) => {
        const clean = Array.isArray(prev) ? prev.filter((x) => validIds.has(x)) : [];
        return clean.includes(id) ? clean.filter((x) => x !== id) : [...clean, id];
      });
    },
    [setStoredIds, validIds]
  );

  const value = useMemo(() => ({ ids, toggle, has: (id) => ids.includes(id) }), [ids, toggle]);
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export const useWishlist = () => useContext(WishlistContext);
