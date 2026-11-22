import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CATEGORIES, IMAGES, PRODUCTS, TEST_PRODUCTS, normalizeSeason } from '../data/products';

const ADMIN_KEY = 'mv_admin';
const PRODUCTS_KEY = 'mv_products_admin';
const CATEGORIES_KEY = 'mv_categories_admin';
const SWEATER_MIGRATION_KEY = 'mv_sweater_seeded_v4';
const TEST_PRODUCTS_MIGRATION_KEY = 'mv_test_products_seed_v1';
const SEASON_VISIBILITY_KEY = 'mv_hidden_seasons';
const SHOP_ADS_KEY = 'mv_shop_ads';
const SHOP_AD_SEED_KEY = 'mv_shop_ads_seeded_v1';
const SHOP_AD_PHOTO_MIGRATION_KEY = 'mv_shop_ads_photo_v1';
const SHOP_AD_PROMO_MIGRATION_KEY = 'mv_shop_ads_promo_v1';

const DEFAULT_AD_BANNERS = [
  {
    id: 'default-new-season',
    name: "Men's Style — Up to 50% Off",
    src: `${import.meta.env.BASE_URL}ads/new-season.jpg`,
    active: true,
    eyebrow: 'THE MENSWEAR SALE',
    headline: 'UP TO 50% OFF',
    subtext: 'Fresh looks. Better prices.',
  },
  {
    id: 'default-selected-styles',
    name: "Men's Store — Extra 20% Off",
    src: `${import.meta.env.BASE_URL}ads/selected-styles.jpg`,
    active: true,
    eyebrow: 'SELECTED MENSWEAR',
    headline: 'EXTRA 20% OFF',
    subtext: 'Find your next everyday favorite.',
  },
  {
    id: 'default-knitwear-edit',
    name: "Men's Essentials — Sale",
    src: `${import.meta.env.BASE_URL}ads/knitwear-edit.jpg`,
    active: true,
    eyebrow: 'THE NEW MENSWEAR EDIT',
    headline: 'GOOD STYLE. BETTER PRICES.',
    subtext: 'Shop the latest men’s essentials.',
  },
];

const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123',
};

const initialProducts = JSON.parse(JSON.stringify(PRODUCTS));

const loadCategories = () => {
  try {
    const saved = localStorage.getItem(CATEGORIES_KEY);
    if (!saved) return CATEGORIES;
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) {
      throw new Error('Stored categories must be a list.');
    }
    const categories = parsed.filter((category) =>
      category &&
      typeof category.id === 'string' &&
      typeof category.label === 'string' &&
      typeof category.labelAr === 'string'
    ).map((category) => ({
      ...category,
      image: typeof category.image === 'string' && category.image
        ? category.image
        : IMAGES.categories[category.id] || IMAGES.banner,
    }));
    if (!categories.length) throw new Error('Stored categories cannot be empty.');
    return categories;
  } catch (error) {
    console.error('Unable to load categories.', error);
    return CATEGORIES;
  }
};

