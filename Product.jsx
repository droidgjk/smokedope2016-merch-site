import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Countdown from '../components/Countdown.jsx'
import ProductCard from '../components/ProductCard.jsx'
import ProductImage from '../components/ProductImage.jsx'
import SignupForm from '../components/SignupForm.jsx'
import { SHIPPING, SIZE_GUIDE, SITE } from '../data/site.config.js'
import { useCart } from '../lib/cart.jsx'
import { CATEGORY_LABELS, PRODUCTS, getProduct, isLocked, money, stockState } from '../lib/format.js'
import { useSEO } from '../lib/seo.js'
import { useNow } from '../lib/useCountdown.js'
import NotFound from './NotFound.jsx'

const VIEWS = 3 // front, back, detail. PLUG IN: match the number of photos you list in products.json

/** Hover (desktop) or tap (touch) to zoom. Zoom is also a real button for keyboard users. */
function Zoomable({ product, index }) {
  const [zoom, setZoom] = useState(false)
  const [origin, setOrigin] = useState('50% 50%')
  const ref = useRef(null)

  function track(e) {
    const r = ref.current.getBoundingClientRect()
    setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`)
  }

  return (
    <div className="relative">
      <div
        ref={ref}
        className="aspect-[4/5] overflow-hidden border border-smoke/30 bg-coal"
        style={{ cursor: zoom ? 'zoom-out' : 'zoom-in', touchAction: zoom ? 'none' : 'auto' }}
        onPointerMove={zoom ? track : undefined}
        onPointerEnter={(e) => {
          if (e.pointerType === 'mouse') {
            setZoom(true)
            track(e)
          }
        }}
        onPointerLeave={(e) => e.pointerType === 'mouse' && setZoom(false)}
        onClick={(e) => {
          if (e.pointerType !== 'mouse' && e.nativeEvent.pointerType !== 'mouse') {
            track(e)
            setZoom((z) => !z)
          }
        }}
      >
        <div className="h-full w-full transition-transform duration-200 ease-out" style={{ transform: zoom ? 'scale(2.2)' : 'scale(1)', transformOrigin: origin }}>
          <ProductImage product={product} index={index} eager />
        </div>
      </div>
      <button
        className="chip absolute bottom-3 right-3 bg-ink/90"
        aria-pressed={zoom}
        onClick={() => {
          setOrigin('50% 50%')
          setZoom((z) => !z)
        }}
      >
        {zoom ? 'Zoom out' : 'Zoom in'}
      </button>
    </div>
  )
}

function Accordion({ title, children, defaultOpen = false }) {
  return (
    <details open={defaultOpen} className="border-b border-smoke/30">
      <summary className="flex min-h-[52px] items-center justify-between py-3">
        <span className="label !text-bone">{title}</span>
        <span className="plus text-xl text-acid" aria-hidden="true">+</span>
      </summary>
      <div className="pb-5 text-[14px] text-smoke">{children}</div>
    </details>
  )
}

export default function Product() {
  const { slug } = useParams()
  const product = getProduct(slug)
  const now = useNow(1000)
  const cart = useCart()
  const [view, setView] = useState(0)
  const [size, setSize] = useState('')
  const [qty, setQty] = useState(1)
  const [showGuide, setShowGuide] = useState(false)
  const [sizeError, setSizeError] = useState(false)

  useEffect(() => {
    setView(0)
    setSize(product && product.sizes.length === 1 ? product.sizes[0] : '')
    setQty(1)
    setSizeError(false)
    setShowGuide(false)
  }, [slug]) // eslint-disable-line react-hooks/exhaustive-deps

  useSEO({
    title: product?.name || 'Not found',
    description: product ? `${product.description.slice(0, 150).trim()}${product.description.length > 150 ? '…' : ''}` : 'Product not found.',
    path: `/product/${slug}`,
  })

  // Structured data so Google can show price + availability
  useEffect(() => {
    if (!product) return undefined
    const ld = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description,
      brand: { '@type': 'Brand', name: SITE.name },
      offers: {
        '@type': 'Offer',
        priceCurrency: SITE.currency,
        price: (product.price / 100).toFixed(2),
        availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        url: `${SITE.url}/product/${product.slug}`,
      },
    }
    const el = document.createElement('script')
    el.type = 'application/ld+json'
    el.textContent = JSON.stringify(ld)
    document.head.appendChild(el)
    return () => el.remove()
  }, [product])

  if (!product) return <NotFound />

  const locked = isLocked(product, now)
  const state = stockState(product)
  const maxQty = Math.min(product.stock, 10)
  const isApparel = ['hoodies', 'tees', 'longsleeves', 'limited'].includes(product.category) && product.sizes[0] !== 'OS'
  const canBuy = !locked && state !== 'sold-out'

  const related = [
    ...PRODUCTS.filter((p) => p.id !== product.id && p.category === product.category),
    ...PRODUCTS.filter((p) => p.id !== product.id && p.category !== product.category),
  ].slice(0, 4)

  function add() {
    if (!size) {
      setSizeError(true)
      document.getElementById('size-group')?.scrollIntoView({ block: 'center', behavior: 'smooth' })
      return
    }
    cart.add(product.id, size, qty)
  }

  return (
    <div className="wrap pt-6 sm:pt-10">
      <nav aria-label="Breadcrumb" className="mb-6 text-[12px] text-smoke">
        <Link className="hover:text-acid" to="/shop">Shop</Link>
        <span aria-hidden="true"> / </span>
        <Link className="hover:text-acid" to={`/shop?c=${product.category}`}>{CATEGORY_LABELS[product.category]}</Link>
        <span aria-hidden="true"> / </span>
        <span className="text-bone">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
        {/* Gallery */}
        <div className="min-w-0">
          <Zoomable key={`${slug}-${view}`} product={product} index={view} />
          <div className="mt-3 grid grid-cols-3 gap-3" role="group" aria-label="Product views">
            {Array.from({ length: VIEWS }).map((_, i) => (
              <button
                key={i}
                aria-label={`Show view ${i + 1} of ${VIEWS}`}
                aria-pressed={view === i}
                onClick={() => setView(i)}
                className={`aspect-[4/5] overflow-hidden border ${view === i ? 'border-acid' : 'border-smoke/30 hover:border-bone'}`}
              >
                <ProductImage product={product} index={i} />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="min-w-0">
          <p className="label">{CATEGORY_LABELS[product.category]}</p>
          <h1 className="h-display mt-2 text-5xl sm:text-7xl">{product.name}</h1>
          <p className="mt-4 text-2xl tabular-nums">{money(product.price)}</p>

          <div className="mt-3 min-h-[1.5rem]" role="status" aria-live="polite">
            {!locked && state === 'low' && <p className="text-[13px] text-acid">Only {product.stock} left</p>}
            {!locked && state === 'sold-out' && <p className="text-[13px] text-[#ff6b6b]">Sold out</p>}
          </div>

          <p className="mt-4 max-w-prose text-smoke">{product.description}</p>

          {locked ? (
            <div className="mt-8 border border-acid/60 bg-coal p-5">
              <p className="label !text-acid">Locked. Drops soon</p>
              <p className="mb-4 mt-1 text-[13px] text-smoke">
                {new Date(product.dropAt).toLocaleString(undefined, { dateStyle: 'full', timeStyle: 'short' })}
              </p>
              <Countdown target={product.dropAt} size="sm" />
              <p className="label mb-3 mt-6">Get a reminder</p>
              <SignupForm source={`product-${product.slug}`} compact />
            </div>
          ) : (
            <>
              {product.sizes[0] !== 'OS' && product.sizes.length > 1 && (
                <fieldset id="size-group" className="mt-8">
                  <div className="mb-3 flex items-center justify-between">
                    <legend className="label !text-bone">Size</legend>
                    {isApparel && (
                      <button className="label underline underline-offset-4 hover:text-acid" aria-expanded={showGuide} onClick={() => setShowGuide((s) => !s)}>
                        Size guide
                      </button>
                    )}
                  </div>
                  <div role="radiogroup" aria-label="Choose a size" className="flex flex-wrap gap-2">
                    {product.sizes.map((s) => (
                      <button
                        key={s}
                        role="radio"
                        aria-checked={size === s}
                        disabled={!canBuy}
                        className="chip min-w-[56px]"
                        onClick={() => {
                          setSize(s)
                          setSizeError(false)
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  {sizeError && <p role="alert" className="mt-2 text-[13px] text-[#ff6b6b]">Pick a size first.</p>}

                  {showGuide && (
                    <div className="mt-4 overflow-x-auto border border-smoke/30 bg-coal p-4">
                      <table className="w-full min-w-[320px] text-left text-[13px]">
                        <caption className="label mb-2 text-left">Measurements in {SIZE_GUIDE.unit}</caption>
                        <thead>
                          <tr>{SIZE_GUIDE.head.map((h) => <th key={h} scope="col" className="pb-2 pr-4 font-semibold text-acid">{h}</th>)}</tr>
                        </thead>
                        <tbody>
                          {SIZE_GUIDE.rows.map((r) => (
                            <tr key={r[0]} className="border-t border-smoke/20">
                              {r.map((c, i) => <td key={i} className="py-2 pr-4 tabular-nums">{c}</td>)}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <p className="mt-3 text-[12px] text-smoke">{SIZE_GUIDE.note}</p>
                    </div>
                  )}
                </fieldset>
              )}

              <div className="mt-6 flex flex-wrap items-stretch gap-3">
                <div className="flex items-center border border-smoke/40" role="group" aria-label="Quantity">
                  <button className="h-12 w-12 hover:bg-acid hover:text-ink disabled:opacity-40" disabled={!canBuy || qty <= 1} aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
                  <span className="w-10 text-center tabular-nums" aria-live="polite">{qty}</span>
                  <button className="h-12 w-12 hover:bg-acid hover:text-ink disabled:opacity-40" disabled={!canBuy || qty >= maxQty} aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(maxQty, q + 1))}>+</button>
                </div>
                <button className="btn btn-solid min-w-[200px] flex-1" disabled={!canBuy} onClick={add}>
                  {state === 'sold-out' ? 'Sold out' : 'Add to cart'}
                </button>
              </div>
            </>
          )}

          <div className="mt-10 border-t border-smoke/30">
            <Accordion title="Details" defaultOpen>
              <ul className="list-inside list-disc space-y-1">
                {product.details.map((d) => <li key={d}>{d}</li>)}
              </ul>
            </Accordion>
            <Accordion title="Shipping">
              <p>Ships in 3 to 5 business days. {money(SHIPPING.flat)} flat rate, free over {money(SHIPPING.freeOver)}. We ship worldwide: duties and import taxes are set by your country.</p>
              <p className="mt-2"><Link className="underline underline-offset-4 hover:text-acid" to="/policy/shipping">Full shipping policy</Link></p>
            </Accordion>
            <Accordion title="Returns">
              <p>30 days for unworn items in original condition. Limited drop items are final sale unless damaged or wrong.</p>
              <p className="mt-2"><Link className="underline underline-offset-4 hover:text-acid" to="/policy/refunds">Full refund policy</Link></p>
            </Accordion>
          </div>
        </div>
      </div>

      <section className="pt-20 sm:pt-28" aria-labelledby="related-title">
        <h2 id="related-title" className="h-display mb-8 text-4xl sm:text-6xl">You may also like</h2>
        <div className="grid grid-cols-2 gap-x-3 gap-y-8 lg:grid-cols-4 lg:gap-x-5">
          {related.map((p) => <ProductCard key={p.id} product={p} now={now} />)}
        </div>
      </section>
    </div>
  )
}
