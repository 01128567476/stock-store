import { createContext, useCallback, useContext, useRef, useState } from 'react';
import { CheckIcon, CloseIcon, HeartIcon, HeartOffIcon } from '../components/Icons';
import { useLang } from './LangContext';

const ToastContext = createContext(() => {});

const ICONS = {
  success: CheckIcon,
  error: CloseIcon,
  wishlist: HeartIcon,
  'wishlist-remove': HeartOffIcon,
};

export function ToastProvider({ children }) {
  const { t } = useLang();
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const show = useCallback((key, type = 'success', values) => {
    const id = ++idRef.current;
    setToasts((current) => [...current.slice(-1), { id, key, values, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800);
  }, []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div className="toasts" aria-live="polite">
        {toasts.map((toast) => {
          const Icon = ICONS[toast.type] || CheckIcon;
          const iconProps = toast.type === 'wishlist' ? { size: 16, filled: true } : { size: 16 };
          return (
            <div key={toast.id} className={`toast ${toast.type}`} role="status">
              <span className="toast-icon">
                <Icon {...iconProps} />
              </span>
              <span className="toast-msg">{t(toast.key, toast.values)}</span>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
