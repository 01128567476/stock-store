import { StarIcon } from './Icons';

export default function Stars({ value, count }) {
  return (
    <span className="stars" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= Math.round(value) ? 'on' : ''}>
          <StarIcon size={14} />
        </span>
      ))}
      {count != null && <small>({count})</small>}
    </span>
  );
}
