import { Link } from 'react-router-dom';
import { ArrowIcon } from '../components/Icons';
import { PRODUCTS } from '../data/products';
import { useWishlist } from '../context/WishlistContext';
import { useSEO } from '../hooks/useSEO';
import ProductCard from '../components/ProductCard';

export default function Wishlist() {
  useSEO('Wishlist');
  const { ids } = useWishlist();
  const items = PRODUCTS.filter((p) => ids.includes(p.id));

  return (
    <div className="container page-pad">
      <div className="page-head">
        <p className="eyebrow">{items.length} saved</p>
        <h1>Your wishlist</h1>
      </div>
      {items.length === 0 ? (
        <div className="empty">
          <h2>Nothing saved yet</h2>
          <p className="muted">Tap the heart on any product to save it here.</p>
          <Link to="/shop" className="btn btn-lg btn-discover">
            Discover the collection <ArrowIcon size={16} />
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
