import { createContext, useCallback, useContext, useEffect, useMemo } from 'react';
import { PRODUCTS } from '../data/products';
import { useLocalStorage } from '../hooks/useLocalStorage';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [storedIds, setStoredIds] = useLocalStorage('mv-wishlist', []);
  const validIds = useMemo(() => new Set(PRODUCTS.map((p) => p.id)), []);

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
