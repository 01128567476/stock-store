import { useRef, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { money } from '../config';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useSEO } from '../hooks/useSEO';
import ProductImage from '../components/ProductImage';
import { CashIcon, InstapayIcon, WalletIcon } from '../components/Icons';

const CITIES = ['Cairo', 'Giza', 'Alexandria', 'Mansoura', 'Tanta', 'Port Said', 'Suez', 'Ismailia', 'Luxor', 'Aswan', 'Hurghada', 'Sharm El Sheikh', 'Damanhour', 'Zagazig', 'Asyut'];

const validators = {
  fullName: (v) => (v.trim().length >= 3 ? '' : 'Please enter your full name'),
  phone: (v) => (/^\+?[\d\s-]{9,15}$/.test(v.trim()) ? '' : 'Enter a valid phone number'),
  address: (v) => (v.trim().length >= 8 ? '' : 'Please enter your full address'),
  city: (v) => (v.trim().length >= 2 ? '' : 'Please enter your city'),
};

export default function Checkout() {
  useSEO('Checkout');
  const { lines, subtotal, shipping, total, clear } = useCart();
  const navigate = useNavigate();
  const toast = useToast();
  const placed = useRef(false);
  const [form, setForm] = useState({ fullName: '', phone: '', address: '', city: '', notes: '', payment: 'cod' });
  const [errors, setErrors] = useState({});

  if (lines.length === 0 && !placed.current) return <Navigate to="/cart" replace />;

  const set = (field) => (e) => {
    const value = e.target.value;
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((er) => ({ ...er, [field]: validators[field]?.(value) || '' }));
  };

  const blur = (field) => () => setErrors((er) => ({ ...er, [field]: validators[field](form[field]) }));

  const submit = (e) => {
    e.preventDefault();
    const found = {};
    Object.keys(validators).forEach((k) => {
      const msg = validators[k](form[k]);
      if (msg) found[k] = msg;
    });
    setErrors(found);
    if (Object.keys(found).length) {
      toast('Please fix the highlighted fields', 'error');
      const first = document.querySelector(`[name="${Object.keys(found)[0]}"]`);
      first?.focus();
      return;
    }

    const id = `MV-${Date.now().toString(36).toUpperCase()}`;
    const order = {
      id,
      date: new Date().toISOString(),
      customer: {
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        notes: form.notes.trim(),
      },
      payment: form.payment === 'cod' ? 'Cash on Delivery' : form.payment === 'instapay' ? 'InstaPay' : 'E-Wallet',
      items: lines.map((l) => ({
        name: l.product.name,
        size: l.size,
        color: l.color,
        qty: l.qty,
        unit: l.unit,
        total: l.total,
        image: l.product.images[0],
      })),
      subtotal,
      shipping,
      total,
    };

    try {
      const prev = JSON.parse(localStorage.getItem('mv-orders') || '[]');
      localStorage.setItem('mv-orders', JSON.stringify([order, ...prev]));
    } catch {
      /* storage unavailable */
    }

    placed.current = true;
    navigate(`/order/${id}`, { replace: true, state: { order } });
    clear();
  };

  const field = (name, label, props = {}) => (
    <div className={`field ${errors[name] ? 'invalid' : ''}`}>
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} value={form[name]} onChange={set(name)} onBlur={blur(name)} aria-invalid={!!errors[name]} {...props} />
      {errors[name] && <span className="field-error">{errors[name]}</span>}
    </div>
  );

  return (
    <div className="container page-pad">
      <div className="page-head">
        <p className="eyebrow">Almost there</p>
        <h1>Checkout</h1>
      </div>

      <form className="cart-layout" onSubmit={submit} noValidate>
        <div className="checkout-form">
          <h2>Delivery details</h2>
          <div className="form-grid">
            {field('fullName', 'Full name', { autoComplete: 'name', placeholder: 'e.g. Ahmed Hassan' })}
            {field('phone', 'Phone number', { type: 'tel', autoComplete: 'tel', placeholder: '+20 1xx xxx xxxx' })}
            <div className="span-2">{field('address', 'Address', { autoComplete: 'street-address', placeholder: 'Street, building, apartment' })}</div>
            {field('city', 'City', { list: 'cities', autoComplete: 'address-level2', placeholder: 'Select or type your city' })}
            <datalist id="cities">
              {CITIES.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
            <div className="field">
              <label htmlFor="notes">Order notes (optional)</label>
              <input id="notes" name="notes" value={form.notes} onChange={set('notes')} placeholder="Delivery instructions" />
            </div>
          </div>

          <h2>Payment method</h2>
          <div className="pay-grid">
            <label className={`pay-option ${form.payment === 'cod' ? 'selected' : ''}`}>
              <input type="radio" name="payment" value="cod" checked={form.payment === 'cod'} onChange={() => setForm((f) => ({ ...f, payment: 'cod' }))} />
              <CashIcon size={22} />
              <div>
                <strong>Cash on Delivery</strong>
                <span>Pay in cash when your order arrives.</span>
              </div>
            </label>
            <label className={`pay-option ${form.payment === 'instapay' ? 'selected' : ''}`}>
              <input type="radio" name="payment" value="instapay" checked={form.payment === 'instapay'} onChange={() => setForm((f) => ({ ...f, payment: 'instapay' }))} />
              <InstapayIcon size={22} />
              <div>
                <strong>InstaPay</strong>
                <span>Pay instantly via your InstaPay app.</span>
              </div>
            </label>
            <label className={`pay-option ${form.payment === 'wallet' ? 'selected' : ''}`}>
              <input type="radio" name="payment" value="wallet" checked={form.payment === 'wallet'} onChange={() => setForm((f) => ({ ...f, payment: 'wallet' }))} />
              <WalletIcon size={22} />
              <div>
                <strong>E-Wallet</strong>
                <span>Vodafone Cash · Etisalat Cash · Orange Money · We</span>
              </div>
            </label>
          </div>
        </div>

        <aside className="summary">
          <h2>Order summary</h2>
          <ul className="summary-items">
            {lines.map((l) => (
              <li key={l.key}>
                <div className="summary-img">
                  <ProductImage src={l.product.images[0]} alt={l.product.name} />
                  <span className="qty-badge">{l.qty}</span>
                </div>
                <div>
                  <strong>{l.product.name}</strong>
                  <span className="muted small">{l.size !== 'One Size' && `${l.size} · `}{l.color}</span>
                </div>
                <span>{money(l.total)}</span>
              </li>
            ))}
          </ul>
          <dl>
            <div><dt>Subtotal</dt><dd>{money(subtotal)}</dd></div>
            <div><dt>Shipping</dt><dd>{shipping === 0 ? 'Free' : money(shipping)}</dd></div>
            <div className="grand"><dt>Total</dt><dd>{money(total)}</dd></div>
          </dl>
          <button type="submit" className="btn btn-lg btn-full">Confirm Order</button>
          <p className="muted small center">You will pay {money(total)} via {form.payment === 'cod' ? 'cash on delivery' : form.payment === 'instapay' ? 'InstaPay' : 'E-Wallet'}.</p>
        </aside>
      </form>
    </div>
  );
}
