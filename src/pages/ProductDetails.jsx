import { useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CATEGORIES, discountPercent, getProductDetails } from '../data/products';
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
import { BagIcon, CashIcon, HeartIcon, ReturnIcon, TrashIcon, TruckIcon } from '../components/Icons';
import NotFound from './NotFound';

export default function ProductDetails() {
  const { id } = useParams();
  const { products, isSeasonHidden } = useAdmin();
  const product = products.find((p) => p.id === id);
  if (!product || product.active === false || isSeasonHidden(product.season)) return <NotFound />;
  return <Details key={product.id} product={product} />;
}

function Details({ product }) {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { has, toggle } = useWishlist();
  const toast = useToast();
  const [img, setImg] = useState(0);
  const colors = Array.isArray(product.colors) ? product.colors : [];
  const sizes = Array.isArray(product.sizes) ? product.sizes : [];
  const images = Array.isArray(product.images) ? product.images.filter(Boolean) : [];
  const [variants, setVariants] = useState([{
    id: 0,
    color: colors[0]?.name || '',
    size: sizes.length === 1 ? sizes[0] : null,
    qty: 1,
  }]);
  const [variantErrors, setVariantErrors] = useState([]);
  const nextVariantId = useRef(1);

  useSEO(product.name, product.description);

  const pct = discountPercent(product);
  const details = getProductDetails(product);
  const wished = has(product.id);
  const catLabel = CATEGORIES.find((c) => c.id === product.category)?.label;
  const { products, isSeasonHidden } = useAdmin();
  const related = products.filter((p) =>
    p.active !== false &&
    !isSeasonHidden(p.season) &&
    p.category === product.category &&
    p.id !== product.id
  ).slice(0, 4);

  const updateVariant = (id, field, value) => {
    setVariants((current) => current.map((variant) =>
      variant.id === id ? { ...variant, [field]: value } : variant
    ));
    const variant = variants.find((item) => item.id === id);
    const otherChoice = field === 'color' ? variant?.size : variant?.color;
    if ((field === 'color' || field === 'size') && value && otherChoice) {
      setVariantErrors((current) => current.filter((variantId) => variantId !== id));
    }
  };

  const addVariant = () => {
    setVariants((current) => [...current, {
      id: nextVariantId.current++,
      color: colors[0]?.name || '',
      size: sizes.length === 1 ? sizes[0] : null,
      qty: 1,
    }]);
  };

  const removeVariant = (id) => {
    setVariants((current) => current.filter((variant) => variant.id !== id));
    setVariantErrors((current) => current.filter((variantId) => variantId !== id));
  };

  const addVariantsToCart = () => {
    const invalidVariants = variants.filter((variant) => !variant.color || !variant.size);
    if (invalidVariants.length) {
      setVariantErrors(invalidVariants.map((variant) => variant.id));
      toast('Choose a color and size for each item', 'error');
      return false;
    }

    variants.forEach(({ color, size, qty }) => addItem(product, { size, color, qty }));
    return true;
  };

  const add = () => {
    if (!addVariantsToCart()) return;
    toast(`${product.name} added to cart`);
  };

  const buyNow = () => {
    if (!addVariantsToCart()) return;
    navigate('/checkout');
  };

  if (!colors.length || !sizes.length || !images.length) {
    return <div className="container pdp"><p>Product details are incomplete. Please contact the store.</p></div>;
  }

  return (
    <div className="container pdp">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link> / <Link to="/shop">Shop</Link> / <Link to={`/shop?category=${product.category}`}>{catLabel}</Link> /{' '}
        <span>{product.name}</span>
      </nav>

      <div className="pdp-grid">
        <div className="gallery">
          <div className="thumbs">
            {images.map((src, i) => (
              <button key={src} className={`thumb ${i === img ? 'active' : ''}`} onClick={() => setImg(i)} aria-label={`View image ${i + 1}`}>
                <ProductImage src={src} alt={`${product.name} view ${i + 1}`} />
              </button>
            ))}
          </div>
          <div className="gallery-main">
            <ProductImage src={images[img % images.length]} alt={product.name} loading="eager" />
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

          <div className="variant-list">
            {variants.map((variant, index) => {
              const hasError = variantErrors.includes(variant.id);
              return (
                <section key={variant.id} className="variant-row" aria-label={`Item ${index + 1} options`}>
                  <div className="variant-row-head">
                    <div className="variant-item-title">
                      <span className="variant-item-number">{String(index + 1).padStart(2, '0')}</span>
                      <strong>Item {index + 1}</strong>
                    </div>
                    {variants.length > 1 && (
                      <button type="button" className="variant-remove" onClick={() => removeVariant(variant.id)}>
                        <TrashIcon size={15} /> Remove
                      </button>
                    )}
                  </div>
                  <div className="option">
                    <div className="option-label">
                      Color: <strong>{variant.color || 'Select a color'}</strong>
                    </div>
                    <div
                      className={`swatches big variant-swatches ${hasError && !variant.color ? 'error' : ''}`}
                      role="radiogroup"
                      aria-label={`Color for item ${index + 1}`}
                    >
                      {colors.map((c) => (
                        <button
                          key={c.name}
                          type="button"
                          role="radio"
                          aria-checked={variant.color === c.name}
                          aria-label={c.name}
                          title={c.name}
                          className={`swatch ${variant.color === c.name ? 'active' : ''}`}
                          style={{ '--c': c.hex }}
                          onClick={() => updateVariant(variant.id, 'color', c.name)}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="option">
                    <div className="option-label">
                      Size: <strong>{variant.size || 'Select a size'}</strong>
                    </div>
                    <div className={`sizes big ${hasError && !variant.size ? 'error' : ''}`} role="radiogroup" aria-label={`Size for item ${index + 1}`}>
                      {sizes.map((sizeOption) => (
                        <button
                          key={sizeOption}
                          type="button"
                          role="radio"
                          aria-checked={variant.size === sizeOption}
                          className={`size ${variant.size === sizeOption ? 'active' : ''}`}
                          onClick={() => updateVariant(variant.id, 'size', sizeOption)}
                        >
                          {sizeOption}
                        </button>
                      ))}
                    </div>
                    {hasError && <p className="form-msg error">Choose a color and size for this item.</p>}
                  </div>
                  <div className="option variant-quantity">
                    <div className="option-label">Quantity</div>
                    <QtySelect
                      value={variant.qty}
                      onChange={(qty) => updateVariant(variant.id, 'qty', qty)}
                    />
                  </div>
                </section>
              );
            })}
          </div>
          <button type="button" className="btn btn-outline btn-sm variant-add" onClick={addVariant}>
            + Add another color and size
          </button>

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
              {details.map((d) => (
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
