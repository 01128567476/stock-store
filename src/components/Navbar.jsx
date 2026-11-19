import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { STORE } from '../config';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useTheme } from '../context/ThemeContext';
import { BagIcon, HeartIcon, HomeIcon, MoonIcon, SearchIcon, SunIcon } from './Icons';

const LINKS = [
  { to: '/shop?category=men', label: 'Men' },
  { to: '/shop?category=shoes', label: 'Shoes' },
  { to: '/shop?category=accessories', label: 'Accessories' },
  { to: '/shop?sale=1', label: 'Sale' },
];

export default function Navbar() {
  const { count } = useCart();
  const { ids } = useWishlist();
  const { theme, toggle } = useTheme();
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
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="topbar">Free shipping on orders over {STORE.freeShippingThreshold.toLocaleString('en-US')} {STORE.currency} · Cash on delivery</div>
      <div className="container nav">
        <Link to="/" className="logo" aria-label={`${STORE.name} home`}>
          <span className="logo-stoc">STOC</span><span className="logo-k">K</span><span className="logo-store">STORE</span>
        </Link>

        <nav className="nav-links" aria-label="Main">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/shop" end>Shop</NavLink>
          {LINKS.map((l) => (
            <Link key={l.to} to={l.to} className={l.label === 'Sale' ? 'sale-link' : ''}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="nav-actions">
          <button className="icon-btn" onClick={() => setSearchOpen((o) => !o)} aria-label="Search">
            <SearchIcon />
          </button>
          <button className="icon-btn" onClick={toggle} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
          <Link to="/wishlist" className="icon-btn" aria-label={`Wishlist, ${ids.length} items`}>
            <HeartIcon />
            {ids.length > 0 && <span className="count">{ids.length}</span>}
          </Link>
          <Link to="/cart" className="icon-btn" aria-label={`Cart, ${count} items`}>
            <BagIcon />
            {count > 0 && <span className="count">{count}</span>}
          </Link>
        </div>
      </div>

      {searchOpen && (
        <form className="search-panel" onSubmit={submitSearch}>
          <div className="container">
            <SearchIcon />
            <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products, e.g. blazer, sneakers…" aria-label="Search products" />
            <button className="btn btn-sm" type="submit">Search</button>
          </div>
        </form>
      )}

      <nav className="mobile-tabbar" aria-label="Mobile navigation">
        <NavLink to="/" end>
          <HomeIcon size={20} />
          <span>Home</span>
        </NavLink>
        <NavLink to="/shop" end>
          <SearchIcon size={20} />
          <span>Search</span>
        </NavLink>
        <NavLink to="/wishlist" end>
          <HeartIcon size={20} />
          <span>Saved</span>
          {ids.length > 0 && <b>{ids.length}</b>}
        </NavLink>
        <NavLink to="/cart" end>
          <BagIcon size={20} />
          <span>Bag</span>
          {count > 0 && <b>{count}</b>}
        </NavLink>
      </nav>
    </header>
  );
}
