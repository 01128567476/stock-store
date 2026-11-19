import { createContext, useCallback, useContext, useRef, useState } from 'react';
import { CheckIcon, CloseIcon, HeartIcon, HeartOffIcon } from '../components/Icons';

const ToastContext = createContext(() => {});

const ICONS = {
  success: CheckIcon,
  error: CloseIcon,
  wishlist: HeartIcon,
  'wishlist-remove': HeartOffIcon,
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const show = useCallback((message, type = 'success') => {
    const id = ++idRef.current;
    setToasts((t) => [...t.slice(-1), { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800);
  }, []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div className="toasts" aria-live="polite">
        {toasts.map((t) => {
          const Icon = ICONS[t.type] || CheckIcon;
          const iconProps = t.type === 'wishlist' ? { size: 16, filled: true } : { size: 16 };
          return (
            <div key={t.id} className={`toast ${t.type}`} role="status">
              <span className="toast-icon">
                <Icon {...iconProps} />
              </span>
              <span className="toast-msg">{t.message}</span>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
