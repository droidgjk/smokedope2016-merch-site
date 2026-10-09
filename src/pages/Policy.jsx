import { useParams } from 'react-router-dom'
import { POLICIES } from '../data/site.config.js'
import { useSEO } from '../lib/seo.js'
import NotFound from './NotFound.jsx'

export default function Policy() {
  const { key } = useParams()
  const policy = POLICIES[key]
  useSEO({
    title: policy?.title || 'Not found',
    description: policy ? `${policy.title} for the smokedope2016 merch store.` : 'Page not found.',
    path: `/policy/${key}`,
  })
  if (!policy) return <NotFound />

  return (
    <article className="wrap max-w-3xl pt-10 sm:pt-16">
      <h1 className="h-display text-5xl sm:text-7xl">{policy.title}</h1>
      <div className="mt-8 space-y-4 text-bone/90">
        {policy.body.map((p, i) => (
          <p key={i} className={i === 0 ? 'border border-acid/50 p-3 text-[13px] text-acid' : ''}>{p}</p>
        ))}
      </div>
    </article>
  )
}
