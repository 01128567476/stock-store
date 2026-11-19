import { MinusIcon, PlusIcon } from './Icons';

export default function QtySelect({ value, onChange, min = 1, max = 10 }) {
  return (
    <div className="qty">
      <button type="button" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label="Decrease quantity">
        <MinusIcon size={14} />
      </button>
      <span aria-live="polite">{value}</span>
      <button type="button" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label="Increase quantity">
        <PlusIcon size={14} />
      </button>
    </div>
  );
}
