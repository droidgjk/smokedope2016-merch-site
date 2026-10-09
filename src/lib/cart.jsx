import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from 'react'
import { DISCOUNT_CODES, SHIPPING } from '../data/site.config.js'
import { PRODUCTS, shippingFor } from './format.js'

const STORAGE_KEY = 'sd2016_cart_v1'
const CartCtx = createContext(null)

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { items: [], code: '' }
    const parsed = JSON.parse(raw)
    // Drop anything that no longer exists in products.json.
    const items = (parsed.items || []).filter((i) => PRODUCTS.some((p) => p.id === i.id))
    return { items, code: parsed.code || '' }
  } catch {
    return { items: [], code: '' }
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'add': {
      const { id, size, qty } = action
      const product = PRODUCTS.find((p) => p.id === id)
      const max = product ? Math.min(product.stock, 10) : 1
      const i = state.items.findIndex((x) => x.id === id && x.size === size)
      const items = [...state.items]
      if (i >= 0) items[i] = { ...items[i], qty: Math.min(max, items[i].qty + qty) }
      else items.push({ id, size, qty: Math.min(max, qty) })
      return { ...state, items }
    }
    case 'setQty': {
      const product = PRODUCTS.find((p) => p.id === action.id)
      const max = product ? Math.min(product.stock, 10) : 1
      const items = state.items
        .map((x) => (x.id === action.id && x.size === action.size ? { ...x, qty: Math.min(max, action.qty) } : x))
        .filter((x) => x.qty > 0)
      return { ...state, items }
    }
    case 'remove':
      return { ...state, items: state.items.filter((x) => !(x.id === action.id && x.size === action.size)) }
    case 'code':
      return { ...state, code: action.code }
    case 'clear':
      return { items: [], code: '' }
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, load)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* private mode or storage full: cart just won't persist */
    }
  }, [state])

  const add = useCallback((id, size, qty = 1) => {
    dispatch({ type: 'add', id, size, qty })
    setOpen(true)
  }, [])

  const value = useMemo(() => {
    const lines = state.items
      .map((i) => ({ ...i, product: PRODUCTS.find((p) => p.id === i.id) }))
      .filter((l) => l.product)
    const subtotal = lines.reduce((sum, l) => sum + l.product.price * l.qty, 0)
    const count = lines.reduce((n, l) => n + l.qty, 0)
    const discount = DISCOUNT_CODES[state.code.toUpperCase()]
    const discountAmount = discount ? Math.round((subtotal * discount.value) / 100) : 0
    const shipping = shippingFor(subtotal - discountAmount, SHIPPING)
    return {
      lines,
      count,
      subtotal,
      code: state.code,
      discount,
      discountAmount,
      shipping,
      total: subtotal - discountAmount + shipping,
      open,
      setOpen,
      add,
      setQty: (id, size, qty) => dispatch({ type: 'setQty', id, size, qty }),
      remove: (id, size) => dispatch({ type: 'remove', id, size }),
      applyCode: (code) => {
        const clean = code.trim().toUpperCase()
        if (!clean) return { ok: false, message: 'Enter a code.' }
        if (!DISCOUNT_CODES[clean]) return { ok: false, message: 'That code is not valid.' }
        dispatch({ type: 'code', code: clean })
        return { ok: true, message: `${DISCOUNT_CODES[clean].label} applied.` }
      },
      clearCode: () => dispatch({ type: 'code', code: '' }),
      clear: () => dispatch({ type: 'clear' }),
    }
  }, [state, open, add])

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>
}

export function useCart() {
  const ctx = useContext(CartCtx)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}
