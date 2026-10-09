import { Link } from 'react-router-dom'
import ProductImage from './ProductImage.jsx'
import { isLocked, money, stockState } from '../lib/format.js'

function dropLabel(iso) {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }).toUpperCase()
}

export default function ProductCard({ product, now, eager = false }) {
  const locked = isLocked(product, now)
  const state = stockState(product)

  return (
    <Link
      to={`/product/${product.slug}`}
      className="group block focus-visible:outline-offset-4"
      aria-label={`${product.name}, ${money(product.price)}${locked ? ', locked until drop' : state === 'sold-out' ? ', sold out' : ''}`}
    >
      <div className="relative aspect-[4/5] overflow-hidden border border-smoke/25 bg-coal transition-colors group-hover:border-acid group-focus-visible:border-acid">
        <div className={`h-full w-full transition-transform duration-500 group-hover:scale-[1.04] ${state === 'sold-out' || locked ? 'opacity-60' : ''}`}>
          <ProductImage product={product} index={0} eager={eager} />
        </div>

        <div className="absolute left-2 top-2 flex flex-col items-start gap-1">
          {locked && <span className="badge text-acid">Drops {dropLabel(product.dropAt)}</span>}
          {!locked && state === 'sold-out' && <span className="badge text-bone">Sold out</span>}
          {!locked && state === 'low' && <span className="badge text-acid">Only {product.stock} left</span>}
        </div>
      </div>

      <div className="mt-3 flex items-start justify-between gap-3">
        <h3 className="glitch font-display text-xl font-black uppercase leading-tight tracking-wide" data-text={product.name}>
          {product.name}
        </h3>
        <p className="shrink-0 pt-0.5 text-[14px] tabular-nums text-bone">{money(product.price)}</p>
      </div>
    </Link>
  )
}
