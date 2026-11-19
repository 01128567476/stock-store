import { useEffect } from 'react';
import { STORE } from '../config';

const DEFAULT_DESC =
  "Discover the latest fashion trends. Premium men's clothing, shoes and accessories with cash on delivery.";

export function useSEO(title, description = DEFAULT_DESC) {
  useEffect(() => {
    document.title = title ? `${title} — ${STORE.name}` : `${STORE.name} — Wear Your Style`;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', description);
  }, [title, description]);
}
