import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { STORE } from '../config';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useTheme } from '../context/ThemeContext';
import { useLang } from '../context/LangContext';
import { BagIcon, HeartIcon, HomeIcon, MoonIcon, SearchIcon, ShieldIcon, SunIcon } from './Icons';
import LanguageToggle from './LanguageToggle';

const LINKS = [
  { to: '/shop?category=sweaters', labelKey: 'nav.sweaters' },
  { to: '/shop?category=pullover', labelKey: 'nav.pullover' },
  { to: '/shop?category=shoes', labelKey: 'nav.shoes' },
  { to: '/shop?sale=1', labelKey: 'nav.sale', isSale: true },
];

export default function Navbar() {
  const { count } = useCart();
  const { ids } = useWishlist();
  const { theme, toggle } = useTheme();
  const { t } = useLang();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState('');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const submitSearch = (e) => {
    e.preventDefault();
    const term = q.trim();
    navigate(term ? `/shop?q=${encodeURIComponent(term)}` : '/shop');
    setSearchOpen(false);
  };

  return (
    <header className={`header ${pathname === '/' ? 'header-home' : ''} ${scrolled ? 'scrolled' : ''}`}>
      <div className="topbar">
        {t('nav.topbar', {
          amount: STORE.freeShippingThreshold.toLocaleString('en-US'),
          currency: STORE.currency,
        })}
      </div>
      <div className="container nav">
        <Link to="/" className="logo navbar-logo brand-ltr" dir="ltr" aria-label={`${STORE.name} home`}>
          <span className="logo-stoc">STOC</span><span className="logo-k">K</span><span className="logo-store">STORE</span>
        </Link>

        <nav className="nav-links" aria-label="Main">
          <NavLink to="/" end>{t('nav.home')}</NavLink>
          <NavLink to="/shop" end>{t('nav.shop')}</NavLink>
          {LINKS.map((l) => (
            <Link key={l.to} to={l.to} className={l.isSale ? 'sale-link' : ''}>
              {t(l.labelKey)}
            </Link>
          ))}
          <Link to="/admin" className="admin-nav-link">
            <ShieldIcon size={16} /> {t('nav.admin')}
          </Link>
        </nav>

        <div className="nav-actions">
          <button className="icon-btn" onClick={() => setSearchOpen((o) => !o)} aria-label={t('nav.search')}>
            <SearchIcon />
          </button>
          <button className="icon-btn" onClick={toggle} aria-label={theme === 'dark' ? t('nav.themeLight') : t('nav.themeDark')}>
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
          <LanguageToggle className="lang-toggle-nav" />
          <Link to="/wishlist" className="icon-btn" aria-label={t('nav.wishlistLabel', { count: ids.length })}>
            <HeartIcon />
            {ids.length > 0 && <span className="count">{ids.length}</span>}
          </Link>
          <Link to="/cart" className="icon-btn" aria-label={t('nav.cartLabel', { count })}>
            <BagIcon />
            {count > 0 && <span className="count">{count}</span>}
          </Link>
        </div>
      </div>

      {searchOpen && (
        <form className="search-panel" onSubmit={submitSearch}>
          <div className="container">
            <SearchIcon />
            <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('nav.searchPlaceholder')} aria-label={t('nav.search')} />
            <button className="btn btn-sm" type="submit">{t('nav.search')}</button>
          </div>
        </form>
      )}

      <nav className="mobile-tabbar" dir="ltr" aria-label="Mobile navigation">
        <NavLink to="/" end>
          <HomeIcon size={20} />
          <span>{t('nav.mobile.home')}</span>
        </NavLink>
        <NavLink to="/shop" end>
          <SearchIcon size={20} />
          <span>{t('nav.mobile.search')}</span>
        </NavLink>
        <NavLink to="/wishlist" end>
          <HeartIcon size={20} />
          <span>{t('nav.mobile.saved')}</span>
          {ids.length > 0 && <b>{ids.length}</b>}
        </NavLink>
        <NavLink to="/cart" end>
          <BagIcon size={20} />
          <span>{t('nav.mobile.bag')}</span>
          {count > 0 && <b>{count}</b>}
        </NavLink>
      </nav>
    </header>
  );
}
