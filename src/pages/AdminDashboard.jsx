import { useAdmin } from '../context/AdminContext';
import { Link } from 'react-router-dom';
import { money } from '../config';
import { CATEGORIES } from '../data/products';
import { EditIcon, PackageIcon, TagIcon, UsersIcon, ClockIcon } from '../components/Icons';

const STAT_CARDS = [
  {
    label: 'Total Products',
    value: 0,
    icon: <PackageIcon size={20} />,
    color: 'var(--accent)',
  },
  {
    label: 'Active',
    value: 0,
    icon: <UsersIcon size={20} />,
    color: 'var(--success)',
  },
  {
    label: 'Hidden',
    value: 0,
    icon: <ClockIcon size={20} />,
    color: 'var(--muted)',
  },
  {
    label: 'On Sale',
    value: 0,
    icon: <TagIcon size={20} />,
    color: 'var(--danger)',
  },
];

export default function AdminDashboard() {
  const { products, status, statusMsg, clearStatus } = useAdmin();

  const total = products.length;
  const active = products.filter((p) => p.active !== false).length;
  const hidden = products.filter((p) => p.active === false).length;
  const onSale = products.filter((p) => p.salePrice != null).length;

  const stats = [
    { ...STAT_CARDS[0], value: total },
    { ...STAT_CARDS[1], value: active },
    { ...STAT_CARDS[2], value: hidden },
    { ...STAT_CARDS[3], value: onSale },
  ];

  const catCounts = CATEGORIES.map((c) => ({
    id: c.id,
    label: c.label,
    count: products.filter((p) => p.category === c.id).length,
  }));

  const recent = [...products]
    .sort((a, b) => b.id.localeCompare(a.id))
    .slice(0, 6);

  const categoryLabel = (id) =>
    CATEGORIES.find((c) => c.id === id)?.label || id;
  const firstImage = (p) => Array.isArray(p.images) && p.images.length ? p.images[0] : '';

  return (
    <div className="admin-page">
      {status && statusMsg && (
        <div className="admin-toast admin-toast--success" onClick={clearStatus}>
          <span className="admin-toast-icon">✓</span>
          <span className="admin-toast-msg">{statusMsg}</span>
        </div>
      )}

      <div className="admin-page-head">
        <div>
          <h2>Dashboard</h2>
          <p className="admin-subtitle">Overview of your store catalog</p>
        </div>
        <Link to="/admin/products/add" className="btn btn-lg btn-primary">
          <span>+ Add Product</span>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="admin-stats-grid">
        {stats.map((s) => (
          <div key={s.label} className="admin-stat">
            <div className="admin-stat-icon" style={{ color: s.color, background: `${s.color}15` }}>
              {s.icon}
            </div>
            <div className="admin-stat-info">
              <p className="admin-stat-label">{s.label}</p>
              <p className="admin-stat-value">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-grid">
        {/* Category breakdown */}
        <div className="admin-card admin-card-wide">
          <div className="admin-section-head">
            <h2>Products by Category</h2>
            <span className="admin-subtitle">Catalog breakdown</span>
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

        {/* Recently added */}
        <div className="admin-card admin-card-wide">
          <div className="admin-section-head">
            <h2>Recently Added</h2>
            <span className="admin-subtitle">Quick links to edit</span>
          </div>
          <div className="admin-recent-list">
            {recent.map((p) => (
              <div key={p.id} className="admin-recent-item">
                {firstImage(p)
                  ? <img src={firstImage(p)} alt={p.name} className="admin-recent-img" />
                  : <div className="admin-recent-img" aria-label="No product image" />}
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
    </div>
  );
}