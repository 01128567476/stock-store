import { lazy, Suspense, useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import { PageLoader, SplashLoader } from './components/Loaders';

const Home = lazy(() => import('./pages/Home'));
const Shop = lazy(() => import('./pages/Shop'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const NotFound = lazy(() => import('./pages/NotFound'));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

const alreadyBooted = () => {
  try {
    return sessionStorage.getItem('mv-booted') === '1';
  } catch {
    return false;
  }
};

export default function App() {
  const location = useLocation();
  const [booting, setBooting] = useState(() => !alreadyBooted());

  useEffect(() => {
    if (!booting) return undefined;
    const t = setTimeout(() => {
      try {
        sessionStorage.setItem('mv-booted', '1');
      } catch {
        /* ignore */
      }
      setBooting(false);
    }, 1200);
    return () => clearTimeout(t);
  }, [booting]);

  return (
    <>
      {booting && <SplashLoader />}
      <ScrollToTop />
      <Navbar />
      <main>
        <Suspense fallback={<PageLoader />}>
          <div key={location.pathname} className="page">
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order/:id" element={<OrderSuccess />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Suspense>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
