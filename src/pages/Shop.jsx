import { useEffect, useMemo, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CATEGORIES, effectivePrice } from '../data/products';
import { useSEO } from '../hooks/useSEO';
import { useAdmin } from '../context/AdminContext';
import ProductCard from '../components/ProductCard';
import { FilterIcon, SearchIcon } from '../components/Icons';

const SORTS = [
  { id: 'featured', label: 'Featured' },
  { id: 'newest', label: 'Newest' },
  { id: 'price-asc', label: 'Price: low to high' },
  { id: 'price-desc', label: 'Price: high to low' },
  { id: 'name', label: 'Name: A–Z' },
];

export default function Shop() {
  const [params, setParams] = useSearchParams();
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

  const catLabel = CATEGORIES.find((c) => c.id === category)?.label;
  useSEO(catLabel || (sale ? 'Sale' : 'Shop'), `Shop ${catLabel || 'all fashion'} at STOCK STORE — premium clothing, shoes and accessories.`);

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
      newest: (a, b) => Number(b.isNew) - Number(a.isNew),
    }[sort];
    if (by) r = [...r].sort(by);
    return r;
  }, [category, q, sort, min, max, sale]);

  const hasFilters = category !== 'all' || q || min || max || sale || sort !== 'featured';

  return (
    <div className="container shop">
      <div className="page-head">
        <p className="eyebrow">{sale ? 'Special offers' : 'The collection'}</p>
        <h1>{catLabel || (sale ? 'Sale' : 'All products')}</h1>
      </div>

      <div className="shop-bar">
        <label className="search-field">
          <SearchIcon size={18} />
          <input
            type="search"
            value={q}
            onChange={(e) => update({ q: e.target.value })}
            placeholder="Search products…"
            aria-label="Search products"
          />
        </label>
        <button className="btn btn-outline filter-toggle" onClick={() => setShowFilters((s) => !s)} aria-expanded={showFilters}>
          <FilterIcon size={16} /> Filters
        </button>
        <label className="sort">
          <span className="sr-only">Sort by</span>
          <select value={sort} onChange={(e) => update({ sort: e.target.value })} aria-label="Sort products">
            {SORTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="shop-layout">
        {showFilters && (
          <button
            type="button"
            className="filter-backdrop"
            onClick={() => setShowFilters(false)}
            aria-label="Close filters"
          />
        )}
        <aside className={`filters ${showFilters ? 'open' : ''}`} aria-label="Filters">
          <div className="filter-drawer-head">
            <h2>Filters</h2>
            <button type="button" className="icon-btn" onClick={() => setShowFilters(false)} aria-label="Close filters">
              ×
            </button>
          </div>
          <div className="filter-group">
            <h3>Category</h3>
            <div className="chips">
              {[{ id: 'all', label: 'All' }, ...CATEGORIES].map((c) => (
                <button key={c.id} className={`chip ${category === c.id ? 'active' : ''}`} onClick={() => update({ category: c.id })}>
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <h3>Price (EGP)</h3>
            <div className="range">
              <input type="number" min="0" inputMode="numeric" placeholder="Min" value={min} onChange={(e) => update({ min: e.target.value })} aria-label="Minimum price" />
              <span>–</span>
              <input type="number" min="0" inputMode="numeric" placeholder="Max" value={max} onChange={(e) => update({ max: e.target.value })} aria-label="Maximum price" />
            </div>
          </div>

          <div className="filter-group">
            <label className="check">
              <input type="checkbox" checked={sale} onChange={(e) => update({ sale: e.target.checked })} />
              <span>On sale only</span>
            </label>
          </div>

          {hasFilters && (
            <button className="btn btn-outline btn-full" onClick={() => setParams({}, { replace: true })}>
              Clear all filters
            </button>
          )}
          <button className="btn btn-full filter-apply" type="button" onClick={() => setShowFilters(false)}>
            Show {list.length} {list.length === 1 ? 'product' : 'products'}
          </button>
        </aside>

        <section aria-live="polite">
          <p className="muted results-count">
            {list.length} {list.length === 1 ? 'product' : 'products'}
          </p>
          {list.length > 0 ? (
            <div className="grid grid-shop">
              {list.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="empty">
              <h2>No products found</h2>
              <p className="muted">Try adjusting your search or filters.</p>
              <button className="btn" onClick={() => setParams({}, { replace: true })}>
                Clear filters
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
