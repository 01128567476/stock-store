import { useLang } from '../context/LangContext';
import { GlobeIcon } from './Icons';

export default function LanguageToggle({ className = '', showIcon = true }) {
  const { t, toggleLang, lang } = useLang();
  return (
    <button
      type="button"
      className={`lang-toggle ${className}`}
      onClick={toggleLang}
      aria-label={t('lang.switch')}
      title={t('lang.switch')}
      data-lang={lang}
    >
      {showIcon && (
        <span className="lang-toggle-icon" aria-hidden="true">
          <GlobeIcon size={15} />
        </span>
      )}
      <span className="lang-toggle-label">{t('lang.switch')}</span>
    </button>
  );
}
