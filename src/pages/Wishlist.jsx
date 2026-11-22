import { Link } from 'react-router-dom';
import { ArrowIcon } from '../components/Icons';
import { useWishlist } from '../context/WishlistContext';
import { useAdmin } from '../context/AdminContext';
import { useLang } from '../context/LangContext';
import { useSEO } from '../hooks/useSEO';
import ProductCard from '../components/ProductCard';

export default function Wishlist() {
  const { t } = useLang();
  useSEO(t('wishlist.title'));
  const { ids } = useWishlist();
  const { products, isSeasonHidden } = useAdmin();
  const items = products.filter((p) =>
    ids.includes(p.id) && p.active !== false && !isSeasonHidden(p.season)
  );

  return (
    <div className="container page-pad">
      <div className="page-head">
        <p className="eyebrow">{t('wishlist.saved', { count: items.length })}</p>
        <h1>{t('wishlist.title')}</h1>
      </div>
      {items.length === 0 ? (
        <div className="empty">
          <h2>{t('wishlist.nothingSaved')}</h2>
          <p className="muted">{t('wishlist.hint')}</p>
          <Link to="/shop" className="btn btn-lg btn-discover">
            {t('wishlist.discover')} <ArrowIcon size={16} />
          </Link>
        </div>
      ) : (
        <div className="grid">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
