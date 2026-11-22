import { useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { discountPercent, getCategoryName, getProductDetails } from '../data/products';
import { useAdmin } from '../context/AdminContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { useLang } from '../context/LangContext';
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
  const { products, categories, isSeasonHidden } = useAdmin();
  const product = products.find((p) => p.id === id);
  if (!product || product.active === false || isSeasonHidden(product.season)) return <NotFound />;
  return <Details key={product.id} product={product} categories={categories} />;
}

function Details({ product, categories }) {
  const { t, lang } = useLang();
  const { products, isSeasonHidden } = useAdmin();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { has, toggle } = useWishlist();
  const toast = useToast();
  const [img, setImg] = useState(0);
  const colors = Array.isArray(product.colors) ? product.colors : [];
  const sizes = Array.isArray(product.sizes) ? product.sizes : [];
  const images = Array.isArray(product.images) ? product.images.filter(Boolean) : [];
  const soldOutWhole = product.soldOut === true;
  const soldOutColors = new Set(product.soldOutColors || []);
  const soldOutSizes = new Set(product.soldOutSizes || []);
  const availableColors = colors.filter((color) => !soldOutWhole && !soldOutColors.has(color.name));
  const availableSizes = sizes.filter((size) => !soldOutWhole && !soldOutSizes.has(size));
  const [variants, setVariants] = useState([{
    id: 0,
    color: availableColors[0]?.name || '',
    size: availableSizes.length === 1 ? availableSizes[0] : null,
    qty: 1,
  }]);
  const [variantErrors, setVariantErrors] = useState([]);
  const nextVariantId = useRef(1);

  useSEO(product.name, product.description);

  const pct = discountPercent(product);
  const details = getProductDetails(product);
  const wished = has(product.id);
  const category = categories.find((item) => item.id === product.category);
  const catLabel = category ? getCategoryName(category, lang) : '';
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
      color: availableColors[0]?.name || '',
      size: availableSizes.length === 1 ? availableSizes[0] : null,
      qty: 1,
    }]);
  };

  const removeVariant = (id) => {
    setVariants((current) => current.filter((variant) => variant.id !== id));
    setVariantErrors((current) => current.filter((variantId) => variantId !== id));
  };

  const addVariantsToCart = () => {
    const invalidVariants = variants.filter((variant) =>
      !variant.color ||
      !variant.size ||
      soldOutWhole ||
      soldOutColors.has(variant.color) ||
      soldOutSizes.has(variant.size)
    );
    if (invalidVariants.length) {
      setVariantErrors(invalidVariants.map((variant) => variant.id));
      toast('product.chooseColorSize', 'error');
      return false;
    }

    variants.forEach(({ color, size, qty }) => addItem(product, { size, color, qty }));
    return true;
  };

  const add = () => {
    if (!addVariantsToCart()) return;
    toast('product.addedToCart', 'success', { name: product.name });
  };

  const buyNow = () => {
    if (!addVariantsToCart()) return;
    navigate('/checkout');
  };

  if (!colors.length || !sizes.length || !images.length) {
    return <div className="container pdp"><p>{t('product.incomplete')}</p></div>;
  }

  return (
    <div className="container pdp">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link to="/">{t('product.home')}</Link> / <Link to="/shop">{t('product.shop')}</Link> / <Link to={`/shop?category=${product.category}`}>{catLabel}</Link> /{' '}
        <span>{product.name}</span>
      </nav>

      <div className="pdp-grid">
        <div className="gallery">
          <div className="thumbs">
            {images.map((src, i) => (
              <button key={src} className={`thumb ${i === img ? 'active' : ''}`} onClick={() => setImg(i)} aria-label={t('product.viewImage', { index: i + 1 })}>
                <ProductImage src={src} alt={`${product.name} view ${i + 1}`} />
              </button>
            ))}
          </div>
          <div className="gallery-main">
            <ProductImage src={images[img % images.length]} alt={product.name} loading="eager" />
            <div className="badges">
              {pct > 0 && <span className="badge badge-sale">-{pct}%</span>}
              {soldOutWhole && <span className="badge badge-sold-out">{t('admin.soldOut')}</span>}
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
                <section key={variant.id} className="variant-row" aria-label={t('product.item', { index: index + 1 })}>
                  <div className="variant-row-head">
                    <div className="variant-item-title">
                      <span className="variant-item-number">{String(index + 1).padStart(2, '0')}</span>
                      <strong>{t('product.item', { index: index + 1 })}</strong>
                    </div>
                    {variants.length > 1 && (
                      <button type="button" className="variant-remove" onClick={() => removeVariant(variant.id)}>
                        <TrashIcon size={15} /> {t('product.remove')}
                      </button>
                    )}
                  </div>
                  <div className="option">
                    <div className="option-label">
                      {t('product.color')} <strong>{variant.color || t('product.selectColor')}</strong>
                    </div>
                    <div
                      className={`swatches big variant-swatches ${hasError && !variant.color ? 'error' : ''}`}
                      role="radiogroup"
                      aria-label={t('product.color')}
                    >
                      {colors.map((c) => (
                        <button
                          key={c.name}
                          type="button"
                          role="radio"
                          aria-checked={variant.color === c.name}
                          aria-label={c.name}
                          title={c.name}
                          className={`swatch ${variant.color === c.name ? 'active' : ''} ${soldOutWhole || soldOutColors.has(c.name) ? 'sold-out' : ''}`}
                          style={{ '--c': c.hex }}
                          disabled={soldOutWhole || soldOutColors.has(c.name)}
                          onClick={() => updateVariant(variant.id, 'color', c.name)}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="option">
                    <div className="option-label">
                      {t('product.size')} <strong>{variant.size || t('product.selectSize')}</strong>
                    </div>
                    <div className={`sizes big ${hasError && !variant.size ? 'error' : ''}`} role="radiogroup" aria-label={t('product.size')}>
                      {sizes.map((sizeOption) => (
                        <button
                          key={sizeOption}
                          type="button"
                          role="radio"
                          aria-checked={variant.size === sizeOption}
                          className={`size ${variant.size === sizeOption ? 'active' : ''} ${soldOutWhole || soldOutSizes.has(sizeOption) ? 'sold-out' : ''}`}
                          disabled={soldOutWhole || soldOutSizes.has(sizeOption)}
                          onClick={() => updateVariant(variant.id, 'size', sizeOption)}
                        >
                          {sizeOption}
                        </button>
                      ))}
                    </div>
                    {hasError && <p className="form-msg error">{t('product.chooseColorSize')}</p>}
                  </div>
                  <div className="option variant-quantity">
                    <div className="option-label">{t('product.quantity')}</div>
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
            {t('product.addAnother')}
          </button>

          <div className="pdp-actions">
            <button className="btn btn-lg btn-discover" onClick={add} disabled={soldOutWhole}>
              <BagIcon size={18} /> {t('product.addToCart')}
            </button>
            <button className="btn btn-outline btn-lg btn-buy" onClick={buyNow} disabled={soldOutWhole}>
              {t('product.buyNow')}
            </button>
            <button
              className={`btn btn-outline btn-lg icon-only wish-btn ${wished ? 'on' : ''}`}
              onClick={() => {
                toggle(product.id);
                toast(wished ? 'product.removedWishlist' : 'product.savedWishlist', wished ? 'wishlist-remove' : 'wishlist');
              }}
              aria-pressed={wished}
              aria-label={wished ? t('product.removeWishlist') : t('product.addWishlist')}
            >
              <HeartIcon filled={wished} />
            </button>
          </div>

          <ul className="pdp-perks">
            <li><TruckIcon size={18} /> {t('product.freeDeliveryOver')}</li>
            <li><CashIcon size={18} /> {t('product.codAvailable')}</li>
            <li><ReturnIcon size={18} /> {t('product.returns')}</li>
          </ul>

          <div className="pdp-details">
            <h3>{t('product.details')}</h3>
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
            <h2>{t('product.youMayAlsoLike')}</h2>
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
