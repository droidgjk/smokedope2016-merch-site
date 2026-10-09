// Regenerates public/sitemap.xml and public/robots.txt from products.json.
// Usage: SITE_URL=https://your-domain.com npm run sitemap
import { readFileSync, writeFileSync } from 'node:fs'

const site = (process.env.SITE_URL || 'https://YOUR-DOMAIN.com').replace(/\/$/, '')
const { products } = JSON.parse(readFileSync(new URL('../src/data/products.json', import.meta.url)))

const pages = [
  ['/', 1.0], ['/shop', 0.9],
  ...products.map((p) => [`/product/${p.slug}`, 0.8]),
  ['/lookbook', 0.6], ['/about', 0.5],
  ['/policy/shipping', 0.3], ['/policy/refunds', 0.3], ['/policy/privacy', 0.3], ['/policy/terms', 0.3],
]
const today = new Date().toISOString().slice(0, 10)
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(([p, pr]) => `  <url><loc>${site}${p}</loc><lastmod>${today}</lastmod><priority>${pr}</priority></url>`).join('\n')}
</urlset>
`
writeFileSync(new URL('../public/sitemap.xml', import.meta.url), xml)
writeFileSync(new URL('../public/robots.txt', import.meta.url), `User-agent: *\nAllow: /\n\nSitemap: ${site}/sitemap.xml\n`)
console.log(`Wrote sitemap with ${pages.length} URLs for ${site}`)
