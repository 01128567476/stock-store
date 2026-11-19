import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { CATEGORIES } from '../data/products';
import { money } from '../config';
import { EditIcon, TrashIcon, CloseIcon } from '../components/Icons';

export default function AdminProducts() {
  const { products, deleteProduct, toggleProductActive, status, statusMsg, clearStatus } = useAdmin();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [saleOnly, setSaleOnly] = useState(false);
  const [sortBy, setSortBy] = useState('name-asc');
  const [confirmId, setConfirmId] = useState(null);

  const catLabel = (id) => CATEGORIES.find((c) => c.id === id)?.label || id;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = products.filter((p) => {
      const matchQ = !q || p.name.toLowerCase().includes(q);
      const matchC = category === 'all' || p.category === category;
      const matchSale = !saleOnly || p.salePrice != null;
      return matchQ && matchC && matchSale;
    });
    list = [...list].sort((a, b) => {
      switch (sortBy) {
        case 'name-desc': return b.name.localeCompare(a.name);
        case 'price-asc': return (a.salePrice ?? a.price) - (b.salePrice ?? b.price);
        case 'price-desc': return (b.salePrice ?? b.price) - (a.salePrice ?? a.price);
        case 'newest': return b.id.localeCompare(a.id);
        default: return a.name.localeCompare(b.name);
      }
    });
    return list;
  }, [products, query, category, saleOnly, sortBy]);

  useEffect(() => {
    if (!status) return undefined;
    const t = setTimeout(clearStatus, 3000);
    return () => clearTimeout(t);
  }, [status, clearStatus]);

  const target = products.find((p) => p.id === confirmId);

  const handleDelete = () => {
    if (!confirmId) return;
    deleteProduct(confirmId);
    setConfirmId(null);
  };

  return (
    <div className="admin-page">
      {status && statusMsg && (
        <div className="admin-toast admin-toast--success" onClick={clearStatus}>
          <span className="muted small">{statusMsg}</span>
        </div>
      )}

      <div className="admin-page-head">
        <div>
          <h2>Products</h2>
          <p className="muted small">Manage your catalog — {products.length} products</p>
        </div>
        <Link to="/admin/products/add" className="btn btn-lg">
          + Add Product
        </Link>
      </div>

      <div className="admin-card">
        <div className="admin-toolbar">
          <div className="admin-search">
            <input
              type="text"
              placeholder="Search products…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search products"
            />
          </div>
          <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Filter by category">
            <option value="all">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
          <label className="admin-check">
            <input type="checkbox" checked={saleOnly} onChange={(e) => setSaleOnly(e.target.checked)} />
            Sale only
          </label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} aria-label="Sort products">
            <option value="name-asc">Name (A–Z)</option>
            <option value="name-desc">Name (Z–A)</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="newest">Newest</option>
          </select>
        </div>

        {/* Desktop table */}
        <div className="admin-table-wrap admin-desktop-only">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Original</th>
                <th>Discount</th>
                <th>Final</th>
                <th>Status</th>
                <th className="admin-cell-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const pct = p.salePrice != null
                  ? Math.round((1 - p.salePrice / p.price) * 100) : 0;
                const isActive = p.active !== false;
                return (
                  <tr key={p.id} className="admin-table-row">
                    <td><img src={p.images[0]} alt={p.name} className="admin-table-img" /></td>
                    <td className="admin-table-name">{p.name}</td>
                    <td><span className="admin-pill">{catLabel(p.category)}</span></td>
                    <td>{money(p.price)}</td>
                    <td>{pct > 0 ? <span className="admin-pill admin-pill-sale">-{pct}%</span> : '—'}</td>
                    <td className="admin-final-price">
                      {money(p.salePrice ?? p.price)}
                      {p.salePrice != null && <s className="admin-was">{money(p.price)}</s>}
                    </td>
                    <td>
                      <span className={`admin-status ${isActive ? 'active' : 'hidden'}`}>
                        {isActive ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td className="admin-cell-actions">
                      <Link to={`/admin/products/edit/${p.id}`} className="admin-icon-btn" aria-label={`Edit ${p.name}`} title="Edit">
                        <EditIcon size={16} />
                      </Link>
                      <button className="admin-icon-btn" onClick={() => toggleProductActive(p.id)} aria-label={isActive ? 'Hide' : 'Show'} title={isActive ? 'Hide' : 'Show'}>
                        {isActive ? <CloseIcon size={16} /> : <span style={{ fontSize: '0.75rem' }}>Show</span>}
                      </button>
                      <button className="admin-icon-btn danger" onClick={() => setConfirmId(p.id)} aria-label={`Delete ${p.name}`} title="Delete">
                        <TrashIcon size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="admin-empty"><p className="muted">No products match your filters.</p></div>
          )}
        </div>

        {/* Mobile cards */}
        <div className="admin-mobile-cards admin-mobile-only">
          {filtered.map((p) => {
            const pct = p.salePrice != null
              ? Math.round((1 - p.salePrice / p.price) * 100) : 0;
            const isActive = p.active !== false;
            return (
              <div key={p.id} className="admin-product-card">
                <img src={p.images[0]} alt={p.name} className="admin-product-card-img" />
                <div className="admin-product-card-body">
                  <div className="admin-product-card-top">
                    <span className="admin-product-card-name">{p.name}</span>
                    <span className={`admin-status ${isActive ? 'active' : 'hidden'}`}>
                      {isActive ? 'Active' : 'Hidden'}
                    </span>
                  </div>
                  <span className="admin-pill">{catLabel(p.category)}</span>
                  <div className="admin-product-card-price">
                    <strong>{money(p.salePrice ?? p.price)}</strong>
                    {p.salePrice != null && (
                      <>
                        <s className="admin-was">{money(p.price)}</s>
                        <span className="admin-pill admin-pill-sale">-{pct}%</span>
                      </>
                    )}
                  </div>
                  <div className="admin-product-card-actions">
                    <Link to={`/admin/products/edit/${p.id}`} className="btn btn-sm btn-outline">Edit</Link>
                    <button className="btn btn-sm btn-outline" onClick={() => toggleProductActive(p.id)}>
                      {isActive ? 'Hide' : 'Show'}
                    </button>
                    <button className="btn btn-sm btn-outline danger" onClick={() => setConfirmId(p.id)}>Delete</button>
                  </div>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="admin-empty"><p className="muted">No products match your filters.</p></div>
          )}
        </div>
      </div>

      {/* Confirmation modal */}
      {target && (
        <div className="admin-modal-overlay" onClick={() => setConfirmId(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Delete product?</h3>
            <p className="muted">Are you sure you want to delete <strong>{target.name}</strong>? This cannot be undone.</p>
            <div className="admin-modal-actions">
              <button className="btn btn-outline" onClick={() => setConfirmId(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}