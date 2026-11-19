import { money } from '../config';

export default function Price({ product, large = false }) {
  const onSale = product.salePrice != null;
  return (
    <div className={`price ${large ? 'large' : ''}`}>
      <span className={onSale ? 'now sale' : 'now'}>{money(onSale ? product.salePrice : product.price)}</span>
      {onSale && <s className="was">{money(product.price)}</s>}
    </div>
  );
}
