import { useState } from 'react'
import { ABOUT, FAQ, SITE } from '../data/site.config.js'
import { useSEO } from '../lib/seo.js'

const ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT

function ContactForm() {
  const [f, setF] = useState({ name: '', email: '', message: '', trap: '' })
  const [state, setState] = useState({ status: 'idle', message: '' })
  const upd = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }))

  async function submit(e) {
    e.preventDefault()
    if (f.trap) return
    if (!f.name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim()) || f.message.trim().length < 5) {
      setState({ status: 'error', message: 'Fill in your name, a valid email and a message.' })
      return
    }
    setState({ status: 'loading', message: '' })
    try {
      if (ENDPOINT) {
        const res = await fetch(ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: f.name, email: f.email, message: f.message }),
        })
        if (!res.ok) throw new Error('bad status')
      } else {
        await new Promise((r) => setTimeout(r, 400)) // demo mode
      }
      setState({ status: 'ok', message: 'Message sent. We reply within 2 business days.' })
      setF({ name: '', email: '', message: '', trap: '' })
    } catch {
      setState({ status: 'error', message: `Could not send. Email us at ${SITE.contactEmail}.` })
    }
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <div>
        <label htmlFor="c-name" className="label mb-2 block">Name</label>
        <input id="c-name" className="field" autoComplete="name" value={f.name} onChange={upd('name')} />
      </div>
      <div>
        <label htmlFor="c-email" className="label mb-2 block">Email</label>
        <input id="c-email" type="email" className="field" autoComplete="email" value={f.email} onChange={upd('email')} />
      </div>
      <div>
        <label htmlFor="c-msg" className="label mb-2 block">Message</label>
        <textarea id="c-msg" rows="5" className="field" value={f.message} onChange={upd('message')} />
      </div>
      <input tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 opacity-0" name="website" value={f.trap} onChange={upd('trap')} />
      <button className="btn btn-solid" disabled={state.status === 'loading'}>
        {state.status === 'loading' ? 'Sending…' : 'Send message'}
      </button>
      <p role="status" aria-live="polite" className={`min-h-[1.25rem] text-[13px] ${state.status === 'error' ? 'text-[#ff6b6b]' : 'text-acid'}`}>{state.message}</p>
    </form>
  )
}

export default function About() {
  useSEO({
    title: 'About and contact',
    description: 'About the smokedope2016 merch store, shipping and returns FAQ, size help and how to contact support.',
    path: '/about',
  })

  return (
    <div className="wrap pt-10 sm:pt-16">
      <h1 className="h-display text-6xl sm:text-8xl">{ABOUT.headline}</h1>
      <div className="mt-8 grid gap-10 md:grid-cols-[1.4fr_1fr]">
        <div className="max-w-prose space-y-4 text-[16px] text-bone/90">
          {ABOUT.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
        </div>
        <div>
          <p className="label mb-3">Follow</p>
          <ul className="space-y-2">
            {SITE.socials.map((s) => (
              <li key={s.label}><a className="hover:text-acid" href={s.href} target="_blank" rel="noopener noreferrer">{s.label} ↗</a></li>
            ))}
          </ul>
        </div>
      </div>

      <section id="faq" className="scroll-mt-24 pt-20" aria-labelledby="faq-title">
        <h2 id="faq-title" className="h-display text-5xl sm:text-6xl">FAQ</h2>
        <div className="mt-6 max-w-3xl border-t border-smoke/30">
          {FAQ.map((item) => (
            <details key={item.q} className="border-b border-smoke/30">
              <summary className="flex min-h-[56px] items-center justify-between gap-4 py-3">
                <span className="font-display text-xl font-black uppercase sm:text-2xl">{item.q}</span>
                <span className="plus text-2xl text-acid" aria-hidden="true">+</span>
              </summary>
              <p className="max-w-prose pb-5 text-smoke">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section id="contact" className="scroll-mt-24 pt-20" aria-labelledby="contact-title">
        <h2 id="contact-title" className="h-display text-5xl sm:text-6xl">Contact</h2>
        <div className="mt-6 grid gap-10 md:grid-cols-2">
          <ContactForm />
          <div className="text-smoke">
            <p>Order problem? Include your order number.</p>
            <p className="mt-2">Email: <span className="select-all text-bone">{SITE.contactEmail}</span></p>
          </div>
        </div>
      </section>
    </div>
  )
}
