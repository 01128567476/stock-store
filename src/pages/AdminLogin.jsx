import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { CloseIcon, ShieldIcon } from '../components/Icons';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login, isLoggedIn } = useAdmin();
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn) navigate('/admin', { replace: true });
  }, [isLoggedIn, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const ok = login(username, '');
    setLoading(false);
    if (ok) {
      navigate('/admin');
    } else {
      setError('Invalid username');
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-wrapper">
        <div className="admin-login-card">
          <button
            type="button"
            className="admin-login-close"
            onClick={() => navigate('/')}
            aria-label="Back to store"
          >
            <CloseIcon size={18} />
          </button>

          <div className="admin-login-brand">
            <ShieldIcon size={32} />
            <div>
              <span className="logo-text">STOCK</span>
              <span className="admin-brand-sub">Admin</span>
            </div>
          </div>

          <div className="admin-login-header">
            <h1>Welcome back</h1>
            <p className="admin-login-tagline">Sign in to manage your store catalog</p>
          </div>

          {error && (
            <div className="admin-error">
              <CloseIcon size={14} style={{ marginRight: '0.6rem' }} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                autoFocus
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-lg btn-full"
              disabled={loading}
            >
              {loading ? <span>Signing in…</span> : 'Sign in'}
            </button>
          </form>

          <p className="admin-hint">
            Default username: <strong>admin</strong>
          </p>
        </div>
      </div>
    </div>
  );
}