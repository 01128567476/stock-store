import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

// Orders live in localStorage under 'mv-orders' (newest first). The admin
// dashboard reads the same key, so an order placed on this device shows up
// in /admin/orders immediately.
export const ORDERS_KEY = 'mv-orders';

const readOrders = () => {
  try {
    const raw = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
};

const writeOrders = (list) => {
  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(list));
  } catch {
    /* storage unavailable */
  }
};

const OrdersContext = createContext(null);

export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState(readOrders);

  // Keep admin dashboard in sync when an order is placed in another tab.
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === ORDERS_KEY) setOrders(readOrders());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const addOrder = useCallback((order) => {
    // Sequential ids starting at 1: next = highest existing number + 1.
    const nextNumber = orders.reduce((max, o) => Math.max(max, Number(o.number) || 0), 0) + 1;
    const full = { ...order, number: nextNumber, id: String(nextNumber), status: order.status || 'new' };
    const next = [full, ...orders];
    setOrders(next);
    writeOrders(next);
    return full;
  }, [orders]);

  const removeOrder = useCallback((id) => {
    setOrders((list) => {
      const next = list.filter((o) => o.id !== id);
      writeOrders(next);
      return next;
    });
  }, []);

  const updateOrderStatus = useCallback((id, status) => {
    setOrders((list) => {
      const next = list.map((o) => (o.id === id ? { ...o, status } : o));
      writeOrders(next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ orders, addOrder, removeOrder, updateOrderStatus }),
    [orders, addOrder, removeOrder, updateOrderStatus]
  );

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export const useOrders = () => useContext(OrdersContext);