import { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { CATEGORIES, SEASONS, normalizeSeason } from '../data/products';
import { money } from '../config';
import { CloseIcon, ArrowIcon } from '../components/Icons';

const DEFAULT_SIZES = {
  shoes: ['40', '41', '42', '43', '44', '45'],
  pants: ['S', 'M', 'L', 'XL', 'XXL'],
  hoodies: ['S', 'M', 'L', 'XL', 'XXL'],
  jackets: ['S', 'M', 'L', 'XL', 'XXL'],
  sweaters: ['S', 'M', 'L', 'XL', 'XXL'],
  pullover: ['S', 'M', 'L', 'XL', 'XXL'],
};

export default function AdminProductForm() {
  const { products, addProduct, updateProduct } = useAdmin();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const existing = isEdit ? products.find((p) => p.id === id) : null;
  const imageInput = useRef(null);

  const [form, setForm] = useState({
    name: '', description: '', category: 'pants', price: '', discount: '',
    colors: [{ name: 'Black', hex: '#141414' }],
    sizes: DEFAULT_SIZES.pants,
    images: [],
    active: true,
    season: 'both',
  });

  const [ready, setReady] = useState(!isEdit);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    if (!existing) { setReady(true); return; }
    setForm({
      name: existing.name || '',
      description: existing.description || '',
      category: existing.category || 'men',
      price: String(existing.price ?? ''),
      discount: existing.salePrice != null
        ? String(Math.round(((existing.price - existing.salePrice) / existing.price) * 100))
        : '',
      colors: (existing.colors || []).map((c) => ({ name: c.name, hex: c.hex })),
      sizes: existing.sizes || [],
      images: existing.images || [],
      active: existing.active !== false,
      season: normalizeSeason(existing.season),
    });
    setReady(true);
  }, [isEdit, existing]);

  const finalPrice = useMemo(() => {
    const price = parseFloat(form.price);
    const discount = parseFloat(form.discount) || 0;
    if (!price || price <= 0 || discount < 0 || discount > 100) return null;
    return Math.round(price * (1 - discount / 100) * 100) / 100;
  }, [form.price, form.discount]);

  const onSale = finalPrice != null && finalPrice < parseFloat(form.price || 0);

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.price || parseFloat(form.price) <= 0) e.price = 'Enter a valid original price';
    if (form.discount !== '' && (parseFloat(form.discount) < 0 || parseFloat(form.discount) > 100)) e.discount = 'Discount must be between 0 and 100';
    if (!form.colors.length) e.colors = 'Add at least one color';
    if (!form.sizes.length) e.sizes = 'Select at least one size';
    if (!form.images.length) e.images = 'Add at least one image';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36);
    const payload = {
      id: isEdit ? existing.id : slug,
      name: form.name.trim(),
      description: form.description.trim(),
      category: form.category,
      price: parseFloat(form.price),
      salePrice: onSale ? finalPrice : null,
      colors: form.colors,
      sizes: form.sizes,
      images: form.images,
      active: form.active,
      season: form.season,
    };
    if (isEdit) updateProduct(existing.id, payload);
    else addProduct(payload);
    setSaved(true);
    setLoading(false);
    setTimeout(() => navigate('/admin/products'), 900);
  };

  const addColor = () => setForm((p) => ({ ...p, colors: [...p.colors, { name: 'New Color', hex: '#d9c9ae' }] }));
  const removeColor = (i) => setForm((p) => ({ ...p, colors: p.colors.filter((_, idx) => idx !== i) }));
  const updateColor = (i, field, value) => setForm((p) => ({ ...p, colors: p.colors.map((c, idx) => idx === i ? { ...c, [field]: value } : c) }));
  const toggleSize = (s) => setForm((p) => ({ ...p, sizes: p.sizes.includes(s) ? p.sizes.filter((x) => x !== s) : [...p.sizes, s] }));

  const handleImages = (ev) => {
    const files = Array.from(ev.target.files || []);
    files.forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = () => setForm((p) => ({ ...p, images: [...p.images, String(reader.result)] }));
      reader.readAsDataURL(file);
    });
    ev.target.value = '';
  };

  const moveImage = (i, dir) => {
    setForm((p) => {
      const imgs = [...p.images];
      const j = i + dir;
      if (j < 0 || j >= imgs.length) return p;
      [imgs[i], imgs[j]] = [imgs[j], imgs[i]];
      return { ...p, images: imgs };
    });
  };

  if (!ready) return <div className="admin-loading">Loading product…</div>;
  if (isEdit && !existing) {
    return (
      <div className="admin-page">
        <div className="admin-card admin-empty"><p>Product not found.</p>
          <button className="btn" onClick={() => navigate('/admin/products')}>Back to Products</button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      {saved && <div className="admin-toast admin-toast--success">Product saved! Redirecting…</div>}

      <div className="admin-page-head">
        <div>
          <h2>{isEdit ? 'Edit Product' : 'Add Product'}</h2>
          <p className="muted small">{isEdit ? 'Update product details' : 'Create a new catalog item'}</p>
        </div>
        <button className="btn btn-outline" onClick={() => navigate('/admin/products')}>← Back</button>
      </div>

      <form className="admin-card admin-form" onSubmit={handleSubmit} noValidate>
        <div className="admin-form-grid">
          <div className="admin-field full">
            <label>Product Name *</label>
            <input type="text" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Essential Oversized Tee" />
            {errors.name && <span className="admin-field-error">{errors.name}</span>}
          </div>

          <div className="admin-field full">
            <label>Description *</label>
            <textarea rows={4} value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Describe the product…" />
            {errors.description && <span className="admin-field-error">{errors.description}</span>}
          </div>

          <div className="admin-field">
            <label>Category *</label>
            <select value={form.category} onChange={(e) => {
              const cat = e.target.value;
              setForm((p) => ({ ...p, category: cat, sizes: DEFAULT_SIZES[cat] }));
            }}>
              {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>

          <div className="admin-field">
          <div className="admin-field">
            <label>Season</label>
            <select value={form.season} onChange={(e) => set('season', e.target.value)}>
              {SEASONS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
            <span className="muted small">Choose the season that best fits this product.</span>
          </div>

            <label>Status</label>
            <label className="admin-check">
              <input type="checkbox" checked={form.active} onChange={(e) => set('active', e.target.checked)} />
              Active (visible in store)
            </label>
          </div>

          <div className="admin-field">
            <label>Original Price (EGP) *</label>
            <input type="number" min="1" step="0.01" value={form.price} onChange={(e) => set('price', e.target.value)} placeholder="690" />
            {errors.price && <span className="admin-field-error">{errors.price}</span>}
          </div>

          <div className="admin-field">
            <label>Discount %</label>
            <input type="number" min="0" max="100" step="1" value={form.discount} onChange={(e) => set('discount', e.target.value)} placeholder="0" />
            {errors.discount && <span className="admin-field-error">{errors.discount}</span>}
          </div>

          <div className="admin-field full">
            <div className="admin-price-preview">
              <div>
                <span className="muted small">Final price (auto-calculated)</span>
                <div className="admin-preview-price">{finalPrice != null ? money(finalPrice) : '—'}</div>
              </div>
              {onSale && (
                <div className="admin-preview-details">
                  <s>{money(parseFloat(form.price))}</s>
                  <span className="admin-pill admin-pill-sale">-{form.discount}%</span>
                </div>
              )}
            </div>
          </div>

          <div className="admin-field full">
            <label>Colors</label>
            {errors.colors && <span className="admin-field-error">{errors.colors}</span>}
            <div className="admin-color-list">
              {form.colors.map((c, i) => (
                <div key={i} className="admin-color-row">
                  <span className="admin-color-dot" style={{ background: c.hex }} />
                  <input type="text" value={c.name} onChange={(e) => updateColor(i, 'name', e.target.value)} placeholder="Color name" />
                  <input type="color" value={c.hex} onChange={(e) => updateColor(i, 'hex', e.target.value)} />
                  <button type="button" className="admin-icon-btn" onClick={() => removeColor(i)} aria-label="Remove color"><CloseIcon size={14} /></button>
                </div>
              ))}
            </div>
            <button type="button" className="btn btn-outline btn-sm" onClick={addColor}>+ Add Color</button>
          </div>

          <div className="admin-field full">
            <label>Sizes</label>
            {errors.sizes && <span className="admin-field-error">{errors.sizes}</span>}
            <div className="admin-size-list">
              {Array.from(new Set([...DEFAULT_SIZES[form.category], ...form.sizes])).map((s) => (
                <button key={s} type="button" className={`size-chip ${form.sizes.includes(s) ? 'active' : ''}`} onClick={() => toggleSize(s)}>{s}</button>
              ))}
            </div>
            <div className="admin-custom-size">
              <input type="text" id="customSize" placeholder="Custom size" onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const v = e.target.value.trim();
                  if (v && !form.sizes.includes(v)) set('sizes', [...form.sizes, v]);
                  e.target.value = '';
                }
              }} />
              <span className="muted small">Press Enter to add</span>
            </div>
          </div>

          <div className="admin-field full">
            <label>Images</label>
            {errors.images && <span className="admin-field-error">{errors.images}</span>}
            <div className="admin-image-grid">
              {form.images.map((src, i) => (
                <div key={i} className="admin-image-item">
                  <img src={src} alt={`Image ${i + 1}`} />
                  <div className="admin-image-tools">
                    <button type="button" onClick={() => moveImage(i, -1)} disabled={i === 0} aria-label="Move left"><ArrowIcon size={14} style={{ transform: 'rotate(180deg)' }} /></button>
                    <span>{i + 1}</span>
                    <button type="button" onClick={() => moveImage(i, 1)} disabled={i === form.images.length - 1} aria-label="Move right"><ArrowIcon size={14} /></button>
                    <button type="button" className="danger" onClick={() => set('images', form.images.filter((_, idx) => idx !== i))} aria-label="Remove image"><CloseIcon size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
            <input ref={imageInput} type="file" accept="image/*" multiple onChange={handleImages} style={{ display: 'none' }} />
            <button type="button" className="btn btn-outline btn-sm" onClick={() => imageInput.current?.click()}>+ Add Images</button>
          </div>
        </div>

        <div className="admin-form-actions">
          <button type="button" className="btn btn-outline btn-lg" onClick={() => navigate('/admin/products')}>Cancel</button>
          <button type="submit" className="btn btn-lg" disabled={loading}>
            {loading ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
}