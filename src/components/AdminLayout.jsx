import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { CloseIcon, MenuIcon } from './Icons';

export default function AdminLayout({ children }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAdmin();

  const links = [
    { to: '/admin', label: 'Dashboard' },
    { to: '/admin/products', label: 'Products' },
    { to: '/admin/products/add', label: 'Add Product' },
  ];

  return (
    <div className="admin-layout">
      <nav className="admin-sidebar">
        <div className="admin-brand">
          <span className="logo-stoc">STOC</span><span className="logo-k">K</span> Admin
        </div>
        <ul className="admin-nav">
          {links.map((l) => (
            <li key={l.to}>
              <Link
                to={l.to}
                className={`admin-link ${navigate ? '' : ''}`}
                onClick={() => setDrawerOpen(false)}
              >
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <button
              className="admin-link admin-link-danger"
              onClick={() => {
                logout();
                navigate('/admin/login');
              }}
            >
              Logout
            </button>
          </li>
        </ul>
      </nav>

      <div className="admin-body">
        <header className="admin-header">
          <button
            className="admin-menu-btn"
            onClick={() => setDrawerOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <MenuIcon size={20} />
          </button>
          <div className="admin-header-title">
            <h2>Stock Store Admin</h2>
            <p className="admin-subtitle">Manage your store</p>
          </div>
        </header>
        <main className="admin-main">{children}</main>
      </div>

      {drawerOpen && (
        <div
          className="admin-backdrop"
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}