import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { IMAGES } from '../data/products';
import { ArrowIcon, EyeOffIcon, EyeIcon, ShieldIcon } from '../components/Icons';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login, isLoggedIn } = useAdmin();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn) navigate('/admin', { replace: true });
  }, [isLoggedIn, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const ok = login(username, password);
    setLoading(false);
    if (ok) {
      navigate('/admin');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-shell">
        <aside className="admin-login-visual">
          <img className="admin-login-image" src={IMAGES.hero} alt="" />
          <div className="admin-login-visual-shade" />
          <div className="admin-login-visual-content">
            <div className="admin-login-wordmark">STOCK<span>.</span></div>
            <div className="admin-login-visual-copy">
              <span className="admin-login-overline">STOCK STORE · CONTROL ROOM</span>
              <h2>Good business<br />starts with<br /><em>good details.</em></h2>
              <p>Your store, your catalog, all in one place.</p>
            </div>
            <span className="admin-login-visual-foot">A considered way to manage your store.</span>
          </div>
        </aside>

        <section className="admin-login-panel">
          <button
            type="button"
            className="admin-login-back"
            onClick={() => navigate('/')}
          >
            <ArrowIcon size={16} />
            <span>Back to store</span>
          </button>

          <div className="admin-login-wrapper">
            <div className="admin-login-brand">
              <span className="admin-login-brand-icon"><ShieldIcon size={21} /></span>
              <span className="logo-text">STOCK</span>
              <span className="admin-brand-sub">Admin</span>
            </div>

            <div className="admin-login-header">
              <span className="admin-login-kicker">WELCOME BACK</span>
              <h1>Sign in to your<br />workspace.</h1>
              <p className="admin-login-tagline">Manage your catalog and keep your store moving.</p>
            </div>

            {error && (
              <div className="admin-error" role="alert">
                <span className="admin-error-mark">!</span>
                <span>{error}</span>
              </div>
            )}

            <form className="admin-login-form" onSubmit={handleSubmit} noValidate>
              <div className="admin-login-field">
                <label htmlFor="admin-username">Username</label>
                <input
                  id="admin-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  autoComplete="username"
                  aria-invalid={Boolean(error)}
                  required
                />
              </div>

              <div className="admin-login-field admin-login-password">
                <label htmlFor="admin-password">Password</label>
                <div className="admin-login-password-wrap">
                  <input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    aria-invalid={Boolean(error)}
                    required
                  />
                  <button
                    type="button"
                    className="admin-toggle-password"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeIcon size={18} /> : <EyeOffIcon size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="admin-login-submit"
                disabled={loading}
              >
                <span>{loading ? 'Signing in…' : 'Sign in to dashboard'}</span>
                {!loading && <ArrowIcon size={18} />}
              </button>
            </form>

            <div className="admin-login-footnote">
              <ShieldIcon size={16} />
              <span>Authorized store administrators only</span>
            </div>
          </div>
          <span className="admin-login-copyright">© 2026 STOCK STORE</span>
        </section>
      </div>
    </div>
  );
}