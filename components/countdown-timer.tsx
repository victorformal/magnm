"use client"

import { useState, useEffect } from "react"

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState("")

  useEffect(() => {
    const getOrSetExpiry = (): number => {
      const stored = localStorage.getItem("offer_expiry_en")
      const now = Date.now()
      if (!stored || now > parseInt(stored)) {
        const expiry = now + 24 * 60 * 60 * 1000
        localStorage.setItem("offer_expiry_en", expiry.toString())
        return expiry
      }
      return parseInt(stored)
    }

    let expiry = getOrSetExpiry()

    const interval = setInterval(() => {
      const remaining = expiry - Date.now()
      if (remaining <= 0) {
        localStorage.removeItem("offer_expiry_en")
        expiry = getOrSetExpiry()
        return
      }
      const h = Math.floor(remaining / 3600000).toString().padStart(2, "0")
      const m = Math.floor((remaining % 3600000) / 60000).toString().padStart(2, "0")
      const s = Math.floor((remaining % 60000) / 1000).toString().padStart(2, "0")
      setTimeLeft(`${h}:${m}:${s}`)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  if (!timeLeft) return null

  return (
    <div
      className="flex items-center justify-center gap-1.5 rounded-md border px-4 py-2.5 text-sm"
      style={{ background: "#FEF3C7", borderColor: "#F59E0B" }}
      role="timer"
      aria-live="polite"
      aria-label="Time remaining for offer"
    >
      <span style={{ color: "#92400E" }}>Offer expires in:</span>
      <strong
        className="font-bold tabular-nums"
        style={{ color: "#DC2626", fontSize: "1.15rem", letterSpacing: "0.03em" }}
      >
        {timeLeft}
      </strong>
    </div>
  )
}
