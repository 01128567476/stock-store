import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { useLang } from '../context/LangContext';
import { ArrowIcon, CloseIcon, ImageIcon, LayoutIcon, LogoutIcon, MenuIcon, PackageIcon, PlusIcon } from './Icons';

export default function AdminLayout({ children }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAdmin();
  const { t } = useLang();

  const links = [
    { to: '/admin', labelKey: 'admin.dashboard', icon: <LayoutIcon size={18} /> },
    { to: '/admin/products', labelKey: 'admin.products', icon: <PackageIcon size={18} /> },
    { to: '/admin/products/add', labelKey: 'admin.addProduct', icon: <PlusIcon size={18} /> },
    { to: '/admin/ads', labelKey: 'admin.advertisements', icon: <ImageIcon size={18} /> },
  ];

  const isActiveLink = (to) =>
    location.pathname === to ||
    (to !== '/admin' && location.pathname.startsWith(to + '/'));

  const activeLinkKey = [...links]
    .sort((a, b) => b.to.length - a.to.length)
    .find((l) => isActiveLink(l.to))?.labelKey;

  // Close drawer on route change
  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  // Handle hardware back button: push a dummy history entry when drawer opens
  useEffect(() => {
    if (drawerOpen) {
      window.history.pushState({ adminDrawer: true }, '');
    }
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
            aria-label={t('admin.closeMenu')}
          >
            <CloseIcon size={20} />
          </button>
          <div className="admin-brand brand-ltr" dir="ltr">
            <span className="logo-text">STOCK</span>
            <span className="admin-brand-sub">Admin</span>
          </div>
        </div>
        <ul className="admin-nav">
          {links.map((l) => {
            const isActive = isActiveLink(l.to);
            return (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className={`admin-link ${isActive ? 'active' : ''}`}
                  onClick={() => setDrawerOpen(false)}
                >
                  <span className="admin-link-icon">{l.icon}</span>
                  {t(l.labelKey)}
                </Link>
              </li>
            );
          })}
          <li>
            <Link to="/" className="admin-link">
              <span className="admin-link-icon"><ArrowIcon size={18} /></span>
              {t('admin.viewStore')}
            </Link>
          </li>
          <li>
            <button
              className="admin-link admin-link-danger"
              onClick={() => {
                logout();
                navigate('/admin/login');
              }}
            >
              <span className="admin-link-icon"><LogoutIcon size={18} /></span>
              {t('admin.logout')}
            </button>
          </li>
        </ul>
        <div className="admin-sidebar-footer">
          <span className="admin-footer-text brand-ltr" dir="ltr">STOCK STORE</span>
          <span className="admin-footer-ver">v2.0 · 2026</span>
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
            <h2>{activeLinkKey ? t(activeLinkKey) : t('admin.admin')}</h2>
            <p className="admin-subtitle brand-ltr" dir="ltr">{t('admin.storeMgmt')}</p>
          </div>
          <div className="admin-topbar-actions">
            <button
              className="admin-btn-profile"
              aria-label={t('admin.account')}
            >
              <span className="admin-avatar">AD</span>
            </button>
            <button
              className="admin-btn-logout"
              onClick={() => {
                logout();
                navigate('/admin/login');
              }}
            >
              {t('admin.signOut')}
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