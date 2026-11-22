import { money } from '../config';
import { useLang } from '../context/LangContext';

export default function Price({ product, large = false }) {
  const { t } = useLang();
  const onSale = product.salePrice != null;
  const savedAmount = onSale ? Math.round(product.price - product.salePrice) : 0;
  return (
    <div className={`price ${large ? 'large' : ''}`}>
      <div className="price-main">
        <span className={onSale ? 'now sale' : 'now'}>{money(onSale ? product.salePrice : product.price)}</span>
        {onSale && (
          <span className="price-saving">
            {t('product.saveAmount', { amount: savedAmount.toLocaleString('en-US') })}
          </span>
        )}
      </div>
      {onSale && <div className="was"><s>{money(product.price)}</s></div>}
    </div>
  );
}
