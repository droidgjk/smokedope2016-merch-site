import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useCart } from '../lib/cart.jsx'
import { POLICIES, SITE } from '../data/site.config.js'
import CartDrawer from './CartDrawer.jsx'
import SignupForm from './SignupForm.jsx'

const NAV = [
  { to: '/shop', label: 'Shop' },
  { to: '/lookbook', label: 'Lookbook' },
  { to: '/about', label: 'About' },
]

function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) {
        el.scrollIntoView()
        return
      }
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

function Header() {
  const { count, setOpen } = useCart()
  const [menu, setMenu] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => setMenu(false), [pathname])

  const link = ({ isActive }) =>
    `font-mono text-[13px] uppercase tracking-[0.2em] ${isActive ? 'text-acid' : 'text-bone hover:text-acid'}`

  return (
    <header className="sticky top-0 z-40 border-b border-smoke/30 bg-ink/95 backdrop-blur">
      <div className="wrap flex h-16 items-center justify-between gap-4">
        <Link to="/" className="font-display text-2xl font-black uppercase tracking-wide sm:text-3xl" aria-label={`${SITE.name} home`}>
          <span className="glitch" data-text={SITE.name}>{SITE.name}</span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} className={link}>{n.label}</NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button className="chip" onClick={() => setOpen(true)} aria-label={`Open cart, ${count} items`}>
            Cart ({count})
          </button>
          <button
            className="chip md:hidden"
            aria-expanded={menu}
            aria-controls="mobile-nav"
            onClick={() => setMenu((m) => !m)}
          >
            {menu ? 'Close' : 'Menu'}
          </button>
        </div>
      </div>

      {menu && (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t border-smoke/30 bg-ink md:hidden">
          <ul className="wrap flex flex-col py-2">
            {NAV.map((n) => (
              <li key={n.to} className="border-b border-smoke/15 last:border-0">
                <NavLink to={n.to} className={({ isActive }) => `block py-4 font-display text-4xl font-black uppercase ${isActive ? 'text-acid' : ''}`}>
                  {n.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}

function Footer() {
  return (
    <footer className="mt-24 border-t border-smoke/30 bg-coal">
      <div className="wrap grid gap-12 py-14 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <p className="h-display text-4xl sm:text-5xl">Drop alerts</p>
          <p className="mb-5 mt-2 max-w-md text-smoke">Be first to know when something goes live. No spam. Unsubscribe anytime.</p>
          <SignupForm source="footer" compact />
        </div>

        <nav aria-label="Footer">
          <p className="label mb-3">Store</p>
          <ul className="space-y-2">
            <li><Link className="hover:text-acid" to="/shop">Shop</Link></li>
            <li><Link className="hover:text-acid" to="/lookbook">Lookbook</Link></li>
            <li><Link className="hover:text-acid" to="/about">About</Link></li>
            <li><Link className="hover:text-acid" to="/about#faq">FAQ</Link></li>
            <li><Link className="hover:text-acid" to="/about#contact">Contact</Link></li>
          </ul>
        </nav>

        <div>
          <p className="label mb-3">Follow</p>
          <ul className="space-y-2">
            {SITE.socials.map((s) => (
              <li key={s.label}>
                <a className="hover:text-acid" href={s.href} target="_blank" rel="noopener noreferrer">{s.label} ↗</a>
              </li>
            ))}
          </ul>
          <p className="label mb-3 mt-8">Policies</p>
          <ul className="space-y-2">
            {Object.entries(POLICIES).map(([key, p]) => (
              <li key={key}><Link className="hover:text-acid" to={`/policy/${key}`}>{p.title}</Link></li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-smoke/20">
        <div className="wrap flex flex-col gap-2 py-6 text-[12px] text-smoke sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} {SITE.storeName}. All rights reserved.</p>
          {SITE.unofficial && <p>Unofficial fan merch</p>}
        </div>
      </div>
    </footer>
  )
}

export default function Layout() {
  return (
    <>
      <a href="#main" className="sr-only-focusable fixed left-2 top-2 z-[200] bg-acid px-4 py-3 font-mono text-ink">
        Skip to content
      </a>
      <ScrollManager />
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
    </>
  )
}
