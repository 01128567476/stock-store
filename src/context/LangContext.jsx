import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { DEFAULT_LANG, LANG_STORAGE_KEY, SUPPORTED_LANGS, resources, isRTL } from '../i18n';

const LangContext = createContext(null);

const getInitialLang = () => {
  try {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    if (saved && SUPPORTED_LANGS.includes(saved)) return saved;
  } catch {
    /* storage unavailable */
  }
  return DEFAULT_LANG;
};

const get = (dict, key) =>
  key.split('.').reduce((node, part) => (node && typeof node === 'object' ? node[part] : undefined), dict);

export function LangProvider({ children }) {
  const [lang, setLang] = useState(getInitialLang);

  useEffect(() => {
    try {
      localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch {
      /* ignore */
    }
    const root = document.documentElement;
    root.setAttribute('lang', lang);
    root.setAttribute('dir', isRTL(lang) ? 'rtl' : 'ltr');
  }, [lang]);

  const t = useCallback(
    (key, vars) => {
      let value = get(resources[lang], key);
      if (value === undefined) value = get(resources.en, key);
      if (value === undefined) {
        // allow callers to provide a fallback through vars.defaultValue
        const fallback = vars && Object.prototype.hasOwnProperty.call(vars, 'defaultValue') ? vars.defaultValue : undefined;
        if (fallback !== undefined) value = fallback;
      }
      if (value === undefined) return key;
      if (typeof value !== 'string') return value;
      if (vars) {
        Object.entries(vars).forEach(([k, v]) => {
          if (k === 'defaultValue') return;
          value = value.replaceAll(`{${k}}`, String(v));
        });
      }
      return value;
    },
    [lang]
  );

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));
  }, []);

  const value = useMemo(
    () => ({ lang, dir: isRTL(lang) ? 'rtl' : 'ltr', rtl: isRTL(lang), t, toggleLang, setLang }),
    [lang, t, toggleLang]
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);
