export default function Marquee({ items, className = '' }) {
  const row = (
    <ul className="flex shrink-0 items-center" aria-hidden="true">
      {items.map((t, i) => (
        <li key={i} className="flex items-center whitespace-nowrap">
          <span className="px-5 font-display text-2xl font-black uppercase tracking-wide sm:text-3xl">{t}</span>
          <span className="text-xl">•</span>
        </li>
      ))}
    </ul>
  )
  return (
    <div className={`marquee border-y border-ink bg-acid py-2 text-ink ${className}`}>
      <span className="sr-only">{items.join(', ')}</span>
      <div className="marquee-track">
        {row}
        {row}
      </div>
    </div>
  )
}
