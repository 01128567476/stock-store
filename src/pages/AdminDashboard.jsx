import { useAdmin } from '../context/AdminContext';
import { money } from '../config';

export default function AdminDashboard() {
  const { products } = useAdmin();

  const total = products.length;
  const onSale = products.filter((p) => p.salePrice != null).length;
  const inventory = products.reduce((sum, p) => sum + 1, 0);
  const value = products.reduce((sum, p) => sum + (p.salePrice ?? p.price), 0);

  const stats = [
    { label: 'Total Products', value: total, icon: '📦' },
    { label: 'On Sale', value: onSale, icon: '🏷️' },
    { label: 'Catalog Value', value: money(value), icon: '💰' },
  ];

  const recent = products.slice().sort((a, b) => b.id.localeCompare(a.id)).slice(0, 4);

  return (
    <div className="admin-page">
      <div className="admin-card">
        <h2>Overview</h2>
        <div className="admin-stats-grid">
          {stats.map((s) => (
            <div key={s.label} className="admin-stat">
              <div className="admin-stat-icon">{s.icon}</div>
              <div className="admin-stat-info">
                <p className="admin-stat-label">{s.label}</p>
                <p className="admin-stat-value">{s.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-section-head">
          <h2>Recent Products</h2>
          <span className="muted small">Last updated items</span>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Sale Price</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((p) => (
                <tr key={p.id} className="admin-table-row">
                  <td className="admin-table-cell-img">
                    <img src={p.images[0]} alt={p.name} className="admin-table-img" />
                  </td>
                  <td className="admin-table-cell-name">{p.name}</td>
                  <td className="admin-table-cell-cat">{p.category}</td>
                  <td className="admin-table-cell-price">{money(p.price)}</td>
                  <td className="admin-table-cell-sale">
                    {p.salePrice != null ? money(p.salePrice) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {recent.length === 0 && (
          <div className="admin-empty">
            <p className="muted">No products yet. Add your first product.</p>
          </div>
        )}
      </div>
    </div>
  );
}