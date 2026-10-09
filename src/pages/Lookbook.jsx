import { LookArt } from '../components/ProductArt.jsx'
import { LOOKBOOK } from '../data/site.config.js'
import { useSEO } from '../lib/seo.js'

export default function Lookbook() {
  useSEO({
    title: 'Lookbook',
    description: 'The latest drop in the wild. Photos, close-ups and behind the scenes from the smokedope2016 merch lookbook.',
    path: '/lookbook',
  })

  return (
    <div className="wrap pt-10 sm:pt-16">
      <h1 className="h-display text-6xl sm:text-8xl">Lookbook</h1>
      <p className="mt-3 max-w-md text-smoke">Worn hard, photographed late.</p>

      {/* CSS columns = masonry without JavaScript. */}
      <ul className="mt-10 columns-2 gap-3 md:columns-3 lg:gap-4">
        {LOOKBOOK.map((item, i) => (
          <li key={i} className="mb-3 break-inside-avoid overflow-hidden border border-smoke/25 lg:mb-4">
            {item.src ? (
              <img
                src={item.src}
                alt={item.alt}
                loading={i < 2 ? 'eager' : 'lazy'}
                decoding="async"
                width="800"
                height={Math.round(800 * item.ratio)}
                className="block h-auto w-full"
              />
            ) : (
              <LookArt seed={item.seed} alt={item.alt} ratio={item.ratio} />
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
