"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingCart } from "lucide-react"
import { useRouter } from "next/navigation"

export function StickyCartFr() {
  const [visible, setVisible] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.getElementById("hero-section")
      const ctaSection = document.getElementById("cta-section")

      if (!heroSection) {
        setVisible(false)
        return
      }

      const heroRect = heroSection.getBoundingClientRect()
      const heroInView = heroRect.bottom > 0

      let ctaInView = false
      if (ctaSection) {
        const ctaRect = ctaSection.getBoundingClientRect()
        ctaInView = ctaRect.top < window.innerHeight && ctaRect.bottom > 0
      }

      setVisible(!heroInView && !ctaInView)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleClick = () => {
    const calculator = document.getElementById("calculator-section")
    if (calculator) {
      calculator.scrollIntoView({ behavior: "smooth", block: "start" })
    } else {
      router.push("/product/panneau-acustique-flexible-fr")
    }
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--color-wood-dark)] border-t border-white/10 px-4 py-3 lg:px-6"
        >
          <div className="container mx-auto max-w-7xl flex items-center justify-between gap-4">
            <div className="hidden sm:block">
              <p className="text-white font-medium">Panneau acoustique flexible — Chene</p>
              <p className="text-sm text-[var(--color-wood-warm)]">34,90 EUR / panneau</p>
            </div>
            <div className="sm:hidden flex-1">
              <p className="text-white text-sm font-medium">Panneau acoustique — 34,90 EUR</p>
            </div>
            <button
              type="button"
              onClick={handleClick}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--color-cta)] hover:bg-[var(--color-cta-hover)] text-white font-medium text-sm transition-colors shadow-lg whitespace-nowrap"
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Ajouter au panier</span>
              <span className="sm:hidden">Commander</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
