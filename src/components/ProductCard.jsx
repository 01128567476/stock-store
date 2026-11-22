import { Link } from 'react-router-dom';
import { discountPercent } from '../data/products';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { useLang } from '../context/LangContext';
import ProductImage from './ProductImage';
import Price from './Price';
import { BagIcon, HeartIcon } from './Icons';

export default function ProductCard({ product }) {
  const { has, toggle } = useWishlist();
  const toast = useToast();
  const { t } = useLang();
  const pct = discountPercent(product);
  const wished = has(product.id);
  const link = `/product/${product.id}`;

  return (
    <article className="card">
      <div className="card-media">
        <Link to={link} aria-label={product.name}>
          <ProductImage src={product.images[0]} alt={product.name} />
          <img
            className="card-alt"
            src={product.images[1]}
            alt=""
            aria-hidden="true"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </Link>
        <div className="badges">
          {pct > 0 && <span className="badge badge-sale">-{pct}%</span>}
          {product.isNew && <span className="badge">{t('product.new')}</span>}
        </div>
        <button
          className={`wish ${wished ? 'on' : ''}`}
          onClick={() => {
            toggle(product.id);
            toast(wished ? t('product.removedWishlist') : t('product.savedWishlist'), wished ? 'wishlist-remove' : 'wishlist');
          }}
          aria-pressed={wished}
          aria-label={wished ? t('product.removeWishlist') : t('product.addWishlist')}
        >
          <HeartIcon filled={wished} size={18} />
        </button>
      </div>

      <div className="card-body">
        <Link to={link} className="card-title">{product.name}</Link>
        <Price product={product} />

        <Link className="btn btn-full" to={link}>
          <BagIcon size={16} /> {t('product.addToCart')}
        </Link>
      </div>
    </article>
  );
}
