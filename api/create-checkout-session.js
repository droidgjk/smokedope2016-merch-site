// Stripe Checkout session creator (Vercel serverless function; also works on Netlify with small changes, see README).
//
// SECURITY: the browser only sends { id, size, qty } and an optional discount code.
// Prices, stock, drop locks, shipping and discounts are ALL recomputed here from the same JSON files
// the website uses, so a customer cannot change what they pay by editing the page.
import Stripe from 'stripe'
import catalog from '../src/data/products.json' with { type: 'json' }
import commerce from '../src/data/commerce.json' with { type: 'json' }

const MAX_LINES = 20

function bad(res, status, error) {
  return res.status(status).json({ error })
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return bad(res, 405, 'Method not allowed')
  }

  const key = process.env.STRIPE_SECRET_KEY
  if (!key || key.includes('REPLACE_ME')) {
    return bad(res, 500, 'Checkout is not configured yet. Add STRIPE_SECRET_KEY in your hosting environment settings.')
  }
  const stripe = new Stripe(key)

  const body = typeof req.body === 'string' ? safeParse(req.body) : req.body
  const items = body?.items
  if (!Array.isArray(items) || items.length === 0 || items.length > MAX_LINES) {
    return bad(res, 400, 'Your cart is empty or invalid.')
  }

  const now = Date.now()
  const line_items = []
  let subtotal = 0

  for (const it of items) {
    const product = catalog.products.find((p) => p.id === it?.id)
    if (!product) return bad(res, 400, 'An item in your cart no longer exists.')
    if (product.dropAt && new Date(product.dropAt).getTime() > now) {
      return bad(res, 400, `${product.name} has not dropped yet.`)
    }
    if (product.stock <= 0) return bad(res, 400, `${product.name} is sold out.`)
    if (!product.sizes.includes(it.size)) return bad(res, 400, `Invalid size for ${product.name}.`)
    const qty = Number.isInteger(it.qty) ? it.qty : 0
    if (qty < 1 || qty > Math.min(product.stock, 10)) {
      return bad(res, 400, `Invalid quantity for ${product.name}.`)
    }

    subtotal += product.price * qty
    line_items.push({
      quantity: qty,
      price_data: {
        currency: commerce.currency,
        unit_amount: product.price,
        product_data: {
          name: product.sizes[0] === 'OS' ? product.name : `${product.name} (${it.size})`,
          metadata: { product_id: product.id, size: it.size },
        },
      },
    })
  }

  // Discount code (validated against commerce.json only)
  let discounts
  let discountAmount = 0
  const code = typeof body.code === 'string' ? body.code.trim().toUpperCase() : ''
  if (code) {
    const d = commerce.discountCodes[code]
    if (!d) return bad(res, 400, 'That discount code is not valid.')
    const coupon = await stripe.coupons.create({ percent_off: d.value, duration: 'once', name: code })
    discounts = [{ coupon: coupon.id }]
    discountAmount = Math.round((subtotal * d.value) / 100)
  }

  // Shipping: free over the threshold (measured AFTER discount), otherwise flat rate
  const shippingAmount = subtotal - discountAmount >= commerce.shipping.freeOver ? 0 : commerce.shipping.flat

  const origin = process.env.SITE_URL || req.headers.origin || `https://${req.headers.host}`

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      discounts,
      shipping_address_collection: { allowed_countries: commerce.allowedCountries },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: shippingAmount, currency: commerce.currency },
            display_name: shippingAmount === 0 ? 'Free shipping' : 'Standard shipping',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 5 },
              maximum: { unit: 'business_day', value: 14 },
            },
          },
        },
      ],
      phone_number_collection: { enabled: true },
      // Guest checkout: Stripe collects the email itself. No account needed.
      success_url: `${origin}/checkout/success`,
      cancel_url: `${origin}/checkout/cancelled`,
    })
    return res.status(200).json({ url: session.url })
  } catch (err) {
    console.error('Stripe error:', err?.message)
    return bad(res, 502, 'Could not start checkout. Please try again.')
  }
}

function safeParse(s) {
  try {
    return JSON.parse(s)
  } catch {
    return null
  }
}
