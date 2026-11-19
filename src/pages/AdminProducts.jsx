import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { CATEGORIES } from '../data/products';
import { money } from '../config';
import { TrashIcon, EditIcon } from '../components/Icons';

export default function AdminProducts() {
  const { products, deleteProduct } = useAdmin();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [confirmId, setConfirmId] = useState(null);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchQuery = p.name.toLowerCase().includes(query.toLowerCase());
      const matchCat = category === 'all' || p.category === category;
      return matchQuery && matchCat;
    });
  }, [products, query, category]);

  const handleDelete = (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    deleteProduct(id);
    setConfirmId(null);
  };

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <h2>Products</h2>
          <p className="muted small">Manage your catalog</p>
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
            />
          </div>
          <div className="admin-filter">
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="all">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
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
                <th className="admin-table-cell-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="admin-empty-cell">
                    <p className="muted">No products found.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
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
                    <td className="admin-table-cell-actions">
                      <Link
                        to={`/admin/products/edit/${p.id}`}
                        className="admin-icon-btn"
                        aria-label={`Edit ${p.name}`}
                      >
                        <EditIcon size={16} />
                      </Link>
                      <button
                        className="admin-icon-btn admin-icon-btn-danger"
                        onClick={() => handleDelete(p.id)}
                        aria-label={`Delete ${p.name}`}
                      >
                        <TrashIcon size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}