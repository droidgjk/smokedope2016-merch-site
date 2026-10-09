// ============================================================
//  SITE CONFIG: change brand text, drop date, links and FAQ here.
//  Anything marked  // PLUG IN  is placeholder content for you to replace.
// ============================================================
import commerce from './commerce.json'

export const SITE = {
  name: 'smokedope2016',
  storeName: 'smokedope2016 Merch',
  // PLUG IN: your real domain (also set VITE_SITE_URL in .env)
  url: (import.meta.env.VITE_SITE_URL || 'https://YOUR-DOMAIN.com').replace(/\/$/, ''),
  currency: 'USD',
  locale: 'en-US',

  // Set to false if this is the OFFICIAL store. Removes the footer notice.
  unofficial: true,

  // PLUG IN: real social profile URLs
  socials: [
    { label: 'Instagram', href: 'https://instagram.com/' },
    { label: 'TikTok', href: 'https://tiktok.com/' },
    { label: 'YouTube', href: 'https://youtube.com/' },
    { label: 'Spotify', href: 'https://open.spotify.com/' },
  ],

  contactEmail: 'support@YOUR-DOMAIN.com', // PLUG IN
}

// The hero countdown. Change `at` to your real drop time (ISO 8601, include timezone).
export const NEXT_DROP = {
  name: 'TOUR CREW JACKET',
  at: '2026-11-13T17:00:00Z',
  blurb: 'Numbered edition of 200. When it is gone, it is gone.',
  productSlug: 'tour-crew-jacket',
}

export const MARQUEE = ['NEW DROP', 'LIMITED', 'SHIPS WORLDWIDE', 'NO RESTOCKS', 'SMOKE ON']

// Discount codes and shipping rates live in commerce.json so the website and the
// checkout server read the exact same values. Edit them there.
export const DISCOUNT_CODES = commerce.discountCodes
export const SHIPPING = commerce.shipping

export const SIZE_GUIDE = {
  unit: 'cm',
  head: ['Size', 'Chest', 'Length', 'Sleeve'],
  rows: [
    ['S', '112', '68', '62'],
    ['M', '118', '70', '63'],
    ['L', '124', '72', '64'],
    ['XL', '130', '74', '65'],
    ['XXL', '136', '76', '66'],
  ],
  note: 'Measurements are flat chest width x 2. Pieces are cut boxy: if you want a normal fit, size down one.',
}

export const ABOUT = {
  // PLUG IN: replace with the real bio
  headline: 'Made for the late nights.',
  paragraphs: [
    'This is placeholder copy. Replace it with the real story: where the music comes from, why the merch exists, who makes it.',
    'Every drop is small on purpose. Heavy fabric, rough prints, no restocks. If you missed one, you missed it.',
  ],
}

export const FAQ = [
  {
    q: 'How long does shipping take?',
    a: 'Orders ship within 3 to 5 business days. US delivery usually takes 3 to 7 days after dispatch, international 7 to 14 days. You get a tracking link by email.',
  },
  {
    q: 'Do you ship worldwide?',
    a: 'Yes. Duties and import taxes are set by your country and are not included in the price.',
  },
  {
    q: 'What is your return policy?',
    a: 'Unworn items in original condition can be returned within 30 days. Limited drop items are final sale unless they arrive damaged or wrong.',
  },
  {
    q: 'How do the sizes fit?',
    a: 'Hoodies and tees are cut boxy and oversized. Size down one for a regular fit. The size guide is on every product page.',
  },
  {
    q: 'Will sold out items come back?',
    a: 'Usually not. Drops are limited. Join the drop alerts list to hear about new releases first.',
  },
  {
    q: 'My order arrived wrong or damaged.',
    a: 'Email us with your order number and a photo within 14 days and we will make it right.',
  },
]

// Lookbook tiles. If `src` is empty a generated placeholder is drawn.
// PLUG IN: add real photos to /public/img/lookbook and list them: { src: '/img/lookbook/01.webp', alt: '...', ratio: 1.25 }
export const LOOKBOOK = [
  { src: '', alt: 'Placeholder lookbook shot 1: hoodie in low light', ratio: 1.25, seed: 1 },
  { src: '', alt: 'Placeholder lookbook shot 2: close up of tee print', ratio: 0.8, seed: 2 },
  { src: '', alt: 'Placeholder lookbook shot 3: beanie portrait', ratio: 1, seed: 3 },
  { src: '', alt: 'Placeholder lookbook shot 4: jacket back panel', ratio: 1.4, seed: 4 },
  { src: '', alt: 'Placeholder lookbook shot 5: tote bag on a stairwell', ratio: 0.9, seed: 5 },
  { src: '', alt: 'Placeholder lookbook shot 6: long sleeve, street at night', ratio: 1.3, seed: 6 },
  { src: '', alt: 'Placeholder lookbook shot 7: sticker wall', ratio: 1, seed: 7 },
  { src: '', alt: 'Placeholder lookbook shot 8: poster detail', ratio: 1.15, seed: 8 },
]

export const POLICIES = {
  shipping: {
    title: 'Shipping Policy',
    body: [
      'TEMPLATE TEXT: have this reviewed for your business before launch.',
      'Orders are processed within 3 to 5 business days. Shipping costs are calculated at checkout. Orders over $100 ship free.',
      'We ship worldwide. Customers are responsible for any customs duties, import taxes and fees charged by their country.',
      'Once your order ships you will receive an email with tracking information. We are not responsible for delays caused by carriers or customs.',
    ],
  },
  refunds: {
    title: 'Refund Policy',
    body: [
      'TEMPLATE TEXT: have this reviewed for your business before launch.',
      'You can return unworn, unwashed items in original condition within 30 days of delivery for a refund to your original payment method. Return shipping is paid by the customer.',
      'Limited drop items are final sale unless they arrive damaged or incorrect. Contact us within 14 days of delivery with your order number and a photo.',
      'Refunds are issued within 7 business days of us receiving the return.',
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    body: [
      'TEMPLATE TEXT: have this reviewed for your business and your local law (GDPR, CCPA) before launch.',
      'We collect the information you give us at checkout (name, address, email) and when you join the drop list (email or phone). Payments are handled by Stripe: we never see or store your card number.',
      'We use your information to fulfil orders, send order updates and, if you opted in, announce new drops. You can unsubscribe at any time.',
      'This site stores your cart in your browser (localStorage). No tracking cookies are set by this template.',
    ],
  },
  terms: {
    title: 'Terms of Service',
    body: [
      'TEMPLATE TEXT: have this reviewed for your business before launch.',
      'By placing an order you agree to these terms. Prices are shown in USD and may change without notice. We may cancel orders that appear fraudulent or that were placed at an incorrect price.',
      'Limited quantities are available on a first come, first served basis. Placing an item in your cart does not reserve it.',
      'All artwork and designs on this site are the property of their respective owners.',
    ],
  },
}
