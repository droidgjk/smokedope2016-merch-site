import { useEffect } from 'react'
import { SITE } from '../data/site.config.js'

function setMeta(attr, key, value) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', value)
}

/**
 * Per-page SEO. Call once at the top of every page component.
 * Note: this runs in the browser. Google renders JS, but social crawlers (Instagram/TikTok/iMessage
 * link previews) often do NOT. For perfect link previews either prerender the pages or use Next.js.
 * See README > "SEO and link previews".
 */
export function useSEO({ title, description, path = '/', image }) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE.storeName}` : `${SITE.storeName} | Limited drops`
    const url = SITE.url + path
    const img = image || `${SITE.url}/og.png`
    document.title = fullTitle
    setMeta('name', 'description', description)
    setMeta('property', 'og:title', fullTitle)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:url', url)
    setMeta('property', 'og:image', img)
    setMeta('name', 'twitter:card', 'summary_large_image')
    setMeta('name', 'twitter:title', fullTitle)
    setMeta('name', 'twitter:description', description)
    setMeta('name', 'twitter:image', img)
    let link = document.head.querySelector('link[rel="canonical"]')
    if (!link) {
      link = document.createElement('link')
      link.setAttribute('rel', 'canonical')
      document.head.appendChild(link)
    }
    link.setAttribute('href', url)
  }, [title, description, path, image])
}
