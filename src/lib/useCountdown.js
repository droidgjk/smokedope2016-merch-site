import { useEffect, useState } from 'react'

/** Ticks once per second. Returns remaining parts and a `done` flag. */
export function useCountdown(targetIso) {
  const target = new Date(targetIso).getTime()
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (Number.isNaN(target) || Date.now() >= target) return undefined
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [target])

  const diff = Math.max(0, target - now)
  const s = Math.floor(diff / 1000)
  return {
    done: diff === 0,
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
    now,
  }
}

/** Re-renders at the moment a locked product unlocks, so Shop/Product update without a refresh. */
export function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])
  return now
}
