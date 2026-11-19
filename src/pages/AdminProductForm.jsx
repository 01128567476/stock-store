import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { CATEGORIES, getProduct } from '../data/products';
import { money } from '../config';
import { CloseIcon } from '../components/Icons';

const DEFAULT_SIZES = {
  men: ['S', 'M', 'L', 'XL', 'XXL'],
  shoes: ['40', '41', '42', '43', '44', '45'],
  accessories: ['One Size'],
};

export default function AdminProductForm() {
  const { addProduct, updateProduct } = useAdmin();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const existing = isEdit ? getProduct(id) : null;

  const [form, setForm] = useState({
    name: existing?.name || '',
    description: existing?.description || '',
    category: existing?.category || 'men',
    price: existing?.price ?? '',
    discount: existing?.salePrice != null
      ? Math.round(((existing.price - existing.salePrice) / existing.price) * 100)
      : '',
    colors: existing?.colors?.map((c) => ({ name: c.name, hex: c.hex })) || [
      { name: 'Black', hex: '#141414' },
    ],
    sizes: existing?.sizes || DEFAULT_SIZES.men,
    images: existing?.images || [],
  });

  const [loading, setLoading] = useState(false);

  const salePrice = useCallback(() => {
    const p = parseFloat(form.price);
    const d = parseFloat(form.discount) || 0;
    if (!p || d < 0 || d > 100) return null;
    return Math.round(p * (1 - d / 100) * 100) / 100;
  }, [form.price, form.discount]);

  const sp = salePrice();
  const onSale = sp != null && sp < parseFloat(form.price || 0);

  useEffect(() => {
    if (existing) {
      setForm((prev) => ({
        ...prev,
        name: existing.name,
        description: existing.description,
        category: existing.category,
        price: String(existing.price),
        discount: existing.salePrice != null
          ? Math.round(((existing.price - existing.salePrice) / existing.price) * 100)
          : '',
        colors: existing.colors.map((c) => ({ name: c.name, hex: c.hex })),
        sizes: existing.sizes,
        images: existing.images,
      }));
    }
  }, [existing]);

  const handleChange = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const addColor = () => {
    setForm((prev) => ({
      ...prev,
      colors: [...prev.colors, { name: 'New Color', hex: '#d9c9ae' }],
    }));
  };

  const removeColor = (index) => {
    if (form.colors.length <= 1) return;
    setForm((prev) => {
      const colors = [...prev.colors];
      colors.splice(index, 1);
      return { ...prev, colors };
    });
  };

  const updateColor = (index, field, value) => {
    setForm((prev) => {
      const colors = [...prev.colors];
      colors[index] = { ...colors[index], [field]: value };
      return { ...prev, colors };
    });
  };

  const toggleSize = (size) => {
    setForm((prev) => {
      const sizes = [...prev.sizes];
      const idx = sizes.indexOf(size);
      if (idx >= 0) sizes.splice(idx, 1);
      else sizes.push(size);
      return { ...prev, sizes };
    });
  };

  const addImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setForm((prev) => ({
        ...prev,
        images: [...prev.images, ev.target.result],
      }));
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const removeImage = (index) => {
    setForm((prev) => {
      const images = [...prev.images];
      images.splice(index, 1);
      return { ...prev, images };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      alert('Product name is required.');
      return;
    }
    const p = parseFloat(form.price);
    if (!p || p <= 0) {
      alert('A valid price is required.');
      return;
    }
    const d = parseFloat(form.discount) || 0;
    const salePrice = d > 0 && d <= 100 ? Math.round(p * (1 - d / 100) * 100) / 100 : null;
    if (d < 0 || d > 100) {
      alert('Discount must be between 0 and 100.');
      return;
    }
    if (form.images.length === 0) {
      alert('At least one image is required.');
      return;
    }

    setLoading(true);
    const product = {
      id: isEdit
        ? form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        : Date.now().toString(),
      name: form.name.trim(),
      category: form.category,
      price: p,
      salePrice,
      colors: form.colors,
      sizes: form.sizes,
      images: form.images,
      description: form.description.trim(),
      details: ['Premium quality', 'Designed for comfort', 'Made to last'],
      featured: false,
      isNew: false,
      bestSeller: false,
      rating: 5,
      reviews: 0,
    };

    if (isEdit) {
      updateProduct(product.id, product);
    } else {
      addProduct(product);
    }
    setLoading(false);
    navigate('/admin/products');
  };

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <a href="/admin/products" className="btn btn-outline btn-sm" style={{ marginRight: '0.5rem' }}>
          ← Back
        </a>
        <h2>{isEdit ? 'Edit Product' : 'Add Product'}</h2>
      </div>

      <div className="admin-card">
        <form onSubmit={handleSubmit} noValidate>
          <div className="admin-form-grid">
            <div className="admin-field full">
              <label>Product Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g. Minimal Leather Sneakers"
                required
              />
            </div>

            <div className="admin-field">
              <label>Category</label>
              <select
                value={form.category}
                onChange={(e) => handleChange('category', e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="admin-field">
              <label>Original Price (EGP)</label>
              <div className="price-input">
                <span>EGP</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => handleChange('price', e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div className="admin-field">
              <label>Discount %</label>
              <div className="price-input">
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  value={form.discount}
                  onChange={(e) => handleChange('discount', e.target.value)}
                  placeholder="0"
                />
                <span>%</span>
              </div>
              {onSale && (
                <div className="admin-discount-preview">
                  <span className="was">{money(parseFloat(form.price))}</span>
                  <span className="now sale">{money(sp)}</span>
                  <span className="badge badge-sale">-{Math.round(((parseFloat(form.price) - sp) / parseFloat(form.price)) * 100)}%</span>
                </div>
              )}
            </div>

            <div className="admin-field full">
              <label>Description</label>
              <textarea
                value={form.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={4}
                placeholder="Describe the product…"
              />
            </div>

            <div className="admin-field full">
              <label>Colors</label>
              <div className="color-list">
                {form.colors.map((c, i) => (
                  <div key={i} className="color-item">
                    <div className="color-swatch" style={{ backgroundColor: c.hex }} />
                    <input
                      type="text"
                      value={c.name}
                      onChange={(e) => updateColor(i, 'name', e.target.value)}
                      placeholder="Color name"
                    />
                    <input
                      type="color"
                      value={c.hex}
                      onChange={(e) => updateColor(i, 'hex', e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn btn-sm admin-icon-btn"
                      onClick={() => removeColor(i)}
                      aria-label="Remove color"
                    >
                      <CloseIcon size={14} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={addColor}
                >
                  + Add Color
                </button>
              </div>
            </div>

            <div className="admin-field full">
              <label>Sizes</label>
              <div className="size-list">
                {DEFAULT_SIZES[form.category].map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`size-chip ${form.sizes.includes(s) ? 'active' : ''}`}
                    onClick={() => toggleSize(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="admin-field full">
              <label>Product Images</label>
              <div className="image-list">
                {form.images.map((src, i) => (
                  <div key={i} className="image-item">
                    <img src={src} alt={`Image ${i + 1}`} className="admin-form-img" />
                    <button
                      type="button"
                      className="btn btn-sm admin-icon-btn admin-icon-btn-danger"
                      onClick={() => removeImage(i)}
                      aria-label="Remove image"
                    >
                      <CloseIcon size={14} />
                    </button>
                  </div>
                ))}
                <input
                  type="file"
                  accept="image/*"
                  onChange={addImage}
                  className="admin-file-input"
                />
                <button type="button" className="btn btn-outline btn-sm" onClick={() => document.querySelector('.admin-file-input')?.click()}>
                  + Add Image
                </button>
              </div>
              <p className="muted small">Upload multiple images. First image is the cover.</p>
            </div>
          </div>

          <div className="admin-form-actions">
            <button
              type="button"
              className="btn btn-outline btn-lg"
              onClick={() => navigate('/admin/products')}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-lg btn-full" disabled={loading}>
              {loading ? 'Saving…' : isEdit ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}