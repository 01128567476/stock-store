import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import Reveal from './Reveal';
import { ArrowIcon } from './Icons';

export default function ProductSection({ eyebrow, title, products, to, linkLabel = 'View all' }) {
  return (
    <Reveal as="section" className="section container">
      <div className="section-head">
        <div>
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h2>{title}</h2>
        </div>
        {to && (
          <Link to={to} className="link-arrow">
            {linkLabel} <ArrowIcon size={16} />
          </Link>
        )}
      </div>
      <div className="grid">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </Reveal>
  );
}
