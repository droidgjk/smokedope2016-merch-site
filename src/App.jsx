import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'

// Everything except Home is code-split so the first load stays small.
const Shop = lazy(() => import('./pages/Shop.jsx'))
const Product = lazy(() => import('./pages/Product.jsx'))
const Lookbook = lazy(() => import('./pages/Lookbook.jsx'))
const About = lazy(() => import('./pages/About.jsx'))
const Policy = lazy(() => import('./pages/Policy.jsx'))
const CheckoutResult = lazy(() => import('./pages/CheckoutResult.jsx'))
const NotFound = lazy(() => import('./pages/NotFound.jsx'))

export default function App() {
  return (
    <Suspense fallback={<div className="wrap py-32 text-smoke" role="status">Loading…</div>}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="product/:slug" element={<Product />} />
          <Route path="lookbook" element={<Lookbook />} />
          <Route path="about" element={<About />} />
          <Route path="policy/:key" element={<Policy />} />
          <Route path="checkout/success" element={<CheckoutResult status="success" />} />
          <Route path="checkout/cancelled" element={<CheckoutResult status="cancelled" />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
