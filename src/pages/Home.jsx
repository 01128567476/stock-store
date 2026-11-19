import { Link } from 'react-router-dom';
import { CATEGORIES, IMAGES, PRODUCTS, discountPercent } from '../data/products';
import { STORE } from '../config';
import { useSEO } from '../hooks/useSEO';
import ProductSection from '../components/ProductSection';
import Reveal from '../components/Reveal';
import Stars from '../components/Stars';
import { ArrowIcon, CashIcon, ReturnIcon, ShieldIcon, TruckIcon } from '../components/Icons';

const REVIEWS = [
  { name: 'Nour A.', city: 'Cairo', rating: 5, text: 'The quality is outstanding. The tailored blazer fits perfectly and the delivery was faster than promised.' },
  { name: 'Omar H.', city: 'Alexandria', rating: 5, text: 'Finally a local brand that feels international. The oversized tee is my new favourite, ordered three more.' },
  { name: 'Salma K.', city: 'Giza', rating: 4, text: 'Beautiful fabrics and elegant packaging. Cash on delivery made ordering stress-free.' },
  { name: 'Youssef M.', city: 'Mansoura', rating: 5, text: 'The wool blazer looks far more expensive than it is. Great customer service on WhatsApp too.' },
];

const FEATURES = [
  { icon: TruckIcon, title: 'Fast delivery', text: `Free over ${STORE.freeShippingThreshold.toLocaleString('en-US')} ${STORE.currency}` },
  { icon: CashIcon, title: 'Cash on delivery', text: 'Pay when it arrives' },
  { icon: ReturnIcon, title: 'Easy returns', text: '14 days, no questions' },
  { icon: ShieldIcon, title: 'Premium quality', text: 'Responsibly sourced fabrics' },
];

export default function Home() {
  useSEO(null);
  const featured = PRODUCTS.filter((p) => p.featured).slice(0, 4);
  const newArrivals = PRODUCTS.filter((p) => p.isNew).slice(0, 4);
  const best = PRODUCTS.filter((p) => p.bestSeller).slice(0, 4);
  const onSale = PRODUCTS.filter((p) => p.salePrice != null);
  const maxOff = Math.max(...onSale.map(discountPercent));

  return (
    <>
      <section className="hero" style={{ '--hero-img': `url(${IMAGES.hero})` }}>
        <div className="container hero-content">
          <p className="eyebrow light">The new season edit</p>
          <h1>EVERYDAY,<br /><span>ELEVATED.</span></h1>
          <p className="hero-sub">Modern essentials, considered details, and effortless style for every day.</p>
          <div className="hero-actions">
            <Link to="/shop" className="btn btn-light btn-lg">
              Shop Now <ArrowIcon size={18} />
            </Link>
            <Link to="/shop?sort=newest" className="btn btn-ghost btn-lg">
              New Arrivals
            </Link>
          </div>
        </div>
      </section>

      <section className="features container">
        {FEATURES.map(({ icon: Icon, title, text }) => (
          <div key={title} className="feature">
            <Icon size={26} />
            <div>
              <strong>{title}</strong>
              <span>{text}</span>
            </div>
          </div>
        ))}
      </section>

      <Reveal as="section" className="section container">
        <div className="section-head">
          <div>
            <p className="eyebrow">Browse</p>
            <h2>Shop by category</h2>
          </div>
        </div>
        <div className="cat-grid">
          {CATEGORIES.map((c) => (
            <Link key={c.id} to={`/shop?category=${c.id}`} className="cat-tile" style={{ '--img': `url(${IMAGES.categories[c.id]})` }}>
              <span>{c.label}</span>
              <small>
                Explore <ArrowIcon size={14} />
              </small>
            </Link>
          ))}
        </div>
      </Reveal>

      <ProductSection eyebrow="Curated for you" title="Featured products" products={featured} to="/shop" />
      <ProductSection eyebrow="Just landed" title="New arrivals" products={newArrivals} to="/shop?sort=newest" />

      <Reveal as="section" className="offer" >
        <div className="offer-bg" style={{ '--img': `url(${IMAGES.banner})` }}>
          <div className="container offer-inner">
            <p className="eyebrow light">Special offer</p>
            <h2>Up to {maxOff}% off selected styles</h2>
            <p>Limited-time prices on blazers, knitwear, shirts and sneakers while stock lasts.</p>
            <Link to="/shop?sale=1" className="btn btn-light btn-lg">
              Shop the sale <ArrowIcon size={18} />
            </Link>
          </div>
        </div>
      </Reveal>

      <ProductSection eyebrow="Loved by our customers" title="Best sellers" products={best} to="/shop" />
      <ProductSection eyebrow="Reduced" title="On sale now" products={onSale.slice(0, 4)} to="/shop?sale=1" linkLabel="See all offers" />

      <Reveal as="section" className="section container">
        <div className="section-head">
          <div>
            <p className="eyebrow">Testimonials</p>
            <h2>What our customers say</h2>
          </div>
        </div>
        <div className="reviews">
          {REVIEWS.map((r) => (
            <figure key={r.name} className="review">
              <Stars value={r.rating} />
              <blockquote>“{r.text}”</blockquote>
              <figcaption>
                <strong>{r.name}</strong> · {r.city}
              </figcaption>
            </figure>
          ))}
        </div>
      </Reveal>
    </>
  );
}
