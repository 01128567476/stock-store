import { Link, useNavigate } from 'react-router-dom';
import { STORE, money } from '../config';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useSEO } from '../hooks/useSEO';
import ProductImage from '../components/ProductImage';
import QtySelect from '../components/QtySelect';
import { TrashIcon } from '../components/Icons';

export default function Cart() {
  useSEO('Shopping Cart');
  const { lines, count, subtotal, shipping, total, removeItem, setQty, clear, MAX_QTY } = useCart();
  const navigate = useNavigate();
  const toast = useToast();

  if (lines.length === 0) {
    return (
      <div className="container empty page-pad">
        <h1>Your cart is empty</h1>
        <p className="muted">Looks like you haven't added anything yet.</p>
        <Link to="/shop" className="btn btn-lg">Continue shopping</Link>
      </div>
    );
  }

  const remaining = STORE.freeShippingThreshold - subtotal;

  return (
    <div className="container page-pad">
      <div className="page-head">
        <p className="eyebrow">{count} {count === 1 ? 'item' : 'items'}</p>
        <h1>Shopping cart</h1>
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
                  {l.size !== 'One Size' && <>Size {l.size} · </>}{l.color}
                </p>
                <p className="muted">{money(l.unit)} each</p>
                <div className="cart-controls">
                  <QtySelect value={l.qty} max={MAX_QTY} onChange={(q) => setQty(l.key, q)} />
                  <button
                    className="link-btn"
                    onClick={() => {
                      removeItem(l.key);
                      toast(`${l.product.name} removed`);
                    }}
                  >
                    <TrashIcon size={16} /> Remove
                  </button>
                </div>
              </div>
              <strong className="cart-total">{money(l.total)}</strong>
            </div>
          ))}
          <button className="link-btn" onClick={() => { clear(); toast('Cart cleared'); }}>
            Clear cart
          </button>
        </div>

        <aside className="summary">
          <h2>Order summary</h2>
          <dl>
            <div><dt>Subtotal</dt><dd>{money(subtotal)}</dd></div>
            <div><dt>Shipping</dt><dd>{shipping === 0 ? 'Free' : money(shipping)}</dd></div>
            <div className="grand"><dt>Total</dt><dd>{money(total)}</dd></div>
          </dl>
          {remaining > 0 && (
            <p className="muted small">Add {money(remaining)} more to get free shipping.</p>
          )}
          <button className="btn btn-lg btn-full" onClick={() => navigate('/checkout')}>
            Proceed to checkout
          </button>
          <Link to="/shop" className="link-center">Continue shopping</Link>
        </aside>
      </div>
    </div>
  );
}
