import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function Newsletter() {
  const [subs, setSubs] = useLocalStorage('mv-newsletter', []);
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState(null);

  const submit = (e) => {
    e.preventDefault();
    const value = email.trim().toLowerCase();
    if (!EMAIL_RE.test(value)) {
      setMsg({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }
    if (subs.includes(value)) {
      setMsg({ type: 'info', text: 'You are already subscribed. Thank you!' });
      return;
    }
    setSubs([...subs, value]);
    setEmail('');
    setMsg({ type: 'success', text: 'Welcome to the list! Look out for our next drop.' });
  };

  return (
    <section className="newsletter">
      <div className="container newsletter-inner">
        <div>
          <p className="eyebrow">The Inner Circle</p>
          <h2>Join our newsletter</h2>
          <p className="muted">New arrivals, private sales and style notes. No spam, ever.</p>
        </div>
        <form onSubmit={submit} noValidate>
          <div className="newsletter-row">
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email address"
            />
            <button className="btn" type="submit">
              Subscribe
            </button>
          </div>
          {msg && (
            <p className={`form-msg ${msg.type}`} role="status">
              {msg.text}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
