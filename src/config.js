export const STORE = {
  name: 'STOCK STORE',
  tagline: 'Contemporary fashion, considered.',
  currency: 'EGP',
  whatsapp: '201289661122',
  email: 'mohamedalrosasy7@gmail.com',
  phone: '01289661122',
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
