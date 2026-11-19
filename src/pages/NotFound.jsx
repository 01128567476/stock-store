import { Link } from 'react-router-dom';
import { useSEO } from '../hooks/useSEO';

export default function NotFound() {
  useSEO('Page not found');
  return (
    <div className="container empty page-pad">
      <p className="eyebrow">Error 404</p>
      <h1>This page doesn't exist</h1>
      <p className="muted">The page you are looking for may have moved or no longer exists.</p>
      <Link to="/shop" className="btn btn-lg">Back to the shop</Link>
    </div>
  );
}
