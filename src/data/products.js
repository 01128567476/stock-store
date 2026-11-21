const U = (id, w = 900, h = 1125) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

const POOLS = {
  men: [
    'photo-1576566588028-4147f3842f27',
    'photo-1507679799987-c73779587ccf',
    'photo-1594938298603-c8148c4dae35',
    'photo-1591047139829-d91aecb6caea',
    'photo-1542272604-787c3835535d',
    'photo-1618354691373-d851c5c3a990',
    'photo-1556821840-3a63f95609a7',
    'photo-1521572163474-6864f9cf17ab',
  ],
  shoes: [
    'photo-1542291026-7eec264c27ff',
    'photo-1549298916-b41d501d3772',
    'photo-1491553895911-0055eca6402d',
    'photo-1525966222134-fcfa99b8ae77',
    'photo-1600185365483-26d7a4cc7519',
    'photo-1460353581641-37baddab0fa2',
    'photo-1520639888713-7851133b1ed0',
  ],
  accessories: [
    'photo-1584917865442-de89df76afd3',
    'photo-1548036328-c9fa89d128fa',
    'photo-1523170335258-f5ed11844a49',
    'photo-1572635196237-14b3f281503f',
    'photo-1511499767150-a48a237f0083',
    'photo-1553062407-98eeb64c6a62',
  ],
};

export const IMAGES = {
  hero: new URL(`${import.meta.env.BASE_URL}store-hero.png`, document.baseURI).href,
  banner: U('photo-1445205170230-053b83016050', 1600, 900),
  categories: {
    men: U(POOLS.men[2], 700, 900),
    shoes: U(POOLS.shoes[0], 700, 900),
    accessories: U(POOLS.accessories[2], 700, 900),
    pants: U(POOLS.men[4], 700, 900),
    hoodies: U(POOLS.men[6], 700, 900),
    shirts: U(POOLS.men[7], 700, 900),
    jackets: U(POOLS.men[3], 700, 900),
  },
};

export const CATEGORIES = [
  { id: 'men', label: 'Clothing' },
  { id: 'pants', label: 'Pants' },
  { id: 'hoodies', label: 'Hoodies' },
  { id: 'shirts', label: 'Shirts' },
  { id: 'jackets', label: 'Jackets' },
  { id: 'shoes', label: 'Shoes' },
  { id: 'accessories', label: 'Accessories' },
];

export const SEASONS = [
  { id: 'winter', label: 'شتوي' },
  { id: 'summer', label: 'صيفي' },
  { id: 'both', label: 'كليهما' },
];

export const normalizeSeason = (season) => {
  const value = String(season ?? 'both').trim().toLowerCase();
  const aliases = {
    'شتوي': 'winter',
    'الشتوي': 'winter',
    'شتوية': 'winter',
    'الشتوية': 'winter',
    'صيفي': 'summer',
    'الصيفي': 'summer',
    'صيفية': 'summer',
    'الصيفية': 'summer',
    'كليهما': 'both',
    'كلاهما': 'both',
  };
  return aliases[value] || value;
};

const COLOR = {
  Black: '#141414',
  White: '#f6f4ef',
  Beige: '#d9c9ae',
  Navy: '#1d2a44',
  Olive: '#6b6b45',
  Grey: '#8c8c8c',
  Camel: '#b88a56',
  Brown: '#5a3d2b',
  Blue: '#8fb0d6',
  Indigo: '#2f3f63',
  Charcoal: '#3a3a3a',
  Silver: '#c3c6c9',
  Gold: '#c9a24b',
};
const cols = (...names) => names.map((name) => ({ name, hex: COLOR[name] }));

const CLOTH_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];
const SHOE_SIZES = ['40', '41', '42', '43', '44', '45'];
const BELT_SIZES = ['S', 'M', 'L', 'XL'];
const ONE = ['One Size'];

const DETAILS = {
  men: ['Premium fabrics, responsibly sourced', 'Tailored contemporary fit', 'Machine washable at 30°C'],
  shoes: ['Genuine materials, hand finished', 'Cushioned insole for all-day comfort', 'Wipe clean with a soft cloth'],
  accessories: ['Crafted with durable premium materials', 'Timeless, versatile design', 'Comes in a signature gift box'],
};

const counters = { men: 0, shoes: 0, accessories: 0 };
let order = 0;

