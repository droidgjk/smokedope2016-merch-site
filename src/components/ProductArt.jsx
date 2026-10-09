import { useId } from 'react'

/*
  PLACEHOLDER ARTWORK. Original generated graphics only: no logos, covers or photos of the artist.
  Once you have real photos, list them in products.json under "images" and this file is bypassed
  by <ProductImage /> automatically.
*/

const SHAPES = {
  tee: 'M120 70 L170 50 Q200 82 230 50 L280 70 L350 132 L310 178 L280 156 L280 442 L120 442 L120 156 L90 178 L50 132 Z',
  longsleeve:
    'M120 70 L170 50 Q200 82 230 50 L280 70 L362 332 L322 348 L281 192 L281 442 L119 442 L119 192 L78 348 L38 332 Z',
  hoodie:
    'M112 92 L165 64 L235 64 L288 92 L358 362 L316 374 L283 204 L283 452 L117 452 L117 204 L84 374 L42 362 Z',
  jacket:
    'M112 84 L165 62 L200 80 L235 62 L288 84 L358 352 L316 364 L284 202 L284 444 L116 444 L116 202 L84 364 L42 352 Z',
  beanie: 'M108 318 Q108 128 200 114 Q292 128 292 318 Z',
  tote: 'M92 176 H308 L318 446 H82 Z',
  poster: 'M104 62 H296 V438 H104 Z',
}

function Shape({ shape, tone, mark, variant }) {
  const stroke = 'rgba(233,231,223,0.22)'
  const fill = tone
  const isWear = ['tee', 'longsleeve', 'hoodie', 'jacket'].includes(shape)
  const back = variant === 1

  return (
    <g>
      {shape === 'stickers' ? (
        <g stroke={stroke} strokeWidth="2" fill={fill}>
          <circle cx="140" cy="150" r="62" />
          <rect x="215" y="100" width="110" height="80" transform="rotate(8 270 140)" />
          <path d="M90 270 L170 240 L200 320 L120 350 Z" />
          <circle cx="270" cy="300" r="50" />
          <rect x="130" y="370" width="150" height="46" transform="rotate(-5 205 393)" />
          <path d="M295 215 L345 255 L305 300 L265 250 Z" fill="rgb(var(--accent))" stroke="none" />
        </g>
      ) : (
        <path d={SHAPES[shape]} fill={fill} stroke={stroke} strokeWidth="2" strokeLinejoin="round" />
      )}

      {shape === 'hoodie' && (
        <g fill="none" stroke={stroke} strokeWidth="2">
          <path d="M162 64 Q200 14 238 64 Q200 120 162 64 Z" fill={fill} />
          <path d="M150 360 H250 L262 420 H138 Z" />
          <path d="M192 92 V140 M208 92 V140" />
        </g>
      )}
      {shape === 'beanie' && <rect x="102" y="318" width="196" height="54" fill={fill} stroke={stroke} strokeWidth="2" />}
      {shape === 'tote' && (
        <path d="M148 176 V112 Q200 46 252 112 V176" fill="none" stroke={stroke} strokeWidth="9" />
      )}
      {shape === 'jacket' && <path d="M200 80 V444" stroke={stroke} strokeWidth="2" />}

      {mark && (
        <text
          x="200"
          y={isWear ? (back ? 230 : 170) : shape === 'poster' ? 300 : shape === 'beanie' ? 350 : shape === 'tote' ? 330 : 400}
          textAnchor="middle"
          fontFamily="'Big Shoulders Display', Impact, sans-serif"
          fontWeight="900"
          fontSize={back ? 64 : isWear ? 34 : shape === 'poster' ? 60 : 30}
          letterSpacing="2"
          fill="rgb(var(--accent))"
          opacity={shape === 'stickers' ? 0 : 0.92}
        >
          {mark}
        </text>
      )}
      {isWear && back && (
        <text
          x="200"
          y="268"
          textAnchor="middle"
          fontFamily="'IBM Plex Mono', monospace"
          fontSize="11"
          letterSpacing="5"
          fill="rgba(233,231,223,0.55)"
        >
          2016 / PLACEHOLDER
        </text>
      )}
    </g>
  )
}

export default function ProductArt({ product, variant = 0, className = '' }) {
  const uid = useId().replace(/:/g, '')
  const { shape, tone, mark } = product.art
  const views = ['front view', 'back view', 'detail view']
  const detail = variant === 2

  return (
    <svg
      viewBox="0 0 400 500"
      role="img"
      aria-label={`${product.name}, ${views[variant] || 'front view'} (placeholder artwork)`}
      className={className}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <radialGradient id={`bg-${uid}`} cx="50%" cy="40%" r="75%">
          <stop offset="0%" stopColor="#262624" />
          <stop offset="100%" stopColor="#0d0d0c" />
        </radialGradient>
        <filter id={`n-${uid}`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" result="t" />
          <feColorMatrix in="t" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0" />
        </filter>
      </defs>
      <rect width="400" height="500" fill={`url(#bg-${uid})`} />
      <g transform={detail ? 'translate(-200 -150) scale(2)' : undefined}>
        <Shape shape={shape} tone={tone} mark={mark} variant={variant} />
      </g>
      <rect width="400" height="500" filter={`url(#n-${uid})`} opacity="0.12" />
    </svg>
  )
}

/** Abstract placeholder for lookbook tiles. Deterministic from `seed`. */
export function LookArt({ seed = 1, alt, ratio = 1 }) {
  const uid = useId().replace(/:/g, '')
  const r = (n) => {
    const x = Math.sin(seed * 999 + n * 78.233) * 43758.5453
    return x - Math.floor(x)
  }
  const w = 400
  const h = Math.round(400 * ratio)
  return (
    <svg viewBox={`0 0 ${w} ${h}`} role="img" aria-label={alt} className="block h-auto w-full">
      <defs>
        <linearGradient id={`g-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={`hsl(${60 + r(1) * 40} 4% ${10 + r(2) * 8}%)`} />
          <stop offset="100%" stopColor="#0b0b0a" />
        </linearGradient>
        <filter id={`b-${uid}`}>
          <feGaussianBlur stdDeviation="22" />
        </filter>
        <filter id={`n-${uid}`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={seed} />
          <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.6 0" />
        </filter>
      </defs>
      <rect width={w} height={h} fill={`url(#g-${uid})`} />
      <g filter={`url(#b-${uid})`}>
        <ellipse cx={80 + r(3) * 240} cy={h * (0.25 + r(4) * 0.5)} rx={60 + r(5) * 80} ry={50 + r(6) * 70} fill="#8a8a82" opacity="0.28" />
        <ellipse cx={80 + r(7) * 240} cy={h * (0.3 + r(8) * 0.5)} rx={40 + r(9) * 60} ry={40 + r(10) * 60} fill="rgb(var(--accent))" opacity="0.14" />
      </g>
      <rect x={40 + r(11) * 40} y={h * 0.55} width={w - 100 - r(12) * 60} height="2" fill="rgba(233,231,223,0.35)" />
      <text x="40" y={h - 28} fontFamily="'IBM Plex Mono', monospace" fontSize="11" letterSpacing="4" fill="rgba(233,231,223,0.5)">
        {`FRAME ${String(seed).padStart(2, '0')} / PLACEHOLDER`}
      </text>
      <rect width={w} height={h} filter={`url(#n-${uid})`} opacity="0.13" />
    </svg>
  )
}
