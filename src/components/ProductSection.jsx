import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import Reveal from './Reveal';
import { ArrowIcon } from './Icons';
import { useLang } from '../context/LangContext';

export default function ProductSection({ eyebrow, title, products, moreTo, moreLabel }) {
  const { t } = useLang();
  return (
    <Reveal as="section" className="section container">
      <div className="section-head">
        <div>
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h2>{title}</h2>
        </div>
      </div>
      <div className="grid">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      {moreTo && (
        <div className="section-more">
          <Link to={moreTo} className="btn btn-lg btn-discover">
            {moreLabel || t('home.viewAll')} <ArrowIcon size={16} />
          </Link>
        </div>
      )}
    </Reveal>
  );
}
