import { useAdmin } from '../context/AdminContext';
import { Link, useNavigate } from 'react-router-dom';
import { money } from '../config';
import { CATEGORIES } from '../data/products';
import { EditIcon } from '../components/Icons';

export default function AdminDashboard() {
  const { products, status, statusMsg, clearStatus } = useAdmin();
  const navigate = useNavigate();

  const total = products.length;
  const active = products.filter((p) => p.active !== false).length;
  const hidden = products.filter((p) => p.active === false).length;
  const onSale = products.filter((p) => p.salePrice != null).length;

  const catCounts = CATEGORIES.map((c) => ({
    id: c.id,
    label: c.label,
    count: products.filter((p) => p.category === c.id).length,
  }));

  const recent = [...products]
    .sort((a, b) => {
      // Use images array length as a proxy for recency since we don't have createdAt
      // Fall back to id ordering
      return b.id.localeCompare(a.id);
    })
    .slice(0, 6);

  const categoryLabel = (id) =>
    CATEGORIES.find((c) => c.id === id)?.label || id;

  return (
    <div className="admin-page">
      {status && statusMsg && (
        <div className="admin-toast admin-toast--success" onClick={clearStatus}>
          <span className="muted small">{statusMsg}</span>
        </div>
      )}

      <div className="admin-page-head">
        <div>
          <h2>Dashboard</h2>
          <p className="muted small">Overview of your store catalog</p>
        </div>
        <Link to="/admin/products/add" className="btn btn-lg">
          + Add Product
        </Link>
      </div>

      <div className="admin-stats-grid">
        <div className="admin-stat">
          <div className="admin-stat-icon">📦</div>
          <div className="admin-stat-info">
            <p className="admin-stat-label">Total Products</p>
            <p className="admin-stat-value">{total}</p>
          </div>
        </div>
        <div className="admin-stat">
          <div className="admin-stat-icon">✅</div>
          <div className="admin-stat-info">
            <p className="admin-stat-label">Active</p>
            <p className="admin-stat-value">{active}</p>
          </div>
        </div>
        <div className="admin-stat">
          <div className="admin-stat-icon">🙈</div>
          <div className="admin-stat-info">
            <p className="admin-stat-label">Hidden</p>
            <p className="admin-stat-value">{hidden}</p>
          </div>
        </div>
        <div className="admin-stat">
          <div className="admin-stat-icon">🏷️</div>
          <div className="admin-stat-info">
            <p className="admin-stat-label">On Sale</p>
            <p className="admin-stat-value">{onSale}</p>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-section-head">
          <h2>Products by Category</h2>
          <span className="muted small">Catalog breakdown</span>
        </div>
        <div className="admin-cat-grid">
          {catCounts.map((c) => (
            <div key={c.id} className="admin-cat-card">
              <span className="admin-cat-label">{categoryLabel(c.id)}</span>
              <span className="admin-cat-value">{c.count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-section-head">
          <h2>Recently Added</h2>
          <span className="muted small">Quick links to edit</span>
        </div>
        <div className="admin-recent-list">
          {recent.map((p) => (
            <div key={p.id} className="admin-recent-item">
              <img src={p.images[0]} alt={p.name} className="admin-recent-img" />
              <div className="admin-recent-info">
                <span className="admin-recent-name">{p.name}</span>
                <span className="admin-recent-cat muted small">{categoryLabel(p.category)}</span>
              </div>
              <div className="admin-recent-price">{money(p.salePrice ?? p.price)}</div>
              <Link
                to={`/admin/products/edit/${p.id}`}
                className="admin-recent-edit"
                aria-label={`Edit ${p.name}`}
              >
                <EditIcon size={16} />
              </Link>
            </div>
          ))}
          {recent.length === 0 && (
            <div className="admin-empty">
              <p className="muted">No products yet. Add your first product.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}