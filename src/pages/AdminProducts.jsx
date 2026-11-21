import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { CATEGORIES, SEASONS } from '../data/products';
import { money } from '../config';
import { EditIcon, TrashIcon, EyeIcon, EyeOffIcon, PlusIcon, SearchIcon } from '../components/Icons';

const SORT_OPTIONS = [
  { value: 'name-asc', label: 'Name A → Z' },
  { value: 'name-desc', label: 'Name Z → A' },
  { value: 'price-asc', label: 'Price: low → high' },
  { value: 'price-desc', label: 'Price: high → low' },
  { value: 'newest', label: 'Newest first' },
];

export default function AdminProducts() {
  const { products, deleteProduct, toggleProductActive, toggleSeasonVisibility, isSeasonHidden, status, statusMsg, clearStatus } = useAdmin();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [saleOnly, setSaleOnly] = useState(false);
  const [season, setSeason] = useState('all');
  const [sortBy, setSortBy] = useState('name-asc');
  const [confirmId, setConfirmId] = useState(null);

  const catLabel = (id) => CATEGORIES.find((c) => c.id === id)?.label || id;
  const seasonLabel = (id) => SEASONS.find((s) => s.id === id)?.label || id;
  const firstImage = (p) => Array.isArray(p.images) && p.images.length ? p.images[0] : '';

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = products.filter((p) => {
      const matchQ = !q || p.name.toLowerCase().includes(q);
      const matchC = category === 'all' || p.category === category;
      const matchSale = !saleOnly || p.salePrice != null;
      const matchS = season === 'all' || p.season === season;
      return matchQ && matchC && matchSale && matchS;
    });
    return [...list].sort((a, b) => {
      switch (sortBy) {
        case 'name-desc': return b.name.localeCompare(a.name);
        case 'price-asc': return (a.salePrice ?? a.price) - (b.salePrice ?? b.price);
        case 'price-desc': return (b.salePrice ?? b.price) - (a.salePrice ?? a.price);
        case 'newest': return b.id.localeCompare(a.id);
        default: return a.name.localeCompare(b.name);
      }
    });
  }, [products, query, category, saleOnly, season, sortBy]);

  useEffect(() => {
    if (!status) return undefined;
    const t = setTimeout(clearStatus, 4000);
    return () => clearTimeout(t);
  }, [status, clearStatus]);

  const activeFilters = query.trim() !== '' || category !== 'all' || saleOnly || season !== 'all';
  const resetFilters = () => { setQuery(''); setCategory('all'); setSaleOnly(false); setSeason('all'); };
  const target = products.find((p) => p.id === confirmId);

  const handleDelete = () => {
    if (!confirmId) return;
    deleteProduct(confirmId);
    setConfirmId(null);
  };

  const priceOf = (p) => p.salePrice ?? p.price;
  const pctOf = (p) => (p.salePrice != null && p.price > 0
    ? Math.round((1 - p.salePrice / p.price) * 100)
    : 0);

  return (
    <div className="admin-page">
      {status && statusMsg && (
        <div className={`admin-toast admin-toast--${status}`} onClick={clearStatus}>
          <span className="admin-toast-icon">{status === 'error' ? '!' : '✓'}</span>
          <span className="admin-toast-msg">{statusMsg}</span>
        </div>
      )}

      <div className="admin-page-head">
        <div>
          <h2>Products</h2>
          <p className="admin-page-sub">
            {filtered.length} of {products.length} product{products.length === 1 ? '' : 's'} shown
          </p>
        </div>
        <Link to="/admin/products/add" className="btn btn-lg admin-btn-accent">
          <PlusIcon size={17} />
          <span>Add Product</span>
        </Link>
      </div>

      <section className="admin-season-panel" aria-labelledby="admin-season-title">
        <div className="admin-season-panel-head">
          <div>
            <h3 id="admin-season-title">إدارة ظهور المنتجات حسب الموسم</h3>
            <p>التحكم هنا ينعكس مباشرة على المنتجات المعروضة في المتجر.</p>
          </div>
          <span className="admin-season-panel-badge">إعدادات المتجر</span>
        </div>
        <div className="admin-season-grid">
          {[
            { id: 'winter', label: 'المنتجات الشتوية' },
            { id: 'summer', label: 'المنتجات الصيفية' },
          ].map(({ id, label }) => {
            const hidden = isSeasonHidden(id);
            const count = products.filter((product) => product.season === id).length;
            return (
              <article key={id} className={`admin-season-card ${hidden ? 'is-hidden' : ''}`}>
                <div className="admin-season-copy">
                  <span className={`admin-season-indicator ${hidden ? 'is-hidden' : ''}`} aria-hidden="true" />
                  <div>
                    <h4>{label}</h4>
                    <p>
                      {hidden ? 'مخفية حاليًا عن المتجر' : 'ظاهرة حاليًا في المتجر'}
                      {' · '}{count} {count === 1 ? 'منتج' : 'منتجات'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className={`admin-season-action ${hidden ? 'is-hidden' : ''}`}
                  onClick={() => toggleSeasonVisibility(id)}
                  aria-pressed={!hidden}
                  aria-label={`${hidden ? 'إظهار' : 'إخفاء'} ${label} ${hidden ? 'في' : 'من'} المتجر`}
                >
                  {hidden ? <EyeIcon size={17} /> : <EyeOffIcon size={17} />}
                  <span>{hidden ? 'إظهار في المتجر' : 'إخفاء من المتجر'}</span>
                </button>
              </article>
            );
          })}
        </div>
      </section>

      <div className="admin-card admin-products-card">
        <div className="admin-toolbar">
          <div className="admin-search">
            <span className="admin-search-icon"><SearchIcon size={16} /></span>
            <input
              type="text"
              placeholder="Search products by name…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search products"
            />
          </div>
          <div className="admin-toolbar-filters">
            <select className="admin-select" value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Filter by category">
              <option value="all">All categories</option>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
            <select className="admin-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)} aria-label="Sort products">
              {SORT_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            <label className={"admin-check" + (saleOnly ? ' is-on' : '')}>
              <input type="checkbox" checked={saleOnly} onChange={(e) => setSaleOnly(e.target.checked)} />
              On sale
            </label>
            <select className="admin-select" value={season} onChange={(e) => setSeason(e.target.value)} aria-label="Filter by season">
              <option value="all">All seasons</option>
              {SEASONS.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>

            {activeFilters && (
              <button type="button" className="admin-clear-filters" onClick={resetFilters}>Clear</button>
            )}
          </div>
        </div>

        <div className="admin-table-wrap admin-desktop-only">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Discount</th>
                <th>Status</th>
                <th className="admin-th-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const pct = pctOf(p);
                const isActive = p.active !== false;
                return (
                  <tr key={p.id} className="admin-table-row">
                    <td>
                      <div className="admin-product-cell">
                        {firstImage(p)
                          ? <img src={firstImage(p)} alt={p.name} className="admin-table-img" />
                          : <div className="admin-table-img" aria-label="No product image" />}
                        <div className="admin-product-meta">
                          <span className="admin-table-name">{p.name}</span>
                          <span className="admin-colors-count">
                            {(p.colors || []).length} color{(p.colors || []).length === 1 ? '' : 's'}
                            {' · '}
                            {(p.sizes || []).length} size{(p.sizes || []).length === 1 ? '' : 's'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td><span className="admin-pill">{catLabel(p.category)}</span></td>
                    <td>
                      <div className="admin-price-cell">
                        <span className="admin-final-price">{money(priceOf(p))}</span>
                        {p.salePrice != null && <s className="admin-was">{money(p.price)}</s>}
                      </div>
                    </td>
                    <td>
                      {p.salePrice != null
                        ? <span className="admin-badge-discount">-{pct}%</span>
                        : <span className="admin-muted-dash">—</span>}
                    </td>
                    <td>
                      <span className={`admin-status ${isActive ? 'active' : 'hidden'}`}>
                        <span className="admin-status-dot" />
                        {isActive ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td>
                      <div className="admin-cell-actions">
                        <Link to={`/admin/products/edit/${p.id}`} className="admin-icon-btn" title="Edit" aria-label={`Edit ${p.name}`}>
                          <EditIcon size={15} />
                        </Link>
                        <button
                          type="button"
                          className="admin-icon-btn"
                          onClick={() => toggleProductActive(p.id)}
                          title={isActive ? 'Hide from store' : 'Show in store'}
                          aria-label={isActive ? 'Hide' : 'Show'}
                        >
                          {isActive ? <EyeOffIcon size={15} /> : <EyeIcon size={15} />}
                        </button>
                        <button
                          type="button"
                          className="admin-icon-btn danger"
                          onClick={() => setConfirmId(p.id)}
                          title="Delete"
                          aria-label={`Delete ${p.name}`}
                        >
                          <TrashIcon size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="admin-mobile-cards admin-mobile-only">
          {filtered.map((p) => {
            const pct = pctOf(p);
            const isActive = p.active !== false;
            return (
              <div key={p.id} className="admin-product-card">
                {firstImage(p)
                  ? <img src={firstImage(p)} alt={p.name} className="admin-product-card-img" />
                  : <div className="admin-product-card-img" aria-label="No product image" />}
                <div className="admin-product-card-body">
                  <div className="admin-product-card-top">
                    <span className="admin-product-card-name">{p.name}</span>
                    <span className={`admin-status ${isActive ? 'active' : 'hidden'}`}>
                      <span className="admin-status-dot" />
                      {isActive ? 'Active' : 'Hidden'}
                    </span>
                  </div>
                  <div className="admin-product-card-tags">
                    <span className="admin-pill">{catLabel(p.category)}</span>
                    <span className="admin-pill admin-pill-season">{seasonLabel(p.season)}</span>
                    {p.salePrice != null && <span className="admin-badge-discount">-{pct}%</span>}
                  </div>
                  <div className="admin-product-card-price">
                    <strong>{money(priceOf(p))}</strong>
                    {p.salePrice != null && <s className="admin-was">{money(p.price)}</s>}
                  </div>
                  <div className="admin-product-card-actions">
                    <Link to={`/admin/products/edit/${p.id}`} className="btn btn-sm btn-outline">Edit</Link>
                    <button type="button" className="btn btn-sm btn-outline" onClick={() => toggleProductActive(p.id)}>
                      {isActive ? 'Hide' : 'Show'}
                    </button>
                    <button type="button" className="btn btn-sm btn-outline danger" onClick={() => setConfirmId(p.id)}>Delete</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="admin-empty-state">
            <span className="admin-empty-icon">🔍</span>
            <h3>No products found</h3>
            <p className="muted">
              {products.length === 0
                ? 'Your catalog is empty. Add your first product to get started.'
                : 'No products match the current filters. Try adjusting your search.'}
            </p>
            {products.length === 0
              ? <Link to="/admin/products/add" className="btn admin-btn-accent">+ Add Product</Link>
              : <button type="button" className="btn btn-outline" onClick={resetFilters}>Clear filters</button>}
          </div>
        )}
      </div>

      {target && (
        <div className="admin-modal-overlay" onClick={() => setConfirmId(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-icon admin-modal-icon-danger"><TrashIcon size={22} /></div>
            <h3>Delete product?</h3>
            <p className="muted">
              You are about to permanently delete <strong>{target.name}</strong>.
              This action cannot be undone.
            </p>
            <div className="admin-modal-actions">
              <button type="button" className="btn btn-outline" onClick={() => setConfirmId(null)}>Cancel</button>
              <button type="button" className="btn btn-danger" onClick={handleDelete}>Delete product</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}