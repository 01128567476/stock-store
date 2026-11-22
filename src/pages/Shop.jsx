import { useEffect, useMemo, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CATEGORIES, effectivePrice, sortByNewest, sortBySaleAndNewest } from '../data/products';
import { useSEO } from '../hooks/useSEO';
import { useAdmin } from '../context/AdminContext';
import { useLang } from '../context/LangContext';
import ProductCard from '../components/ProductCard';
import { FilterIcon, SearchIcon } from '../components/Icons';
import AdBanner from '../components/AdBanner';

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const { t } = useLang();
  const { products, isSeasonHidden } = useAdmin();
  const [showFilters, setShowFilters] = useState(false);
  const sidebarPushedRef = useRef(false);

  useEffect(() => {
    if (!showFilters) return undefined;

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    // Push ONE history entry so hardware Back closes the drawer first,
    // without changing the route/hash (stays on the Search page).
    history.pushState({ sidebar: true }, '');
    sidebarPushedRef.current = true;

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setShowFilters(false);
    };

    const closeOnOutside = (event) => {
      if (!(event.target instanceof Element)) return;
      if (event.target.closest('.filters, .filter-toggle')) return;
      // First tap anywhere outside the drawer: close it and swallow the
      // whole gesture so it never reaches whatever is underneath (product
      // cards, search, bottom nav, WhatsApp, etc.). We handle this on
      // `click` (not pointerdown/touchstart) so the backdrop is still
      // present when the click is dispatched — this prevents ghost clicks.
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      setShowFilters(false);
    };

    const handlePopState = () => {
      // Hardware Back while drawer is open: close it only.
      // Do not call history.back() again — the browser already navigated back.
      if (showFilters && sidebarPushedRef.current) {
        sidebarPushedRef.current = false;
        setShowFilters(false);
      }
    };

    window.addEventListener('keydown', closeOnEscape);
    window.addEventListener('popstate', handlePopState);
    document.addEventListener('click', closeOnOutside, true);

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      // Pop the sidebar entry only if we pushed it and state matches,
      // so no leftover history entries remain when closing via UI.
      if (sidebarPushedRef.current && history.state?.sidebar === true) {
        sidebarPushedRef.current = false;
        history.back();
      }
      window.removeEventListener('keydown', closeOnEscape);
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('click', closeOnOutside, true);
    };
  }, [showFilters]);

  const category = params.get('category') || 'all';
  const q = params.get('q') || '';
  const sort = params.get('sort') || 'featured';
  const min = params.get('min') || '';
  const max = params.get('max') || '';
  const sale = params.get('sale') === '1';

  const catId = CATEGORIES.find((c) => c.id === category)?.id;
  const catLabel = catId ? t(`category.${catId}`) : undefined;
  useSEO(catLabel || (sale ? t('shop.sale') : t('nav.shop')), `Shop ${catLabel || 'all fashion'} at STOCK STORE — premium apparel, sweaters, and shoes.`);

  const update = (patch) => {
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([k, v]) => {
      const empty = v === '' || v == null || v === false || v === 'all' || (k === 'sort' && v === 'featured');
      if (empty) next.delete(k);
      else next.set(k, v === true ? '1' : v);
    });
    setParams(next, { replace: true });
  };

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    const lo = min !== '' ? Number(min) : -Infinity;
    const hi = max !== '' ? Number(max) : Infinity;
    let r = products.filter((p) => {
      if (p.active === false) return false;
      if (isSeasonHidden(p.season)) return false;
      const price = effectivePrice(p);
      if (category !== 'all' && p.category !== category) return false;
      if (sale && p.salePrice == null) return false;
      if (price < lo || price > hi) return false;
      if (term) {
        const hay = `${p.name} ${p.category} ${p.description} ${p.colors.map((c) => c.name).join(' ')}`.toLowerCase();
        if (!hay.includes(term)) return false;
      }
      return true;
    });
    const by = {
      'price-asc': (a, b) => effectivePrice(a) - effectivePrice(b),
      'price-desc': (a, b) => effectivePrice(b) - effectivePrice(a),
      name: (a, b) => a.name.localeCompare(b.name),
      newest: (a, b) => (Number(b.createdAt) || 0) - (Number(a.createdAt) || 0),
    }[sort];
    if (sort === 'newest') r = sortByNewest(r);
    else if (by) r = [...r].sort(by);
    else r = sortBySaleAndNewest(r);
    return r;
  }, [category, q, sort, min, max, sale, isSeasonHidden]);

  const hasFilters = category !== 'all' || q || min || max || sale || sort !== 'featured';

  return (
    <>
      <AdBanner />
      <div className="container shop">
        <div className="page-head">
          <p className="eyebrow">{sale ? t('shop.specialOffers') : t('shop.theCollection')}</p>
          <h1>{catLabel || (sale ? t('shop.sale') : t('shop.allProducts'))}</h1>
        </div>

        <div className="shop-bar">
          <label className="search-field">
            <SearchIcon size={18} />
            <input
              type="search"
              value={q}
              onChange={(e) => update({ q: e.target.value })}
              placeholder={t('shop.searchPlaceholder')}
              aria-label={t('shop.searchPlaceholder')}
            />
          </label>
          <button className="btn btn-outline filter-toggle" onClick={() => setShowFilters((s) => !s)} aria-expanded={showFilters}>
            <FilterIcon size={16} /> {t('shop.filters')}
          </button>
        </div>

        <div className="shop-layout">
          {showFilters && (
            <button
              type="button"
              className="filter-backdrop"
              onClick={() => setShowFilters(false)}
              aria-label={t('shop.closeFilters')}
            />
          )}
          <aside className={`filters ${showFilters ? 'open' : ''}`} aria-label={t('shop.filters')}>
            <div className="filter-drawer-head">
              <h2>{t('shop.filters')}</h2>
              <button type="button" className="icon-btn" onClick={() => setShowFilters(false)} aria-label={t('shop.closeFilters')}>
                ×
              </button>
            </div>
            <div className="filter-group">
              <h3>{t('shop.category')}</h3>
              <div className="chips">
                <button className={`chip ${category === 'all' ? 'active' : ''}`} onClick={() => update({ category: 'all' })}>
                  {t('shop.all')}
                </button>
                {CATEGORIES.map((c) => (
                  <button key={c.id} className={`chip ${category === c.id ? 'active' : ''}`} onClick={() => update({ category: c.id })}>
                    {t(`category.${c.id}`)}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <h3>{t('shop.priceEgp')}</h3>
              <div className="range">
                <input type="number" min="0" inputMode="numeric" placeholder={t('shop.min')} value={min} onChange={(e) => update({ min: e.target.value })} aria-label={t('shop.min')} />
                <span>–</span>
                <input type="number" min="0" inputMode="numeric" placeholder={t('shop.max')} value={max} onChange={(e) => update({ max: e.target.value })} aria-label={t('shop.max')} />
              </div>
            </div>

            <div className="filter-group">
              <label className="check">
                <input type="checkbox" checked={sale} onChange={(e) => update({ sale: e.target.checked })} />
                <span>{t('shop.onSaleOnly')}</span>
              </label>
            </div>

            {hasFilters && (
              <button className="btn btn-outline btn-full" onClick={() => setParams({}, { replace: true })}>
                {t('shop.clearAllFilters')}
              </button>
            )}
            <button className="btn btn-full filter-apply" type="button" onClick={() => setShowFilters(false)}>
              {t('shop.showProducts', {
                count: list.length,
                label: list.length === 1 ? t('shop.product') : t('shop.products'),
              })}
            </button>
          </aside>

          <section aria-live="polite">
            <p className="muted results-count">
              {list.length} {list.length === 1 ? t('shop.product') : t('shop.products')}
            </p>
            {list.length > 0 ? (
              <div className="grid grid-shop">
                {list.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <div className="empty">
                <h2>{t('shop.noProductsFound')}</h2>
                <p className="muted">{t('shop.tryAdjusting')}</p>
                <button className="btn" onClick={() => setParams({}, { replace: true })}>
                  {t('shop.clearFilters')}
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
