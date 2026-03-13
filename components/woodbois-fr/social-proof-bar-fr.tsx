"use client"

import { useEffect, useState } from "react"
import { useInView } from "react-intersection-observer"

const PROOF_NUMBERS = [
  { value: 847, label: "clients satisfaits", suffix: "" },
  { value: 4.9, label: "note moyenne", suffix: "/5", decimals: 1 },
  { value: 12000, label: "m² installes en France", suffix: "+", prefix: "" },
  { value: 30, label: "installation moyenne", suffix: " min" },
]

function useCountUp(target: number, duration: number = 1500, inView: boolean, decimals: number = 0) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(decimals > 0 ? Number.parseFloat(start.toFixed(decimals)) : Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [inView, target, duration, decimals])

  return count
}

function CountUpNumber({
  value,
  suffix,
  prefix,
  inView,
  decimals = 0,
}: {
  value: number
  suffix: string
  prefix?: string
  inView: boolean
  decimals?: number
}) {
  const count = useCountUp(value, 1500, inView, decimals)
  const displayValue = decimals > 0 ? count.toFixed(decimals).replace(".", ",") : count.toLocaleString("fr-FR")

  return (
    <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--color-wood-dark)]">
      {prefix}
      {displayValue}
      {suffix}
    </span>
  )
}

export function SocialProofBarFr() {
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true })

  return (
    <section ref={ref} className="bg-[var(--color-cream-dark)] py-12 lg:py-16 border-y border-[var(--color-border-wood)]">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {PROOF_NUMBERS.map((item, index) => (
            <div key={index} className="text-center">
              <CountUpNumber
                value={item.value}
                suffix={item.suffix}
                prefix={item.prefix}
                inView={inView}
                decimals={item.decimals || 0}
              />
              <p className="mt-2 text-sm text-[var(--color-muted-wood)] uppercase tracking-wider">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
