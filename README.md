# smokedope2016 Merch

Dark, lo-fi streetwear merch store. React 18 + Vite + Tailwind 3, Stripe Checkout, no database.

## 1. Run it locally (2 minutes)

```bash
npm install
npm run dev          # http://localhost:5173
```

Requires Node 20 or newer. The shop, cart, drop countdown and all pages work immediately with placeholder data.
Checkout needs steps 3 and 4 below.

## 2. Make it yours (all content lives in 3 files)

| File | What you change |
| --- | --- |
| `src/data/products.json` | Products, prices (in **cents**), sizes, stock, photos, drop locks |
| `src/data/site.config.js` | Brand name, next drop countdown, socials, bio, FAQ, lookbook, policies, "Unofficial fan merch" switch |
| `src/data/commerce.json` | Discount codes, shipping rates, allowed countries. Shared with the checkout server |

Things to know:

- **Stock badges:** `stock: 0` shows SOLD OUT, `1` to `5` shows "Only N left".
- **Drop mode:** add `"dropAt": "2026-11-13T17:00:00Z"` to any product. It is locked (no add to cart, countdown shown) until that moment, on the site **and** on the checkout server. Change `NEXT_DROP.at` in `site.config.js` for the hero countdown.
- **Accent color:** one line in `src/index.css` (`--accent`). Toxic green is default. Hot red is `255 45 45`, chrome silver is `200 205 210`.
- **Official store?** Set `unofficial: false` in `site.config.js` to remove the footer notice.
- **Real photos:** export WebP (about 1200px wide, under 150 KB), put them in `public/img/`, list them in `products.json`, for example `"images": ["/img/hoodie-front.webp", "/img/hoodie-back.webp", "/img/hoodie-detail.webp"]`. Same for the lookbook in `site.config.js`. Until then, original generated placeholders are shown. No logos, covers or photos of the artist are included.
- **Policy pages** contain template text only. Have them reviewed before launch.

## 3. Stripe

1. Create a Stripe account, then copy your **test** secret key (`sk_test_...`) from the Stripe dashboard under Developers, API keys.
2. Copy `.env.example` to `.env` for local reference. Real keys go in your host's environment settings, never in git.
3. In Vercel: Project, Settings, Environment Variables. Add:
   - `STRIPE_SECRET_KEY` = your key
   - `SITE_URL` = `https://your-domain.com`
4. Test with card `4242 4242 4242 4242`, any future date, any CVC. Switch to the live key when ready.

How it works: the browser sends only product ids, sizes and quantities to `/api/create-checkout-session`. The server looks up prices, stock, drop locks, shipping and discount codes itself, creates a Stripe Checkout session and returns its URL. Customers cannot change prices from the browser. Stripe collects email, shipping address and payment (guest checkout).

Local test of the checkout function: `npm i -g vercel`, then `vercel dev` instead of `npm run dev`.

## 4. Deploy (Vercel, easiest)

```bash
npm i -g vercel
vercel          # first deploy, answer the prompts
vercel --prod
```

`vercel.json` already routes every page to `index.html` and keeps `/api/*` working.

**Netlify / Cloudflare:** the frontend deploys as is (add a rewrite `/* /index.html 200`). Move `api/create-checkout-session.js` into that host's functions folder and adapt the handler signature.

## 5. Forms (newsletter, SMS, contact)

Until you set an endpoint, forms run in demo mode and send nothing. In `.env` (and your host settings):

```
VITE_SIGNUP_ENDPOINT=https://...   # receives { channel: 'email'|'sms', contact, source }
VITE_CONTACT_ENDPOINT=https://...  # receives { name, email, message }
```

Formspree, Basin or a Klaviyo/Mailchimp serverless proxy all work. SMS marketing needs a provider and the consent checkbox that is already included.

## 6. SEO and link previews

- Every page sets its own title, meta description, canonical, Open Graph and Twitter tags. Product pages also output Product structured data (price, availability).
- Replace `YOUR-DOMAIN.com` in `index.html`, then run `SITE_URL=https://your-domain.com npm run sitemap` to regenerate `public/sitemap.xml` and `public/robots.txt`. Submit the sitemap in Google Search Console.
- Replace `public/og.png` (1200 x 630) with your own artwork.
- **Important for Instagram/TikTok/iMessage previews:** this is a client-side app. Google renders it fine, but many social crawlers do not run JavaScript and will show the default tags from `index.html` for every link. If per-product link previews matter, prerender the pages (for example with `vite-plugin-prerender`) or move to Next.js. The data files and components carry over.

## 7. Performance and accessibility notes

- Routes are code-split. Placeholder art is inline SVG (no image requests). Real images use `loading="lazy"` and `decoding="async"`, with the first row eager.
- Pinch zoom is not blocked. Keyboard navigation, visible focus, skip link, labelled forms, `aria-live` status messages, a focus-trapped cart dialog, and `prefers-reduced-motion` support are included.
- Run Lighthouse in Chrome DevTools after adding your real images and check the results.

## Project layout

```
api/create-checkout-session.js   Stripe server function (validates everything)
src/data/                        products.json, site.config.js, commerce.json
src/lib/                         cart, checkout call, SEO hook, countdown
src/components/                  Layout, CartDrawer, ProductCard, ProductArt, ...
src/pages/                       Home, Shop, Product, Lookbook, About, Policy, ...
public/                          favicon, og.png, robots.txt, sitemap.xml
```
