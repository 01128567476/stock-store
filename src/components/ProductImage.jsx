import { useEffect, useRef, useState } from 'react';

export default function ProductImage({ src, alt, className = '', ...rest }) {
  const [state, setState] = useState('loading');
  const ref = useRef(null);

  useEffect(() => {
    setState('loading');
    const img = ref.current;
    if (img && img.complete && img.naturalWidth > 0) setState('loaded');
  }, [src]);

  return (
    <div className={`pimg ${state} ${className}`}>
      {state !== 'error' && (
        <img
          ref={ref}
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setState('loaded')}
          onError={() => setState('error')}
          {...rest}
        />
      )}
      {state === 'error' && <span className="pimg-fallback">{(alt || 'M').charAt(0)}</span>}
    </div>
  );
}
