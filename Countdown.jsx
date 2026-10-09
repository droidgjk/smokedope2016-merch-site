import { useCountdown } from '../lib/useCountdown.js'

const pad = (n) => String(n).padStart(2, '0')

export default function Countdown({ target, size = 'lg', doneText = 'LIVE NOW' }) {
  const { done, days, hours, minutes, seconds } = useCountdown(target)

  if (done) {
    return <p className="h-display text-4xl text-acid sm:text-6xl">{doneText}</p>
  }

  const parts = [
    ['Days', pad(days)],
    ['Hrs', pad(hours)],
    ['Min', pad(minutes)],
    ['Sec', pad(seconds)],
  ]
  const big = size === 'lg'

  return (
    <div role="timer" aria-label={`Countdown: ${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`} className="flex gap-2 sm:gap-3">
      {parts.map(([label, value]) => (
        <div key={label} className={`flex flex-col items-center border border-smoke/40 bg-coal/70 ${big ? 'min-w-[68px] px-2 py-3 sm:min-w-[96px] sm:px-4' : 'min-w-[56px] px-2 py-2'}`}>
          <span
            className={`font-display font-black leading-none tabular-nums text-bone ${big ? 'text-4xl sm:text-6xl' : 'text-3xl'}`}
            aria-hidden="true"
          >
            {value}
          </span>
          <span className="label mt-1 !text-[10px]" aria-hidden="true">{label}</span>
        </div>
      ))}
    </div>
  )
}
