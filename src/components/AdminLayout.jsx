import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { CloseIcon, MenuIcon } from './Icons';

export default function AdminLayout({ children }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAdmin();

  const links = [
    { to: '/admin', label: 'Dashboard' },
    { to: '/admin/products', label: 'Products' },
    { to: '/admin/products/add', label: 'Add Product' },
  ];

  const activeLink = links.find((l) => location.pathname === l.to || location.pathname.startsWith(l.to + '/'))?.label;

  // Close drawer on route change
  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  // Handle hardware back button on mobile
  useEffect(() => {
    const onPopState = () => {
      if (drawerOpen) setDrawerOpen(false);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [drawerOpen]);

  return (
    <div className="admin-layout">
      {/* Sidebar (desktop) / Drawer (mobile) */}
      <aside className={`admin-sidebar ${drawerOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-head">
          <button
            className="admin-close-drawer"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close menu"
          >
            <CloseIcon size={20} />
          </button>
          <div className="admin-brand">
            <span className="logo-stoc">STOC</span><span className="logo-k">K</span> Admin
          </div>
        </div>
        <ul className="admin-nav">
          {links.map((l) => {
            const isActive = location.pathname === l.to || location.pathname.startsWith(l.to + '/');
            return (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className={`admin-link ${isActive ? 'active' : ''}`}
                  onClick={() => setDrawerOpen(false)}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
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
        <div className="admin-sidebar-footer">
          <span className="muted small">STOCK STORE</span>
        </div>
      </aside>

      <div className="admin-body">
        {/* Top bar */}
        <header className="admin-topbar">
          <button
            className="admin-hamburger"
            onClick={() => setDrawerOpen((o) => !o)}
            aria-label="Toggle navigation"
          >
            <MenuIcon size={22} />
          </button>
          <div className="admin-topbar-title">
            <h2>{activeLink || 'Admin'}</h2>
            <p className="admin-subtitle">STOCK STORE</p>
          </div>
          <div className="admin-topbar-actions">
            <button
              className="admin-btn-logout"
              onClick={() => {
                logout();
                navigate('/admin/login');
              }}
            >
              Logout
            </button>
          </div>
        </header>

        <main className="admin-main">{children}</main>

        {/* Mobile backdrop */}
        {drawerOpen && (
          <div
            className="admin-backdrop"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  );
}