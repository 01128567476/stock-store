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
  freeShippingThreshold: 2500,
  shippingFee: 120,
  social: {
    instagram: 'https://www.instagram.com/stockstore6?cnvx=MWcycnUyNTBzZDM5dg==',
    facebook: 'https://www.facebook.com/share/19nwErp11m/',
    tiktok: 'https://www.tiktok.com/@stockstore33?_r=1&_t=ZS-9BcqyqkT4Z4',
  },
};

export const money = (n) => `${Math.round(n).toLocaleString('en-US')} ${STORE.currency}`;