const make = (name, category, price, salePrice, colors, flags, description, sizes, season = 'both') => {
  const ci = counters[category]++;
  const pool = POOLS[category];
  const idx = order++;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return {
    id: slug,
    name,
    category,
    price,
    salePrice,
    colors,
    sizes: sizes || (category === 'shoes' ? SHOE_SIZES : category === 'accessories' ? ONE : CLOTH_SIZES),
    images: [0, 1, 2].map((k) => U(pool[(ci + k) % pool.length])),
    description,
    details: DETAILS[category],
    season,
    featured: flags.includes('f'),
    isNew: flags.includes('n'),
    bestSeller: flags.includes('b'),
    rating: Math.round((4.3 + ((idx * 3) % 7) / 10) * 10) / 10,
    reviews: 24 + ((idx * 37) % 180),
  };
};

export const PRODUCTS = [
  // Men
  make('Essential Oversized Tee', 'men', 690, null, cols('Black', 'White', 'Beige'), 'nb',
    'Heavyweight 240gsm organic cotton with a relaxed drop-shoulder fit. The everyday piece you will reach for first.'),
  make('Tailored Wool Blazer', 'men', 4200, 3360, cols('Black', 'Navy', 'Charcoal'), 'f',
    'A sharply cut single-breasted blazer in a soft wool blend, fully lined with horn-effect buttons.'),
  make('Slim Fit Chino', 'men', 1450, null, cols('Beige', 'Olive', 'Navy'), 'b',
    'Stretch cotton twill chinos with a clean tapered leg. Smart enough for the office, easy enough for weekends.'),
  make('Merino Crewneck Sweater', 'men', 2100, 1680, cols('Grey', 'Navy', 'Camel'), 'fb',
    'Fine-gauge extra-soft merino wool, naturally temperature regulating and beautifully lightweight.'),
  make('Heritage Denim Jacket', 'men', 2600, null, cols('Indigo', 'Black'), 'n',
    'Rigid selvedge-style denim with a boxy cut that softens and fades with every wear.'),
  make('Classic Oxford Shirt', 'men', 1350, null, cols('White', 'Blue'), 'n',
    'A wardrobe staple in crisp brushed Oxford cotton with a button-down collar and a regular fit.'),
  // Shoes
  make('Minimal Leather Sneakers', 'shoes', 2900, null, cols('White', 'Black'), 'fb',
    'Hand-finished Italian leather sneakers with a clean low profile and a cushioned insole.'),
  make('Chelsea Boots', 'shoes', 3800, 3040, cols('Black', 'Brown'), 'b',
    'Smooth leather Chelsea boots with elastic side panels, pull tab and a durable stacked sole.'),
  make('Suede Loafers', 'shoes', 3100, null, cols('Brown', 'Black', 'Beige'), 'n',
    'Soft suede loafers with a flexible leather sole. Effortless with tailoring or denim.'),
  make('Court Sneakers', 'shoes', 2400, 1920, cols('White', 'Grey'), 'b',
    'Retro-inspired court sneakers with a vulcanised sole and perforated detailing.'),
  make('Trail Runner', 'shoes', 3300, null, cols('Grey', 'Black'), '',
    'Lightweight technical runners with a grippy outsole and breathable engineered mesh upper.'),
  // Accessories
  make('Leather Crossbody Bag', 'accessories', 2700, null, cols('Black', 'Brown', 'Beige'), 'fb',
    'A compact crossbody in pebbled leather with a magnetic flap, inner pocket and adjustable strap.'),
  make('Aviator Sunglasses', 'accessories', 1100, 880, cols('Black', 'Gold'), 'n',
    'Lightweight metal-frame aviators with UV400 polarised lenses and a hard protective case.'),
  make('Minimal Steel Watch', 'accessories', 3900, null, cols('Silver', 'Black'), 'f',
    'Slim 38mm stainless steel watch with sapphire-coated glass, Japanese movement and mesh strap.'),
  make('Wool Scarf', 'accessories', 950, null, cols('Grey', 'Camel', 'Black'), 'b',
    'An oversized scarf woven from soft brushed wool with fringed edges, warm and light.'),
  make('Leather Belt', 'accessories', 850, null, cols('Black', 'Brown'), '',
    'Full-grain leather belt with a brushed metal buckle. Cut to last for years.', BELT_SIZES),
  make('Canvas Tote', 'accessories', 620, 496, cols('Beige', 'Black'), 'n',
    'Heavy organic canvas tote with leather handles, an inner zip pocket and room for a laptop.'),
];

export const getProduct = (id) => PRODUCTS.find((p) => p.id === id);
export const effectivePrice = (p) => (p.salePrice != null ? p.salePrice : p.price);
export const discountPercent = (p) =>
  p.salePrice != null ? Math.round((1 - p.salePrice / p.price) * 100) : 0;
