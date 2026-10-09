import { Link } from 'react-router-dom'
import { useSEO } from '../lib/seo.js'

export default function NotFound() {
  useSEO({ title: 'Page not found', description: 'That page does not exist.', path: '/404' })
  return (
    <div className="wrap py-24 sm:py-32">
      <h1 className="h-display text-7xl sm:text-9xl">404</h1>
      <p className="mt-4 text-smoke">Nothing here. It probably sold out.</p>
      <Link to="/shop" className="btn btn-solid mt-8">Back to shop</Link>
    </div>
  )
}
