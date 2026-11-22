import { useEffect, useRef, useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { ArrowIcon, EyeIcon, EyeOffIcon, ImageIcon, PlusIcon, TrashIcon } from '../components/Icons';

export default function AdminAds() {
  const {
    shopAds,
    addAdBanners,
    toggleShopAds,
    toggleAdBanner,
    deleteAdBanner,
    moveAdBanner,
    status,
    statusMsg,
    clearStatus,
  } = useAdmin();
  const inputRef = useRef(null);
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    if (!status) return undefined;
    const timer = setTimeout(clearStatus, 4000);
    return () => clearTimeout(timer);
  }, [status, clearStatus]);

  const handleFiles = async (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = '';
    setUploadError('');
    if (!files.length) return;

    const validFiles = files.filter((file) => file.type.startsWith('image/'));
    if (validFiles.length !== files.length) {
      setUploadError('Only image files can be uploaded.');
    }
    if (!validFiles.length) return;

    try {
      const banners = await Promise.all(validFiles.map((file, index) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result !== 'string') {
            reject(new Error(`Unable to read ${file.name}.`));
            return;
          }
          resolve({
            id: `ad-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 8)}`,
            name: file.name,
            src: reader.result,
            active: true,
          });
        };
        reader.onerror = () => reject(new Error(`Unable to read ${file.name}.`));
        reader.readAsDataURL(file);
      })));
      addAdBanners(banners);
    } catch (error) {
      console.error('Unable to read advertisement images.', error);
      setUploadError('Could not read the selected images. Please try again.');
    }
  };

  const activeCount = shopAds.banners.filter((banner) => banner.active !== false).length;

  return (
    <div className="admin-page">
      {status && statusMsg && (
        <div className={`admin-toast admin-toast--${status}`} onClick={clearStatus}>
          <span className="admin-toast-icon">{status === 'error' ? '!' : '✓'}</span>
          <span className="admin-toast-msg">{statusMsg}</span>
        </div>
      )}

      <div className="admin-page-head">
        <div>
          <h2>Advertisements</h2>
          <p className="admin-page-sub">Manage the full-width banner on the shop page.</p>
        </div>
        <button type="button" className="btn btn-lg admin-btn-accent" onClick={() => inputRef.current?.click()}>
          <PlusIcon size={17} />
          <span>Add images</span>
        </button>
        <input ref={inputRef} type="file" accept="image/*" multiple onChange={handleFiles} hidden />
      </div>

      <section className="admin-card admin-ad-settings">
        <div>
          <h3>Shop page ad space</h3>
          <p>Full screen width · 160px high · Slides change every 5 seconds.</p>
          <span className={`admin-ad-state ${shopAds.enabled ? 'is-visible' : 'is-hidden'}`}>
            {shopAds.enabled ? 'Ad space enabled' : 'Ad space hidden'}
          </span>
        </div>
        <button type="button" className="btn btn-outline" onClick={toggleShopAds}>
          {shopAds.enabled ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
          {shopAds.enabled ? 'Hide ad space' : 'Show ad space'}
        </button>
      </section>

      {uploadError && <p className="admin-field-error" role="alert">{uploadError}</p>}

      <section className="admin-card">
        <div className="admin-section-head admin-ad-list-head">
          <div>
            <h2>Ad images</h2>
            <p className="admin-subtitle">{activeCount} of {shopAds.banners.length} images active in the slider</p>
          </div>
          {shopAds.banners.length > 1 && <span className="admin-ad-hint">Use arrows to set slide order</span>}
        </div>

        {shopAds.banners.length ? (
          <div className="admin-ad-list">
            {shopAds.banners.map((banner, index) => {
              const active = banner.active !== false;
              return (
                <article key={banner.id} className={`admin-ad-item ${active ? '' : 'is-inactive'}`}>
                  <img src={banner.src} alt={banner.name || 'Advertisement preview'} />
                  <div className="admin-ad-item-info">
                    <strong>{banner.name || `Advertisement ${index + 1}`}</strong>
                    <span>{active ? 'Included in slider' : 'Hidden from slider'}</span>
                  </div>
                  <div className="admin-ad-item-actions">
                    <button type="button" className="admin-icon-btn" onClick={() => moveAdBanner(banner.id, -1)} disabled={index === 0} aria-label={`Move ${banner.name || 'advertisement'} up`}>
                      <ArrowIcon size={16} style={{ transform: 'rotate(-90deg)' }} />
                    </button>
                    <button type="button" className="admin-icon-btn" onClick={() => moveAdBanner(banner.id, 1)} disabled={index === shopAds.banners.length - 1} aria-label={`Move ${banner.name || 'advertisement'} down`}>
                      <ArrowIcon size={16} style={{ transform: 'rotate(90deg)' }} />
                    </button>
                    <button type="button" className="admin-icon-btn" onClick={() => toggleAdBanner(banner.id)} aria-label={`${active ? 'Hide' : 'Show'} ${banner.name || 'advertisement'}`}>
                      {active ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                    </button>
                    <button type="button" className="admin-icon-btn danger" onClick={() => deleteAdBanner(banner.id)} aria-label={`Delete ${banner.name || 'advertisement'}`}>
                      <TrashIcon size={16} />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="admin-empty-state">
            <span className="admin-empty-icon"><ImageIcon size={24} /></span>
            <h3>No ad images yet</h3>
            <p className="muted">Add one or more images to start the shop page slider.</p>
            <button type="button" className="btn admin-btn-accent" onClick={() => inputRef.current?.click()}>
              <PlusIcon size={16} /> Add images
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
