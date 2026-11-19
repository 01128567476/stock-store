import { Link, useLocation, useParams } from 'react-router-dom';
import { STORE, money } from '../config';
import { useSEO } from '../hooks/useSEO';
import { CheckIcon, WhatsAppIcon } from '../components/Icons';

const findOrder = (id, stateOrder) => {
  if (stateOrder && stateOrder.id === id) return stateOrder;
  try {
    return JSON.parse(localStorage.getItem('mv-orders') || '[]').find((o) => o.id === id) || null;
  } catch {
    return null;
  }
};

export default function OrderSuccess() {
  useSEO('Order confirmed');
  const { id } = useParams();
  const { state } = useLocation();
  const order = findOrder(id, state?.order);

  if (!order) {
    return (
      <div className="container empty page-pad">
        <h1>Order not found</h1>
        <p className="muted">We couldn't find an order with that number on this device.</p>
        <Link to="/shop" className="btn btn-lg">Continue shopping</Link>
      </div>
    );
  }

  const lines = order.items.map((i) => `• ${i.qty}× ${i.name} (${i.size}, ${i.color}) — ${money(i.total)}`).join('\n');
  const message = `Hello ${STORE.name}, I just placed order ${order.id}.\n${lines}\nTotal: ${money(order.total)} (Cash on Delivery)\nName: ${order.customer.fullName}\nPhone: ${order.customer.phone}`;
  const wa = `https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(message)}`;

  return (
    <div className="container page-pad success">
      <div className="success-icon"><CheckIcon size={36} /></div>
      <p className="eyebrow">Thank you, {order.customer.fullName.split(' ')[0]}</p>
      <h1>Your order is confirmed</h1>
      <p className="muted">
        Order <strong>{order.id}</strong> · {new Date(order.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
      </p>

      <div className="success-card">
        <div className="success-cols">
          <div>
            <h3>Delivering to</h3>
            <p>{order.customer.fullName}<br />{order.customer.address}<br />{order.customer.city}<br />{order.customer.phone}</p>
          </div>
          <div>
            <h3>Payment</h3>
            <p>{order.payment}<br /><span className="muted">Pay {money(order.total)} on delivery</span></p>
          </div>
        </div>
        <ul className="summary-items">
          {order.items.map((i, idx) => (
            <li key={idx}>
              <div className="summary-img"><img src={i.image} alt={i.name} onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }} /><span className="qty-badge">{i.qty}</span></div>
              <div>
                <strong>{i.name}</strong>
                <span className="muted small">{i.size !== 'One Size' && `${i.size} · `}{i.color}</span>
              </div>
              <span>{money(i.total)}</span>
            </li>
          ))}
        </ul>
        <dl>
          <div><dt>Subtotal</dt><dd>{money(order.subtotal)}</dd></div>
          <div><dt>Shipping</dt><dd>{order.shipping === 0 ? 'Free' : money(order.shipping)}</dd></div>
          <div className="grand"><dt>Total</dt><dd>{money(order.total)}</dd></div>
        </dl>
      </div>

      <div className="hero-actions center">
        <Link to="/shop" className="btn btn-lg">Continue shopping</Link>
        <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-lg">
          <WhatsAppIcon size={18} /> Send details on WhatsApp
        </a>
      </div>
    </div>
  );
}
