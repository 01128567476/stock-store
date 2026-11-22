import { Link } from 'react-router-dom';
import { CATEGORIES, IMAGES, discountPercent, sortByNewest, sortBySaleAndNewest } from '../data/products';
import { STORE } from '../config';
import { useAdmin } from '../context/AdminContext';
import { useLang } from '../context/LangContext';
import { useSEO } from '../hooks/useSEO';
import ProductSection from '../components/ProductSection';
import Reveal from '../components/Reveal';
import Stars from '../components/Stars';
import LanguageToggle from '../components/LanguageToggle';
import { ArrowIcon, CashIcon, ReturnIcon, ShieldIcon, TruckIcon } from '../components/Icons';

const FEATURE_ICONS = [
  { icon: TruckIcon, titleKey: 'features.fastDelivery', textKey: 'features.fastDeliveryText' },
  { icon: CashIcon, titleKey: 'features.cod', textKey: 'features.codText' },
  { icon: ReturnIcon, titleKey: 'features.returns', textKey: 'features.returnsText' },
  { icon: ShieldIcon, titleKey: 'features.quality', textKey: 'features.qualityText' },
];

export default function Home() {
  useSEO(null);
  const { t } = useLang();
  const { products, isSeasonHidden } = useAdmin();
  const visible = products.filter((p) => p.active !== false && !isSeasonHidden(p.season));
  const newArrivals = sortBySaleAndNewest(visible.filter((p) => p.isNew || p.salePrice != null)).slice(0, 4);
  const onSale = sortByNewest(visible.filter((p) => p.salePrice != null));
  const maxOff = onSale.length ? Math.max(...onSale.map(discountPercent)) : 0;
  const reviews = t('reviews');
  const features = FEATURE_ICONS.map(({ icon, titleKey, textKey }) => ({
    icon,
    title: t(titleKey),
    text:
      textKey === 'features.fastDeliveryText'
        ? t(titleKey, {
            amount: STORE.freeShippingThreshold.toLocaleString('en-US'),
            currency: STORE.currency,
          })
        : t(textKey),
  }));

  return (
    <>
      <section className="hero" style={{ '--hero-img': `url(${IMAGES.hero})` }}>
        <div className="hero-content">
          <LanguageToggle className="lang-toggle-hero" />
          <p className="eyebrow light">{t('hero.eyebrow')}</p>
          <h1>{t('hero.h1Line1')}<br /><span>{t('hero.h1Line2')}</span></h1>
          <p className="hero-sub">{t('hero.sub')}</p>
          <div className="hero-actions">
            <Link to="/shop" className="btn btn-light btn-lg">
              {t('hero.shopNow')} <ArrowIcon size={18} />
            </Link>
            <Link to="/shop?sort=newest" className="btn btn-ghost btn-lg">
              {t('hero.newArrivals')}
            </Link>
            <Link to="/admin/login" className="btn btn-sm btn-ghost admin-mobile-link">
              {t('nav.admin')}
            </Link>
          </div>
        </div>
      </section>

      <section className="features container">
        {features.map(({ icon: Icon, title, text }) => (
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
            <p className="eyebrow">{t('home.browse')}</p>
            <h2>{t('home.shopByCategory')}</h2>
          </div>
        </div>
        <div className="cat-grid">
          {CATEGORIES.map((c, index) => (
            <Link key={c.id} to={`/shop?category=${c.id}`} className="cat-tile" style={{ '--img': `url(${IMAGES.categories[c.id]})` }}>
              <span className="cat-tile-top">
                <span className="cat-tile-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                <span className="cat-tile-tag" aria-hidden="true">{t('home.collection')}</span>
              </span>
              <span className="cat-tile-footer">
                <span className="cat-tile-title">{t(`category.${c.id}`)}</span>
                <small className="cat-tile-action">
                  {t('home.explore')} <ArrowIcon size={14} />
                </small>
              </span>
            </Link>
          ))}
        </div>
      </Reveal>

      <ProductSection eyebrow={t('home.justLanded')} title={t('home.newArrivals')} products={newArrivals} to="/shop?sort=newest" />

      <Reveal as="section" className="offer" >
        <div className="offer-bg" style={{ '--img': `url(${IMAGES.banner})` }}>
          <div className="container offer-inner">
            <p className="eyebrow light">{t('home.specialOffer')}</p>
            <h2>{t('home.offerTitle', { percent: maxOff })}</h2>
            <p>{t('home.offerText')}</p>
            <Link to="/shop?sale=1" className="btn btn-light btn-lg">
              {t('home.shopSale')} <ArrowIcon size={18} />
            </Link>
          </div>
        </div>
      </Reveal>

      <ProductSection eyebrow={t('home.reduced')} title={t('home.onSaleNow')} products={onSale.slice(0, 4)} to="/shop?sale=1" linkLabel={t('home.seeAllOffers')} />

      <Reveal as="section" className="section container">
        <div className="section-head">
          <div>
            <p className="eyebrow">{t('home.testimonials')}</p>
            <h2>{t('home.whatCustomersSay')}</h2>
          </div>
        </div>
        <div className="reviews">
          {reviews.map((r) => (
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
