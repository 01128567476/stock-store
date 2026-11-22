export const STORE = {
  name: 'STOCK STORE',
  tagline: 'Contemporary fashion, considered.',
  currency: 'EGP',
  // Replace with your real WhatsApp number (country code, digits only)
  whatsapp: '201000000000',
  email: 'hello@maisonvera.com',
  phone: '+20 100 000 0000',
  address: 'المنشية، شارع متولي سردينة',
  stores: [
    { key: 'clothing', address: 'المنشية، شارع متولي سردينة' },
    { key: 'shoes', address: 'المنشية، شارع برج الشروق' },
  ],
  freeShippingThreshold: 3000,
  shippingFee: 80,
  social: {
    instagram: 'https://instagram.com/',
    facebook: 'https://facebook.com/',
    tiktok: 'https://tiktok.com/',
    x: 'https://x.com/',
  },
};

export const money = (n) => `${Math.round(n).toLocaleString('en-US')} ${STORE.currency}`;
