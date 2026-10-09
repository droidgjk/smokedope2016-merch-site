import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../lib/cart.jsx'
import { useSEO } from '../lib/seo.js'

export default function CheckoutResult({ status }) {
  const { clear, setOpen } = useCart()
  const ok = status === 'success'

  useSEO({
    title: ok ? 'Order confirmed' : 'Checkout cancelled',
    description: ok ? 'Your order is confirmed.' : 'Your checkout was cancelled. Your cart is still saved.',
    path: ok ? '/checkout/success' : '/checkout/cancelled',
  })

  useEffect(() => {
    if (ok) clear()
  }, [ok]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="wrap py-24 sm:py-32">
      <h1 className="h-display text-6xl sm:text-9xl">{ok ? <>Locked in<span className="text-acid">.</span></> : 'Cancelled.'}</h1>
      <p className="mt-6 max-w-lg text-smoke">
        {ok
          ? 'Thanks for your order. A receipt and tracking details are on their way to your email.'
          : 'No charge was made. Your cart is still saved.'}
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/shop" className="btn btn-solid">Back to shop</Link>
        {!ok && <button className="btn" onClick={() => setOpen(true)}>Open cart</button>}
      </div>
    </div>
  )
}
