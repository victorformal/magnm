"use client"

import { useEffect, useState } from "react"

interface StickyCartBarFrProps {
  selectedPrice?: number
  originalPrice?: number
}

export function StickyCartBarFr({ selectedPrice = 59, originalPrice = 69.8 }: StickyCartBarFrProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const heroBottom = document.querySelector("[data-add-to-cart]")
    if (!heroBottom) return

    const observer = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting), {
      threshold: 0,
    })
    observer.observe(heroBottom)
    return () => observer.disconnect()
  }, [])

  const handleClick = () => {
    const addButton = document.querySelector("[data-add-to-cart]") as HTMLElement
    if (addButton) {
      addButton.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }

  return (
    <div
      className={`fixed left-0 right-0 z-[999] bg-[#2C1810] border-t border-white/10 px-4 py-3 transition-all duration-300 ${
        visible ? "bottom-0" : "-bottom-20"
      }`}
      style={{ transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}
    >
      <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-4 flex-wrap">
        {/* Info - hidden on mobile */}
        <div className="hidden sm:flex flex-col gap-0.5">
          <span className="text-sm font-medium text-[#FAF7F2]">Panneau Acoustique Flexible</span>
          <span className="text-xs text-[#FAF7F2]/60">4.9 sur 2847 avis</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-[#FAF7F2]">À partir de {selectedPrice} EUR</span>
          <span className="text-sm text-[#FAF7F2]/50 line-through">{originalPrice.toFixed(2)} EUR</span>
        </div>

        {/* CTA */}
        <button
          type="button"
          onClick={handleClick}
          className="px-6 py-2.5 bg-[#C8522A] text-white rounded-lg text-sm font-medium whitespace-nowrap hover:bg-[#A8421A] active:scale-[0.97] transition-all flex-1 sm:flex-none text-center"
        >
          Choisir mon pack
        </button>
      </div>
    </div>
  )
}
