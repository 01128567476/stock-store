import { Link, useNavigate } from 'react-router-dom';
import { STORE, money } from '../config';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useLang } from '../context/LangContext';
import { useSEO } from '../hooks/useSEO';
import ProductImage from '../components/ProductImage';
import QtySelect from '../components/QtySelect';
import { ArrowIcon, TrashIcon } from '../components/Icons';

export default function Cart() {
  const { t } = useLang();
  useSEO(t('cart.title'));
  const { lines, count, subtotal, shipping, total, removeItem, setQty, clear, MAX_QTY } = useCart();
  const navigate = useNavigate();
  const toast = useToast();

  if (lines.length === 0) {
    return (
      <div className="container empty page-pad">
        <h1>{t('cart.empty')}</h1>
        <p className="muted">{t('cart.emptyHint')}</p>
        <Link to="/shop" className="btn btn-lg btn-discover">
          {t('cart.continueShopping')} <ArrowIcon size={16} />
        </Link>
      </div>
    );
  }

  const remaining = STORE.freeShippingThreshold - subtotal;

  return (
    <div className="container page-pad">
      <div className="page-head">
        <p className="eyebrow">{count} {count === 1 ? t('cart.item') : t('cart.items')}</p>
        <h1>{t('cart.title')}</h1>
      </div>

      <div className="cart-layout">
        <div className="cart-lines">
          {lines.map((l) => (
            <div key={l.key} className="cart-line">
              <Link to={`/product/${l.product.id}`} className="cart-img">
                <ProductImage src={l.product.images[0]} alt={l.product.name} />
              </Link>
              <div className="cart-info">
                <Link to={`/product/${l.product.id}`} className="card-title">{l.product.name}</Link>
                <p className="muted">
                  {l.size !== 'One Size' && <>{t('cart.size', { size: l.size })}</>}{l.color}
                </p>
                <p className="muted">{money(l.unit)} {t('cart.each')}</p>
                <div className="cart-controls">
                  <QtySelect value={l.qty} max={MAX_QTY} onChange={(q) => setQty(l.key, q)} />
                  <button
                    className="link-btn"
                    onClick={() => {
                      removeItem(l.key);
                      toast('cart.removed', 'success', { name: l.product.name });
                    }}
                  >
                    <TrashIcon size={16} /> {t('cart.remove')}
                  </button>
                </div>
              </div>
              <strong className="cart-total">{money(l.total)}</strong>
            </div>
          ))}
          <button className="link-btn" onClick={() => { clear(); toast('cart.cleared'); }}>
            {t('cart.clear')}
          </button>
        </div>

        <aside className="summary">
          <h2>{t('cart.summary')}</h2>
          <dl>
            <div><dt>{t('cart.subtotal')}</dt><dd>{money(subtotal)}</dd></div>
            <div><dt>{t('cart.shipping')}</dt><dd>{shipping === 0 ? t('cart.free') : money(shipping)}</dd></div>
            <div className="grand"><dt>{t('cart.total')}</dt><dd>{money(total)}</dd></div>
          </dl>
          {remaining > 0 && (
            <p className="muted small">{t('cart.addMoreFreeShipping', { amount: money(remaining) })}</p>
          )}
          <button className="btn btn-lg btn-full" onClick={() => navigate('/checkout')}>
            {t('cart.proceed')}
          </button>
          <Link to="/shop" className="link-center">{t('cart.continueShopping')}</Link>
        </aside>
      </div>
    </div>
  );
}
