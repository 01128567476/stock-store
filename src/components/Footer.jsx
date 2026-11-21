import { Link } from 'react-router-dom';
import { STORE } from '../config';
import Newsletter from './Newsletter';
import { FacebookIcon, InstagramIcon, TiktokIcon, XIcon } from './Icons';

export default function Footer() {
  return (
    <>
      <Newsletter />
      <footer className="footer">
        <div className="container footer-grid">
          <div>
            <Link to="/" className="logo">
              <span className="logo-stoc">STOC</span><span className="logo-k">K</span><span className="logo-store">STORE</span>
            </Link>
            <p className="muted footer-about">{STORE.tagline} Premium essentials designed for modern living.</p>
            <div className="socials">
              <a href={STORE.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><InstagramIcon /></a>
              <a href={STORE.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FacebookIcon /></a>
              <a href={STORE.social.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok"><TiktokIcon /></a>
              <a href={STORE.social.x} target="_blank" rel="noopener noreferrer" aria-label="X"><XIcon /></a>
            </div>
          </div>
          <div>
            <h4>Shop</h4>
            <Link to="/shop?category=sweaters">Sweaters</Link>
            <Link to="/shop?category=pullover">Pullover</Link>
            <Link to="/shop?category=shoes">Shoes</Link>
            <Link to="/shop?sale=1">Sale</Link>
          </div>
          <div>
            <h4>Account</h4>
            <Link to="/cart">Shopping cart</Link>
            <Link to="/wishlist">Wishlist</Link>
            <Link to="/checkout">Checkout</Link>
          </div>
          <div>
            <h4>Contact</h4>
            <span>{STORE.address}</span>
            <a href={`tel:${STORE.phone.replace(/\s/g, '')}`}>{STORE.phone}</a>
            <a href={`mailto:${STORE.email}`}>{STORE.email}</a>
            <span>Daily 10:00 – 22:00</span>
          </div>
        </div>
        <div className="container footer-bottom">
          <span>© {new Date().getFullYear()} {STORE.name}. All rights reserved.</span>
          <span>Cash on delivery · 14-day returns</span>
        </div>
      </footer>
    </>
  );
}
