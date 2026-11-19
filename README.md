# MAISON VERA — Premium Clothing Store

A complete e-commerce front end built with React 18, React Router 6 and Vite. Plain modern CSS (variables, grid, no framework).

## Run locally

Requires Node.js 18+.

```bash
cd maison-vera
npm install
npm run dev        # http://localhost:5173
```

Production build: `npm run build` then `npm run preview`.

## Configure

Edit `src/config.js`: store name, currency, **WhatsApp number**, contact details, shipping fee / free-shipping threshold, social links.
Edit `src/data/products.js` to change products, prices, colors, sizes and images.

## Features

- Home: hero ("WEAR YOUR STYLE"), categories, featured, new arrivals, offers, best sellers, sale, reviews, newsletter
- Shop: search, category filter, price min/max, sale-only, sorting (filters live in the URL, so links are shareable)
- Product page: gallery, color / size / quantity, Add to Cart, Buy Now, wishlist, related products
- Cart: add / remove / quantity, auto totals, free-shipping logic, persisted in localStorage
- Checkout: validated form, Cash on Delivery, order summary, confirmation page (orders saved in localStorage `mv-orders`)
- Wishlist, dark / light mode, WhatsApp button, newsletter, discount badges, splash + route loaders, page transitions
- SEO: per-page titles and descriptions, Open Graph tags, JSON-LD, robots.txt, lazy-loaded routes and images

## Notes

- There is no backend: orders and newsletter emails are stored in the browser's localStorage. To receive real orders, send the `order` object in `src/pages/Checkout.jsx` to your API (or an email / Google Sheets webhook).
- Product photos are hot-linked from Unsplash. Any image that fails to load shows an elegant placeholder. Replace with your own photos for production.
- SEO note: this is a client-rendered SPA. For full search-engine indexing of product pages, add prerendering or move to Next.js later.