const loadShopAds = () => {
  try {
    const saved = localStorage.getItem(SHOP_ADS_KEY);
    if (!saved) {
      localStorage.setItem(SHOP_AD_SEED_KEY, '1');
      return { enabled: true, banners: DEFAULT_AD_BANNERS };
    }
    const parsed = JSON.parse(saved);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed) || !Array.isArray(parsed.banners)) {
      throw new Error('Stored shop advertisements must contain a banner list.');
    }
    const ads = {
      enabled: parsed.enabled !== false,
      banners: parsed.banners.filter((banner) =>
        banner && typeof banner.id === 'string' && typeof banner.src === 'string'
      ),
    };
    if (
      localStorage.getItem(SHOP_AD_PHOTO_MIGRATION_KEY) !== '1' ||
      localStorage.getItem(SHOP_AD_PROMO_MIGRATION_KEY) !== '1'
    ) {
      const defaultBanners = new Map(DEFAULT_AD_BANNERS.map((banner) => [banner.id, banner]));
      ads.banners = ads.banners.map((banner) => {
        const replacement = defaultBanners.get(banner.id);
        return replacement
          ? { ...banner, ...replacement, active: banner.active }
          : banner;
      });
      localStorage.setItem(SHOP_ADS_KEY, JSON.stringify(ads));
      localStorage.setItem(SHOP_AD_PHOTO_MIGRATION_KEY, '1');
      localStorage.setItem(SHOP_AD_PROMO_MIGRATION_KEY, '1');
    }
    if (!ads.banners.length && localStorage.getItem(SHOP_AD_SEED_KEY) !== '1') {
      ads.banners = DEFAULT_AD_BANNERS;
      localStorage.setItem(SHOP_ADS_KEY, JSON.stringify(ads));
    }
    localStorage.setItem(SHOP_AD_SEED_KEY, '1');
    return ads;
  } catch (error) {
    console.error('Unable to load shop advertisements.', error);
    return { enabled: true, banners: [] };
  }
};

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    try {
      return sessionStorage.getItem(ADMIN_KEY) === '1';
    } catch { return false; }
  });

  const [categories, setCategories] = useState(loadCategories);
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem(PRODUCTS_KEY);
      if (!saved) {
        localStorage.setItem(SWEATER_MIGRATION_KEY, '1');
        localStorage.setItem(TEST_PRODUCTS_MIGRATION_KEY, '1');
        return initialProducts;
      }
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return initialProducts;
      const currentProducts = parsed.filter((product) =>
        categories.some((category) => category.id === product.category)
      );
      if (localStorage.getItem(SWEATER_MIGRATION_KEY) !== '1') {
        const starterSweater = initialProducts.find((product) => product.category === 'sweaters');
        if (starterSweater) {
          if (!currentProducts.some((product) => product.id === starterSweater.id)) {
            currentProducts.push(starterSweater);
          }
          localStorage.setItem(SWEATER_MIGRATION_KEY, '1');
        }
      }
      if (localStorage.getItem(TEST_PRODUCTS_MIGRATION_KEY) !== '1') {
        const existingIds = new Set(currentProducts.map((product) => product.id));
        currentProducts.push(...TEST_PRODUCTS.filter((product) => !existingIds.has(product.id)));
        localStorage.setItem(TEST_PRODUCTS_MIGRATION_KEY, '1');
      }
      return currentProducts;
    } catch { return initialProducts; }
  });

  const [shopAds, setShopAds] = useState(loadShopAds);
  const [status, setStatus] = useState(null); // 'loading' | 'success' | 'error'
  const [statusMsg, setStatusMsg] = useState('');

  const saveCategories = useCallback((nextCategories, message) => {
    try {
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(nextCategories));
    } catch (error) {
      console.error('Unable to save categories.', error);
      setStatus('error');
      setStatusMsg('admin.toastCategorySaveFailed');
      return false;
    }
    setCategories(nextCategories);
    setStatus('success');
    setStatusMsg(message);
    return true;
  }, []);

  const addCategory = useCallback((category) => {
    if (
      !category ||
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(category.id) ||
      !category.label?.trim() ||
      !category.labelAr?.trim() ||
      categories.some((item) => item.id === category.id)
    ) {
      setStatus('error');
      setStatusMsg('admin.toastCategoryInvalid');
      return false;
    }
    return saveCategories([...categories, {
      ...category,
      label: category.label.trim(),
      labelAr: category.labelAr.trim(),
      image: category.image || IMAGES.banner,
    }], 'admin.toastCategoryAdded');
  }, [categories, saveCategories]);

  const updateCategory = useCallback((id, updates) => {
    if (!categories.some((category) => category.id === id)) return false;
    if (!updates.label?.trim() || !updates.labelAr?.trim()) {
      setStatus('error');
      setStatusMsg('admin.toastCategoryNamesRequired');
      return false;
    }
    return saveCategories(categories.map((category) => (
      category.id === id
        ? { ...category, label: updates.label.trim(), labelAr: updates.labelAr.trim(), image: updates.image || category.image }
        : category
    )), 'admin.toastCategoryUpdated');
  }, [categories, saveCategories]);

  const deleteCategory = useCallback((id) => {
    if (products.some((product) => product.category === id)) {
      setStatus('error');
      setStatusMsg('admin.toastCategoryHasProducts');
      return false;
    }
    if (categories.length <= 1) {
      setStatus('error');
      setStatusMsg('admin.toastCategoryKeepOne');
      return false;
    }
    return saveCategories(categories.filter((category) => category.id !== id), 'admin.toastCategoryDeleted');
  }, [categories, products, saveCategories]);

  useEffect(() => {
    try { localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products)); } catch {}
  }, [products]);

  const login = useCallback((username, password) => {
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      setIsLoggedIn(true);
      try { sessionStorage.setItem(ADMIN_KEY, '1'); } catch {}
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    try { sessionStorage.removeItem(ADMIN_KEY); } catch {}
  }, []);

  const addProduct = useCallback((product) => {
    setProducts((prev) => [product, ...prev]);
    setStatus('success');
    setStatusMsg('admin.toastProductCreated');
  }, []);

  const updateProduct = useCallback((id, updated) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updated } : p)));
    setStatus('success');
    setStatusMsg('admin.toastProductSaved');
  }, []);

  const deleteProduct = useCallback((id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setStatus('success');
    setStatusMsg('admin.toastProductDeleted');
  }, []);

  const toggleProductActive = useCallback((id) => {
    setProducts((prev) => prev.map((p) =>
      p.id === id ? { ...p, active: p.active === false ? true : false } : p
    ));
    setStatus('success');
    setStatusMsg('admin.toastProductStatusUpdated');
  }, []);

  const saveShopAds = useCallback((nextAds, message) => {
    try {
      localStorage.setItem(SHOP_ADS_KEY, JSON.stringify(nextAds));
    } catch (error) {
      console.error('Unable to save shop advertisements.', error);
      setStatus('error');
      setStatusMsg('admin.toastAdsSaveFailed');
      return false;
    }
    setShopAds(nextAds);
    setStatus('success');
    setStatusMsg(message);
    return true;
  }, []);

  const addAdBanners = useCallback((banners) => {
    saveShopAds({ ...shopAds, banners: [...shopAds.banners, ...banners] }, 'admin.toastAdImagesAdded');
  }, [saveShopAds, shopAds]);

  const toggleShopAds = useCallback(() => {
    const enabled = !shopAds.enabled;
    saveShopAds({ ...shopAds, enabled }, enabled ? 'admin.toastAdAreaShown' : 'admin.toastAdAreaHidden');
  }, [saveShopAds, shopAds]);

  const toggleAdBanner = useCallback((id) => {
    const banners = shopAds.banners.map((banner) =>
      banner.id === id ? { ...banner, active: banner.active === false } : banner
    );
    saveShopAds({ ...shopAds, banners }, 'admin.toastAdVisibilityUpdated');
  }, [saveShopAds, shopAds]);

  const deleteAdBanner = useCallback((id) => {
    const banners = shopAds.banners.filter((banner) => banner.id !== id);
    saveShopAds({ ...shopAds, banners }, 'admin.toastAdDeleted');
  }, [saveShopAds, shopAds]);

  const moveAdBanner = useCallback((id, direction) => {
    const index = shopAds.banners.findIndex((banner) => banner.id === id);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= shopAds.banners.length) return;
    const banners = [...shopAds.banners];
    [banners[index], banners[target]] = [banners[target], banners[index]];
    saveShopAds({ ...shopAds, banners }, 'admin.toastAdOrderUpdated');
  }, [saveShopAds, shopAds]);

  const [hiddenSeasons, setHiddenSeasons] = useState(() => {
    try {
      const saved = localStorage.getItem(SEASON_VISIBILITY_KEY);
      if (!saved) return {};
      const parsed = JSON.parse(saved);
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        throw new Error('Stored seasonal visibility settings must be an object.');
      }
      return {
        winter: parsed.winter === true,
        summer: parsed.summer === true,
      };
    } catch (error) {
      console.error('Unable to load seasonal visibility settings.', error);
      return {};
    }
  });

  const toggleSeasonVisibility = useCallback((season) => {
    const hidden = !hiddenSeasons[season];
    const next = { ...hiddenSeasons, [season]: hidden };
    try {
      localStorage.setItem(SEASON_VISIBILITY_KEY, JSON.stringify(next));
    } catch (error) {
      console.error('Unable to save seasonal visibility settings.', error);
      setStatus('error');
      setStatusMsg('admin.toastSeasonSaveFailed');
      return;
    }
    setHiddenSeasons(next);
    setStatus('success');
    setStatusMsg(hidden
      ? `admin.toast${season === 'winter' ? 'Winter' : 'Summer'}Hidden`
      : `admin.toast${season === 'winter' ? 'Winter' : 'Summer'}Visible`);
  }, [hiddenSeasons]);

  const isSeasonHidden = useCallback(
    (season) => !!hiddenSeasons[normalizeSeason(season)],
    [hiddenSeasons]
  );

  const clearStatus = useCallback(() => {
    setStatus(null);
    setStatusMsg('');
  }, []);

  const value = {
    isLoggedIn,
    login,
    logout,
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    products,
    shopAds,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductActive,
    addAdBanners,
    toggleShopAds,
    toggleAdBanner,
    deleteAdBanner,
    moveAdBanner,
    toggleSeasonVisibility,
    isSeasonHidden,
    hiddenSeasons,
    status,
    statusMsg,
    clearStatus,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
};