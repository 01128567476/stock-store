import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CATEGORIES, discountPercent } from '../data/products';
import { useAdmin } from '../context/AdminContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { useSEO } from '../hooks/useSEO';
import ProductImage from '../components/ProductImage';
import ProductCard from '../components/ProductCard';
import Price from '../components/Price';
import Stars from '../components/Stars';
import QtySelect from '../components/QtySelect';
import { BagIcon, CashIcon, HeartIcon, ReturnIcon, TruckIcon } from '../components/Icons';
import NotFound from './NotFound';

export default function ProductDetails() {
  const { id } = useParams();
  const { products } = useAdmin();
  const product = products.find((p) => p.id === id);
  if (!product || product.active === false) return <NotFound />;
  return <Details key={product.id} product={product} />;
}

function Details({ product }) {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { has, toggle } = useWishlist();
  const toast = useToast();
  const [img, setImg] = useState(0);
  const [color, setColor] = useState(product.colors[0].name);
  const [size, setSize] = useState(product.sizes.length === 1 ? product.sizes[0] : null);
  const [qty, setQty] = useState(1);
  const [sizeError, setSizeError] = useState(false);

  useSEO(product.name, product.description);

  const pct = discountPercent(product);
  const wished = has(product.id);
  const catLabel = CATEGORIES.find((c) => c.id === product.category)?.label;
  const { products } = useAdmin();
  const related = products.filter((p) => p.active !== false && p.category === product.category && p.id !== product.id).slice(0, 4);

  const validate = () => {
    if (!size) {
      setSizeError(true);
      toast('Please select a size', 'error');
      return false;
    }
    return true;
  };

  const add = () => {
    if (!validate()) return;
    addItem(product, { size, color, qty });
    toast(`${product.name} added to cart`);
  };

  const buyNow = () => {
    if (!validate()) return;
    addItem(product, { size, color, qty });
    navigate('/checkout');
  };

  return (
    <div className="container pdp">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link> / <Link to="/shop">Shop</Link> / <Link to={`/shop?category=${product.category}`}>{catLabel}</Link> /{' '}
        <span>{product.name}</span>
      </nav>

      <div className="pdp-grid">
        <div className="gallery">
          <div className="thumbs">
            {product.images.map((src, i) => (
              <button key={src} className={`thumb ${i === img ? 'active' : ''}`} onClick={() => setImg(i)} aria-label={`View image ${i + 1}`}>
                <ProductImage src={src} alt={`${product.name} view ${i + 1}`} />
              </button>
            ))}
          </div>
          <div className="gallery-main">
            <ProductImage src={product.images[img]} alt={product.name} loading="eager" />
            <div className="badges">
              {pct > 0 && <span className="badge badge-sale">-{pct}%</span>}
              {product.isNew && <span className="badge">New</span>}
            </div>
          </div>
        </div>

        <div className="pdp-info">
          <p className="eyebrow">{catLabel}</p>
          <h1>{product.name}</h1>
          <Stars value={product.rating} count={product.reviews} />
          <Price product={product} large />
          <p className="pdp-desc">{product.description}</p>

          <div className="option">
            <div className="option-label">
              Color: <strong>{color}</strong>
            </div>
            <div className="swatches big" role="radiogroup" aria-label="Color">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  role="radio"
                  aria-checked={color === c.name}
                  aria-label={c.name}
                  title={c.name}
                  className={`swatch ${color === c.name ? 'active' : ''}`}
                  style={{ '--c': c.hex }}
                  onClick={() => setColor(c.name)}
                />
              ))}
            </div>
          </div>

          <div className="option">
            <div className="option-label">
              Size: <strong>{size || 'Select a size'}</strong>
            </div>
            <div className={`sizes big ${sizeError && !size ? 'error' : ''}`} role="radiogroup" aria-label="Size">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  role="radio"
                  aria-checked={size === s}
                  className={`size ${size === s ? 'active' : ''}`}
                  onClick={() => {
                    setSize(s);
                    setSizeError(false);
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
            {sizeError && !size && <p className="form-msg error">Please choose a size to continue.</p>}
          </div>

          <div className="option">
            <div className="option-label">Quantity</div>
            <QtySelect value={qty} onChange={setQty} />
          </div>

          <div className="pdp-actions">
            <button className="btn btn-lg btn-discover" onClick={add}>
              <BagIcon size={18} /> Add to Cart
            </button>
            <button className="btn btn-outline btn-lg btn-buy" onClick={buyNow}>
              Buy Now
            </button>
            <button
              className={`btn btn-outline btn-lg icon-only wish-btn ${wished ? 'on' : ''}`}
              onClick={() => {
                toggle(product.id);
                toast(wished ? 'Removed from wishlist' : 'Saved to wishlist', wished ? 'wishlist-remove' : 'wishlist');
              }}
              aria-pressed={wished}
              aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <HeartIcon filled={wished} />
            </button>
          </div>

          <ul className="pdp-perks">
            <li><TruckIcon size={18} /> Free delivery over 3,000 EGP</li>
            <li><CashIcon size={18} /> Cash on delivery available</li>
            <li><ReturnIcon size={18} /> 14-day easy returns</li>
          </ul>

          <div className="pdp-details">
            <h3>Details</h3>
            <ul>
              {product.details.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="section">
          <div className="section-head">
            <h2>You may also like</h2>
          </div>
          <div className="grid">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
