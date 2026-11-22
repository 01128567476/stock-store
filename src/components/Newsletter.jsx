import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useLang } from '../context/LangContext';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function Newsletter() {
  const [subs, setSubs] = useLocalStorage('mv-newsletter', []);
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState(null);
  const { t } = useLang();

  const submit = (e) => {
    e.preventDefault();
    const value = email.trim().toLowerCase();
    if (!EMAIL_RE.test(value)) {
      setMsg({ type: 'error', text: t('newsletter.invalidEmail') });
      return;
    }
    if (subs.includes(value)) {
      setMsg({ type: 'info', text: t('newsletter.already') });
      return;
    }
    setSubs([...subs, value]);
    setEmail('');
    setMsg({ type: 'success', text: t('newsletter.welcome') });
  };

  return (
    <section className="newsletter">
      <div className="container newsletter-inner">
        <div>
          <p className="eyebrow">{t('newsletter.eyebrow')}</p>
          <h2>{t('newsletter.title')}</h2>
          <p className="muted">{t('newsletter.hint')}</p>
        </div>
        <form onSubmit={submit} noValidate>
          <div className="newsletter-row">
            <input
              type="email"
              placeholder={t('newsletter.placeholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label={t('newsletter.placeholder')}
            />
            <button className="btn" type="submit">
              {t('newsletter.subscribe')}
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
