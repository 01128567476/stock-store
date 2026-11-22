import { Link } from 'react-router-dom';
import { useLang } from '../context/LangContext';
import { useSEO } from '../hooks/useSEO';

export default function NotFound() {
  const { t } = useLang();
  useSEO(t('notfound.title'));
  return (
    <div className="container empty page-pad">
      <p className="eyebrow">{t('notfound.error')}</p>
      <h1>{t('notfound.title')}</h1>
      <p className="muted">{t('notfound.hint')}</p>
      <Link to="/shop" className="btn btn-lg">{t('notfound.backToShop')}</Link>
    </div>
  );
}
