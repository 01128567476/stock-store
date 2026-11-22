import { useEffect, useState } from 'react';
import { useAdmin } from '../context/AdminContext';

export default function AdBanner() {
  const { shopAds } = useAdmin();
  const activeBanners = shopAds.banners.filter((banner) => banner.active !== false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [activeBanners.length]);

  useEffect(() => {
    if (activeBanners.length < 2) return undefined;
    const timer = setInterval(() => {
      setActiveIndex((index) => (index + 1) % activeBanners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [activeBanners.length]);

  if (!shopAds.enabled) return null;

  const banner = activeBanners[activeIndex % Math.max(activeBanners.length, 1)];

  return (
    <section className="shop-ad-slot" aria-label="Store advertisements" aria-roledescription="carousel">
      {banner && (
        <>
          <img
            key={banner.id}
            src={banner.src}
            alt={banner.name || 'Store advertisement'}
            className="shop-ad-image"
          />
          {banner.headline && (
            <div className="shop-ad-copy" aria-hidden="true">
              <span className="shop-ad-eyebrow">{banner.eyebrow}</span>
              <strong>{banner.headline}</strong>
              <span className="shop-ad-subtext">{banner.subtext}</span>
            </div>
          )}
        </>
      )}
    </section>
  );
}
