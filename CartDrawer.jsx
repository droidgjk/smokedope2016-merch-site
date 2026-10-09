import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../lib/cart.jsx'
import { money } from '../lib/format.js'
import { SHIPPING } from '../data/site.config.js'
import { startCheckout } from '../lib/checkout.js'
import ProductImage from './ProductImage.jsx'

export default function CartDrawer() {
  const cart = useCart()
  const { open, setOpen, lines } = cart
  const closeRef = useRef(null)
  const panelRef = useRef(null)
  const lastFocus = useRef(null)
  const [codeInput, setCodeInput] = useState('')
  const [codeMsg, setCodeMsg] = useState({ ok: true, message: '' })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  // Focus handling + Escape + simple focus trap + scroll lock
  useEffect(() => {
    if (!open) return undefined
    lastFocus.current = document.activeElement
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    function onKey(e) {
      if (e.key === 'Escape') setOpen(false)
      if (e.key === 'Tab' && panelRef.current) {
        const f = panelRef.current.querySelectorAll('a[href], button:not([disabled]), input, select, [tabindex]:not([tabindex="-1"])')
        if (!f.length) return
        const first = f[0]
        const last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      lastFocus.current?.focus?.()
    }
  }, [open, setOpen])

  async function checkout() {
    setBusy(true)
    setError('')
    try {
      const { url } = await startCheckout(lines, cart.code)
      window.location.href = url
    } catch (e) {
      setError(e.message)
      setBusy(false)
    }
  }

  function submitCode(e) {
    e.preventDefault()
    const r = cart.applyCode(codeInput)
    setCodeMsg(r)
    if (r.ok) setCodeInput('')
  }

  const toFree = Math.max(0, SHIPPING.freeOver - (cart.subtotal - cart.discountAmount))

  return (
    <div className={`fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
      <div
        className={`scrim absolute inset-0 bg-black/70 ${open ? 'opacity-100' : 'opacity-0'}`}
        onClick={() => setOpen(false)}
      />
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={`drawer absolute right-0 top-0 flex h-full w-full max-w-[440px] flex-col border-l border-smoke/40 bg-ink ${open ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        {...(open ? {} : { inert: '' })}
      >
        <header className="flex items-center justify-between border-b border-smoke/30 px-5 py-4">
          <h2 className="h-display text-3xl">Cart <span className="text-acid">({cart.count})</span></h2>
          <button ref={closeRef} className="chip" onClick={() => setOpen(false)} aria-label="Close cart">
            Close
          </button>
        </header>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-start justify-center gap-4 px-5">
            <p className="h-display text-5xl text-smoke">Empty.</p>
            <p className="text-smoke">Nothing here yet. Fix that.</p>
            <Link to="/shop" className="btn btn-solid" onClick={() => setOpen(false)}>
              Shop the drop
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-smoke/20 overflow-y-auto px-5">
              {lines.map((l) => (
                <li key={`${l.id}-${l.size}`} className="flex gap-4 py-4">
                  <Link to={`/product/${l.product.slug}`} onClick={() => setOpen(false)} className="block h-24 w-20 shrink-0 overflow-hidden border border-smoke/25">
                    <ProductImage product={l.product} index={0} />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between gap-2">
                      <p className="font-display text-lg font-black uppercase leading-tight">{l.product.name}</p>
                      <p className="tabular-nums">{money(l.product.price * l.qty)}</p>
                    </div>
                    <p className="label mt-1">Size {l.size}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center border border-smoke/40">
                        <button className="h-10 w-10 hover:bg-acid hover:text-ink" aria-label={`Decrease quantity of ${l.product.name}`} onClick={() => cart.setQty(l.id, l.size, l.qty - 1)}>−</button>
                        <span className="w-8 text-center tabular-nums" aria-live="polite">{l.qty}</span>
                        <button className="h-10 w-10 hover:bg-acid hover:text-ink disabled:opacity-40" disabled={l.qty >= Math.min(l.product.stock, 10)} aria-label={`Increase quantity of ${l.product.name}`} onClick={() => cart.setQty(l.id, l.size, l.qty + 1)}>+</button>
                      </div>
                      <button className="label underline underline-offset-4 hover:text-acid" onClick={() => cart.remove(l.id, l.size)}>
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="space-y-4 border-t border-smoke/30 px-5 py-5">
              {toFree > 0 ? (
                <p className="text-[12px] text-smoke">Add {money(toFree)} more for free shipping.</p>
              ) : (
                <p className="text-[12px] text-acid">Free shipping unlocked.</p>
              )}

              <form onSubmit={submitCode} className="flex gap-2">
                <label htmlFor="discount-code" className="sr-only">Discount code</label>
                <input id="discount-code" className="field uppercase" placeholder="DISCOUNT CODE" value={codeInput} onChange={(e) => setCodeInput(e.target.value)} autoComplete="off" />
                <button className="btn shrink-0 !px-4">Apply</button>
              </form>
              <p role="status" aria-live="polite" className={`min-h-[1rem] text-[12px] ${codeMsg.ok ? 'text-acid' : 'text-[#ff6b6b]'}`}>
                {cart.discount ? (
                  <>
                    {cart.code}: {cart.discount.label}{' '}
                    <button className="underline underline-offset-4" onClick={cart.clearCode}>remove</button>
                  </>
                ) : (
                  codeMsg.message
                )}
              </p>

              <dl className="space-y-1 text-[14px]">
                <div className="flex justify-between"><dt className="text-smoke">Subtotal</dt><dd className="tabular-nums">{money(cart.subtotal)}</dd></div>
                {cart.discountAmount > 0 && (
                  <div className="flex justify-between text-acid"><dt>Discount</dt><dd className="tabular-nums">−{money(cart.discountAmount)}</dd></div>
                )}
                <div className="flex justify-between"><dt className="text-smoke">Shipping</dt><dd className="tabular-nums">{cart.shipping === 0 ? 'Free' : money(cart.shipping)}</dd></div>
                <div className="flex justify-between border-t border-smoke/30 pt-2 text-lg"><dt className="font-display font-black uppercase">Total</dt><dd className="tabular-nums">{money(cart.total)}</dd></div>
              </dl>

              <button className="btn btn-solid w-full" onClick={checkout} disabled={busy}>
                {busy ? 'Redirecting…' : 'Checkout'}
              </button>
              <p className="text-center text-[11px] text-smoke">Guest checkout. Secure payment by Stripe. Taxes and duties calculated by destination.</p>
              {error && <p role="alert" className="text-[13px] text-[#ff6b6b]">{error}</p>}
            </div>
          </>
        )}
      </aside>
    </div>
  )
}
