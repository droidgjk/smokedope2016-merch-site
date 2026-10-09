import { SITE } from '../data/site.config.js'
import data from '../data/products.json'

export const PRODUCTS = data.products

export function money(cents) {
  return new Intl.NumberFormat(SITE.locale, {
    style: 'currency',
    currency: SITE.currency,
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100)
}

export function getProduct(slug) {
  return PRODUCTS.find((p) => p.slug === slug)
}

/** A product is locked while its dropAt time is in the future. */
export function isLocked(product, now = Date.now()) {
  return !!product.dropAt && new Date(product.dropAt).getTime() > now
}

export function stockState(product) {
  if (product.stock <= 0) return 'sold-out'
  if (product.stock <= 5) return 'low'
  return 'in'
}

export function shippingFor(subtotalCents, shipping) {
  if (subtotalCents <= 0) return 0
  return subtotalCents >= shipping.freeOver ? 0 : shipping.flat
}

export const CATEGORY_LABELS = {
  hoodies: 'Hoodies',
  tees: 'Tees',
  longsleeves: 'Long sleeves',
  accessories: 'Accessories',
  limited: 'Limited',
}
