import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard.jsx'
import { CATEGORY_LABELS, PRODUCTS, money, stockState } from '../lib/format.js'
import { useSEO } from '../lib/seo.js'
import { useNow } from '../lib/useCountdown.js'

const SORTS = {
  featured: 'Featured',
  'price-asc': 'Price: low to high',
  'price-desc': 'Price: high to low',
  name: 'Name A to Z',
}

const ALL_SIZES = [...new Set(PRODUCTS.flatMap((p) => p.sizes))].sort((a, b) => {
  const order = ['S', 'M', 'L', 'XL', 'XXL']
  const ia = order.indexOf(a)
  const ib = order.indexOf(b)
  if (ia === -1 && ib === -1) return a.localeCompare(b)
  if (ia === -1) return 1
  if (ib === -1) return -1
  return ia - ib
})
const MAX_PRICE = Math.ceil(Math.max(...PRODUCTS.map((p) => p.price)) / 500) * 500
const CATEGORIES = [...new Set(PRODUCTS.map((p) => p.category))]

export default function Shop() {
  useSEO({
    title: 'Shop',
    description: 'Shop hoodies, tees, long sleeves, beanies, posters and limited drops. Small runs. Ships worldwide.',
    path: '/shop',
  })
  const now = useNow(1000)
  const [params, setParams] = useSearchParams()
  const category = params.get('c') || 'all'
  const size = params.get('size') || ''
  const sort = params.get('sort') || 'featured'
  const max = Number(params.get('max')) || MAX_PRICE
  const inStock = params.get('stock') === '1'

  function set(key, value) {
    const next = new URLSearchParams(params)
    if (value === '' || value === null || value === false) next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true })
  }

  const list = useMemo(() => {
    let out = PRODUCTS.filter(
      (p) =>
        (category === 'all' || p.category === category) &&
        (!size || p.sizes.includes(size)) &&
        p.price <= max &&
        (!inStock || stockState(p) !== 'sold-out')
    )
    if (sort === 'price-asc') out = [...out].sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') out = [...out].sort((a, b) => b.price - a.price)
    if (sort === 'name') out = [...out].sort((a, b) => a.name.localeCompare(b.name))
    return out
  }, [category, size, sort, max, inStock])

  const active = category !== 'all' || size || max !== MAX_PRICE || inStock

  return (
    <div className="wrap pt-10 sm:pt-16">
      <h1 className="h-display text-6xl sm:text-8xl">Shop</h1>

      <section aria-label="Filters" className="mt-8 grid gap-6 border-y border-smoke/30 py-6 lg:grid-cols-[1fr_auto]">
        <div className="space-y-5">
          <div>
            <p className="label mb-2">Category</p>
            <div className="flex flex-wrap gap-2">
              <button className="chip" aria-pressed={category === 'all'} onClick={() => set('c', '')}>All</button>
              {CATEGORIES.map((c) => (
                <button key={c} className="chip" aria-pressed={category === c} onClick={() => set('c', c)}>
                  {CATEGORY_LABELS[c] || c}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="label mb-2">Size</p>
            <div className="flex flex-wrap gap-2">
              <button className="chip" aria-pressed={!size} onClick={() => set('size', '')}>Any</button>
              {ALL_SIZES.map((s) => (
                <button key={s} className="chip" aria-pressed={size === s} onClick={() => set('size', s)}>{s}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-3 lg:w-[34rem]">
          <div>
            <label htmlFor="max-price" className="label mb-2 block">Max price: {money(max)}</label>
            <input
              id="max-price"
              type="range"
              min="500"
              max={MAX_PRICE}
              step="500"
              value={max}
              onChange={(e) => set('max', Number(e.target.value) === MAX_PRICE ? '' : e.target.value)}
              className="h-10 w-full"
            />
          </div>
          <div>
            <label htmlFor="sort" className="label mb-2 block">Sort</label>
            <select id="sort" className="field" value={sort} onChange={(e) => set('sort', e.target.value === 'featured' ? '' : e.target.value)}>
              {Object.entries(SORTS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div className="flex items-end">
            <label htmlFor="in-stock" className="flex min-h-[48px] cursor-pointer items-center gap-3">
              <input id="in-stock" type="checkbox" checked={inStock} onChange={(e) => set('stock', e.target.checked ? '1' : '')} className="h-5 w-5 accent-[rgb(var(--accent))]" />
              <span className="text-[13px]">In stock only</span>
            </label>
          </div>
        </div>
      </section>

      <div className="mt-4 flex items-center justify-between text-[13px] text-smoke" role="status" aria-live="polite">
        <p>{list.length} {list.length === 1 ? 'item' : 'items'}</p>
        {active && <button className="underline underline-offset-4 hover:text-acid" onClick={() => setParams({}, { replace: true })}>Clear filters</button>}
      </div>

      {list.length === 0 ? (
        <div className="py-24">
          <p className="h-display text-5xl text-smoke">Nothing matches.</p>
          <button className="btn mt-6" onClick={() => setParams({}, { replace: true })}>Clear filters</button>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-5">
          {list.map((p, i) => <ProductCard key={p.id} product={p} now={now} eager={i < 4} />)}
        </div>
      )}
    </div>
  )
}
