const ENDPOINT = import.meta.env.VITE_CHECKOUT_ENDPOINT || '/api/create-checkout-session'

/**
 * Sends ONLY ids, sizes and quantities to the server. The server looks up prices itself
 * (see api/create-checkout-session.js) so nobody can edit a price in the browser.
 * Returns { url } on success or throws an Error with a readable message.
 */
export async function startCheckout(lines, code) {
  let res
  try {
    res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: lines.map((l) => ({ id: l.id, size: l.size, qty: l.qty })),
        code: code || undefined,
      }),
    })
  } catch {
    throw new Error('Could not reach the checkout server. Check your connection and try again.')
  }

  let data = null
  try {
    data = await res.json()
  } catch {
    /* non-JSON response */
  }

  if (!res.ok || !data?.url) {
    if (res.status === 404) {
      throw new Error('Checkout is not set up yet. Deploy the /api function and add your Stripe key (see README).')
    }
    throw new Error(data?.error || 'Checkout failed. Please try again.')
  }
  return data
}
