import { useState } from 'react'

const ENDPOINT = import.meta.env.VITE_SIGNUP_ENDPOINT

/**
 * Drop alert signup (email or SMS).
 * PLUG IN: set VITE_SIGNUP_ENDPOINT to a URL that accepts JSON { channel, contact, source }.
 * Easy options: a Formspree/Basin endpoint, a Mailchimp/Klaviyo serverless proxy, or your own API.
 * SMS marketing needs explicit consent (the checkbox) and a provider like Postscript/Klaviyo.
 */
export default function SignupForm({ source = 'home', compact = false }) {
  const [channel, setChannel] = useState('email')
  const [contact, setContact] = useState('')
  const [consent, setConsent] = useState(false)
  const [trap, setTrap] = useState('')
  const [state, setState] = useState({ status: 'idle', message: '' })

  const valid =
    channel === 'email'
      ? /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(contact.trim())
      : /^\+?[0-9 ()-]{7,18}$/.test(contact.trim()) && consent

  async function onSubmit(e) {
    e.preventDefault()
    if (trap) return // honeypot: bots fill hidden fields
    if (!valid) {
      setState({
        status: 'error',
        message: channel === 'email' ? 'Enter a valid email address.' : 'Enter a valid phone number and tick the consent box.',
      })
      return
    }
    setState({ status: 'loading', message: '' })
    try {
      if (ENDPOINT) {
        const res = await fetch(ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ channel, contact: contact.trim(), source }),
        })
        if (!res.ok) throw new Error('bad status')
      } else {
        // Demo mode: no endpoint configured yet, nothing is sent anywhere.
        await new Promise((r) => setTimeout(r, 400))
      }
      setState({ status: 'ok', message: "You're on the list. We'll text or email you before the next drop." })
      setContact('')
    } catch {
      setState({ status: 'error', message: 'Could not sign you up right now. Try again in a minute.' })
    }
  }

  const id = `signup-${source}`

  return (
    <form onSubmit={onSubmit} noValidate className={compact ? 'space-y-3' : 'space-y-4'}>
      <div role="radiogroup" aria-label="How should we reach you?" className="flex gap-2">
        {['email', 'sms'].map((c) => (
          <button
            key={c}
            type="button"
            role="radio"
            aria-checked={channel === c}
            className="chip"
            onClick={() => {
              setChannel(c)
              setState({ status: 'idle', message: '' })
            }}
          >
            {c === 'email' ? 'Email' : 'SMS'}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor={`${id}-contact`} className="sr-only">
          {channel === 'email' ? 'Email address' : 'Phone number'}
        </label>
        <input
          id={`${id}-contact`}
          className="field"
          type={channel === 'email' ? 'email' : 'tel'}
          inputMode={channel === 'email' ? 'email' : 'tel'}
          autoComplete={channel === 'email' ? 'email' : 'tel'}
          placeholder={channel === 'email' ? 'you@email.com' : '+1 555 000 0000'}
          value={contact}
          onChange={(e) => setContact(e.target.value)}
        />
        {/* Honeypot, hidden from people */}
        <input
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute left-[-9999px] h-0 w-0 opacity-0"
          name="website"
          value={trap}
          onChange={(e) => setTrap(e.target.value)}
        />
        <button className="btn btn-solid shrink-0" disabled={state.status === 'loading'}>
          {state.status === 'loading' ? 'Sending…' : 'Notify me'}
        </button>
      </div>

      {channel === 'sms' && (
        <label htmlFor={`${id}-consent`} className="flex cursor-pointer items-start gap-3 text-[12px] text-smoke">
          <input
            id={`${id}-consent`}
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-1 h-4 w-4 accent-[rgb(var(--accent))]"
          />
          <span>I agree to receive recurring drop alerts by text. Message and data rates may apply. Reply STOP to cancel.</span>
        </label>
      )}

      <p role="status" aria-live="polite" className={`min-h-[1.25rem] text-[13px] ${state.status === 'error' ? 'text-[#ff6b6b]' : 'text-acid'}`}>
        {state.message}
      </p>
    </form>
  )
}
