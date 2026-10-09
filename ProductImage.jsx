import ProductArt from './ProductArt.jsx'

/**
 * Shows a real photo if products.json lists one, otherwise the generated placeholder.
 * PLUG IN: export photos as WebP (about 1200px wide, under 150KB each), put them in /public/img/
 * and list them in products.json: "images": ["/img/hoodie-front.webp", "/img/hoodie-back.webp"]
 */
export default function ProductImage({ product, index = 0, eager = false, className = '' }) {
  const src = product.images?.[index]
  if (src) {
    return (
      <img
        src={src}
        alt={`${product.name}, photo ${index + 1}`}
        width="800"
        height="1000"
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        fetchpriority={eager ? 'high' : 'auto'}
        className={`h-full w-full object-cover ${className}`}
      />
    )
  }
  return <ProductArt product={product} variant={index % 3} className={`h-full w-full ${className}`} />
}
