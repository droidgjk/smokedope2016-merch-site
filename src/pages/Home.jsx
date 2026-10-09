import { Link } from 'react-router-dom'
import Countdown from '../components/Countdown.jsx'
import Marquee from '../components/Marquee.jsx'
import ProductCard from '../components/ProductCard.jsx'
import SignupForm from '../components/SignupForm.jsx'
import { MARQUEE, NEXT_DROP, SITE } from '../data/site.config.js'
import { PRODUCTS } from '../lib/format.js'
import { useSEO } from '../lib/seo.js'
import { useNow } from '../lib/useCountdown.js'

export default function Home() {
  useSEO({
    title: '',
    description: `${SITE.storeName}: heavyweight hoodies, tees, beanies and limited drops. Small runs, no restocks. Ships worldwide.`,
    path: '/',
  })
  const now = useNow(1000)
  const featured = PRODUCTS.filter((p) => p.featured).slice(0, 4)

  return (
    <>
      {/* HERO */}
      <section className="relative isolate overflow-hidden border-b border-smoke/30" aria-labelledby="hero-title">
        <div className="smoke -left-24 top-10 h-72 w-72 bg-smoke sm:h-[28rem] sm:w-[28rem]" aria-hidden="true" />
        <div className="smoke -right-20 bottom-0 h-64 w-64 bg-acid/50 sm:h-96 sm:w-96" style={{ animationDelay: '-8s' }} aria-hidden="true" />
        <p
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-6 left-0 -z-10 select-none whitespace-nowrap font-display text-[34vw] font-black uppercase leading-none text-transparent"
          style={{ WebkitTextStroke: '1px rgba(233,231,223,0.09)' }}
        >
          2016
        </p>

        <div className="wrap flex min-h-[calc(100svh-4rem)] flex-col justify-center gap-8 py-14 sm:py-20">
          <p className="label !text-acid">● Next drop</p>

          <h1 id="hero-title" className="h-display text-[clamp(3.2rem,15vw,11rem)]">
            <span className="glitch block" data-text={NEXT_DROP.name}>{NEXT_DROP.name}</span>
          </h1>

          <p className="max-w-xl text-[15px] text-smoke sm:text-base">{NEXT_DROP.blurb}</p>

          <Countdown target={NEXT_DROP.at} />

          <div className="flex flex-wrap gap-3">
            <Link to={`/product/${NEXT_DROP.productSlug}`} className="btn btn-solid">View the drop</Link>
            <Link to="/shop" className="btn">Shop all</Link>
          </div>
        </div>
      </section>

      <Marquee items={MARQUEE} />

      {/* FEATURED */}
      <section className="wrap pt-16 sm:pt-24" aria-labelledby="featured-title">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 id="featured-title" className="h-display text-5xl sm:text-7xl">Featured</h2>
          <Link to="/shop" className="label underline underline-offset-4 hover:text-acid">See all →</Link>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-8 lg:grid-cols-4 lg:gap-x-5">
          {featured.map((p, i) => (
            <ProductCard key={p.id} product={p} now={now} eager={i < 2} />
          ))}
        </div>
      </section>

      {/* SIGNUP */}
      <section className="wrap pt-20 sm:pt-28" aria-labelledby="alerts-title">
        <div className="grid gap-8 border border-smoke/40 bg-coal p-6 sm:p-10 md:grid-cols-2">
          <div>
            <p className="label !text-acid">Don't miss it</p>
            <h2 id="alerts-title" className="h-display mt-2 text-5xl sm:text-6xl">Get the drop<br />before it's gone</h2>
            <p className="mt-4 max-w-sm text-smoke">Text or email, your pick. One message when a drop goes live. That's it.</p>
          </div>
          <div className="self-center"><SignupForm source="home" /></div>
        </div>
      </section>
    </>
  )
}
